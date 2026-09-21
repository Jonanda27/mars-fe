import React from 'react';
import { 
  Calendar, User, Loader2, Eye, AlertCircle 
} from 'lucide-react';
import { OvernightReport } from '@/services/overnightReportService';
import dayjs from 'dayjs';

interface OvernightReportsTableProps {
  readonly isLoading: boolean;
  readonly filteredReports: OvernightReport[];
  readonly onSelectReport: (report: OvernightReport) => void;
}

export const OvernightReportsTable: React.FC<OvernightReportsTableProps> = ({
  isLoading,
  filteredReports,
  onSelectReport,
}) => {
  return (
    <table className="w-full text-xs text-left">
      <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
        <tr>
          <th className="px-4 py-3 w-12 text-center">No</th>
          <th className="px-4 py-3">Tanggal Laporan</th>
          <th className="px-4 py-3">Petugas Pelapor</th>
          <th className="px-4 py-3 text-center">Total Armada Inap</th>
          <th className="px-4 py-3">Catatan Shift</th>
          <th className="px-4 py-3">Waktu Submit</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-center w-28">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {isLoading ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
              <span>Memuat arsip laporan tutup hari...</span>
            </td>
          </tr>
        ) : filteredReports.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              <span>Tidak ada data laporan tutup hari yang ditemukan.</span>
            </td>
          </tr>
        ) : (
          filteredReports.map((report, idx) => (
            <tr key={report.id} className="hover:bg-blue-50/40 transition-colors">
              <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{idx + 1}</td>
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  {dayjs(report.report_date).format('DD MMMM YYYY')}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Ref ID #{report.id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {report.officer?.username || 'Petugas'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-block bg-blue-50 text-[#3c8dbc] border border-blue-200 font-bold px-2 py-0.5 text-xs">
                  {report.total_aircraft_staying} Armada
                </span>
              </td>
              <td className="px-4 py-3.5">
                {report.general_notes ? (
                  <span className="text-slate-600 italic bg-slate-50 px-2 py-0.5 border border-slate-100 line-clamp-1 max-w-[200px]" title={report.general_notes}>
                    {report.general_notes}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-4 py-3.5 text-slate-500">
                {dayjs(report.created_at).format('DD/MM/YYYY HH:mm')} WIT
              </td>
              <td className="px-4 py-3.5">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  {report.status || 'VERIFIED'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-center">
                <button
                  type="button"
                  onClick={() => onSelectReport(report)}
                  className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer w-full transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Detail
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
