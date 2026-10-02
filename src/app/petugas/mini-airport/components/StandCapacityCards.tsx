import React from 'react';
import { TowerControl, Clock, Sun, Moon } from 'lucide-react';
import dayjs from 'dayjs';

interface StandCapacityCardsProps {
  readonly stand1Occupied: any;
  readonly stand2Occupied: any;
}

const getStandOccupiedInfo = (occupied: any) => {
  if (!occupied?.entry_time) return null;
  const entry = dayjs(occupied.entry_time);
  const now = dayjs();
  const totalMinutes = Math.max(0, now.diff(entry, 'minute'));

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

  const isDifferentDay = !now.isSame(entry, 'day');
  const isPast17 = now.hour() >= 17;
  const isOvernight = Boolean(occupied.is_overnight) || isDifferentDay || isPast17;

  return {
    durationStr,
    isOvernight,
    tenantName:
      occupied.tenants?.nama_perusahaan ||
      occupied.rental_applications?.tenants?.nama_perusahaan ||
      occupied.parsedNotes?.tenant_name ||
      'Maskapai'
  };
};

export const StandCapacityCards: React.FC<StandCapacityCardsProps> = ({
  stand1Occupied,
  stand2Occupied,
}) => {
  const stand1Info = getStandOccupiedInfo(stand1Occupied);
  const stand2Info = getStandOccupiedInfo(stand2Occupied);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Stand 01 */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Kapasitas Apron — STAND 01
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-base font-bold ${
                stand1Occupied ? 'text-purple-700' : 'text-emerald-700'
              }`}
            >
              {stand1Occupied
                ? `TERISI: ${stand1Occupied.registration_number}`
                : 'KOSONG / TERSEDIA'}
            </span>
          </div>
          {stand1Info ? (
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-slate-700 font-semibold">{stand1Info.tenantName}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-[10px] font-bold">
                <Clock className="w-3 h-3 text-[#3c8dbc]" /> Durasi: {stand1Info.durationStr}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-bold text-[10px] ${
                  stand1Info.isOvernight
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {stand1Info.isOvernight ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                {stand1Info.isOvernight ? 'Menginap (Lewat 17:00)' : 'Parkir Siang'}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Siap dialokasikan untuk pendaratan berikutnya
            </span>
          )}
        </div>
        <div
          className={`w-11 h-11 flex items-center justify-center ${
            stand1Occupied
              ? 'bg-purple-50 text-purple-700'
              : 'bg-blue-50 text-[#3c8dbc]'
          }`}
        >
          <TowerControl className="w-5 h-5" />
        </div>
      </div>

      {/* Stand 02 */}
      <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Kapasitas Apron — STAND 02
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-base font-bold ${
                stand2Occupied ? 'text-purple-700' : 'text-emerald-700'
              }`}
            >
              {stand2Occupied
                ? `TERISI: ${stand2Occupied.registration_number}`
                : 'KOSONG / TERSEDIA'}
            </span>
          </div>
          {stand2Info ? (
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-slate-700 font-semibold">{stand2Info.tenantName}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-[10px] font-bold">
                <Clock className="w-3 h-3 text-[#3c8dbc]" /> Durasi: {stand2Info.durationStr}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-bold text-[10px] ${
                  stand2Info.isOvernight
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {stand2Info.isOvernight ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                {stand2Info.isOvernight ? 'Menginap (Lewat 17:00)' : 'Parkir Siang'}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Siap dialokasikan untuk pendaratan berikutnya
            </span>
          )}
        </div>
        <div
          className={`w-11 h-11 flex items-center justify-center ${
            stand2Occupied
              ? 'bg-purple-50 text-purple-700'
              : 'bg-blue-50 text-[#3c8dbc]'
          }`}
        >
          <TowerControl className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
