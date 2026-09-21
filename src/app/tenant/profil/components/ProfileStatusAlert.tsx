import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

interface ProfileStatusAlertProps {
  status?: string;
  alasanPenolakan?: string | null;
}

export const ProfileStatusAlert: React.FC<ProfileStatusAlertProps> = ({
  status,
  alasanPenolakan,
}) => {
  if (status === 'Pending') {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 text-[15px] mb-1">Menunggu Verifikasi (Pending)</h4>
            <p className="text-amber-700 text-[14px]">
              Profil Anda sedang dalam tahap peninjauan oleh Admin. Selama proses ini, Anda tidak dapat mengubah data profil.
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
      <div className="bg-[#3c8dbc] text-white p-3 shadow-sm flex items-start text-[14px]">
        <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">Status: Terverifikasi (Good Standing)</h4>
          <p>
            Seluruh dokumen legalitas perusahaan Anda berstatus valid dan aktif. Anda diizinkan untuk melakukan permohonan penyewaan fasilitas dan aktivitas operasional di bandara.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
