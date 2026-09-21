"use client";

import React, { useRef, useState } from 'react';
import { Contract } from '@/types/contract';
import SuratPKS from '@/components/SuratPKS';
import { Download, Printer, X, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SuratPKSModalProps {
  readonly contract: Contract;
  readonly onClose: () => void;
}

export const SuratPKSModal: React.FC<SuratPKSModalProps> = ({ contract, onClose }) => {
  const pksRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!pksRef.current) return;
    try {
      setDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pksRef.current;
      const opt = {
        margin: 0,
        filename: `Surat_PKS_${contract.contract_number.replace(/\//g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen Surat PKS berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal mengunduh dokumen PKS');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-none shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none">
        
        {/* Modal Header */}
        <div className="bg-[#3c8dbc] text-white px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/15 rounded-none flex items-center justify-center border border-white/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[15px] leading-tight flex items-center gap-2">
                Surat Perjanjian Kerja Sama (PKS)
                <span className="bg-white/20 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-white/30 font-semibold">
                  {contract.contract_type || 'Sewa Ruangan'}
                </span>
              </h3>
              <p className="text-xs text-blue-100 font-mono mt-0.5">
                No. Kontrak: {contract.contract_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-none text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-none text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengunduh...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Unduh PDF
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 transition-colors cursor-pointer ml-2 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Paper */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-100/80 flex-1 flex justify-center print:p-0 print:bg-white">
          <SuratPKS ref={pksRef} contract={contract} />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format Resmi Perjanjian Kerja Sama (PKS) Bandara Mozes Kilangin</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-1.5 rounded-none text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuratPKSModal;
