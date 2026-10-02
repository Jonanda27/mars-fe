import React, { useState, useMemo } from 'react';
import { 
  Plane, Clock, Calendar, Info, Check, Loader2, CheckCircle2, FileText, Search,
  AlertCircle, AlertTriangle, Lock
} from 'lucide-react';
import { Aircraft } from '@/types/aircraft';
import { Contract } from '@/types/contract';
import { RentalApplication } from '@/types/rental';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export interface AircraftWithBooking extends Aircraft {
  bookingApp?: RentalApplication | null;
  bookingNumber?: string;
  bookingPeriodStr?: string;
  bookingMinDate?: string;
  bookingMaxDate?: string;
  isLocked?: boolean;
  lockReason?: string;
  lockBadge?: string;
}

interface CreateScheduleModalProps {
  readonly isOpen: boolean;
  readonly activePayung: Contract | null;
  readonly locationName: string;
  readonly allowedAircrafts: AircraftWithBooking[];
  readonly selectedAircraft: AircraftWithBooking | null;
  readonly selectedAircraftId: string;
  readonly setSelectedAircraftId: (id: string) => void;
  readonly arrivalDate: string;
  readonly setArrivalDate: (date: string) => void;
  readonly arrivalTime: string;
  readonly setArrivalTime: (time: string) => void;
  readonly notes: string;
  readonly setNotes: (val: string) => void;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  activePayung,
  locationName,
  allowedAircrafts,
  selectedAircraft,
  selectedAircraftId,
  setSelectedAircraftId,
  arrivalDate,
  setArrivalDate,
  arrivalTime,
  setArrivalTime,
  notes,
  setNotes,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter pencarian armada jika pesawat banyak
  const filteredAircrafts = useMemo(() => {
    if (!searchQuery.trim()) return allowedAircrafts;
    const q = searchQuery.toLowerCase();
    return allowedAircrafts.filter(a => 
      a.registration_number.toLowerCase().includes(q) ||
      (a.aircraft_types?.jenis_pesawat || '').toLowerCase().includes(q) ||
      (a.bookingNumber || '').toLowerCase().includes(q)
    );
  }, [allowedAircrafts, searchQuery]);

  if (!isOpen || !activePayung) return null;

