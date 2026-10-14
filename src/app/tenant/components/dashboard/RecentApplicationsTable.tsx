import React from 'react';
import { FileText, ArrowRight, Inbox } from 'lucide-react';
import { RentalApplication } from '@/types/rental';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import dayjs from 'dayjs';

interface RecentApplicationsTableProps {
  readonly applications: RentalApplication[];
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({
  applications,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <h3 className="text-[14px] text-[#333] font-bold flex items-center">
          <FileText className="w-4 h-4 mr-2 text-[#3c8dbc]" /> 
          Status Tracking Permohonan Sewa Terkini
        </h3>
        <Link href="/tenant/permohonan" className="text-xs font-bold text-[#3c8dbc] hover:underline flex items-center gap-1">
          Semua Permohonan ({applications.length}) <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Tampilan Desktop: Tabel Klasik Lengkap (hidden md:block) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th className="py-2.5 px-4">No Tiket Permohonan</th>
              <th className="py-2.5 px-4">Layanan / Objek Sewa</th>
              <th className="py-2.5 px-4 text-center">Tgl Pengajuan</th>
              <th className="py-2.5 px-4 text-center">Status Berkas</th>
              <th className="py-2.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <p className="font-bold text-xs text-slate-600">Belum Ada Permohonan Sewa</p>
                  <p className="text-[11px] text-slate-400">Ajukan permohonan baru untuk memulai kerja sama pemakaian aset.</p>
                </td>
              </tr>
            ) : (
              applications.slice(0, 5).map((app, idx) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                    {app.application_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{app.application_type || 'Sewa Fasilitas'}</div>
                    <div className="text-[10px] text-slate-400">{app.assets?.nama_aset || 'Lokasi Terjadwal'}</div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {app.created_at ? dayjs(app.created_at).format('DD MMM YYYY') : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={app.status} className="text-[10px]" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/tenant/permohonan/${app.id}`}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-[11px] px-2.5 py-1 transition-colors inline-block shadow-2xs"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tampilan Mobile: Kartu Ringkas Modern (block md:hidden) */}
      <div className="block md:hidden">
        {applications.length === 0 ? (
          <div className="py-7 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2.5">
              <Inbox className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-bold text-xs text-slate-800">Belum Ada Permohonan Sewa</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Ajukan permohonan baru untuk memulai kerja sama aset.</p>
          </div>
        ) : (
          <div className="p-3 space-y-2.5 bg-slate-50/50">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-xs text-[#3c8dbc] block truncate">
                      {app.application_number}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800 line-clamp-1 mt-0.5">
                      {app.application_type || 'Sewa Fasilitas'}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {app.assets?.nama_aset || 'Lokasi Terjadwal'}
                    </span>
                  </div>
                  <StatusBadge status={app.status} className="text-[10px] shrink-0" />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                  <span className="text-[10px] text-slate-400">
                    Diajukan: {app.created_at ? dayjs(app.created_at).format('DD MMM YYYY') : '-'}
                  </span>
                  <Link
                    href={`/tenant/permohonan/${app.id}`}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-3 py-1 rounded transition-colors shadow-2xs"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
