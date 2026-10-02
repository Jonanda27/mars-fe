"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { contractService } from '@/services/contractService';
import { RentalApplication } from '@/types/rental';
import { Contract } from '@/types/contract';
import { 
  FileText, Plus, Loader2, AlertTriangle, Clock, CheckCircle2 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/utils/date';
import StatusBadge from '@/components/StatusBadge';
import { ContractStatusBar } from '@/components/ContractStatusBar';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { RequestExtensionModal } from '../jadwal-hanggar/components/RequestExtensionModal';

export default function PermohonanTenantPage() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [selectedAppForExtension, setSelectedAppForExtension] = useState<RentalApplication | null>(null);

  const { user } = useAuthStore();
  const isVerified = user?.status_verifikasi === 'Verified';

  const handleOpenExtensionModal = (app: RentalApplication) => {
    setSelectedAppForExtension(app);
    setExtensionModalOpen(true);
  };

  useEffect(() => {
    fetchApplications();
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setContractsLoading(true);
      const data = await contractService.getTenantContracts();
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching tenant contracts:', error);
    } finally {
      setContractsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getTenantApplications();
      // Filter khusus Bandara Mozes Kilangin: pisahkan dan kecualikan permohonan Mini Airport
      const mozesApplications = (data || []).filter((app: RentalApplication) => {
        const type = (app.application_type || '').toLowerCase();
        let spec: any = app.specific_needs;
        if (typeof spec === 'string') {
          try { spec = JSON.parse(spec); } catch (e) {}
        }
        const isMini = type.includes('mini') || type.includes('perintis') || spec?.service_type === 'Mini Airport' || Boolean(spec?.airport_id && spec?.airport_code);
        return !isMini;
      });
      setApplications(mozesApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Gagal memuat data permohonan');
    } finally {
      setLoading(false);
    }
  };

  // Identifikasi Kontrak Payung KHUSUS Bandara Mozes Kilangin (Bukan Mini Airport)
  const activePayung = useMemo(() => {
    if (!contracts || contracts.length === 0) return null;

    // Filter KHUSUS Mozes Kilangin (Kecualikan semua Mini Airport: Ilaga, Enarotali, Bilogai, dll.)
    const mozesPayungList = contracts.filter((c) => {
      const type = (c.contract_type || '').toLowerCase();
      const num = (c.contract_number || '').toUpperCase();
      let fas: any = c.fasilitas;
      if (typeof fas === 'string') {
        try { fas = JSON.parse(fas); } catch (e) { fas = {}; }
      }
      const isMini = type.includes('mini') || 
                     Boolean(fas?.mini_airport_id) || 
                     Boolean(fas?.category === 'Mini Airport') ||
                     num.includes('PKS/ILA') ||
                     num.includes('PKS/EWI') ||
                     num.includes('PKS/UGU') ||
                     num.includes('/ILA/') ||
                     num.includes('/EWI/') ||
                     num.includes('/UGU/') ||
                     num.includes('/MINI/');
      if (isMini) return false;

      return (
        type === 'pks payung mozes kilangin' ||
        type === 'payung' ||
        num.includes('MOZES') ||
        num.includes('/TIM/') ||
        (type.includes('payung') && !isMini)
      );
    });

    const activeMozes = mozesPayungList.find((c) => {
      const s = (c.status || '').trim().toLowerCase();
      return s === 'aktif' || s === 'active' || s === 'signed';
    });
    return activeMozes || mozesPayungList[0] || null;
  }, [contracts]);

  const daysRemaining = useMemo(() => {
    if (!activePayung?.end_date) return null;
    const today = dayjs().startOf('day');
    const end = dayjs(activePayung.end_date).startOf('day');
    return end.diff(today, 'day');
  }, [activePayung]);

  const statusLower = (activePayung?.status || '').trim().toLowerCase();
  const isPayungExpired = daysRemaining !== null && daysRemaining < 0;
  const isContractActive = Boolean(
    activePayung && 
    (statusLower === 'aktif' || statusLower === 'active' || statusLower === 'signed') && 
    !isPayungExpired
  );
  const isPendingSignature = statusLower === 'menunggu ttd tenant' || statusLower === 'menunggu ttd';
  const isPendingVerification = statusLower === 'menunggu verifikasi admin' || statusLower === 'menunggu pengesahan kadis';
  const companyName = user?.nama_perusahaan || activePayung?.tenants?.nama_perusahaan || 'PT Geo Citra';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full text-slate-500 py-20">
          <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-500" /> 
          <span className="font-medium text-lg">Memuat data permohonan...</span>
        </div>
      );
    }

    if (applications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Permohonan Sewa Mozes Kilangin</h3>
          <p className="text-sm mt-1">Anda belum memiliki riwayat pengajuan sewa hanggar, apron, atau ruangan di Bandara Mozes Kilangin Timika.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.map((app) => {
          const spec = typeof app.specific_needs === 'string'
            ? JSON.parse(app.specific_needs)
            : (app.specific_needs || {});
          const extReq = spec.extension_request;
          const hasPendingExt = extReq && extReq.status === 'Pending';
          const hasApprovedExt = extReq && extReq.status === 'Approved';
          const isActiveRental = ['Aktif', 'Active', 'Disetujui', 'Approved', 'Signed', 'Draft Kontrak'].includes(app.status || '');
          const prevEndDate = extReq?.original_end_date || (app.end_date && extReq?.additional_days ? dayjs(app.end_date).subtract(extReq.additional_days, 'day').format('YYYY-MM-DD') : null);

          return (
            <div 
              key={app.id} 
              className={`bg-white rounded-xl shadow-xs border transition-all flex flex-col group overflow-hidden ${
                hasPendingExt ? 'border-amber-300 hover:shadow-md' :
                hasApprovedExt ? 'border-emerald-200/90 hover:shadow-md' :
                'border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Header Card */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-2">
                {/* Baris 1: Label Nomor Tiket & Status Utama */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Nomor Tiket
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                {/* Baris 2: Nomor Tiket & Status Tambahan (Perpanjangan) */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-base sm:text-[17px] text-blue-700 group-hover:text-blue-800 transition-colors tracking-tight font-mono">
                    {app.application_number}
                  </span>
                  {hasApprovedExt && (
                    <StatusBadge status="Aktif" label="Diperpanjang" />
                  )}
                  {hasPendingExt && (
                    <StatusBadge status="Menunggu" label="Perpanjangan Diproses" />
                  )}
                </div>
              </div>
              
              {/* Body Card */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Aset yang Diminati */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tipe &amp; Aset yang Diminati
                  </div>
                  {app.assets ? (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-blue-600 mb-0.5">
                          {app.application_type || 'Sewa Baru'}
                        </div>
                        <div className="font-bold text-slate-800 leading-tight">
                          {app.assets.nama_aset}
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5 font-medium">
                          {app.assets.kode_aset} • {app.assets.jenis_aset}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 border-dashed text-slate-400 italic text-sm">
                      Belum dialokasikan / Aset tidak valid
                    </div>
                  )}

                  {spec.relocations && spec.relocations.length > 0 && (
                    <div className="mt-2 text-[11px] text-blue-700 bg-blue-50/90 p-2.5 rounded-lg border border-blue-200/80 flex items-start gap-1.5">
                      <span className="font-bold flex-shrink-0">🔄 Relokasi Penempatan:</span>
                      <span>
                        Dialihkan ke <strong>{spec.relocations[spec.relocations.length - 1].new_asset_name}</strong> ({spec.relocations[spec.relocations.length - 1].new_asset_type}) pada perpanjangan sewa
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Periode Sewa & Highlight Perpanjangan */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mulai</div>
                      <div className="font-semibold text-slate-700">{app.start_date ? formatDate(app.start_date) : '-'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Selesai</span>
                        {hasApprovedExt && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            +{extReq.additional_days} Hari
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-700">{app.end_date ? formatDate(app.end_date) : '-'}</div>
                      {hasApprovedExt && prevEndDate && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Semula: <span className="line-through decoration-slate-400 font-mono text-slate-500">{formatDate(prevEndDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlight Banner Perpanjangan yang Rapi */}
                  {hasApprovedExt && (
                    <div className="mt-3.5 p-2.5 bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                        <span className="font-medium text-[11px]">
                          Masa sewa bertambah <strong className="font-bold text-emerald-800">+{extReq.additional_days} hari</strong>
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200/80 shadow-2xs">
                        s/d {dayjs(extReq.requested_end_date).format('DD MMM YYYY')}
                      </span>
                    </div>
                  )}

                  {hasPendingExt && (
                    <div className="mt-3.5 p-2.5 bg-gradient-to-r from-amber-50/90 to-orange-50/60 border border-amber-200/80 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span className="font-medium text-[11px]">
                          Menunggu verifikasi admin <strong className="font-bold text-amber-800">(+{extReq.additional_days} hari)</strong>
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200/80 shadow-2xs">
                        Target: {dayjs(extReq.requested_end_date).format('DD MMM')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer Card */}
              <div className="bg-slate-50/80 p-4 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {isActiveRental && (
                    hasPendingExt ? (
                      <StatusBadge status="Menunggu" label="Sedang Diverifikasi" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenExtensionModal(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-none text-xs font-bold shadow-2xs transition-all cursor-pointer"
                        title="Ajukan perpanjangan masa sewa untuk tiket ini"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        Perpanjang Sewa
                      </button>
                    )
                  )}

                  <Link 
                    href={`/tenant/permohonan/${app.id}`} 
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold bg-blue-50/60 hover:bg-blue-100/60 px-3 py-1.5 rounded-none text-xs border border-blue-100 transition-colors ml-auto"
                  >
                    <span>Lihat Detail</span>
                    <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </Link>
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between items-center w-full">
                  <span>Diajukan {formatDate(app.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Permohonan Sewa <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin Timika</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Permohonan Sewa Mozes Kilangin</span>
        </div>
      </header>

      {/* 2. Status Kontrak Payung Induk (Persis Tampilan Gambar) */}
      <div className="mb-4">
        <ContractStatusBar
          activePayung={activePayung}
          companyName={companyName}
          isLoading={contractsLoading}
          isContractActive={isContractActive}
          isPendingSignature={isPendingSignature}
          isPendingVerification={isPendingVerification}
          subtitle="• Izin operasional fasilitas kebandarudaraan & pemanfaatan hanggar aktif"
        />
      </div>

      {!isVerified && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-start shadow-sm">
          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-600" />
          <div>
            <h4 className="font-bold text-sm">Fitur Terkunci (Akun Belum Diverifikasi)</h4>
            <p className="text-sm mt-1">
              Anda tidak dapat mengajukan permohonan sewa baru. Silakan lengkapi Dokumen Legalitas (NIB, NPWP, Akta) di menu Profil & Dokumen, lalu tunggu persetujuan dari Admin UPBU.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Daftar Permohonan Anda
          </h3>
          {isVerified ? (
            <Link href="/tenant/permohonan/buat" className="bg-[#3c8dbc] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#367fa9] transition-colors flex items-center rounded-sm">
              <Plus className="w-4 h-4 mr-1" /> Ajukan Sewa Baru
            </Link>
          ) : (
            <button disabled className="bg-gray-400 text-white px-3 py-1.5 text-[12px] font-medium cursor-not-allowed flex items-center rounded-sm opacity-60" title="Lengkapi Dokumen Legalitas untuk Mengajukan Sewa">
              <Plus className="w-4 h-4 mr-1" /> Ajukan Sewa Baru (Terkunci)
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-50 min-h-[400px]">
          {renderContent()}
        </div>
      </div>

      {/* Modal Pengajuan Perpanjangan Sewa */}
      <RequestExtensionModal
        isOpen={extensionModalOpen}
        onClose={() => {
          setExtensionModalOpen(false);
          setSelectedAppForExtension(null);
        }}
        application={selectedAppForExtension}
        onSuccess={fetchApplications}
      />
    </div>
  );
}
