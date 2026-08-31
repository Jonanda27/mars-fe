"use client";

import React, { useEffect, useState } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { FileText, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

export default function AdminKeuanganPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center w-max"><CheckCircle2 className="w-3 h-3 mr-1" /> Lunas</span>;
      case 'Unpaid':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center w-max"><Clock className="w-3 h-3 mr-1" /> Menunggu Pembayaran</span>;
      case 'Overdue':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center w-max"><AlertCircle className="w-3 h-3 mr-1" /> Menunggak</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Keuangan & Tagihan <small className="text-[15px] text-[#777] ml-2 font-light">Pemantauan SKRD</small>
        </h1>
      </header>

      <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#00a65a]" /> Daftar Seluruh SKRD
          </h3>
        </div>
        
        <div className="p-4 bg-slate-50 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-slate-500 py-20">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-green-500" /> 
              <span className="font-medium text-lg">Memuat data keuangan...</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Belum Ada Tagihan</h3>
              <p className="text-sm mt-1">Belum ada SKRD yang diterbitkan dari sistem.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
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
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 leading-tight">{invoice.contracts?.contract_number}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{invoice.contracts?.assets?.nama_aset}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tenggat Waktu</div>
                        <div className="font-medium text-slate-700 text-sm">
                          {invoice.due_date ? dayjs(invoice.due_date).format('DD MMM YYYY') : '-'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nilai Tagihan</div>
                        <div className="font-bold text-green-700 text-lg">
                          {formatRupiah(invoice.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
