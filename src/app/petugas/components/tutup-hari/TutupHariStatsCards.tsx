import React from 'react';
import { Plane, ShieldCheck, Plus, Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface TutupHariStatsCardsProps {
  readonly totalStaying: number;
  readonly activeLogCount: number;
  readonly manualCount: number;
  readonly reportDate: string;
  readonly setReportDate: (date: string) => void;
  readonly isAlreadySubmitted: boolean;
}

export const TutupHariStatsCards: React.FC<TutupHariStatsCardsProps> = ({
  totalStaying,
  activeLogCount,
  manualCount,
  reportDate,
  setReportDate,
  isAlreadySubmitted,
}) => {
  return (
    <>
      {/* 1. STATS & DATE BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Box 1: Total Menginap */}
        <div className="bg-white p-3.5 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Armada Menginap</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{totalStaying}</span>
              <span className="text-xs text-slate-500 font-medium">Unit</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Terkonfirmasi Malam Ini</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
        </div>

        {/* Box 2: Dari Log Aktif */}
        <div className="bg-white p-3.5 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dari Check-In Aktif</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{activeLogCount}</span>
              <span className="text-xs text-slate-500 font-medium">Unit</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Sesuai Izin Masuk</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Box 3: Tambahan Manual */}
        <div className="bg-white p-3.5 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pesawat Manual</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{manualCount}</span>
              <span className="text-xs text-slate-500 font-medium">Unit</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Insidentil / Ad-Hoc</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        {/* Box 4: Pemilih Tanggal Tutup Hari */}
        <div className="bg-white p-3.5 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Tutup Hari</span>
          <div className="flex items-center gap-1.5 mt-1 bg-slate-50 border border-slate-200 px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex justify-between items-center">
            <span>Status:</span>
            {isAlreadySubmitted ? (
              <span className="text-amber-600 font-bold">Sudah Disubmit</span>
            ) : (
              <span className="text-[#3c8dbc] font-bold">Draft Siap</span>
            )}
          </div>
        </div>
      </div>

      {/* Warning Callout If Already Submitted */}
      {isAlreadySubmitted && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <strong>Perhatian:</strong> Laporan tutup hari untuk tanggal <strong>{dayjs(reportDate).format('DD MMMM YYYY')}</strong> telah disubmit sebelumnya. Jika Anda menyimpan kembali, data ini akan memperbarui arsip laporan tutup hari pada tanggal tersebut.
          </div>
        </div>
      )}
    </>
  );
};
