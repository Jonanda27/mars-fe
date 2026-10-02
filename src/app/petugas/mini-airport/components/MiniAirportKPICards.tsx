import React from 'react';
import { Plane, Clock, FileText, Moon } from 'lucide-react';

interface MiniAirportKPICardsProps {
  readonly eligibleAppsCount: number;
  readonly unbilledCount: number;
  readonly billedCount: number;
  readonly overnightCount: number;
}

export const MiniAirportKPICards: React.FC<MiniAirportKPICardsProps> = ({
  eligibleAppsCount,
  unbilledCount,
  billedCount,
  overnightCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Box 1: Izin Pendaratan Aktif */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Izin Pendaratan Aktif
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-800">{eligibleAppsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Slot</span>
          </div>
          <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">
            Telah Disetujui Admin
          </span>
        </div>
        <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
          <Plane className="w-5 h-5" />
        </div>
      </div>

      {/* Box 2: Menunggu SKRD Dinas */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Menunggu SKRD Dinas
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-800">{unbilledCount}</span>
            <span className="text-xs text-slate-500 font-medium">Log</span>
          </div>
          <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">
            Siap Ditetapkan Dinas
          </span>
        </div>
        <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Box 3: SKRD Diterbitkan */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            SKRD Diterbitkan
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-800">{billedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Tagihan</span>
          </div>
          <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">
            Terbit oleh Dinas
          </span>
        </div>
        <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Box 4: Pesawat Inap RON */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pesawat Menginap (RON)
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-800">{overnightCount}</span>
            <span className="text-xs text-slate-500 font-medium">Armada</span>
          </div>
          <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">
            Menempati Stand Malam
          </span>
        </div>
        <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
          <Moon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
