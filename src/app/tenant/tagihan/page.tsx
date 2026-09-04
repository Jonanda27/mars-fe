"use client";

import React, { useEffect, useState, useRef } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { FileText, Loader2, CheckCircle2, Clock, AlertCircle, Banknote, Download, X } from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';
import SuratSKRD from '@/components/SuratSKRD';

export default function TenantTagihanPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  
  // SKRD Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadInvoice, setUploadInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank Papua');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // SKRD Modal state
  const [showSkrdModal, setShowSkrdModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const skrdRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getTenantInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadInvoice || !receiptFile) {
        alert('Pilih file bukti bayar terlebih dahulu');
        return;
    }
    
    try {
      setIsPaying(true);
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('payment_method', paymentMethod);

      const res = await fetch(`http://localhost:5000/api/invoices/${uploadInvoice.id}/upload-receipt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (res.ok) {
        alert('Bukti bayar berhasil diunggah! Menunggu verifikasi admin.');
        setShowUploadModal(false);
        setReceiptFile(null);
        fetchInvoices();
      } else {
        const data = await res.json();
        alert(`Gagal mengunggah bukti bayar: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengunggah');
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center w-max"><CheckCircle2 className="w-4 h-4 mr-1" /> Lunas</span>;
      case 'Unpaid':
        return <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center w-max"><Clock className="w-4 h-4 mr-1" /> Belum Dibayar</span>;
      case 'Overdue':
        return <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center w-max"><AlertCircle className="w-4 h-4 mr-1" /> Menunggak</span>;
      case 'Scheduled':
        return <span className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-full flex items-center w-max"><Clock className="w-4 h-4 mr-1" /> Terjadwal</span>;
      case 'Pending Verification':
        return <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center w-max"><Clock className="w-4 h-4 mr-1" /> Menunggu Verifikasi</span>;
      default:
        return <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Tagihan Saya <small className="text-[15px] text-[#777] ml-2 font-light">Pembayaran SKRD</small>
        </h1>
      </header>

      <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#f39c12]" /> Daftar Tagihan (SKRD)
          </h3>
        </div>
        
        <div className="p-4 bg-slate-50 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-slate-500 py-20">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-orange-500" /> 
              <span className="font-medium text-lg">Memuat tagihan...</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
              <Banknote className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Tidak Ada Tagihan</h3>
              <p className="text-sm mt-1">Anda tidak memiliki tagihan SKRD saat ini.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(
                invoices.reduce((acc, invoice) => {
                  const contractNum = invoice.contracts?.contract_number || 'Tagihan Lainnya';
                  if (!acc[contractNum]) acc[contractNum] = [];
                  acc[contractNum].push(invoice);
                  return acc;
                }, {} as Record<string, Invoice[]>)
              ).map(([contractNum, contractInvoices]) => (
                <div key={contractNum} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="font-bold text-slate-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-slate-500" />
                      Kontrak: {contractNum}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {contractInvoices.length} Tagihan
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-50">
                    {contractInvoices.map((invoice, index) => {
                      const isScheduled = invoice.status === 'Scheduled';
                      const isPending = invoice.status === 'Pending Verification';
                      const total = Number(invoice.amount) + Number(invoice.penalty_amount || 0);
                      
                      return (
                        <div key={invoice.id} className={`bg-white rounded-xl shadow-sm border ${isScheduled ? 'border-slate-200 opacity-60 grayscale-[50%]' : 'border-orange-100 hover:shadow-md'} overflow-hidden flex flex-col transition-all relative`}>
                          
                          {isScheduled && (
                            <div className="absolute inset-0 bg-slate-50/50 z-10 flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                              <div className="bg-slate-800/80 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg transform rotate-[-5deg]">
                                <Clock className="w-4 h-4 mr-2" /> Belum Waktunya
                              </div>
                            </div>
                          )}

                          <div className={`p-4 border-b ${isScheduled ? 'border-slate-100 bg-slate-50' : 'border-orange-50 bg-orange-50/30'} flex justify-between items-start`}>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">TAGIHAN KE-{index + 1}</span>
                              </div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor SKRD</div>
                              <div className="font-bold text-lg text-slate-800">{invoice.invoice_number}</div>
                            </div>
                            <div className="z-20">
                              {getStatusBadge(invoice.status)}
                            </div>
                          </div>
                          
                          <div className="p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Terkait Kontrak</div>
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                  <FileText className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                  <div className="text-[12px] text-slate-600 font-medium">{invoice.contracts?.assets?.nama_aset}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jatuh Tempo</div>
                                <div className="font-medium text-slate-700 text-sm">
                                  {invoice.due_date ? dayjs(invoice.due_date).format('DD MMM YYYY') : '-'}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Bayar</div>
                                <div className={`font-bold text-xl ${isScheduled ? 'text-slate-600' : 'text-orange-600'}`}>
                                  {formatRupiah(total)}
                                  {Number(invoice.penalty_amount) > 0 && (
                                    <div className="text-xs text-red-600 font-bold">+ Denda: {formatRupiah(Number(invoice.penalty_amount))}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {!isScheduled && invoice.status === 'Unpaid' && (
                            <div className="p-4 border-t border-slate-100 bg-orange-50 flex justify-end gap-2 z-20">
                              <button 
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowSkrdModal(true);
                                }}
                                className="inline-flex items-center justify-center bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded text-sm font-semibold transition-colors shadow-sm"
                              >
                                <FileText className="w-4 h-4 mr-2" /> 
                                Lihat e-SKRD
                              </button>
                              <button 
                                onClick={() => {
                                    setUploadInvoice(invoice);
                                    setShowUploadModal(true);
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-semibold transition-colors shadow-sm"
                              >
                                <Banknote className="w-4 h-4 mr-2" /> 
                                Upload Bukti Bayar
                              </button>
                            </div>
                          )}

                          {!isScheduled && invoice.status === 'Pending Verification' && (
                            <div className="p-4 border-t border-slate-100 bg-blue-50 flex justify-between items-center text-blue-700 text-sm z-20">
                              <div className="flex items-center font-medium">
                                <Clock className="w-4 h-4 mr-2 text-blue-600" /> Bukti bayar sedang diperiksa Admin
                              </div>
                            </div>
                          )}

                          {!isScheduled && invoice.status === 'Paid' && (
                            <div className="p-4 border-t border-slate-100 bg-green-50 flex justify-between items-center text-green-700 text-sm z-20">
                              <div className="flex items-center font-medium">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Lunas pada {dayjs(invoice.payment_date).format('DD MMM YYYY')}
                              </div>
                              <button 
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowSkrdModal(true);
                                }}
                                className="inline-flex items-center justify-center bg-white border border-green-200 text-green-700 hover:bg-green-100 px-4 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm"
                              >
                                <FileText className="w-3 h-3 mr-1" /> 
                                Cetak e-SKRD
                              </button>
                            </div>
                          )}

                          {isScheduled && (
                             <div className="p-4 border-t border-slate-200 bg-slate-100 flex justify-center text-slate-500 text-xs font-medium">
                                Tagihan ini belum aktif dan belum bisa dibayar.
                             </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL UPLOAD BUKTI BAYAR */}
      {showUploadModal && uploadInvoice && (
        <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Upload Bukti Pembayaran</h2>
              <button onClick={() => {setShowUploadModal(false); setReceiptFile(null);}} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadReceipt}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Tagihan</label>
                  <div className="bg-gray-100 p-2 rounded text-gray-800 font-bold">{uploadInvoice.invoice_number}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Harus Dibayar</label>
                  <div className="text-xl font-bold text-orange-600">
                    {formatRupiah(Number(uploadInvoice.amount) + Number(uploadInvoice.penalty_amount || 0))}
                  </div>
                  {Number(uploadInvoice.penalty_amount) > 0 && (
                     <div className="text-xs text-red-600 font-bold mt-1">Termasuk Denda: {formatRupiah(Number(uploadInvoice.penalty_amount))}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Metode Transfer / Bank</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="Transfer Bank Papua">Transfer Bank Papua</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                    <option value="Setoran Tunai di Loket">Setoran Tunai di Loket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload File Resi (Maks 2MB, PDF/JPG)</label>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.pdf"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Ukuran file melebihi 2MB! Silakan unggah file yang lebih kecil.');
                          e.target.value = ''; // Reset input
                          setReceiptFile(null);
                          return;
                        }
                        
                        const allowedTypes = ['application/pdf', 'image/jpeg'];
                        if (!allowedTypes.includes(file.type)) {
                          alert('Hanya file PDF dan JPG yang diperbolehkan!');
                          e.target.value = ''; // Reset input
                          setReceiptFile(null);
                          return;
                        }
                        setReceiptFile(file);
                      } else {
                        setReceiptFile(null);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Format yang diizinkan: .pdf, .jpg, .jpeg</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => {setShowUploadModal(false); setReceiptFile(null);}}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isPaying}
                  className="px-6 py-2 bg-orange-500 rounded-lg text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-70 flex items-center"
                >
                  {isPaying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Banknote className="w-4 h-4 mr-2" />}
                  Kirim Bukti Bayar
                </button>
              </div>
            </form>
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
