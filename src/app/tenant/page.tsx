"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { rentalService } from '@/services/rentalService';
import { contractService } from '@/services/contractService';
import { aircraftService } from '@/services/aircraftService';
import { invoiceService } from '@/services/invoiceService';
import { flightScheduleService } from '@/services/flightScheduleService';
import { warningService } from '@/services/warningService';
import { RentalApplication } from '@/types/rental';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { Invoice } from '@/types/invoice';
import { FlightSchedule } from '@/types/flightSchedule';
import { Warning } from '@/types/warning';

import { TenantAlertBanners } from './components/dashboard/TenantAlertBanners';
import { TenantDashboardKPICards } from './components/dashboard/TenantDashboardKPICards';
import { RecentInvoicesTable } from './components/dashboard/RecentInvoicesTable';
import { RecentApplicationsTable } from './components/dashboard/RecentApplicationsTable';
import { TenantSidebarCards } from './components/dashboard/TenantSidebarCards';
import { FileText, Calendar } from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';

export default function TenantDashboard() {
  const { user, syncUser } = useAuthStore();

  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<'invoices' | 'applications' | 'schedules'>('invoices');

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      await syncUser();

      const [
        appsData, 
        contractsData, 
        aircraftsData, 
        invoicesData,
        schedulesData,
        warningsData
      ] = await Promise.all([
        rentalService.getTenantApplications().catch(() => []),
        contractService.getTenantContracts().catch(() => []),
        aircraftService.getTenantAircrafts().catch(() => []),
        invoiceService.getTenantInvoices().catch(() => []),
        flightScheduleService.getTenantSchedules().catch(() => []),
        warningService.getTenantWarnings().catch(() => [])
      ]);

      setApplications(appsData || []);
      setContracts(contractsData || []);
      setAircrafts(aircraftsData || []);
      setInvoices(invoicesData || []);
      setSchedules(schedulesData || []);
      setWarnings(warningsData || []);
    } catch (error) {
      console.error("Error fetching tenant dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [syncUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived Calculations
  const activeApps = useMemo(() => {
    return applications.filter(a => !['Selesai', 'Ditolak', 'Rejected'].includes(a.status));
  }, [applications]);

  const activeContracts = useMemo(() => {
    return contracts.filter(c => ['Aktif', 'Active'].includes(c.status || ''));
  }, [contracts]);

  const unpaidInvoices = useMemo(() => {
    return invoices.filter(inv => ['Unpaid', 'Overdue', 'Menunggu Pembayaran', 'Partially Paid', 'Pending Verification'].includes(inv.status));
  }, [invoices]);

  const totalUnpaidAmount = useMemo(() => {
    return unpaidInvoices.reduce((sum, inv) => {
      const total = Number(inv.amount || 0) + Number(inv.penalty_amount || 0);
      const paid = Number(inv.paid_amount || 0);
      return sum + Math.max(0, total - paid);
    }, 0);
  }, [unpaidInvoices]);

  const activeWarnings = useMemo(() => {
    return warnings.filter(w => !['Lunas', 'Resolved', 'Selesai'].includes(w.status));
  }, [warnings]);

  const expiringContracts = useMemo(() => {
    return contracts.filter(c => {
      if (!['Aktif', 'Active'].includes(c.status || '') || !c.end_date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(c.end_date);
      end.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [contracts]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-3 sm:gap-4 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-baseline gap-1.5">
            Dashboard Tenant <span className="text-xs sm:text-sm font-normal text-gray-500">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[11px] sm:text-xs text-gray-500 flex items-center bg-white sm:bg-transparent px-2.5 py-1 rounded border sm:border-0 border-gray-200">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-semibold text-gray-800">Dashboard</span>
        </div>
      </header>

      {/* Alert Banners */}
      <TenantAlertBanners
        userStatusVerifikasi={user.status_verifikasi}
        activeWarnings={activeWarnings}
        expiringContracts={expiringContracts}
      />

      {/* 4 KPI Scorecard Cards */}
      <TenantDashboardKPICards
        activeApps={activeApps}
        allApplications={applications}
        activeContracts={activeContracts}
        allContracts={contracts}
        aircrafts={aircrafts}
        unpaidInvoices={unpaidInvoices}
        totalUnpaidAmount={totalUnpaidAmount}
      />

      {/* Segmented Tab Switcher Khusus Mobile/Tablet (Hidden di Desktop lg:) */}
      <div className="block lg:hidden">
        <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 border border-slate-300/50 shadow-inner text-xs">
          <button
            type="button"
            onClick={() => setMobileTab('invoices')}
            className={`flex-1 py-2 px-1.5 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center active:scale-[0.98] ${
              mobileTab === 'invoices'
                ? 'bg-white text-[#3c8dbc] font-bold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <RupiahIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">e-SKRD</span>
            {unpaidInvoices.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white font-mono shadow-2xs">
                {unpaidInvoices.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 font-mono">
                0
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('applications')}
            className={`flex-1 py-2 px-1.5 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center active:scale-[0.98] ${
              mobileTab === 'applications'
                ? 'bg-white text-[#3c8dbc] font-bold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Permohonan</span>
            {applications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-[#3c8dbc] font-mono">
                {applications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('schedules')}
            className={`flex-1 py-2 px-1.5 sm:px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center active:scale-[0.98] ${
              mobileTab === 'schedules'
                ? 'bg-white text-[#3c8dbc] font-bold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Jadwal &amp; Aset</span>
            {schedules.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                {schedules.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Konten Mobile (Tampil bergantian sesuai Tab terpilih agar tidak monoton scroll ke bawah) */}
      <div className="block lg:hidden">
        {mobileTab === 'invoices' && (
          <RecentInvoicesTable
            unpaidInvoices={unpaidInvoices}
            totalInvoiceCount={invoices.length}
          />
        )}
        {mobileTab === 'applications' && (
          <RecentApplicationsTable
            applications={applications}
          />
        )}
        {mobileTab === 'schedules' && (
          <TenantSidebarCards
            schedules={schedules}
            activeContracts={activeContracts}
          />
        )}
      </div>

      {/* Konten Desktop (Layout 2 Kolom Klasik AdminLTE tetap utuh di desktop lg ke atas) */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
        {/* Kolom Kiri: 2/3 Lebar (Tagihan e-SKRD & Permohonan Terkini) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <RecentInvoicesTable
            unpaidInvoices={unpaidInvoices}
            totalInvoiceCount={invoices.length}
          />
          <RecentApplicationsTable
            applications={applications}
          />
        </div>

        {/* Kolom Kanan: 1/3 Lebar (Jadwal Hanggar, Aset Aktif) */}
        <TenantSidebarCards
          schedules={schedules}
          activeContracts={activeContracts}
        />
      </div>
    </div>
  );
}
