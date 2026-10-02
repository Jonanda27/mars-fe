"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlaneTakeoff, Plane, MapPin, Users, Moon, Sun, 
  UploadCloud, AlertCircle, CheckCircle2, Loader2, FileText, ArrowRight,
  Clock, Info
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import { formatRupiah } from '@/utils/formatCurrency';

interface CheckoutModalProps {
  readonly isOpen: boolean;
  readonly log: any | null;
  readonly masterTaxes: any[];
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  log,
  masterTaxes,
  onClose,
  onSuccess,
}) => {
  const [exitTime, setExitTime] = useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [isOvernight, setIsOvernight] = useState<boolean>(false);
  const [overnightNights, setOvernightNights] = useState<number>(1);
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [remarks, setRemarks] = useState<string>('');
  const [exitPhoto, setExitPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const spec = useMemo(() => {
    if (!log?.notes) return {};
    if (typeof log.notes === 'string') {
      try {
        return JSON.parse(log.notes);
      } catch (e) {
        return {};
      }
    }
    return log.notes || {};
  }, [log]);

  // Inisialisasi data dari log saat modal dibuka
  useEffect(() => {
    if (log && isOpen) {
      setExitTime(dayjs().format('YYYY-MM-DDTHH:mm'));
      const initialOvernight = Boolean(log.is_overnight || spec.is_overnight);
      setIsOvernight(initialOvernight);
      setOvernightNights(Number(spec.overnight_nights) || (initialOvernight ? 1 : 1));
      setPassengersCount(Number(spec.passengers_count) || 1);
      setRemarks('');
      setExitPhoto(null);
    }
  }, [log, isOpen, spec]);

  // Hitung durasi jam / hari dan otomatisasi penetapan Parkir vs Nginap berdasarkan cut-off 17:00 WIT
  const durationInfo = useMemo(() => {
    if (!log?.entry_time || !exitTime) {
      return {
        durationFormatted: '0 Menit',
        totalMinutes: 0,
        isOvernightAuto: false,
        nightsAuto: 0,
      };
    }

    const entry = dayjs(log.entry_time);
    const exit = dayjs(exitTime);
    const totalMinutes = Math.max(0, exit.diff(entry, 'minute'));

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    let durationFormatted = '';
    if (days > 0) {
      durationFormatted = `${days} Hari ${hours} Jam ${minutes} Menit`;
    } else if (hours > 0) {
      durationFormatted = `${hours} Jam ${minutes} Menit`;
    } else {
      durationFormatted = `${minutes} Menit`;
    }

    // Aturan Batas Jam 17:00 (5 Sore):
    // Jika keluar beda hari atau jam checkout >= 17:00, otomatis Menginap (RON)
    const isDifferentDay = !exit.isSame(entry, 'day') && exit.isAfter(entry);
    const isPast17 = exit.hour() >= 17;
    const isOvernightAuto = isDifferentDay || isPast17;

    let nightsAuto = 0;
    if (isOvernightAuto) {
      if (isDifferentDay) {
        nightsAuto = Math.max(1, exit.diff(entry, 'day'));
      } else {
        nightsAuto = 1;
      }
    }

    return {
      durationFormatted,
      totalMinutes,
      isOvernightAuto,
      nightsAuto,
    };
  }, [log?.entry_time, exitTime]);

  // Sinkronisasi otomatis status overnight sesuai jam checkout
  useEffect(() => {
    setIsOvernight(durationInfo.isOvernightAuto);
    if (durationInfo.isOvernightAuto) {
      setOvernightNights(durationInfo.nightsAuto);
    }
  }, [durationInfo.isOvernightAuto, durationInfo.nightsAuto]);

  // Simulasi Pajak Real-time berdasarkan input checkout
  const taxSimulation = useMemo(() => {
    if (!log || masterTaxes.length === 0) {
      return { taxes: [], total: 0 };
    }

    const typeName = (spec.aircraft_type || '').toLowerCase();
    const typeId = spec.aircraft_type_id ? Number(spec.aircraft_type_id) : null;
    const taxes: any[] = [];

    // 1. Landing Tax
    const landingTaxes = masterTaxes.filter((t) => t.kategori === 'Pendaratan');
    let lnd = null;
    if (typeId) lnd = landingTaxes.find((t) => t.aircraft_type_id === typeId);
    if (!lnd) {
      if (typeName.includes('heli') || typeName.includes('as350') || typeName.includes('bell') || typeName.includes('kamov')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-HELI');
      } else if (typeName.includes('c208') || typeName.includes('cessna') || typeName.includes('pac')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-LIGHT');
      } else if (typeName.includes('dhc') || typeName.includes('twin')) {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-MEDIUM');
      } else {
        lnd = landingTaxes.find((t) => t.kode_tax === 'TAX-LND-HEAVY');
      }
    }
    if (!lnd && landingTaxes.length > 0) lnd = landingTaxes[0];
    if (lnd) {
      taxes.push({ 
        nama_tax: `Tax Pendaratan (${lnd.nama_tax})`, 
        kategori: 'Pendaratan', 
        tarif: Number(lnd.tarif), 
        qty: 1, 
        subtotal: Number(lnd.tarif) 
      });
    }

    // 2. Pax Tax
    const pax = masterTaxes.find((t) => t.kategori === 'Penumpang' && t.kode_tax === 'TAX-PAX-DOM') || masterTaxes.find((t) => t.kategori === 'Penumpang');
    const paxQty = Math.max(1, passengersCount);
    if (pax) {
      taxes.push({ 
        nama_tax: 'Tax Pelayanan Penumpang (PJP2U)', 
        kategori: 'Penumpang', 
        tarif: Number(pax.tarif), 
        qty: paxQty, 
        subtotal: Number(pax.tarif) * paxQty 
      });
    }

    // 3. Airport Tax (1 item Jasa Pelayanan Kebandarudaraan)
    const apt = masterTaxes.find((t) => t.kategori === 'Airport' && t.kode_tax === 'TAX-APT-SRV') || masterTaxes.find((t) => t.kategori === 'Airport');
    if (apt) {
      taxes.push({ 
        nama_tax: 'Tax Airport (Jasa Kebandarudaraan)', 
        kategori: 'Airport', 
        tarif: Number(apt.tarif), 
        qty: 1, 
        subtotal: Number(apt.tarif) 
      });
    }

    // 4. Parkir vs Nginap
    if (isOvernight) {
      const ronTaxes = masterTaxes.filter((t) => t.kategori === 'Nginap');
      let ron = null;
      if (typeId) ron = ronTaxes.find((t) => t.aircraft_type_id === typeId);
      if (!ron) ron = ronTaxes[0];
      if (ron) {
        const nights = Math.max(1, overnightNights);
        taxes.push({ 
          nama_tax: `Tax Nginap Apron / RON (${nights} Malam)`, 
          kategori: 'Nginap', 
          tarif: Number(ron.tarif), 
          qty: nights, 
          subtotal: Number(ron.tarif) * nights 
        });
      }
    } else {
      const parkTaxes = masterTaxes.filter((t) => t.kategori === 'Parkir');
      let prk = null;
      if (typeId) prk = parkTaxes.find((t) => t.aircraft_type_id === typeId);
      if (!prk) prk = parkTaxes[0];
      if (prk) {
        taxes.push({ 
          nama_tax: 'Tax Parkir Apron (Transit)', 
          kategori: 'Parkir', 
          tarif: Number(prk.tarif), 
          qty: 1, 
          subtotal: Number(prk.tarif) 
        });
      }
    }

    const total = taxes.reduce((acc, curr) => acc + curr.subtotal, 0);
    return { taxes, total };
  }, [log, masterTaxes, spec, passengersCount, isOvernight, overnightNights]);

  if (!isOpen || !log) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitTime) {
      toast.error('Waktu keberangkatan wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('exit_time', exitTime);
      fd.append('is_overnight', String(isOvernight));
      fd.append('overnight_nights', String(isOvernight ? overnightNights : 0));
      fd.append('passengers_count', String(passengersCount));
      fd.append('remarks', remarks);
      if (exitPhoto) {
        fd.append('exit_photo', exitPhoto);
      }

      await miniAirportLogService.checkoutMiniAirportLog(log.id, fd);
      toast.success('Checkout keberangkatan berhasil! Stand apron kini kosong dan data diteruskan ke Dinas untuk penerbitan SKRD.');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal melakukan checkout keberangkatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const standName = spec.allocated_stand || log.parking_location || 'STAND 01';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-2xl w-full border-t-[4px] border-amber-600 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Checkout Keberangkatan Armada (Lepas Landas)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pencatatan waktu lepas landas oleh Petugas Lapangan untuk membebaskan stand apron dan meneruskan ke Dinas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* 1. Ringkasan Pesawat & Kedatangan */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-[11px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Armada &amp; Maskapai:</span>
              <span className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                {log.registration_number} ({spec.aircraft_type || 'Perintis'}) • {log.tenants?.nama_perusahaan || 'Mitra Maskapai'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Posisi Stand Apron Saat Ini:</span>
              <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-200">
                {standName} (Aktif Terisi)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Waktu Mendarat (Touchdown):</span>
              <span className="font-bold text-slate-700">
                {dayjs(log.entry_time).format('DD MMMM YYYY, HH:mm')} WIT
              </span>
            </div>
          </div>

          {/* 2. Input Waktu Keberangkatan & Jumlah Pax Realisasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Waktu Lepas Landas / Checkout <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                required
                className="w-full border border-slate-300 p-2 bg-white text-xs focus:outline-none focus:border-amber-600 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Mencatat jam resmi pelepasan stand apron.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Penumpang Keluar/Aktual (Pax) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full border border-slate-300 p-2 pl-8 bg-white text-xs focus:outline-none focus:border-amber-600 font-bold"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Jumlah penumpang untuk perhitungan PJP2U final.
              </span>
            </div>
          </div>

          {/* 3. Durasi Parkir Stand & Penetapan Status (Cut-off 17:00 WIT) */}
          <div className="border border-slate-200 p-3.5 bg-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block tracking-wider">
                  Total Durasi Berada di Stand Apron
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-[#3c8dbc]" />
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {durationInfo.durationFormatted}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ({dayjs(log.entry_time).format('HH:mm')} s/d {dayjs(exitTime).format('HH:mm')} WIT)
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 block tracking-wider">
                  Ketetapan Retribusi
                </span>
                <div className="mt-1">
                  {isOvernight ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      <Moon className="w-3.5 h-3.5 text-purple-600" />
                      Menginap / RON ({overnightNights} Malam)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      Parkir Stand (Transit)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Info className="w-3.5 h-3.5 text-[#3c8dbc] shrink-0" />
                {isOvernight ? (
                  <span>
                    Ditetapkan sebagai <strong>Menginap (RON)</strong> karena armada berada di stand melewati batas cut-off pukul <strong>17:00 WIT</strong> atau beda hari.
                  </span>
                ) : (
                  <span>
                    Ditetapkan sebagai <strong>Parkir Transit</strong> karena checkout dilakukan sebelum batas cut-off pukul <strong>17:00 WIT</strong>.
                  </span>
                )}
              </span>

              {isOvernight && (
                <div className="flex items-center gap-1.5 shrink-0 bg-purple-50/70 border border-purple-200 px-2.5 py-1">
                  <span className="text-[11px] font-bold text-purple-900">Durasi Malam:</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={overnightNights}
                    onChange={(e) => setOvernightNights(Math.max(1, Number(e.target.value)))}
                    className="w-14 border border-purple-300 p-0.5 text-center font-mono font-bold text-xs bg-white focus:outline-none focus:border-purple-600"
                  />
                  <span className="text-[11px] font-medium text-purple-800">Malam</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Rincian Simulasi Tax Retribusi Final */}
          <div className="border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Rincian Retribusi Final (Akan Diteruskan ke Dinas)
              </span>
              <span className="text-[10px] text-slate-500">Perda Retribusi Daerah</span>
            </div>

            <div className="space-y-1 divide-y divide-slate-200 text-[11px]">
              {taxSimulation.taxes.map((t, idx) => (
                <div key={idx} className="flex justify-between pt-1 text-slate-600">
                  <span>{t.nama_tax} {t.qty > 1 ? `(x${t.qty})` : ''}</span>
                  <span className="font-mono font-medium text-slate-800">{formatRupiah(t.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold text-xs text-slate-900">
                <span>Total Estimasi Retribusi:</span>
                <span className="font-mono text-[#00a65a] text-sm">{formatRupiah(taxSimulation.total)}</span>
              </div>
            </div>
          </div>

          {/* 5. Catatan Keberangkatan & Upload Bukti */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Operasional Lepas Landas
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Take off lancar cuaca cerah, apron ditinggalkan dalam keadaan bersih."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border border-slate-300 p-2 bg-white text-xs focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Foto Bukti Keberangkatan / Apron Bebas (Opsional)
              </label>
              <div className="border border-dashed border-slate-300 p-2 text-center bg-white hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setExitPhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="checkout-photo-input"
                />
                <label htmlFor="checkout-photo-input" className="cursor-pointer block">
                  <UploadCloud className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-600 font-medium block">
                    {exitPhoto ? exitPhoto.name : 'Klik untuk unggah foto keberangkatan'}
                  </span>
                  <span className="text-[9px] text-slate-400">JPG, PNG maks 5MB</span>
                </label>
              </div>
            </div>
          </div>

          {/* 6. Kotak Penjelasan Alur Resmi */}
          <div className="bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Penjelasan Alur Pasca-Checkout:</strong>
              <p className="mt-0.5">
                Setelah Anda menekan tombol di bawah, posisi <strong>{standName}</strong> akan berstatus <strong>KOSONG</strong> dan langsung dapat dialokasikan untuk permohonan pendaratan armada lain. 
                Data realisasi ini akan diteruskan ke <strong>Dinas Perhubungan</strong> untuk verifikasi dan penerbitan <strong>Surat Ketetapan Retribusi Daerah (e-SKRD)</strong>.
              </p>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses Checkout...</span>
                </>
              ) : (
                <>
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>Konfirmasi Checkout &amp; Bebaskan Stand</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
