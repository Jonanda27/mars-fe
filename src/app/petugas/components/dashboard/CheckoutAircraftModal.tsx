import React from 'react';
import { LogOut, X, Loader2 } from 'lucide-react';

interface CheckoutAircraftModalProps {
  readonly isOpen: boolean;
  readonly checkOutRegistration: string;
  readonly checkOutNotes: string;
  readonly setCheckOutNotes: (val: string) => void;
  readonly isCheckingOut: number | null;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
}

export const CheckoutAircraftModal: React.FC<CheckoutAircraftModalProps> = ({
  isOpen,
  checkOutRegistration,
  checkOutNotes,
  setCheckOutNotes,
  isCheckingOut,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-red-600 text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Konfirmasi Check-Out
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-white hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs text-slate-700 space-y-3.5">
          <div className="p-3 bg-red-50 border border-red-200 text-red-900">
            <p className="font-bold text-sm font-mono text-red-700">{checkOutRegistration}</p>
            <p className="text-[11px] mt-0.5">Konfirmasi pesawat fisik telah meninggalkan hanggar/apron.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Catatan Check-Out (Opsional)
            </label>
            <textarea
              placeholder="Keterangan keberangkatan..."
              value={checkOutNotes}
              onChange={(e) => setCheckOutNotes(e.target.value)}
              rows={2}
              className="w-full p-2 border border-slate-300 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isCheckingOut !== null}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-60"
            >
              {isCheckingOut !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              Konfirmasi Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
