import React from 'react';
import { X, Banknote, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

interface UploadSTSModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly paymentMethod: string;
  readonly setPaymentMethod: (val: string) => void;
  readonly receiptFile: File | null;
  readonly setReceiptFile: (val: File | null) => void;
  readonly isPaying: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (e: React.SyntheticEvent) => Promise<void>;
}

export const UploadSTSModal: React.FC<UploadSTSModalProps> = ({
  isOpen,
  invoice,
  paymentMethod,
  setPaymentMethod,
  receiptFile,
  setReceiptFile,
  isPaying,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Upload Bukti Pembayaran SKRD
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-5 space-y-4 text-xs">
            <div className="bg-slate-50 p-3 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Nomor SKRD</div>
              <div className="font-mono font-bold text-slate-800 text-sm">{invoice.invoice_number}</div>
              
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-2">Jumlah Tagihan</div>
              <div className="text-lg font-black text-slate-900">
                {formatRupiah(Number(invoice.amount) + Number(invoice.penalty_amount || 0))}
              </div>
              {Number(invoice.penalty_amount) > 0 && (
                <div className="text-[11px] text-red-600 font-bold mt-0.5">
                  Termasuk Denda Keterlambatan: {formatRupiah(Number(invoice.penalty_amount))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="paymentMethodSelect" className="block font-bold text-slate-700 mb-1">
                Metode Pembayaran / Kas Daerah
              </label>
              <select 
                id="paymentMethodSelect"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-slate-300 p-2 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white"
                required
              >
                <option value="Transfer Bank Papua">Transfer Kas Daerah - Bank Papua</option>
                <option value="Transfer Bank Mandiri">Transfer Virtual Account - Bank Mandiri</option>
                <option value="Transfer Bank BRI">Transfer Virtual Account - Bank BRI</option>
                <option value="Setoran Tunai di Loket">Setoran Tunai di Loket Bendahara Penerima</option>
              </select>
            </div>

            <div>
              <label htmlFor="receiptFileInput" className="block font-bold text-slate-700 mb-1">
                Upload Bukti Setoran (Maks 2MB, PDF / JPG / PNG)
              </label>
              <input 
                id="receiptFileInput"
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('Ukuran file melebihi 2MB! Silakan unggah file yang lebih kecil.');
                      e.target.value = '';
                      setReceiptFile(null);
                      return;
                    }
                    
                    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                    if (!allowedTypes.includes(file.type)) {
                      toast.error('Hanya file PDF, JPG, atau PNG yang diperbolehkan!');
                      e.target.value = '';
                      setReceiptFile(null);
                      return;
                    }
                    setReceiptFile(file);
                  } else {
                    setReceiptFile(null);
                  }
                }}
                className="w-full border border-slate-300 p-2 text-xs"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Pastikan nominal transfer dan nomor rekening tujuan terbaca jelas.</p>
            </div>
          </div>

          <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isPaying || !receiptFile}
              className="px-5 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-xs font-bold text-white disabled:opacity-70 flex items-center gap-1.5 cursor-pointer"
            >
              {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Banknote className="w-3.5 h-3.5" />}
              Kirim Bukti Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
