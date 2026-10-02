"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import { taxService } from '@/services/taxService';
import { useAuthStore } from '@/store/useAuthStore';
import { MiniAirportKPICards } from './components/MiniAirportKPICards';
import { StandCapacityCards } from './components/StandCapacityCards';
import { MiniAirportLogTable } from './components/MiniAirportLogTable';
import { CatatRealisasiModal } from './components/CatatRealisasiModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PhotoPreviewModal } from './components/PhotoPreviewModal';

import { TowerControl } from 'lucide-react';

dayjs.locale('id');

function PetugasMiniAirportContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const queryAppId = searchParams.get('appId');
  const [logs, setLogs] = useState<any[]>([]);
  const [eligibleApps, setEligibleApps] = useState<any[]>([]);
  const [masterTaxes, setMasterTaxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTargetLog, setCheckoutTargetLog] = useState<any | null>(null);

  // Form State
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [entryTime, setEntryTime] = useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [exitTime, setExitTime] = useState<string>('');
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [isOvernight, setIsOvernight] = useState<boolean>(false);
  const [overnightNights, setOvernightNights] = useState<number>(1);
  const [parkingStand, setParkingStand] = useState<string>('STAND 01');
  const [remarks, setRemarks] = useState<string>('');
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);

  // Preview Modal
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [logsData, appsData, taxesData] = await Promise.all([
        miniAirportLogService.getAllLogs().catch(() => []),
        miniAirportLogService.getEligibleApplications().catch(() => []),
        taxService.getAll().catch(() => []),
      ]);
      setLogs(logsData || []);
      setEligibleApps(appsData || []);
      setMasterTaxes(taxesData || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data pendaratan Mini Airport');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle pre-selected application from Rencana Masuk (1-click Realisasikan)
  useEffect(() => {
    if (queryAppId && eligibleApps.length > 0) {
      const match = eligibleApps.find((a) => String(a.id) === String(queryAppId));
      if (match) {
        setSelectedAppId(queryAppId);
        setShowModal(true);
      }
    }
  }, [queryAppId, eligibleApps]);

  // Selected Application Details
  const selectedApp = useMemo(() => {
    if (!selectedAppId) return null;
    return eligibleApps.find((a) => String(a.id) === String(selectedAppId)) || null;
  }, [selectedAppId, eligibleApps]);

  const appSpec = useMemo(() => {
    if (!selectedApp?.specific_needs) return {};
    if (typeof selectedApp.specific_needs === 'string') {
      try {
        return JSON.parse(selectedApp.specific_needs);
      } catch (e) {
        return {};
      }
    }
    return selectedApp.specific_needs;
  }, [selectedApp]);

  // When selectedApp changes, autofill form fields
  useEffect(() => {
    if (selectedApp) {
      if (appSpec.passengers_count) {
        setPassengersCount(Number(appSpec.passengers_count));
      }
      if (appSpec.allocated_stand) {
        setParkingStand(appSpec.allocated_stand);
      }
      if (appSpec.landing_date && appSpec.landing_time) {
        setEntryTime(`${appSpec.landing_date}T${appSpec.landing_time}`);
      }
    }
  }, [selectedApp, appSpec]);

  // Live Tax Calculation Preview
  const taxSimulation = useMemo(() => {
    if (!selectedApp || masterTaxes.length === 0) {
      return { taxes: [], total: 0 };
    }

    const typeName = (appSpec.aircraft_type || '').toLowerCase();
    const typeId = appSpec.aircraft_id ? Number(appSpec.aircraft_id) : null;
    const taxes: any[] = [];

    // 1. Landing Tax
    const landingTaxes = masterTaxes.filter((t) => t.kategori === 'Pendaratan');
    let lnd = null;
    if (typeId) lnd = landingTaxes.find((t) => t.aircraft_type_id === typeId);
    if (!lnd) {
      if (typeName.includes('heli') || typeName.includes('as350') || typeName.includes('bell') || typeName.includes('kamov')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-HELI');
      } else if (typeName.includes('c208') || typeName.includes('cessna') || typeName.includes('pac')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-LIGHT');
      } else if (typeName.includes('dhc') || typeName.includes('twin')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-MEDIUM');
      } else {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-HEAVY');
      }
    }
    if (!lnd && landingTaxes.length > 0) lnd = landingTaxes[0];
    // 1. Landing Tax
    if (lnd) {
      taxes.push({ 
        nama_tax: `Tax Pendaratan (${lnd.nama_tax})`, 
        kategori: 'Pendaratan', 
        tarif: Number(lnd.tarif), 
        qty: 1, 
        subtotal: Number(lnd.tarif) 
      });
    }

    // 2. Pax Tax (Per Orang)
    const pax = masterTaxes.find((t) => t.kategori === 'Penumpang' && t.kode_tax === 'TAX-PAX-DOM') || masterTaxes.find((t) => t.kategori === 'Penumpang');
    const paxQty = Math.max(1, passengersCount);
    if (pax) {
      taxes.push({ 
        nama_tax: 'Tax Pelayanan Penumpang (PJP2U)', 
        kategori: 'Penumpang', 
        tarif: Number(pax.tarif), 
        qty: paxQty, 
        subtotal: Number(pax.tarif) * paxQty 
      });
    }

    // 3. Airport Tax (1 item Jasa Pelayanan Kebandarudaraan)
    const apt = masterTaxes.find((t) => t.kategori === 'Airport' && t.kode_tax === 'TAX-APT-SRV') || masterTaxes.find((t) => t.kategori === 'Airport');
    if (apt) {
      taxes.push({ 
        nama_tax: 'Tax Airport (Jasa Kebandarudaraan)', 
        kategori: 'Airport', 
        tarif: Number(apt.tarif), 
        qty: 1, 
        subtotal: Number(apt.tarif) 
      });
    }

    // 4. Parkir ATAU Nginap (Hanya salah satu)
    if (isOvernight) {
      const ronTaxes = masterTaxes.filter((t) => t.kategori === 'Nginap');
      let ron = null;
      if (typeId) ron = ronTaxes.find((t) => t.aircraft_type_id === typeId);
      if (!ron) ron = ronTaxes[0];
      if (ron) {
        const nights = Math.max(1, overnightNights);
        taxes.push({ 
          nama_tax: `Tax Nginap Apron / RON (${nights} Malam)`, 
          kategori: 'Nginap', 
          tarif: Number(ron.tarif), 
          qty: nights, 
          subtotal: Number(ron.tarif) * nights 
        });
      }
    } else {
      const parkTaxes = masterTaxes.filter((t) => t.kategori === 'Parkir');
      let prk = null;
      if (typeId) prk = parkTaxes.find((t) => t.aircraft_type_id === typeId);
      if (!prk) prk = parkTaxes[0];
      if (prk) {
        taxes.push({ 
          nama_tax: 'Tax Parkir Apron (Transit)', 
          kategori: 'Parkir', 
          tarif: Number(prk.tarif), 
          qty: 1, 
          subtotal: Number(prk.tarif) 
        });
      }
    }

    const total = taxes.reduce((acc, curr) => acc + curr.subtotal, 0);
    return { taxes, total };
  }, [selectedApp, masterTaxes, appSpec, passengersCount, isOvernight, overnightNights]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) {
      toast.error('Pilih permohonan pendaratan yang valid');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('application_id', selectedAppId);
      fd.append('entry_time', entryTime);
      if (exitTime) {
        fd.append('exit_time', exitTime);
      }
      fd.append('passengers_count', String(passengersCount));
      fd.append('is_overnight', String(isOvernight));
      fd.append('overnight_nights', String(isOvernight ? overnightNights : 0));
      fd.append('parking_stand', parkingStand);
      fd.append('remarks', remarks);
      if (evidencePhoto) {
        fd.append('evidence_photo', evidencePhoto);
      }

      await miniAirportLogService.createMiniAirportLog(fd);
      toast.success('Realisasi fisik pendaratan berhasil dicatat! Data masuk ke antrean penetapan SKRD Dinas.');
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Gagal menyimpan realisasi pendaratan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAppId('');
    setEntryTime(dayjs().format('YYYY-MM-DDTHH:mm'));
    setExitTime('');
    setPassengersCount(1);
    setIsOvernight(false);
    setOvernightNights(1);
    setParkingStand('STAND 01');
    setRemarks('');
    setEvidencePhoto(null);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const q = searchTerm.toLowerCase();
    return logs.filter((l) => {
      const reg = (l.registration_number || '').toLowerCase();
      const tenant = (l.tenants?.nama_perusahaan || '').toLowerCase();
      const airport = (l.parsedNotes?.airport_name || '').toLowerCase();
      const appNum = (l.rental_applications?.application_number || '').toLowerCase();
      return reg.includes(q) || tenant.includes(q) || airport.includes(q) || appNum.includes(q);
    });
  }, [logs, searchTerm]);

  // KPIs
  const unbilledCount = useMemo(() => logs.filter((l) => l.billing_status === 'Unbilled').length, [logs]);
  const billedCount = useMemo(() => logs.filter((l) => l.billing_status === 'Billed').length, [logs]);
  const overnightCount = useMemo(() => logs.filter((l) => l.is_overnight === true).length, [logs]);

  // Stand status active check
  const stand1Occupied = useMemo(() => {
    return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('01'));
  }, [logs]);

  const stand2Occupied = useMemo(() => {
    return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('02'));
  }, [logs]);

  const displayAirport = useMemo(() => {
    if (!user?.airport_name) return 'Bandara Perintis Papua Tengah';
    if (user.airport_name.toLowerCase().startsWith('mini airport')) {
      return user.airport_name.replace(/^mini airport\s+/i, 'Bandara ');
    }
    return user.airport_name;
  }, [user?.airport_name]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* 1. Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">
              Dashboard Operasional
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#3c8dbc] border border-blue-200">
              <TowerControl className="w-3 h-3 text-[#3c8dbc]" />
              {displayAirport}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan realisasi fisik pendaratan, alokasi stand apron, dan checkout armada
          </p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Petugas Mini Airport</span> /{' '}
          <span className="ml-1 font-medium text-slate-800">Dashboard Operasional</span>
        </div>
      </header>

      {/* 2. Stat Boxes (Small Box Style) - Konsisten Warna Biru Mozes Kilangin */}
      <MiniAirportKPICards
        eligibleAppsCount={eligibleApps.length}
        unbilledCount={unbilledCount}
        billedCount={billedCount}
        overnightCount={overnightCount}
      />

      {/* 3. Visual Status Keterisian Apron (Stand 01 & Stand 02) */}
      <StandCapacityCards
        stand1Occupied={stand1Occupied}
        stand2Occupied={stand2Occupied}
      />

      {/* 4. Main Data Container Card */}
      <MiniAirportLogTable
        logs={logs}
        filteredLogs={filteredLogs}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenModal={() => {
          resetForm();
          setShowModal(true);
        }}
        onPreviewPhoto={(url) => setPreviewPhotoUrl(url)}
        onCheckout={(log) => {
          setCheckoutTargetLog(log);
          setShowCheckoutModal(true);
        }}
      />

      {/* 5. MODAL: CATAT REALISASI PENDARATAN */}
      <CatatRealisasiModal
        isOpen={showModal}
        isSubmitting={isSubmitting}
        eligibleApps={eligibleApps}
        selectedAppId={selectedAppId}
        setSelectedAppId={setSelectedAppId}
        selectedApp={selectedApp}
        appSpec={appSpec}
        entryTime={entryTime}
        setEntryTime={setEntryTime}
        exitTime={exitTime}
        setExitTime={setExitTime}
        passengersCount={passengersCount}
        setPassengersCount={setPassengersCount}
        parkingStand={parkingStand}
        setParkingStand={setParkingStand}
        isOvernight={isOvernight}
        setIsOvernight={setIsOvernight}
        overnightNights={overnightNights}
        setOvernightNights={setOvernightNights}
        taxSimulation={taxSimulation}
        remarks={remarks}
        setRemarks={setRemarks}
        setEvidencePhoto={setEvidencePhoto}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* 6. MODAL: CHECKOUT KEBERANGKATAN ARMADA */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        log={checkoutTargetLog}
        masterTaxes={masterTaxes}
        onClose={() => {
          setShowCheckoutModal(false);
          setCheckoutTargetLog(null);
        }}
        onSuccess={loadData}
      />

      {/* 7. MODAL PREVIEW FOTO */}
      <PhotoPreviewModal
        previewPhotoUrl={previewPhotoUrl}
        onClose={() => setPreviewPhotoUrl(null)}
      />
    </div>
  );
}

export default function PetugasMiniAirportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 bg-[#ecf0f5] min-h-screen">
          Memuat data realisasi Mini Airport...
        </div>
      }
    >
      <PetugasMiniAirportContent />
    </Suspense>
  );
}
