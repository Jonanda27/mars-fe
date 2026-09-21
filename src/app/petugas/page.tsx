"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { flightScheduleService } from '@/services/flightScheduleService';
import { logService } from '@/services/logService';
import { rentalService } from '@/services/rentalService';
import { overnightReportService } from '@/services/overnightReportService';
import { FlightSchedule } from '@/types/flightSchedule';
import toast from 'react-hot-toast';

import { PetugasKPICards } from './components/dashboard/PetugasKPICards';
import { ApprovedScheduleCheckinTable } from './components/dashboard/ApprovedScheduleCheckinTable';
import { ActiveHangarAircraftTable } from './components/dashboard/ActiveHangarAircraftTable';
import { ManualCheckinModal } from './components/dashboard/ManualCheckinModal';
import { CheckoutAircraftModal } from './components/dashboard/CheckoutAircraftModal';

export default function PetugasDashboardPage() {
  // Operasional Check-In / Check-Out states
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  
  // Today Expected Arrivals
  const [todayArrivals, setTodayArrivals] = useState<FlightSchedule[]>([]);
  const [isLoadingTodayArrivals, setIsLoadingTodayArrivals] = useState(false);
  const [isCheckingInSchedule, setIsCheckingInSchedule] = useState<number | null>(null);

  // Today Closing Status (Slide 8 PPTX)
  const [closingData, setClosingData] = useState<{ is_already_submitted: boolean; existing_report: any } | null>(null);

  // Manual Check-In Modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [parkingLocation, setParkingLocation] = useState('Hanggar');
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check-Out Modal
  const [isCheckingOut, setIsCheckingOut] = useState<number | null>(null);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkOutLogId, setCheckOutLogId] = useState<number | null>(null);
  const [checkOutRegistration, setCheckOutRegistration] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');

  // Search filter
  const [searchLogTerm, setSearchLogTerm] = useState('');

  const fetchClosingStatus = useCallback(async () => {
    try {
      const data = await overnightReportService.getTodayDraftRoster();
      setClosingData(data || null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchActiveLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const data = await logService.getActiveLogs();
      setActiveLogs(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  const fetchTodayArrivals = useCallback(async () => {
    try {
      setIsLoadingTodayArrivals(true);
      const data = await flightScheduleService.getTodayExpectedArrivals();
      setTodayArrivals(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTodayArrivals(false);
    }
  }, []);

  const fetchActiveApplications = useCallback(async () => {
    try {
      const data = await rentalService.getApprovedRentals();
      setApplications(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchActiveLogs();
    fetchTodayArrivals();
    fetchActiveApplications();
    fetchClosingStatus();
  }, [fetchActiveLogs, fetchTodayArrivals, fetchActiveApplications, fetchClosingStatus]);

  // 1-Click Check-In from Approved Schedule
  const handleCheckInFromSchedule = async (schedule: FlightSchedule) => {
    if (!confirm(`Konfirmasi Check-In kedatangan fisik pesawat ${schedule.registration_number} (${schedule.tenant?.nama_perusahaan}) ke ${schedule.parking_location}?`)) {
      return;
    }

    try {
      setIsCheckingInSchedule(schedule.id);
      await flightScheduleService.checkInFromSchedule(schedule.id, {
        parking_location: schedule.parking_location,
        notes: `Check-In oleh petugas lapangan dari jadwal no. ${schedule.schedule_number}`
      });

      toast.success(`Check-In armada ${schedule.registration_number} berhasil dicatat!`);
      fetchTodayArrivals();
      fetchActiveLogs();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal melakukan check-in dari jadwal';
      toast.error(msg);
    } finally {
      setIsCheckingInSchedule(null);
    }
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication || !registrationNumber || !evidencePhoto) {
      toast.error('Mohon lengkapi semua data dan foto bukti');
      return;
    }

    const app = applications.find(a => a.id.toString() === selectedApplication);

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('application_id', selectedApplication);
      if (app?.contract_id) {
        formData.append('contract_id', app.contract_id.toString());
      }
      formData.append('registration_number', registrationNumber.toUpperCase());
      formData.append('tenant_id', app?.tenant_id.toString());
      if (app?.asset_id) {
        formData.append('asset_id', app.asset_id.toString());
      }
      formData.append('parking_location', parkingLocation);
      if (notes) {
        formData.append('notes', notes);
      }
      formData.append('entry_time', new Date().toISOString());
      formData.append('log_evidence', evidencePhoto);

      await logService.createEntryLog(formData);

      toast.success('Check-In Pesawat Berhasil!');
      setShowCheckInModal(false);
      setRegistrationNumber('');
      setEvidencePhoto(null);
      setNotes('');
      fetchActiveLogs();
    } catch (error) {
      console.error(error);
      toast.error('Gagal melakukan check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCheckOutModal = (logId: number, registration: string) => {
    setCheckOutLogId(logId);
    setCheckOutRegistration(registration);
    setCheckOutNotes('');
    setShowCheckOutModal(true);
  };

  const submitCheckOut = async () => {
    if (!checkOutLogId) return;

    try {
      setIsCheckingOut(checkOutLogId);
      await logService.createExitLog(checkOutLogId, {
        exit_time: new Date().toISOString(),
        notes: checkOutNotes
      });
      fetchActiveLogs();
      setShowCheckOutModal(false);
      toast.success('Check-Out Pesawat Berhasil!');
    } catch (error) {
      console.error(error);
      toast.error('Gagal melakukan check-out');
    } finally {
      setIsCheckingOut(null);
      setCheckOutLogId(null);
    }
  };

  const filteredLogs = useMemo(() => {
    const s = searchLogTerm.toLowerCase();
    return activeLogs.filter(log => {
      return !searchLogTerm ||
        (log.registration_number || '').toLowerCase().includes(s) ||
        (log.tenants?.nama_perusahaan || '').toLowerCase().includes(s) ||
        (log.parking_location || '').toLowerCase().includes(s);
    });
  }, [activeLogs, searchLogTerm]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Log Operasional Hanggar &amp; Apron{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Petugas</span> / <span className="ml-1 font-medium text-slate-800">Log Operasional</span>
        </div>
      </header>

      {/* Stat Boxes & Banner Status Tutup Hari */}
      <PetugasKPICards
        activeLogsCount={activeLogs.length}
        todayArrivalsCount={todayArrivals.length}
        closingData={closingData}
      />

      {/* CARD 1: RENCANA KEDATANGAN HARI INI (1-CLICK CHECK-IN) */}
      <ApprovedScheduleCheckinTable
        todayArrivals={todayArrivals}
        isLoadingTodayArrivals={isLoadingTodayArrivals}
        isCheckingInSchedule={isCheckingInSchedule}
        onRefresh={fetchTodayArrivals}
        onCheckInFromSchedule={handleCheckInFromSchedule}
      />

      {/* CARD 2: DAFTAR PESAWAT PARKIR SAAT INI (LOG OPERASIONAL AKTIF) */}
      <ActiveHangarAircraftTable
        activeLogs={activeLogs}
        filteredLogs={filteredLogs}
        isLoadingLogs={isLoadingLogs}
        searchLogTerm={searchLogTerm}
        setSearchLogTerm={setSearchLogTerm}
        onOpenCheckInModal={() => setShowCheckInModal(true)}
        onOpenCheckOutModal={openCheckOutModal}
      />

      {/* MODAL MANUAL CHECK-IN */}
      <ManualCheckinModal
        isOpen={showCheckInModal}
        applications={applications}
        selectedApplication={selectedApplication}
        setSelectedApplication={setSelectedApplication}
        registrationNumber={registrationNumber}
        setRegistrationNumber={setRegistrationNumber}
        parkingLocation={parkingLocation}
        setParkingLocation={setParkingLocation}
        setEvidencePhoto={setEvidencePhoto}
        notes={notes}
        setNotes={setNotes}
        isSubmitting={isSubmitting}
        onClose={() => setShowCheckInModal(false)}
        onSubmit={handleManualCheckIn}
      />

      {/* MODAL CHECK-OUT */}
      <CheckoutAircraftModal
        isOpen={showCheckOutModal}
        checkOutRegistration={checkOutRegistration}
        checkOutNotes={checkOutNotes}
        setCheckOutNotes={setCheckOutNotes}
        isCheckingOut={isCheckingOut}
        onClose={() => setShowCheckOutModal(false)}
        onSubmit={submitCheckOut}
      />
    </div>
  );
}
