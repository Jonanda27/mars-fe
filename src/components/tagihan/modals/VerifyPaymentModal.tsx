import React from 'react';
import { X, CheckCircle2, FileText } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import { getFileUrl } from '@/utils/url';
import toast from 'react-hot-toast';

interface VerifyPaymentModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly isVerifying: boolean;
  readonly onClose: () => void;
  readonly onVerify: (id: number) => Promise<void>;
}

export const VerifyPaymentModal: React.FC<VerifyPaymentModalProps> = ({
  isOpen,
  invoice,
  isVerifying,
  onClose,
  onVerify,
}) => {
  if (!isOpen || !invoice) return null;

  const renderReceiptPreview = (receipt: string | null | undefined) => {
    if (!receipt) {
      return <div className="text-gray-500 italic">Tidak ada file terlampir</div>;
    }
    if (receipt.endsWith('.pdf')) {
      return (
        <a href={getFileUrl(receipt)} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold flex items-center">
          <FileText className="w-5 h-5 mr-2" /> Buka Dokumen PDF
        </a>
      );
    }
    return (
      <img 
        src={getFileUrl(receipt)} 
        alt="Bukti Bayar"
        className="max-w-full max-h-[400px] object-contain shadow-sm border border-gray-200"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Verifikasi Bukti Pembayaran</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex flex-col items-center flex-1 space-y-6">
          <div className="w-full grid grid-cols-2 gap-4 border p-4 bg-slate-50">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Nomor Tagihan</div>
              <div className="font-bold text-gray-800">{invoice.invoice_number}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Metode Pembayaran</div>
              <div className="font-bold text-gray-800">{invoice.payment_method || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Nama Tenant</div>
              <div className="font-bold text-gray-800">{invoice.tenants?.nama_perusahaan}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Jumlah Dibayar</div>
              <div className="font-bold text-orange-600 text-lg">
                {formatRupiah(Number(invoice.amount) + Number(invoice.penalty_amount || 0))}
              </div>
              {Number(invoice.penalty_amount) > 0 && (
                <div className="text-xs text-red-600 font-bold">Termasuk Denda: {formatRupiah(Number(invoice.penalty_amount))}</div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center border border-dashed border-gray-300 p-4 bg-gray-50">
            <h3 className="font-bold text-gray-700 mb-4">Lampiran Bukti Bayar:</h3>
            {renderReceiptPreview(invoice.payment_receipt)}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
          >
            Tutup
          </button>
          <button 
            onClick={() => toast('Fitur penolakan segera hadir')}
            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold cursor-pointer"
          >
            Tolak
          </button>
          <button 
            onClick={() => onVerify(invoice.id)}
            disabled={isVerifying}
            className="px-6 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold shadow disabled:opacity-70 flex items-center cursor-pointer"
          >
            {isVerifying ? 'Memproses...' : <><CheckCircle2 className="w-4 h-4 mr-2" /> Setujui (Lunas)</>}
          </button>
        </div>
      </div>
    </div>
  );
};
