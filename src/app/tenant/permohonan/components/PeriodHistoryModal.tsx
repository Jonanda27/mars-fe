"use client";

import React from 'react';
import { 
  X, History, Calendar, ArrowRight, CheckCircle2, Clock, 
  MapPin, FileText, UserCheck, ShieldCheck 
} from 'lucide-react';
import { RentalApplication } from '../../../../types/rental';
import { formatDate } from '../../../../utils/date';
import StatusBadge from '../../../../components/StatusBadge';
import dayjs from 'dayjs';

interface PeriodHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: RentalApplication | null;
}

export const PeriodHistoryModal: React.FC<PeriodHistoryModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  if (!isOpen || !application) return null;

  const spec = typeof application.specific_needs === 'string'
    ? JSON.parse(application.specific_needs)
    : (application.specific_needs || {});
  
  const extReq = spec?.extension_request;
  const history = Array.isArray(spec?.extension_history) ? spec.extension_history : [];
  
  // Tanggal selesai sebelum perpanjangan
  const prevEndDate = extReq?.original_end_date || 
    (application.end_date && extReq?.additional_days 
      ? dayjs(application.end_date).subtract(extReq.additional_days, 'day').format('YYYY-MM-DD') 
      : null);

  const initialDuration = (application.start_date && prevEndDate) 
    ? Math.max(1, dayjs(prevEndDate).diff(dayjs(application.start_date), 'day')) 
    : null;

  const currentDuration = (application.start_date && application.end_date) 
    ? Math.max(1, dayjs(application.end_date).diff(dayjs(application.start_date), 'day')) 
    : null;

  const hasRelocation = spec?.relocations && spec.relocations.length > 0;
  const latestRelocation = hasRelocation ? spec.relocations[spec.relocations.length - 1] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] text-white px-6 py-4 flex justify-between items-center border-b border-[#367fa9] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-none border border-white/20 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Riwayat Periode &amp; Perpanjangan Sewa
              </h3>
              <p className="text-blue-100 text-xs mt-0.5 font-mono">
                {application.application_number} &bull; {application.assets?.nama_aset || 'Fasilitas Bandara'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-none transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Objek Sewa & Info Badge */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-none flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Objek Sewa &amp; Status Tiket
              </div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3c8dbc]" />
                <span>{application.assets?.nama_aset}</span>
                <span className="text-xs text-slate-500 font-normal">({application.assets?.kode_aset} &bull; {application.assets?.jenis_aset})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={application.status} />
              <StatusBadge status="Aktif" label="Diperpanjang" />
            </div>
          </div>

          {/* Banner Relokasi (Jika Aset Dipindah saat Perpanjangan) */}
          {hasRelocation && latestRelocation && (
            <div className="bg-blue-50/90 border-t-[3px] border-t-[#3c8dbc] border-x border-b border-blue-200 p-3.5 text-xs text-blue-900 rounded-none leading-relaxed flex items-start gap-2.5 shadow-2xs">
              <span className="text-base flex-shrink-0">🔄</span>
              <div>
                <strong className="block font-bold mb-0.5 text-blue-950">Relokasi Penempatan Aset:</strong>
                Penempatan pesawat dialihkan dari <strong>{latestRelocation.previous_asset_name || 'Hanggar Semula'}</strong> ke <strong>{latestRelocation.new_asset_name}</strong> ({latestRelocation.new_asset_type}) untuk periode perpanjangan sewa.
              </div>
            </div>
          )}

          {/* Symmetrical Side-by-Side Comparison: Periode Awal vs Periode Baru */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Perbandingan Periode Sewa</span>
              {extReq?.additional_days && (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-bold text-[11px]">
                  Tambahan Masa Sewa: +{extReq.additional_days} Hari
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* KARTU KIRI: SEBELUM PERPANJANGAN (Periode Awal) */}
              <div className="bg-slate-50 border-t-[3px] border-t-slate-400 border-x border-b border-slate-200 p-4 rounded-none flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                    <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-none bg-slate-400" />
                      1. Periode Awal (Semula)
                    </span>
                    {initialDuration && (
                      <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-300 px-2 py-0.5 rounded font-mono">
                        {initialDuration} Hari / Malam
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 font-mono">
                    <div className="bg-white p-2.5 border border-slate-200 rounded-none">
                      <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block mb-0.5">Tanggal Mulai</span>
                      <span className="text-sm font-bold text-slate-800">
                        {application.start_date ? formatDate(application.start_date) : '-'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border border-slate-200 rounded-none">
                      <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block mb-0.5">Tanggal Selesai (Semula)</span>
                      <span className="text-sm font-bold text-slate-700">
                        {prevEndDate ? formatDate(prevEndDate) : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] text-slate-500 text-center font-sans">
                  Status: <em>Telah Diperpanjang</em>
                </div>
              </div>

              {/* KARTU KANAN: SETELAH PERPANJANGAN (Periode Baru / Aktif) */}
              <div className="bg-emerald-50/40 border-t-[3px] border-t-[#00a65a] border-x border-b border-emerald-200 p-4 rounded-none flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200">
                    <span className="font-bold text-[11px] text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-none bg-[#00a65a]" />
                      2. Periode Baru (Aktif)
                    </span>
                    {currentDuration && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded font-mono">
                        {currentDuration} Hari / Malam (Aktif)
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 font-mono">
                    <div className="bg-white p-2.5 border border-emerald-200 rounded-none">
                      <span className="text-[10px] text-emerald-700 font-sans font-bold uppercase block mb-0.5">Tanggal Mulai</span>
                      <span className="text-sm font-bold text-slate-800">
                        {application.start_date ? formatDate(application.start_date) : '-'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border border-emerald-200 rounded-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-sans font-bold uppercase block mb-0.5">Tanggal Selesai (Baru)</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-sans">
                          +{extReq?.additional_days || 0} Hari
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-950">
                        {application.end_date ? formatDate(application.end_date) : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-emerald-200 text-[11px] text-emerald-800 font-bold text-center font-sans flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Periode Yang Berlaku Saat Ini</span>
                </div>
              </div>

            </div>
          </div>

          {/* Rincian Permohonan Perpanjangan */}
          <div className="bg-white border border-slate-200 p-4 rounded-none space-y-2.5 text-xs">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#3c8dbc]" />
              Catatan &amp; Pengesahan Perpanjangan
            </div>

            {extReq?.reason && (
              <div className="bg-slate-50 p-3 rounded-none border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alasan Perpanjangan dari Penyewa / Tenant:
                </span>
                <p className="text-slate-800 italic leading-relaxed">
                  &ldquo;{extReq.reason}&rdquo;
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div>
                <span className="text-slate-400">Tanggal Pengajuan:</span>{' '}
                <span className="font-bold text-slate-700">
                  {extReq?.requested_at ? dayjs(extReq.requested_at).format('DD MMM YYYY, HH:mm') : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Disetujui Admin:</span>{' '}
                <span className="font-bold text-slate-700">
                  {extReq?.reviewed_at ? dayjs(extReq.reviewed_at).format('DD MMM YYYY, HH:mm') : '-'}
                  {extReq?.reviewed_by ? ` (${extReq.reviewed_by})` : ''}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Modal */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            * Seluruh perubahan masa sewa telah diverifikasi &amp; disahkan oleh Admin UPBU Mozes Kilangin.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none cursor-pointer transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
