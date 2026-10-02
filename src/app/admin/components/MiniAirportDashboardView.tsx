"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  TowerControl, Plane, Users, ClipboardCheck, 
  ArrowRight, RefreshCw, Loader2, CheckCircle2, 
  AlertCircle, MapPin, Building2, Info, Eye, ExternalLink
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import { rentalService } from '@/services/rentalService';
import { contractService } from '@/services/contractService';
import { invoiceService } from '@/services/invoiceService';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface MiniAirportDashboardViewProps {
  readonly user: any;
}

export const MiniAirportDashboardView: React.FC<MiniAirportDashboardViewProps> = ({ user }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const airportName = user?.airport_name || 'Mini Airport Aminggaru (Ilaga)';
  const airportCode = (user?.airport_code || 'ILA').toUpperCase();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [logsData, appsData, contractsData, invoicesData] = await Promise.all([
        miniAirportLogService.getAllLogs().catch(() => []),
        rentalService.getAllApplications().catch(() => []),
        contractService.getContracts().catch(() => []),
        invoiceService.getAllInvoices().catch(() => [])
      ]);

      setLogs(logsData || []);
      setApplications(appsData || []);
      setContracts(contractsData || []);
      setInvoices(invoicesData || []);
    } catch (err) {
      console.error('Error fetching mini airport dashboard:', err);
      toast.error('Gagal memuat data dashboard operasional mini airport');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Parsing data log operasional di stand
  const parsedLogs = useMemo(() => {
    return logs.map((l) => {
      let spec: any = {};
      if (typeof l.notes === 'string') {
        try { spec = JSON.parse(l.notes); } catch (e) { spec = {}; }
      }
      return {
        ...l,
        parsedNotes: spec,
        standNumber: (l.parking_location || '').includes('01') || spec.allocated_stand === 'STAND 01' ? 'STAND 01' : (
          (l.parking_location || '').includes('02') || spec.allocated_stand === 'STAND 02' ? 'STAND 02' : 'APRON'
        )
      };
    });
  }, [logs]);

  // Keterisian Stand Apron Aktif (Pesawat yang belum checkout / exit_time null)
  const stand1Occupied = useMemo(() => {
    return parsedLogs.find((l) => !l.exit_time && l.standNumber === 'STAND 01');
  }, [parsedLogs]);

  const stand2Occupied = useMemo(() => {
    return parsedLogs.find((l) => !l.exit_time && l.standNumber === 'STAND 02');
  }, [parsedLogs]);

  const totalOccupiedStands = (stand1Occupied ? 1 : 0) + (stand2Occupied ? 1 : 0);
  const standOccupancyPercent = Math.round((totalOccupiedStands / 2) * 100);

  // Perhitungan Keuangan SKRD Mini Airport
  const { realisasiPAD, paidInvoicesCount, totalPiutang } = useMemo(() => {
    let paid = 0;
    let paidCount = 0;
    let piutang = 0;

    invoices.forEach((inv) => {
      const amt = Number(inv.amount || 0);
      const s = (inv.status || '').toLowerCase();
      if (s === 'paid' || s === 'lunas') {
        paid += amt;
        paidCount++;
      } else {
        piutang += amt;
      }
    });

    // Jika belum ada invoice yang terbit dari backend, hitung dari realisasi log
    if (paid === 0 && logs.length > 0) {
      logs.forEach(l => {
        if (l.billing_status === 'Billed') {
          paid += Number(l.amount || 0);
          paidCount++;
        } else {
          piutang += Number(l.amount || 0);
        }
      });
    }

    return {
      realisasiPAD: paid,
      paidInvoicesCount: paidCount,
      totalPiutang: piutang
    };
  }, [invoices, logs]);

  // Permohonan Butuh Validasi Admin Mini Airport
  const pendingApps = useMemo(() => {
    return applications.filter((app) => 
      ['menunggu validasi admin', 'submitted', 'pending'].includes((app.status || '').toLowerCase())
    );
  }, [applications]);

  // Log belum terbit SKRD
  const unbilledLogs = useMemo(() => {
    return parsedLogs.filter((l) => l.billing_status === 'Unbilled');
  }, [parsedLogs]);

  // Total Penumpang (PAX)
  const totalPax = useMemo(() => {
    return parsedLogs.reduce((sum, l) => {
      const p = Number(l.parsedNotes?.passengers_count || 0);
      return sum + p;
    }, 0);
  }, [parsedLogs]);

  if (isLoading) {
    return (
      <div className="p-12 bg-[#ecf0f5] min-h-[calc(100vh-60px)] flex flex-col justify-center items-center text-[#777]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat Dashboard Operasional {airportName}...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header Dashboard (Persis Mozes Kilangin) */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase flex items-center gap-2">
            Dashboard Operasional &amp; Perizinan Mini Airport
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Monitoring Utilisasi Stand Apron, Slot Pendaratan Perintis &amp; Retribusi Daerah {airportName} ({airportCode})
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
            <span className="mr-1">Admin Mini Airport</span> / <span className="ml-1 font-bold text-slate-800">Dashboard Operasional</span>
          </div>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards (AdminLTE Flat Style with Top Border) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Realisasi Retribusi */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <RupiahIcon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Realisasi Retribusi (YTD)</span>
            <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
              {formatRupiah(realisasiPAD)}
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              {paidInvoicesCount} SKRD Lunas • Piutang: {formatRupiah(totalPiutang)}
            </span>
          </div>
        </div>

        {/* KPI 2: Keterisian Stand Apron */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <TowerControl className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Utilisasi Stand Apron</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {totalOccupiedStands} / 2 Stand ({standOccupancyPercent}%)
            </span>
            <span className="text-[11px] text-[#777] font-semibold mt-1">
              Stand 01: <strong className={stand1Occupied ? 'text-rose-600' : 'text-emerald-600'}>{stand1Occupied ? 'Terisi' : 'Kosong'}</strong> • Stand 02: <strong className={stand2Occupied ? 'text-rose-600' : 'text-emerald-600'}>{stand2Occupied ? 'Terisi' : 'Kosong'}</strong>
            </span>
          </div>
        </div>

        {/* KPI 3: Total Pendaratan & PAX */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Plane className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Pergerakan Pesawat &amp; PAX</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {logs.length} Pendaratan
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Total {totalPax} Penumpang (PAX)
            </span>
          </div>
        </div>

        {/* KPI 4: Permohonan Izin Pendaratan */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Izin Pendaratan</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {applications.length} Pengajuan
            </span>
            <span className="text-[11px] font-bold mt-1">
              {pendingApps.length > 0 ? (
                <span className="text-amber-600">⚠️ {pendingApps.length} Menunggu Validasi Admin</span>
              ) : (
                <span className="text-emerald-600">Semua Permohonan Telah Diproses</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Baris 1.5: Action Hub (Antrean Tindakan Cepat Admin - Persis Mozes Kilangin border-l-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link 
          href="/admin/permohonan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Validasi Permohonan</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {pendingApps.length} Permohonan Masuk Menunggu Stand
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            pendingApps.length > 0 
              ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {pendingApps.length}
          </span>
        </Link>

        <Link 
          href="/admin/tagihan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Menunggu SKRD Dinas</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {unbilledLogs.filter(l => l.exit_time).length} Log Pasca-Checkout (Diteruskan ke Dinas)
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            unbilledLogs.filter(l => l.exit_time).length > 0 
              ? 'bg-blue-100 text-[#3c8dbc] border border-blue-300' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {unbilledLogs.filter(l => l.exit_time).length}
          </span>
        </Link>

        <Link 
          href="/petugas/mini-airport" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Armada di Apron</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {totalOccupiedStands} Pesawat Sedang Terparkir
            </p>
          </div>
          <span className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-xs ${
            totalOccupiedStands > 0 
              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            {totalOccupiedStands}
          </span>
        </Link>

        <Link 
          href="/admin/kontrak" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Mitra Maskapai (PKS)</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {contracts.length} Maskapai Berizin Operasi
            </p>
          </div>
          <span className="w-7 h-7 bg-blue-50 text-[#3c8dbc] border border-blue-200 rounded-none flex items-center justify-center font-bold text-xs">
            {contracts.length}
          </span>
        </Link>
      </div>

      {/* Baris 2: Layout 2 Kolom (Peta Visual Stand Apron & Kolom Kanan Monitoring) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Kolom Kiri: Peta Spasial Stand Apron & Antrean Permohonan (2/3 lebar) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Card 1: Peta Spasial Stand Apron (Sama Persis Format Visual Aset Mozes Kilangin) */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50">
              <h3 className="text-[15px] text-[#444] font-bold flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Peta Visual Stand Apron &amp; Realisasi Parkir Pesawat
              </h3>
              <div className="flex flex-wrap gap-3 text-[11px] font-bold">
                <span className="flex items-center"><div className="w-3 h-3 bg-[#3c8dbc] mr-1"></div> Terisi Penuh</span>
                <span className="flex items-center"><div className="w-3 h-3 border border-[#d2d6de] mr-1"></div> Tersedia / Kosong</span>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STAND 01 */}
                <div className={`bg-white p-4 relative shadow-sm border transition-all ${
                  stand1Occupied ? 'border-[#3c8dbc]' : 'border-[#d2d6de]'
                }`}>
                  {/* Badge status pojok kanan */}
                  <div className={`absolute top-0 right-0 text-white px-2.5 py-1 text-[10px] font-bold uppercase ${
                    stand1Occupied ? 'bg-[#3c8dbc]' : 'bg-slate-400'
                  }`}>
                    {stand1Occupied ? 'Terisi (100%)' : 'Tersedia'}
                  </div>

                  <h4 className="font-bold text-[17px] text-[#333] flex items-center gap-1.5">
                    STAND 01 - APRON UTAMA
                  </h4>
                  <p className="text-[11.5px] text-[#666] mb-3">
                    Kode: <span className="font-mono font-bold text-slate-700">{airportCode}-APRN-01</span> • Dimensi: 35m × 25m (Kapasitas: 1 Armada)
                  </p>

                  <div className="border-t border-[#f4f4f4] pt-3">
                    {stand1Occupied ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10.5px] text-[#777] font-bold uppercase">
                            Armada Sedang Parkir:
                          </p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200">
                            Aktif di Lapangan
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="bg-blue-50 text-[#3c8dbc] border border-blue-200 px-2 py-0.5 text-[11px] font-bold font-mono">
                            ✈ {stand1Occupied.registration_number} ({stand1Occupied.parsedNotes?.aircraft_type || 'Pesawat Perintis'})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1 pt-1.5 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0" />
                            <span className="truncate">
                              Operator: <strong className="text-slate-800">{stand1Occupied.tenants?.nama_perusahaan || 'Maskapai Perintis'}</strong>
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Mendarat: {dayjs(stand1Occupied.entry_time).format('DD MMM YYYY, HH:mm')} WIT • {stand1Occupied.parsedNotes?.passengers_count || 1} PAX
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[65px] bg-slate-50 border border-dashed border-slate-200 text-center">
                        <span className="text-[11.5px] font-bold text-slate-400 italic">
                          Fasilitas Stand 01 Kosong / Siap Digunakan
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* STAND 02 */}
                <div className={`bg-white p-4 relative shadow-sm border transition-all ${
                  stand2Occupied ? 'border-[#3c8dbc]' : 'border-[#d2d6de]'
                }`}>
                  {/* Badge status pojok kanan */}
                  <div className={`absolute top-0 right-0 text-white px-2.5 py-1 text-[10px] font-bold uppercase ${
                    stand2Occupied ? 'bg-[#3c8dbc]' : 'bg-slate-400'
                  }`}>
                    {stand2Occupied ? 'Terisi (100%)' : 'Tersedia'}
                  </div>

                  <h4 className="font-bold text-[17px] text-[#333] flex items-center gap-1.5">
                    STAND 02 - APRON CADANGAN
                  </h4>
                  <p className="text-[11.5px] text-[#666] mb-3">
                    Kode: <span className="font-mono font-bold text-slate-700">{airportCode}-APRN-02</span> • Dimensi: 35m × 25m (Kapasitas: 1 Armada)
                  </p>

                  <div className="border-t border-[#f4f4f4] pt-3">
                    {stand2Occupied ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10.5px] text-[#777] font-bold uppercase">
                            Armada Sedang Parkir:
                          </p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200">
                            Aktif di Lapangan
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="bg-blue-50 text-[#3c8dbc] border border-blue-200 px-2 py-0.5 text-[11px] font-bold font-mono">
                            ✈ {stand2Occupied.registration_number} ({stand2Occupied.parsedNotes?.aircraft_type || 'Pesawat Perintis'})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1 pt-1.5 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0" />
                            <span className="truncate">
                              Operator: <strong className="text-slate-800">{stand2Occupied.tenants?.nama_perusahaan || 'Maskapai Perintis'}</strong>
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Mendarat: {dayjs(stand2Occupied.entry_time).format('DD MMM YYYY, HH:mm')} WIT • {stand2Occupied.parsedNotes?.passengers_count || 1} PAX
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[65px] bg-slate-50 border border-dashed border-slate-200 text-center">
                        <span className="text-[11.5px] font-bold text-slate-400 italic">
                          Fasilitas Stand 02 Kosong / Siap Digunakan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Fasilitas pendaratan &amp; parkir {airportName}</span>
                <Link href="/petugas/mini-airport" className="text-[#3c8dbc] font-bold hover:underline flex items-center gap-1">
                  Pencatatan Realisasi Petugas Lapangan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Antrean Permohonan Izin Pendaratan Masuk */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex flex-col">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[14px] text-[#444] font-bold flex items-center">
                <ClipboardCheck className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Permohonan Izin Pendaratan Terkini
              </h3>
              <Link href="/admin/permohonan" className="text-[11px] font-bold text-[#3c8dbc] hover:underline flex items-center gap-1">
                Lihat Semua Permohonan ({applications.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="p-0 overflow-x-auto">
              {applications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Plane className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Belum ada permohonan pendaratan yang diajukan ke {airportName}.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#f4f4f4] bg-slate-50 text-slate-600 font-bold">
                      <th className="py-2.5 px-3">No. Registrasi</th>
                      <th className="py-2.5 px-3">Maskapai Pemohon</th>
                      <th className="py-2.5 px-3">Rencana Landing</th>
                      <th className="py-2.5 px-3">Armada Pesawat</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.slice(0, 5).map((app) => {
                      let appSpec: any = {};
                      if (typeof app.specific_needs === 'string') {
                        try { appSpec = JSON.parse(app.specific_needs); } catch (e) { appSpec = {}; }
                      } else {
                        appSpec = app.specific_needs || {};
                      }

                      return (
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                            {app.application_number}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {app.tenants?.nama_perusahaan || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                            {appSpec.landing_date ? dayjs(appSpec.landing_date).format('DD MMM YYYY') : (app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-')} {appSpec.landing_time ? `(${appSpec.landing_time} WIT)` : ''}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                            {appSpec.registration_number || '-'} ({appSpec.aircraft_type || 'Perintis'})
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <StatusBadge status={app.status} className="text-[10px] px-2 py-0.5" />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Link
                              href={`/admin/permohonan/review/${app.id}`}
                              className="inline-flex items-center gap-1 text-[#3c8dbc] hover:underline font-bold text-[11px] bg-blue-50 px-2 py-1 border border-blue-200 hover:bg-blue-100"
                            >
                              <Eye className="w-3 h-3" /> Detail &amp; Review
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Log Realisasi & Info Tarif Perda (1/3 lebar) */}
        <div className="flex flex-col gap-4">
          
          {/* Card 3: Log Realisasi Pendaratan Terkini */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[14px] text-[#444] font-bold flex items-center">
                <TowerControl className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Log Realisasi Pendaratan
              </h3>
              <span className="text-[11px] font-bold text-[#3c8dbc] bg-blue-50 px-2 py-0.5 border border-blue-200">
                {logs.length} Flight
              </span>
            </div>

            <div className="p-0">
              {logs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Belum ada catatan kedatangan armada di bandara ini.
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-[#f4f4f4] text-xs">
                  {parsedLogs.slice(0, 5).map((l) => (
                    <li key={l.id} className="p-3 hover:bg-slate-50 transition-colors flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono font-bold text-blue-700 text-xs">
                            ✈ {l.registration_number}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200">
                            {l.standNumber}
                          </span>
                        </div>
                        <span className="block text-[11px] font-medium text-slate-700 truncate max-w-[170px]">
                          {l.tenants?.nama_perusahaan || '-'}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {dayjs(l.entry_time).format('DD MMM YYYY, HH:mm')} WIT • {l.parsedNotes?.passengers_count || 1} PAX
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono font-bold text-[11px] text-slate-800">
                          {formatRupiah(Number(l.amount || 0))}
                        </span>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 border mt-1 ${
                          l.billing_status === 'Billed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : !l.exit_time
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {l.billing_status === 'Billed'
                            ? 'SKRD Terbit (Dinas)'
                            : !l.exit_time
                            ? 'Parkir di Apron'
                            : 'Menunggu SKRD Dinas'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-2.5 text-center border-t border-[#f4f4f4]">
                <Link href="/petugas/mini-airport" className="text-[12px] text-[#3c8dbc] font-bold hover:underline flex items-center justify-center gap-1">
                  Pencatatan Log Petugas Lapangan &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Tarif Retribusi Daerah Lapangan Terbang Perintis (Perda) */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[14px] text-[#444] font-bold flex items-center">
                <Info className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Tarif Retribusi Daerah (Perda)
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 border border-slate-200">
                Aktif 2026
              </span>
            </div>

            <div className="p-4 text-[13px] text-[#444]">
              <p className="text-xs text-slate-500 mb-2.5">
                Struktur perhitungan SKRD retribusi jasa bandar udara perintis di {airportName}:
              </p>
              <ul className="flex flex-col gap-2 text-xs">
                <li className="p-2 bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11.5px]">Jasa Pendaratan (Landing)</span>
                    <span className="text-[10px] text-slate-500">Twin Otter / Caravan / Pilatus</span>
                  </div>
                  <span className="font-mono font-bold text-[#00a65a] text-xs">Rp 100.000 / landing</span>
                </li>

                <li className="p-2 bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11.5px]">Pelayanan Penumpang (PJP2U)</span>
                    <span className="text-[10px] text-slate-500">Retribusi fasilitas terminal perintis</span>
                  </div>
                  <span className="font-mono font-bold text-[#00a65a] text-xs">Rp 25.000 / pax</span>
                </li>

                <li className="p-2 bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11.5px]">Jasa Parkir Inap (Overnight)</span>
                    <span className="text-[10px] text-slate-500">Penempatan pesawat di stand apron</span>
                  </div>
                  <span className="font-mono font-bold text-[#00a65a] text-xs">Rp 150.000 / malam</span>
                </li>
              </ul>

              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Perda Retribusi Daerah No. 1/2024</span>
                <Link href="/admin/tarif" className="text-[#3c8dbc] font-bold hover:underline">
                  Kelola Tarif &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

