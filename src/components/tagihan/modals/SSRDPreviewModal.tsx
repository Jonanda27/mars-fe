import React, { useRef, useState } from 'react';
import { X, Download, FileCheck, Printer, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { SuratSSRD } from '@/components/SuratSSRD';
import toast from 'react-hot-toast';

interface SSRDPreviewModalProps {
  readonly isOpen: boolean;
  readonly invoice: Invoice | null;
  readonly onClose: () => void;
}

export const SSRDPreviewModal: React.FC<SSRDPreviewModalProps> = ({
  isOpen,
  invoice,
  onClose,
}) => {
  const ssrdRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = async () => {
    if (!ssrdRef.current || !invoice || isDownloading) return;
    
    try {
      setIsDownloading(true);
      // Gunakan html2canvas-pro dan jsPDF secara langsung untuk menjamin 100% pas 1 halaman A4 tanpa halaman kedua kosong
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = ssrdRef.current;
      const cleanInvNum = (invoice.invoice_number || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');

      // Render dokumen SSRD ke canvas beresolusi tinggi (scale 2 untuk ketajaman teks resmi)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Inisialisasi dokumen jsPDF ukuran A4 portrait (210 x 297 mm)
      // jsPDF hanya memiliki 1 halaman aktif secara default
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Letakkan gambar pas di halaman 1 A4 penuh (210mm x 297mm) tanpa memicu page break
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`SSRD_${cleanInvNum}.pdf`);

      toast.success('Dokumen PDF SSRD berhasil diunduh (Tepat 1 Halaman A4)');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Gagal mengunduh dokumen PDF SSRD');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!ssrdRef.current) return;

    // Gunakan hidden iframe untuk mencetak pas 1 halaman A4 tanpa popup eksternal
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Salin seluruh style Tailwind & font dari dokumen utama
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak SSRD - ${invoice.invoice_number || 'A4'}</title>
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 0 !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              background: #ffffff !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .a4-print-sheet {
              width: 210mm !important;
              height: 296mm !important;
              max-height: 296mm !important;
              margin: 0 auto !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
              page-break-before: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          <div class="a4-print-sheet">
            ${ssrdRef.current.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }, 250);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-2xs flex flex-col justify-center items-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white shadow-2xl w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-slate-50 flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-600 text-white shadow-xs">
              <FileCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
                  Dokumen Bukti Setoran Resmi (e-SSRD)
                </h2>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 font-bold">
                  {invoice.invoice_number}
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 font-semibold">
                  Format Kertas: A4 (210 × 297 mm)
                </span>
              </div>
              <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                Lampiran III Peraturan Bupati Mimika No. 25 Tahun 2024 • Standar Cetak 1 Halaman Pas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handlePrint}
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-1.5 text-xs font-bold flex items-center cursor-pointer transition-colors shadow-2xs"
              title="Cetak langsung dokumen SSRD resmi"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Cetak
            </button>
            <button 
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadPdf}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-3.5 py-1.5 text-xs font-bold flex items-center cursor-pointer transition-colors shadow-xs"
              title="Unduh berkas PDF resmi e-SSRD"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Menyiapkan PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Unduh PDF
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 text-xs font-bold flex items-center cursor-pointer transition-colors ml-1"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Tutup
            </button>
          </div>
        </div>

        {/* MODAL DOCUMENT BODY (True A4 Paper Ratio 210mm x 296mm) */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-auto flex justify-center bg-slate-300/90 flex-1">
          <div 
            className="bg-white shadow-2xl ring-1 ring-black/10 origin-top flex-shrink-0"
            style={{ 
              width: '210mm', 
              height: '296mm',
              maxHeight: '296mm',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <SuratSSRD invoice={invoice} ref={ssrdRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSRDPreviewModal;
