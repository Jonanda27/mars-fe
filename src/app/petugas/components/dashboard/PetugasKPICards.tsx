import React from 'react';
import { 
  Plane, Clock, Calendar, CheckCircle2, History 
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

interface PetugasKPICardsProps {
  readonly activeLogsCount: number;
  readonly todayArrivalsCount: number;
  readonly closingData: { is_already_submitted: boolean; existing_report: any } | null;
}

export const PetugasKPICards: React.FC<PetugasKPICardsProps> = ({
  activeLogsCount,
  todayArrivalsCount,
  closingData,
}) => {
  return (
    <>
      {/* 3 KPI Cards (AdminLTE Flat Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* KPI 1: Pesawat Parkir Saat Ini */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-14 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
            <Plane className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="p-2.5 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[10px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
              Pesawat Parkir Saat Ini
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5 truncate">
              {activeLogsCount} <span className="text-xs font-sans text-slate-500 font-normal">Armada</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#3c8dbc] font-bold mt-1 line-clamp-1 sm:line-clamp-none">
              Sedang Menempati Fasilitas
            </span>
          </div>
        </div>

        {/* KPI 2: Kedatangan Hari Ini */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-14 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
            <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="p-2.5 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[10px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
              Kedatangan Hari Ini
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5 truncate">
              {todayArrivalsCount} <span className="text-xs font-sans text-slate-500 font-normal">Jadwal</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#3c8dbc] font-bold mt-1 line-clamp-1 sm:line-clamp-none">
              Terverifikasi &amp; Siap Check-In
            </span>
          </div>
        </div>

        {/* KPI 3: Tanggal Operasional */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-14 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="p-2.5 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[10px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
              Tanggal Operasional
            </span>
            <span className="text-[14px] sm:text-[16px] font-bold text-[#333] leading-tight mt-0.5 truncate">
              {dayjs().format('dddd, DD MMM YYYY')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#3c8dbc] font-bold mt-1 line-clamp-1 sm:line-clamp-none">
              Warden Hanggar Aktif
            </span>
          </div>
        </div>
      </div>

      {/* BANNER STATUS TUTUP HARI OPERASIONAL (Slide 8 PPTX) */}
      {closingData?.is_already_submitted ? (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <span>Laporan Tutup Hari Ini: SUDAH DIKIRIM</span>
                <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                  {closingData.existing_report?.items?.length || 0} Armada Tercatat Inap
                </span>
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Dikirim oleh <strong>{closingData.existing_report?.officer?.username || 'Petugas'}</strong> pada {closingData.existing_report?.created_at ? dayjs(closingData.existing_report.created_at).format('DD/MM/YYYY HH:mm') : '-'}. Data log inap telah terekonsiliasi untuk penetapan SKRD Dinas.
              </p>
            </div>
          </div>
          <Link
            href="/petugas/riwayat"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <History className="w-3.5 h-3.5" />
            Lihat Riwayat Laporan
          </Link>
        </div>
      ) : (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <span>Laporan Tutup Hari Hari Ini: BELUM DIKIRIM</span>
                <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">
                  {activeLogsCount} Armada Sedang Menempati Fasilitas
                </span>
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Pastikan seluruh pesawat yang menginap malam ini telah diambil foto fisiknya dan dilaporkan melalui formulir Tutup Hari sebelum pukul 23:59 WIT.
              </p>
            </div>
          </div>
          <Link
            href="/petugas/tutup-hari"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Clock className="w-3.5 h-3.5" />
            Isi Laporan Tutup Hari Sekarang
          </Link>
        </div>
      )}
    </>
  );
};
