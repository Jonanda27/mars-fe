"use client";

import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Plane, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft,
  ShieldCheck,
  Building2
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { RentalApplication } from '@/types/rental';

dayjs.locale('id');

interface MiniAirportStep4WaitingAdminProps {
  app: RentalApplication;
  onPrevStep?: () => void;
  onSuccess?: (updatedApp: RentalApplication) => void;
  isReadOnly?: boolean;
}

export const MiniAirportStep4WaitingAdmin: React.FC<MiniAirportStep4WaitingAdminProps> = ({
  app,
  onPrevStep,
  isReadOnly = false
}) => {
  const spec = useMemo(() => {
    if (!app.specific_needs) return {};
    if (typeof app.specific_needs === 'string') {
      try {
        return JSON.parse(app.specific_needs);
      } catch (e) {
        return {};
      }
    }
    return app.specific_needs;
  }, [app.specific_needs]);

  const allocatedStand = spec.allocated_stand || null;
  const airportName = spec.airport_name || 'Lapangan Terbang Perintis';
  const airportCode = spec.airport_code || 'MINI';
  const airportLocation = spec.airport_location || 'Papua Tengah';

  return (
    <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg mb-8 overflow-hidden font-sans">
      {/* 1. Hero / Banner Section (Identik dengan Step Validasi Admin Permohonan Sewa) */}
      <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
        {/* Background Watermark Icon */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-[#3c8dbc]" />
        </div>

        {/* Circular Glowing Spinner */}
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
            <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
          </div>
          <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
        </div>

        {/* Status & Title Description */}
        <div className="text-center md:text-left flex-1 z-10 mt-2">
          <div className="inline-flex items-center px-3 py-1 rounded bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
            Status Saat Ini: Tahap 4
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
            Menunggu Validasi Petugas &amp; Alokasi Stand Apron
          </h2>
          <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
            Rencana operasional penerbangan dan spesifikasi armada yang Anda ajukan telah kami terima dengan baik. Saat ini, <strong>Administrator {airportName}</strong> sedang memverifikasi kesiapan slot runway, slot kedatangan VFR/VMC, serta menetapkan posisi alokasi stand apron parkir pesawat. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
          </p>
        </div>
      </div>

      {/* 2. Receipt Summary (Rangkuman Pengajuan Layanan) */}
      <div className="p-8 md:p-12 bg-white">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Rangkuman Rencana Operasional Penerbangan
          </h3>
          <span className="text-xs font-bold text-slate-400 font-mono">
            ID: {app.application_number}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri: Tujuan, Bandara, Jadwal & Manifes */}
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tujuan / Keperluan Penerbangan
              </p>
              <p className="text-[14px] text-slate-800 font-medium">
                {spec.purpose || app.purpose || 'Penerbangan Perintis & Angkutan Penumpang'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Lapangan Terbang Tujuan
                </p>
                <p className="text-[14px] text-[#3c8dbc] font-bold">
                  {airportName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  Kode: {airportCode} • {airportLocation}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Estimasi Jadwal Mendarat
                </p>
                <p className="text-[14px] text-slate-800 font-medium">
                  {spec.landing_date ? dayjs(spec.landing_date).format('DD MMM YYYY') : '-'}
                  <span className="mx-2 text-slate-400">,</span>
                  <span className="font-bold text-[#3c8dbc]">{spec.landing_time || '08:30'} WIT</span>
                </p>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Slot Operasional: <span className="font-semibold text-slate-700">Pagi (VFR/VMC)</span>
                </p>
              </div>
            </div>

            {/* Manifes Penumpang & Ketentuan Lapangan */}
            <div className="bg-[#f4f8fb] border border-[#d2e3ee] p-4 rounded-md space-y-1.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Manifes Penumpang
              </p>
              <p className="text-[13px] text-slate-800 font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#00a65a]" />
                {spec.passengers_count || 0} Orang Penumpang (Pax)
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Jumlah penumpang telah diverifikasi sesuai batas daya angkut maksimum armada.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Armada Pesawat & Alokasi Stand Apron */}
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Armada Pesawat yang Diajukan
              </p>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-3 border border-blue-100 flex-shrink-0">
                      <Plane className="w-5 h-5 text-[#3c8dbc]" />
                    </div>
                    <div>
                      <span className="block text-[14px] font-bold text-slate-800 leading-none mb-1 font-mono">
                        {spec.registration_number || '-'}
                      </span>
                      <span className="text-slate-500 text-[11px] font-medium">
                        {spec.aircraft_type || 'Pesawat Perintis'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:text-right pl-13 sm:pl-0">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Kapasitas
                      </span>
                      <span className="text-[13px] font-medium text-slate-700">
                        {spec.aircraft_capacity || '-'} Pax
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Kesiapan
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                        ● Siap Terbang
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posisi Alokasi Stand Apron */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Status Alokasi Stand Apron
              </p>
              <div className="border border-slate-200 rounded-lg p-4 bg-[#f8fafc] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Posisi Stand Parkir:</span>
                  {allocatedStand ? (
                    <span className="font-mono font-bold text-xs bg-white text-[#3c8dbc] px-2.5 py-1 rounded border border-[#3c8dbc]">
                      {allocatedStand}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      Menunggu Penetapan Petugas
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {allocatedStand
                    ? `Stand parkir pendaratan resmi telah dialokasikan pada ${allocatedStand}.`
                    : `Petugas lapangan terbang ${airportName} akan menetapkan slot Stand 01 (Utama) atau Stand 02 (Cadangan) saat validasi penerbangan disetujui.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Back Button */}
        {onPrevStep && !isReadOnly && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevStep}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#3c8dbc] hover:text-[#367fa9] bg-blue-50/60 hover:bg-blue-100/60 rounded border border-blue-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Ubah Armada &amp; Jadwal Pendaratan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniAirportStep4WaitingAdmin;
