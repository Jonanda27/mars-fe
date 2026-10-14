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
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <Plane className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">
            Izin Pendaratan Aktif
          </span>
          <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
            {eligibleAppsCount} <span className="text-xs font-sans text-slate-500 font-normal">Slot</span>
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Telah Disetujui Admin
          </span>
        </div>
      </div>

      {/* Box 2: Menunggu SKRD Dinas */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <Clock className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">
            Menunggu SKRD Dinas
          </span>
          <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
            {unbilledCount} <span className="text-xs font-sans text-slate-500 font-normal">Log</span>
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Siap Ditetapkan Dinas
          </span>
        </div>
      </div>

      {/* Box 3: SKRD Diterbitkan */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <FileText className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">
            SKRD Diterbitkan
          </span>
          <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
            {billedCount} <span className="text-xs font-sans text-slate-500 font-normal">Tagihan</span>
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Terbit oleh Dinas
          </span>
        </div>
      </div>

      {/* Box 4: Pesawat Inap RON */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <Moon className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">
            Pesawat Menginap (RON)
          </span>
          <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
            {overnightCount} <span className="text-xs font-sans text-slate-500 font-normal">Armada</span>
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Menempati Stand Malam
          </span>
        </div>
      </div>
    </div>
  );
};
