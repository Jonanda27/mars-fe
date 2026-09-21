import React, { useRef } from 'react';
import { Download, X } from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import SuratSKRD from '@/components/SuratSKRD';

interface SkrdPreviewModalProps {
  readonly isOpen: boolean;
  readonly skrdInvoice: any;
  readonly onClose: () => void;
}

export const SkrdPreviewModal: React.FC<SkrdPreviewModalProps> = ({
  isOpen,
  skrdInvoice,
  onClose,
}) => {
  const skrdRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !skrdInvoice) return null;

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !skrdInvoice) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = skrdRef.current;
      const opt = {
        margin: 0,
        filename: `SKRD_${skrdInvoice.invoice_number ? skrdInvoice.invoice_number.replace(/\//g, '_') : 'Doc'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error downloading SKRD PDF:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white rounded-none shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <RupiahIcon className="w-4 h-4 text-[#3c8dbc]" />
            Preview Dokumen Ketetapan e-SKRD
          </h2>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleDownloadPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh PDF
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Tutup
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex justify-center bg-gray-200 flex-1">
          <SuratSKRD invoice={skrdInvoice} ref={skrdRef} />
        </div>
      </div>
    </div>
  );
};
