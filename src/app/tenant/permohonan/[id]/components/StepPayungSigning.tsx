"use client";

import React, { useState, useRef } from 'react';
import { RentalApplication } from '@/types/rental';
import { 
  FileSignature, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Info,
  ExternalLink
} from 'lucide-react';
import ContractPDFViewer from '@/components/ContractPDFViewer';
import { rentalService } from '@/services/rentalService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';
import { resolveUrl } from '@/utils/url';
import dayjs from 'dayjs';

interface StepPayungSigningProps {
  readonly app: RentalApplication;
  readonly onSuccess: () => void;
}

export const StepPayungSigning: React.FC<StepPayungSigningProps> = ({ app, onSuccess }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rawContract = app.contracts;
  const contract = rawContract
    ? {
        ...rawContract,
        tenants: rawContract.tenants || app.tenants,
      }
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Silakan pilih file PDF hasil scan TTD basah terlebih dahulu");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('signature_file', selectedFile);

      await rentalService.uploadPayungSignature(app.id, formData);
      toast.success("Berkas Kontrak Payung berhasil diunggah! Dokumen kini dalam proses verifikasi dan pengesahan Kepala Dinas.");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      onSuccess();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal mengunggah berkas Kontrak Payung"));
    } finally {
      setIsUploading(false);
    }
  };

  if (!contract) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-none shadow-xs text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800 text-base mb-1">Draf Kontrak Payung Sedang Disiapkan</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Surat permohonan Anda telah disetujui. Dokumen Kontrak Payung sedang diproses oleh sistem.
        </p>
      </div>
    );
  }

  const isContractActive = contract.status === 'Aktif' || contract.status === 'Active';
  const isPendingKadis = (contract.status || '').toLowerCase().includes('menunggu pengesahan') ||
                         (contract.status || '').toLowerCase().includes('menunggu verifikasi') ||
                         (app.status || '').toLowerCase().includes('menunggu pengesahan') ||
                         (app.status === 'Menunggu Persetujuan Kadis' && Boolean(contract.signed_document_url)) ||
                         Boolean(contract.signed_document_url && !isContractActive);

  const renderUploadModal = () => {
    if (!isUploadModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Modal */}
          <div className="bg-[#3c8dbc] px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2">
                <Upload className="w-4 h-4 text-white" />
                Upload Kontrak Payung Bertandatangan
              </h3>
              <p className="text-[11px] text-blue-100 mt-0.5 font-mono">{contract.contract_number}</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 cursor-pointer rounded-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Modal */}
          <div className="p-6">
            <div className="bg-[#f4f8fb] border border-[#e1ecf4] rounded-none p-3.5 flex gap-2.5 text-blue-900 text-xs mb-5 leading-relaxed">
              <Info className="w-4 h-4 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
              <p>
                Unggah berkas PDF Kontrak Payung yang telah dicetak, ditandatangani basah oleh pimpinan perusahaan di atas meterai Rp 10.000, dan di-scan secara lengkap.
              </p>
            </div>

            <div>
              <label htmlFor="modal-payung-upload" className="block text-xs font-bold text-slate-700 mb-2">
                Berkas PDF Kontrak Payung <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-slate-200 border-dashed rounded-none p-6 text-center hover:bg-slate-50 transition-colors group">
                <input 
                  type="file" 
                  id="modal-payung-upload"
                  ref={fileInputRef}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="modal-payung-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-[#3c8dbc] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-[#3c8dbc] hover:text-[#367fa9] mb-0.5">Pilih File PDF</span>
                  <span className="text-[10px] text-slate-500">Maksimal ukuran file 5 MB (format .pdf)</span>
                </label>

                {selectedFile && (
                  <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-none text-xs font-bold flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2 text-[#3c8dbc] flex-shrink-0" />
                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
            <button 
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-none text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              disabled={isUploading}
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleUploadSubmit}
              disabled={!selectedFile || isUploading}
              className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white font-bold text-xs rounded-none hover:bg-[#367fa9] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
              {isUploading ? 'Mengunggah...' : 'Simpan & Kirim ke Kadis'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // State 1: Dokumen sudah diunggah dan sedang menunggu pengesahan Kadis (Tampilan penuh serupa Step 2)
  if (isPendingKadis) {
    return (
      <div className="flex flex-col gap-6">
        {/* Kartu Menunggu Verifikasi & Pengesahan Kepala Dinas (Desain konsisten dengan Step 2) */}
        <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-none overflow-hidden">
          
          {/* Hero Banner Section */}
          <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <FileSignature className="w-64 h-64 text-[#3c8dbc]" />
            </div>
            
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e1ecf4]">
                <Loader2 className="w-10 h-10 text-[#3c8dbc] animate-spin" />
              </div>
              <div className="absolute inset-0 bg-[#3c8dbc] opacity-20 rounded-full blur-xl scale-150 -z-10"></div>
            </div>
            
            <div className="text-center md:text-left flex-1 z-10 mt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-none bg-blue-100/60 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
                Tahap 3 &bull; Kontrak Payung (PKS Induk)
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
                Menunggu Verifikasi &amp; Pengesahan Kepala Dinas
              </h2>
              <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
                Berkas scan <strong>Kontrak Payung (PKS Induk)</strong> yang telah Anda tandatangani basah dan bubuhi meterai telah berhasil kami terima. Saat ini berkas sedang dalam proses peninjauan dan pengesahan akhir oleh <strong className="text-slate-700">Kepala Dinas Perhubungan</strong>. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>. Setelah disahkan, Anda dapat langsung melanjutkan ke <strong className="text-slate-700">Tahap 4</strong> untuk pemilihan layanan dan unit hanggar.
              </p>
            </div>
          </div>

          {/* Rangkuman Berkas Kontrak Payung */}
          <div className="p-6 md:p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-[15px] font-bold text-slate-800 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                Rangkuman Berkas Kontrak Payung
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">
                PKS: {contract.contract_number}
              </span>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-none border border-slate-200">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kontrak Payung</p>
                <p className="text-[13px] text-slate-800 font-bold font-mono">{contract.contract_number}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Unggah TTD</p>
                <p className="text-[13px] text-slate-800 font-medium">
                  {contract.tenant_signature 
                    ? dayjs(contract.tenant_signature).format('DD MMMM YYYY, HH:mm') 
                    : (contract.updated_at ? dayjs(contract.updated_at).format('DD MMMM YYYY') : '-')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Dokumen</p>
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold bg-[#f39c12] text-white rounded">
                  Menunggu Pengesahan Kadis
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahap Selanjutnya</p>
                <p className="text-[12px] text-[#3c8dbc] font-bold">
                  Tahap 4 &bull; Pilih Detail Layanan Hanggar
                </p>
              </div>
            </div>

            {/* Kotak Berkas Terunggah */}
            <div className="border border-slate-200 rounded-none p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-none bg-blue-50 text-[#3c8dbc] flex items-center justify-center border border-blue-200 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Berkas Scan TTD Basah Terunggah</p>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                    Scan_Kontrak_Payung_{contract.contract_number ? contract.contract_number.replace(/\//g, '_') : 'Doc'}.pdf
                  </h4>
                  <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Berkas tersimpan di sistem UPBU &bull; Siap diverifikasi Kadis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {contract.signed_document_url && (
                  <a
                    href={resolveUrl(contract.signed_document_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-none transition-colors border border-slate-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                    Lihat Berkas Scan
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Unggah Ulang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pratinjau Dokumen Kontrak Payung di Bawahnya */}
        <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Dokumen Perjanjian Kerja Sama (PKS Induk)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Nomor: {contract.contract_number}
            </span>
          </div>
          <div className="p-4">
            <ContractPDFViewer contract={contract} tenant={contract.tenants || app.tenants} onClose={() => {}} isInline={true} />
          </div>
        </div>

        {renderUploadModal()}
      </div>
    );
  }

  // State 2: Kontrak sudah aktif disahkan Kadis
  if (isContractActive) {
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-emerald-50 border border-emerald-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-emerald-900">Kontrak Payung Telah Aktif & Disahkan</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                PKS Induk Anda telah disetujui dan disahkan oleh Kepala Dinas Perhubungan. Anda siap melanjutkan ke pemilihan armada dan hanggar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSuccess}
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-5 py-2.5 rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors flex-shrink-0"
          >
            Lanjut ke Pilih Layanan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Contract PDF Viewer */}
        <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Pratinjau Dokumen Kontrak Payung (PKS Induk)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Nomor: {contract.contract_number}
            </span>
          </div>
          <div className="p-4">
            <ContractPDFViewer contract={contract} tenant={contract.tenants || app.tenants} onClose={() => {}} isInline={true} />
          </div>
        </div>
      </div>
    );
  }

  // State 3: Menunggu TTD Tenant (Awal Masuk Step 3)
  return (
    <div className="flex flex-col gap-5">
      {/* Banner Panduan */}
      <div className="bg-[#f4f8fb] border-l-4 border-[#3c8dbc] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#3c8dbc] mt-0.5 border border-blue-200">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-[#3c8dbc] border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Langkah Wajib Mitra Baru
                </span>
                <span className="text-xs font-mono font-bold text-blue-900">
                  {contract.contract_number}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-base mt-1">
                Persetujuan & Tanda Tangan Kontrak Payung (PKS Induk)
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Surat Permohonan Anda <strong>telah disetujui oleh Kepala Dinas</strong>. Sesuai regulasi UPBU Mozes Kilangin, 
                sebelum dapat memilih jadwal dan unit hanggar, Anda wajib menandatangani <strong>Perjanjian Kerja Sama (PKS) Kontrak Payung</strong> sebagai 
                perjanjian induk operasional maskapai.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById('download-pdf-btn')?.click()}
              className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-none flex items-center justify-center shadow-xs transition-colors cursor-pointer flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-1.5" /> Unduh Draft PDF
            </button>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-4 py-2.5 rounded-none flex items-center justify-center shadow-xs transition-colors cursor-pointer flex-1 sm:flex-none"
            >
              <Upload className="w-4 h-4 mr-1.5" /> Upload TTD Basah
            </button>
          </div>
        </div>

        {/* 3 Step Instruction Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/60">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">1</span>
            <span>Unduh & cetak draf kontrak payung</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">2</span>
            <span>Tanda tangan basah + meterai Rp 10.000</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">3</span>
            <span>Scan dokumen PDF & unggah kembali</span>
          </div>
        </div>
      </div>

      {/* Inline Contract PDF Viewer */}
      <div className="bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Pratinjau Dokumen Kontrak Payung (PKS Induk)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Nomor: {contract.contract_number}
          </span>
        </div>
        <div className="p-4">
          <ContractPDFViewer contract={contract} tenant={contract.tenants || app.tenants} onClose={() => {}} isInline={true} />
        </div>
      </div>

      {renderUploadModal()}
    </div>
  );
};
