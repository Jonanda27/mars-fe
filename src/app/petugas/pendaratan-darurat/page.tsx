"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, Camera, CheckCircle2, RotateCcw, 
  Loader2, Plane, User, Phone, Mail, FileText, Info, 
  Building2, MapPin, Check, AlertCircle, ShieldAlert,
  ArrowRight, RefreshCw, Eye, LogOut, ChevronDown, ChevronUp,
  Clock, CheckSquare
} from 'lucide-react';
import { assetService } from '@/services/assetService';
import { logService } from '@/services/logService';
import { contractService } from '@/services/contractService';
import { aircraftService } from '@/services/aircraftService';
import { Asset } from '@/types/asset';
import { Contract } from '@/types/contract';
import { SuratPKSDaruratModal } from '@/components/SuratPKSDaruratModal';
import { CheckoutAircraftModal } from '@/app/petugas/components/dashboard/CheckoutAircraftModal';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

export default function PendaratanDaruratPage() {
  const router = useRouter();

  // Emergency Contracts from Dinas
  const [emergencyContracts, setEmergencyContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Field Form State (Diinput oleh Petugas Lapangan)
  const [fieldRegistrationNumber, setFieldRegistrationNumber] = useState('');
  const [fieldAircraftTypeId, setFieldAircraftTypeId] = useState<number | ''>('');
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [parkingLocation, setParkingLocation] = useState<'Hanggar' | 'Apron'>('Apron');
  const [officerNotes, setOfficerNotes] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Data Sources State
  const [parkingAssets, setParkingAssets] = useState<Asset[]>([]);
  const [hangarCapacity, setHangarCapacity] = useState<{ isHangar: boolean; totalArea: number; usedArea: number; remainingArea: number } | null>(null);
  const [apronCapacity, setApronCapacity] = useState<{ isHangar: boolean; totalArea: number; usedArea: number; remainingArea: number } | null>(null);
  const [masterAircraftTypes, setMasterAircraftTypes] = useState<{ id: number; jenis_pesawat: string; luas_efektif_m2: string }[]>([]);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Preview PKS & Dialog
  const [previewModalContract, setPreviewModalContract] = useState<Contract | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedContract, setCompletedContract] = useState<Contract | null>(null);

  // UI/UX Enhancements: Active Tab & SOP Collapse
  const [activeTab, setActiveTab] = useState<'checkin' | 'active'>('checkin');
  const [isSopOpen, setIsSopOpen] = useState(false);

  // In-page Check-Out Modal States
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkOutLogId, setCheckOutLogId] = useState<number | null>(null);
  const [checkOutRegistration, setCheckOutRegistration] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState<number | null>(null);

  // Load Data
  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [allAssets, logs, emgContracts, types] = await Promise.all([
        assetService.getAssets().catch(() => []),
        logService.getActiveLogs().catch(() => []),
        contractService.getEmergencyActiveContracts().catch((err) => {
          console.error('Gagal mengambil kontrak darurat:', err);
          return [];
        }),
        aircraftService.getMasterTypes().catch(() => [])
      ]);

      setMasterAircraftTypes(types || []);
      if (types && types.length > 0 && !fieldAircraftTypeId) {
        setFieldAircraftTypeId(types[0].id);
      }

      // Filter assets: only Hanggar & Apron
      const validParkingAssets = (allAssets || []).filter((a: Asset) => 
        a.jenis_aset === 'Hanggar' || a.jenis_aset === 'Apron'
      );
      setParkingAssets(validParkingAssets);

      const defaultAsset = validParkingAssets.find((a: Asset) => a.jenis_aset === 'Apron') || validParkingAssets[0];
      if (defaultAsset) {
        setSelectedAssetId(defaultAsset.id);
        setParkingLocation(defaultAsset.jenis_aset as 'Hanggar' | 'Apron');
      }

      // Fetch Capacities for both Hanggar & Apron
      const hangarAsset = validParkingAssets.find((a: Asset) => a.jenis_aset === 'Hanggar');
      const apronAsset = validParkingAssets.find((a: Asset) => a.jenis_aset === 'Apron');

      const [hangarCap, apronCap] = await Promise.all([
        hangarAsset ? assetService.getAssetCapacity(hangarAsset.id).catch(() => null) : Promise.resolve(null),
        apronAsset ? assetService.getAssetCapacity(apronAsset.id).catch(() => null) : Promise.resolve(null)
      ]);

      if (hangarCap) setHangarCapacity(hangarCap);
      if (apronCap) setApronCapacity(apronCap);

      setActiveLogs(logs || []);
      setEmergencyContracts(emgContracts || []);
    } catch (err) {
      console.error('Error loading emergency data:', err);
      toast.error('Gagal memuat data pendaratan darurat');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Assets and active parking metrics
  const hangarAsset = useMemo(() => parkingAssets.find(a => a.jenis_aset === 'Hanggar'), [parkingAssets]);
  const apronAsset = useMemo(() => parkingAssets.find(a => a.jenis_aset === 'Apron'), [parkingAssets]);

  const hangarActiveCount = useMemo(() => {
    return activeLogs.filter(l => (l.parking_location || '').toLowerCase() === 'hanggar').length;
  }, [activeLogs]);

  const apronActiveCount = useMemo(() => {
    return activeLogs.filter(l => (l.parking_location || '').toLowerCase() === 'apron').length;
  }, [activeLogs]);

  const selectedAircraftType = useMemo(() => {
    return masterAircraftTypes.find(t => t.id === Number(fieldAircraftTypeId));
  }, [masterAircraftTypes, fieldAircraftTypeId]);

  const requiredArea = selectedAircraftType ? parseFloat(selectedAircraftType.luas_efektif_m2 || '0') : 0;

  // Apron Capacity Metrics
  const apronTotalArea = apronCapacity?.totalArea || Number(apronAsset?.luas) || 5000;
  const apronUsedArea = apronCapacity?.usedArea || 0;
  const apronRemainingArea = apronCapacity?.remainingArea ?? Math.max(0, apronTotalArea - apronUsedArea);
  const apronPercent = apronTotalArea > 0 ? Math.min(100, Math.round((apronUsedArea / apronTotalArea) * 100)) : 0;

  // Hanggar Capacity Metrics
  const hangarTotalArea = hangarCapacity?.totalArea || Number(hangarAsset?.luas) || 2700;
  const hangarUsedArea = hangarCapacity?.usedArea || 0;
  const hangarRemainingArea = hangarCapacity?.remainingArea ?? Math.max(0, hangarTotalArea - hangarUsedArea);
  const hangarPercent = hangarTotalArea > 0 ? Math.min(100, Math.round((hangarUsedArea / hangarTotalArea) * 100)) : 0;

  // Handle Photo File Change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran foto maksimal 10MB');
        return;
      }
      setEvidencePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEvidencePhoto(null);
    setPhotoPreview(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContract) {
      toast.error('Silakan pilih salah satu Kontrak PKS Darurat aktif terlebih dahulu');
      return;
    }

    if (!fieldRegistrationNumber.trim()) {
      toast.error('Nomor registrasi armada (Tail Number) wajib dicatat oleh petugas lapangan');
      return;
    }

    if (!evidencePhoto) {
      toast.error('Foto bukti fisik pesawat di lokasi wajib dilampirkan');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('contract_id', String(selectedContract.id));
      fd.append('registration_number', fieldRegistrationNumber.toUpperCase().trim());
      if (fieldAircraftTypeId) {
        fd.append('aircraft_type_id', String(fieldAircraftTypeId));
      }
      fd.append('airline_name', airlineName);
      if (selectedAssetId) fd.append('asset_id', String(selectedAssetId));
      fd.append('parking_location', parkingLocation);
      fd.append('emergency_reason', emergencyReason);
      fd.append('notes', officerNotes.trim());
      if (evidencePhoto) {
        fd.append('log_evidence', evidencePhoto);
      }

      await logService.emergencyCheckin(fd);
      toast.success('Pendaratan Darurat Berhasil Dicatat & Check-In Sukses!');

      setCompletedContract(selectedContract);
      setSelectedContract(null);
      setFieldRegistrationNumber('');
      setOfficerNotes('');
      setEvidencePhoto(null);
      setPhotoPreview(null);
      setShowSuccessDialog(true);
      await fetchData();
    } catch (err: any) {
      console.error('Gagal submit emergency check-in:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal check-in pendaratan darurat');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate contracts into:
  // 1. Ready to check-in (belum check-in)
  // 2. Already checked in (sedang di lokasi / active)
  const { readyContracts, activeOnFieldContracts } = useMemo(() => {
    const ready: Contract[] = [];
    const active: Contract[] = [];

    emergencyContracts.forEach(c => {
      const logs = (c as any).operational_logs || [];
      const hasActiveStay = logs.some((l: any) => !l.exit_time);
      const isCompleted = logs.length > 0 && logs.every((l: any) => l.exit_time);

      if (hasActiveStay) {
        active.push(c);
      } else if (!isCompleted) {
        ready.push(c);
      }
    });

    return { readyContracts: ready, activeOnFieldContracts: active };
  }, [emergencyContracts]);

  // Synchronize selectedContract strictly with readyContracts & auto-set intelligent default tab
  useEffect(() => {
    if (readyContracts.length === 0) {
      setSelectedContract(null);
      // Auto-switch to active field tab if no check-in is pending
      setActiveTab('active');
    } else {
      if (!selectedContract || !readyContracts.some(c => c.id === selectedContract.id)) {
        setSelectedContract(readyContracts[0]);
      }
      // If there are contracts waiting and active tab wasn't explicitly switched, default to checkin
      setActiveTab('checkin');
    }
  }, [readyContracts.length]);

  // Compute selected contract details
  const contractFasilitas = useMemo(() => {
    if (!selectedContract?.fasilitas) return {};
    return typeof selectedContract.fasilitas === 'string'
      ? JSON.parse(selectedContract.fasilitas)
      : selectedContract.fasilitas;
  }, [selectedContract]);

  const registrationNumber = contractFasilitas.registration_number || (selectedContract as any)?.registration_number || '-';
  const airlineName = selectedContract?.tenants?.nama_perusahaan || contractFasilitas.airline_name || 'Maskapai Tamu';
  const picName = contractFasilitas.pic_name || selectedContract?.tenants?.pic || '-';
  const picPhone = contractFasilitas.pic_phone || selectedContract?.tenants?.nomor_telepon || '-';
  const picEmail = contractFasilitas.pic_email || selectedContract?.tenants?.email || '-';
  const emergencyReason = contractFasilitas.emergency_reason || 'Pendaratan Darurat';

  // Handle in-page check-out
  const handleOpenCheckOut = (logId: number, regNumber: string) => {
    setCheckOutLogId(logId);
    setCheckOutRegistration(regNumber);
    setCheckOutNotes('');
    setShowCheckOutModal(true);
  };

  const handleSubmitCheckOut = async () => {
    if (!checkOutLogId) return;
    try {
      setIsCheckingOut(checkOutLogId);
      await logService.createExitLog(checkOutLogId, {
        exit_time: new Date().toISOString(),
        notes: checkOutNotes
      });
      setShowCheckOutModal(false);
      toast.success(`Check-Out pesawat ${checkOutRegistration} berhasil dicatat!`);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Gagal melakukan check-out armada');
    } finally {
      setIsCheckingOut(null);
      setCheckOutLogId(null);
    }
  };

  // Sync field form with selected contract
  useEffect(() => {
    if (selectedContract && readyContracts.some(c => c.id === selectedContract.id)) {
      const fas = typeof selectedContract.fasilitas === 'string'
        ? JSON.parse(selectedContract.fasilitas)
        : (selectedContract.fasilitas || {});
      setFieldRegistrationNumber(fas.registration_number || '');
      if (fas.aircraft_type_id) {
        setFieldAircraftTypeId(Number(fas.aircraft_type_id));
      } else if (masterAircraftTypes.length > 0) {
        setFieldAircraftTypeId(masterAircraftTypes[0].id);
      }
    } else {
      setFieldRegistrationNumber('');
      setOfficerNotes('');
      setEvidencePhoto(null);
      setPhotoPreview(null);
    }
  }, [selectedContract, masterAircraftTypes, readyContracts]);

  return (
    <div className="p-4 sm:p-6 bg-[#ecf0f5] min-h-screen space-y-4 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline flex-wrap">
            Pendaratan Darurat{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <Link href="/petugas" className="mr-1 hover:text-[#3c8dbc]">Petugas</Link> /{' '}
          <span className="ml-1 font-medium text-slate-800">Pendaratan Darurat</span>
        </div>
      </header>

      {/* Ringkasan KPI Mini (Top Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Menunggu Check-in */}
        <div 
          onClick={() => setActiveTab('checkin')}
          className={`bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-4 cursor-pointer transition-all ${
            activeTab === 'checkin' ? 'ring-2 ring-[#3c8dbc]/30 bg-blue-50/20' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Menunggu Check-In</div>
              <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                {readyContracts.length}
                <span className="text-xs font-normal font-sans text-slate-500 ml-1.5">PKS</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>{readyContracts.length > 0 ? 'Perlu tindakan lapangan' : 'Semua PKS terproses'}</span>
            <span className="text-[#3c8dbc] font-semibold text-[10px]">Buka ➔</span>
          </div>
        </div>

        {/* KPI 2: Armada Aktif di Lapangan */}
        <div 
          onClick={() => setActiveTab('active')}
          className={`bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-4 cursor-pointer transition-all ${
            activeTab === 'active' ? 'ring-2 ring-[#3c8dbc]/30 bg-blue-50/20' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Aktif Parkir / Perbaikan</div>
              <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                {activeOnFieldContracts.length}
                <span className="text-xs font-normal font-sans text-slate-500 ml-1.5">Armada</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>{activeOnFieldContracts.length > 0 ? 'Siap monitoring / check-out' : 'Tidak ada armada parkir'}</span>
            <span className="text-[#3c8dbc] font-semibold text-[10px]">Buka ➔</span>
          </div>
        </div>

        {/* KPI 3: Kapasitas Apron */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kapasitas Apron</div>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">
                {apronRemainingArea.toLocaleString('id-ID')}
                <span className="text-xs font-normal font-sans text-slate-500 ml-1">m² sisa</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>{apronActiveCount} armada di Apron</span>
            <span className="font-mono font-bold text-slate-700">{apronPercent}%</span>
          </div>
        </div>

        {/* KPI 4: Kapasitas Hanggar */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kapasitas Hanggar</div>
              <div className="text-lg font-bold font-mono text-slate-800 mt-1">
                {hangarRemainingArea.toLocaleString('id-ID')}
                <span className="text-xs font-normal font-sans text-slate-500 ml-1">m² sisa</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>{hangarActiveCount} armada di Hanggar</span>
            <span className="font-mono font-bold text-slate-700">{hangarPercent}%</span>
          </div>
        </div>
      </div>

      {/* Banner SOP Pendaratan Darurat (Ringkas & Collapsible) */}
      <div className="bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
        <div 
          onClick={() => setIsSopOpen(prev => !prev)}
          className="p-3 bg-blue-50/40 border-l-4 border-[#3c8dbc] flex items-center justify-between cursor-pointer hover:bg-blue-50/70 transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldAlert className="w-4 h-4 text-[#3c8dbc] flex-shrink-0" />
            <span className="font-bold text-[#3c8dbc]">SOP Operasional Pendaratan Darurat:</span>
            <span className="text-slate-600 hidden sm:inline">PKS resmi diterbitkan &amp; disahkan di kantor Dinas Perhubungan terlebih dahulu.</span>
          </div>
          <button 
            type="button" 
            className="text-[11px] font-bold text-[#3c8dbc] hover:text-[#367fa9] flex items-center gap-1 cursor-pointer"
          >
            {isSopOpen ? (
              <>Tutup Panduan <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Detail Panduan SOP <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {isSopOpen && (
          <div className="p-4 bg-white border-t border-blue-100 text-slate-600 space-y-2 text-xs leading-relaxed animate-in fade-in duration-150">
            <p>
              1. <strong>Penerbitan PKS:</strong> Operator/maskapai yang mendarat darurat melapor ke kantor Dinas Perhubungan untuk menandatangani Kontrak PKS Darurat fisik/digital.
            </p>
            <p>
              2. <strong>Pencatatan Lapangan (Check-In):</strong> Petugas lapangan memilih nomor PKS aktif di tab <em>&quot;Check-In PKS Baru&quot;</em>, mencatat nomor registrasi aktual pada badan pesawat, memilih lokasi parkir (Apron/Hanggar), dan mengunggah foto bukti fisik pesawat.
            </p>
            <p>
              3. <strong>Pencatatan Keluar (Check-Out):</strong> Saat armada darurat telah selesai diperbaiki dan siap lepas landas, petugas menekan tombol <em>&quot;Check-Out&quot;</em> pada tab <em>&quot;Armada Aktif di Lapangan&quot;</em>. Sistem otomatis menghitung total lama menginap dan menerbitkan tagihan e-SKRD resmi.
            </p>
          </div>
        )}
      </div>

      {isLoadingData ? (
        <div className="bg-white p-12 text-center text-slate-500 border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#3c8dbc] mb-2" />
          <p className="text-sm font-medium">Memuat data kontrak darurat dari Dinas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* TAB NAVIGATION BAR */}
          <div className="bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 pt-2 border-b-2 border-slate-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'active'
                    ? 'text-[#3c8dbc] border-b-2 border-[#3c8dbc] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Plane className="w-4 h-4" />
                Armada Aktif di Lapangan
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                  activeTab === 'active'
                    ? 'bg-blue-100 text-[#3c8dbc]' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeOnFieldContracts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('checkin')}
                className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'checkin'
                    ? 'text-[#3c8dbc] border-b-2 border-[#3c8dbc] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                Check-In PKS Baru
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                  activeTab === 'checkin'
                    ? 'bg-blue-100 text-[#3c8dbc]' 
                    : (readyContracts.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500')
                }`}>
                  {readyContracts.length}
                </span>
              </button>
            </div>

            <div className="pb-2 sm:pb-0 flex items-center justify-end">
              <button
                type="button"
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#3c8dbc] border border-slate-200 px-3 py-1 bg-slate-50 hover:bg-slate-100 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Segarkan Data
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB CHECK-IN: PILIH KONTRAK PKS DARURAT AKTIF DARI DINAS */}
          {/* ======================================================== */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 rounded-none p-5 space-y-4">
                <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#3c8dbc]" />
                      1. Pilih Kontrak PKS Darurat Aktif dari Dinas Perhubungan
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kontrak yang telah disahkan &amp; ditandatangani oleh pihak maskapai saat melapor ke kantor Dinas
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1">
                    {readyContracts.length} Menunggu
                  </span>
                </div>

                {readyContracts.length === 0 ? (
                  <div className="p-8 bg-slate-50 border border-slate-200 border-dashed text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-sm">Tidak Ada PKS Darurat yang Menunggu Check-In</h3>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto">
                      Seluruh kontrak PKS darurat yang disahkan Dinas telah dilakukan pencatatan fisik (check-in) di lapangan.
                    </p>
                    {activeOnFieldContracts.length > 0 && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('active')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold cursor-pointer transition-colors"
                        >
                          <Plane className="w-4 h-4" />
                          Lihat {activeOnFieldContracts.length} Pesawat Aktif di Lapangan
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {readyContracts.map((c) => {
                  const fas = typeof c.fasilitas === 'string' ? JSON.parse(c.fasilitas) : (c.fasilitas || {});
                  const isSelected = selectedContract?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContract(isSelected ? null : c)}
                      className={`p-4 border cursor-pointer transition-all relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#3c8dbc] bg-blue-50/40 ring-2 ring-[#3c8dbc]/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-[#3c8dbc]">
                            {c.contract_number}
                          </span>
                          <StatusBadge status="Aktif" label="Aktif • Sah Dinas" />
                        </div>

                        <div className="text-base font-bold text-slate-800">
                          {c.tenants?.nama_perusahaan || fas.airline_name}
                        </div>
                        <div className="text-xs font-medium text-slate-600 mb-2">
                          {fas.registration_number ? `Armada: ${fas.registration_number}` : 'Menunggu Pencatatan Lapangan'}
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
                          <div>PIC: <span className="font-sans text-slate-700 font-semibold">{fas.pic_name || c.tenants?.pic || '-'}</span></div>
                          <div>Alasan: <span className="font-sans text-amber-800 font-medium">{fas.emergency_reason || 'Darurat'}</span></div>
                          <div>Disahkan: {c.created_at ? dayjs(c.created_at).format('DD/MM/YYYY HH:mm') : '-'}</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalContract(c);
                          }}
                          className="text-[11px] text-[#3c8dbc] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat PKS
                        </button>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-[#3c8dbc]' : 'text-slate-400'}`}>
                          {isSelected ? '✓ Terpilih' : 'Pilih Kontrak'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Check-in Lapangan (Hanya Tampil Jika Kontrak Terpilih dan Masih Menunggu Check-In) */}
          {selectedContract && readyContracts.some(c => c.id === selectedContract.id) ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Ringkasan Kontrak Terpilih */}
              <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3c8dbc]" />
                    PKS Darurat Terpilih: {selectedContract.contract_number}
                  </h3>
                  <StatusBadge status="Aktif" label="TTE PIC Sah di Kantor Dinas" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Maskapai / Operator</span>
                    <strong className="text-slate-800 text-sm">{airlineName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Alasan Pendaratan Darurat</span>
                    <strong className="text-amber-800 text-xs font-semibold">{emergencyReason}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">PIC di Lapangan &amp; Kontak</span>
                    <strong className="text-slate-800">{picName}</strong>
                    <div className="text-[11px] text-slate-500 font-mono">{picPhone} &bull; {picEmail}</div>
                  </div>
                </div>
              </div>

              {/* SEKSI 2: IDENTIFIKASI FISIK PESAWAT & PENEMPATAN LAPANGAN */}
              <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#3c8dbc]" />
                    2. Identifikasi Fisik Pesawat &amp; Alokasi Penempatan Lapangan
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Petugas lapangan mencatat nomor registrasi fisik aktual, memilih jenis armada, dan menentukan area parkir (Apron/Hanggar)
                  </p>
                </div>

                {/* Input No Registrasi & Tipe Pesawat oleh Petugas Lapangan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Nomor Registrasi Armada (Tail Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PK-RJB"
                      value={fieldRegistrationNumber}
                      onChange={(e) => setFieldRegistrationNumber(e.target.value.toUpperCase())}
                      className="w-full border border-slate-300 px-3 py-2 text-xs font-mono font-bold uppercase bg-white focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Catat nomor registrasi fisik yang tertera pada badan pesawat di lokasi
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Tipe / Jenis Pesawat <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={fieldAircraftTypeId}
                      onChange={(e) => setFieldAircraftTypeId(Number(e.target.value))}
                      className="w-full border border-slate-300 px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] focus:outline-none"
                    >
                      {masterAircraftTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.jenis_pesawat}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Pilih jenis armada untuk perhitungan luasan / tarif retribusi
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3c8dbc]" />
                      Alokasi Area Penempatan Fisik <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 normal-case">
                      Pilih area parkir aktual armada darurat di Bandara Mozes Kilangin
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* OPSI APRON */}
                    <div 
                      onClick={() => {
                        setParkingLocation('Apron');
                        if (apronAsset) setSelectedAssetId(apronAsset.id);
                      }}
                      className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        parkingLocation === 'Apron'
                          ? 'border-2 border-[#3c8dbc] bg-[#f4f8fb] shadow-xs ring-1 ring-[#3c8dbc]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Header Kartu */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-none transition-colors ${
                              parkingLocation === 'Apron' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {apronAsset?.nama_aset || 'Apron Parkir Timur Mozes Kilangin'}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono bg-slate-100 px-1.5 py-0.2 border border-slate-200 text-slate-600 font-semibold">
                                  {apronAsset?.kode_aset || 'APR-01'}
                                </span>
                                <span>&bull;</span>
                                <span>{apronAsset?.lokasi || 'Airside Bandara Mozes Kilangin'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {parkingLocation === 'Apron' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#3c8dbc] text-white flex items-center gap-1">
                                <Check className="w-3 h-3" /> DIPILIH
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 bg-slate-50">
                                PILIH
                              </span>
                            )}
                            <input 
                              type="radio" 
                              name="parking_loc" 
                              checked={parkingLocation === 'Apron'} 
                              onChange={() => {}} 
                              className="accent-[#3c8dbc] cursor-pointer"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          Penempatan di area apron luar (terbuka). Akses manuver cepat dan stand-by armada.
                        </p>

                        {/* Detail Kapasitas 4 Metrik */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 bg-white border border-slate-200 mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Luas</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {Number(apronTotalArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Terpakai</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {Number(apronUsedArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sisa Area</span>
                            <span className="text-xs font-bold text-emerald-700 font-mono">
                              {Number(apronRemainingArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Armada Aktif</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {apronActiveCount} Unit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                        <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-500">
                            Standar: <strong className="text-slate-700">{apronAsset?.kapasitas || '4 Parking Stand Pesawat'}</strong>
                          </span>
                          <span className="font-mono text-slate-600">
                            Utilisasi: <strong>{apronPercent}%</strong>
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden flex border border-slate-200">
                          <div 
                            className="bg-[#3c8dbc] h-2 transition-all duration-300" 
                            style={{ width: `${apronPercent}%` }}
                            title={`Terpakai: ${apronUsedArea} m²`}
                          />
                          {parkingLocation === 'Apron' && requiredArea > 0 && (
                            <div 
                              className="bg-emerald-500 h-2 transition-all duration-300" 
                              style={{ width: `${Math.min(100 - apronPercent, (requiredArea / (apronTotalArea || 1)) * 100)}%` }}
                              title={`Tambahan Armada Ini: ${requiredArea} m²`}
                            />
                          )}
                        </div>

                        {parkingLocation === 'Apron' && requiredArea > 0 && (
                          <div className="text-[10px] text-slate-500 flex justify-between items-center pt-0.5">
                            <span>Estimasi Armada: <strong>{requiredArea} m²</strong> ({selectedAircraftType?.jenis_pesawat})</span>
                            <span className={apronRemainingArea < requiredArea ? 'text-red-600 font-bold' : 'text-emerald-700 font-medium'}>
                              {apronRemainingArea < requiredArea ? 'Melebihi Sisa' : `Proyeksi Sisa: ${(apronRemainingArea - requiredArea).toLocaleString('id-ID')} m²`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OPSI HANGGAR */}
                    <div 
                      onClick={() => {
                        setParkingLocation('Hanggar');
                        if (hangarAsset) setSelectedAssetId(hangarAsset.id);
                      }}
                      className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        parkingLocation === 'Hanggar'
                          ? 'border-2 border-[#3c8dbc] bg-[#f4f8fb] shadow-xs ring-1 ring-[#3c8dbc]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Header Kartu */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-none transition-colors ${
                              parkingLocation === 'Hanggar' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {hangarAsset?.nama_aset || 'Gedung Hanggar Bandara Mozes Kilangin'}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono bg-slate-100 px-1.5 py-0.2 border border-slate-200 text-slate-600 font-semibold">
                                  {hangarAsset?.kode_aset || 'HGR-01'}
                                </span>
                                <span>&bull;</span>
                                <span>{hangarAsset?.lokasi || 'Sisi Timur Apron Mozes Kilangin'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {parkingLocation === 'Hanggar' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#3c8dbc] text-white flex items-center gap-1">
                                <Check className="w-3 h-3" /> DIPILIH
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 bg-slate-50">
                                PILIH
                              </span>
                            )}
                            <input 
                              type="radio" 
                              name="parking_loc" 
                              checked={parkingLocation === 'Hanggar'} 
                              onChange={() => {}} 
                              className="accent-[#3c8dbc] cursor-pointer"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          Penempatan di dalam gedung hanggar tertutup untuk penanganan teknis intensif dan proteksi cuaca.
                        </p>

                        {/* Detail Kapasitas 4 Metrik */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 bg-white border border-slate-200 mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Luas</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {Number(hangarTotalArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Terpakai</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {Number(hangarUsedArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sisa Area</span>
                            <span className="text-xs font-bold text-emerald-700 font-mono">
                              {Number(hangarRemainingArea).toLocaleString('id-ID')} m²
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Armada Aktif</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {hangarActiveCount} Unit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                        <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium">
                          <span className="text-slate-500">
                            Standar: <strong className="text-slate-700">{hangarAsset?.kapasitas || '3 Pesawat Narrow Body'}</strong>
                          </span>
                          <span className="font-mono text-slate-600">
                            Utilisasi: <strong>{hangarPercent}%</strong>
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden flex border border-slate-200">
                          <div 
                            className="bg-[#3c8dbc] h-2 transition-all duration-300" 
                            style={{ width: `${hangarPercent}%` }}
                            title={`Terpakai: ${hangarUsedArea} m²`}
                          />
                          {parkingLocation === 'Hanggar' && requiredArea > 0 && (
                            <div 
                              className="bg-emerald-500 h-2 transition-all duration-300" 
                              style={{ width: `${Math.min(100 - hangarPercent, (requiredArea / (hangarTotalArea || 1)) * 100)}%` }}
                              title={`Tambahan Armada Ini: ${requiredArea} m²`}
                            />
                          )}
                        </div>

                        {parkingLocation === 'Hanggar' && requiredArea > 0 && (
                          <div className="text-[10px] text-slate-500 flex justify-between items-center pt-0.5">
                            <span>Estimasi Armada: <strong>{requiredArea} m²</strong> ({selectedAircraftType?.jenis_pesawat})</span>
                            <span className={hangarRemainingArea < requiredArea ? 'text-red-600 font-bold' : 'text-emerald-700 font-medium'}>
                              {hangarRemainingArea < requiredArea ? 'Melebihi Sisa' : `Proyeksi Sisa: ${(hangarRemainingArea - requiredArea).toLocaleString('id-ID')} m²`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Catatan Petugas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Catatan Pemeriksaan Fisik Lapangan &amp; Kondisi Pesawat
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan catatan kondisi fisik pesawat saat landing, teknisi yang menangani, dll..."
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="w-full border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] focus:outline-none"
                  />
                </div>
              </div>

              {/* SEKSI 3: BUKTI FISIK FOTO PESAWAT DI LOKASI */}
              <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#3c8dbc]" />
                    3. Bukti Fisik Lapangan (Foto Pesawat)
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Petugas lapangan wajib mengambil foto fisik nomor registrasi pesawat yang parkir di lokasi
                  </p>
                </div>

                <div className="max-w-md">
                  {!photoPreview ? (
                    <label className="min-h-[160px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-[#3c8dbc] rounded-none cursor-pointer bg-slate-50 transition-colors text-center">
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-700">Ambil / Unggah Foto Pesawat</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">JPG / PNG (Maks. 10MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative border border-slate-300 bg-slate-100 min-h-[160px] flex items-center justify-center overflow-hidden">
                      <img 
                        src={photoPreview} 
                        alt="Preview Fisik Pesawat" 
                        className="max-h-[220px] w-full object-cover" 
                      />
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <label className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold rounded-none cursor-pointer transition-colors shadow-xs">
                          Ganti Foto
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-none cursor-pointer transition-colors shadow-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Status Tanda Tangan:</strong> Telah disahkan dan ditandatangani oleh perwakilan maskapai di kantor Dinas Perhubungan. Petugas lapangan tidak perlu meminta tanda tangan ulang.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white border border-slate-200 p-4 shadow-xs flex justify-between items-center">
                <Link
                  href="/petugas"
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-none transition-colors"
                >
                  Kembali
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan Check-In...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Konfirmasi Check-In Pendaratan Darurat
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : readyContracts.length > 0 ? (
            <div className="bg-white border border-slate-200 p-6 text-center text-slate-500 text-xs shadow-xs">
              <Info className="w-5 h-5 text-[#3c8dbc] mx-auto mb-1.5" />
              Silakan klik salah satu kartu Kontrak PKS Darurat di atas untuk melanjutkan pengisian identifikasi fisik &amp; check-in lapangan.
            </div>
          ) : null}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB ARMADA AKTIF DI LAPANGAN (PRIORITAS MONITORING)      */}
          {/* ======================================================== */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs border-x border-b border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-200 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#3c8dbc]" />
                      Daftar Pesawat Darurat Sedang Parkir ({activeOnFieldContracts.length})
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Armada yang saat ini menempati area bandara. Lakukan Check-Out saat pesawat siap lepas landas.
                    </p>
                  </div>
                  {readyContracts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('checkin')}
                      className="text-xs font-bold text-[#3c8dbc] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Ada {readyContracts.length} PKS Baru Menunggu Check-In ➔
                    </button>
                  )}
                </div>

                {activeOnFieldContracts.length === 0 ? (
                  <div className="p-8 bg-slate-50 border border-slate-200 border-dashed text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-sm">Tidak Ada Pesawat Darurat di Lapangan</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Seluruh armada darurat sebelumnya telah selesai check-out atau belum ada armada baru yang menempati area parkir.
                    </p>
                    {readyContracts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('checkin')}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold cursor-pointer"
                      >
                        <CheckSquare className="w-4 h-4" /> Proses Check-In {readyContracts.length} PKS Baru
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-3">No. PKS Darurat</th>
                          <th className="p-3">Maskapai / Operator</th>
                          <th className="p-3">Tail Number</th>
                          <th className="p-3">Lokasi Parkir</th>
                          <th className="p-3">Waktu Masuk (Check-In)</th>
                          <th className="p-3">Status Lapangan</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {activeOnFieldContracts.map((c) => {
                          const fas = typeof c.fasilitas === 'string' ? JSON.parse(c.fasilitas) : (c.fasilitas || {});
                          const activeLog = (c as any).operational_logs?.find((l: any) => !l.exit_time);
                          return (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono font-bold text-[#3c8dbc]">{c.contract_number}</td>
                              <td className="p-3 font-semibold text-slate-800">{c.tenants?.nama_perusahaan || fas.airline_name || '-'}</td>
                              <td className="p-3 font-mono font-bold text-slate-900">{activeLog?.registration_number || fas.registration_number || '-'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                                  (activeLog?.parking_location || '').toLowerCase() === 'hanggar'
                                    ? 'bg-blue-50 text-[#3c8dbc] border-blue-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {activeLog?.parking_location || 'Apron'}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-slate-600">
                                {activeLog?.entry_time ? dayjs(activeLog.entry_time).format('DD/MM/YYYY HH:mm [WIT]') : '-'}
                              </td>
                              <td className="p-3">
                                <StatusBadge status="Aktif" label="Aktif Parkir / Perbaikan" />
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalContract(c)}
                                  className="text-[11px] text-[#3c8dbc] hover:underline inline-flex items-center gap-1 font-semibold mr-3 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" /> PKS
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (activeLog) {
                                      handleOpenCheckOut(activeLog.id, activeLog.registration_number || fas.registration_number || 'Armada');
                                    }
                                  }}
                                  className="text-[11px] text-red-600 hover:text-red-800 font-bold inline-flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 transition-colors"
                                >
                                  <LogOut className="w-3.5 h-3.5" /> Check-Out
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modal Preview Surat PKS Darurat */}
      {previewModalContract && (
        <SuratPKSDaruratModal
          contract={previewModalContract}
          onClose={() => setPreviewModalContract(null)}
        />
      )}

      {/* Modal Check-Out Armada Langsung di Halaman Ini */}
      <CheckoutAircraftModal
        isOpen={showCheckOutModal}
        checkOutRegistration={checkOutRegistration}
        checkOutNotes={checkOutNotes}
        setCheckOutNotes={setCheckOutNotes}
        isCheckingOut={isCheckingOut}
        onClose={() => setShowCheckOutModal(false)}
        onSubmit={handleSubmitCheckOut}
      />

      {/* Dialog Sukses Setelah Check-in */}
      {showSuccessDialog && completedContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 text-center border-t-4 border-emerald-500 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Check-In Pendaratan Darurat Berhasil Dicatat!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pesawat dengan registrasi <strong>{(completedContract as any)?.registration_number || (typeof completedContract.fasilitas === 'string' ? JSON.parse(completedContract.fasilitas).registration_number : completedContract.fasilitas?.registration_number) || 'Armada'}</strong> telah tercatat aktif menempati area <strong>{parkingLocation}</strong>. Setelah selesai perbaikan dan siap lepas landas, petugas dapat mencatat waktu keluar (Check-Out) untuk penerbitan e-SKRD resmi oleh Dinas.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push('/petugas');
                }}
                className="px-5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none shadow-xs cursor-pointer"
              >
                Ke Dashboard Petugas
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessDialog(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-none transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
