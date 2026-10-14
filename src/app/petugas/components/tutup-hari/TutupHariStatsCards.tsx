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
      {/* 1. STATS & DATE BAR (AdminLTE Flat Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Total Menginap */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Plane className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Armada Menginap</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {totalStaying} <span className="text-xs font-sans text-slate-500 font-normal">Unit</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Terkonfirmasi Malam Ini
            </span>
          </div>
        </div>

        {/* Box 2: Dari Log Aktif */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Dari Check-In Aktif</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {activeLogCount} <span className="text-xs font-sans text-slate-500 font-normal">Unit</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Sesuai Izin Masuk
            </span>
          </div>
        </div>

        {/* Box 3: Tambahan Manual */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Plus className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Pesawat Manual</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {manualCount} <span className="text-xs font-sans text-slate-500 font-normal">Unit</span>
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Insidentil / Ad-Hoc
            </span>
          </div>
        </div>

        {/* Box 4: Pemilih Tanggal Tutup Hari */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Tanggal Tutup Hari</span>
            <div className="mt-0.5">
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-transparent text-[15px] font-bold font-mono text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-[#3c8dbc] cursor-pointer w-full py-0.5"
              />
            </div>
            <div className="text-[11px] mt-1 flex items-center justify-between font-bold">
              <span className="text-slate-400">Status:</span>
              {isAlreadySubmitted ? (
                <span className="text-amber-600">Sudah Disubmit</span>
              ) : (
                <span className="text-[#3c8dbc]">Draft Siap</span>
              )}
            </div>
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
