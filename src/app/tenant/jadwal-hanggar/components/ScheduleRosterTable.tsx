import React from 'react';
import { 
  Calendar, Plane, CheckCircle2, XCircle, Clock 
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import dayjs from 'dayjs';

interface ScheduleRosterTableProps {
  readonly schedules: FlightSchedule[];
}

export const ScheduleRosterTable: React.FC<ScheduleRosterTableProps> = ({ schedules }) => {
  const renderStatusBadge = (status: FlightSchedule['status']) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Disetujui Petugas
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1 text-red-600" /> Ditolak
          </span>
        );
      case 'Checked-In':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Plane className="w-3 h-3 mr-1 text-blue-600" /> Checked-In (Di Hanggar)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 text-amber-600" /> Menunggu Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#3c8dbc]" />
          Daftar Pengajuan Jadwal Pemakaian Hanggar ({schedules.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        {schedules.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-400">
            <Plane className="w-12 h-12 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Belum Ada Pengajuan Jadwal</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan tombol di atas untuk mengajukan rencana pendaratan &amp; pemakaian hanggar.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">No. Jadwal</th>
                <th className="py-3 px-4">Armada Pesawat</th>
                <th className="py-3 px-4 text-center">Lokasi</th>
                <th className="py-3 px-4">Estimasi Masuk Hanggar</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Catatan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                    {item.schedule_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{item.registration_number}</div>
                    <div className="text-[11px] text-slate-500">{item.aircraft_type || '-'}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.parking_location === 'Apron'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.parking_location}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {dayjs(item.estimated_arrival).format('DD MMM YYYY, HH:mm')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    {item.officer_notes ? (
                      <div className="text-slate-700 italic">
                        "{item.officer_notes}"
                        {item.verified_by_officer?.username && (
                          <span className="block text-[10px] text-slate-400 not-italic">
                            oleh: {item.verified_by_officer.username}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
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
