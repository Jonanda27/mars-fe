import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  Building2, 
  Plane, 
  Check, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Send, 
  MapPin, 
  Info 
} from 'lucide-react';
import dayjs from 'dayjs';
import { MiniAirportItem, SubmittedSchedulePlan } from './types';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';

interface MiniAirportLandingPlanProps {
  selectedAirport: MiniAirportItem;
  activePayung: Contract | null;
  effectiveAircrafts: Aircraft[];
  allAircraftsCount: number;
  selectedStand: string;
  setSelectedStand: (stand: string) => void;
  selectedAircraftId: number | null;
  setSelectedAircraftId: (id: number | null) => void;
  landingDate: string;
  setLandingDate: (date: string) => void;
  landingTime: string;
  setLandingTime: (time: string) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  isSubmitting: boolean;
  submittedSchedule: SubmittedSchedulePlan | null;
  onCancelSelection: () => void;
  onResetSubmittedSchedule: () => void;
  onSubmitLandingPlan: (e: React.FormEvent) => void;
}

export const MiniAirportLandingPlan: React.FC<MiniAirportLandingPlanProps> = ({
  selectedAirport,
  activePayung,
  effectiveAircrafts,
  allAircraftsCount,
  selectedStand,
  setSelectedStand,
  selectedAircraftId,
  setSelectedAircraftId,
  landingDate,
  setLandingDate,
  landingTime,
  setLandingTime,
  purpose,
  setPurpose,
  notes,
  setNotes,
  isSubmitting,
  submittedSchedule,
  onCancelSelection,
  onResetSubmittedSchedule,
  onSubmitLandingPlan
}) => {
  return (
    <div id="landing-schedule-panel" className="bg-white shadow-xs border-t-[3px] border-[#3c8dbc] flex flex-col">
      {/* Header Panel */}
      <div className="px-4 py-3 border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-50 text-[#3c8dbc] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Detail, Kapasitas &amp; Rencana Pendaratan: {selectedAirport.nama_bandara} ({selectedAirport.kode_bandara})
            </h2>
          </div>
        </div>

        <button
          onClick={onCancelSelection}
          className="text-xs text-slate-500 hover:text-red-600 underline font-medium cursor-pointer"
        >
          Batalkan Pilihan
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {submittedSchedule ? (
          /* KONDISI: RENCANA PENDARATAN BERHASIL DIDRAFTKAN */
          <div className="bg-emerald-50/70 border border-emerald-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-950">
                    Rencana Pendaratan Berhasil Didaftarkan
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Armada Anda telah dialokasikan slot pendaratan di {submittedSchedule.airportName}.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs">
                Slot Terdaftar: {submittedSchedule.slotNumber}
              </span>
            </div>

            {/* Ringkasan Tiket Jadwal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Mini Airport Tujuan</span>
                <strong className="text-slate-900 mt-1 block">{submittedSchedule.airportName}</strong>
                <span className="text-[11px] text-[#3c8dbc] font-mono font-bold mt-0.5 block">{submittedSchedule.airportCode}</span>
              </div>

              <div className="p-3 bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Armada Pesawat</span>
                <strong className="text-slate-900 font-mono mt-1 block">{submittedSchedule.registrationNumber}</strong>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{submittedSchedule.aircraftType}</span>
              </div>

              <div className="p-3 bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimasi Waktu Mendarat</span>
                <strong className="text-slate-900 mt-1 block">
                  {dayjs(submittedSchedule.landingDate).format('DD MMMM YYYY')}
                </strong>
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                  Pukul {submittedSchedule.landingTime} WIT
                </span>
              </div>

              <div className="p-3 bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dasar Legalitas PKS</span>
                <strong className="text-slate-900 font-mono mt-1 block">{activePayung?.contract_number}</strong>
                <span className="text-[11px] text-[#00a65a] font-semibold mt-0.5 block">Kontrak Payung Aktif</span>
              </div>
            </div>

            {submittedSchedule.notes && (
              <div className="p-2.5 bg-white border border-emerald-100 text-xs text-slate-600">
                <span className="font-bold text-slate-700">Catatan Operasional:</span> {submittedSchedule.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onResetSubmittedSchedule}
                className="px-4 py-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ubah Jadwal Pendaratan</span>
              </button>
            </div>
          </div>
        ) : (
          /* FORM SELEKSI ARMADA, KAPASITAS & JADWAL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Kolom Kiri: Detail & Kapasitas Mini Airport (Flat 2 Armada) */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-50/80 border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Mini Airport Terpilih
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                    {selectedAirport.nama_bandara}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedAirport.lokasi || 'Papua Tengah'}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#3c8dbc] text-white font-mono font-bold text-xs shadow-2xs">
                  {selectedAirport.kode_bandara}
                </span>
              </div>

              {/* Kapasitas Flat 2 Armada (Interaktif) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#3c8dbc]" />
                    Kapasitas Apron Mini Airport
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-[#3c8dbc] border border-blue-200">
                    Flat 2 Armada
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Slot 1 */}
                  <button
                    type="button"
                    onClick={() => setSelectedStand('STAND 01')}
                    className={`text-left p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedStand === 'STAND 01'
                        ? 'bg-blue-50/70 border-2 border-[#3c8dbc] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] font-bold text-slate-500">STAND 01</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <Plane className={`w-4 h-4 ${selectedStand === 'STAND 01' ? 'text-[#3c8dbc]' : 'text-emerald-600'}`} />
                      <span className="text-xs font-bold text-slate-800">
                        {selectedStand === 'STAND 01' ? 'Stand Terpilih' : 'Tersedia'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Parkir / Bongkar Muat</span>
                      {selectedStand === 'STAND 01' && (
                        <span className="text-[10px] font-bold text-[#3c8dbc] flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Dipilih
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Slot 2 */}
                  <button
                    type="button"
                    onClick={() => setSelectedStand('STAND 02')}
                    className={`text-left p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedStand === 'STAND 02'
                        ? 'bg-blue-50/70 border-2 border-[#3c8dbc] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] font-bold text-slate-500">STAND 02</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <Plane className={`w-4 h-4 ${selectedStand === 'STAND 02' ? 'text-[#3c8dbc]' : 'text-emerald-600'}`} />
                      <span className="text-xs font-bold text-slate-800">
                        {selectedStand === 'STAND 02' ? 'Stand Terpilih' : 'Tersedia'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Parkir / Bongkar Muat</span>
                      {selectedStand === 'STAND 02' && (
                        <span className="text-[10px] font-bold text-[#3c8dbc] flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Dipilih
                        </span>
                      )}
                    </div>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  * Klik slot stand di atas untuk menentukan posisi parkir armada Anda saat mendarat.
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Form Pemilihan Armada & Jadwal Mendarat */}
            <form onSubmit={onSubmitLandingPlan} className="lg:col-span-7 flex flex-col gap-3.5">
              <div className="bg-white border border-slate-200 p-4 space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  Formulir Rencana Pendaratan Armada
                </h3>

                {/* 1. Pilih Armada Pesawat (Hanya yang Tidak Terkait Permohonan Sewa / Tidak Sedang Digunakan) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      Pilih Armada Pesawat <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-[#00a65a] bg-emerald-50 px-2 py-0.5 border border-[#00a65a]/30">
                      {effectiveAircrafts.length} Armada Tersedia
                    </span>
                  </div>

                  {effectiveAircrafts.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Tidak Ada Armada yang Tersedia</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Seluruh armada Anda saat ini sedang terkait dengan <strong>permohonan sewa aktif</strong> di Bandara Mozes Kilangin atau sedang beroperasi di Hanggar/Apron. Armada yang sedang disewa tidak dapat dialokasikan untuk penerbangan ke Mini Airport.
                      </p>
                      <div className="pt-1">
                        <a
                          href="/tenant/aircraft"
                          className="inline-flex items-center gap-1 text-[11px] text-[#3c8dbc] hover:underline font-semibold"
                        >
                          <Plane className="w-3.5 h-3.5" />
                          <span>Kelola Data Armada Tenant &rarr;</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Interactive Aircraft Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1.5">
                        {effectiveAircrafts.map((ac) => {
                          const isAcSelected = selectedAircraftId === ac.id;
                          return (
                            <button
                              key={ac.id}
                              type="button"
                              onClick={() => setSelectedAircraftId(ac.id)}
                              className={`p-2.5 text-left border transition-all cursor-pointer flex items-center justify-between ${
                                isAcSelected
                                  ? 'bg-blue-50/70 border-2 border-[#3c8dbc] shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                                  isAcSelected ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  <Plane className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-mono font-bold text-xs text-slate-900 leading-tight">
                                    {ac.registration_number}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                                    {ac.aircraft_types?.jenis_pesawat || ac.custom_type_name || 'Pesawat Perintis'}
                                  </div>
                                </div>
                              </div>

                              <div className="flex-shrink-0 ml-2">
                                {isAcSelected ? (
                                  <span className="w-5 h-5 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center"></span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dropdown Fallback */}
                      <div className="sm:hidden mt-1.5">
                        <select
                          value={selectedAircraftId || ''}
                          onChange={(e) => setSelectedAircraftId(Number(e.target.value))}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                        >
                          <option value="" disabled>-- Pilih Armada Tersedia --</option>
                          {effectiveAircrafts.map((ac) => (
                            <option key={ac.id} value={ac.id}>
                              {ac.registration_number} - {ac.aircraft_types?.jenis_pesawat || ac.custom_type_name || 'Pesawat Perintis'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Keterangan penyaringan armada yang terikat sewa */}
                      {allAircraftsCount > effectiveAircrafts.length && (
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#3c8dbc] flex-shrink-0" />
                          <span>
                            Hanya menampilkan armada yang siap terbang. ({allAircraftsCount - effectiveAircrafts.length} armada tidak ditampilkan karena terkait permohonan sewa aktif / fasilitas pangkalan).
                          </span>
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* 2. Tanggal & Jam Mendarat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
                        Tanggal Mendarat <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setLandingDate(dayjs().format('YYYY-MM-DD'))}
                          className={`text-[10px] px-1.5 py-0.5 border cursor-pointer ${
                            landingDate === dayjs().format('YYYY-MM-DD')
                              ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Hari Ini
                        </button>
                        <button
                          type="button"
                          onClick={() => setLandingDate(dayjs().add(1, 'day').format('YYYY-MM-DD'))}
                          className={`text-[10px] px-1.5 py-0.5 border cursor-pointer ${
                            landingDate === dayjs().add(1, 'day').format('YYYY-MM-DD')
                              ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Besok
                        </button>
                        <button
                          type="button"
                          onClick={() => setLandingDate(dayjs().add(2, 'day').format('YYYY-MM-DD'))}
                          className={`text-[10px] px-1.5 py-0.5 border cursor-pointer ${
                            landingDate === dayjs().add(2, 'day').format('YYYY-MM-DD')
                              ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Lusa
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={landingDate}
                      min={dayjs().format('YYYY-MM-DD')}
                      onChange={(e) => setLandingDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#3c8dbc]" />
                        Jam Mendarat (WIT) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        {['07:30', '09:00', '11:00', '13:00'].map((quickTime) => (
                          <button
                            key={quickTime}
                            type="button"
                            onClick={() => setLandingTime(quickTime)}
                            className={`text-[10px] px-1.5 py-0.5 border cursor-pointer ${
                              landingTime === quickTime
                                ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {quickTime}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="time"
                      value={landingTime}
                      onChange={(e) => setLandingTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                    />
                  </div>
                </div>

                {/* 3. Keperluan Operasional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keperluan Penerbangan
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="Penerbangan Perintis & Logistik">Penerbangan Perintis &amp; Logistik</option>
                    <option value="Distribusi Sembako & Kargo Pedalaman">Distribusi Sembako &amp; Kargo Pedalaman</option>
                    <option value="Penerbangan Medevac / Evakuasi Medis">Penerbangan Medevac / Evakuasi Medis</option>
                    <option value="Charter Penumpang & Mobilitas Warga">Charter Penumpang &amp; Mobilitas Warga</option>
                  </select>
                </div>

                {/* 4. Catatan Operasional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Operasional / Manifes Ringkas (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rute Mozes Kilangin -> Ilaga, kargo logistik 800 kg"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                {/* Ringkasan Konfirmasi Live Preview */}
                <div className="p-3 bg-blue-50/50 border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#3c8dbc]">Ringkasan:</span>
                    <span className="px-2 py-0.5 bg-white border border-blue-200 font-bold text-slate-800">
                      {selectedAirport.nama_bandara} ({selectedAirport.kode_bandara})
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-blue-200 font-mono font-bold text-[#3c8dbc]">
                      {selectedStand}
                    </span>
                    {effectiveAircrafts.length > 0 ? (
                      <span className="px-2 py-0.5 bg-white border border-blue-200 font-mono font-bold text-slate-800">
                        {effectiveAircrafts.find(a => a.id === selectedAircraftId)?.registration_number || 'Pilih Armada'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-300 font-bold text-amber-800">
                        Belum Ada Armada Tersedia
                      </span>
                    )}
                    <span className="text-slate-600">
                      • {dayjs(landingDate).format('DD MMM YYYY')}, pukul {landingTime} WIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Konfirmasi */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelSelection}
                  className="px-4 py-2 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || effectiveAircrafts.length === 0}
                  className="px-5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mendaftarkan...</span>
                    </>
                  ) : effectiveAircrafts.length === 0 ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Armada Tidak Tersedia</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Konfirmasi Rencana Pendaratan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
