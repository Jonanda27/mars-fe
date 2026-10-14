import React, { useState } from 'react';
import { LogIn, X, Loader2, Plane, Building2, MapPin, Calendar } from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import dayjs from 'dayjs';

interface ConfirmArrivalModalProps {
  readonly isOpen: boolean;
  readonly schedule: FlightSchedule | null;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (schedule: FlightSchedule, notes: string) => void;
}

export const ConfirmArrivalModal: React.FC<ConfirmArrivalModalProps> = ({
  isOpen,
  schedule,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  const [arrivalNotes, setArrivalNotes] = useState('');

  if (!isOpen || !schedule) return null;

  const handleConfirm = () => {
    onConfirm(schedule, arrivalNotes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="bg-[#00a65a] text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Konfirmasi Kedatangan Armada
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-white hover:text-slate-200 cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 text-xs text-slate-700 space-y-3.5">
          {/* Card Info Penerbangan */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700">Registrasi Pesawat</span>
                <p className="font-bold text-base font-mono text-emerald-950 flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-emerald-700" />
                  {schedule.registration_number}
                </p>
                <p className="text-[11px] text-emerald-800">{schedule.aircraft_type || 'Pesawat Standar'}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-700">No. Jadwal</span>
                <p className="font-mono font-bold text-emerald-900 text-xs">{schedule.schedule_number}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Tenant / Operator:
                </span>
                <strong className="text-slate-900 block truncate">
                  {schedule.tenant?.nama_perusahaan || '-'}
                </strong>
              </div>

              <div>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Alokasi Lokasi:
                </span>
                <strong className="text-slate-900 block">
                  {schedule.parking_location || 'Hanggar'}
                </strong>
              </div>
            </div>

            {schedule.estimated_arrival && (
              <div className="pt-1.5 border-t border-emerald-200/80 text-[10px] text-emerald-800 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Rencana Tiba: <strong>{dayjs(schedule.estimated_arrival).format('HH:mm [WIT] (DD MMM YYYY)')}</strong></span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Konfirmasi bahwa pesawat fisik telah mendarat dan memasuki fasilitas. Status jadwal akan otomatis berubah menjadi <strong>Checked-In</strong>.
          </p>

          {/* Form Catatan Tambahan (Opsional) */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1 text-[11px]">
              Catatan Lapangan (Opsional)
            </label>
            <textarea
              placeholder="Contoh: Mendarat tepat waktu, posisi stand 02..."
              value={arrivalNotes}
              onChange={(e) => setArrivalNotes(e.target.value)}
              rows={2}
              disabled={isSubmitting}
              className="w-full p-2 border border-slate-300 focus:border-[#00a65a] focus:outline-none text-xs"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-1.5 border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Konfirmasi Mendarat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
