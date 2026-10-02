import React from 'react';
import { Plane, ShieldCheck, Sparkles } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';

interface UnbilledHanggarStatsProps {
  readonly totalStats: {
    totalUnits: number;
    totalNights: number;
    estRevenue: number;
  };
}

export const UnbilledHanggarStats: React.FC<UnbilledHanggarStatsProps> = ({ totalStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border-l-4 border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Armada Siap Tagih (Unbilled)</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{totalStats.totalUnits} <span className="text-xs font-normal text-slate-500">pesawat</span></div>
        </div>
        <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] rounded-full flex items-center justify-center">
          <Plane className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border-l-4 border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Akumulasi Malam Terverifikasi</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{totalStats.totalNights} <span className="text-xs font-normal text-slate-500">malam inap</span></div>
        </div>
        <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] rounded-full flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border-l-4 border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Estimasi Retribusi Hanggar</div>
          <div className="text-2xl font-bold text-slate-800 font-mono mt-1">{formatRupiah(totalStats.estRevenue)}</div>
        </div>
        <div className="w-10 h-10 bg-blue-50 text-[#3c8dbc] rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
