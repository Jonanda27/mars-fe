"use client";

import React, { useMemo } from 'react';
import { RentalApplication } from '@/types/rental';
import { resolveUrl } from '@/utils/url';
import { 
  Plane, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  TowerControl, 
  FileSignature, 
  ExternalLink 
} from 'lucide-react';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface MiniAirportPlanCardProps {
  app: RentalApplication;
  currentStep: number;
}

export const MiniAirportPlanCard: React.FC<MiniAirportPlanCardProps> = ({ app }) => {
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

  const contractFasilitas = (app.contracts?.fasilitas as any) || {};
  const airportName = spec.airport_name || contractFasilitas.airport_name || 'Lapangan Terbang Perintis';
  const airportCode = (spec.airport_code || contractFasilitas.airport_code || 'MINI').toUpperCase();
  const airportLocation = spec.airport_location || contractFasilitas.airport_location || 'Papua Tengah';

  const registrationNumber = spec.registration_number || '-';
  const aircraftType = spec.aircraft_type || 'Pesawat Perintis';
  const aircraftCapacity = spec.aircraft_capacity || '-';
  const passengersCount = spec.passengers_count ?? 0;
  const landingDate = spec.landing_date ? dayjs(spec.landing_date).format('DD MMMM YYYY') : '-';
  const landingTime = spec.landing_time || '08:30';
  const purpose = spec.purpose || app.purpose || 'Penerbangan Perintis & Angkutan Penumpang';
  const allocatedStand = spec.allocated_stand || null;

  return (
    <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Card Header (AdminLTE Navy/Blue) */}
      <div className="bg-[#3c8dbc] px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2.5">
          <Plane className="w-5 h-5 text-white" />
          <h2 className="text-white font-bold tracking-wide text-sm">
            Rencana Operasional &amp; Rincian Penerbangan Mini Airport
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold bg-white text-[#3c8dbc] px-2 py-0.5 border border-white">
            [{airportCode}] {airportName}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 1. Tujuan / Perihal Permohonan */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-none">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#3c8dbc]" />
            Tujuan / Maksud Permohonan Operasional
          </p>
          <p className="text-slate-800 font-bold text-base leading-relaxed">
            {purpose}
          </p>
        </div>

        {/* 2. Dokumen Lampiran Surat Permohonan & Kontrak Payung Induk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Surat Permohonan Resmi */}
          <div className="bg-white border border-slate-200 p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Surat Permohonan Resmi
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                  Telah Diajukan
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 font-mono truncate">
                {app.official_letter_url ? app.official_letter_url.split('/').pop() : 'Surat_Permohonan_Resmi.pdf'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Berkas surat resmi bertandatangan basah pimpinan maskapai.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disahkan Kadis
              </span>
              {app.official_letter_url && (
                <a
                  href={resolveUrl(app.official_letter_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#3c8dbc] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat PDF
                </a>
              )}
            </div>
          </div>

          {/* Dokumen Kontrak Payung Induk */}
          <div className="bg-white border border-slate-200 p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Kontrak Payung Induk (PKS)
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                  Aktif (1 Tahun)
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#3c8dbc] font-mono truncate">
                {app.contracts?.contract_number || 'PKS-PAYUNG/MINI/RESMI'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Dasar hukum operasional &amp; master tarif retribusi pasca-flight.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">
                PKS Payung Sah
              </span>
              {app.contracts?.signed_document_url && (
                <a
                  href={resolveUrl(app.contracts.signed_document_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#3c8dbc] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat PKS PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 3. Parameter Teknis Penerbangan Perintis (4 Kotak Utama) */}
        <div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TowerControl className="w-4 h-4 text-[#3c8dbc]" />
            Spesifikasi Operasional Pendaratan Pesawat
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Box 1: Bandara Tujuan */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Lapangan Terbang Tujuan
              </span>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {airportName}
              </p>
              <p className="text-[11px] text-[#3c8dbc] font-mono font-bold mt-0.5">
                Kode: {airportCode}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {airportLocation}
              </p>
            </div>

            {/* Box 2: Armada Pesawat */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Armada Pesawat
              </span>
              <p className="text-sm font-bold text-[#3c8dbc] font-mono leading-tight">
                {registrationNumber}
              </p>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                {aircraftType}
              </p>
              <p className="text-[10px] text-slate-500">
                Kapasitas: <strong className="text-slate-700">{aircraftCapacity} Kursi (Pax)</strong>
              </p>
            </div>

            {/* Box 3: Jadwal Kedatangan */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Estimasi Jadwal Mendarat
              </span>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {landingDate}
              </p>
              <p className="text-[11px] text-[#3c8dbc] font-bold mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Pukul {landingTime} WIT
              </p>
              <p className="text-[10px] text-slate-500">
                Slot Operasional: Pagi (VFR/VMC)
              </p>
            </div>

            {/* Box 4: Manifes Penumpang */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Manifes Penumpang
              </span>
              <p className="text-sm font-bold text-emerald-800 leading-tight flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                {passengersCount} Orang Pax
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                ✓ Sesuai batasan daya angkut armada
              </p>
            </div>
          </div>
        </div>

        {/* 4. Banner Alokasi Stand Apron & Skema Retribusi */}
        <div className="p-4 bg-[#f8fafc] border border-blue-200/70 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Posisi Alokasi Stand Apron Parkir Pesawat
            </span>
            <div className="flex items-center gap-2">
              {allocatedStand ? (
                <StatusBadge status="Aktif" label={`Alokasi: ${allocatedStand} (Telah Ditetapkan)`} />
              ) : (
                <StatusBadge status="Menunggu" label={`Menunggu Penetapan Petugas / Admin ${airportName}`} />
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <span className="block font-medium">Skema Retribusi Kebandarudaraan:</span>
            <span className="font-bold text-slate-800">e-SKRD Pasca-Flight (PKS Payung)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniAirportPlanCard;
