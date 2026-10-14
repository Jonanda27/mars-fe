import React, { useRef, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import SuratSKRD from '@/components/SuratSKRD';
import SuratSKRDPerda from '@/components/SuratSKRDPerda';

interface SKRDPreviewModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly onClose: () => void;
}

export const SKRDPreviewModal: React.FC<SKRDPreviewModalProps> = ({
  isOpen,
  invoice,
  onClose,
}) => {
  const skrdRef = useRef<HTMLDivElement>(null);
  const [formatType, setFormatType] = useState<'perda' | 'standar'>('perda');

  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !invoice) return;
    
    // dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = skrdRef.current;
    const opt = {
      margin:       0,
      filename:     `SKRD_${invoice.invoice_number.replace(/\//g, '_')}_${formatType}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-800">Preview e-SKRD</h2>
            
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
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 text-xs font-bold flex items-center cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 text-xs font-bold flex items-center cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Tutup
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex justify-center bg-gray-200 flex-1">
          {formatType === 'perda' ? (
            <SuratSKRDPerda invoice={invoice} ref={skrdRef} />
          ) : (
            <SuratSKRD invoice={invoice} ref={skrdRef} />
          )}
        </div>
      </div>
    </div>
  );
};

