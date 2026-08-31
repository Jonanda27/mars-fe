"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Receipt, Search, Filter, Mail, Download, 
  CheckCircle2, Clock, AlertTriangle, PlayCircle, RotateCcw, X, Calculator, FileText
} from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import SuratSKRD from '@/components/SuratSKRD';

export default function AdminTagihanSKRDPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkrdModal, setShowSkrdModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const skrdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !selectedInvoice) return;
    
    // dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = skrdRef.current;
    const opt = {
      margin:       10,
      filename:     `SKRD_${selectedInvoice.invoice_number}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase">
            Manajemen Tagihan & e-SKRD
          </h1>
          <p className="text-[12px] text-[#777]">Monitoring Pembayaran e-SKRD</p>
        </div>
      </header>

      <div className="bg-white shadow-sm flex-1 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Data e-SKRD Keseluruhan
          </h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
             <div className="p-8 text-center text-gray-500">Memuat data tagihan...</div>
          ) : (
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
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
                    <div className="font-bold text-[#333] text-[15px]">{item.contracts?.tenants?.nama_perusahaan}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#3c8dbc]">{item.invoice_number}</div>
                    <div className="text-[11px] text-[#777]">Ref: {item.contracts?.contract_number}</div>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">
                    {formatRupiah(item.amount)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="font-bold text-[#333]">{item.due_date ? dayjs(item.due_date).format('DD MMM YYYY') : '-'}</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.status === 'Paid' ? (
                      <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-[#dd4b39]/10 text-[#dd4b39] border border-[#dd4b39]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                     <button 
                       onClick={() => {
                         setSelectedInvoice(item);
                         setShowSkrdModal(true);
                       }}
                       className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-2 py-1 text-[12px] font-bold inline-flex items-center justify-center shadow-sm"
                     >
                       <FileText className="w-3.5 h-3.5 mr-1 text-[#3c8dbc]" /> Lihat / Cetak
                     </button>
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
