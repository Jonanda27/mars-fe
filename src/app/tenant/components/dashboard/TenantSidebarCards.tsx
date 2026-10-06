import React from 'react';
import { 
  Calendar, Plane, Clock, FileText 
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import { Contract } from '@/types/contract';
import { UserData } from '@/types/auth';
import Link from 'next/link';
import dayjs from 'dayjs';

interface TenantSidebarCardsProps {
  readonly schedules: FlightSchedule[];
  readonly activeContracts: Contract[];
  readonly user?: UserData;
}

export const TenantSidebarCards: React.FC<TenantSidebarCardsProps> = ({
  schedules,
  activeContracts,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Card C: Jadwal Operasional & Slot Hanggar Mendatang */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[14px] text-[#333] font-bold flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Jadwal Slot Hanggar
          </h3>
          <Link href="/tenant/jadwal-hanggar" className="text-xs font-bold text-[#3c8dbc] hover:underline">
            Kelola ({schedules.length}) &rarr;
          </Link>
        </div>

        <div className="p-3.5 space-y-2.5 text-xs">
          {schedules.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Plane className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="font-bold text-xs text-slate-600">Belum Ada Jadwal Penerbangan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Booking slot kedatangan armada untuk parkir hanggar.</p>
              <Link 
                href="/tenant/jadwal-hanggar" 
                className="mt-3 inline-block bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-3 py-1.5 shadow-2xs"
              >
                + Booking Slot Hanggar
              </Link>
            </div>
          ) : (
            schedules.slice(0, 3).map(sch => (
              <div key={sch.id} className="p-2.5 bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-[#3c8dbc] text-[12px]">
                    {sch.registration_number || sch.aircraft?.registration_number || 'PK-XXX'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    sch.status === 'Checked-Out' || sch.status === 'Selesai' || sch.status === 'Completed'
                      ? 'bg-purple-50 text-[#605ca8] border-purple-200'
                      : sch.status === 'Disetujui'
                        ? 'bg-emerald-50 text-[#00a65a] border-emerald-200'
                        : sch.status === 'Checked-In'
                          ? 'bg-blue-50 text-[#3c8dbc] border-blue-200'
                          : sch.status === 'Ditolak'
                            ? 'bg-red-50 text-[#dd4b39] border-red-200'
                            : 'bg-amber-50 text-[#f39c12] border-amber-200'
                  }`}>
                    {sch.status === 'Selesai' || sch.status === 'Completed' ? 'Checked-Out' : sch.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {sch.estimated_arrival ? dayjs(sch.estimated_arrival).format('DD MMM YYYY HH:mm') : '-'}
                  </span>
                  <span className="font-semibold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 text-[10px]">
                    {sch.parking_location || 'Hanggar A'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Card D: Kontrak & PKS Aktif */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[14px] text-[#333] font-bold flex items-center">
            <FileText className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Kontrak &amp; PKS Aktif ({activeContracts.length})
          </h3>
          <Link href="/tenant/kontrak-payung" className="text-xs font-bold text-[#3c8dbc] hover:underline">
            Detail &rarr;
          </Link>
        </div>

        <div className="p-3.5 space-y-2.5 text-xs">
          {activeContracts.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="font-bold text-xs text-slate-600">Belum Ada Kontrak &amp; PKS Aktif</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dokumen PKS Payung dan kontrak sewa aktif akan tampil di sini.</p>
            </div>
          ) : (
            activeContracts.slice(0, 3).map(c => {
              const daysLeft = c.end_date ? dayjs(c.end_date).diff(dayjs(), 'day') : 0;

              return (
                <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-[12px]">
                      {c.assets?.nama_aset || 'Fasilitas Bandara'}
                    </span>
                    <span className="text-[10px] font-bold bg-[#00a65a] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {c.contract_type || 'Sewa'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{c.contract_number}</span>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200 mt-1">
                    <span>Berlaku s/d: {c.end_date ? dayjs(c.end_date).format('DD MMM YYYY') : '-'}</span>
                    <span className={`font-bold ${daysLeft <= 7 ? 'text-[#dd4b39]' : 'text-[#3c8dbc]'}`}>
                      {daysLeft > 0 ? `Sisa ${daysLeft} Hari` : 'Aktif'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
