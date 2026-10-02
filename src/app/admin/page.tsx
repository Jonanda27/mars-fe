"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Activity, 
  TrendingUp, MapPin, AlertCircle, Info, Plane,
  Loader2, RefreshCw, CheckCircle2, Clock, ShieldAlert,
  ArrowRight, ExternalLink, Building2
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { dashboardService, AdminDashboardData } from '@/services/dashboardService';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { MiniAirportDashboardView } from './components/MiniAirportDashboardView';

export default function AdminExecutiveDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  const isMiniAdmin = (user?.role || '').toLowerCase() === 'admin_mini_airport' || Boolean(user?.mini_airport_id);

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'dinas') {
      router.replace('/dinas');
    }
  }, [user, router]);

  useEffect(() => {
    if (!isMiniAdmin) {
      fetchDashboardData();
    }
  }, [isMiniAdmin]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardService.getAdminDashboardStats();
      setData(res);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMiniAdmin) {
    return <MiniAirportDashboardView user={user} />;
  }

  if (isLoading || !data) {
    return (
      <div className="p-12 bg-[#ecf0f5] min-h-[calc(100vh-60px)] flex flex-col justify-center items-center text-[#777]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat Dashboard Operasional & Real-time Database MARS...</p>
      </div>
    );
  }

  const { kpi, action_queue, visual_assets, expiring_contracts, master_tariffs } = data;

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase flex items-center gap-2">
            Dashboard Operasional &amp; Aset
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Monitoring Utilisasi Fasilitas, Peta Spasial Hanggar &amp; Log Lapangan Bandara Mozes Kilangin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            title="Refresh Data"
            className="p-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs rounded-none flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3c8dbc]" /> Refresh
          </button>
          <div className="text-[12px] text-[#777] items-center bg-white border border-[#e0e0e0] px-3 py-1.5 shadow-2xs hidden sm:flex">
            <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-bold text-slate-800">Dashboard Operasional</span>
          </div>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards (AdminLTE Flat Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Realisasi Pendapatan */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <RupiahIcon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Realisasi Pendapatan (YTD)</span>
            <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
              {formatRupiah(kpi.realisasi_pad)}
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Target: Rp 15 M ({kpi.achievement_percent}%) • {kpi.paid_invoices_count} SKRD Lunas
            </span>
          </div>
        </div>
        
        {/* KPI 2: Occupancy Rate Aset */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Activity className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Occupancy Rate Aset</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {kpi.occupancy_rate}%
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Terisi: {kpi.used_area_m2.toLocaleString('id-ID')} m² dari {kpi.total_area_m2.toLocaleString('id-ID')} m²
            </span>
          </div>
        </div>

        {/* KPI 3: Total Penyewa (Tenant) */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Users className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Total Penyewa (Tenant)</span>
            <span className="text-[18px] font-bold text-[#333] leading-tight mt-0.5">
              {kpi.total_tenants} Mitra
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              {kpi.pending_tenants > 0 ? `${kpi.pending_tenants} Menunggu Verifikasi` : 'Semua Terverifikasi'} • {kpi.active_contracts_count} PKS Aktif
            </span>
          </div>
        </div>

        {/* KPI 4: Piutang (Outstanding) */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Piutang (Outstanding)</span>
            <span className="text-[18px] font-bold text-[#dd4b39] font-mono leading-tight mt-0.5">
              {formatRupiah(kpi.total_piutang)}
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-1">
              {kpi.overdue_invoices_count > 0 ? (
                <span className="text-[#dd4b39] font-bold">⚠️ Terdapat {kpi.overdue_invoices_count} SKRD Jatuh Tempo</span>
              ) : (
                <span className="text-[#3c8dbc] font-bold">Tagihan Berjalan Lancar</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Baris 1.5: Antrean Tindakan Cepat Admin (Action Hub - Tema Konsisten Biru #3c8dbc) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link 
          href="/admin/tenants" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Verifikasi Mitra</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {action_queue.pendingTenants} Mitra Baru Menunggu
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            action_queue.pendingTenants > 0 
              ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {action_queue.pendingTenants}
          </span>
        </Link>

        <Link 
          href="/admin/tagihan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">SKRD Hanggar Siap</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {action_queue.unbilledHanggarLogs} Log Pesawat Siap Tagih
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            action_queue.unbilledHanggarLogs > 0 
              ? 'bg-blue-100 text-[#3c8dbc] border border-blue-300' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {action_queue.unbilledHanggarLogs}
          </span>
        </Link>

        <Link 
          href="/admin/tagihan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Verifikasi Pembayaran</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {action_queue.pendingPaymentReceipts} Bukti Transfer Masuk
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            action_queue.pendingPaymentReceipts > 0 
              ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {action_queue.pendingPaymentReceipts}
          </span>
        </Link>

        <Link 
          href="/petugas/verifikasi-jadwal" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Jadwal Pesawat</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {action_queue.pendingFlightSchedules} Rencana Menunggu Respon
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            action_queue.pendingFlightSchedules > 0 
              ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {action_queue.pendingFlightSchedules}
          </span>
        </Link>
      </div>

      {/* Baris 2: Layout 2 Kolom (Peta Visual Aset & Kolom Kanan Monitoring) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Kolom Kiri: Peta Visual Aset (2/3 lebar) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
            <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50">
              <h3 className="text-[15px] text-[#444] font-bold flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Peta Visual Fasilitas Hanggar & Aset Daerah
              </h3>
              <div className="flex flex-wrap gap-3 text-[11px] font-bold">
                <span className="flex items-center"><div className="w-3 h-3 bg-[#3c8dbc] mr-1"></div> Terisi / Sebagian</span>
                <span className="flex items-center"><div className="w-3 h-3 border border-[#d2d6de] mr-1"></div> Tersedia / Kosong</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-amber-500 mr-1"></div> Maintenance</span>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50">
              {/* Grid Aset (Visual Map Riil dari Database) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visual_assets.slice(0, 4).map((asset) => {
                  const isAviation = asset.jenis_aset === 'Hanggar' || asset.jenis_aset === 'Apron' || (asset.nama_aset || '').toLowerCase().includes('hanggar') || (asset.nama_aset || '').toLowerCase().includes('apron');
                  const isHanggar = asset.jenis_aset === 'Hanggar';
                  const isFull = asset.occupancy_percent >= 100;
                  const isPartial = asset.occupancy_percent > 0 && asset.occupancy_percent < 100;
                  const isAvailable = asset.occupancy_percent === 0;

                  return (
                    <div 
                      key={asset.id} 
                      className={`bg-white p-4 relative shadow-sm border transition-all ${
                        isFull || isPartial ? 'border-[#3c8dbc]' : 'border-[#d2d6de]'
                      }`}
                    >
                      {/* Badge status pojok kanan */}
                      <div className={`absolute top-0 right-0 text-white px-2.5 py-1 text-[10px] font-bold uppercase ${
                        isFull 
                          ? 'bg-[#3c8dbc]' 
                          : isPartial 
                            ? 'bg-[#00c0ef]' 
                            : 'bg-slate-400'
                      }`}>
                        {isFull ? 'Terisi Penuh (100%)' : isPartial ? `Terisi Sebagian (${asset.occupancy_percent}%)` : 'Tersedia'}
                      </div>

                      <h4 className="font-bold text-[17px] text-[#333] flex items-center gap-1.5">
                        {asset.nama_aset}
                      </h4>
                      <p className="text-[11.5px] text-[#666] mb-3">
                        Kode: <span className="font-mono font-bold text-slate-700">{asset.kode_aset}</span> • Luas: {asset.luas_total.toLocaleString('id-ID')} m² 
                        {isAviation && ` (Tersisa: ${asset.sisa_luas.toLocaleString('id-ID')} m²)`}
                      </p>
                      
                      {/* Sub-info Penyewa / Armada */}
                      <div className="border-t border-[#f4f4f4] pt-3">
                        {isAviation ? (
                          asset.parked_aircrafts && asset.parked_aircrafts.length > 0 ? (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10.5px] text-[#777] font-bold uppercase">
                                  Armada Sedang Parkir ({asset.parked_aircrafts.length}):
                                </p>
                                <span className="text-[10.5px] text-slate-500 font-medium">
                                  {asset.luas_terpakai.toLocaleString('id-ID')} m² terpakai
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {asset.parked_aircrafts.map((ac, idx) => (
                                  <span key={`${asset.id}-${ac.registration_number || idx}`} className="bg-blue-50 text-[#3c8dbc] border border-blue-200 px-2 py-0.5 text-[11px] font-bold font-mono">
                                    ✈ {ac.registration_number} ({ac.aircraft_type})
                                  </span>
                                ))}
                              </div>
                              {asset.current_tenant && (
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                                  <Building2 className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0" />
                                  <span className="truncate">
                                    Penyewa / Kontrak: <strong className="text-slate-700">{asset.current_tenant.nama_perusahaan}</strong> <span className="font-mono text-slate-500">({asset.current_tenant.contract_number})</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : asset.current_tenant ? (
                            <div>
                              <p className="text-[10.5px] text-[#777] font-bold uppercase mb-1">Penyewa / Kontrak Aktif:</p>
                              <div className="flex items-center bg-slate-50 p-2 border border-[#d2d6de]">
                                <Plane className="w-5 h-5 mr-2.5 text-[#3c8dbc] flex-shrink-0" />
                                <div className="truncate">
                                  <p className="font-bold text-[#333] text-[12.5px] truncate">
                                    {asset.current_tenant.nama_perusahaan}
                                  </p>
                                  <p className="text-[10.5px] text-[#3c8dbc] font-mono">
                                    {asset.current_tenant.contract_number} (s/d {asset.current_tenant.end_date ? dayjs(asset.current_tenant.end_date).format('DD MMM YYYY') : '-'})
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-[48px] bg-slate-50 border border-dashed border-slate-200">
                              <span className="text-[11.5px] font-bold text-slate-400 italic">
                                Fasilitas Kosong / Siap Digunakan
                              </span>
                            </div>
                          )
                        ) : (
                          // Non-aviation (Ruangan / Gudang)
                          asset.current_tenant ? (
                            <div>
                              <p className="text-[10.5px] text-[#777] font-bold uppercase mb-1">Penyewa / Kontrak Aktif:</p>
                              <div className="flex items-center bg-slate-50 p-2 border border-[#d2d6de]">
                                <Building2 className="w-5 h-5 mr-2.5 text-[#3c8dbc] flex-shrink-0" />
                                <div className="truncate">
                                  <p className="font-bold text-[#333] text-[12.5px] truncate">
                                    {asset.current_tenant.nama_perusahaan}
                                  </p>
                                  <p className="text-[10.5px] text-[#3c8dbc] font-mono">
                                    {asset.current_tenant.contract_number} (s/d {asset.current_tenant.end_date ? dayjs(asset.current_tenant.end_date).format('DD MMM YYYY') : '-'})
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-[48px] bg-slate-50 border border-dashed border-slate-200">
                              <span className="text-[11.5px] font-bold text-slate-400 italic">
                                Aset Kosong / Siap Digunakan
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Menampilkan fasilitas utama Bandara Mozes Kilangin</span>
                <Link href="/admin/aset" className="text-[#3c8dbc] font-bold hover:underline flex items-center gap-1">
                  Kelola Seluruh Aset ({visual_assets.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aktivitas & Kontrak (1/3 lebar) */}
        <div className="flex flex-col gap-4">
          
          {/* Box 1: Peringatan Kontrak Segera Berakhir */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[14px] text-[#444] font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-[#f39c12]" /> Kontrak Segera Berakhir
              </h3>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200">
                {expiring_contracts.length} Perlu Perhatian
              </span>
            </div>
            <div className="p-0">
              {expiring_contracts.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  <p className="text-xs font-bold text-slate-600">Semua Kontrak Berjalan Normal</p>
                  <p className="text-[11px] text-slate-400">Tidak ada kontrak yang kedaluwarsa dalam 45 hari ke depan.</p>
                </div>
              ) : (
                <ul className="flex flex-col text-[13px]">
                  {expiring_contracts.map((c) => {
                    const isUrgent = c.days_remaining <= 7;
                    return (
                      <li key={c.id} className="p-3 border-b border-[#f4f4f4] flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div>
                          <span className="font-bold text-[#333] block text-[12.5px]">{c.tenant_name}</span>
                          <span className="text-[11px] text-[#666] font-mono">{c.contract_number} • {c.asset_name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-none ${
                          isUrgent 
                            ? 'bg-[#dd4b39] text-white animate-pulse' 
                            : 'bg-[#f39c12] text-white'
                        }`}>
                          H-{c.days_remaining}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="p-2.5 text-center border-t border-[#f4f4f4]">
                <Link href="/admin/kontrak" className="text-[12px] text-[#3c8dbc] font-bold hover:underline flex items-center justify-center gap-1">
                  Lihat Semua Kontrak &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Box 2: Info Tarif Perda Riil */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[14px] text-[#444] font-bold flex items-center">
                <Info className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Tarif Retribusi Daerah (Perda)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Aktif</span>
            </div>
            <div className="p-4 text-[13px] text-[#444]">
              <p className="text-xs text-slate-500 mb-2.5">
                Dasar penetapan perhitungan SKRD Hanggar & Ruangan sesuai Perda Retribusi Daerah:
              </p>
              <ul className="flex flex-col gap-2 text-xs">
                {master_tariffs.slice(0, 4).map((t) => (
                  <li key={t.id} className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-700">{t.objek || t.jenis_layanan}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatRupiah(t.tarif)} <span className="text-[10px] font-normal text-slate-500">/{t.satuan}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 text-right">
                <Link href="/admin/tarif" className="text-[11.5px] text-[#3c8dbc] font-bold hover:underline">
                  Kelola Master Tarif & Dasar Hukum &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
