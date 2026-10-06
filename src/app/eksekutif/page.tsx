"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Clock, 
  FileText, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Loader2 
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import StatusBadge from '@/components/StatusBadge';
import { dashboardService, AdminDashboardData, DinasDashboardData } from '@/services/dashboardService';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

export default function EksekutifDashboardPage() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [dinasData, setDinasData] = useState<DinasDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [adminRes, dinasRes] = await Promise.all([
        dashboardService.getAdminDashboardStats().catch(() => null),
        dashboardService.getDinasDashboardStats().catch(() => null),
      ]);
      if (adminRes) setAdminData(adminRes);
      if (dinasRes) setDinasData(dinasRes);
    } catch (error) {
      console.error('Error fetching executive dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading && (!adminData || !dinasData)) {
    return (
      <div className="p-12 bg-[#ecf0f5] min-h-[calc(100vh-60px)] flex flex-col justify-center items-center text-[#777]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat Dashboard Eksekutif &amp; Data Riil PAD...</p>
      </div>
    );
  }

  const kpi = {
    realisasi_pad: adminData?.kpi.realisasi_pad ?? dinasData?.kpi.realisasi_pad ?? 0,
    target_pad: adminData?.kpi.target_pad ?? dinasData?.kpi.target_pad ?? 15000000000,
    achievement_percent: adminData?.kpi.achievement_percent ?? dinasData?.kpi.achievement_percent ?? 0,
    total_piutang: adminData?.kpi.total_piutang ?? dinasData?.kpi.total_piutang ?? 0,
    paid_invoices_count: adminData?.kpi.paid_invoices_count ?? dinasData?.kpi.paid_invoices_count ?? 0,
    overdue_invoices_count: adminData?.kpi.overdue_invoices_count ?? dinasData?.kpi.overdue_invoices_count ?? 0,
    total_tenants: adminData?.kpi.total_tenants ?? ((dinasData?.kpi.verified_tenants_count || 0) + (dinasData?.kpi.pending_tenants_count || 0)),
    pending_tenants: adminData?.kpi.pending_tenants ?? dinasData?.kpi.pending_tenants_count ?? 0,
    active_contracts_count: adminData?.kpi.active_contracts_count ?? dinasData?.kpi.active_contracts_count ?? 0,
    occupancy_rate: adminData?.kpi.occupancy_rate ?? 0,
    total_area_m2: adminData?.kpi.total_area_m2 ?? 0,
    used_area_m2: adminData?.kpi.used_area_m2 ?? 0,
  };

  const visualAssets = adminData?.visual_assets || [];
  const hanggarAssets = visualAssets.filter(a => a.jenis_aset === 'Hanggar');
  const occupiedHanggarCount = hanggarAssets.filter(a => a.occupancy_percent > 0).length;

  const actionQueue = dinasData?.action_queue || {
    pendingApplications: 0,
    pendingKadisContracts: 0,
    pendingTenants: 0,
    pendingPaymentReceipts: 0,
    pendingWarningLetters: 0,
    unbilledHanggarLogs: 0,
  };

  const pendingKadisTotal = (actionQueue.pendingApplications || 0) + (actionQueue.pendingKadisContracts || 0);
  const recentApplications = dinasData?.recent_applications || [];
  const overdueInvoices = dinasData?.top_overdue_invoices || adminData?.top_overdue_invoices || [];
  const revenueBreakdown = dinasData?.revenue_breakdown || {
    hanggar: 0,
    ruangan: 0,
    denda: 0,
    total: kpi.realisasi_pad
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      
      {/* Header Halaman Konsisten */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Dashboard Eksekutif <span className="text-[15px] font-light text-[#777] ml-2">Dinas Perhubungan Kab. Mimika</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Kepala Dinas</span> / <span className="ml-1 font-medium">Dashboard</span>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards (AdminLTE Flat Style with Top Border) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Realisasi Penerimaan PAD */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <RupiahIcon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Realisasi Penerimaan PAD</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {formatRupiah(kpi.realisasi_pad)}
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Target: Rp 15 M ({kpi.achievement_percent}%) &bull; {kpi.paid_invoices_count} SKRD Lunas
            </span>
          </div>
        </div>

        {/* KPI 2: Piutang Retribusi Daerah */}
        <div className="bg-white border-t-[3px] border-[#dd4b39] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#dd4b39]">
            <Clock className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Piutang Retribusi Daerah</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#dd4b39] font-mono leading-tight mt-0.5">
              {formatRupiah(kpi.total_piutang)}
            </span>
            <span className="text-[11px] font-bold mt-1">
              {kpi.overdue_invoices_count > 0 ? (
                <span className="text-[#dd4b39]">⚠️ {kpi.overdue_invoices_count} SKRD Lewat Jatuh Tempo</span>
              ) : (
                <span className="text-[#3c8dbc]">Pembayaran Berjalan Tertib</span>
              )}
            </span>
          </div>
        </div>

        {/* KPI 3: Antrean Persetujuan Kadis */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <FileText className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Antrean Persetujuan Kadis</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#333] leading-tight mt-0.5">
              {pendingKadisTotal} Berkas Menunggu
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              {actionQueue.pendingApplications} Permohonan &bull; {actionQueue.pendingKadisContracts} PKS Siap Disahkan
            </span>
          </div>
        </div>

        {/* KPI 4: Okupansi Fasilitas & PKS Aktif */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Okupansi Fasilitas &amp; PKS</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {kpi.occupancy_rate}% Terisi
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              {kpi.active_contracts_count} PKS Aktif &bull; {occupiedHanggarCount}/{hanggarAssets.length || 3} Hanggar Terisi
            </span>
          </div>
        </div>
      </div>

      {/* Baris 2: Layout 2 Kolom (Antrean Disposisi & Piutang vs Capaian APBD & Utilisasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Kolom Kiri: 2/3 Lebar (Tabel Permohonan Masuk & Tabel Piutang Jatuh Tempo) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Tabel 1: Antrean Permohonan Masuk untuk Disposisi Kadis */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-[#333] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3c8dbc]" />
                Antrean Surat Permohonan Masuk (Disposisi Kepala Dinas)
              </h3>
              <Link 
                href="/eksekutif/permohonan" 
                className="text-xs font-bold text-[#3c8dbc] hover:text-[#367fa9] flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#777] uppercase text-[11px] bg-[#f9fafb]">
                    <th className="py-2.5 px-4 font-bold">#</th>
                    <th className="py-2.5 px-4 font-bold">Nomor Permohonan</th>
                    <th className="py-2.5 px-4 font-bold">Nama Mitra</th>
                    <th className="py-2.5 px-4 font-bold">Layanan / Aset</th>
                    <th className="py-2.5 px-4 font-bold text-center">Tanggal Masuk</th>
                    <th className="py-2.5 px-4 font-bold text-center">Status</th>
                    <th className="py-2.5 px-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-[#3c8dbc] mx-auto mb-1" />
                        <p className="font-bold text-xs text-slate-600">Tidak Ada Antrean Permohonan</p>
                        <p className="text-[11px]">Seluruh permohonan telah selesai ditelaah.</p>
                      </td>
                    </tr>
                  ) : (
                    recentApplications.map((app, idx) => (
                      <tr key={app.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 text-[#999] font-mono text-xs">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-[#3c8dbc] font-mono text-xs">
                          {app.application_number}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#333] text-xs">
                          {app.tenant_name}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-slate-600">
                          {app.asset_name}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-500">
                          {app.created_at ? dayjs(app.created_at).format('DD/MM/YYYY') : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <Link
                            href={`/eksekutif/permohonan/${app.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[11px] font-bold rounded-none shadow-2xs transition-colors"
                          >
                            <Eye className="w-3 h-3" /> Review
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel 2: Pengawasan Piutang SKRD Jatuh Tempo */}
          <div className="bg-white border-t-[3px] border-[#dd4b39] shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-[#333] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#dd4b39]" />
                Pengawasan Piutang SKRD Jatuh Tempo (Monitoring Finansial Eksekutif)
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                Total Piutang: <span className="font-mono text-[#dd4b39] font-bold">{formatRupiah(kpi.total_piutang)}</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#777] uppercase text-[11px] bg-[#f9fafb]">
                    <th className="py-2.5 px-4 font-bold">#</th>
                    <th className="py-2.5 px-4 font-bold">Nomor SKRD</th>
                    <th className="py-2.5 px-4 font-bold">Nama Mitra</th>
                    <th className="py-2.5 px-4 font-bold text-right">Jumlah Tagihan</th>
                    <th className="py-2.5 px-4 font-bold text-center">Jatuh Tempo</th>
                    <th className="py-2.5 px-4 font-bold text-center">Status / Keterlambatan</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-[#3c8dbc] mx-auto mb-1" />
                        <p className="font-bold text-xs text-slate-600">Seluruh Pembayaran Berjalan Tertib</p>
                        <p className="text-[11px]">Tidak ada piutang retribusi daerah yang melewati jatuh tempo.</p>
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv, idx) => (
                      <tr key={inv.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 text-[#999] font-mono text-xs">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-[#3c8dbc] font-mono text-xs">
                          {inv.invoice_number}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#333] text-xs">
                          {inv.tenant_name}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#dd4b39] text-xs">
                          {formatRupiah(inv.amount)}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-600">
                          {inv.due_date ? dayjs(inv.due_date).format('DD/MM/YYYY') : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge status={inv.days_overdue > 0 ? `Lewat ${inv.days_overdue} Hari` : inv.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: 1/3 Lebar (Target APBD vs Realisasi & Pengawasan Utilisasi Aset) */}
        <div className="flex flex-col gap-4">
          
          {/* Card 1: Target APBD & Komposisi Retribusi */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4">
            <h3 className="text-[14px] font-bold text-[#333] border-b border-[#f4f4f4] pb-2.5 mb-3 flex items-center justify-between">
              <span>Capaian Target APBD Mimika</span>
              <span className="text-[11px] font-bold font-mono text-[#3c8dbc]">
                {kpi.achievement_percent}%
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Realisasi PAD (YTD)</span>
                  <span className="font-mono font-bold text-[#333]">{formatRupiah(kpi.realisasi_pad)}</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium">Target APBD Perda</span>
                  <span className="font-mono font-bold text-slate-600">{formatRupiah(kpi.target_pad)}</span>
                </div>
                
                {/* Progress Bar (Konsisten Warna Tema Biru #3c8dbc) */}
                <div className="w-full bg-[#ecf0f5] h-2.5 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-[#3c8dbc] h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, kpi.achievement_percent))}%` }}
                  ></div>
                </div>
              </div>

              {/* Rincian Komposisi Retribusi */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Rincian Penerimaan Retribusi
                </span>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-600">Sewa Hanggar Pesawat</span>
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(revenueBreakdown.hanggar)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-600">Sewa Ruangan Kantor</span>
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(revenueBreakdown.ruangan)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-600">Denda Keterlambatan</span>
                  <span className="font-mono font-bold text-[#dd4b39]">{formatRupiah(revenueBreakdown.denda)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 font-bold text-[#333]">
                  <span>Total Realisasi Kas</span>
                  <span className="font-mono text-[#3c8dbc]">{formatRupiah(revenueBreakdown.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Status Utilisasi Aset & Pengawasan Sisi Udara */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4">
            <h3 className="text-[14px] font-bold text-[#333] border-b border-[#f4f4f4] pb-2.5 mb-3">
              Pengawasan Fasilitas Sisi Udara
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3c8dbc]" />
                  <span className="font-bold text-slate-700">Hanggar Terpakai</span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  {occupiedHanggarCount} / {hanggarAssets.length || 3} Unit
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3c8dbc]" />
                  <span className="font-bold text-slate-700">Mitra Maskapai Terdaftar</span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  {kpi.total_tenants} Perusahaan
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
                  <span className="font-bold text-slate-700">Kontrak PKS Aktif</span>
                </div>
                <span className="font-mono font-bold text-[#3c8dbc]">
                  {kpi.active_contracts_count} Berjalan
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-700 block">Luas Area Terpakai</span>
                  <span className="text-[10.5px] text-slate-400">Total kapasitas lantai</span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  {kpi.used_area_m2.toLocaleString('id-ID')} m²
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/eksekutif/kontrak"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none shadow-2xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Buka Pengesahan Kontrak (PKS)
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Hak Cipta MARS */}
      <footer className="text-center text-[11px] text-[#777] py-2 border-t border-[#d2d6de]/60 mt-2">
        MARS &mdash; Mimika (Mozes Kilangin) Airport Revenue System &copy; {new Date().getFullYear()} Pemerintah Kabupaten Mimika
      </footer>

    </div>
  );
}
