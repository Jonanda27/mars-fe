"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { flightScheduleService } from '@/services/flightScheduleService';
import { logService } from '@/services/logService';
import { FlightSchedule } from '@/types/flightSchedule';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Plane, Clock, AlertTriangle, Search, RefreshCw 
} from 'lucide-react';

import { ApprovedScheduleCheckinTable } from '../components/dashboard/ApprovedScheduleCheckinTable';
import { ActiveHangarAircraftTable } from '../components/dashboard/ActiveHangarAircraftTable';
import { CheckoutAircraftModal } from '../components/dashboard/CheckoutAircraftModal';
import { EmergencyCheckinModal } from '../components/modals/EmergencyCheckinModal';
import { ConfirmArrivalModal } from '../components/dashboard/ConfirmArrivalModal';

export default function PetugasLogOperasionalPage() {
  const { user } = useAuthStore();
  const airportName = user?.airport_name || 'Bandara Mozes Kilangin';

  // Tab state: 'KEDATANGAN' (Rencana Kedatangan Hari Ini) vs 'PARKIR' (Pesawat di Apron/Hanggar)
  const [activeTab, setActiveTab] = useState<'KEDATANGAN' | 'PARKIR'>('KEDATANGAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Operasional Check-In / Check-Out states
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  
  // Today Expected Arrivals
  const [todayArrivals, setTodayArrivals] = useState<FlightSchedule[]>([]);
  const [isLoadingTodayArrivals, setIsLoadingTodayArrivals] = useState(false);
  const [isCheckingInSchedule, setIsCheckingInSchedule] = useState<number | null>(null);

  // Emergency Check-In Modal
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Check-Out Modal
  const [isCheckingOut, setIsCheckingOut] = useState<number | null>(null);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkOutLogId, setCheckOutLogId] = useState<number | null>(null);
  const [checkOutRegistration, setCheckOutRegistration] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');

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
      // Pastikan hanya jadwal kedatangan fasilitas Bandara Mozes Kilangin (Hanggar/Apron)
      const mozesArrivals = (data || []).filter((s: FlightSchedule) => {
        const loc = (s.parking_location || '').toLowerCase();
        return !loc.includes('stand') && !loc.includes('mini') && !loc.includes('airstrip');
      });
      setTodayArrivals(mozesArrivals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTodayArrivals(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveLogs();
    fetchTodayArrivals();
  }, [fetchActiveLogs, fetchTodayArrivals]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([fetchActiveLogs(), fetchTodayArrivals()]);
      toast.success('Data operasional berhasil diperbarui');
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui data operasional');
    } finally {
      setIsRefreshing(false);
    }
  };

  // State Konfirmasi Kedatangan Modal
  const [confirmSchedule, setConfirmSchedule] = useState<FlightSchedule | null>(null);
  const [isConfirmingArrival, setIsConfirmingArrival] = useState(false);

  // Buka Modal Konfirmasi Kedatangan
  const handleOpenConfirmArrival = (schedule: FlightSchedule) => {
    setConfirmSchedule(schedule);
  };

  // Eksekusi Konfirmasi Kedatangan setelah user klik konfirmasi di modal
  const handleExecuteConfirmArrival = async (schedule: FlightSchedule, notes: string) => {
    try {
      setIsConfirmingArrival(true);
      setIsCheckingInSchedule(schedule.id);
      await flightScheduleService.checkInFromSchedule(schedule.id, {
        parking_location: schedule.parking_location,
        notes: notes || `Kedatangan dikonfirmasi oleh petugas lapangan dari jadwal no. ${schedule.schedule_number}`
      });

      toast.success(`Kedatangan armada ${schedule.registration_number} berhasil dicatat!`);
      setConfirmSchedule(null);
      fetchTodayArrivals();
      fetchActiveLogs();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal mengonfirmasi kedatangan armada';
      toast.error(msg);
    } finally {
      setIsConfirmingArrival(false);
      setIsCheckingInSchedule(null);
    }
  };

  const handleEmergencyCheckInSubmit = async (formData: FormData) => {
    const res = await logService.emergencyCheckin(formData);
    toast.success(`Check-In Darurat Berhasil! PKS Darurat no. ${res.contract?.contract_number || ''} aktif.`, { duration: 6000 });
    fetchActiveLogs();
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

  // Filter list untuk tab Pesawat Parkir
  const filteredLogs = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    if (!s) return activeLogs;
    return activeLogs.filter(log => {
      return (
        (log.registration_number || '').toLowerCase().includes(s) ||
        (log.tenants?.nama_perusahaan || '').toLowerCase().includes(s) ||
        (log.parking_location || '').toLowerCase().includes(s) ||
        (log.contracts?.contract_number || '').toLowerCase().includes(s)
      );
    });
  }, [activeLogs, searchQuery]);

  // Filter list untuk tab Kedatangan Hari Ini
  const filteredArrivals = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    if (!s) return todayArrivals;
    return todayArrivals.filter(sch => {
      return (
        (sch.registration_number || '').toLowerCase().includes(s) ||
        (sch.schedule_number || '').toLowerCase().includes(s) ||
        (sch.tenant?.nama_perusahaan || '').toLowerCase().includes(s) ||
        (sch.parking_location || '').toLowerCase().includes(s)
      );
    });
  }, [todayArrivals, searchQuery]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Log Operasional <span className="text-[15px] font-light text-[#777] ml-2">{airportName}</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Petugas</span> / <span className="ml-1 font-medium">Log Operasional</span>
        </div>
      </header>

      {/* PANEL UTAMA TUNGGAL DENGAN TAB (OPSI A) */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        {/* TOP BAR: Info Modul & Aksi Utama Petugas */}
        <div className="p-3.5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              Pergerakan Armada &amp; Pengelolaan Apron
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan kedatangan armada fisik dan check-out kepulangan fasilitas hanggar &amp; apron.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingLogs || isLoadingTodayArrivals}
              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              title="Segarkan data log dan jadwal"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sinkronkan</span>
            </button>

            <Link
              href="/petugas/pendaratan-darurat"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pendaratan Darurat</span>
            </Link>
          </div>
        </div>

        {/* TAB SWITCHER & SEARCH TOOLBAR */}
        <div className="px-3.5 pt-2 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
          {/* Tab Buttons */}
          <div className="flex items-center gap-1 -mb-px overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('KEDATANGAN')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'KEDATANGAN'
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Rencana Kedatangan Hari Ini</span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                todayArrivals.length > 0
                  ? 'bg-amber-100 text-amber-800'
                  : (activeTab === 'KEDATANGAN' ? 'bg-blue-100 text-[#3c8dbc]' : 'bg-slate-200 text-slate-700')
              }`}>
                {todayArrivals.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PARKIR')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'PARKIR'
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Pesawat di Fasilitas</span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                activeTab === 'PARKIR'
                  ? 'bg-blue-100 text-[#3c8dbc]'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {activeLogs.length}
              </span>
            </button>
          </div>

          {/* Unified Search Input */}
          <div className="relative w-full sm:w-64 pb-2 sm:pb-0">
            <input
              type="text"
              placeholder={activeTab === 'KEDATANGAN' ? "Cari no jadwal / registrasi..." : "Cari registrasi / tenant / lokasi..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* TAB BODY: TABEL KONTEN SESUAI TAB AKTIF */}
        <div>
          {activeTab === 'KEDATANGAN' ? (
            <ApprovedScheduleCheckinTable
              todayArrivals={filteredArrivals}
              isLoadingTodayArrivals={isLoadingTodayArrivals}
              isCheckingInSchedule={isCheckingInSchedule}
              onRefresh={fetchTodayArrivals}
              onCheckInFromSchedule={handleOpenConfirmArrival}
              hideHeader={true}
            />
          ) : (
            <ActiveHangarAircraftTable
              activeLogs={activeLogs}
              filteredLogs={filteredLogs}
              isLoadingLogs={isLoadingLogs}
              searchLogTerm={searchQuery}
              setSearchLogTerm={setSearchQuery}
              onOpenEmergencyModal={() => setShowEmergencyModal(true)}
              onOpenCheckOutModal={openCheckOutModal}
              hideHeader={true}
            />
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI KEDATANGAN RESMI (PENGGANTI WINDOW.CONFIRM) */}
      <ConfirmArrivalModal
        isOpen={Boolean(confirmSchedule)}
        schedule={confirmSchedule}
        isSubmitting={isConfirmingArrival}
        onClose={() => setConfirmSchedule(null)}
        onConfirm={handleExecuteConfirmArrival}
      />

      {/* MODAL EMERGENCY CHECK-IN */}
      <EmergencyCheckinModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onSubmit={handleEmergencyCheckInSubmit}
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
