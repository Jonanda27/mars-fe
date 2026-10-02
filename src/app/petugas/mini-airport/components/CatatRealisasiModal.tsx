"use client";

import React, { useState, useRef } from 'react';
import { 
  TowerControl, Plane, Users, Sun, Moon, ShieldCheck, 
  Loader2, CheckCircle2, Clock, MapPin, Building2, 
  UploadCloud, AlertCircle, Info, X, Plus, Minus, FileText, Lock
} from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

interface CatatRealisasiModalProps {
  readonly isOpen: boolean;
  readonly isSubmitting: boolean;
  readonly eligibleApps: any[];
  readonly selectedAppId: string;
  readonly setSelectedAppId: (id: string) => void;
  readonly selectedApp: any;
  readonly appSpec: any;
  readonly entryTime: string;
  readonly setEntryTime: (val: string) => void;
  readonly exitTime: string;
  readonly setExitTime: (val: string) => void;
  readonly passengersCount: number;
  readonly setPassengersCount: (val: number) => void;
  readonly parkingStand: string;
  readonly setParkingStand: (val: string) => void;
  readonly isOvernight: boolean;
  readonly setIsOvernight: (val: boolean) => void;
  readonly overnightNights: number;
  readonly setOvernightNights: (val: number) => void;
  readonly taxSimulation: { taxes: any[]; total: number };
  readonly remarks: string;
  readonly setRemarks: (val: string) => void;
  readonly setEvidencePhoto: (file: File | null) => void;
  readonly onClose: () => void;
  readonly onSubmit: (e: React.FormEvent) => void;
}

