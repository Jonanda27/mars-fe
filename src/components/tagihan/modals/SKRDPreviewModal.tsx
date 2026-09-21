import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import SuratSKRD from '@/components/SuratSKRD';

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

  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = async () => {
    if (!skrdRef.current || !invoice) return;
    
    // dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = skrdRef.current;
    const opt = {
      margin:       0,
      filename:     `SKRD_${invoice.invoice_number.replace(/\//g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Preview e-SKRD</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
            <button 
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
            >
              <X className="w-4 h-4 mr-1" /> Tutup
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex justify-center bg-gray-200 flex-1">
          <SuratSKRD invoice={invoice} ref={skrdRef} />
        </div>
      </div>
    </div>
  );
};
