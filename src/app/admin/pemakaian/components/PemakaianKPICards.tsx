import React from 'react';
import { ShieldCheck, Plane, ArrowUpRight } from 'lucide-react';

interface PemakaianKPICardsProps {
  readonly totalOvernight: number;
  readonly totalActive: number;
  readonly totalCheckout: number;
}

export const PemakaianKPICards: React.FC<PemakaianKPICardsProps> = ({
  totalOvernight,
  totalActive,
  totalCheckout,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Tutup Hari */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Total Tutup Hari (EOD)</span>
          <div className="text-2xl font-bold text-[#3c8dbc]">{totalOvernight} <span className="text-xs font-normal text-slate-500">Laporan</span></div>
          <p className="text-[11px] text-slate-400 mt-0.5">Arsip rekonsiliasi inap malam</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] flex items-center justify-center rounded">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Pesawat Sedang Parkir */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Armada Aktif di Hanggar</span>
          <div className="text-2xl font-bold text-[#3c8dbc]">{totalActive} <span className="text-xs font-normal text-slate-500">Pesawat</span></div>
          <p className="text-[11px] text-slate-400 mt-0.5">Sedang parkir / check-in aktif</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] flex items-center justify-center rounded">
          <Plane className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Riwayat Keberangkatan */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Log Keberangkatan (Keluar)</span>
          <div className="text-2xl font-bold text-[#3c8dbc]">{totalCheckout} <span className="text-xs font-normal text-slate-500">Penerbangan</span></div>
          <p className="text-[11px] text-slate-400 mt-0.5">Check-out selesai tercatat</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] flex items-center justify-center rounded">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
