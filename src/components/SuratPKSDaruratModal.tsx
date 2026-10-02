"use client";

import React, { useRef, useState } from 'react';
import { Contract } from '@/types/contract';
import SuratPKSDarurat from '@/components/SuratPKSDarurat';
import { Download, Printer, X, Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface SuratPKSDaruratModalProps {
  readonly contract: Contract;
  readonly onClose: () => void;
}

export const SuratPKSDaruratModal: React.FC<SuratPKSDaruratModalProps> = ({ contract, onClose }) => {
  const pksRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!pksRef.current) return;
    try {
      setDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pksRef.current;
      const originalGap = element.style.gap;
      const pages = element.querySelectorAll('.page-a4');

      // Hilangkan gap & shadow sementara untuk export PDF presisi A4
      element.style.gap = '0px';
      pages.forEach(p => {
        (p as HTMLElement).style.boxShadow = 'none';
        (p as HTMLElement).style.border = 'none';
      });

      const safeContractNum = (contract.contract_number || 'PKS_EMG').replace(/\//g, '_');
      const opt = {
        margin: 0,
        filename: `Surat_PKS_Darurat_${safeContractNum}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          windowWidth: 794
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();

      // Kembalikan tampilan preview setelah export
      element.style.gap = originalGap;
      pages.forEach(p => {
        (p as HTMLElement).style.boxShadow = '';
        (p as HTMLElement).style.border = '1px solid #d4d4d4';
      });

      toast.success('Dokumen Surat PKS Darurat (2 Halaman) berhasil diunduh');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-150">
      
      {/* CSS Khusus Cetak Multi-halaman A4 */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #pks-darurat-document, #pks-darurat-document * {
            visibility: visible;
          }
          #pks-darurat-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            gap: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-a4 {
            box-shadow: none !important;
            border: none !important;
            page-break-after: always !important;
            break-after: page !important;
            margin: 0 !important;
            width: 100% !important;
            height: 297mm !important;
            min-height: 297mm !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-none shadow-2xl border border-neutral-300 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none">
        
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] text-white px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/15 rounded-none flex items-center justify-center border border-white/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
                Surat Perjanjian Kerja Sama (PKS) Pendaratan Darurat
                <span className="bg-white/20 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/30 font-semibold">
                  2 Halaman A4
                </span>
              </h3>
              <p className="text-[11px] text-blue-100 font-mono mt-0.5">
                Nomor: {contract.contract_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-none text-xs font-semibold transition-colors cursor-pointer border border-white/20"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-red-700 hover:bg-red-50 rounded-none text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Unduh PDF Dokumen (2 Halaman)"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-none transition-colors ml-1 cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body (100% Abu-abu Netral Murni #e5e5e5, Tanpa Unsur Biru) */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center print:p-0 print:bg-white print:overflow-visible bg-[#e5e5e5]"
          style={{ backgroundColor: '#e5e5e5' }}
        >
          <SuratPKSDarurat ref={pksRef} contract={contract} />
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 border-t border-neutral-300 px-6 py-2.5 flex justify-between items-center flex-shrink-0 text-xs text-neutral-600 print:hidden">
          <span>* Format resmi 2 Halaman A4 berkekuatan hukum dengan TTE Pilot In Command (PIC) di lapangan.</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-none cursor-pointer transition-colors text-xs border border-neutral-300"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuratPKSDaruratModal;
