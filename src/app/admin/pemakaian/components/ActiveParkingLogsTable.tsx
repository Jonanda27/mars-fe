import React from 'react';
import { 
  MapPin, User, Loader2, AlertCircle, Clock 
} from 'lucide-react';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface ActiveParkingLogsTableProps {
  readonly isLoading: boolean;
  readonly filteredLogs: any[];
}

export const ActiveParkingLogsTable: React.FC<ActiveParkingLogsTableProps> = ({
  isLoading,
  filteredLogs,
}) => {
  return (
    <table className="w-full text-xs text-left">
      <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
        <tr>
          <th className="px-4 py-3 w-12 text-center">No</th>
          <th className="px-4 py-3">Tail Number</th>
          <th className="px-4 py-3">Tenant / Maskapai</th>
          <th className="px-4 py-3">Lokasi Parkir</th>
          <th className="px-4 py-3">Waktu Masuk</th>
          <th className="px-4 py-3">Petugas Pencatat</th>
          <th className="px-4 py-3">Catatan</th>
          <th className="px-4 py-3 text-center">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {isLoading ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
              <span>Memuat data armada aktif...</span>
            </td>
          </tr>
        ) : filteredLogs.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              <span>Tidak ada armada yang sedang aktif parkir.</span>
            </td>
          </tr>
        ) : (
          filteredLogs.map((log, index) => (
            <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{index + 1}</td>
              <td className="px-4 py-3.5 font-bold font-mono text-[#3c8dbc] text-[13px]">
                {log.registration_number}
              </td>
              <td className="px-4 py-3.5 font-medium text-slate-800">
                {log.tenants?.nama_perusahaan || '-'}
              </td>
              <td className="px-4 py-3.5">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {log.parking_location || 'Hanggar'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-slate-600">
                {dayjs(log.entry_time).format('DD MMM YYYY HH:mm')} WIT
              </td>
              <td className="px-4 py-3.5 text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {log.officer?.username || '-'}
                </span>
              </td>
              <td className="px-4 py-3.5">
                {log.notes ? (
                  <span className="text-[11px] text-slate-600 italic bg-slate-50 px-2 py-0.5 border border-slate-100 line-clamp-1 max-w-[150px]" title={log.notes}>
                    {log.notes}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-4 py-3.5 text-center">
                <StatusBadge status="Sedang Parkir" />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
