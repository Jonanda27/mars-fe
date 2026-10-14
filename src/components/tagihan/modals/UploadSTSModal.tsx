"use client";

import React, { useState, useRef } from 'react';
import { X, Banknote, Loader2, UploadCloud, FileCheck, AlertTriangle, Building } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

interface UploadSTSModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly paymentMethod: string;
  readonly setPaymentMethod: (val: string) => void;
  readonly receiptFile: File | null;
  readonly setReceiptFile: (val: File | null) => void;
  readonly paymentAmount?: number | string;
  readonly setPaymentAmount?: (val: number | string) => void;
  readonly paymentNotes?: string;
  readonly setPaymentNotes?: (val: string) => void;
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
  paymentAmount,
  setPaymentAmount,
  paymentNotes,
  setPaymentNotes,
  isPaying,
  onClose,
  onSubmit,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !invoice) return null;

  const strdWarning = invoice.warnings?.find(w => (w.type || '').toUpperCase().includes('STRD'));
  const pokok = Number(invoice.amount || 0);
  const denda = Number(invoice.penalty_amount || 0);
  const paid = Number(invoice.paid_amount || 0);
  const totalObligation = pokok + denda;
  const remainingDue = Math.max(0, totalObligation - paid);
  const isPartiallyPaid = invoice.status === 'Partially Paid' || paid > 0;

  const handleValidateAndSetFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file melebihi 2MB! Silakan unggah file yang lebih kecil.');
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Hanya file PDF, JPG, atau PNG yang diperbolehkan!');
      return;
    }
    setReceiptFile(file);
    toast.success(`File ${file.name} dipilih`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      toast.error('Silakan upload file bukti transfer/pembayaran terlebih dahulu!');
      fileInputRef.current?.click();
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center flex-shrink-0">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Upload Bukti Pembayaran Setoran Daerah (STS)
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-white hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
            {/* Box Rincian Wajib Setor (Opsi A: SKRD + STRD) */}
            <div className={`p-3.5 border ${strdWarning || denda > 0 ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Nomor SKRD</div>
                  <div className="font-mono font-bold text-slate-800 text-sm">{invoice.invoice_number}</div>
                </div>
                {strdWarning && (
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-red-500">Nomor STRD</div>
                    <div className="font-mono font-bold text-red-700 text-xs bg-red-100 px-1.5 py-0.5 border border-red-300 inline-block">
                      {strdWarning.warning_number}
                    </div>
                  </div>
                )}
              </div>

              {/* Rincian Finansial Transparan */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Pokok Retribusi:</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(pokok)}</span>
                </div>

                {(strdWarning || denda > 0) && (
                  <>
                    {invoice.due_date && (
                      <div className="flex justify-between text-[11px] text-red-700">
                        <span>Masa Keterlambatan:</span>
                        <span className="font-mono font-bold text-red-800">
                          {Math.max(0, dayjs().diff(dayjs(invoice.due_date), 'day'))} Hari{' '}
                          <span className="font-normal text-slate-500">
                            ({Math.max(1, Math.min(24, Math.ceil(Math.max(0, dayjs().diff(dayjs(invoice.due_date), 'day')) / 30)))} Bulan Kalender)
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline text-[11px] text-red-700">
                      <div>
                        <span className="font-bold">Sanksi Bunga STRD (1%/Bln):</span>
                        <div className="text-[9.5px] text-red-600/90 italic font-normal">
                          {Math.max(1, Math.min(24, Math.ceil(Math.max(0, dayjs().diff(dayjs(invoice.due_date), 'day')) / 30))) * 1}% dari Pokok SKRD
                        </div>
                      </div>
                      <span className="font-mono font-bold text-red-700 text-xs">
                        +{formatRupiah(denda)}
                      </span>
                    </div>
                  </>
                )}

                {paid > 0 && (
                  <div className="flex justify-between items-center text-[11px] text-emerald-800 font-bold bg-emerald-50 p-1.5 border border-emerald-200">
                    <span>Telah Dibukukan / Disetor:</span>
                    <span className="font-mono text-emerald-700">-{formatRupiah(paid)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-700 block">
                      {isPartiallyPaid ? 'Sisa Wajib Disetor (Kurang Dibayar)' : 'Total Wajib Disetor'}
                    </span>
                    {strdWarning && (
                      <span className="text-[9px] text-red-600 italic block">
                        {isPartiallyPaid ? 'Sisa Pokok + Bunga Berjalan STRD' : 'Pokok SKRD + Sanksi Bunga STRD'}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {formatRupiah(remainingDue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Rekening Kas Daerah */}
            <div className="bg-blue-50/60 border border-blue-200 p-2.5 text-[11px] text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <Building className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Rekening Kas Umum Daerah (Kasda) Kab. Mimika
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10.5px]">
                <span className="text-blue-700 font-medium">Bank Tujuan:</span>
                <span className="col-span-2 font-bold font-mono">Bank Papua Cabang Timika</span>
                <span className="text-blue-700 font-medium">No. Rekening:</span>
                <span className="col-span-2 font-bold font-mono text-slate-900 bg-white px-1 border border-blue-200 inline-block w-fit">100-01-02-00045-8</span>
                <span className="text-blue-700 font-medium">Atas Nama:</span>
                <span className="col-span-2 font-semibold">Kas Umum Daerah Kab. Mimika</span>
              </div>
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div>
              <label htmlFor="paymentMethodSelect" className="block font-bold text-slate-700 mb-1">
                Metode Pembayaran / Rekening Penyetor
              </label>
              <select 
                id="paymentMethodSelect"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-slate-300 p-2 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white"
                required
              >
                <option value="Transfer Bank Papua">Transfer Kas Daerah - Bank Papua (Rekomendasi)</option>
                <option value="Transfer Antar Bank (SKN/BI-FAST)">Transfer Antar Bank (SKN/BI-FAST ke Kasda Bank Papua)</option>
                <option value="Setoran Tunai di Loket">Setoran Tunai di Loket Kasda / Bendahara Penerima</option>
              </select>
            </div>


            {/* Drag & Drop Upload Bukti Bayar */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Upload Bukti Setoran (Maks 2MB, PDF / JPG / PNG)
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-[#3c8dbc] bg-blue-50/50' 
                    : receiptFile 
                    ? 'border-emerald-500 bg-emerald-50/30' 
                    : 'border-slate-300 hover:border-[#3c8dbc] bg-slate-50/50 hover:bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const f = e.target.files ? e.target.files[0] : null;
                    if (f) handleValidateAndSetFile(f);
                  }}
                  className="hidden"
                />

                {receiptFile ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-800">
                    <FileCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-bold text-xs truncate max-w-xs">{receiptFile.name}</div>
                      <div className="text-[10px] text-slate-500">{(receiptFile.size / 1024).toFixed(1)} KB &bull; Klik atau seret untuk mengganti</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="font-semibold text-slate-700 text-xs">
                      Tarik &amp; lepas file bukti transfer di sini, atau <span className="text-[#3c8dbc] underline">pilih berkas</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Mendukung PDF, JPG, PNG hingga ukuran 2MB
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Pastikan nominal transfer, nama rekening, dan nomor referensi transaksi terbaca dengan jelas.</p>
            </div>
          </div>

          <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center gap-2 flex-shrink-0">
            <div className="text-[11px] text-slate-500">
              {receiptFile ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> File terlampir: <span className="underline truncate max-w-[150px]">{receiptFile.name}</span>
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> File bukti transfer wajib dipilih
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isPaying}
                className={`px-5 py-2 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                  !receiptFile
                    ? 'bg-emerald-600/75 hover:bg-emerald-600'
                    : 'bg-[#00a65a] hover:bg-[#008d4c]'
                }`}
              >
                {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Banknote className="w-3.5 h-3.5" />}
                Kirim Bukti Pembayaran
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
