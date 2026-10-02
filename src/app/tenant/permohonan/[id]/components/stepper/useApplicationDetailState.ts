import { useState, useEffect, useCallback } from 'react';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { aircraftService } from '@/services/aircraftService';
import { contractService } from '@/services/contractService';
import { Asset } from '@/types/asset';
import { Aircraft } from '@/types/aircraft';
import { RentalApplication } from '@/types/rental';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const filterAssetsByType = (assets: any[], appType: string, currentAssetId?: number | null) => {
  const typeStr = (appType || '').toLowerCase();
  return assets.filter((a: any) => {
    const isAvailable = a.status === 'Available' || a.status === 'Tersedia' || (currentAssetId && a.id === currentAssetId);
    if (!isAvailable) return false;

    if (typeStr.includes('hanggar')) return a.jenis_aset.toLowerCase().includes('hanggar');
    if (typeStr.includes('apron')) return a.jenis_aset.toLowerCase().includes('apron');
    if (typeStr.includes('ruangan')) {
      const ja = a.jenis_aset.toLowerCase();
      return ja.includes('kantor') || ja.includes('office') || ja.includes('ruangan') || ja.includes('gudang');
    }
    return true;
  });
};

const getUsedAircraftInfo = (apps: any[], currentAppId: number, oldAppId: number | null) => {
  const usedIds = new Set<string>();
  const usedRegs = new Set<string>();

  (apps || []).forEach((a: any) => {
    const isCurrent = a.id === currentAppId || (oldAppId && a.id === oldAppId);
    const status = (a.status || '').trim().toLowerCase();
    const isTerminated = 
      status === 'rejected' || 
      status === 'terminated' || 
      status === 'expired' || 
      status === 'ditolak' || 
      status === 'dibatalkan' ||
      status === 'cancelled';

    if (!isCurrent && !isTerminated) {
      let spec = a.specific_needs;
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) { spec = {}; }
      }
      spec = spec || {};

      // 1. Single aircraft_id (biasa di Mini Airport)
      if (spec.aircraft_id !== undefined && spec.aircraft_id !== null && spec.aircraft_id !== '') {
        usedIds.add(spec.aircraft_id.toString());
      }

      // 2. Registration number (Mini Airport)
      if (spec.registration_number) {
        usedRegs.add(String(spec.registration_number).trim().toUpperCase());
      }

      // 3. Array of aircraft_ids (biasa di Sewa Hanggar)
      if (Array.isArray(spec.aircraft_ids)) {
        spec.aircraft_ids.forEach((id: any) => {
          if (id !== undefined && id !== null && id !== '') {
            usedIds.add(id.toString());
          }
        });
      }

      // 4. Array of aircraft_details
      if (Array.isArray(spec.aircraft_details)) {
        spec.aircraft_details.forEach((d: any) => {
          const detailId = d.aircraft_id || d.id;
          if (detailId !== undefined && detailId !== null) {
            usedIds.add(detailId.toString());
          }
          if (d.registration_number) {
            usedRegs.add(String(d.registration_number).trim().toUpperCase());
          }
        });
      }
    }
  });

  return { usedIds, usedRegs };
};

const applyRoomSpecs = (
  assets: any[],
  assetId: number | null | undefined,
  setZone: (val: string) => void,
  setType: (val: string) => void,
  setAC: (val: string) => void
) => {
  if (!assetId) return;
  const found = assets.find((a: any) => a.id === assetId);
  const spec = found?.spesifikasi_detail as any;
  if (!spec) return;

  if (spec.lokasi_zona === 'Di Dalam Terminal') setZone('dalam');
  else if (spec.lokasi_zona === 'Di Luar Terminal') setZone('luar');
  if (spec.tipe_ruangan) setType(spec.tipe_ruangan);
  if (spec.fasilitas_ac !== undefined) setAC(spec.fasilitas_ac ? 'dengan' : 'tanpa');
};

