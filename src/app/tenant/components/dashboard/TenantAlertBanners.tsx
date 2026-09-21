import React from 'react';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { Warning } from '@/types/warning';
import { Contract } from '@/types/contract';
import Link from 'next/link';
import dayjs from 'dayjs';

interface TenantAlertBannersProps {
  readonly userStatusVerifikasi?: string | null;
  readonly activeWarnings: Warning[];
  readonly expiringContracts: Contract[];
}

export const TenantAlertBanners: React.FC<TenantAlertBannersProps> = ({
  userStatusVerifikasi,
  activeWarnings,
  expiringContracts,
}) => {
  return (
    <>
      {/* 1. Alert: Akun Belum Diverifikasi */}
      {userStatusVerifikasi !== 'Verified' && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 shadow-2xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Akun Dalam Peninjauan / Belum Terverifikasi (Status: {userStatusVerifikasi || 'Pending'})</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Lengkapi berkas legalitas perusahaan Anda (NIB, NPWP, Akta, SIUAU/AOC) agar dapat mengajukan permohonan sewa aset, booking slot hanggar, dan penerbitan PKS resmi.
              </p>
            </div>
          </div>
          <Link
            href="/tenant/profil"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-2xs transition-colors"
          >
            Lengkapi Dokumen
          </Link>
        </div>
      )}

      {/* 2. Alert: Surat Peringatan (SP) Aktif */}
      {activeWarnings.length > 0 && (
        <div className="p-4 bg-red-50 border-l-4 border-[#dd4b39] text-red-900 shadow-2xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#dd4b39] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm flex items-center gap-2">
                <span>Perhatian: Terdapat {activeWarnings.length} Surat Peringatan (SP) Terbit dari Dinas</span>
                <span className="bg-[#dd4b39] text-white text-[10px] px-2 py-0.5 font-bold uppercase">Wajib Diselesaikan</span>
              </h4>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                {activeWarnings.map(w => `${w.type} (${w.warning_number} - ${w.invoices?.invoice_number || 'Tagihan Retribusi'})`).join(', ')}.
                Harap segera melakukan pelunasan tagihan e-SKRD untuk menghindari pengenaan sanksi penertiban atau denda berjalan.
              </p>
            </div>
          </div>
          <Link
            href="/tenant/tagihan"
            className="px-3 py-1.5 bg-[#dd4b39] hover:bg-red-700 text-white font-bold text-xs whitespace-nowrap shadow-2xs transition-colors"
          >
            Bayar e-SKRD
          </Link>
        </div>
      )}

      {/* 3. Alert: Kontrak H-7 Akan Berakhir */}
      {expiringContracts.length > 0 && (
        <div className="p-4 bg-blue-50 border-l-4 border-[#3c8dbc] text-blue-900 shadow-2xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Pemberitahuan: {expiringContracts.length} Kontrak Sewa Akan Berakhir dalam 7 Hari</h4>
              <p className="text-xs text-blue-800 mt-0.5">
                Kontrak: {expiringContracts.map(c => `${c.contract_number} (Tgl: ${dayjs(c.end_date).format('DD MMM YYYY')})`).join(', ')}.
                Segera ajukan permohonan perpanjangan sewa agar hak operasional fasilitas tidak terputus.
              </p>
            </div>
          </div>
          <Link
            href="/tenant/permohonan"
            className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs whitespace-nowrap shadow-2xs transition-colors"
          >
            Ajukan Perpanjangan
          </Link>
        </div>
      )}
    </>
  );
};
