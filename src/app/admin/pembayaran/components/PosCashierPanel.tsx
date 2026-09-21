import React from 'react';
import { 
  CreditCard, CheckCircle2, Printer, 
  Banknote, ArrowRightLeft, Loader2 
} from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';

interface PosCashierPanelProps {
  readonly selectedInvoice: Invoice | null;
  readonly paymentMethod: string;
  readonly setPaymentMethod: (method: string) => void;
  readonly uangDiterima: number | '';
  readonly setUangDiterima: (val: number | '') => void;
  readonly edcReference: string;
  readonly setEdcReference: (val: string) => void;
  readonly isPaid: boolean;
  readonly isProcessing: boolean;
  readonly onProcessPayment: () => void;
  readonly onResetTransaction: () => void;
}

export const PosCashierPanel: React.FC<PosCashierPanelProps> = ({
  selectedInvoice,
  paymentMethod,
  setPaymentMethod,
  uangDiterima,
  setUangDiterima,
  edcReference,
  setEdcReference,
  isPaid,
  isProcessing,
  onProcessPayment,
  onResetTransaction,
}) => {
  if (!selectedInvoice) {
    return (
      <div className="flex-1 lg:w-[40%]">
        <div className="h-full border-2 border-dashed border-[#d2d6de] flex flex-col items-center justify-center text-[#777] bg-slate-50 p-8 text-center min-h-[400px]">
          <Banknote className="w-16 h-16 mb-4 text-[#d2d6de]" />
          <p className="font-bold text-[15px] mb-1">Panel Kasir Belum Aktif</p>
          <p className="text-[13px]">
            Silakan cari data tagihan (SKRD) atau pilih dari daftar tagihan di sebelah kiri untuk memulai transaksi pembayaran loket.
          </p>
        </div>
      </div>
    );
  }

  const totalTagihan = Number(selectedInvoice.amount) + Number(selectedInvoice.penalty_amount || 0);
  const kembalian = paymentMethod === 'tunai' && uangDiterima !== '' 
    ? Number(uangDiterima) - totalTagihan 
    : 0;

  return (
    <div className="flex-1 lg:w-[40%]">
      <div className="bg-[#222d32] shadow-sm text-white sticky top-4">
        {/* Total Display */}
        <div className="p-4 border-b border-[#1a2226]">
          <h3 className="text-[14px] text-[#b8c7ce] font-bold uppercase tracking-wider text-center">
            Total Tagihan e-SKRD
          </h3>
          <div className="text-[32px] font-bold text-center text-[#00a65a] font-mono mt-1">
            {formatRupiah(totalTagihan)}
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-0.5 font-mono">
            {selectedInvoice.invoice_number}
          </p>
        </div>
        
        {!isPaid ? (
          <div className="p-6 flex flex-col gap-5">
            <div>
              <span className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">
                Metode Pembayaran
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('tunai')}
                  className={`py-3 border flex flex-col items-center justify-center font-bold text-[12px] transition-colors cursor-pointer ${
                    paymentMethod === 'tunai' 
                      ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white' 
                      : 'bg-[#1a2226] border-[#333] text-[#777] hover:border-[#3c8dbc]'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1" /> TUNAI
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('edc')}
                  className={`py-3 border flex flex-col items-center justify-center font-bold text-[12px] transition-colors cursor-pointer ${
                    paymentMethod === 'edc' 
                      ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white' 
                      : 'bg-[#1a2226] border-[#333] text-[#777] hover:border-[#3c8dbc]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" /> EDC / DEBIT
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`py-3 border flex flex-col items-center justify-center font-bold text-[12px] transition-colors cursor-pointer ${
                    paymentMethod === 'transfer' 
                      ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white' 
                      : 'bg-[#1a2226] border-[#333] text-[#777] hover:border-[#3c8dbc]'
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5 mb-1" /> BANK PAPUA
                </button>
              </div>
            </div>

            {paymentMethod === 'tunai' && (
              <div className="animate-in fade-in duration-200">
                <label htmlFor="uang-diterima-input" className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">
                  Uang Diterima (Rp)
                </label>
                <input 
                  id="uang-diterima-input"
                  type="number" 
                  value={uangDiterima}
                  onChange={(e) => setUangDiterima(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0" 
                  className="w-full p-3 bg-[#1a2226] border border-[#333] focus:border-[#00a65a] focus:outline-none font-mono text-[20px] font-bold text-white text-right" 
                />
                
                {uangDiterima !== '' && Number(uangDiterima) >= totalTagihan && (
                  <div className="mt-3 flex justify-between items-center text-[14px] bg-[#1a2226] p-3 border border-[#333]">
                    <span className="text-[#b8c7ce]">Kembalian:</span>
                    <span className="font-bold text-[#f39c12] font-mono text-[18px]">
                      {formatRupiah(kembalian)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {(paymentMethod === 'edc' || paymentMethod === 'transfer') && (
              <div className="animate-in fade-in duration-200">
                <label htmlFor="ref-input" className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">
                  {paymentMethod === 'edc' ? 'Nomor Referensi EDC / Kartu' : 'Nomor Bukti Transfer / STS Bank Papua'}
                </label>
                <input 
                  id="ref-input"
                  type="text" 
                  value={edcReference}
                  onChange={(e) => setEdcReference(e.target.value)}
                  placeholder={paymentMethod === 'edc' ? 'Contoh: 1234-5678-9012' : 'Contoh: STS-BP-2026-XXXX'} 
                  className="w-full p-3 bg-[#1a2226] border border-[#333] focus:border-[#3c8dbc] focus:outline-none font-mono text-[14px] font-bold text-white" 
                />
              </div>
            )}

            <button 
              type="button"
              disabled={isProcessing}
              onClick={onProcessPayment}
              className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold text-[16px] px-6 py-4 mt-2 transition-colors flex justify-center items-center cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses Transaksi...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Proses Pelunasan SKRD
                </>
              )}
            </button>
          </div>
        ) : (
          /* Transaksi Berhasil */
          <div className="p-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#00a65a] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-1">Transaksi Berhasil</h3>
            <p className="text-[#b8c7ce] text-[13px] mb-6 text-center">
              Tagihan <span className="font-mono font-bold text-white">{selectedInvoice.invoice_number}</span> telah dinyatakan <strong>LUNAS</strong> dan tercatat ke kasda.
            </p>
            
            <button 
              type="button"
              onClick={() => window.print()}
              className="w-full bg-[#f4f4f4] hover:bg-white text-[#333] font-bold text-[14px] px-6 py-3 transition-colors flex justify-center items-center shadow-sm cursor-pointer"
            >
              <Printer className="w-5 h-5 mr-2 text-[#444]" /> Cetak Kwitansi Fisik
            </button>
            <button 
              type="button"
              onClick={onResetTransaction}
              className="w-full bg-transparent border border-[#333] text-[#b8c7ce] hover:bg-[#1a2226] font-bold text-[14px] px-6 py-3 mt-3 transition-colors cursor-pointer"
            >
              Layani Transaksi Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