export function useApplicationDetailState(id: string) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExtension, setIsExtension] = useState(false);
  const [app, setApp] = useState<RentalApplication | null>(null);

  // States for filling details
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [tenantAircrafts, setTenantAircrafts] = useState<Aircraft[]>([]);
  const [allTenantAircrafts, setAllTenantAircrafts] = useState<Aircraft[]>([]);
  const [assetCapacity, setAssetCapacity] = useState<{ isHangar: boolean; totalArea: number; usedArea: number; remainingArea: number } | null>(null);
  
  const [formData, setFormData] = useState({
    application_type: 'Sewa Hanggar',
    asset_id: '',
    start_date: '',
    end_date: '',
  });

  const [specificNeeds, setSpecificNeeds] = useState({
    aircraft_ids: [] as string[],
    kebutuhan_ruang_pendukung: ''
  });

  // Room preference states (for Sewa Ruangan)
  const [roomZone, setRoomZone] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
  const [roomAC, setRoomAC] = useState<string>('');

  // Modal & Form state for new aircraft
  const [showAircraftModal, setShowAircraftModal] = useState(false);
  const [savingAircraft, setSavingAircraft] = useState(false);
  const [masterAircraftTypes, setMasterAircraftTypes] = useState<{id: number; jenis_pesawat: string; luas_efektif_m2: string}[]>([]);
  const [newAircraftData, setNewAircraftData] = useState({
    registrasi: '',
    tipe: '',
    customTipe: '',
    customLuas: '',
    mtow: '',
    kapasitasPenumpang: '10',
    fotoPreview: ''
  });

  const fetchAssetsAndAircrafts = useCallback(async (appType: string, currentAssetId?: number | null, oldContractParam?: any) => {
    try {
      const [assetsData, aircraftsData, appsData, typesData] = await Promise.all([
        assetService.getAssets(),
        aircraftService.getTenantAircrafts(),
        rentalService.getTenantApplications(),
        aircraftService.getMasterTypes()
      ]);

      setMasterAircraftTypes(typesData);
      setAvailableAssets(filterAssetsByType(assetsData, appType, currentAssetId));

      const typeStr = (appType || '').toLowerCase();
      if (typeStr.includes('ruangan')) {
        applyRoomSpecs(assetsData, currentAssetId, setRoomZone, setRoomType, setRoomAC);
      }
      
      const oldAppId = oldContractParam?.rental_applications?.[0]?.id || null;
      const { usedIds, usedRegs } = getUsedAircraftInfo(appsData, Number.parseInt(id, 10), oldAppId);

      setAllTenantAircrafts(aircraftsData);
      setTenantAircrafts(
        (aircraftsData || []).filter((a: any) => {
          const idStr = a.id?.toString();
          const regUpper = (a.registration_number || '').trim().toUpperCase();
          const isUsed = (idStr && usedIds.has(idStr)) || (regUpper && usedRegs.has(regUpper));
          return !isUsed;
        })
      );
    } catch (err) {
      console.error("Error fetching reference data", err);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const appData = await rentalService.getApplicationById(Number.parseInt(id, 10));
      setApp(appData);

      const extendContractId = appData.specific_needs?.extend_from_contract_id;
      let oldContract: any = null;
      if (extendContractId) {
        setIsExtension(true);
        try {
          oldContract = await contractService.getTenantContractById(extendContractId);
        } catch (e) {
          console.error("Failed to fetch old contract", e);
        }
      }

      if (appData.status === 'Surat Disetujui' || appData.status === 'Menunggu Validasi Admin') {
        fetchAssetsAndAircrafts(appData.application_type || 'Sewa Hanggar', appData.asset_id || (oldContract?.asset_id), oldContract);
      }
      
      let initAssetId = appData.asset_id?.toString() || '';
      let initStartDate = appData.start_date ? dayjs(appData.start_date).format('YYYY-MM-DD') : '';
      let initEndDate = appData.end_date ? dayjs(appData.end_date).format('YYYY-MM-DD') : '';
      let parsedSpec = appData.specific_needs;
      if (typeof parsedSpec === 'string') {
        try { parsedSpec = JSON.parse(parsedSpec); } catch (e) { parsedSpec = {}; }
      }
      parsedSpec = parsedSpec || {};

      let initAircrafts = Array.isArray(parsedSpec.aircraft_ids) ? parsedSpec.aircraft_ids : [];

      if (oldContract && appData.status === 'Surat Disetujui' && !appData.asset_id) {
        initAssetId = oldContract.asset_id?.toString() || '';
        initStartDate = oldContract.end_date ? dayjs(oldContract.end_date).add(1, 'day').format('YYYY-MM-DD') : '';
        const oldSpec = typeof oldContract.rental_applications?.[0]?.specific_needs === 'string'
          ? JSON.parse(oldContract.rental_applications[0].specific_needs)
          : oldContract.rental_applications?.[0]?.specific_needs;
        if (initAircrafts.length === 0 && oldSpec?.aircraft_ids) {
          initAircrafts = oldSpec.aircraft_ids;
        }
      }

      setFormData(prev => ({
        ...prev,
        application_type: appData.application_type || 'Sewa Hanggar',
        asset_id: initAssetId,
        start_date: initStartDate,
        end_date: initEndDate,
      }));
        
      setSpecificNeeds({
        aircraft_ids: initAircrafts,
        kebutuhan_ruang_pendukung: parsedSpec.facilities || parsedSpec.kebutuhan_ruang_pendukung || ''
      });

      if (initAssetId) {
        try {
          const capacity = await assetService.getAssetCapacity(Number.parseInt(initAssetId, 10), Number.parseInt(id, 10));
          setAssetCapacity(capacity);
        } catch (capErr) {
          console.error("Gagal memuat kapasitas aset awal:", capErr);
        }
      }

    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  }, [id, fetchAssetsAndAircrafts]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validasi input tanggal
    if (name === 'end_date' && formData.start_date) {
      if (dayjs(value).isBefore(dayjs(formData.start_date))) {
        toast.error("Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai.");
        return;
      }
    }

    if (name === 'start_date' && formData.end_date) {
      if (dayjs(value).isAfter(dayjs(formData.end_date))) {
        setFormData(prev => ({ ...prev, [name]: value, end_date: '' }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'asset_id' && value) {
      try {
        const capacity = await assetService.getAssetCapacity(Number.parseInt(value, 10), Number.parseInt(id, 10));
        setAssetCapacity(capacity);
      } catch (err) {
        console.error(err);
        setAssetCapacity(null);
      }
    }
  };

  const handleNeedsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpecificNeeds(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAircraftChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'registrasi') {
      setNewAircraftData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setNewAircraftData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAircraftData({ ...newAircraftData, fotoPreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAircraft = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const isCustom = newAircraftData.tipe === 'Lainnya';
    const finalTipe = isCustom ? newAircraftData.customTipe : newAircraftData.tipe;

    if (!newAircraftData.registrasi || !finalTipe || !newAircraftData.mtow || (isCustom && !newAircraftData.customLuas)) {
      toast.error("Mohon lengkapi Nomor Registrasi, Tipe Pesawat, Luas, dan Berat MTOW!");
      return;
    }

    try {
      setSavingAircraft(true);
      const newPesawat = await aircraftService.createTenantAircraft({
        registration_number: newAircraftData.registrasi.toUpperCase(),
        aircraft_type_id: isCustom ? undefined : Number(newAircraftData.tipe),
        custom_type_name: isCustom ? newAircraftData.customTipe : undefined,
        custom_type_area: isCustom ? newAircraftData.customLuas : undefined,
        mtow: Number(newAircraftData.mtow),
        capacity: Number(newAircraftData.kapasitasPenumpang),
        status: 'aktif',
        foto: newAircraftData.fotoPreview || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
      });
      
      setTenantAircrafts(prev => [newPesawat, ...prev]);
      setSpecificNeeds(prev => ({
        ...prev,
        aircraft_ids: [...prev.aircraft_ids, newPesawat.id!.toString()]
      }));
      
      toast.success(`Pesawat ${newPesawat.registration_number} berhasil didaftarkan!`);
      setShowAircraftModal(false);
      setNewAircraftData({ registrasi: '', tipe: '', customTipe: '', customLuas: '', mtow: '', kapasitasPenumpang: '10', fotoPreview: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pesawat');
    } finally {
      setSavingAircraft(false);
    }
  };

  const handleSubmitDetails = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const isHangarApp = formData.application_type.toLowerCase().includes('hanggar');
      
      if (isHangarApp && specificNeeds.aircraft_ids.length === 0) {
        throw new Error('Pilih minimal satu armada pesawat untuk disewa di Hanggar');
      }

      await rentalService.completeDetails(Number.parseInt(id, 10), {
        application_type: formData.application_type,
        asset_id: formData.asset_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        purpose: app?.purpose,
        specific_needs: {
          ...app?.specific_needs,
          aircraft_ids: isHangarApp ? specificNeeds.aircraft_ids : [],
          facilities: specificNeeds.kebutuhan_ruang_pendukung
        }
      });

      toast.success('Detail sewa berhasil disimpan! Menunggu validasi admin.');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan detail sewa');
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    isExtension,
    app,
    availableAssets,
    tenantAircrafts,
    allTenantAircrafts,
    assetCapacity,
    formData,
    setFormData,
    specificNeeds,
    setSpecificNeeds,
    roomZone,
    setRoomZone,
    roomType,
    setRoomType,
    roomAC,
    setRoomAC,
    showAircraftModal,
    setShowAircraftModal,
    savingAircraft,
    masterAircraftTypes,
    newAircraftData,
    fetchData,
    handleChange,
    handleNeedsChange,
    handleNewAircraftChange,
    handleFileChange,
    handleCreateAircraft,
    handleSubmitDetails,
  };
}
