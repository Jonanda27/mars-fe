import React from 'react';
import { 
  Plane, Clock, Calendar, Info, Check, Loader2, CheckCircle2 
} from 'lucide-react';
import { Aircraft } from '@/types/aircraft';
import { Contract } from '@/types/contract';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface CreateScheduleModalProps {
  readonly isOpen: boolean;
  readonly activePayung: Contract | null;
  readonly locationName: string;
  readonly serviceStartDate: string | null;
  readonly serviceEndDate: string | null;
  readonly allowedAircrafts: Aircraft[];
  readonly selectedAircraft: Aircraft | null;
  readonly selectedAircraftId: string;
  readonly setSelectedAircraftId: (id: string) => void;
  readonly arrivalDate: string;
  readonly setArrivalDate: (date: string) => void;
  readonly arrivalTime: string;
  readonly setArrivalTime: (time: string) => void;
  readonly leaseMinDate: string;
  readonly leaseMaxDate: string;
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
  serviceStartDate,
  serviceEndDate,
  allowedAircrafts,
  selectedAircraft,
  selectedAircraftId,
  setSelectedAircraftId,
  arrivalDate,
  setArrivalDate,
  arrivalTime,
  setArrivalTime,
  leaseMinDate,
  leaseMaxDate,
  notes,
  setNotes,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !activePayung) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="bg-slate-800 text-white px-5 py-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#3c8dbc]" />
              Pengajuan Jadwal Masuk Hanggar
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Lokasi: <strong className="text-white">{locationName}</strong>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* 1. INFO PERIODE SEWA HANGGAR */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center justify-between gap-2 text-[11px] text-blue-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#3c8dbc] flex-shrink-0" />
              <span>
                Periode Sewa Aktif: <strong>{dayjs(serviceStartDate).format('DD MMM YYYY')}</strong> s/d <strong>{dayjs(serviceEndDate).format('DD MMM YYYY')}</strong>
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-200/60 text-blue-800 text-[10px] font-bold rounded">
              {activePayung.contract_number}
            </span>
          </div>

          {/* 2. PILIH ARMADA PESAWAT */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Pilih Armada Pesawat <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500">
                {allowedAircrafts.length} armada terdaftar
              </span>
            </div>

            {allowedAircrafts.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs">
                Tidak ditemukan data armada pesawat pada akun maskapai Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allowedAircrafts.map((aircraft) => {
                  const isSelected = selectedAircraft?.id === aircraft.id;
                  const areaM2 = aircraft.aircraft_types?.luas_efektif_m2 || '800';
                  const mtowKg = aircraft.mtow ? Number(aircraft.mtow).toLocaleString('id-ID') : '-';

                  return (
                    <button
                      type="button"
                      key={aircraft.id}
                      onClick={() => setSelectedAircraftId(String(aircraft.id))}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#3c8dbc] bg-blue-50/60 shadow-xs ring-1 ring-[#3c8dbc]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {aircraft.registration_number}
                          </span>
                          {isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300"></span>
                          )}
                        </div>

                        <div className="text-[11px] font-semibold text-slate-600 mb-2">
                          {aircraft.aircraft_types?.jenis_pesawat || 'Standar'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                        <span>Luas: <strong>{areaM2} m²</strong></span>
                        <span>MTOW: <strong>{mtowKg} kg</strong></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. WAKTU RENCANA MASUK HANGGAR (2-KOLOM TANGGAL & JAM) */}
          {selectedAircraft && (
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  Waktu Rencana Masuk Hanggar
                </span>
                <span className="text-[10px] font-mono font-bold text-[#3c8dbc] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {selectedAircraft.registration_number}
                </span>
              </div>

              {/* 2-Column Grid Tanggal & Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Tanggal Kedatangan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    min={leaseMinDate}
                    max={leaseMaxDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setArrivalDate('');
                        return;
                      }
                      if (leaseMaxDate && val > leaseMaxDate) {
                        toast.error(`Tanggal tidak boleh melebihi akhir sewa (${dayjs(serviceEndDate).format('DD/MM/YYYY')})`);
                        setArrivalDate(leaseMaxDate);
                        return;
                      }
                      if (leaseMinDate && val < leaseMinDate) {
                        toast.error(`Tanggal tidak boleh sebelum mulai sewa (${dayjs(serviceStartDate).format('DD/MM/YYYY')})`);
                        setArrivalDate(leaseMinDate);
                        return;
                      }
                      setArrivalDate(val);
                    }}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Jam / Waktu (WITA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white font-medium text-slate-800"
                  />
                </div>
              </div>

              {serviceStartDate && serviceEndDate && (
                <div className="text-[10px] text-slate-400">
                  Batas Rentang Sewa: {dayjs(serviceStartDate).format('DD/MM/YYYY')} s/d {dayjs(serviceEndDate).format('DD/MM/YYYY')}
                </div>
              )}
            </div>
          )}

          {/* 4. CATATAN TAMBAHAN */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Keterangan penanganan teknis, ground handling, atau posisi parkir khusus..."
              rows={2}
              className="w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-700"
            />
          </div>

          {/* Footer Modal */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 rounded font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAircraft}
              className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengirim Jadwal...
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
