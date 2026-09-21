"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { dashboardService, DinasDashboardData } from '@/services/dashboardService';

import { DinasKPICards } from './components/dashboard/DinasKPICards';
import { DinasActionQueueHub } from './components/dashboard/DinasActionQueueHub';
import { DinasOverdueInvoicesTable } from './components/dashboard/DinasOverdueInvoicesTable';
import { DinasRecentApplicationsTable } from './components/dashboard/DinasRecentApplicationsTable';
import { DinasRevenueBreakdownCard } from './components/dashboard/DinasRevenueBreakdownCard';

export default function DinasDashboardPage() {
  const [data, setData] = useState<DinasDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardService.getDinasDashboardStats();
      setData(res);
    } catch (error) {
      console.error('Error fetching dinas dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="p-12 bg-[#ecf0f5] min-h-[calc(100vh-60px)] flex flex-col justify-center items-center text-[#777]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat Dashboard Kinerja & Pelayanan PAD Dinas...</p>
      </div>
    );
  }

  const { kpi, action_queue, recent_applications, top_overdue_invoices, revenue_breakdown } = data;

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[22px] font-normal text-[#333] flex items-baseline uppercase">
            Dashboard Kinerja Pelayanan &amp; PAD
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Dinas Perhubungan Kabupaten Mimika &bull; Seksi Pengelolaan UPBU Bandara Mozes Kilangin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDashboardData}
            title="Segarkan Data"
            className="p-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3c8dbc]" /> Refresh
          </button>
          <div className="text-[12px] text-[#777] items-center bg-white border border-[#e0e0e0] px-3 py-1.5 shadow-2xs hidden sm:flex">
            <span className="mr-1">Dinas Portal</span> / <span className="ml-1 font-bold text-slate-800">Dashboard Kinerja</span>
          </div>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards */}
      <DinasKPICards kpi={kpi} />

      {/* Baris 2: Dinas Action Command Hub */}
      <DinasActionQueueHub actionQueue={action_queue} />

      {/* Baris 3: Layout 2 Kolom (Pengawasan Piutang & Permohonan Masuk vs Komposisi PAD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kolom Kiri: 2/3 Lebar (Tabel Piutang & Pipeline Permohonan) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <DinasOverdueInvoicesTable overdueInvoices={top_overdue_invoices} />
          <DinasRecentApplicationsTable 
            recentApplications={recent_applications} 
            totalApplicationsCount={kpi.total_applications_count} 
          />
        </div>

        {/* Kolom Kanan: 1/3 Lebar (Komposisi PAD & Sanksi SP) */}
        <DinasRevenueBreakdownCard revenueBreakdown={revenue_breakdown} />
      </div>
    </div>
  );
}
