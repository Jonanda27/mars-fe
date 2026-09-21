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
      {/* Stat Boxes (Small Box Style) - Konsisten Warna Biru */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Box 1: Armada Parkir Saat Ini */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pesawat Parkir Saat Ini</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{activeLogsCount}</span>
              <span className="text-xs text-slate-500 font-medium">Armada</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Sedang Menempati Fasilitas</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
        </div>

        {/* Box 2: Rencana Kedatangan Hari Ini */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kedatangan Hari Ini</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{todayArrivalsCount}</span>
              <span className="text-xs text-slate-500 font-medium">Jadwal</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Terverifikasi Masuk</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Box 3: Tanggal Operasional */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Operasional</span>
            <span className="text-sm font-bold text-slate-800 block mt-1">{dayjs().format('dddd, DD MMM YYYY')}</span>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Warden Hanggar Aktif</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
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
                <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-semibold">
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
                <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
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
