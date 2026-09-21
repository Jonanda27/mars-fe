import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RentalApplication } from '@/types/rental';

interface ContractHeroBannerProps {
  readonly isHangar: boolean;
  readonly app: RentalApplication;
}

export const ContractHeroBanner: React.FC<ContractHeroBannerProps> = ({ isHangar, app }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-none p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
        <CheckCircle2 className="w-64 h-64 text-emerald-900" />
      </div>
      
      <div className="w-16 h-16 bg-emerald-100 rounded-none flex items-center justify-center flex-shrink-0 z-10 border-2 border-white shadow-xs">
        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
      </div>
      
      <div className="flex-1 text-center sm:text-left z-10">
        <h3 className="text-[20px] md:text-[22px] font-bold text-slate-800 mb-2">
          {isHangar 
            ? 'Selamat! Permohonan Sewa Hanggar Anda Telah Disetujui' 
            : 'Selamat! Kontrak Sewa Anda Telah Aktif'}
        </h3>
        <p className="text-[13px] md:text-[14px] text-slate-600 leading-relaxed max-w-3xl">
          {isHangar ? (
            <>
              Permohonan pemanfaatan fasilitas hanggar dan alokasi armada pesawat Anda telah divalidasi dan <strong>disetujui secara resmi</strong> oleh Administrator. Anda kini berhak menempatkan armada di hanggar sesuai jadwal sewa di bawah ketentuan <strong>Kontrak Payung aktif</strong>.
            </>
          ) : (
            <>
              Proses pengajuan permohonan sewa dan verifikasi perjanjian telah berhasil diselesaikan. Anda kini resmi dapat memanfaatkan fasilitas sesuai dengan periode yang telah disepakati.
            </>
          )}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5 justify-center sm:justify-start">
          <div className="bg-white px-3.5 py-1.5 rounded-none shadow-2xs border border-slate-200 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isHangar ? 'Ref. Kontrak Payung' : 'No. Kontrak'}
            </span>
            <span className="text-[12px] font-bold text-slate-800">
              {app.contracts?.contract_number || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