export const CatatRealisasiModal: React.FC<CatatRealisasiModalProps> = ({
  isOpen,
  isSubmitting,
  eligibleApps,
  selectedAppId,
  setSelectedAppId,
  selectedApp,
  appSpec,
  entryTime,
  setEntryTime,
  passengersCount,
  setPassengersCount,
  parkingStand,
  setParkingStand,
  isOvernight,
  setIsOvernight,
  overnightNights,
  setOvernightNights,
  taxSimulation,
  remarks,
  setRemarks,
  setEvidencePhoto,
  onClose,
  onSubmit,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEvidencePhoto(file);
      setSelectedFileName(file.name);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setEvidencePhoto(null);
      setSelectedFileName('');
      setPhotoPreview(null);
    }
  };

  const handleClearPhoto = () => {
    setEvidencePhoto(null);
    setSelectedFileName('');
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetCurrentTime = () => {
    setEntryTime(dayjs().format('YYYY-MM-DDTHH:mm'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white shadow-2xl max-w-3xl w-full border-t-[4px] border-[#3c8dbc] my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100/70 border border-blue-200 flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
              <TowerControl className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Catat Realisasi Fisik Pendaratan
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan aktual touchdown, penempatan stand apron, manifes pax, dan kalkulasi 4 retribusi daerah.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5 text-xs max-h-[calc(88vh-130px)] overflow-y-auto font-sans">
          
          {/* SECTION 1: PILIH JADWAL / IZIN PENDARATAN */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Pilih Izin Pendaratan Mini Airport <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              required
              className="w-full border-2 border-slate-200 p-2.5 bg-white text-xs font-medium focus:outline-none focus:border-[#3c8dbc] transition-colors"
            >
              <option value="">-- Pilih Nomor Permohonan / Armada Pesawat Masuk --</option>
              {eligibleApps.map((a) => {
                const s = typeof a.specific_needs === 'string'
                  ? JSON.parse(a.specific_needs || '{}')
                  : (a.specific_needs || {});
                return (
                  <option key={a.id} value={a.id}>
                    {a.application_number} — {s.registration_number || 'PK-???'} ({s.aircraft_type || 'Perintis'}) • {s.airport_name || 'Mini Airport'} • {a.tenants?.nama_perusahaan}
                  </option>
                );
              })}
            </select>

            {/* Quick Flight Preview Card when selected */}
            {selectedApp && (
              <div className="bg-[#f8fafc] border border-slate-200 p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                <div className="flex items-start gap-2">
                  <Plane className="w-4 h-4 text-[#3c8dbc] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Armada Pesawat</span>
                    <strong className="text-slate-900 font-mono text-xs">{appSpec.registration_number || '-'}</strong>
                    <span className="text-[11px] text-slate-500 block">{appSpec.aircraft_type || 'Pesawat Perintis'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:border-l sm:border-slate-200 sm:pl-3">
                  <Building2 className="w-4 h-4 text-[#3c8dbc] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Maskapai / Operator</span>
                    <strong className="text-slate-900 text-xs truncate block max-w-[190px]">
                      {selectedApp.tenants?.nama_perusahaan || '-'}
                    </strong>
                    <span className="text-[11px] text-slate-500 block">Mitra Terikat PKS</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:border-l sm:border-slate-200 sm:pl-3">
                  <MapPin className="w-4 h-4 text-[#3c8dbc] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tujuan &amp; Stand Rencana</span>
                    <strong className="text-[#3c8dbc] text-xs block">
                      {appSpec.airport_name || 'Mini Airport'} ({appSpec.airport_code || '-'})
                    </strong>
                    <span className="text-[11px] font-mono text-slate-600 block">
                      Rencana: <strong className="text-slate-800">{appSpec.allocated_stand || 'STAND 01'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: WAKTU TOUCHDOWN & ALOKASI STAND APRON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Waktu Mendarat (Touchdown) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  2. Waktu Touchdown (Mendarat) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSetCurrentTime}
                  className="text-[11px] text-[#3c8dbc] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  title="Gunakan jam saat ini"
                >
                  Set Waktu Sekarang
                </button>
              </div>
              <input
                type="datetime-local"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                required
                className="w-full border border-slate-300 p-2.5 bg-white text-xs font-mono font-medium focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
              />
              <span className="text-[10px] text-slate-400 block">
                Waktu resmi pendaratan fisik di runway lapangan terbang perintis.
              </span>
            </div>

            {/* Posisi Stand Apron */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Alokasi Stand Apron
              </label>

              {selectedApp ? (
                <div className="p-3 bg-slate-50 border border-slate-300 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#3c8dbc]">
                        {appSpec?.allocated_stand || parkingStand || 'STAND 01'}
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        {(appSpec?.allocated_stand || parkingStand || 'STAND 01').includes('02') ? '• Apron Cadangan' : '• Apron Utama'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Ditetapkan secara resmi oleh Administrator Bandara.
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100/70 border border-blue-200 flex items-center justify-center text-[#3c8dbc]">
                    <TowerControl className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 text-slate-400 text-center text-[11px]">
                  Pilih permohonan terlebih dahulu untuk memuat posisi stand yang telah ditetapkan Admin.
                </div>
              )}

              <span className="text-[10px] text-slate-400 block leading-relaxed">
                Posisi stand otomatis sesuai keputusan verifikasi Administrator Mini Airport dan tidak dapat diubah di lapangan.
              </span>
            </div>
          </div>

          {/* SECTION 3: MANIFES PENUMPANG & STATUS PENEMPATAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Jumlah Penumpang (Pax) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Manifes Penumpang (Pax) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPassengersCount(Math.max(1, passengersCount - 1))}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-full border border-slate-300 p-2 text-center text-sm font-bold font-mono focus:outline-none focus:border-[#3c8dbc]"
                  />
                  <Users className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setPassengersCount(passengersCount + 1)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1.5 pt-0.5">
                {[4, 8, 12, 18].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPassengersCount(num)}
                    className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
                  >
                    {num} Pax
                  </button>
                ))}
              </div>
            </div>

            {/* Status Penempatan & Ketentuan Durasi Parkir */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ketentuan Parkir Stand &amp; Batas Operasional
              </label>
              <div className="p-3 bg-amber-50/80 border border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-amber-500 text-white">
                    <Sun className="w-3.5 h-3.5" /> Stand Terisi (Transit)
                  </span>
                  <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-200">
                    Cut-off: 17:00 WIT
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Durasi parkir dihitung otomatis sejak touchdown. Petugas tidak perlu memilih status inap di awal. Jika pesawat masih berada di stand melewati pukul <strong>17:00 WIT</strong>, sistem otomatis mengalihkan status menjadi <strong>Menginap (RON)</strong> saat checkout.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: ESTIMASI RETRIBUSI RESMI (HANYA 4 KOMPONEN RETRIBUSI POKOK) */}
          <div className="border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Header Box Retribusi */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
                <span className="font-bold text-slate-800 text-xs">
                  Estimasi 4 Komponen Retribusi Daerah (Dasar Ketetapan e-SKRD Dinas)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 border border-slate-200">
                Perda Retribusi Daerah
              </span>
            </div>

            {/* List 4 Komponen Tax */}
            <div className="p-3.5 space-y-2">
              {taxSimulation.taxes.length > 0 ? (
                <div className="space-y-1.5 divide-y divide-slate-100 text-xs">
                  {taxSimulation.taxes.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0">
                      <div>
                        <span className="font-semibold text-slate-800 block text-[11.5px]">
                          {idx + 1}. {t.nama_tax}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {t.kategori === 'Penumpang' 
                            ? `Tarif dasar: ${formatRupiah(t.tarif)} • Vol: ${t.qty} Orang` 
                            : `Tarif dasar: ${formatRupiah(t.tarif)}`}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {formatRupiah(t.subtotal)}
                      </span>
                    </div>
                  ))}

                  {/* Total Akumulasi */}
                  <div className="pt-3 flex justify-between items-center border-t-2 border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                        Total Estimasi Retribusi:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Basis awal parkir transit. Disesuaikan otomatis saat checkout jika armada melewati pukul 17:00 WIT.
                      </span>
                    </div>
                    <span className="font-mono font-bold text-base text-[#00a65a]">
                      {formatRupiah(taxSimulation.total)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center text-slate-400 text-xs">
                  Pilih permohonan pendaratan di atas untuk menampilkan rincian 4 komponen retribusi resmi.
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-blue-50/60 border-t border-blue-100 text-[11px] text-slate-600 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
              <span>
                Retribusi resmi akan ditetapkan dan diterbitkan lembar <strong>e-SKRD</strong>-nya oleh <strong>Dinas Perhubungan</strong> setelah Anda melakukan <em>Checkout</em> saat pesawat lepas landas. Komponen parkir otomatis disesuaikan menjadi tarif inap (RON) jika checkout melewati pukul 17:00 WIT.
              </span>
            </div>
          </div>

          {/* SECTION 5: DOKUMENTASI FOTO & CATATAN LAPANGAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Upload Foto Dokumentasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Foto Bukti Pesawat di Apron (Opsional)
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="modal-evidence-photo"
              />

              {!photoPreview ? (
                <label
                  htmlFor="modal-evidence-photo"
                  className="border-2 border-dashed border-slate-300 hover:border-[#3c8dbc] p-3 text-center bg-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer block"
                >
                  <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-[#3c8dbc] block">
                    Unggah Foto Bukti Fisik
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Kamera HP / Berkas JPG, PNG maks 5MB
                  </span>
                </label>
              ) : (
                <div className="border border-slate-200 p-2.5 bg-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover border border-slate-300 flex-shrink-0" 
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {selectedFileName}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Berkas Siap Diunggah
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Hapus Foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Catatan Operasional */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Catatan Operasional Lapangan
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Contoh: Pesawat landing mulus cuaca cerah di Ilaga, 8 orang penumpang aman."
                className="w-full border border-slate-300 p-2.5 text-xs bg-white focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAppId}
              className="px-6 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Realisasi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Realisasi Fisik Pendaratan</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
