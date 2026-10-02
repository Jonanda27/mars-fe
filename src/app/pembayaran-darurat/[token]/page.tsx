"use client";

import React, { useEffect, useState, use } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, FileText, Upload, 
  Building2, ArrowRight, ShieldCheck, Printer, Loader2, Plane, AlertCircle
} from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { formatRupiah } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/date';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface PageProps {
  readonly params: Promise<{ token: string }>;
}

export default function PembayaranDaruratPublicPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams?.token;

  const [invoice, setInvoice] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [senderBank, setSenderBank] = useState('');
  const [senderName, setSenderName] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInvoiceData = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setErrorMsg('');
      const data = await invoiceService.getEmergencyInvoiceByToken(token);
      setInvoice(data);
    } catch (err: any) {
      console.error('Error fetching emergency invoice:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Tautan pembayaran tidak valid atau telah kedaluwarsa');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      toast.error('Silakan lampirkan foto atau file bukti transfer pembayaran');
      return;
    }

    if (!senderBank.trim() || !senderName.trim()) {
      toast.error('Nama bank pengirim dan nama pemilik rekening wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('receipt', receiptFile);
      fd.append('payment_method', paymentMethod);
      fd.append('sender_bank', senderBank.trim());
      fd.append('sender_name', senderName.trim());
      fd.append('notes', notes.trim());

      await invoiceService.uploadEmergencyPaymentReceipt(token, fd);
      toast.success('Bukti pembayaran berhasil diunggah! Sedang menunggu verifikasi admin.');
      fetchInvoiceData();
    } catch (err: any) {
      console.error('Error uploading payment receipt:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ecf0f5] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <h2 className="text-base font-bold text-slate-700">Memuat Tagihan Retribusi Daerah...</h2>
        <p className="text-xs text-slate-500 mt-1">UPBU Mozes Kilangin Timika</p>
      </div>
    );
  }

  if (errorMsg || !invoice) {
    return (
      <div className="min-h-screen bg-[#ecf0f5] flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-md w-full border-t-4 border-red-500 shadow-md text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Tautan Pembayaran Tidak Ditemukan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {errorMsg || 'Token pembayaran khusus ini tidak valid atau telah kedaluwarsa. Silakan periksa kembali tautan pada email Anda atau hubungi pihak Dinas Perhubungan Kab. Mimika.'}
          </p>
        </div>
      </div>
    );
  }

  const details = invoice.parsed_details || {};
  const isPaid = invoice.status === 'Paid';
  const isPending = invoice.status === 'Pending Verification';
  const isUnpaid = invoice.status === 'Unpaid';

  return (
    <div className="min-h-screen bg-[#ecf0f5] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Resmi Dishub Mimika */}
        <div className="bg-white p-6 border-t-4 border-[#3c8dbc] shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img 
            src="/images/logo dishub .png" 
            alt="Logo Dishub Mimika" 
            className="w-16 h-auto object-contain flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Pemerintah Kabupaten Mimika &bull; Dinas Perhubungan
            </h3>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              Portal Pembayaran e-SKRD Pendaratan Darurat
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Unit Penyelenggara Bandar Udara (UPBU) Mozes Kilangin Timika
            </p>
          </div>
          <div className="flex-shrink-0">
            {isPaid && (
              <StatusBadge status="Lunas" label="Lunas / Terverifikasi" />
            )}
            {isPending && (
              <StatusBadge status="Menunggu Verifikasi" label="Menunggu Verifikasi" />
            )}
            {isUnpaid && (
              <StatusBadge status="Menunggu Bayar" label="Menunggu Pembayaran" />
            )}
          </div>
        </div>

        {/* Status Banner Jika Sedang Menunggu Verifikasi */}
        {isPending && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-xs text-amber-900 leading-relaxed shadow-2xs flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 block mb-0.5">Bukti Transfer Berhasil Dikirimkan:</strong>
              Bukti pembayaran Anda saat ini sedang dalam proses verifikasi dan pencocokan mutasi kas daerah oleh Admin UPBU Mozes Kilangin. Halaman ini akan otomatis diperbarui menjadi <em>Lunas</em> setelah disahkan.
            </div>
          </div>
        )}

        {/* Status Banner Jika Sudah Lunas */}
        {isPaid && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 text-xs text-emerald-900 leading-relaxed shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-emerald-950 block mb-0.5">Pembayaran Telah Disahkan (Lunas):</strong>
              Terima kasih, pembayaran retribusi daerah telah berhasil diverifikasi pada{' '}
              {invoice.payment_date ? dayjs(invoice.payment_date).format('DD MMMM YYYY, HH:mm') : '-'}.
            </div>
          </div>
        )}

        {/* Ringkasan e-SKRD */}
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3c8dbc]" />
              Rincian Ketetapan Retribusi Daerah (e-SKRD)
            </h2>
            <span className="font-mono text-xs font-bold text-blue-700">
              {invoice.invoice_number}
            </span>
          </div>

          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Wajib Retribusi / Maskapai</span>
                <strong className="text-slate-800 text-sm">{invoice.tenants?.nama_perusahaan || '-'}</strong>
                <div className="text-slate-500 mt-0.5">PIC: {invoice.tenants?.pic || '-'}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor PKS Darurat</span>
                <strong className="font-mono text-slate-700 text-sm">{invoice.contracts?.contract_number || '-'}</strong>
                <div className="text-slate-500 mt-0.5">Disahkan oleh Dinas Perhubungan Kab. Mimika</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registrasi Armada</span>
                <strong className="font-mono text-blue-700 text-sm font-bold">
                  {details.registration_number || '-'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lokasi Parkir</span>
                <strong className="text-slate-700">
                  {details.parking_location || invoice.contracts?.assets?.jenis_aset || 'Apron'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Durasi Menginap</span>
                <strong className="text-slate-800">
                  {details.total_nights || 1} Malam
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Jatuh Tempo</span>
                <strong className="text-red-600">
                  {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                </strong>
              </div>
            </div>

            {/* Total Pembayaran */}
            <div className="bg-slate-50 p-4 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">
                  Total Retribusi yang Wajib Dibayarkan:
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {details.total_nights || 1} Malam &times; {formatRupiah(details.rate_per_night || invoice.amount)}
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-mono tracking-tight">
                {formatRupiah(invoice.amount)}
              </div>
            </div>
          </div>
        </div>

        {/* Instruksi Rekening Tujuan */}
        <div className="bg-white border border-slate-200 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Rekening Resmi Pembayaran Retribusi Kas Daerah
          </h2>

          <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-none space-y-2 text-xs text-emerald-950">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bank Tujuan</span>
                <strong className="text-sm">Bank BPD Papua (Bank Papua)</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Nomor Rekening Kas Daerah</span>
                <strong className="text-base font-mono font-bold text-emerald-900 tracking-wider">
                  100-01-000000-0
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Atas Nama Pemilik Rekening</span>
                <strong className="text-xs">Bendahara Penerimaan Dishub Kab. Mimika</strong>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/80">
              * Harap cantumkan keterangan transfer: <strong>{invoice.invoice_number}</strong>
            </p>
          </div>
        </div>

        {/* Form Upload Bukti Pembayaran (Jika Belum Dibayar) */}
        {isUnpaid && (
          <form onSubmit={handleUploadSubmit} className="bg-white border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#3c8dbc]" />
                Unggah Bukti Pembayaran
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Kirimkan bukti setor atau slip transfer bank agar dapat diverifikasi oleh admin
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-slate-300 p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                >
                  <option value="Transfer Bank">Transfer Bank (ATM / Mobile Banking / Internet Banking)</option>
                  <option value="Kliring / RTGS">Kliring / RTGS Antar Bank</option>
                  <option value="Setoran Tunai Teller">Setoran Tunai Melalui Teller Bank</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Bank Asal Pengirim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Mandiri / BCA / BNI"
                  value={senderBank}
                  onChange={(e) => setSenderBank(e.target.value)}
                  className="w-full border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pemilik Rekening Pengirim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Trigana Air Service"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Nomor referensi / keterangan transaksi"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Upload File Bukti */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 text-xs">
                File Bukti Transfer (Slip / Resi / Screenshot M-Banking) <span className="text-red-500">*</span>
              </label>

              {!receiptPreview ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-[#3c8dbc] bg-slate-50 p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Pilih / Unggah Bukti Pembayaran</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG / PDF (Maksimal 10MB)</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="border border-slate-300 p-3 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={receiptPreview} 
                      alt="Preview Bukti" 
                      className="w-16 h-16 object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {receiptFile?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(Number(receiptFile?.size || 0) / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptFile(null);
                      setReceiptPreview(null);
                    }}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Ganti File
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengunggah Bukti Pembayaran...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Kirim Bukti Pembayaran
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 py-4">
          &copy; {new Date().getFullYear()} UPBU Mozes Kilangin Timika &bull; Dinas Perhubungan Kabupaten Mimika
        </div>

      </div>
    </div>
  );
}
