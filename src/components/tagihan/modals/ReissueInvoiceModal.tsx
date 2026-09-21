import React from 'react';
import { X, FileEdit, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';

interface ReissueInvoiceModalProps {
  readonly isOpen: boolean;
  readonly targetInvoice: Invoice | null;
  readonly reissueAmount: number;
  readonly setReissueAmount: (val: number) => void;
  readonly reissueDueDate: string;
  readonly setReissueDueDate: (val: string) => void;
  readonly reissueReason: string;
  readonly setReissueReason: (val: string) => void;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => Promise<void>;
}

export const ReissueInvoiceModal: React.FC<ReissueInvoiceModalProps> = ({
  isOpen,
  targetInvoice,
  reissueAmount,
  setReissueAmount,
  reissueDueDate,
  setReissueDueDate,
  reissueReason,
  setReissueReason,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !targetInvoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-blue-200 bg-blue-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-[#3c8dbc]">
              <FileEdit className="w-5 h-5 text-[#3c8dbc]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Koreksi &amp; Terbitkan SKRD Pengganti</h2>
              <p className="text-xs text-slate-500">Membatalkan SKRD lama dan menerbitkan nomor SKRD baru otomatis</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-blue-50/50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
            <div>
              SKRD lama (<strong>{targetInvoice.invoice_number}</strong>) akan dibatalkan dengan status <em>Cancelled</em>, dan sistem akan menerbitkan SKRD Pengganti baru berawalan <strong>SKRD-KOR/..</strong> secara otomatis.
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor SKRD Lama:</span>
              <span className="font-bold text-slate-900">{targetInvoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wajib Retribusi:</span>
              <span className="font-bold text-slate-900">{targetInvoice.tenants?.nama_perusahaan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nominal Asli:</span>
              <span className="font-bold text-slate-900">{formatRupiah(Number(targetInvoice.amount))}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nominal Ketetapan Baru (Rp) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={reissueAmount}
              onChange={(e) => setReissueAmount(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 text-sm font-mono focus:border-[#3c8dbc] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Jatuh Tempo Baru <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={reissueDueDate}
              onChange={(e) => setReissueDueDate(e.target.value)}
              className="w-full border border-slate-300 p-2 text-xs focus:border-[#3c8dbc] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alasan Koreksi / Dasar Perubahan <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={reissueReason}
              onChange={(e) => setReissueReason(e.target.value)}
              placeholder="Contoh: Penyesuaian luasan / koreksi jumlah hari inap / revisi tarif perda..."
              className="w-full border border-slate-300 p-2 text-xs focus:border-[#3c8dbc] focus:outline-none"
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
            className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs shadow-xs disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Terbitkan SKRD Pengganti
          </button>
        </div>
      </div>
    </div>
  );
};