  const minDate = selectedAircraft?.bookingMinDate || '';
  const maxDate = selectedAircraft?.bookingMaxDate || '';
  const activeBooking = selectedAircraft?.bookingApp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-none shadow-2xl max-w-xl w-full overflow-hidden border border-slate-300 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center rounded-none">
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Plane className="w-4 h-4 text-white" />
              Pengajuan Jadwal Masuk Hanggar
            </h3>
            <p className="text-[11px] text-white/90 mt-0.5">
              Lokasi: <strong className="text-white">{locationName}</strong>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-none bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs text-slate-700 max-h-[82vh] overflow-y-auto">
          {/* 1. INFO STATUS PKS PAYUNG */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-none p-2.5 flex items-center justify-between gap-2 text-[11px] text-blue-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#3c8dbc] flex-shrink-0" />
              <span>
                Kontrak Payung Induk: <strong>{activePayung.contract_number}</strong>
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 text-[#3c8dbc] text-[10px] font-bold rounded border border-blue-200">
              PKS Aktif
            </span>
          </div>

          {/* 2. PILIH ARMADA PESAWAT (ADAPTIVE: GRID UNTUK <= 2, COMPACT LIST DENGAN SEARCH UNTUK > 2) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Pilih Armada Pesawat <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                {allowedAircrafts.length} armada terdaftar
              </span>
            </div>

            {/* Kolom Pencarian Cepat jika armada lebih dari 3 */}
            {allowedAircrafts.length > 3 && (
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari registrasi / tipe pesawat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-none text-xs bg-white focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc]"
                />
              </div>
            )}

            {filteredAircrafts.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-none text-amber-800 text-xs">
                Tidak ditemukan armada yang sesuai dengan pencarian.
              </div>
            ) : allowedAircrafts.length <= 2 ? (
              /* Mode 1: Side-by-Side Cards (jika armada 1 - 2) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredAircrafts.map((aircraft) => {
                  const isSelected = selectedAircraft?.id === aircraft.id;
                  const isLocked = aircraft.isLocked;
                  const areaM2 = aircraft.aircraft_types?.luas_efektif_m2 || '800';
                  const mtowKg = aircraft.mtow ? Number(aircraft.mtow).toLocaleString('id-ID') : '-';

                  return (
                    <button
                      type="button"
                      key={aircraft.id}
                      onClick={() => setSelectedAircraftId(String(aircraft.id))}
                      className={`p-3 rounded-none border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? isLocked 
                            ? 'border-amber-400 bg-amber-50/80 shadow-xs ring-1 ring-amber-400' 
                            : 'border-[#3c8dbc] bg-blue-50/70 shadow-xs ring-1 ring-[#3c8dbc]'
                          : isLocked
                            ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            {aircraft.registration_number}
                            {isLocked && (
                              <span className="w-2 h-2 rounded-full bg-amber-500" title="Terkunci"></span>
                            )}
                          </span>
                          {isSelected ? (
                            <span className={`w-4 h-4 rounded-none text-white flex items-center justify-center ${isLocked ? 'bg-amber-600' : 'bg-[#3c8dbc]'}`}>
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-none border border-slate-300"></span>
                          )}
                        </div>

                        <div className="text-[11px] font-semibold text-slate-600 mb-1">
                          {aircraft.aircraft_types?.jenis_pesawat || 'Standar'}
                        </div>

                        {/* Indikator Status Kunci Armada */}
                        {isLocked ? (
                          <div className="bg-amber-100/80 border border-amber-300 px-2 py-1 my-1.5 rounded-none text-[10px] text-amber-900">
                            <div className="font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-amber-700" />
                              {aircraft.lockBadge || 'Terkunci'}
                            </div>
                            <div className="text-[9px] text-amber-800 mt-0.5 line-clamp-2">
                              {aircraft.lockReason}
                            </div>
                          </div>
                        ) : aircraft.bookingApp ? (
                          <div className="bg-white border border-blue-200/80 px-2 py-1 my-1.5 rounded-none text-[10px]">
                            <div className="font-mono font-bold text-[#3c8dbc] flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5" />
                              {aircraft.bookingApp.application_number}
                            </div>
                            <div className="text-slate-600 font-medium text-[9px] mt-0.5">
                              {dayjs(aircraft.bookingApp.start_date).format('DD MMM')} – {dayjs(aircraft.bookingApp.end_date).format('DD MMM YYYY')}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                        <span>Luas: <strong>{areaM2} m²</strong></span>
                        <span>MTOW: <strong>{mtowKg} kg</strong></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Mode 2: Compact Scrollable List (jika armada > 2) */
              <div className="border border-slate-200 bg-slate-50 p-2 max-h-48 overflow-y-auto space-y-1.5 rounded-none">
                {filteredAircrafts.map((aircraft) => {
                  const isSelected = selectedAircraft?.id === aircraft.id;
                  const isLocked = aircraft.isLocked;

                  return (
                    <button
                      type="button"
                      key={aircraft.id}
                      onClick={() => setSelectedAircraftId(String(aircraft.id))}
                      className={`w-full p-2.5 rounded-none border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? isLocked
                            ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-400 shadow-xs'
                            : 'border-[#3c8dbc] bg-white ring-1 ring-[#3c8dbc] shadow-xs'
                          : isLocked
                            ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                            : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-none flex items-center justify-center border ${
                          isSelected 
                            ? isLocked ? 'bg-amber-600 border-amber-600 text-white' : 'bg-[#3c8dbc] border-[#3c8dbc] text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-2">
                            {aircraft.registration_number}
                            <span className="font-sans font-normal text-slate-500 text-[11px]">
                              {aircraft.aircraft_types?.jenis_pesawat}
                            </span>
                            {isLocked && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded border border-amber-300 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> {aircraft.lockBadge}
                              </span>
                            )}
                          </div>
                          {aircraft.bookingApp && (
                            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                              Tiket: <span className="font-bold text-[#3c8dbc]">{aircraft.bookingApp.application_number}</span> ({dayjs(aircraft.bookingApp.start_date).format('DD/MM')} - {dayjs(aircraft.bookingApp.end_date).format('DD/MM/YYYY')})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-[10px] text-slate-500">
                        <div>{aircraft.aircraft_types?.luas_efektif_m2 || '800'} m²</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ALERT BANNER JIKA ARMADA TERPILIH SEDANG TERKUNCI (BELUM CHECK-OUT) */}
            {selectedAircraft?.isLocked && (
              <div className="mt-2.5 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs rounded-none flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block font-bold">Armada Tidak Dapat Diajukan:</strong>
                  Pesawat <strong>{selectedAircraft.registration_number}</strong> {selectedAircraft.lockReason}. Pengajuan jadwal baru hanya dapat diajukan setelah armada menyelesaikan jadwal/kegiatan sebelumnya dan telah melakukan Check-Out dari bandara.
                </div>
              </div>
            )}
          </div>

          {/* 3. TANGGAL KEDATANGAN & JAM (OTOMATIS TERKUNCI DALAM MASA SEWA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-[11px] uppercase tracking-wider">
                Tanggal Estimasi Kedatangan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={arrivalDate}
                  min={minDate}
                  max={maxDate}
                  disabled={selectedAircraft?.isLocked}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
              {minDate && maxDate && (
                <p className="text-[10px] text-slate-500 mt-1">
                  Masa Sewa: <strong>{dayjs(minDate).format('DD/MM/YYYY')}</strong> s/d <strong>{dayjs(maxDate).format('DD/MM/YYYY')}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-[11px] uppercase tracking-wider">
                Jam Estimasi Kedatangan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={arrivalTime}
                  disabled={selectedAircraft?.isLocked}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Waktu Indonesia Timur (WIT)</p>
            </div>
          </div>

          {/* 4. CATATAN / KEBUTUHAN KHUSUS */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-[11px] uppercase tracking-wider">
              Catatan / Instruksi Khusus (Opsional)
            </label>
            <textarea
              value={notes}
              disabled={selectedAircraft?.isLocked}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Keterangan penanganan teknis, ground handling, atau posisi parkir khusus..."
              rows={2}
              className="w-full p-2.5 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          {/* Footer Modal */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 rounded-none font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAircraft || selectedAircraft?.isLocked}
              className={`px-4 py-2 font-bold rounded-none shadow-xs flex items-center gap-1.5 text-xs transition-colors ${
                selectedAircraft?.isLocked
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-[#3c8dbc] hover:bg-[#367fa9] text-white cursor-pointer disabled:opacity-60'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengirim Jadwal...
                </>
              ) : selectedAircraft?.isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Armada Belum Check-Out (Terkunci)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kirim Pengajuan Jadwal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
