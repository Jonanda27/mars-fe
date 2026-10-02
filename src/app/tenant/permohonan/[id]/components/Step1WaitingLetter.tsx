import React, { useState, useRef } from 'react';
import { RentalApplication } from '@/types/rental';
import { resolveUrl } from '@/utils/url';
import { FileText, Loader2, CheckCircle2, ExternalLink, Upload } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { rentalService } from '@/services/rentalService';
import { getErrorMessage } from '@/services/api';

interface Step1WaitingLetterProps {
  readonly app: RentalApplication;
  readonly onSuccess?: () => void;
}

export const Step1WaitingLetter: React.FC<Step1WaitingLetterProps> = ({ app, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Format berkas harus PDF');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('official_letter', file);
      await rentalService.uploadOfficialLetter(app.id, formData);
      toast.success('Surat permohonan resmi berhasil diunggah!');
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengunggah berkas surat'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg mb-8 overflow-hidden">
      
      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <FileText className="w-64 h-64 text-[#3c8dbc]" />
        </div>
        
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
            <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
          </div>
          <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
        </div>
        
        <div className="text-center md:text-left flex-1 z-10 mt-2">
          <div className="inline-flex items-center px-3 py-1 rounded bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
            Status Saat Ini
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Menunggu Verifikasi Kepala Dinas</h2>
          <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
            Surat permohonan sewa resmi yang Anda ajukan telah kami terima dengan baik. Saat ini, berkas permohonan sedang dalam proses peninjauan dan persetujuan oleh <strong className="text-slate-700">Kepala Dinas Perhubungan</strong>. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
          </p>
        </div>
      </div>

      {/* Rangkuman Pengajuan & Pratinjau Dokumen */}
      <div className="p-8 md:p-12 bg-white space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Rangkuman Surat Permohonan
          </h3>
          <span className="text-xs font-bold text-slate-400">ID: {app.application_number}</span>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/80 p-6 rounded-lg border border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Permohonan</p>
            <p className="text-[14px] text-slate-800 font-bold">{app.application_number}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Pengajuan</p>
            <p className="text-[14px] text-slate-800 font-medium">
              {app.created_at ? dayjs(app.created_at).format('DD MMMM YYYY') : '-'}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jenis Permohonan</p>
            <p className="text-[14px] text-slate-800 font-medium">{app.application_type || 'Sewa Hanggar'}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahap Berikutnya</p>
            <p className="text-[13px] text-[#3c8dbc] font-semibold">
              {app.requires_payung ? 'Tanda Tangan Kontrak Payung' : 'Pilih Layanan & Detail Aset'}
            </p>
          </div>
        </div>

        {/* Tujuan / Perihal */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal Permohonan</p>
          <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-md">
            <p className="text-[14px] text-slate-700 leading-relaxed">{app.purpose || '-'}</p>
          </div>
        </div>

        {/* Document Viewer Section */}
        <div className="border-t border-slate-200 pt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                Dokumen Surat Permohonan Resmi
              </h4>
              <p className="text-xs text-slate-500 mt-1">Pratinjau berkas yang diajukan ke Kepala Dinas</p>
            </div>
            
            <div className="flex items-center gap-2">
              {app.official_letter_url && (
                <>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-none font-semibold transition-colors border border-slate-300 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
                    Ganti Berkas
                  </button>
                  <a 
                    href={resolveUrl(app.official_letter_url)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-[13px] bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded-none font-semibold transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" /> Buka di Tab Baru
                  </a>
                </>
              )}
            </div>
          </div>
          
          {app.official_letter_url ? (
            <div className="bg-slate-200 p-2 md:p-3 rounded-none shadow-inner border border-slate-300">
              <iframe 
                src={`${resolveUrl(app.official_letter_url)}#toolbar=1`}
                title="Dokumen Surat Permohonan Resmi"
                className="w-full h-[650px] md:h-[800px] rounded-none bg-white border border-slate-300 shadow-sm"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-blue-300 rounded-none p-10 flex flex-col items-center justify-center text-center bg-blue-50/40">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#3c8dbc] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-[15px] font-bold text-slate-800 mb-1">Dokumen Surat Permohonan Belum Terlampir</h4>
              <p className="text-xs text-slate-500 max-w-md mb-4">
                Berkas surat permohonan resmi belum tersimpan pada sistem. Silakan pilih dan unggah dokumen surat permohonan Anda dalam format PDF.
              </p>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-5 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Mengunggah Berkas...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    Pilih & Unggah Surat PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Step1WaitingLetter;
