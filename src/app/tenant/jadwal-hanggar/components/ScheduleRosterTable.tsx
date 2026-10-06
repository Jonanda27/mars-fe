import React, { useState } from 'react';
import { 
  Calendar, Plane, CheckCircle2, XCircle, Clock, FileText 
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import StatusBadge from '@/components/StatusBadge';
import { SuratIzinMasukModal } from '@/components/SuratIzinMasukModal';
import dayjs from 'dayjs';

interface ScheduleRosterTableProps {
  readonly schedules: FlightSchedule[];
  readonly aircraftBookingMap?: Record<string, { appNumber: string; periodStr: string }>;
}

export const ScheduleRosterTable: React.FC<ScheduleRosterTableProps> = ({ 
  schedules,
  aircraftBookingMap,
}) => {
  const [selectedScheduleForTicket, setSelectedScheduleForTicket] = useState<FlightSchedule | null>(null);

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs rounded-none">
      <div className="p-3.5 border-b border-[#f4f4f4] bg-[#f9fafb] flex justify-between items-center rounded-none">
        <h3 className="font-bold text-[#333] text-sm uppercase tracking-wide flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#3c8dbc]" />
          Daftar Pengajuan Jadwal Pemakaian Hanggar &amp; Apron
        </h3>
        <span className="text-xs text-[#777] font-medium bg-white px-2 py-0.5 border border-[#e0e0e0] rounded">
          Total: {schedules.length} Jadwal
        </span>
      </div>

      <div className="overflow-x-auto">
        {schedules.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Plane className="w-12 h-12 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Belum Ada Pengajuan Jadwal</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan tombol di atas untuk mengajukan rencana pendaratan &amp; pemakaian hanggar.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f9fafb] text-[#333] font-bold uppercase tracking-wider border-b border-[#f4f4f4]">
                <th className="py-3 px-4">No. Jadwal</th>
                <th className="py-3 px-4">Armada Pesawat</th>
                <th className="py-3 px-4 text-center">Lokasi</th>
                <th className="py-3 px-4">Estimasi Masuk Hanggar</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Catatan Petugas</th>
                <th className="py-3 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {schedules.map((item) => {
                const booking = aircraftBookingMap?.[item.registration_number] 
                  || (item.aircraft_id ? aircraftBookingMap?.[String(item.aircraft_id)] : undefined);

                const isPermitAvailable = ['Disetujui', 'Checked-In', 'Checked-Out', 'Selesai', 'Completed'].includes(item.status);

                return (
                  <tr key={item.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                      {item.schedule_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{item.registration_number}</div>
                      <div className="text-[11px] text-slate-500">{item.aircraft_type || '-'}</div>
                      {booking && (
                        <div className="mt-1">
                          <span 
                            title={`Izin Sewa: ${booking.periodStr}`}
                            className="font-mono text-[9px] font-bold text-[#3c8dbc] bg-blue-50 px-1.5 py-0.5 border border-blue-200 rounded inline-block"
                          >
                            {booking.appNumber}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.parking_location === 'Apron'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-[#3c8dbc] border border-[#3c8dbc]/20'
                      }`}>
                        {item.parking_location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {dayjs(item.estimated_arrival).format('DD MMM YYYY, HH:mm')} WIT
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={item.status === 'Selesai' || item.status === 'Completed' ? 'Checked-Out' : item.status} />
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
                    <td className="py-3 px-4 text-center">
                      {isPermitAvailable ? (
                        <button
                          type="button"
                          onClick={() => setSelectedScheduleForTicket(item)}
                          className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#3c8dbc] text-[#3c8dbc] font-bold text-[11px] inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          title="Lihat & Unduh PDF Tiket Izin Masuk Resmi"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#3c8dbc]" />
                          <span>Lihat Tiket PDF</span>
                        </button>
                      ) : item.status === 'Ditolak' ? (
                        <span className="text-[10px] text-red-500 font-medium">Izin Ditolak</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Menunggu Izin</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Preview & Unduh Tiket Izin Masuk PDF */}
      {selectedScheduleForTicket && (
        <SuratIzinMasukModal
          schedule={selectedScheduleForTicket}
          onClose={() => setSelectedScheduleForTicket(null)}
        />
      )}
    </div>
  );
};
