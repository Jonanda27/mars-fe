import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

interface GeneratePenaltyModalProps {
  readonly isOpen: boolean;
  readonly targetInvoice: Invoice | null;
  readonly penaltyRate: number;
  readonly setPenaltyRate: (val: number) => void;
  readonly penaltyNotes: string;
  readonly setPenaltyNotes: (val: string) => void;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => Promise<void>;
}

export const GeneratePenaltyModal: React.FC<GeneratePenaltyModalProps> = ({
  isOpen,
  targetInvoice,
  penaltyRate,
  setPenaltyRate,
  penaltyNotes,
  setPenaltyNotes,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !targetInvoice) return null;

  const calcPenaltyPreview = (inv: Invoice | null, ratePct: number) => {
    if (!inv || !inv.due_date) return { days: 0, months: 1, penaltyAmount: 0 };
    const due = new Date(inv.due_date);
    const now = new Date();
    const diffMs = now.getTime() - due.getTime();
    const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const months = Math.max(1, Math.ceil(days / 30));
    const principal = Number(inv.amount || 0);
    const penaltyAmount = Math.round(principal * (ratePct / 100) * months);
    return { days, months, penaltyAmount };
  };

  const preview = calcPenaltyPreview(targetInvoice, penaltyRate);

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-amber-200 bg-amber-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Penerbitan SKRD Denda Keterlambatan</h2>
              <p className="text-xs text-slate-500">Sesuai Perda: Sanksi Administratif Bunga 1% per Bulan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Rincian SKRD Pokok */}
          <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-700 border-b pb-1">Referensi SKRD Pokok:</div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor SKRD:</span>
              <span className="font-bold text-slate-900">{targetInvoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wajib Retribusi:</span>
              <span className="font-bold text-slate-900">{targetInvoice.tenants?.nama_perusahaan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pokok Tertunggak:</span>
              <span className="font-bold text-slate-900">{formatRupiah(Number(targetInvoice.amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jatuh Tempo SKRD Pokok:</span>
              <span className="font-bold text-red-600">{targetInvoice.due_date ? dayjs(targetInvoice.due_date).format('DD MMMM YYYY') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Durasi Keterlambatan:</span>
              <span className="font-bold text-red-600">{preview.days} Hari (~{preview.months} Bulan)</span>
            </div>
          </div>

          {/* Form Input Denda */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tarif Sanksi Denda (% per bulan)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={penaltyRate}
              onChange={(e) => setPenaltyRate(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">Standar regulasi retribusi daerah: 1.0% per bulan kalender.</p>
          </div>

          {/* Estimasi Nominal Denda */}
          <div className="p-3 bg-red-50 border border-red-200 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-red-800">Total Nilai SKRD Denda (4.1.4.01.01):</div>
              <div className="text-[11px] text-red-600">Rumus: Pokok x {penaltyRate}% x {preview.months} Bulan</div>
            </div>
            <div className="text-xl font-bold font-mono text-red-700">
              {formatRupiah(preview.penaltyAmount)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Dasar Penetapan / Keterangan
            </label>
            <textarea
              rows={3}
              value={penaltyNotes}
              onChange={(e) => setPenaltyNotes(e.target.value)}
              placeholder="Masukkan catatan dasar penetapan SKRD denda..."
              className="w-full border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs cursor-pointer"
          >
            Batal
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            Terbitkan SKRD Denda
          </button>
        </div>
      </div>
    </div>
  );
};
