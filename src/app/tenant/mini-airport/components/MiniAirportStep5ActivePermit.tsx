"use client";

import React, { useMemo, useRef, useState } from 'react';
import { 
  CheckCircle2, Printer, Download, MapPin, Plane, Users, 
  Calendar, Clock, ShieldCheck, Plus, ArrowLeft, Loader2, QrCode
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import toast from 'react-hot-toast';
import { RentalApplication } from '@/types/rental';
import StatusBadge from '@/components/StatusBadge';

dayjs.locale('id');

interface MiniAirportStep5ActivePermitProps {
  app: RentalApplication;
  onPlanNewFlight?: () => void;
  onBackToList?: () => void;
}

export const MiniAirportStep5ActivePermit: React.FC<MiniAirportStep5ActivePermitProps> = ({
  app,
  onPlanNewFlight,
  onBackToList
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const voucherRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;
    try {
      setIsExporting(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = voucherRef.current;
      const opt = {
        margin: 10,
        filename: `Izin_Pendaratan_Mini_Airport_${app.application_number || 'SLIP'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Slip izin pendaratan Mini Airport berhasil diunduh dalam format PDF.');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Gagal mengunduh berkas PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Card */}
      <div className="bg-white border-t-[3px] border-[#00a65a] shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#00a65a] flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-800">
                Izin Operasional Mini Airport Telah Terbit &amp; Aktif
              </h2>
              <StatusBadge status={app.status || 'Aktif'} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Nomor Permohonan: <span className="font-mono font-bold text-slate-700">{app.application_number}</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#3c8dbc] bg-white border border-[#3c8dbc] rounded-xs hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Unduh PDF
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xs hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Slip
          </button>

          {onPlanNewFlight && (
            <button
              type="button"
              onClick={onPlanNewFlight}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#00a65a] hover:bg-[#008d4c] rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Permohonan Baru
            </button>
          )}
        </div>
      </div>

      {/* OFFICIAL VOUCHER / SLIP CLEARANCE DOKUMEN */}
      <div 
        ref={voucherRef}
        className="bg-white border-2 border-slate-300 shadow-md rounded-xs overflow-hidden max-w-4xl mx-auto print:border-none print:shadow-none"
      >
        {/* KOP RESMI DINAS PERHUBUNGAN */}
        <div className="border-b-2 border-slate-800 p-6 sm:p-7 text-center relative bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-bold tracking-widest text-slate-600 uppercase">
              Pemerintah Provinsi Papua Tengah
            </h3>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-wider uppercase mt-0.5">
              Dinas Perhubungan
            </h2>
            <p className="text-xs text-[#3c8dbc] font-bold tracking-wide uppercase mt-0.5">
              UPT Bandara Perintis — {spec.airport_name?.toUpperCase() || 'LAPANGAN TERBANG PERINTIS'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {spec.airport_location || 'Papua Tengah'}, Indonesia • Layanan Operasional Penerbangan Perintis
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-300 flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">NO. IZIN: {app.application_number}</span>
            <StatusBadge status={app.status || 'Aktif'} />
          </div>
        </div>

        {/* VOUCHER BODY */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Judul Dokumen */}
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 inline-block">
              Surat Izin Operasional &amp; Penetapan Slot Pendaratan Mini Airport
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Diterbitkan berdasarkan disposisi persetujuan Kepala Dinas Perhubungan dan verifikasi teknis apron.
            </p>
          </div>

          {/* Grid Informasi Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xs border border-slate-200 text-xs">
            {/* Tujuan Mini Airport */}
            <div className="space-y-1">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Lapangan Terbang Perintis Tujuan:
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#3c8dbc]" />
                {spec.airport_name || 'Lapangan Terbang Perintis'}
              </p>
              <p className="text-slate-600 text-[11px]">
                Kode ICAO/IATA: <span className="font-mono font-bold">{spec.airport_code || '-'}</span> • {spec.airport_location || 'Papua Tengah'}
              </p>
            </div>

            {/* Alokasi Apron */}
            <div className="space-y-1">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Posisi Parkir (Stand Apron):
              </span>
              <div className="inline-flex items-center gap-2 bg-blue-100/80 px-3 py-1 rounded-2xs border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
                <span className="font-mono font-bold text-sm text-slate-900">{spec.allocated_stand || 'STAND 01'}</span>
              </div>
              <p className="text-slate-500 text-[10px]">Alokasi resmi petugas lapangan terbang perintis</p>
            </div>

            {/* Armada */}
            <div className="space-y-1 pt-3 border-t border-slate-200">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Armada Pesawat:
              </span>
              <p className="text-sm font-bold text-[#3c8dbc] font-mono flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-slate-600" />
                {spec.registration_number || '-'}
              </p>
              <p className="text-slate-600 text-[11px]">
                {spec.aircraft_type || 'Pesawat Perintis'} (Kapasitas: {spec.aircraft_capacity || '-'} Kursi)
              </p>
            </div>

            {/* Penumpang & Manifes */}
            <div className="space-y-1 pt-3 border-t border-slate-200">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Manifes &amp; Jumlah Penumpang:
              </span>
              <p className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                {spec.passengers_count || 0} Orang
              </p>
              <p className="text-emerald-700 text-[11px] font-medium">
                ✓ Sesuai batasan kapasitas armada
              </p>
            </div>

            {/* Waktu Kedatangan */}
            <div className="space-y-1 pt-3 border-t border-slate-200">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Jadwal Tiba di Mini Airport:
              </span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {spec.landing_date ? dayjs(spec.landing_date).format('DD MMMM YYYY') : '-'}
              </p>
              <p className="text-slate-600 text-[11px] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {spec.landing_time || '08:30'} WIT
              </p>
            </div>

            {/* Keperluan */}
            <div className="space-y-1 pt-3 border-t border-slate-200">
              <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">
                Keperluan Operasional:
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {spec.purpose || 'Penerbangan Perintis & Angkutan Penumpang'}
              </p>
              <p className="text-slate-500 text-[10px]">Wilayah Pedalaman Papua Tengah</p>
            </div>
          </div>

          {/* Catatan Keselamatan & Koordinasi */}
          <div className="bg-amber-50/60 p-3.5 rounded-xs border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Ketentuan Operasional &amp; Kepanduan Visual:</span>
            <p className="text-[11px] leading-relaxed">
              1. Penerbangan tunduk pada regulasi Visual Flight Rules (VFR) dan evaluasi cuaca oleh petugas lapangan terbang perintis.
              <br />
              2. Pilot in Command (PIC) wajib menjalin komunikasi radio lokal sebelum memasuki holding pattern runway.
              <br />
              3. Salinan izin pendaratan ini wajib disimpan di cockpit armada saat melakukan operasional ke lapangan terbang perintis.
            </p>
          </div>

          {/* Tanda Pengesahan Bawah */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            {/* Barcode & Verification */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px]">
                <QrCode className="w-8 h-8 text-slate-800" />
                <div>
                  <span className="font-bold block">VERIFIKASI DIGITAL DISHUB</span>
                  <span>REF: {app.application_number}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Dicetak melalui MARS Aviation Management System</p>
            </div>

            {/* Signature Block */}
            <div className="text-center min-w-[200px]">
              <p className="text-slate-600 text-[11px]">
                {spec.airport_location?.toLowerCase().includes('nabire') ? 'Nabire' : 'Papua Tengah'}, {dayjs().format('DD MMMM YYYY')}
              </p>
              <p className="font-bold text-slate-800 mt-1">Pengelola {spec.airport_name || 'Bandara Perintis'}</p>
              <p className="text-slate-600 text-[11px]">Dinas Perhubungan Provinsi Papua Tengah</p>
              
              <div className="my-3 py-1 font-serif text-[#00a65a] font-bold text-sm border-y border-dashed border-emerald-300">
                [ TERCATAT &amp; TERVALIDASI ]
              </div>

              <p className="text-slate-800 font-bold text-xs underline">
                UPT BANDARA PERINTIS — {spec.airport_code || 'MINI'}
              </p>
              <p className="text-[10px] text-slate-500">Pemerintah Provinsi Papua Tengah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Kembali */}
      {onBackToList && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3c8dbc] hover:text-[#367fa9] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Permohonan Mini Airport
          </button>
        </div>
      )}
    </div>
  );
};
