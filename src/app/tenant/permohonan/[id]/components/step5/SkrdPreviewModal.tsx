import React, { useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import SuratSKRD from '@/components/SuratSKRD';
import SuratSKRDPerda from '@/components/SuratSKRDPerda';

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
  const [formatType, setFormatType] = useState<'perda' | 'standar'>('perda');

  if (!isOpen || !skrdInvoice) return null;

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !skrdInvoice) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = skrdRef.current;
      const opt = {
        margin: 0,
        filename: `SKRD_${skrdInvoice.invoice_number ? skrdInvoice.invoice_number.replace(/\//g, '_') : 'Doc'}_${formatType}.pdf`,
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
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <RupiahIcon className="w-4 h-4 text-[#3c8dbc]" />
              Preview Dokumen Ketetapan e-SKRD
            </h2>

            {/* Format Selector Pills */}
            <div className="flex items-center bg-gray-200 p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => setFormatType('perda')}
                className={`px-2.5 py-1 font-semibold rounded transition-colors cursor-pointer ${
                  formatType === 'perda'
                    ? 'bg-[#3c8dbc] text-white shadow-xs'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Format Resmi Perda (Baru)
              </button>
              <button
                type="button"
                onClick={() => setFormatType('standar')}
                className={`px-2.5 py-1 font-semibold rounded transition-colors cursor-pointer ${
                  formatType === 'standar'
                    ? 'bg-[#3c8dbc] text-white shadow-xs'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Format Standar
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleDownloadPdf}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
          {formatType === 'perda' ? (
            <SuratSKRDPerda invoice={skrdInvoice} ref={skrdRef} />
          ) : (
            <SuratSKRD invoice={skrdInvoice} ref={skrdRef} />
          )}
        </div>
      </div>
    </div>
  );
};
