import React from 'react';
import { 
  AlertTriangle, FileSignature, ShieldCheck, Calendar, Plus 
} from 'lucide-react';
import { Contract } from '@/types/contract';
import dayjs from 'dayjs';
import Link from 'next/link';

interface PayungContractStatusBannerProps {
  readonly activePayung: Contract | null;
  readonly isPayungExpired: boolean;
  readonly isPayungExpiringSoon: boolean;
  readonly daysUntilPayungExpired: number | null;
  readonly serviceStartDate: string | null;
  readonly serviceEndDate: string | null;
  readonly isServiceExpired: boolean;
  readonly locationName: string;
  readonly onOpenModal: () => void;
}

export const PayungContractStatusBanner: React.FC<PayungContractStatusBannerProps> = ({
  activePayung,
  isPayungExpired,
  isPayungExpiringSoon,
  daysUntilPayungExpired,
  serviceStartDate,
  serviceEndDate,
  isServiceExpired,
  locationName,
  onOpenModal,
}) => {
  return (
    <>
      {/* Peringatan H-7 Kontrak Payung Expired Soon */}
      {isPayungExpiringSoon && activePayung && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-sm">
                Peringatan: Masa Berlaku Kontrak Payung Akan Berakhir ({daysUntilPayungExpired} Hari Lagi)
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Kontrak Payung No. <strong>{activePayung.contract_number}</strong> akan berakhir pada tanggal <strong>{dayjs(activePayung.end_date).format('DD MMMM YYYY')}</strong>. Segera ajukan perpanjangan kontrak agar tidak menghentikan izin pengajuan jadwal pendaratan pesawat.
              </p>
              <div className="mt-2">
                <Link
                  href="/tenant/kontrak-payung"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Perpanjang Kontrak Payung
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANNER STATUS KONTRAK & PERIODE SEWA */}
      {!activePayung || isPayungExpired ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">
                Kontrak Payung (PKS Induk) Tidak Aktif atau Telah Berakhir
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Anda wajib memiliki Kontrak Payung (PKS Induk) aktif untuk dapat mengajukan jadwal pemakaian fasilitas hanggar/apron.
                {activePayung?.end_date && (
                  <span> Masa berlaku Kontrak Payung Anda berakhir pada tanggal <strong>{dayjs(activePayung.end_date).format('DD MMMM YYYY')}</strong>.</span>
                )}
              </p>
              <div className="mt-3">
                <Link
                  href="/tenant/kontrak-payung"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Buka Modul Kontrak Payung
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : !serviceStartDate || !serviceEndDate ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-sm">
                Periode Sewa Hanggar Belum Ditentukan
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Kontrak Payung Anda aktif (No: <strong>{activePayung.contract_number}</strong>), namun Anda belum menentukan periode sewa hanggar pada permohonan sewa (Step Pilih Layanan). Silakan lengkapi permohonan sewa terlebih dahulu.
              </p>
              <div className="mt-3">
                <Link
                  href="/tenant/permohonan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Lihat Permohonan Sewa
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : isServiceExpired ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">
                Periode Sewa Hanggar Telah Berakhir
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Periode sewa hanggar Anda telah berakhir pada tanggal <strong>{dayjs(serviceEndDate).format('DD MMMM YYYY')}</strong>. Silakan ajukan perpanjangan atau permohonan sewa hanggar baru.
              </p>
              <div className="mt-3">
                <Link
                  href="/tenant/permohonan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Ajukan Perpanjangan Sewa
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 text-sm flex items-center gap-2 flex-wrap">
                <span>PKS: {activePayung.contract_number}</span>
                <span className="text-[11px] font-semibold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                  Periode Sewa Hanggar: {dayjs(serviceStartDate).format('DD MMM YYYY')} s/d {dayjs(serviceEndDate).format('DD MMM YYYY')}
                </span>
                <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                  Lokasi: {locationName}
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Pengajuan jadwal pendaratan dibatasi pada rentang periode sewa hanggar yang Anda pilih ({dayjs(serviceStartDate).format('DD/MM/YYYY')} s/d {dayjs(serviceEndDate).format('DD/MM/YYYY')}).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Ajukan Jadwal Pemakaian
          </button>
        </div>
      )}
    </>
  );
};
