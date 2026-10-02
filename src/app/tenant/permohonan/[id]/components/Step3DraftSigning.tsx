import React, { useState, useRef } from 'react';
import { RentalApplication } from '@/types/rental';
import { contractService } from '@/services/contractService';
import { resolveUrl } from '@/utils/url';
import SuratPKS from '@/components/SuratPKS';
import { FileText, Loader2, CheckCircle2, ExternalLink, PenTool, Upload, AlertCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Step3DraftSigningProps {
  app: RentalApplication;
  onSuccess: () => void;
}

export const Step3DraftSigning: React.FC<Step3DraftSigningProps> = ({ app, onSuccess }) => {
  const pksTemplateRef = useRef<HTMLDivElement>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleDownloadDraft = async () => {
    if (!pksTemplateRef.current) return;
    try {
      setGeneratingPdf(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pksTemplateRef.current;
      const opt = {
        margin: 0,
        filename: `Draft_PKS_${app?.application_number}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
      toast.success('Draft Kontrak PKS berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF kontrak');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleUploadSignedContract = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedPdf || !app?.contracts?.id) {
      toast.error('Pilih file PDF yang sudah ditandatangani dan pastikan kontrak tersedia');
      return;
    }
    
    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append('signature_file', selectedPdf);
      
      await contractService.uploadSignature(app.contracts.id, formData);
      toast.success('Dokumen kontrak yang sudah ditandatangani berhasil diunggah!');
      onSuccess();
    } catch (err: any) {
      toast.error('Gagal mengunggah dokumen: ' + (err.message || 'Error'));
    } finally {
      setUploadingPdf(false);
      setSelectedPdf(null);
    }
  };

  if (app.contracts?.signed_document_url) {
    /* === STATE: Sudah Upload — Menunggu Verifikasi Admin (Hero Banner konsisten dengan Step 2 & Step 4) === */
    return (
      <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg mb-8 overflow-hidden">
        
        {/* Hero / Banner Section */}
        <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <FileText className="w-64 h-64 text-[#3c8dbc]" />
          </div>
          
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
              <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
            </div>
            <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
          </div>
          
          <div className="text-center md:text-left flex-1 z-10 mt-2">
            <div className="inline-flex items-center px-3 py-1 rounded bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
              Status Saat Ini
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Menunggu Verifikasi Dokumen Kontrak</h2>
            <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
              Dokumen Perjanjian Kerja Sama (PKS) yang telah Anda tanda tangani dan bubuhi materai telah kami terima dengan baik. Saat ini, Tim Admin sedang memverifikasi keabsahan dokumen sebelum kontrak diaktifkan secara resmi. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
            </p>
          </div>
        </div>

        {/* Rangkuman & Dokumen PKS Section */}
        <div className="p-8 md:p-12 bg-white space-y-8">
          
          {/* Header Rangkuman */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              Rangkuman Pengunggahan Dokumen Kontrak
            </h3>
            <span className="text-xs font-bold text-slate-400">
              No. Kontrak: {app.contracts?.contract_number || app.application_number}
            </span>
          </div>

          {/* Uploaded PDF Preview */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                  <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                  Dokumen PKS yang Telah Ditandatangani
                </h4>
                <p className="text-xs text-slate-500 mt-1">Pratinjau berkas yang sedang diverifikasi oleh Tim Admin</p>
              </div>
              <a 
                href={resolveUrl(app.contracts.signed_document_url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors border border-slate-300"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" /> Buka di Tab Baru
              </a>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
              <iframe
                src={resolveUrl(app.contracts.signed_document_url)}
                className="w-full h-[700px]"
                title="Dokumen PKS Tertandatangani"
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* === STATE: Belum Upload — Form Upload + Draft Preview === */
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
      <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-[16px] text-[#444] font-bold flex items-center mb-1">
            <PenTool className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Draft Perjanjian Kerja Sama (PKS)
          </h3>
          <p className="text-[13px] text-slate-500 ml-7">
            Permohonan dan alokasi layanan Anda telah disetujui. Silakan unduh draft Surat Perjanjian Kerja Sama (PKS), cetak, bubuhi materai Rp 10.000 dan tanda tangani, lalu unggah kembali berkas PDF untuk disahkan.
          </p>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left side: Upload Form */}
          <div className="lg:col-span-4 lg:order-1 order-2">
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Unggah Dokumen PKS yang Telah Ditandatangani</h4>
            
            <form onSubmit={handleUploadSignedContract} className="space-y-4">
              {!selectedPdf ? (
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg px-6 py-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-blue-400 transition-all relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setSelectedPdf(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-800 mb-1">Pilih File PDF PKS</p>
                  <p className="text-[12px] text-slate-500 mb-4">Pastikan file sudah ditandatangani dan dibubuhi materai yang berlaku.</p>
                  <div className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-md text-[13px] font-semibold text-blue-700 shadow-sm pointer-events-none group-hover:bg-blue-100 transition-colors">
                    Cari File...
                  </div>
                </div>
              ) : (
                <div className="border-2 border-blue-400 bg-blue-50/50 rounded-lg px-6 py-8 flex flex-col items-center justify-center text-center transition-all shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 transform transition-transform hover:scale-105">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-800 truncate w-full px-2 mb-1" title={selectedPdf.name}>
                    {selectedPdf.name}
                  </p>
                  <p className="text-[12px] text-blue-600 font-semibold mb-4">File siap diunggah</p>
                  <button 
                    type="button"
                    onClick={() => setSelectedPdf(null)}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-md text-[13px] font-semibold transition-colors shadow-sm text-slate-600"
                  >
                    Ganti File
                  </button>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={uploadingPdf || !selectedPdf}
                className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-3 px-4 rounded-md font-bold flex justify-center items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {uploadingPdf ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                Unggah PKS
              </button>
            </form>
            
            <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-md">
              <h5 className="text-sm font-bold text-yellow-800 flex items-center mb-2">
                <AlertCircle className="w-4 h-4 mr-1.5" /> Panduan Penandatanganan
              </h5>
              <ul className="text-xs text-yellow-700 space-y-1.5 list-disc list-inside">
                <li>Gunakan kertas berukuran A4 untuk mencetak.</li>
                <li>Tempelkan materai Rp 10.000 pada kolom tanda tangan PIHAK KEDUA.</li>
                <li>Tanda tangan harus mengenai materai dan kertas.</li>
                <li>Scan dokumen dengan resolusi yang jelas (warna) dan simpan dalam format PDF.</li>
              </ul>
            </div>
          </div>
          
          {/* Right side: Preview & Download */}
          <div className="lg:col-span-8 lg:order-2 order-1">
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 flex justify-between items-center">
              Pratinjau Draft PKS
              <div className="flex gap-2">
                <button 
                  onClick={handleDownloadDraft}
                  disabled={generatingPdf}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded flex items-center transition-colors shadow-sm disabled:opacity-70"
                >
                  {generatingPdf ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                  Unduh PDF
                </button>
              </div>
            </h4>
            
            <div className="bg-slate-100 p-4 rounded border border-slate-200 overflow-y-auto max-h-[650px] shadow-inner">
              {app.contracts && <SuratPKS 
                ref={pksTemplateRef}
                contract={{
                  ...app.contracts,
                  tenants: app.tenants,
                  assets: app.assets
                } as any}
              />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3DraftSigning;
