import React from 'react';
import { RentalApplication } from '@/types/rental';
import StatusBadge from '@/components/StatusBadge';
import { resolveUrl } from '@/utils/url';
import { FileText, Download } from 'lucide-react';
import dayjs from 'dayjs';

interface FallbackStatusViewProps {
  app: RentalApplication;
}

export const FallbackStatusView: React.FC<FallbackStatusViewProps> = ({ app }) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
      <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <h3 className="text-[16px] text-[#444] font-bold">Informasi Permohonan</h3>
        <StatusBadge status={app.status} />
      </div>
      <div className="p-6 md:p-8 space-y-8">
        {/* Text Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal</p>
            <p className="text-slate-800 font-medium">{app.purpose || '-'}</p>
          </div>
          {app.asset_id && (
            <>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Aset Dipilih</p>
                <p className="text-slate-800 font-medium">{app.assets?.nama_aset} ({app.assets?.kode_aset})</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Periode Sewa</p>
                <p className="text-slate-800 font-medium">{dayjs(app.start_date).format('DD MMM YYYY')} s/d {dayjs(app.end_date).format('DD MMM YYYY')}</p>
              </div>
            </>
          )}
        </div>

        {/* Full Width Document Viewer */}
        <div className="border-t border-slate-200 pt-8 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                Dokumen Surat Permohonan Resmi
              </h4>
              <p className="text-xs text-slate-500 mt-1">Pratinjau berkas yang diajukan ke Kepala Dinas</p>
            </div>
            {app.official_letter_url && (
              <a href={resolveUrl(app.official_letter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors border border-slate-300">
                Buka di Tab Baru
              </a>
            )}
          </div>
          
          {app.official_letter_url ? (
            <div className="bg-slate-200 p-2 md:p-3 rounded-lg shadow-inner border border-slate-300">
              <object 
                data={resolveUrl(app.official_letter_url)} 
                type="application/pdf" 
                className="w-full h-[600px] md:h-[800px] rounded-md bg-white border border-slate-300 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center h-full p-10 bg-slate-50 rounded-md border border-slate-200">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-sm text-slate-500 text-center max-w-md">
                    Browser Anda tidak mendukung pratinjau PDF interaktif. Klik tombol di bawah ini untuk mengunduh dan membaca surat permohonan Anda.
                  </p>
                  <a href={resolveUrl(app.official_letter_url)} className="mt-6 bg-[#3c8dbc] text-white px-6 py-2.5 rounded shadow-sm font-medium hover:bg-[#367fa9] transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" /> Unduh PDF Sekarang
                  </a>
                </div>
              </object>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50">
              <FileText className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-slate-500 font-medium">- Belum ada dokumen terunggah -</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallbackStatusView;
