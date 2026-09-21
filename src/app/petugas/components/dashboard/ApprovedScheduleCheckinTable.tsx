import React from 'react';
import { 
  UserCheck, RefreshCw, Loader2, Clock, LogIn 
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import dayjs from 'dayjs';

interface ApprovedScheduleCheckinTableProps {
  readonly todayArrivals: FlightSchedule[];
  readonly isLoadingTodayArrivals: boolean;
  readonly isCheckingInSchedule: number | null;
  readonly onRefresh: () => void;
  readonly onCheckInFromSchedule: (schedule: FlightSchedule) => void;
}

export const ApprovedScheduleCheckinTable: React.FC<ApprovedScheduleCheckinTableProps> = ({
  todayArrivals,
  isLoadingTodayArrivals,
  isCheckingInSchedule,
  onRefresh,
  onCheckInFromSchedule,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
      <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#3c8dbc]" />
            Rencana Kedatangan Hari Ini ({dayjs().format('DD MMMM YYYY')})
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pesawat yang telah disetujui izin masuknya dan dijadwalkan tiba hari ini. Klik <strong>1-Click Check-In</strong> saat pesawat fisik mendarat.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1 border border-slate-200 cursor-pointer self-end sm:self-auto"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        {isLoadingTodayArrivals ? (
          <div className="p-6 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-[#3c8dbc]" />
            <span className="text-xs">Memeriksa jadwal kedatangan hari ini...</span>
          </div>
        ) : todayArrivals.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto text-slate-300 mb-1" />
            <p className="text-xs font-bold text-slate-600">Tidak ada jadwal kedatangan pesawat untuk hari ini</p>
            <p className="text-[11px] text-slate-400">Pengajuan jadwal baru dapat diperiksa pada menu <strong>Verifikasi Jadwal Masuk</strong>.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">No. Jadwal</th>
                <th className="py-2.5 px-4">Armada Pesawat</th>
                <th className="py-2.5 px-4">Maskapai / Tenant</th>
                <th className="py-2.5 px-4 text-center">Alokasi Lokasi</th>
                <th className="py-2.5 px-4">Estimasi Kedatangan</th>
                <th className="py-2.5 px-4 text-center">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayArrivals.map((sch) => (
                <tr key={sch.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                    {sch.schedule_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900 text-sm">{sch.registration_number}</div>
                    <div className="text-[10px] text-slate-500">{sch.aircraft_type || 'Standar'}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {sch.tenant?.nama_perusahaan || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                      sch.parking_location === 'Apron'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
                    }`}>
                      {sch.parking_location || 'Hanggar'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {dayjs(sch.estimated_arrival).format('HH:mm [WIT] (DD MMM YYYY)')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onCheckInFromSchedule(sch)}
                      disabled={isCheckingInSchedule === sch.id}
                      className="px-3.5 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isCheckingInSchedule === sch.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-3.5 h-3.5" />
                          1-Click Check-In Masuk
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
