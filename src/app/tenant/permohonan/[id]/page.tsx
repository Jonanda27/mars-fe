"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { aircraftService } from '@/services/aircraftService';
import { contractService } from '@/services/contractService';
import { getBaseUrl } from '@/services/api';
import { Asset } from '@/types/asset';
import { Aircraft } from '@/types/aircraft';
import { RentalApplication } from '@/types/rental';
import { Stepper } from '@/components/Stepper';
import SuratPKS from '@/components/SuratPKS';
import { FileText, Save, ArrowLeft, Loader2, Info, MapPin, Plane, AlertCircle, CheckCircle2, Plus, X, Upload, Download, PenTool, Calendar, Clock, Building2, CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

export default function TenantPermohonanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<RentalApplication | null>(null);

  // States for filling details
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [tenantAircrafts, setTenantAircrafts] = useState<Aircraft[]>([]);
  const [assetCapacity, setAssetCapacity] = useState<{ isHangar: boolean, totalArea: number, usedArea: number, remainingArea: number } | null>(null);
  
  const [formData, setFormData] = useState({
    application_type: 'Sewa Baru Hanggar',
    asset_id: '',
    start_date: '',
    end_date: '',
  });

  const [specificNeeds, setSpecificNeeds] = useState({
    aircraft_ids: [] as string[],
    kebutuhan_ruang_pendukung: ''
  });

  // Modal & Form state for new aircraft
  const [showAircraftModal, setShowAircraftModal] = useState(false);
  const [savingAircraft, setSavingAircraft] = useState(false);
  const [masterAircraftTypes, setMasterAircraftTypes] = useState<{id: number, jenis_pesawat: string, luas_efektif_m2: string}[]>([]);
  const [newAircraftData, setNewAircraftData] = useState({
    registrasi: '',
    tipe: '',
    customTipe: '',
    customLuas: '',
    mtow: '',
    kapasitasPenumpang: '10',
    fotoPreview: ''
  });

  // States for Draft Kontrak (Step 5)
  const pksTemplateRef = useRef<HTMLDivElement>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appData = await rentalService.getApplicationById(parseInt(id));
      setApp(appData);

      if (appData.status === 'Surat Disetujui' || appData.status === 'Menunggu Validasi Admin') {
        fetchAssetsAndAircrafts(appData.application_type || 'Sewa Hanggar', appData.asset_id);
      }
      
      if (appData.asset_id) {
        setFormData(prev => ({
          ...prev,
          application_type: appData.application_type || 'Sewa Baru Hanggar',
          asset_id: appData.asset_id!.toString(),
          start_date: appData.start_date ? dayjs(appData.start_date).format('YYYY-MM-DD') : '',
          end_date: appData.end_date ? dayjs(appData.end_date).format('YYYY-MM-DD') : '',
        }));
        
        if (appData.specific_needs) {
           setSpecificNeeds({
             aircraft_ids: appData.specific_needs.aircraft_ids || [],
             kebutuhan_ruang_pendukung: appData.specific_needs.facilities || ''
           });
        }
      }

    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetsAndAircrafts = async (appType: string, currentAssetId?: number | null) => {
    try {
      const [assetsData, aircraftsData, appsData, typesData] = await Promise.all([
        assetService.getAssets(),
        aircraftService.getTenantAircrafts(),
        rentalService.getTenantApplications(),
        aircraftService.getMasterTypes()
      ]);

      setMasterAircraftTypes(typesData);

      setAvailableAssets(assetsData.filter((a: any) => {
        const isAvailable = a.status === 'Available' || a.status === 'Tersedia' || (currentAssetId && a.id === currentAssetId);
        if (!isAvailable) return false;

        // Filter based on application type
        const typeStr = appType.toLowerCase();
        if (typeStr.includes('hanggar')) return a.jenis_aset.toLowerCase().includes('hanggar');
        if (typeStr.includes('apron')) return a.jenis_aset.toLowerCase().includes('apron');
        if (typeStr.includes('ruangan')) return a.jenis_aset.toLowerCase().includes('kantor') || a.jenis_aset.toLowerCase().includes('office') || a.jenis_aset.toLowerCase().includes('ruangan') || a.jenis_aset.toLowerCase().includes('gudang');
        return true;
      }));
      
      const usedAircraftIds = new Set();
      appsData.forEach((a: any) => {
        if (a.id !== parseInt(id) && a.status !== 'Rejected' && a.status !== 'Terminated' && a.status !== 'Expired') {
          const spec = a.specific_needs;
          if (spec && Array.isArray(spec.aircraft_ids)) {
            spec.aircraft_ids.forEach((i: string) => usedAircraftIds.add(i.toString()));
          }
        }
      });

      setTenantAircrafts(aircraftsData.filter((a: any) => !usedAircraftIds.has(a.id.toString())));
    } catch (err) {
      console.error("Error fetching reference data", err);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'asset_id' && value) {
      try {
        const capacity = await assetService.getAssetCapacity(parseInt(value));
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

  const handleCreateAircraft = async (e: React.FormEvent) => {
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

  const calculateRequiredArea = () => {
    let area = 0;
    specificNeeds.aircraft_ids.forEach(idStr => {
      const aircraft = tenantAircrafts.find(a => a.id.toString() === idStr);
      if (aircraft) {
        if (aircraft.custom_type_area) {
          area += parseFloat(aircraft.custom_type_area.toString());
        } else if (aircraft.aircraft_types && aircraft.aircraft_types.luas_efektif_m2) {
          area += parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
        } else if (aircraft.aircraft_type_id) {
          const masterType = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
          if (masterType && masterType.luas_efektif_m2) {
            area += parseFloat(masterType.luas_efektif_m2.toString());
          }
        }
      }
    });
    return area;
  };

  const calculateTotalMalam = () => {
    if (formData.start_date && formData.end_date) {
      const start = dayjs(formData.start_date);
      const end = dayjs(formData.end_date);
      const diff = end.diff(start, 'day');
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const isHangar = formData.application_type.toLowerCase().includes('hanggar');
      
      if (isHangar && specificNeeds.aircraft_ids.length === 0) {
        throw new Error('Pilih minimal satu armada pesawat untuk disewa di Hanggar');
      }

      await rentalService.completeDetails(parseInt(id), {
        application_type: formData.application_type,
        asset_id: formData.asset_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        purpose: app?.purpose,
        specific_needs: {
          aircraft_ids: specificNeeds.aircraft_ids,
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

  const handleDownloadDraft = async () => {
    if (!pksTemplateRef.current) return;
    try {
      setGeneratingPdf(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pksTemplateRef.current;
      const opt = {
        margin: 0,
        filename: `Draft_PKS_${app?.application_number}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
      toast.success('Draft Kontrak PKS berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF kontrak');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleUploadSignedContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPdf || !app?.contracts?.id) {
      toast.error('Pilih file PDF yang sudah ditandatangani dan pastikan kontrak tersedia');
      return;
    }
    
    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append('signature_file', selectedPdf);
      
      await contractService.uploadSignature(app.contracts.id, formData);
      toast.success('Dokumen kontrak yang sudah ditandatangani berhasil diunggah!');
      fetchData();
    } catch (err: any) {
      toast.error('Gagal mengunggah dokumen: ' + (err.message || 'Error'));
    } finally {
      setUploadingPdf(false);
      setSelectedPdf(null);
    }
  };

  const getStepNumber = (status: string) => {
    switch (status) {
      case 'Pengajuan Baru': 
      case 'Menunggu Verifikasi Kadis': 
        return 2;
      case 'Surat Disetujui': return 3;
      case 'Menunggu Validasi Admin': return 4;
      case 'Validasi Aset': return 4;
      case 'Draft Kontrak': return 5;
      case 'Disetujui': return 5;
      case 'Signed': return 6;
      case 'Aktif': return 6;
    }
    return 1;
  };

  if (loading || !app) {
    return <div className="p-10 text-center flex justify-center min-h-screen items-center"><Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" /></div>;
  }

  const resolveUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = getBaseUrl();
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const currentStep = getStepNumber(app.status);
  const isHangar = formData.application_type.toLowerCase().includes('hanggar');
  const requiredArea = calculateRequiredArea();
  const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;
  const totalMalam = calculateTotalMalam();
  const selectedAsset = availableAssets.find(a => a.id.toString() === formData.asset_id);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)]">
      <div className="mb-4">
        <Link href="/tenant/permohonan" className="inline-flex items-center text-[14px] text-[#3c8dbc] hover:text-[#367fa9] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
        </Link>
      </div>
      
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Status Permohonan <small className="text-[15px] text-[#777] ml-2 font-light">ID: {app.application_number}</small>
        </h1>
      </header>

      {/* Stepper Visualization */}
      <div className="mb-6">
        <Stepper currentStep={currentStep} />
      </div>

      {/* Step 2: Fill Details Form */}
      {app.status === 'Surat Disetujui' && (
        <form onSubmit={handleSubmitDetails} className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
          <div className="p-4 border-b border-[#f4f4f4] bg-slate-50">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center mb-1">
              <MapPin className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Lengkapi Detail Layanan Sewa
            </h3>
            <p className="text-[13px] text-slate-500 ml-7">Surat Anda telah disetujui. Silakan pilih aset dan jadwalkan penyewaan.</p>
          </div>
            
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Pemilihan Aset & Periode */}
              <div className="lg:col-span-7 space-y-6">
                <h4 className="text-[16px] font-bold text-slate-800 border-b border-slate-200 pb-2">Pemilihan Aset & Periode</h4>
                
                {/* Aset Selection */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">Objek Aset Utama yang Diminati <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-slate-500 mb-2">Pilih aset yang statusnya sedang tersedia saat ini. (Penetapan akhir akan diputuskan oleh Admin)</p>
                  <select 
                    name="asset_id" 
                    value={formData.asset_id} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] transition-all bg-white"
                  >
                    <option value="">-- Pilih Aset --</option>
                    {availableAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.kode_aset} - {asset.nama_aset} - {asset.luas || 0} m²
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacity Bar (if Hangar) */}
                {selectedAsset && assetCapacity && isHangar && (
                  <div className="bg-[#f4f8fb] border border-[#d2e3ee] rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-bold text-slate-800">Kapasitas Hanggar:</span>
                      <span className={`text-[13px] font-bold ${isOverCapacity ? 'text-red-600' : 'text-blue-600'}`}>
                        Sisa: {assetCapacity.remainingArea} m²
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden flex">
                      <div className="bg-slate-300 h-2.5" style={{ width: `${(assetCapacity.usedArea / assetCapacity.totalArea) * 100}%` }}></div>
                      <div className={`h-2.5 ${isOverCapacity ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(requiredArea / assetCapacity.totalArea) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Terpakai: {assetCapacity.usedArea + requiredArea} m²</span>
                      <span>Total: {assetCapacity.totalArea} m²</span>
                    </div>
                  </div>
                )}

                {/* Rincian Objek Sewa */}
                {selectedAsset && (
                  <div className="border border-green-500 rounded-md overflow-hidden bg-white">
                    <div className="bg-[#00a65a] text-white px-4 py-2 text-[12px] font-bold uppercase">
                      Rincian Objek Sewa
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 border-b border-green-100 pb-4 mb-4">
                        <div>
                          <h5 className="text-[13px] font-bold text-green-600 mb-2 border-b border-green-100 pb-1">Data Bandara</h5>
                          <div className="text-[12px] text-slate-700 leading-relaxed">
                            <p><strong>Nama:</strong> Bandara Mozes Kilangin</p>
                            <p><strong>Kode:</strong> TIM</p>
                            <p><strong>Lokasi:</strong> Timika, Papua Tengah</p>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-green-600 mb-2 border-b border-green-100 pb-1">Data Aset Utama</h5>
                          <div className="text-[12px] text-slate-700 leading-relaxed">
                            <p><strong>Nama Aset:</strong> {selectedAsset.nama_aset}</p>
                            <p><strong>Kapasitas:</strong> {selectedAsset.luas || 0} m²</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-[13px] font-bold text-green-600 mb-2 border-b border-green-100 pb-1">Spesifikasi Detail Hanggar</h5>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] text-slate-700">
                          <div>
                            <span className="text-slate-500 block mb-0.5">Dimensi:</span>
                            <span className="font-medium">{selectedAsset.spesifikasi_detail?.panjang_m || 0}m x {selectedAsset.spesifikasi_detail?.lebar_m || 0}m</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Fasilitas:</span>
                            <span className="font-medium">{selectedAsset.spesifikasi_detail?.fasilitas || '-'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block mb-0.5">Deskripsi:</span>
                            <span className="font-medium">{selectedAsset.spesifikasi_detail?.deskripsi || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Periode Sewa */}
                <div className="pt-2">
                  <label className="block text-[13px] font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">Periode Rencana Sewa <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Tanggal Mulai</span>
                      <input 
                        type="date" 
                        name="start_date" 
                        value={formData.start_date} 
                        onChange={handleChange} 
                        required
                        className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Tanggal Selesai</span>
                      <input 
                        type="date" 
                        name="end_date" 
                        value={formData.end_date} 
                        onChange={handleChange} 
                        required
                        className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Durasi</span>
                      <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 rounded-md text-[13px] font-bold text-slate-700 flex items-center justify-center h-[38px]">
                        {totalMalam} Malam
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Rincian Kebutuhan Spesifik */}
              <div className="lg:col-span-5 space-y-6">
                <h4 className="text-[16px] font-bold text-slate-800 border-b border-slate-200 pb-2">Rincian Kebutuhan Spesifik (Opsional)</h4>
                
                {/* Armada Pesawat */}
                {isHangar && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[13px] font-bold text-slate-800">Pilih Armada Pesawat</label>
                      <button 
                        type="button" 
                        onClick={() => setShowAircraftModal(true)}
                        className="text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded font-bold transition-colors flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Tambah Armada Baru
                      </button>
                    </div>
                    <div className="border border-slate-300 rounded-md bg-white max-h-[300px] overflow-y-auto">
                      {tenantAircrafts.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                          Tidak ada armada pesawat tersedia. Silakan klik "Tambah Armada Baru".
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {tenantAircrafts.map(aircraft => {
                            const isSelected = specificNeeds.aircraft_ids.includes(aircraft.id.toString());
                            let aircraftArea = 0;
                            if (aircraft.custom_type_area) {
                              aircraftArea = parseFloat(aircraft.custom_type_area.toString());
                            } else if (aircraft.aircraft_types?.luas_efektif_m2) {
                              aircraftArea = parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
                            } else if (aircraft.aircraft_type_id) {
                              const masterType = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
                              if (masterType?.luas_efektif_m2) {
                                aircraftArea = parseFloat(masterType.luas_efektif_m2.toString());
                              }
                            }
                            const typeName = aircraft.custom_type_name || aircraft.aircraft_types?.jenis_pesawat || masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id)?.jenis_pesawat || 'Tipe Tidak Diketahui';

                            return (
                              <label key={aircraft.id} className={`flex items-start p-3 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                                <div className="pt-0.5 flex-shrink-0 mr-3">
                                  <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const ids = [...specificNeeds.aircraft_ids];
                                      if (e.target.checked) {
                                        ids.push(aircraft.id.toString());
                                      } else {
                                        const index = ids.indexOf(aircraft.id.toString());
                                        if (index > -1) ids.splice(index, 1);
                                      }
                                      setSpecificNeeds(prev => ({ ...prev, aircraft_ids: ids }));
                                    }}
                                    className="w-4 h-4 text-[#3c8dbc] border-slate-300 rounded focus:ring-[#3c8dbc]"
                                  />
                                </div>
                                <div className="flex-1">
                                  <span className="block text-[13px] font-bold text-slate-800 leading-none mb-1">{aircraft.registration_number}</span>
                                  <span className="block text-[11px] text-slate-500">
                                    {typeName} - MTOW: {aircraft.mtow || 0} Kg - Luas: {aircraftArea} m²
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kebutuhan Ruang */}
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-2">Kebutuhan Ruang Pendukung Khusus</label>
                  <textarea 
                    name="kebutuhan_ruang_pendukung"
                    value={specificNeeds.kebutuhan_ruang_pendukung}
                    onChange={handleNeedsChange}
                    placeholder="Misal: Membutuhkan apron connection luas, ruang office, atau daya listrik besar..."
                    className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] transition-all bg-white min-h-[120px] resize-y"
                  />
                </div>
                
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 mt-6">
              {isHangar && specificNeeds.aircraft_ids.length === 0 && (
                <div className="flex justify-end mb-4">
                  <div className="flex items-center text-red-600 bg-red-50 px-4 py-2.5 rounded-md border border-red-200 shadow-sm max-w-lg">
                    <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium leading-tight">
                      Anda wajib menambahkan dan mencentang minimal 1 armada pesawat untuk menyewa fasilitas Hanggar.
                    </p>
                  </div>
                </div>
              )}
              {isHangar && isOverCapacity && specificNeeds.aircraft_ids.length > 0 && (
                <div className="flex justify-end mb-4">
                  <div className="flex items-center text-red-600 bg-red-50 px-4 py-2.5 rounded-md border border-red-200 shadow-sm max-w-lg">
                    <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                    <p className="text-[13px] font-medium leading-tight">
                      Total luas armada pesawat yang dipilih melebihi sisa kapasitas Hanggar yang tersedia.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving || (isHangar && isOverCapacity) || (isHangar && specificNeeds.aircraft_ids.length === 0)}
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-2 px-8 rounded-sm text-[14px] font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Detail Layanan
                </button>
              </div>
            </div>
          </div>
          </form>
        )}
        
        {/* Waiting for Admin Validation State */}
        {app.status === 'Menunggu Validasi Admin' && (
          <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg mb-8 overflow-hidden">
            
            {/* Hero / Banner Section */}
            <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <FileText className="w-64 h-64 text-[#3c8dbc]" />
              </div>
              
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
                  <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
                </div>
                <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
              </div>
              
              <div className="text-center md:text-left flex-1 z-10 mt-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
                  Status Saat Ini
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Menunggu Validasi Kapasitas</h2>
                <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
                  Formulir detail layanan penyewaan yang Anda ajukan telah kami terima dengan baik. Saat ini, Tim Admin sedang mencocokkan luas dimensi pesawat Anda dengan ketersediaan ruang di aset terkait. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
                </p>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="p-8 md:p-12 bg-white">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  Rangkuman Pengajuan Layanan
                </h3>
                <span className="text-xs font-bold text-slate-400">ID: {app.application_number}</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal</p>
                     <p className="text-[14px] text-slate-800 font-medium">{app.purpose || '-'}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aset Terpilih</p>
                       <p className="text-[14px] text-[#3c8dbc] font-bold">{app.assets?.nama_aset}</p>
                       <p className="text-xs text-slate-500 mt-0.5">{app.assets?.kode_aset}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periode Sewa</p>
                       <p className="text-[14px] text-slate-800 font-medium">
                         {app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-'}
                         <span className="mx-2 text-slate-400">→</span>
                         {app.end_date ? dayjs(app.end_date).format('DD MMM YYYY') : '-'}
                       </p>
                       {app.start_date && app.end_date && (
                         <p className="text-[12px] text-slate-500 mt-0.5">
                           Durasi: <span className="font-bold text-[#3c8dbc]">{dayjs(app.end_date).diff(dayjs(app.start_date), 'day')} Malam</span>
                         </p>
                       )}
                    </div>
                  </div>
                  
                  {app.specific_needs?.facilities && (
                    <div className="bg-[#f4f8fb] border border-[#d2e3ee] p-4 rounded-md">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kebutuhan Ruang Khusus</p>
                      <p className="text-[13px] text-slate-700 leading-relaxed italic">"{app.specific_needs.facilities}"</p>
                    </div>
                  )}
                </div>

                {app.application_type?.toLowerCase().includes('hanggar') && app.specific_needs?.aircraft_ids && (
                  <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Daftar Armada Pesawat Diajukan</p>
                     <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                       <ul className="divide-y divide-slate-100">
                         {app.specific_needs.aircraft_ids.map((idStr: string) => {
                            const aircraft = tenantAircrafts.find(a => a.id.toString() === idStr);
                            if (!aircraft) return <li key={idStr} className="p-3 text-sm text-slate-500">ID Pesawat: {idStr}</li>;
                            
                            let aircraftArea = 0;
                            if (aircraft.custom_type_area) {
                              aircraftArea = parseFloat(aircraft.custom_type_area.toString());
                            } else if (aircraft.aircraft_types?.luas_efektif_m2) {
                              aircraftArea = parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
                            } else if (aircraft.aircraft_type_id) {
                              const masterType = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
                              if (masterType?.luas_efektif_m2) {
                                aircraftArea = parseFloat(masterType.luas_efektif_m2.toString());
                              }
                            }
                            const typeName = aircraft.custom_type_name || aircraft.aircraft_types?.jenis_pesawat || masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id)?.jenis_pesawat || 'Tipe Tidak Diketahui';
                            
                            return (
                              <li key={idStr} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center mb-2 sm:mb-0">
                                  <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100">
                                    <Plane className="w-5 h-5 text-indigo-500" />
                                  </div>
                                  <div>
                                    <span className="block text-[14px] font-bold text-slate-800 leading-none mb-1">{aircraft.registration_number}</span> 
                                    <span className="text-slate-500 text-[11px] font-medium">{typeName}</span>
                                  </div>
                                </div>
                                <div className="flex gap-4 sm:text-right pl-13 sm:pl-0">
                                  <div>
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">MTOW</span>
                                    <span className="text-[13px] font-medium text-slate-700">{aircraft.mtow || 0} Kg</span>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Luas</span>
                                    <span className="text-[13px] font-medium text-slate-700">{aircraftArea} m²</span>
                                  </div>
                                </div>
                              </li>
                            );
                         })}
                       </ul>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Step 5: Draft Kontrak */}
        {(app.status === 'Draft Kontrak' || app.status === 'Disetujui') && (
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
            <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-[16px] text-[#444] font-bold flex items-center mb-1">
                  <PenTool className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Draft Perjanjian Kerja Sama (PKS)
                </h3>
                <p className="text-[13px] text-slate-500 ml-7">
                  {app.contracts?.signed_document_url 
                    ? 'Dokumen PKS Anda telah berhasil diunggah. Menunggu verifikasi dari Admin.'
                    : 'Admin telah menyetujui permohonan Anda. Silakan unduh, cetak, tanda tangani (dengan materai), lalu unggah kembali draft PKS ini.'}
                </p>
              </div>
              {app.contracts?.signed_document_url && (
                <div className="bg-amber-500 px-3 py-1.5 rounded-sm text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menunggu Verifikasi
                </div>
              )}
            </div>
            
            <div className="p-6 md:p-8">
              {app.contracts?.signed_document_url ? (
                /* === STATE: Sudah Upload — Menunggu Verifikasi === */
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-bold text-slate-800 mb-1">Dokumen PKS Berhasil Diunggah</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed">
                        Dokumen Perjanjian Kerja Sama (PKS) yang telah Anda tandatangani sudah diterima oleh sistem. 
                        Saat ini dokumen Anda sedang dalam proses <strong>verifikasi oleh Admin</strong>. 
                        Anda akan mendapatkan notifikasi ketika proses verifikasi selesai.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[12px] font-semibold text-blue-700">Diunggah</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-amber-300 rounded-full" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <span className="text-[12px] font-semibold text-amber-600">Verifikasi Admin</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-400">Selesai</span>
                    </div>
                  </div>

                  {/* Uploaded PDF Preview */}
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#3c8dbc]" />
                      Dokumen PKS yang Anda Unggah
                    </h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                      <iframe
                        src={resolveUrl(app.contracts.signed_document_url)}
                        className="w-full h-[700px]"
                        title="Dokumen PKS Tertandatangani"
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <a 
                        href={resolveUrl(app.contracts.signed_document_url)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded flex items-center transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Buka di Tab Baru
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* === STATE: Belum Upload — Form Upload + Draft Preview === */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left side: Upload Form */}
                  <div className="lg:col-span-4 lg:order-1 order-2">
                    <h4 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Unggah Dokumen PKS yang Telah Ditandatangani</h4>
                    
                    <form onSubmit={handleUploadSignedContract} className="space-y-4">
                      {!selectedPdf ? (
                        <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg px-6 py-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-blue-400 transition-all relative group cursor-pointer">
                          <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setSelectedPdf(e.target.files ? e.target.files[0] : null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required
                          />
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-800 mb-1">Pilih File PDF PKS</p>
                          <p className="text-[12px] text-slate-500 mb-4">Pastikan file sudah ditandatangani dan dibubuhi materai yang berlaku.</p>
                          <div className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-md text-[13px] font-semibold text-blue-700 shadow-sm pointer-events-none group-hover:bg-blue-100 transition-colors">
                            Cari File...
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-blue-400 bg-blue-50/50 rounded-lg px-6 py-8 flex flex-col items-center justify-center text-center transition-all shadow-sm">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 transform transition-transform hover:scale-105">
                            <FileText className="w-6 h-6" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-800 truncate w-full px-2 mb-1" title={selectedPdf.name}>
                            {selectedPdf.name}
                          </p>
                          <p className="text-[12px] text-blue-600 font-semibold mb-4">File siap diunggah</p>
                          <button 
                            type="button"
                            onClick={() => setSelectedPdf(null)}
                            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-md text-[13px] font-semibold transition-colors shadow-sm text-slate-600"
                          >
                            Ganti File
                          </button>
                        </div>
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={uploadingPdf || !selectedPdf}
                        className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-3 px-4 rounded-md font-bold flex justify-center items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                      >
                        {uploadingPdf ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                        Unggah PKS
                      </button>
                    </form>
                    
                    <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                      <h5 className="text-sm font-bold text-yellow-800 flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 mr-1.5" /> Panduan Penandatanganan
                      </h5>
                      <ul className="text-xs text-yellow-700 space-y-1.5 list-disc list-inside">
                        <li>Gunakan kertas berukuran A4 untuk mencetak.</li>
                        <li>Tempelkan materai Rp 10.000 pada kolom tanda tangan PIHAK KEDUA.</li>
                        <li>Tanda tangan harus mengenai materai dan kertas.</li>
                        <li>Scan dokumen dengan resolusi yang jelas (warna) dan simpan dalam format PDF.</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Right side: Preview & Download */}
                  <div className="lg:col-span-8 lg:order-2 order-1">
                    <h4 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 flex justify-between items-center">
                      Pratinjau Draft PKS
                      <button 
                        onClick={handleDownloadDraft}
                        disabled={generatingPdf}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded flex items-center transition-colors shadow-sm disabled:opacity-70"
                      >
                        {generatingPdf ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Download className="w-3 h-3 mr-1.5" />}
                        Unduh PDF
                      </button>
                    </h4>
                    
                    <div className="border border-slate-200 rounded-md bg-slate-100 p-2 overflow-hidden h-[700px] relative">
                      <div className="absolute inset-0 overflow-y-auto p-4 flex justify-center">
                        <div className="transform scale-[0.85] origin-top bg-white shadow-md border border-slate-200 transition-transform">
                          {app.contracts && <SuratPKS 
                            ref={pksTemplateRef}
                            contract={{
                              ...app.contracts,
                              tenants: app.tenants,
                              assets: app.assets
                            } as any}
                          />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Selesai / Kontrak Aktif */}
        {(app.status === 'Signed' || app.status === 'Aktif') && (
          <div className="space-y-6 mb-8">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                <CheckCircle2 className="w-64 h-64 text-emerald-900" />
              </div>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex-1 text-center sm:text-left z-10">
                <h3 className="text-[22px] font-bold text-slate-800 mb-2">Selamat! Kontrak Sewa Anda Telah Aktif</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed max-w-2xl">
                  Proses pengajuan permohonan sewa dan verifikasi kontrak PKS telah berhasil diselesaikan. 
                  Anda kini resmi dapat memanfaatkan fasilitas sesuai dengan periode yang telah disepakati.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-slate-200 flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">No. Kontrak</span>
                    <span className="text-[13px] font-bold text-slate-800">{app.contracts?.contract_number || '-'}</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-slate-200 flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Status</span>
                    <span className="text-[13px] font-bold text-emerald-600 uppercase">AKTIF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Details (Takes up 2 cols on lg) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Rincian Kontrak */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#3c8dbc]" />
                    <h4 className="text-[16px] font-bold text-slate-800">Rincian Sewa Fasilitas</h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tujuan / Perihal</p>
                        <p className="text-[14px] font-semibold text-slate-800">{app.purpose || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tipe Layanan</p>
                        <p className="text-[14px] font-semibold text-slate-800">{app.application_type || '-'}</p>
                      </div>
                      
                      {app.asset_id && (
                        <>
                          <div className="sm:col-span-2">
                            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Aset yang Disewa</p>
                            <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 flex items-start gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-[14px] font-bold text-slate-800">{app.assets?.nama_aset}</p>
                                <p className="text-[12px] text-slate-500">Kode: {app.assets?.kode_aset} • Tipe: {app.assets?.jenis_aset}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Mulai Berlaku</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <p className="text-[14px] font-semibold text-slate-800">{dayjs(app.start_date).format('DD MMMM YYYY')}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">Berakhir Pada</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <p className="text-[14px] font-semibold text-slate-800">{dayjs(app.end_date).format('DD MMMM YYYY')}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document View */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#3c8dbc]" />
                      <h4 className="text-[16px] font-bold text-slate-800">Dokumen Perjanjian Final</h4>
                    </div>
                    {app.contracts?.signed_document_url && (
                      <a 
                        href={resolveUrl(app.contracts.signed_document_url)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[12px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Penuh
                      </a>
                    )}
                  </div>
                  <div className="p-0 bg-slate-100">
                    {app.contracts?.signed_document_url ? (
                      <iframe
                        src={resolveUrl(app.contracts.signed_document_url)}
                        className="w-full h-[500px] border-0"
                        title="Dokumen PKS Final"
                      />
                    ) : (
                      <div className="p-10 text-center flex flex-col items-center">
                        <FileText className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">Dokumen tidak tersedia</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Billing & Actions (Takes up 1 col on lg) */}
              <div className="space-y-6">
                
                {/* Billing Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#3c8dbc]" />
                    <h4 className="text-[16px] font-bold text-slate-800">Informasi Tagihan</h4>
                  </div>
                  <div className="p-5">
                    {app.contracts?.total_amount ? (
                      <div>
                        <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">Nilai Sewa Keseluruhan</p>
                        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 mb-4">
                          <p className="text-[24px] font-bold text-slate-800 text-center tracking-tight">
                            {formatRupiah(Number(app.contracts.total_amount))}
                          </p>
                        </div>
                        <div className="text-[13px] text-slate-600 bg-blue-50/50 border border-blue-100 p-3 rounded-md flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p>
                            Pembayaran akan ditagihkan sesuai dengan ketentuan <em>invoice</em> berkala yang akan diterbitkan oleh UPBU secara terpisah.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-[13px] text-slate-500">Belum ada data tagihan</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps / Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-indigo-100/50">
                    <h4 className="text-[15px] font-bold text-indigo-900">Langkah Selanjutnya</h4>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">1</div>
                        <div>
                          <p className="text-[13px] font-bold text-indigo-900 mb-0.5">Tunggu Penagihan (Invoice)</p>
                          <p className="text-[12px] text-indigo-700/80 leading-relaxed">Admin / Bendahara akan menerbitkan tagihan secara berkala. Anda dapat memantaunya di menu Keuangan/Tagihan.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 text-[12px] font-bold">2</div>
                        <div>
                          <p className="text-[13px] font-bold text-indigo-900 mb-0.5">Mulai Pemanfaatan</p>
                          <p className="text-[12px] text-indigo-700/80 leading-relaxed">Fasilitas dapat mulai digunakan sesuai dengan tanggal mulai periode berlaku yang disepakati.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Card (Only show if not in form step and not in waiting step and not in final step) */}
        {app.status !== 'Surat Disetujui' && app.status !== 'Menunggu Validasi Admin' && app.status !== 'Draft Kontrak' && app.status !== 'Disetujui' && app.status !== 'Signed' && app.status !== 'Aktif' && (
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
             <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
               <h3 className="text-[16px] text-[#444] font-bold">Informasi Dasar</h3>
               <div className="bg-[#3c8dbc] px-3 py-1 rounded-sm text-[12px] font-bold text-white uppercase tracking-wide">
                 {app.status}
               </div>
             </div>
             <div className="p-6 md:p-8 space-y-8">
               {/* Text Information Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div>
                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal</p>
                   <p className="text-slate-800 font-medium">{app.purpose || '-'}</p>
                 </div>
                 {app.asset_id && (
                   <>
                     <div>
                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Aset Dipilih</p>
                       <p className="text-slate-800 font-medium">{app.assets?.nama_aset} ({app.assets?.kode_aset})</p>
                     </div>
                     <div>
                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Periode Sewa</p>
                       <p className="text-slate-800 font-medium">{dayjs(app.start_date).format('DD MMM YYYY')} s/d {dayjs(app.end_date).format('DD MMM YYYY')}</p>
                     </div>
                   </>
                 )}
               </div>
  
               {/* Full Width Document Viewer */}
               <div className="border-t border-slate-200 pt-8 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                        <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                        Dokumen Surat Permohonan Resmi
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Pratinjau berkas yang diajukan ke Kepala Dinas</p>
                    </div>
                    {app.official_letter_url && (
                      <a href={resolveUrl(app.official_letter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors border border-slate-300">
                        Buka di Tab Baru
                      </a>
                    )}
                  </div>
                  
                  {app.official_letter_url ? (
                    <div className="bg-slate-200 p-2 md:p-3 rounded-lg shadow-inner border border-slate-300">
                      <object 
                        data={resolveUrl(app.official_letter_url)} 
                        type="application/pdf" 
                        className="w-full h-[600px] md:h-[800px] rounded-md bg-white border border-slate-300 shadow-sm"
                      >
                        <div className="flex flex-col items-center justify-center h-full p-10 bg-slate-50 rounded-md border border-slate-200">
                          <FileText className="w-16 h-16 text-slate-300 mb-4" />
                          <p className="text-sm text-slate-500 text-center max-w-md">
                            Browser Anda tidak mendukung pratinjau PDF interaktif. Klik tombol di bawah ini untuk mengunduh dan membaca surat permohonan Anda.
                          </p>
                          <a href={resolveUrl(app.official_letter_url)} className="mt-6 bg-[#3c8dbc] text-white px-6 py-2.5 rounded shadow-sm font-medium hover:bg-[#367fa9] transition-colors flex items-center">
                            Unduh PDF Sekarang
                          </a>
                        </div>
                      </object>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50">
                      <FileText className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium">- Belum ada dokumen terunggah -</p>
                    </div>
                  )}
               </div>
           </div>
        </div>
        )}

        {/* Modal Tambah Pesawat */}
        {showAircraftModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
                <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
                  <Plane className="w-5 h-5 mr-2 text-indigo-600" />
                  Tambah Armada Pesawat
                </h3>
                <button 
                  onClick={() => setShowAircraftModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="add-aircraft-form" onSubmit={handleCreateAircraft} className="flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column: Image Upload */}
                  <div className="w-full md:w-1/3 flex flex-col">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Foto Pesawat (Opsional)</label>
                    <label className="flex-1 min-h-[200px] border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center overflow-hidden relative group">
                      {newAircraftData.fotoPreview ? (
                        <>
                          <img src={newAircraftData.fotoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white mb-1" />
                            <span className="text-white text-xs font-medium">Ubah Gambar</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <span className="text-sm text-slate-600 font-medium block mb-1">Unggah Gambar</span>
                          <span className="text-xs text-slate-400">Klik untuk memilih</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Right Column: Form Fields */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">No. Registrasi <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="registrasi" 
                          value={newAircraftData.registrasi} 
                          onChange={handleNewAircraftChange} 
                          placeholder="Contoh: PK-XYZ"
                          className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm uppercase"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tipe Pesawat <span className="text-red-500">*</span></label>
                        <select 
                          name="tipe" 
                          value={newAircraftData.tipe} 
                          onChange={handleNewAircraftChange} 
                          className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                          required
                        >
                          <option value="">-- Pilih Tipe --</option>
                          {masterAircraftTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.jenis_pesawat} (Luas: {t.luas_efektif_m2}m²)</option>
                          ))}
                          <option value="Lainnya">Lainnya (Input Manual)</option>
                        </select>
                      </div>
                    </div>

                    {newAircraftData.tipe === 'Lainnya' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 border border-orange-100 rounded-md">
                        <div>
                          <label className="block text-sm font-bold text-orange-900 mb-1">Tipe Custom <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="customTipe" 
                            value={newAircraftData.customTipe} 
                            onChange={handleNewAircraftChange} 
                            placeholder="Misal: Boeing 737"
                            className="w-full border border-orange-300 px-3 py-2 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-orange-900 mb-1">Luas (m²) <span className="text-red-500">*</span></label>
                          <input 
                            type="number" 
                            name="customLuas" 
                            value={newAircraftData.customLuas} 
                            onChange={handleNewAircraftChange} 
                            placeholder="Contoh: 150"
                            className="w-full border border-orange-300 px-3 py-2 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
                            required 
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">MTOW (Kg) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          name="mtow" 
                          value={newAircraftData.mtow} 
                          onChange={handleNewAircraftChange} 
                          placeholder="Contoh: 5000"
                          className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kapasitas Penumpang</label>
                        <input 
                          type="number" 
                          name="kapasitasPenumpang" 
                          value={newAircraftData.kapasitasPenumpang} 
                          onChange={handleNewAircraftChange} 
                          placeholder="Contoh: 10"
                          className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100 flex items-start mt-2">
                      <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      <p>Setelah pesawat disimpan, pesawat akan otomatis tercentang dalam formulir penyewaan Anda.</p>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAircraftModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  form="add-aircraft-form"
                  disabled={savingAircraft}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-70"
                >
                  {savingAircraft ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Armada
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
