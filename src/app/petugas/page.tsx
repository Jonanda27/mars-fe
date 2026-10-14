"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import {
  ShieldCheck, Plane, ChevronRight, CheckCircle2, ListChecks, Activity,
} from 'lucide-react';
import { flightScheduleService } from '@/services/flightScheduleService';
import { logService } from '@/services/logService';
import { overnightReportService } from '@/services/overnightReportService';
import { FlightSchedule } from '@/types/flightSchedule';
import { useAuthStore } from '@/store/useAuthStore';
import { PetugasKPICards } from './components/dashboard/PetugasKPICards';

/** Jadwal milik Bandara Mozes Kilangin (bukan Mini Airport). */
const isMozesSchedule = (s: FlightSchedule) => {
  const loc = (s.parking_location || '').toLowerCase();
  const purpose = (s.purpose || '').toLowerCase();
  return !loc.includes('stand') && !loc.includes('mini') && !loc.includes('airstrip')
    && !purpose.includes('mini airport') && !purpose.includes('perintis');
};

interface TodoItem {
  readonly key: string;
  readonly count: number;
  readonly label: string;
  readonly href: string;
  readonly icon: React.ReactNode;
}

export default function PetugasDashboardPage() {
  const { user } = useAuthStore();
  const airportName = user?.airport_name || 'Bandara Mozes Kilangin';

  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [todayArrivals, setTodayArrivals] = useState<FlightSchedule[]>([]);
  const [pendingSchedules, setPendingSchedules] = useState<FlightSchedule[]>([]);
  const [closingData, setClosingData] = useState<{ is_already_submitted: boolean; existing_report: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    const [logs, arrivals, schedules, closing] = await Promise.allSettled([
      logService.getActiveLogs(),
      flightScheduleService.getTodayExpectedArrivals(),
      flightScheduleService.getAllSchedules(),
      overnightReportService.getTodayDraftRoster(),
    ]);

    if (logs.status === 'fulfilled') setActiveLogs(logs.value || []);
    if (arrivals.status === 'fulfilled') {
      setTodayArrivals((arrivals.value || []).filter(isMozesSchedule));
    }
    if (schedules.status === 'fulfilled') {
      setPendingSchedules(
        (schedules.value || []).filter(
          (s: FlightSchedule) => isMozesSchedule(s) && s.status === 'Menunggu Verifikasi Petugas'
        )
      );
    }
    if (closing.status === 'fulfilled') setClosingData(closing.value || null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const todos = useMemo<TodoItem[]>(() => [
    {
      key: 'verifikasi',
      count: pendingSchedules.length,
      label: 'jadwal kedatangan menunggu verifikasi',
      href: '/petugas/verifikasi-jadwal',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      key: 'checkin',
      count: todayArrivals.length,
      label: 'kedatangan hari ini belum check-in',
      href: '/petugas/log-operasional',
      icon: <Plane className="w-4 h-4" />,
    },
  ].filter(t => t.count > 0), [pendingSchedules, todayArrivals]);

  const recentActivity = useMemo(
    () => [...activeLogs]
      .sort((a, b) => dayjs(b.entry_time).valueOf() - dayjs(a.entry_time).valueOf())
      .slice(0, 5),
    [activeLogs]
  );

  return (
    <div className="p-3 sm:p-4 bg-[#ecf0f5] min-h-full space-y-3 sm:space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-baseline gap-1.5">
            Dashboard <span className="text-xs sm:text-sm font-normal text-gray-500">{airportName}</span>
          </h1>
        </div>
        <div className="text-[11px] sm:text-xs text-gray-500 flex items-center bg-white sm:bg-transparent px-2.5 py-1 rounded border sm:border-0 border-gray-200">
          <span className="mr-1">Petugas</span> / <span className="ml-1 font-semibold text-gray-800">Dashboard</span>
        </div>
      </header>

      {/* KPI & Status Tutup Hari */}
      <PetugasKPICards
        activeLogsCount={activeLogs.length}
        todayArrivalsCount={todayArrivals.length}
        closingData={closingData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Perlu Tindakan */}
        <section className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
          <div className="p-[10px] border-b border-[#f4f4f4] bg-slate-50 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#3c8dbc]" />
            <h3 className="text-[16px] text-[#444] font-normal">Perlu Tindakan</h3>
          </div>
          <div className="divide-y divide-[#f4f4f4]">
            {isLoading && <div className="p-4 text-xs text-slate-400">Memuat...</div>}
            {!isLoading && todos.length === 0 && (
              <div className="p-4 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Semua tugas operasional sudah ditangani.
              </div>
            )}
            {!isLoading && todos.map(todo => (
              <Link
                key={todo.key}
                href={todo.href}
                className="flex items-center justify-between gap-3 p-3 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-[#3c8dbc]">{todo.icon}</span>
                  <span className="text-sm text-slate-700">
                    <strong className="text-slate-900 font-mono">{todo.count}</strong> {todo.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#3c8dbc]" />
              </Link>
            ))}
          </div>
        </section>

        {/* Pesawat Masuk Terakhir */}
        <section className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
          <div className="p-[10px] border-b border-[#f4f4f4] bg-slate-50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3c8dbc]" />
              <h3 className="text-[16px] text-[#444] font-normal">Pesawat Masuk Terakhir</h3>
            </div>
            <Link href="/petugas/log-operasional" className="text-xs font-bold text-[#3c8dbc] hover:underline">
              Lihat Log Operasional
            </Link>
          </div>
          <ul className="divide-y divide-[#f4f4f4]">
            {isLoading && <li className="p-4 text-xs text-slate-400">Memuat...</li>}
            {!isLoading && recentActivity.length === 0 && (
              <li className="p-4 text-xs text-slate-400">Belum ada pesawat di fasilitas.</li>
            )}
            {!isLoading && recentActivity.map(log => (
              <li key={log.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold font-mono text-slate-900">{log.registration_number}</div>
                  <div className="text-slate-500">
                    {log.tenants?.nama_perusahaan || '-'} · {log.parking_location || '-'}
                  </div>
                </div>
                <div className="text-right text-slate-500 font-mono">
                  {log.entry_time ? dayjs(log.entry_time).format('DD/MM HH:mm') : '-'}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
