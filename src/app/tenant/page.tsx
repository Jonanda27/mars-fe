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

export default function TenantDashboard() {
  const { user, syncUser } = useAuthStore();

  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
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
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Dashboard</span>
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

        {/* Kolom Kanan: 1/3 Lebar (Jadwal Hanggar, Aset Aktif) */}
        <TenantSidebarCards
          schedules={schedules}
          activeContracts={activeContracts}
        />
      </div>
    </div>
  );
}
