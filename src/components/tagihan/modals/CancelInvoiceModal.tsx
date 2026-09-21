import React from 'react';
import { X, Ban, AlertCircle, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';

interface CancelInvoiceModalProps {
  readonly isOpen: boolean;
  readonly targetInvoice: Invoice | null;
  readonly cancelReason: string;
  readonly setCancelReason: (val: string) => void;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => Promise<void>;
}

export const CancelInvoiceModal: React.FC<CancelInvoiceModalProps> = ({
  isOpen,
  targetInvoice,
  cancelReason,
  setCancelReason,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !targetInvoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-red-200 bg-red-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 text-red-800">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Pembatalan / Koreksi SKRD</h2>
              <p className="text-xs text-slate-500">Membatalkan tagihan SKRD yang keliru atau digantikan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-red-50/50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              Tindakan ini akan mengubah status SKRD menjadi <strong className="uppercase">Cancelled</strong>. Tagihan tidak dapat diverifikasi/dibayar kembali setelah dibatalkan.
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor SKRD:</span>
              <span className="font-bold text-slate-900">{targetInvoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tenant:</span>
              <span className="font-bold text-slate-900">{targetInvoice.tenants?.nama_perusahaan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nominal:</span>
              <span className="font-bold text-slate-900">{formatRupiah(Number(targetInvoice.amount))}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alasan Pembatalan / Koreksi <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Contoh: Kesalahan perhitungan durasi inap / Dokumen revisi..."
              className="w-full border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
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
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
            Konfirmasi Batalkan SKRD
          </button>
        </div>
      </div>
    </div>
  );
};
