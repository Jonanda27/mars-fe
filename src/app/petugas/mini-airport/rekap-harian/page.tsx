"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, Calendar, Printer, RefreshCw, Plane, Users, 
  Moon, Sun, TowerControl, FileText, Loader2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import { formatRupiah } from '@/utils/formatCurrency';
import { useAuthStore } from '@/store/useAuthStore';
import { StandCapacityCards } from '@/app/petugas/mini-airport/components/StandCapacityCards';
import StatusBadge from '@/components/StatusBadge';

dayjs.locale('id');

export default function RekapHarianMiniAirportPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await miniAirportLogService.getAllLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat log pergerakan pesawat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter logs based on selectedDate
  const dayLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = dayjs(log.entry_time).format('YYYY-MM-DD');
      return logDate === selectedDate;
    });
  }, [logs, selectedDate]);

  // KPI Calculations
  const totalMovements = dayLogs.length;
  const totalPax = dayLogs.reduce((acc, curr) => {
    const spec = curr.parsedNotes || {};
    const p = curr.passengers_count ?? spec.passengers_count ?? 0;
    return acc + Number(p);
  }, 0);

  // Pesawat Menginap (RON): terflag is_overnight atau aktif di apron (!exit_time) melewati cut-off 17:00 WIT / beda hari
  const overnightLogs = dayLogs.filter(log => {
    if (log.is_overnight) return true;
    if (!log.exit_time && log.entry_time) {
      const entry = dayjs(log.entry_time);
      const now = dayjs();
      return !now.isSame(entry, 'day') || now.hour() >= 17;
    }
    return false;
  });
  const overnightCount = overnightLogs.length;

  const totalEstimatedRevenue = dayLogs.reduce((acc, curr) => {
    const spec = curr.parsedNotes || {};
    const rawVal = curr.amount ?? curr.total_amount ?? spec.estimated_total ?? curr.calculated_taxes?.total ?? 0;
    return acc + Number(rawVal);
  }, 0);

  // Stand status active check (sesuai tanggal & kondisi fisik real-time apron)
  const isToday = dayjs(selectedDate).isSame(dayjs(), 'day');

  const stand1Occupied = useMemo(() => {
    if (isToday) {
      return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('01')) ||
             dayLogs.find((l) => l.is_overnight && (l.parking_location || '').includes('01'));
    }
    return dayLogs.find((l) => (l.is_overnight || !l.exit_time) && (l.parking_location || '').includes('01'));
  }, [logs, dayLogs, isToday]);

  const stand2Occupied = useMemo(() => {
    if (isToday) {
      return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('02')) ||
             dayLogs.find((l) => l.is_overnight && (l.parking_location || '').includes('02'));
    }
    return dayLogs.find((l) => (l.is_overnight || !l.exit_time) && (l.parking_location || '').includes('02'));
  }, [logs, dayLogs, isToday]);

  const displayAirport = useMemo(() => {
    if (!user?.airport_name) return 'Bandara Perintis Papua Tengah';
    if (user.airport_name.toLowerCase().startsWith('mini airport')) {
      return user.airport_name.replace(/^mini airport\s+/i, 'Bandara ');
    }
    return user.airport_name;
  }, [user?.airport_name]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans print:p-0 print:bg-white">
      {/* 1. Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 print:hidden">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Rekapitulasi &amp; Tutup Hari <span className="text-[15px] font-light text-[#777] ml-2">{displayAirport}</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <Link href="/petugas/mini-airport" className="mr-1 hover:text-[#3c8dbc]">Petugas Mini Airport</Link> / <span className="ml-1 font-medium">Rekapitulasi Harian</span>
        </div>
      </header>

      {/* 2. Date Picker Bar & Actions */}
      <div className="bg-white p-3.5 border border-slate-200 border-t-[3px] border-t-[#3c8dbc] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#3c8dbc]" />
            <span>Pilih Tanggal Tutup Hari:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-[#d2d6de] px-3 py-1.5 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-[#3c8dbc]"
          />
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            Status: <strong className="text-[#3c8dbc] font-bold">{dayjs(selectedDate).format('dddd, DD MMMM YYYY')}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white shadow-xs flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Rekap Harian
          </button>
          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            className="px-2.5 py-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-600 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3c8dbc]" /> Refresh
          </button>
        </div>
      </div>

      {/* Print Cover Header (Hanya muncul saat cetak PDF/Kertas) */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-4">
        <div className="text-center">
          <h2 className="text-base font-bold uppercase tracking-wider">PEMERINTAH PROVINSI PAPUA TENGAH</h2>
          <h3 className="text-sm font-bold uppercase">DINAS PERHUBUNGAN — UNIT PELAKSANA TEKNIS BANDARA PERINTIS</h3>
          <p className="text-xs text-gray-600 mt-1">
            Laporan Tutup Hari &amp; Rekapitulasi Fisik Pergerakan Pesawat Udara
          </p>
          <p className="text-xs font-bold mt-1">
            Bandara: {user?.airport_name || 'Mini Airport Pedalaman'} • Tanggal: {dayjs(selectedDate).format('DD MMMM YYYY')}
          </p>
        </div>
      </div>

      {/* 3. Stat Boxes (AdminLTE Flat Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Total Movements */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Plane className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Pergerakan Pesawat</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {totalMovements} <span className="text-xs font-sans text-slate-500 font-normal">Pendaratan</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">{dayjs(selectedDate).format('DD MMM YYYY')}</span>
          </div>
        </div>

        {/* Box 2: Total Pax */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Users className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Total Penumpang (Pax)</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {totalPax} <span className="text-xs font-sans text-slate-500 font-normal">Orang</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Retribusi Pax Terdata</span>
          </div>
        </div>

        {/* Box 3: Pesawat Inap RON */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Moon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Pesawat Menginap (RON)</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {overnightCount} <span className="text-xs font-sans text-slate-500 font-normal">Armada</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Parkir Menginap di Stand</span>
          </div>
        </div>

        {/* Box 4: Estimasi Retribusi */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <FileText className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Estimasi Pajak Retribusi</span>
            <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
              {formatRupiah(totalEstimatedRevenue)}
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Dasar Penetapan SKRD Dinas</span>
          </div>
        </div>
      </div>

      {/* 4. Stand Status Tonight / Active Cards */}
      <StandCapacityCards
        stand1Occupied={stand1Occupied}
        stand2Occupied={stand2Occupied}
      />

      {/* 5. Main Table: Rincian Log Pergerakan Pesawat */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              Daftar Pergerakan Pesawat — {dayjs(selectedDate).format('DD MMMM YYYY')}
            </h2>
            <p className="text-[11px] text-slate-500">Rincian log operasional harian yang terdata di airstrip.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2.5 py-1 border border-slate-200">
            {dayLogs.length} Pendaratan
          </span>
        </div>

        <div className="overflow-x-auto min-h-[220px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#3c8dbc] mb-2" />
              <span className="text-xs">Memuat rekapitulasi harian...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Waktu (WIT)</th>
                  <th className="py-3 px-4">Maskapai / Tenant</th>
                  <th className="py-3 px-4">Armada Pesawat</th>
                  <th className="py-3 px-4">Stand</th>
                  <th className="py-3 px-4 text-center">Pax</th>
                  <th className="py-3 px-4 text-center">Status Parkir</th>
                  <th className="py-3 px-4">Estimasi Tagihan</th>
                  <th className="py-3 px-4 text-right">Status SKRD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dayLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <span>Tidak ada pergerakan pendaratan pesawat tercatat pada tanggal {dayjs(selectedDate).format('DD MMMM YYYY')}.</span>
                    </td>
                  </tr>
                ) : (
                  dayLogs.map((item, idx) => {
                    const spec = item.parsedNotes || {};
                    const isStillParked = !item.exit_time;
                    const entry = dayjs(item.entry_time);
                    const exit = item.exit_time ? dayjs(item.exit_time) : dayjs();

                    const totalMinutes = Math.max(0, exit.diff(entry, 'minute'));
                    const days = Math.floor(totalMinutes / (24 * 60));
                    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                    const minutes = totalMinutes % 60;

                    let durationStr = '';
                    if (days > 0) {
                      durationStr = `${days}h ${hours}j ${minutes}m`;
                    } else if (hours > 0) {
                      durationStr = `${hours}j ${minutes}m`;
                    } else {
                      durationStr = `${minutes}m`;
                    }

                    const isDifferentDay = !exit.isSame(entry, 'day');
                    const isPast17 = exit.hour() >= 17;
                    const isOvernightActive = isDifferentDay || isPast17 || Boolean(item.is_overnight);

                    const tenantName =
                      item.tenants?.nama_perusahaan ||
                      item.rental_applications?.tenants?.nama_perusahaan ||
                      spec.tenant_name ||
                      '-';
                    const paxCount = item.passengers_count ?? spec.passengers_count ?? 0;
                    const revenueAmount = item.amount ?? item.total_amount ?? spec.estimated_total ?? 0;

                    return (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-800">In: {dayjs(item.entry_time).format('HH:mm')} WIT</div>
                          <div className="text-[11px] text-slate-500">
                            {item.exit_time ? `Out: ${dayjs(item.exit_time).format('HH:mm')} WIT` : (isOvernightActive ? 'Inap (RON)' : 'Di Apron')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {tenantName}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900 flex items-center gap-1 text-[12px]">
                            <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                            {item.registration_number}
                          </div>
                          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                            {spec.aircraft_type || item.aircraft_type || 'Perintis'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 text-[11px] border border-slate-200 rounded">
                            <TowerControl className="w-3 h-3 text-slate-500" />
                            {spec.allocated_stand || item.parking_location || 'STAND 01'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            <Users className="w-3 h-3 text-slate-500" />
                            {paxCount} Pax
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isStillParked ? (
                            <div className="flex flex-col items-center gap-0.5">
                              {isOvernightActive ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold text-[11px] bg-purple-50 text-purple-700 border border-purple-200 rounded">
                                  <Moon className="w-3 h-3 text-purple-600" /> INAP (RON)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-200 rounded">
                                  <Sun className="w-3 h-3 text-amber-600" /> PARKIR SIANG
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-700 font-bold">
                                ⏱️ {durationStr}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-200 rounded">
                                {item.is_overnight ? <Moon className="w-3 h-3 text-purple-600" /> : <Sun className="w-3 h-3 text-amber-600" />}
                                {item.is_overnight ? `INAP (${spec.overnight_nights || 1}M)` : 'TRANSIT'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                Durasi: {durationStr}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {formatRupiah(revenueAmount)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isStillParked ? (
                            <StatusBadge status="info" label="PESAWAT DI APRON" />
                          ) : (item.invoices && item.invoices.length > 0) || item.billing_status === 'Billed' ? (
                            <StatusBadge status="Billed" label="SKRD TERBIT" />
                          ) : (
                            <StatusBadge status="Unbilled" label="MENUNGGU SKRD" />
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#f4f4f4] bg-gray-50/50 flex justify-between items-center text-xs text-gray-500 print:hidden">
          <span>Menampilkan {dayLogs.length} pergerakan pesawat pada {dayjs(selectedDate).format('DD MMM YYYY')}</span>
          <span className="text-[11px] text-gray-400">Jaringan Mini Airport Dinas Perhubungan Papua Tengah</span>
        </div>

        {/* Tanda Tangan Cetak (Hanya tampil saat print) */}
        <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-gray-300 text-xs">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-bold uppercase">Kepala Dinas Perhubungan</p>
            <div className="h-16"></div>
            <p className="font-bold underline">( .................................................... )</p>
            <p className="text-[10px] text-gray-500">NIP. ..............................................</p>
          </div>
          <div className="text-center">
            <p>{user?.airport_name || 'Mini Airport'}, {dayjs(selectedDate).format('DD MMMM YYYY')}</p>
            <p className="font-bold uppercase">Petugas Lapangan Mini Airport</p>
            <div className="h-16"></div>
            <p className="font-bold underline">( {user?.username || 'Petugas Lapangan'} )</p>
            <p className="text-[10px] text-gray-500">NIP/ID: {user?.id ? `PET-${String(user.id).padStart(4, '0')}` : '....................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
