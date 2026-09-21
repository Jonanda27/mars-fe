"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { contractService } from '@/services/contractService';
import { aircraftService } from '@/services/aircraftService';
import { flightScheduleService } from '@/services/flightScheduleService';
import { rentalService } from '@/services/rentalService';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { FlightSchedule } from '@/types/flightSchedule';
import { RentalApplication } from '@/types/rental';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { PayungContractStatusBanner } from './components/PayungContractStatusBanner';
import { CreateScheduleModal } from './components/CreateScheduleModal';
import { ScheduleRosterTable } from './components/ScheduleRosterTable';

export default function TenantJadwalHanggarPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [allTenantAircrafts, setAllTenantAircrafts] = useState<Aircraft[]>([]);
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [rentalApplications, setRentalApplications] = useState<RentalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('08:00');
  const [notes, setNotes] = useState<string>('');

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [contractData, aircraftData, scheduleData, rentalAppData] = await Promise.all([
        contractService.getTenantContracts(),
        aircraftService.getTenantAircrafts(),
        flightScheduleService.getTenantSchedules(),
        rentalService.getTenantApplications()
      ]);
      setContracts(contractData || []);
      setAllTenantAircrafts(aircraftData || []);
      setSchedules(scheduleData || []);
      setRentalApplications(rentalAppData || []);
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
    return contracts.find(c => c.contract_type === 'Payung' && (c.status === 'Aktif' || c.status === 'Active')) || null;
  }, [contracts]);

  // Permohonan Sewa Hanggar Terkait
  const hanggarApplication = useMemo(() => {
    const hanggarApps = rentalApplications.filter(a => a.application_type === 'Sewa Hanggar');

    const activeWithDates = hanggarApps.find(a => 
      ['Aktif', 'Active', 'Disetujui', 'Approved', 'Signed', 'Draft Kontrak', 'Surat Disetujui'].includes(a.status || '') && 
      a.start_date && a.end_date
    );
    if (activeWithDates) return activeWithDates;

    const anyWithDates = hanggarApps.find(a => a.start_date && a.end_date);
    if (anyWithDates) return anyWithDates;

    if (activePayung?.rental_applications && activePayung.rental_applications.length > 0) {
      const fromPayung = activePayung.rental_applications.find((a: any) => a.application_type === 'Sewa Hanggar' && a.start_date && a.end_date)
        || activePayung.rental_applications.find((a: any) => a.start_date && a.end_date)
        || activePayung.rental_applications[0];
      if (fromPayung) return fromPayung;
    }

    return hanggarApps[0] || null;
  }, [rentalApplications, activePayung]);

  // Periode Layanan Sewa Hanggar
  const serviceStartDate = useMemo(() => {
    return hanggarApplication?.start_date || null;
  }, [hanggarApplication]);

  const serviceEndDate = useMemo(() => {
    return hanggarApplication?.end_date || null;
  }, [hanggarApplication]);

  const isServiceExpired = useMemo(() => {
    if (!serviceEndDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(serviceEndDate) < today;
  }, [serviceEndDate]);

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

  // Batas Minimal dan Maksimal Tanggal
  const leaseMinDate = useMemo(() => {
    if (!serviceStartDate) return '';
    return dayjs(serviceStartDate).format('YYYY-MM-DD');
  }, [serviceStartDate]);

  const leaseMaxDate = useMemo(() => {
    if (!serviceEndDate) return '';
    return dayjs(serviceEndDate).format('YYYY-MM-DD');
  }, [serviceEndDate]);

  // Filter Armada yang Terdaftar pada Kontrak / Akun Tenant
  const allowedAircrafts = useMemo(() => {
    if (!activePayung) return allTenantAircrafts;
    
    const specNeeds = hanggarApplication?.specific_needs as any;
    const registeredIds: string[] = specNeeds?.aircraft_ids || [];

    if (registeredIds.length > 0) {
      const filtered = allTenantAircrafts.filter(a => registeredIds.includes(String(a.id)));
      if (filtered.length > 0) return filtered;
    }

    return allTenantAircrafts;
  }, [activePayung, hanggarApplication, allTenantAircrafts]);

  // Auto-select armada pertama jika belum ada yang terpilih
  useEffect(() => {
    if (allowedAircrafts.length > 0 && (!selectedAircraftId || !allowedAircrafts.some(a => String(a.id) === selectedAircraftId))) {
      setSelectedAircraftId(String(allowedAircrafts[0].id));
    }
  }, [allowedAircrafts, selectedAircraftId]);

  // Detail Armada yang Sedang Dipilih
  const selectedAircraft = useMemo(() => {
    if (!selectedAircraftId) return allowedAircrafts[0] || null;
    return allowedAircrafts.find(a => String(a.id) === selectedAircraftId) || allowedAircrafts[0] || null;
  }, [allowedAircrafts, selectedAircraftId]);

  // Lokasi Aset Hanggar
  const locationName = useMemo(() => {
    return hanggarApplication?.assets?.nama_aset || activePayung?.assets?.nama_aset || 'Hanggar Utama Mozes Kilangin';
  }, [hanggarApplication, activePayung]);

  const handleOpenModal = () => {
    if (allowedAircrafts.length > 0) {
      setSelectedAircraftId(String(allowedAircrafts[0].id));
    }
    const todayStr = dayjs().format('YYYY-MM-DD');
    const minD = serviceStartDate ? dayjs(serviceStartDate).format('YYYY-MM-DD') : '';
    const maxD = serviceEndDate ? dayjs(serviceEndDate).format('YYYY-MM-DD') : '';

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
    if (!arrivalDate) {
      toast.error('Tentukan tanggal estimasi kedatangan');
      return;
    }

    if (!serviceStartDate || !serviceEndDate) {
      toast.error('Periode sewa hanggar belum ditentukan pada permohonan sewa');
      return;
    }

    const estimatedArrival = `${arrivalDate}T${arrivalTime || '08:00'}`;

    const leaseStart = new Date(serviceStartDate);
    const leaseEnd = new Date(serviceEndDate);
    leaseStart.setHours(0, 0, 0, 0);
    leaseEnd.setHours(23, 59, 59, 999);

    const arrDate = new Date(estimatedArrival);
    if (arrDate < leaseStart) {
      toast.error(`Tanggal kedatangan tidak boleh sebelum tanggal mulai sewa (${dayjs(serviceStartDate).format('DD/MM/YYYY')})`);
      return;
    }
    if (arrDate > leaseEnd) {
      toast.error(`Tanggal kedatangan tidak boleh melebihi batas akhir periode sewa (${dayjs(serviceEndDate).format('DD/MM/YYYY')})`);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('aircraft_id', String(selectedAircraft.id));
      formData.append('parking_location', locationName);
      formData.append('purpose', 'Inap / RON');
      formData.append('estimated_arrival', estimatedArrival);
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
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Jadwal Pemakaian Hanggar &amp; Apron{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium text-slate-800">Jadwal Hanggar</span>
        </div>
      </header>

      {/* BANNER STATUS KONTRAK & PERIODE SEWA */}
      <PayungContractStatusBanner
        activePayung={activePayung}
        isPayungExpired={isPayungExpired}
        isPayungExpiringSoon={isPayungExpiringSoon}
        daysUntilPayungExpired={daysUntilPayungExpired}
        serviceStartDate={serviceStartDate}
        serviceEndDate={serviceEndDate}
        isServiceExpired={isServiceExpired}
        locationName={locationName}
        onOpenModal={handleOpenModal}
      />

      {/* MODAL FORM PENGAJUAN JADWAL */}
      <CreateScheduleModal
        isOpen={isFormOpen && Boolean(activePayung && !isPayungExpired && serviceStartDate && serviceEndDate && !isServiceExpired)}
        activePayung={activePayung}
        locationName={locationName}
        serviceStartDate={serviceStartDate}
        serviceEndDate={serviceEndDate}
        allowedAircrafts={allowedAircrafts}
        selectedAircraft={selectedAircraft}
        selectedAircraftId={selectedAircraftId}
        setSelectedAircraftId={setSelectedAircraftId}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        arrivalTime={arrivalTime}
        setArrivalTime={setArrivalTime}
        leaseMinDate={leaseMinDate}
        leaseMaxDate={leaseMaxDate}
        notes={notes}
        setNotes={setNotes}
        isSubmitting={isSubmitting}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* TABEL RIWAYAT JADWAL PENERBANGAN */}
      <ScheduleRosterTable schedules={schedules} />
    </div>
  );
}
