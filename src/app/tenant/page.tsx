"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { rentalService } from '@/services/rentalService';
import { contractService } from '@/services/contractService';
import { aircraftService } from '@/services/aircraftService';
import { invoiceService } from '@/services/invoiceService';
import { flightScheduleService } from '@/services/flightScheduleService';
import { warningService } from '@/services/warningService';
import { tenantService } from '@/services/tenantService';
import { RentalApplication } from '@/types/rental';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { Invoice } from '@/types/invoice';
import { FlightSchedule } from '@/types/flightSchedule';
import { Warning } from '@/types/warning';
import { Tenant } from '@/types/tenant';

import { TenantAlertBanners } from './components/dashboard/TenantAlertBanners';
import { TenantDashboardKPICards } from './components/dashboard/TenantDashboardKPICards';
import { RecentInvoicesTable } from './components/dashboard/RecentInvoicesTable';
import { RecentApplicationsTable } from './components/dashboard/RecentApplicationsTable';
import { TenantSidebarCards } from './components/dashboard/TenantSidebarCards';

export default function TenantDashboard() {
  const { user, syncUser } = useAuthStore();

  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [tenantDetail, setTenantDetail] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      if (user?.tenant_id) {
        const detail = await tenantService.getTenantById(user.tenant_id).catch(() => null);
        setTenantDetail(detail);
      }
    } catch (error) {
      console.error("Error fetching tenant dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [syncUser, user?.tenant_id]);

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
    return invoices.filter(inv => ['Unpaid', 'Overdue', 'Menunggu Pembayaran'].includes(inv.status));
  }, [invoices]);

  const totalUnpaidAmount = useMemo(() => {
    return unpaidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0) + Number(inv.penalty_amount || 0), 0);
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

  // Legalitas Checklist Calculation
  const legalitasDocs = tenantDetail?.legalitas || {};
  const isMaskapai = user?.jenis_tenant === 'Maskapai' || tenantDetail?.jenis_tenant === 'Maskapai';
  const reqDocKeys = isMaskapai ? ['nib', 'npwp', 'akta', 'aoc'] : ['nib', 'npwp', 'akta'];
  const uploadedCount = reqDocKeys.filter(k => Boolean(legalitasDocs[k])).length;
  const legalitasPercent = Math.round((uploadedCount / reqDocKeys.length) * 100);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Dashboard Tenant <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Portal Pelayanan Retribusi, Operasional Hanggar &amp; PKS Mitra UPBU
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#3c8dbc]' : 'text-slate-500'}`} />
            <span>Segarkan</span>
          </button>
          <div className="text-[12px] text-[#777] bg-white border border-slate-200 px-3 py-1.5 hidden sm:flex items-center shadow-2xs">
            <span className="text-slate-400 mr-1.5">Mitra:</span>
            <span className="font-bold text-slate-800">{user?.nama_perusahaan || 'Tenant'}</span>
          </div>
        </div>
      </header>

      {/* Alert Banners */}
      <TenantAlertBanners
        userStatusVerifikasi={user.status_verifikasi}
        activeWarnings={activeWarnings}
        expiringContracts={expiringContracts}
      />

      {/* 4 KPI Scorecard Cards & 5 Action Command Hub */}
      <TenantDashboardKPICards
        activeApps={activeApps}
        allApplications={applications}
        activeContracts={activeContracts}
        allContracts={contracts}
        aircrafts={aircrafts}
        unpaidInvoices={unpaidInvoices}
        totalUnpaidAmount={totalUnpaidAmount}
        legalitasPercent={legalitasPercent}
      />

      {/* Layout 2 Kolom (60% Kiri, 40% Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
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

        {/* Kolom Kanan: 1/3 Lebar (Jadwal Hanggar, Aset Aktif, Status Legalitas) */}
        <TenantSidebarCards
          schedules={schedules}
          activeContracts={activeContracts}
          user={user}
          tenantDetail={tenantDetail}
          legalitasDocs={legalitasDocs}
          isMaskapai={isMaskapai}
          legalitasPercent={legalitasPercent}
        />
      </div>
    </div>
  );
}
