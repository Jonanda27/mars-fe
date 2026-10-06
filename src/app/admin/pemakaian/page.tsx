"use client";

import React, { useState, useEffect } from 'react';
import { logService } from '@/services/logService';
import { overnightReportService, OvernightReport } from '@/services/overnightReportService';
import { TutupHariDetailModal } from '@/app/petugas/components/TutupHariDetailModal';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { PemakaianKPICards } from './components/PemakaianKPICards';
import { PemakaianTabSwitcher, PemakaianTabType } from './components/PemakaianTabSwitcher';
import { PemakaianSearchToolbar } from './components/PemakaianSearchToolbar';
import { OvernightReportsTable } from './components/OvernightReportsTable';
import { ActiveParkingLogsTable } from './components/ActiveParkingLogsTable';
import { CheckoutLogsTable } from './components/CheckoutLogsTable';
import { useAuthStore } from '@/store/useAuthStore';
import { MiniAirportPemakaianView } from './components/MiniAirportPemakaianView';

export default function AdminPemakaianPage() {
  const { user } = useAuthStore();
  const userRole = (user?.role || '').toLowerCase();
  const isMiniAdmin = userRole === 'admin_mini_airport' || Boolean(user?.mini_airport_id);

  const [activeTab, setActiveTab] = useState<PemakaianTabType>('overnight');

  // State Overnight Reports
  const [overnightReports, setOvernightReports] = useState<OvernightReport[]>([]);
  const [isLoadingOvernight, setIsLoadingOvernight] = useState(true);
  const [selectedOvernight, setSelectedOvernight] = useState<OvernightReport | null>(null);

  // State All Logs & Active Logs
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOvernightReports = async () => {
    try {
      setIsLoadingOvernight(true);
      const data = await overnightReportService.getAllOvernightReports();
      setOvernightReports(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat arsip laporan tutup hari');
    } finally {
      setIsLoadingOvernight(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const data = await logService.getAllLogs();
      setAllLogs(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat log operasional pesawat');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (!isMiniAdmin) {
      fetchOvernightReports();
      fetchLogs();
    }
  }, [isMiniAdmin]);

  if (isMiniAdmin) {
    return (
      <div className="p-4 bg-[#ecf0f5] min-h-full">
        <MiniAirportPemakaianView user={user} />
      </div>
    );
  }

  const activeLogs = allLogs.filter((log) => !log.exit_time);
  const checkoutLogs = allLogs.filter((log) => log.exit_time !== null);

  // Filter overnight reports
  const filteredOvernight = overnightReports.filter((report) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchDate = dayjs(report.report_date).format('DD MMMM YYYY').toLowerCase().includes(s);
    const matchOfficer = (report.officer?.username || '').toLowerCase().includes(s);
    const matchNotes = (report.general_notes || '').toLowerCase().includes(s);
    const matchAircraft = (report.items || []).some((item) => 
      (item.registration_number || '').toLowerCase().includes(s) ||
      (item.tenant?.nama_perusahaan || item.tenant_name || '').toLowerCase().includes(s)
    );
    return matchDate || matchOfficer || matchNotes || matchAircraft;
  });

  // Filter active logs
  const filteredActiveLogs = activeLogs.filter((log) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchReg = (log.registration_number || '').toLowerCase().includes(s);
    const matchTenant = (log.tenants?.nama_perusahaan || '').toLowerCase().includes(s);
    const matchLocation = (log.parking_location || '').toLowerCase().includes(s);
    return matchReg || matchTenant || matchLocation;
  });

  // Filter checkout logs
  const filteredCheckout = checkoutLogs.filter((log) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchReg = (log.registration_number || '').toLowerCase().includes(s);
    const matchTenant = (log.tenants?.nama_perusahaan || '').toLowerCase().includes(s);
    const matchLocation = (log.parking_location || '').toLowerCase().includes(s);
    return matchReg || matchTenant || matchLocation;
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Log Operasional Lapangan{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Monitoring Tutup Hari &amp; Pergerakan Pesawat</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Log Operasional</span>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <PemakaianKPICards
        totalOvernight={overnightReports.length}
        totalActive={activeLogs.length}
        totalCheckout={checkoutLogs.length}
      />

      {/* Tabs Switcher */}
      <PemakaianTabSwitcher
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalOvernight={overnightReports.length}
        totalActive={activeLogs.length}
        totalCheckout={checkoutLogs.length}
      />

      {/* Main Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        {/* Card Header with Search */}
        <PemakaianSearchToolbar
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={() => {
            fetchOvernightReports();
            fetchLogs();
          }}
        />

        {/* Content Table */}
        <div className="overflow-x-auto">
          {activeTab === 'overnight' && (
            <OvernightReportsTable
              isLoading={isLoadingOvernight}
              filteredReports={filteredOvernight}
              onSelectReport={(report) => setSelectedOvernight(report)}
            />
          )}

          {activeTab === 'active_parkir' && (
            <ActiveParkingLogsTable
              isLoading={isLoadingLogs}
              filteredLogs={filteredActiveLogs}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckoutLogsTable
              isLoading={isLoadingLogs}
              filteredLogs={filteredCheckout}
            />
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>
            {activeTab === 'overnight' && `Menampilkan ${filteredOvernight.length} arsip laporan tutup hari`}
            {activeTab === 'active_parkir' && `Menampilkan ${filteredActiveLogs.length} armada aktif`}
            {activeTab === 'checkout' && `Menampilkan ${filteredCheckout.length} riwayat keberangkatan`}
          </span>
          <span>Sistem Informasi Hanggar Mozes Kilangin</span>
        </div>
      </div>

      {/* Overnight Report Detail Modal */}
      {selectedOvernight && (
        <TutupHariDetailModal
          report={selectedOvernight}
          onClose={() => setSelectedOvernight(null)}
        />
      )}
    </div>
  );
}
