"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Receipt, Search, Filter, Mail, Download, 
  CheckCircle2, Clock, AlertTriangle, PlayCircle, RotateCcw, X, Calculator, FileText, Loader2
} from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import SuratSKRD from '@/components/SuratSKRD';
import api, { getBaseUrl } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminTagihanSKRDPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkrdModal, setShowSkrdModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const skrdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Using getBaseUrl from api.ts

  const getFileUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Handle legacy local uploads that don't have the full path
    const isLegacy = !path.includes('/') && !path.startsWith('http');
    const fullPath = isLegacy ? `/uploads/receipts/${path}` : (path.startsWith('/') ? path : `/${path}`);
    return `${getBaseUrl()}${fullPath}`;
  };

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingInvoice, setVerifyingInvoice] = useState<Invoice | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (id: number) => {
    if (!confirm('Anda yakin ingin memverifikasi dan melunaskan tagihan ini?')) return;
    try {
      setIsVerifying(true);
      const res = await api.post(`/invoices/${id}/verify`);
      if (res.data.success) {
        toast.success('Verifikasi berhasil, status tagihan menjadi Lunas (Paid).');
        setShowVerifyModal(false);
        fetchInvoices();
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi';
      toast.error(`Gagal memverifikasi: ${msg}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !selectedInvoice) return;
    
    // dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = skrdRef.current;
    const opt = {
      margin:       0,
      filename:     `SKRD_${selectedInvoice.invoice_number}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Tagihan e-SKRD <small className="text-[15px] font-light text-[#777] ml-2">Manajemen & Monitoring Pembayaran</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Tagihan e-SKRD</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Data e-SKRD Keseluruhan</h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
             <div className="p-10 flex justify-center items-center text-[#777]">
               <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data tagihan...
             </div>
          ) : (
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                <th className="py-4 px-5 font-bold">Tenant</th>
                <th className="py-4 px-5 font-bold">Nomor e-SKRD</th>
                <th className="py-4 px-5 font-bold text-right">Nominal</th>
                <th className="py-4 px-5 font-bold text-center">Batas Waktu</th>
                <th className="py-4 px-5 font-bold text-center">Status</th>
                <th className="py-4 px-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => (
                <tr key={item.id} className="border-b border-[#f4f4f4] hover:bg-slate-50">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333] text-[15px]">{item.tenants?.nama_perusahaan || '-'}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#3c8dbc]">{item.invoice_number}</div>
                    <div className="text-[11px] text-[#777]">Ref: {item.contracts?.contract_number}</div>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">
                    {formatRupiah(Number(item.amount) + Number(item.penalty_amount || 0))}
                    {Number(item.penalty_amount) > 0 && (
                      <div className="text-[11px] text-red-600 font-bold mt-1">+ Denda: {formatRupiah(Number(item.penalty_amount))}</div>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="font-bold text-[#333]">{item.due_date ? dayjs(item.due_date).format('DD MMM YYYY') : '-'}</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.status === 'Paid' ? (
                      <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Lunas
                      </span>
                    ) : item.status === 'Pending Verification' ? (
                      <span className="inline-flex items-center bg-blue-100 text-blue-700 border border-blue-200 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Menunggu Verifikasi
                      </span>
                    ) : item.status === 'Scheduled' ? (
                      <span className="inline-flex items-center bg-slate-100 text-slate-600 border border-slate-200 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Terjadwal
                      </span>
                    ) : item.status === 'Overdue' ? (
                      <span className="inline-flex items-center bg-red-100 text-red-700 border border-red-200 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Menunggak
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-[#dd4b39]/10 text-[#dd4b39] border border-[#dd4b39]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center space-x-2">
                     {item.status === 'Pending Verification' ? (
                       <button 
                         onClick={() => {
                           setVerifyingInvoice(item);
                           setShowVerifyModal(true);
                         }}
                         className="bg-[#3c8dbc] border border-[#367fa9] text-white hover:bg-[#367fa9] px-2 py-1 text-[12px] font-bold inline-flex items-center justify-center shadow-sm rounded-sm"
                       >
                         <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" /> Verifikasi
                       </button>
                     ) : (
                       <button 
                         onClick={() => {
                           setSelectedInvoice(item);
                           setShowSkrdModal(true);
                         }}
                         className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-2 py-1 text-[12px] font-bold inline-flex items-center justify-center shadow-sm rounded-sm"
                       >
                         <FileText className="w-3.5 h-3.5 mr-1 text-[#3c8dbc]" /> Lihat / Cetak
                       </button>
                     )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada tagihan.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* MODAL VERIFIKASI PEMBAYARAN */}
      {showVerifyModal && verifyingInvoice && (
        <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Verifikasi Bukti Pembayaran</h2>
              <button onClick={() => setShowVerifyModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col items-center flex-1 space-y-6">
              <div className="w-full grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Nomor Tagihan</div>
                  <div className="font-bold text-gray-800">{verifyingInvoice.invoice_number}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Metode Pembayaran</div>
                  <div className="font-bold text-gray-800">{verifyingInvoice.payment_method || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Nama Tenant</div>
                  <div className="font-bold text-gray-800">{verifyingInvoice.tenants?.nama_perusahaan}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Jumlah Dibayar</div>
                  <div className="font-bold text-orange-600 text-lg">
                    {formatRupiah(Number(verifyingInvoice.amount) + Number(verifyingInvoice.penalty_amount || 0))}
                  </div>
                  {Number(verifyingInvoice.penalty_amount) > 0 && (
                     <div className="text-xs text-red-600 font-bold">Termasuk Denda: {formatRupiah(Number(verifyingInvoice.penalty_amount))}</div>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col items-center border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
                 <h3 className="font-bold text-gray-700 mb-4">Lampiran Bukti Bayar:</h3>
                 {verifyingInvoice.payment_receipt ? (
                    verifyingInvoice.payment_receipt.endsWith('.pdf') ? (
                       <a href={getFileUrl(verifyingInvoice.payment_receipt)} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold flex items-center">
                         <FileText className="w-5 h-5 mr-2" /> Buka Dokumen PDF
                       </a>
                    ) : (
                       <img 
                         src={getFileUrl(verifyingInvoice.payment_receipt)} 
                         alt="Bukti Bayar"
                         className="max-w-full max-h-[400px] object-contain shadow-sm border border-gray-200"
                       />
                    )
                 ) : (
                    <div className="text-gray-500 italic">Tidak ada file terlampir</div>
                 )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
               <button 
                 onClick={() => setShowVerifyModal(false)}
                 className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-bold"
               >
                 Tutup
               </button>
               <button 
                 onClick={() => toast('Fitur penolakan segera hadir')}
                 className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold"
               >
                 Tolak
               </button>
               <button 
                 onClick={() => handleVerify(verifyingInvoice.id)}
                 disabled={isVerifying}
                 className="px-6 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded font-bold shadow disabled:opacity-70 flex items-center"
               >
                 {isVerifying ? 'Memproses...' : <><CheckCircle2 className="w-4 h-4 mr-2" /> Setujui (Lunas)</>}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL E-SKRD */}
      {showSkrdModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Preview e-SKRD</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleDownloadPdf}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
                <button 
                  onClick={() => setShowSkrdModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium flex items-center"
                >
                  <X className="w-4 h-4 mr-1" /> Tutup
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex justify-center bg-gray-200 flex-1">
              <SuratSKRD invoice={selectedInvoice} ref={skrdRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
