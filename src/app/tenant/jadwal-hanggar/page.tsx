"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { contractService } from '@/services/contractService';
import { aircraftService } from '@/services/aircraftService';
import { flightScheduleService } from '@/services/flightScheduleService';
import { rentalService } from '@/services/rentalService';
import { logService } from '@/services/logService';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { FlightSchedule } from '@/types/flightSchedule';
import { RentalApplication } from '@/types/rental';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { PayungContractStatusBanner } from './components/PayungContractStatusBanner';
import { CreateScheduleModal, AircraftWithBooking } from './components/CreateScheduleModal';
import { ScheduleRosterTable } from './components/ScheduleRosterTable';
import { RequestExtensionModal } from './components/RequestExtensionModal';

export default function TenantJadwalHanggarPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [allTenantAircrafts, setAllTenantAircrafts] = useState<Aircraft[]>([]);
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [rentalApplications, setRentalApplications] = useState<RentalApplication[]>([]);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('08:00');
  const [notes, setNotes] = useState<string>('');

  // State Modal Perpanjangan Sewa
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [selectedAppForExtension, setSelectedAppForExtension] = useState<RentalApplication | null>(null);

  const handleOpenExtensionModal = (app: RentalApplication) => {
    setSelectedAppForExtension(app);
    setIsExtensionModalOpen(true);
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [contractData, aircraftData, scheduleData, rentalAppData, activeLogData] = await Promise.all([
        contractService.getTenantContracts(),
        aircraftService.getTenantAircrafts(),
        flightScheduleService.getTenantSchedules(),
        rentalService.getTenantApplications(),
        logService.getActiveLogs().catch(() => [])
      ]);
      setContracts(contractData || []);
      setAllTenantAircrafts(aircraftData || []);
      setSchedules(scheduleData || []);
      setRentalApplications(rentalAppData || []);
      setActiveLogs(activeLogData || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data jadwal');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Kontrak Payung Aktif (PKS Induk)
  const activePayung = useMemo(() => {
    const payungList = contracts.filter(c => {
      const type = (c.contract_type || '').toLowerCase();
      const num = (c.contract_number || '').toUpperCase();
      const isPayung = type === 'payung' || type.includes('payung') || num.includes('PAYUNG');
      const isAktif = ['aktif', 'active'].includes((c.status || '').toLowerCase());
      return isPayung && isAktif;
    });

    if (payungList.length === 0) return null;

    // Prioritaskan kontrak Payung Mozes Kilangin jika ada
    const mozesPayung = payungList.find(c => {
      const type = (c.contract_type || '').toLowerCase();
      const num = (c.contract_number || '').toUpperCase();
      return type.includes('mozes') || num.includes('MOZES') || (!type.includes('mini') && !num.includes('ILA') && !num.includes('EWI') && !num.includes('UGU'));
    });

    return mozesPayung || payungList[0];
  }, [contracts]);

  // Daftar Semua Permohonan Sewa Hanggar & Apron Aktif Milik Tenant
  const activeHanggarApps = useMemo(() => {
    return rentalApplications
      .filter(a => 
        (a.application_type === 'Sewa Hanggar' || a.application_type === 'Sewa Apron' || ['Hanggar', 'Apron'].includes(a.assets?.jenis_aset || '')) &&
        ['Aktif', 'Active', 'Disetujui', 'Approved', 'Signed', 'Draft Kontrak', 'Surat Disetujui'].includes(a.status || '') &&
        a.start_date && a.end_date
      )
      .sort((a, b) => b.id - a.id);
  }, [rentalApplications]);

  // Validasi Masa Berlaku Kontrak Payung
  const isPayungExpired = useMemo(() => {
    if (!activePayung?.end_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(activePayung.end_date) < today;
  }, [activePayung]);

  const daysUntilPayungExpired = useMemo(() => {
    if (!activePayung?.end_date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(activePayung.end_date);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [activePayung]);

  const isPayungExpiringSoon = daysUntilPayungExpired !== null && daysUntilPayungExpired > 0 && daysUntilPayungExpired <= 7;

  // Pemetaan Pintar (Smart Linking): Setiap Armada dikaitkan ke Izin Sewa Permohonannya & Status Kunci
  const allowedAircrafts = useMemo<AircraftWithBooking[]>(() => {
    if (!activePayung || activeHanggarApps.length === 0) return [];

    return allTenantAircrafts.map(ac => {
      // 1. Cari permohonan yang mendaftarkan pesawat ini di specific_needs
      const matchedApp = activeHanggarApps.find(app => {
        const spec = typeof app.specific_needs === 'string' 
          ? JSON.parse(app.specific_needs) 
          : (app.specific_needs || {});
        const ids = (spec.aircraft_ids || []).map(String);
        return ids.includes(String(ac.id));
      });

      const chosenApp = matchedApp || activeHanggarApps[0];

      // 2. Evaluasi Status Kunci (Sudah buat pengajuan / diverifikasi / check-in tapi belum checkout)
      const acRegUpper = (ac.registration_number || '').trim().toUpperCase();

      const activeLogForAc = activeLogs.find((l: any) => 
        (l.registration_number || '').trim().toUpperCase() === acRegUpper && 
        !l.exit_time
      );

      const activeScheduleForAc = schedules.find(s => 
        (s.registration_number || '').trim().toUpperCase() === acRegUpper && 
        ['Menunggu Verifikasi Petugas', 'Disetujui', 'Checked-In'].includes(s.status)
      );

      let isLocked = false;
      let lockReason = '';
      let lockBadge = '';

      if (activeLogForAc || activeScheduleForAc?.status === 'Checked-In') {
        isLocked = true;
        const loc = activeLogForAc?.parking_location || 'Hanggar';
        lockReason = `saat ini sedang aktif berada di dalam ${loc} (sudah Check-In) dan belum melakukan Check-Out`;
        lockBadge = 'Sedang Parkir (Belum Check-Out)';
      } else if (activeScheduleForAc?.status === 'Disetujui') {
        isLocked = true;
        lockReason = `sudah memiliki jadwal yang telah disetujui petugas (No. ${activeScheduleForAc.schedule_number}) dan sedang menunggu kedatangan`;
        lockBadge = 'Jadwal Sudah Disetujui';
      } else if (activeScheduleForAc?.status === 'Menunggu Verifikasi Petugas') {
        isLocked = true;
        lockReason = `masih memiliki pengajuan jadwal yang sedang menunggu verifikasi petugas lapangan (No. ${activeScheduleForAc.schedule_number})`;
        lockBadge = 'Sedang Menunggu Verifikasi';
      }

      return {
        ...ac,
        bookingApp: chosenApp,
        bookingNumber: chosenApp?.application_number,
        bookingPeriodStr: chosenApp ? `${dayjs(chosenApp.start_date).format('DD MMM')} – ${dayjs(chosenApp.end_date).format('DD MMM YYYY')}` : undefined,
        bookingMinDate: chosenApp?.start_date ? dayjs(chosenApp.start_date).format('YYYY-MM-DD') : undefined,
        bookingMaxDate: chosenApp?.end_date ? dayjs(chosenApp.end_date).format('YYYY-MM-DD') : undefined,
        isLocked,
        lockReason,
        lockBadge
      };
    })
    .filter(ac => Boolean(ac.bookingApp))
    .sort((a, b) => (a.isLocked === b.isLocked ? 0 : a.isLocked ? 1 : -1)); // Tersedia di urutan teratas
  }, [activePayung, activeHanggarApps, allTenantAircrafts, activeLogs, schedules]);

  // Auto-select armada pertama yang tersedia (tidak terkunci)
  useEffect(() => {
    if (allowedAircrafts.length > 0) {
      const firstAvailable = allowedAircrafts.find(a => !a.isLocked) || allowedAircrafts[0];
      if (!selectedAircraftId || !allowedAircrafts.some(a => String(a.id) === selectedAircraftId)) {
        setSelectedAircraftId(String(firstAvailable.id));
      }
    }
  }, [allowedAircrafts, selectedAircraftId]);

  // Detail Armada yang Sedang Dipilih
  const selectedAircraft = useMemo<AircraftWithBooking | null>(() => {
    if (!selectedAircraftId) return allowedAircrafts[0] || null;
    return allowedAircrafts.find(a => String(a.id) === selectedAircraftId) || allowedAircrafts[0] || null;
  }, [allowedAircrafts, selectedAircraftId]);

  // Sinkronisasi Tanggal Kedatangan Otomatis saat Pesawat Berubah
  useEffect(() => {
    if (selectedAircraft?.bookingMinDate && selectedAircraft?.bookingMaxDate) {
      const todayStr = dayjs().format('YYYY-MM-DD');
      const minD = selectedAircraft.bookingMinDate;
      const maxD = selectedAircraft.bookingMaxDate;

      // Jika tanggal belum ada atau berada di luar rentang sewa pesawat ini
      if (!arrivalDate || arrivalDate < minD || arrivalDate > maxD) {
        if (todayStr >= minD && todayStr <= maxD) {
          setArrivalDate(todayStr);
        } else {
          setArrivalDate(minD);
        }
      }
    }
  }, [selectedAircraft, arrivalDate]);

  // Map Referensi Tiket Sewa untuk Tabel Roster
  const aircraftBookingMap = useMemo(() => {
    const map: Record<string, { appNumber: string; periodStr: string }> = {};
    for (const ac of allowedAircrafts) {
      if (ac.bookingApp) {
        const info = {
          appNumber: ac.bookingApp.application_number,
          periodStr: `${dayjs(ac.bookingApp.start_date).format('DD MMM')} – ${dayjs(ac.bookingApp.end_date).format('DD MMM YYYY')}`
        };
        map[ac.registration_number] = info;
        map[String(ac.id)] = info;
      }
    }
    return map;
  }, [allowedAircrafts]);

  // Lokasi Aset (Hanggar / Apron)
  const locationName = useMemo(() => {
    if (selectedAircraft?.bookingApp?.assets?.nama_aset) {
      return selectedAircraft.bookingApp.assets.nama_aset;
    }
    return activeHanggarApps[0]?.assets?.nama_aset || activePayung?.assets?.nama_aset || 'Hanggar Mozes Kilangin';
  }, [selectedAircraft, activeHanggarApps, activePayung]);

  const handleOpenModal = () => {
    const firstAvailable = allowedAircrafts.find(a => !a.isLocked) || allowedAircrafts[0];
    if (firstAvailable) {
      setSelectedAircraftId(String(firstAvailable.id));
    }
    const targetAircraft = firstAvailable;
    const todayStr = dayjs().format('YYYY-MM-DD');
    const minD = targetAircraft?.bookingMinDate || '';
    const maxD = targetAircraft?.bookingMaxDate || '';

    if (minD && maxD && todayStr >= minD && todayStr <= maxD) {
      setArrivalDate(todayStr);
    } else if (minD) {
      setArrivalDate(minD);
    }
    setArrivalTime(dayjs().format('HH:mm') || '08:00');
    setNotes('');
    setIsFormOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAircraft) {
      toast.error('Pilih armada pesawat yang akan mendarat');
      return;
    }
    if (selectedAircraft.isLocked) {
      toast.error(`Armada ${selectedAircraft.registration_number} ${selectedAircraft.lockReason}. Tidak dapat mengajukan jadwal.`);
      return;
    }
    if (!arrivalDate) {
      toast.error('Tentukan tanggal estimasi kedatangan');
      return;
    }

    const minD = selectedAircraft.bookingMinDate;
    const maxD = selectedAircraft.bookingMaxDate;

    if (!minD || !maxD) {
      toast.error('Periode sewa armada belum ditentukan pada permohonan sewa');
      return;
    }

    if (arrivalDate < minD || arrivalDate > maxD) {
      toast.error(`Tanggal kedatangan wajib berada dalam periode sewa armada ${selectedAircraft.registration_number} (${dayjs(minD).format('DD/MM/YYYY')} s/d ${dayjs(maxD).format('DD/MM/YYYY')})`);
      return;
    }

    const estimatedArrival = `${arrivalDate}T${arrivalTime || '08:00'}:00.000Z`;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('aircraft_id', String(selectedAircraft.id));
      formData.append('registration_number', selectedAircraft.registration_number);
      formData.append('aircraft_type', selectedAircraft.aircraft_types?.jenis_pesawat || 'Standar');
      formData.append('parking_location', locationName);
      formData.append('purpose', 'Inap / RON');
      formData.append('estimated_arrival', estimatedArrival);
      if (selectedAircraft.bookingApp?.id) {
        formData.append('rental_application_id', String(selectedAircraft.bookingApp.id));
      }
      if (notes) {
        formData.append('notes', notes);
      }

      await flightScheduleService.createSchedule(formData);
      toast.success(`Pengajuan jadwal untuk armada ${selectedAircraft.registration_number} berhasil dikirim! Menunggu verifikasi Petugas Lapangan.`);
      setIsFormOpen(false);
      setArrivalDate('');
      setNotes('');
      await fetchInitialData();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Gagal mengajukan jadwal';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Jadwal Pemakaian Hanggar &amp; Apron{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Jadwal Hanggar</span>
        </div>
      </header>

      {/* BANNER STATUS KONTRAK & PERIODE SEWA (Mendukung Multi-Permohonan Sewa Aktif) */}
      <PayungContractStatusBanner
        activePayung={activePayung}
        isPayungExpired={isPayungExpired}
        isPayungExpiringSoon={isPayungExpiringSoon}
        daysUntilPayungExpired={daysUntilPayungExpired}
        activeHanggarApps={activeHanggarApps}
        locationName={locationName}
        onOpenModal={handleOpenModal}
        onRequestExtension={handleOpenExtensionModal}
      />

      {/* MODAL FORM PENGAJUAN JADWAL (Smart Selection per Armada) */}
      <CreateScheduleModal
        isOpen={isFormOpen && Boolean(activePayung && !isPayungExpired && activeHanggarApps.length > 0)}
        activePayung={activePayung}
        locationName={locationName}
        allowedAircrafts={allowedAircrafts}
        selectedAircraft={selectedAircraft}
        selectedAircraftId={selectedAircraftId}
        setSelectedAircraftId={setSelectedAircraftId}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        arrivalTime={arrivalTime}
        setArrivalTime={setArrivalTime}
        notes={notes}
        setNotes={setNotes}
        isSubmitting={isSubmitting}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* MODAL PENGAJUAN TAMBAH SEWA / PERPANJANGAN */}
      <RequestExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => {
          setIsExtensionModalOpen(false);
          setSelectedAppForExtension(null);
        }}
        application={selectedAppForExtension}
        onSuccess={fetchInitialData}
      />

      {/* TABEL RIWAYAT JADWAL PENERBANGAN */}
      <ScheduleRosterTable 
        schedules={schedules} 
        aircraftBookingMap={aircraftBookingMap} 
      />
    </div>
  );
}
