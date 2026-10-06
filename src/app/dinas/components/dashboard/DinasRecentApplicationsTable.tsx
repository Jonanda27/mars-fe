import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { DinasDashboardData } from '@/services/dashboardService';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface DinasRecentApplicationsTableProps {
  readonly recentApplications: DinasDashboardData['recent_applications'];
  readonly totalApplicationsCount: number;
}

export const DinasRecentApplicationsTable: React.FC<DinasRecentApplicationsTableProps> = ({
  recentApplications,
  totalApplicationsCount,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <h3 className="text-[14px] text-[#333] font-bold flex items-center">
          <FileText className="w-4 h-4 mr-2 text-[#3c8dbc]" /> 
          Pipeline Permohonan Sewa &amp; Kemitraan Terbaru
        </h3>
        <Link href="/dinas/permohonan" className="text-xs font-bold text-[#3c8dbc] hover:underline flex items-center gap-1">
          Semua Permohonan ({totalApplicationsCount}) <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th className="py-2.5 px-4">No Permohonan</th>
              <th className="py-2.5 px-4">Nama Maskapai / Tenant</th>
              <th className="py-2.5 px-4">Objek Sewa</th>
              <th className="py-2.5 px-4 text-center">Tgl Pengajuan</th>
              <th className="py-2.5 px-4 text-center">Status Berkas</th>
              <th className="py-2.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <p className="font-bold text-xs">Belum ada permohonan sewa masuk.</p>
                </td>
              </tr>
            ) : (
              recentApplications.map((app, idx) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">{app.application_number}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{app.tenant_name}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{app.asset_name}</td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {dayjs(app.created_at).format('DD MMM YYYY')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={app.status || 'Pending'} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/dinas/permohonan/review/${app.id}`}
                      className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[11px] px-2.5 py-1 transition-colors inline-block"
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
    </div>
  );
};
