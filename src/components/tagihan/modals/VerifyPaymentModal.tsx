import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, AlertTriangle, ShieldAlert, ScanText, ZoomIn, ExternalLink } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { formatRupiah } from '@/utils/formatCurrency';
import { getFileUrl } from '@/utils/url';
import toast from 'react-hot-toast';

interface VerifyPaymentModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly isVerifying: boolean;
  readonly onClose: () => void;
  readonly onVerify: (id: number, payload?: { amount_paid?: number; notes?: string }) => Promise<void>;
  readonly onReject?: (id: number, reason: string) => Promise<void>;
  readonly onScanSuccess?: () => void;
}

export const VerifyPaymentModal: React.FC<VerifyPaymentModalProps> = ({
  isOpen,
  invoice,
  isVerifying,
  onClose,
  onVerify,
  onReject,
  onScanSuccess,
}) => {
  const [internalInvoice, setInternalInvoice] = useState<Invoice | null>(invoice);
  const [amountPaid, setAmountPaid] = useState<number | string>('');
  const [verificationNotes, setVerificationNotes] = useState<string>('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const currentInv = internalInvoice || invoice;

  useEffect(() => {
    setInternalInvoice(invoice);
    if (invoice) {
      const pokok = Number(invoice.amount || 0);
      const denda = Number(invoice.penalty_amount || 0);
      const paid = Number(invoice.paid_amount || 0);
      const totalDue = pokok + denda;
      const remainingDue = Math.max(0, totalDue - paid);

      const pendingPayment = invoice.invoice_payments?.find((p) => p.status === 'Pending') || invoice.invoice_payments?.[0];
      
      // Prioritaskan nominal hasil OCR jika ada
      const ocrAmount = pendingPayment?.ocr_data?.amount_detected && Number(pendingPayment.ocr_data.amount_detected) > 0
        ? Number(pendingPayment.ocr_data.amount_detected)
        : null;

      const defaultAmount = ocrAmount || (pendingPayment && Number(pendingPayment.amount) > 0 
        ? Number(pendingPayment.amount) 
        : remainingDue);

      setAmountPaid(defaultAmount);
      
      // Bersihkan catatan dari teks otomatis OCR agar input bendahara tetap bersih
      const rawNotes = pendingPayment?.notes || '';
      const isAutoNote = rawNotes.includes('[AI Vision]') || rawNotes.toLowerCase().includes('transaksi berhasil');
      setVerificationNotes(isAutoNote ? '' : rawNotes);
      setShowRejectForm(false);
      setRejectReason('');
      setIsImageEnlarged(false);
    }
  }, [invoice]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageEnlarged) {
        setIsImageEnlarged(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageEnlarged]);

  if (!isOpen || !currentInv) return null;

  const pokok = Number(currentInv.amount || 0);
  const denda = Number(currentInv.penalty_amount || 0);
  const alreadyPaid = Number(currentInv.paid_amount || 0);
  const totalObligation = pokok + denda;
  const currentRemaining = Math.max(0, totalObligation - alreadyPaid);

  const pendingPayment = currentInv.invoice_payments?.find((p) => p.status === 'Pending') || currentInv.invoice_payments?.[0];
  const ocrData = pendingPayment?.ocr_data;

  const numAmountToVerify = Number(amountPaid) || 0;
  const remainingAfterPayment = Math.max(0, currentRemaining - numAmountToVerify);
  const isPartial = remainingAfterPayment > 0;

  const renderReceiptPreview = (receipt: string | null | undefined) => {
    if (!receipt) {
      return <div className="text-gray-500 italic">Tidak ada file bukti transfer terlampir</div>;
    }
    if (receipt.endsWith('.pdf')) {
      return (
        <a 
          href={getFileUrl(receipt)} 
          target="_blank" 
          rel="noreferrer" 
          className="text-blue-600 hover:text-blue-700 underline font-bold flex items-center p-3 bg-white border border-blue-200 hover:bg-blue-50/50 transition-colors"
        >
          <FileText className="w-5 h-5 mr-2 text-blue-600" /> Buka Lampiran Dokumen Bukti Setor (PDF)
        </a>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={() => setIsImageEnlarged(true)}
          className="relative group cursor-zoom-in border border-gray-300 bg-white shadow-xs overflow-hidden rounded transition-all hover:border-[#3c8dbc] hover:shadow-md max-w-full"
          title="Klik untuk memperbesar bukti bayar"
        >
          <img 
            src={getFileUrl(receipt)} 
            alt="Bukti Bayar"
            className="max-w-full max-h-[350px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[1px]">
            <ZoomIn className="w-4 h-4 text-white" />
            <span>Klik untuk Memperbesar</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => setIsImageEnlarged(true)}
            className="text-[#3c8dbc] hover:text-[#357ca5] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" /> Perbesar Tampilan
          </button>
          <span>&bull;</span>
          <a
            href={getFileUrl(receipt)}
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Buka Tab Baru
          </a>
        </div>
      </div>
    );
  };

  const handleConfirmVerify = () => {
    if (numAmountToVerify <= 0) {
      toast.error('Nominal pembayaran yang diverifikasi harus lebih dari Rp 0!');
      return;
    }
    onVerify(currentInv.id, {
      amount_paid: numAmountToVerify,
      notes: verificationNotes || undefined
    });
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Mohon masukkan alasan penolakan bukti pembayaran!');
      return;
    }
    if (onReject) {
      onReject(currentInv.id, rejectReason.trim());
    } else {
      toast.error('Fungsi penolakan tidak tersedia');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Verifikasi &amp; Pembukuan Setoran Retribusi (STS)
            </h2>
            <p className="text-xs text-slate-500">
              Sesuai ketentuan Peraturan Bupati Mimika No. 25 Tahun 2024
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col flex-1 space-y-4 text-xs">
          
          {/* Summary Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 border p-3.5 bg-slate-50 border-slate-200">
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">No. Tagihan SKRD</div>
              <div className="font-bold font-mono text-gray-800 text-sm mt-0.5">{currentInv.invoice_number}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Wajib Retribusi</div>
              <div className="font-bold text-gray-800 truncate mt-0.5">{currentInv.tenants?.nama_perusahaan}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Total Kewajiban</div>
              <div className="font-bold text-slate-900 mt-0.5">{formatRupiah(totalObligation)}</div>
              {denda > 0 && <span className="text-[9.5px] text-red-600 block">(Termasuk Bunga: {formatRupiah(denda)})</span>}
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase">Telah Disetor Sebelumnya</div>
              <div className="font-bold text-emerald-700 mt-0.5">{formatRupiah(alreadyPaid)}</div>
            </div>
          </div>

          {/* KARTU HASIL PEMINDAIAN OCR */}
          {ocrData && (
            <div className="p-3.5 border border-blue-200 bg-blue-50/40 space-y-2.5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#3c8dbc] text-white rounded text-xs shadow-xs">
                    <ScanText className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Hasil OCR</span>
                  </div>
                </div>

                {ocrData.account_match ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] rounded-full flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rekening Tujuan Kasda Sesuai
                  </span>
                ) : ocrData.destination_account ? (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] rounded-full flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Rekening: {ocrData.destination_account}
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-3 border border-blue-100 text-[11px] shadow-2xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Nominal Terdeteksi</span>
                  <span className="font-bold font-mono text-blue-900 text-sm">
                    {ocrData.amount_detected ? formatRupiah(Number(ocrData.amount_detected)) : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Bank Pengirim</span>
                  <span className="font-semibold text-gray-800 block truncate">
                    {ocrData.sender_bank || '-'}
                  </span>
                  {ocrData.sender_name && (
                    <span className="text-[9.5px] text-gray-500 block truncate">{ocrData.sender_name}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">No. Referensi / TRX</span>
                  <span className="font-mono font-semibold text-gray-800 truncate block">
                    {ocrData.reference_number || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Status Bukti Struk</span>
                  <span className={`font-bold inline-block px-1.5 py-0.5 rounded text-[10px] ${
                    ocrData.transfer_status === 'BERHASIL'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ocrData.transfer_status || 'SELESAI'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {ocrData.amount_detected && Number(ocrData.amount_detected) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAmountPaid(Number(ocrData.amount_detected));
                      toast.success(`Nominal OCR (${formatRupiah(Number(ocrData.amount_detected))}) diterapkan`);
                    }}
                    className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold text-[11px] rounded shadow-xs cursor-pointer transition-colors"
                  >
                    Terapkan Nominal OCR ({formatRupiah(Number(ocrData.amount_detected))})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAmountPaid(currentRemaining);
                    toast.success(`Sisa tagihan penuh (${formatRupiah(currentRemaining)}) diterapkan`);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-[11px] rounded shadow-xs cursor-pointer transition-colors"
                >
                  Terapkan Sisa Penuh ({formatRupiah(currentRemaining)})
                </button>
              </div>
            </div>
          )}

          {/* Form Verifikasi Nominal */}
          <div className="p-4 border border-blue-200 bg-blue-50/40 space-y-3">
            <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
              <span>Nominal yang Disahkan pada Transaksi Ini:</span>
              <span className="text-[11px] text-slate-500">
                Sisa Tagihan Sebelum Transaksi: <strong>{formatRupiah(currentRemaining)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Jumlah Disetujui (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold font-mono text-xs select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={amountPaid !== '' && amountPaid !== null && amountPaid !== undefined 
                      ? Number(amountPaid).toLocaleString('id-ID') 
                      : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setAmountPaid(raw ? Number(raw) : '');
                    }}
                    placeholder="0"
                    className="w-full border border-slate-300 p-2 pl-9 text-sm font-bold font-mono text-slate-900 bg-white focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Catatan Pembukuan Bendahara <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Contoh: Sesuai rekening koran Kasda tgl 07/10..."
                  className="w-full border border-slate-300 p-2 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Status Dampak Perbup 25/2024 */}
            <div className={`p-2.5 border text-[11px] leading-relaxed flex items-start gap-2 ${
              isPartial 
                ? 'bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              {isPartial ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Status: Pembayaran Sebagian / Kurang Dibayar (STRD).</strong>
                    <br />
                    Sisa kewajiban terutang sebesar <strong>{formatRupiah(remainingAfterPayment)}</strong> tetap berada dalam fase STRD dan akan terus diakumulasi sanksi bunga 1%/bulan pada bulan berikutnya hingga lunas.
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Status: Pembayaran Lunas Penuh (Paid).</strong>
                    <br />
                    Seluruh kewajiban SKRD dan sanksi bunga STRD telah tuntas. Surat peringatan/STRD akan diubah menjadi <em>Resolved</em> dan status tenant dipulihkan.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Penolakan (Jika tombol Tolak ditekan) */}
          {showRejectForm && (
            <div className="p-3.5 border border-red-300 bg-red-50 space-y-2">
              <label className="font-bold text-red-900 block text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Alasan Penolakan Bukti Pembayaran:
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Bukti setoran tidak terbaca / dana belum masuk rekening kasda..."
                className="w-full border border-red-300 p-2 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1 border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={isVerifying}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Konfirmasi Tolak Bukti Bayar
                </button>
              </div>
            </div>
          )}

          {/* Lampiran Bukti Setoran */}
          <div className="w-full flex flex-col items-center border border-dashed border-gray-300 p-4 bg-gray-50">
            <h3 className="font-bold text-gray-700 mb-3 self-start">Lampiran Bukti Bayar Tenant:</h3>
            {renderReceiptPreview(currentInv.payment_receipt || pendingPayment?.payment_receipt)}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2.5 flex-shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer text-xs"
          >
            Tutup
          </button>
          
          {!showRejectForm && onReject && (
            <button 
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold cursor-pointer text-xs"
            >
              Tolak Bukti Bayar
            </button>
          )}

          <button 
            type="button"
            onClick={handleConfirmVerify}
            disabled={isVerifying}
            className={`px-5 py-2 font-bold shadow-xs flex items-center cursor-pointer text-xs text-white ${
              isPartial 
                ? 'bg-[#e08e0b] hover:bg-[#d58512]' 
                : 'bg-[#00a65a] hover:bg-[#008d4c]'
            } disabled:opacity-70`}
          >
            {isVerifying ? (
              'Memproses Verifikasi...'
            ) : isPartial ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Sahkan Setoran Sebagian (Kurang Dibayar - STRD)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Sahkan Pembayaran Lunas Penuh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lightbox / Modal Perbesar Bukti Bayar */}
      {isImageEnlarged && (currentInv.payment_receipt || pendingPayment?.payment_receipt) && (
        <div 
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsImageEnlarged(false)}
        >
          {/* Top Bar Controls */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Lampiran Bukti Bayar Tenant</span>
              <span className="text-xs text-gray-300">({currentInv.invoice_number})</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getFileUrl(currentInv.payment_receipt || pendingPayment?.payment_receipt)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1.5 transition-colors"
                title="Buka gambar di tab baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka Tab Baru
              </a>
              <button
                type="button"
                onClick={() => setIsImageEnlarged(false)}
                className="p-1.5 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Large Image Box */}
          <div 
            className="relative max-w-5xl max-h-[85vh] overflow-auto flex items-center justify-center p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getFileUrl(currentInv.payment_receipt || pendingPayment?.payment_receipt)}
              alt="Bukti Bayar Diperbesar"
              className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl bg-white border border-gray-700 select-none"
            />
          </div>

          <p className="text-gray-400 text-xs mt-2 select-none">
            Klik di luar gambar atau tekan tombol ESC untuk menutup
          </p>
        </div>
      )}
    </div>
  );
};
