"use client";

import React, { useEffect, useState } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { FileText, Loader2, CheckCircle2, Clock, AlertCircle, Banknote } from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

export default function TenantTagihanPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

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

  const handlePay = async (id: number) => {
    if (!confirm('Simulasi: Apakah Anda yakin ingin melakukan pembayaran lunas untuk tagihan ini? (Hak penggunaan aset akan langsung aktif setelah ini)')) return;
    
    try {
      setIsPaying(true);
      await invoiceService.payInvoice(id);
      alert('Pembayaran Berhasil! Tagihan lunas dan status kontrak Anda kini ACTIVE.');
      fetchInvoices();
    } catch (error) {
      console.error(error);
      alert('Gagal memproses pembayaran');
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor SKRD</div>
                      <div className="font-bold text-lg text-slate-800">{invoice.invoice_number}</div>
                    </div>
                    <div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Terkait Kontrak</div>
                      <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 leading-tight">{invoice.contracts?.contract_number}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{invoice.contracts?.assets?.nama_aset}</div>
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
                        <div className="font-bold text-orange-600 text-xl">
                          {formatRupiah(invoice.amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {invoice.status === 'Unpaid' && (
                    <div className="p-4 border-t border-slate-100 bg-orange-50 flex justify-end">
                      <button 
                        onClick={() => handlePay(invoice.id)}
                        disabled={isPaying}
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70"
                      >
                        <Banknote className="w-4 h-4 mr-2" /> 
                        {isPaying ? 'Memproses...' : 'Simulasi Pembayaran'}
                      </button>
                    </div>
                  )}
                  {invoice.status === 'Paid' && (
                    <div className="p-4 border-t border-slate-100 bg-green-50 flex justify-between items-center text-green-700 text-sm">
                      <div className="flex items-center font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Lunas pada {dayjs(invoice.payment_date).format('DD MMM YYYY')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
