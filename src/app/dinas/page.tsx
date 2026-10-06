"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { dashboardService, DinasDashboardData } from '@/services/dashboardService';

import { DinasKPICards } from './components/dashboard/DinasKPICards';
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

  const { kpi, recent_applications, top_overdue_invoices, revenue_breakdown } = data;

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Dashboard Dinas <span className="text-[15px] font-light text-[#777] ml-2">Dinas Perhubungan Kab. Mimika</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Dinas</span> / <span className="ml-1 font-medium">Dashboard</span>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards */}
      <DinasKPICards kpi={kpi} />

      {/* Baris 2: Layout 2 Kolom (Pengawasan Piutang & Permohonan Masuk vs Komposisi PAD) */}
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
