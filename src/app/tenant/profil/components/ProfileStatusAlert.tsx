import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2, FileText, Clock } from 'lucide-react';

interface ProfileStatusAlertProps {
  status?: string;
  alasanPenolakan?: string | null;
  isLegalitasComplete?: boolean;
  uploadedDocsCount?: number;
  totalDocsCount?: number;
  onStartTutorial?: () => void;
}

export const ProfileStatusAlert: React.FC<ProfileStatusAlertProps> = ({
  status,
  alasanPenolakan,
  isLegalitasComplete = false,
  uploadedDocsCount = 0,
  totalDocsCount = 3,
  onStartTutorial,
}) => {
  if (status === 'Pending') {
    // 1. Jika berkas belum lengkap: Tampilkan instruksi berwarna Biru MARS konsisten (#3c8dbc)
    if (!isLegalitasComplete) {
      return (
        <div className="bg-[#f0f7fb] border-l-4 border-[#3c8dbc] p-4 shadow-sm">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-[#3c8dbc] mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h4 className="font-bold text-[#1e3a8a] text-[15px]">
                  Lengkapi Dokumen Legalitas Perusahaan
                </h4>
                <span className="text-[12px] bg-[#3c8dbc]/10 text-[#3c8dbc] font-bold px-2.5 py-0.5 rounded-full border border-[#3c8dbc]/30">
                  {uploadedDocsCount} dari {totalDocsCount} Dokumen Diunggah
                </span>
              </div>
              <p className="text-gray-700 text-[14px] leading-relaxed">
                Akun Anda belum dapat diverifikasi oleh Admin. Silakan lengkapi dan unggah seluruh dokumen legalitas wajib pada panel <strong className="text-[#1e3a8a]">Manajemen Dokumen Legal</strong> di bawah ini agar permohonan kemitraan Anda dapat ditinjau.
              </p>
              {onStartTutorial && (
                <div className="mt-3 pt-2.5 border-t border-[#3c8dbc]/20 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[12px] text-gray-600">
                    Perlu bantuan? Ikuti petunjuk singkat untuk mulai mengunggah berkas legalitas.
                  </span>
                  <button
                    type="button"
                    onClick={onStartTutorial}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-[12px] font-semibold rounded shadow-xs transition-colors cursor-pointer"
                  >
                    Panduan Unggah
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 2. Jika berkas sudah lengkap: Tampilkan status Menunggu Verifikasi (Pending) berwarna Kuning/Amber
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <h4 className="font-bold text-amber-800 text-[15px]">
                Menunggu Verifikasi
              </h4>
              <span className="text-[12px] bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> Berkas Lengkap ({totalDocsCount}/{totalDocsCount})
              </span>
            </div>
            <p className="text-amber-700 text-[14px] leading-relaxed">
              Seluruh berkas legalitas telah diterima dan sedang ditinjau oleh Admin Bandara. Anda dapat memperbarui data jika terdapat perubahan sebelum verifikasi selesai.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'Rejected') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
        <div className="flex items-start">
          <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-800 text-[15px] mb-1">Verifikasi Ditolak (Rejected)</h4>
            <p className="text-red-700 text-[14px] leading-relaxed">
              Terdapat masalah pada profil atau dokumen legalitas Anda. Silakan periksa pesan penolakan di bawah dan perbarui data Anda. Mengunggah dokumen baru akan secara otomatis mengirim ulang permohonan Anda ke Admin.
            </p>

            {alasanPenolakan && (
              <div className="mt-4 bg-white border border-red-200 rounded-md p-4 shadow-sm relative">
                <div className="absolute -top-2.5 left-3 bg-white px-2 text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  Catatan dari Admin
                </div>
                <p className="text-[14px] text-gray-800 font-medium font-serif italic">
                  &ldquo;{alasanPenolakan}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'Verified') {
    return (
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 shadow-sm flex items-start text-[14px]">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-900 text-[15px] mb-1">Status: Terverifikasi</h4>
          <p className="text-emerald-800/90 leading-relaxed">
            Seluruh dokumen legalitas perusahaan Anda berstatus valid dan aktif. Anda diizinkan untuk melakukan permohonan penyewaan fasilitas dan aktivitas operasional di bandara.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
