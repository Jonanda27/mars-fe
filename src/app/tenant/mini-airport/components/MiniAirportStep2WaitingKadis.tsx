"use client";

import React, { useState, useRef } from 'react';
import { 
  FileText, Loader2, CheckCircle2, ExternalLink, Upload, 
  FileSignature, Download, AlertCircle, X, ArrowRight, 
  ShieldCheck, Info, Clock 
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import toast from 'react-hot-toast';
import { RentalApplication } from '@/types/rental';
import { rentalService } from '@/services/rentalService';
import { getErrorMessage } from '@/services/api';
import { resolveUrl } from '@/utils/url';
import ContractPDFViewer from '@/components/ContractPDFViewer';

dayjs.locale('id');

interface MiniAirportStep2WaitingKadisProps {
  readonly app: RentalApplication;
  readonly onSuccess?: (updatedApp: RentalApplication) => void;
  readonly isReadOnly?: boolean;
}

export const MiniAirportStep2WaitingKadis: React.FC<MiniAirportStep2WaitingKadisProps> = ({
  app,
  onSuccess,
  isReadOnly = false
}) => {
  // States for Official Letter upload / replace
  const [isUploadingOfficial, setIsUploadingOfficial] = useState(false);
  const [isDraggingOfficial, setIsDraggingOfficial] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for PKS Payung signed upload (sub-alur PKS)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPayungFile, setSelectedPayungFile] = useState<File | null>(null);
  const [isUploadingPayung, setIsUploadingPayung] = useState(false);
  const payungFileInputRef = useRef<HTMLInputElement>(null);

  const statusLower = (app.status || '').toLowerCase().trim();
  const rawContract = app.contracts;
  const contract = rawContract
    ? {
        ...rawContract,
        tenants: rawContract.tenants || app.tenants,
      }
    : null;
  const contractStatusLower = (contract?.status || '').toLowerCase().trim();

  // Mini airport metadata from contract or application specific_needs
  const fasilitas = (contract?.fasilitas as any) || {};
  let spec = (app.specific_needs as any) || {};
  if (typeof spec === 'string') {
    try { spec = JSON.parse(spec); } catch (e) { spec = {}; }
  }

  const airportName = fasilitas.airport_name || spec.airport_name || 'Mini Airport Perintis';
  const airportCode = (fasilitas.airport_code || spec.airport_code || 'MINI').toUpperCase();
  const airportLocation = fasilitas.airport_location || spec.airport_location || 'Papua Tengah';

  // Sub-alur State Check:
  const isContractActive = contract?.status === 'Aktif' || contract?.status === 'Active';
  const isSigningPayung = 
    Boolean(contract && !isContractActive) && 
    (statusLower === 'menunggu ttd kontrak payung' || 
     statusLower === 'menunggu ttd tenant' ||
     contractStatusLower === 'menunggu ttd tenant');

  const isWaitingEndorsement = 
    Boolean(contract && !isContractActive) &&
    (statusLower === 'menunggu pengesahan kadis' || 
     contractStatusLower === 'menunggu pengesahan kadis' ||
     Boolean(contract?.signed_document_url && !isContractActive && !isSigningPayung));

  // Handler: Upload or replace official letter (Surat Permohonan Resmi)
  const handleUploadOfficialLetter = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Format berkas harus PDF');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran berkas maksimal 10MB');
      return;
    }

    try {
      setIsUploadingOfficial(true);
      const formData = new FormData();
      formData.append('official_letter', file);
      const updatedApp = await rentalService.uploadOfficialLetter(app.id, formData);
      toast.success('Surat permohonan resmi berhasil diperbarui!');
      onSuccess?.(updatedApp);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal mengunggah berkas surat'));
    } finally {
      setIsUploadingOfficial(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleOfficialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadOfficialLetter(file);
    }
  };

  const handleOfficialDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOfficial(false);
    if (e.dataTransfer.files?.[0]) {
      handleUploadOfficialLetter(e.dataTransfer.files[0]);
    }
  };

  // Handler: Upload scan TTD basah PKS Payung
  const processSignedPayungFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Format berkas harus PDF');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran berkas maksimal 10MB');
      return;
    }
    setSelectedPayungFile(file);
    toast.success(`Berkas terpilih: ${file.name}`);
  };

  const handleUploadSignedPayung = async () => {
    if (!selectedPayungFile) {
      toast.error('Silakan pilih file PDF hasil scan TTD basah terlebih dahulu');
      return;
    }

    try {
      setIsUploadingPayung(true);
      const formData = new FormData();
      formData.append('signature_file', selectedPayungFile);

      const updatedApp = await rentalService.uploadPayungSignature(app.id, formData);
      toast.success('Berkas PKS Payung berhasil diunggah! Dokumen kini dalam proses pengesahan Kepala Dinas.');
      setIsUploadModalOpen(false);
      setSelectedPayungFile(null);
      onSuccess?.(updatedApp);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal mengunggah berkas Kontrak Payung'));
    } finally {
      setIsUploadingPayung(false);
    }
  };

  // Render Modal Upload Scan TTD Basah PKS Payung
  const renderPayungUploadModal = () => {
    if (!isUploadModalOpen || !contract) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Modal */}
          <div className="bg-[#3c8dbc] px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2">
                <Upload className="w-4 h-4 text-white" />
                Upload PKS Payung Bertandatangan
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
                Unggah berkas PDF PKS Payung Bandara {airportName} yang telah dicetak, ditandatangani basah oleh pimpinan perusahaan di atas meterai Rp 10.000, dibubuhi cap basah, dan di-scan lengkap.
              </p>
            </div>

            <div>
              <label htmlFor="modal-payung-upload" className="block text-xs font-bold text-slate-700 mb-2">
                Berkas PDF PKS Payung <span className="text-red-500">*</span>
              </label>
              <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files?.[0]) {
                    processSignedPayungFile(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-slate-200 border-dashed rounded-none p-6 text-center hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <input 
                  type="file" 
                  id="modal-payung-upload"
                  ref={payungFileInputRef}
                  accept="application/pdf,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) processSignedPayungFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <label htmlFor="modal-payung-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-[#3c8dbc] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-[#3c8dbc] hover:text-[#367fa9] mb-0.5">Pilih File PDF atau Drop Berkas di Sini</span>
                  <span className="text-[10px] text-slate-500">Maksimal ukuran file 10 MB (format .pdf)</span>
                </label>

                {selectedPayungFile && (
                  <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-none text-xs font-bold flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2 text-[#3c8dbc] flex-shrink-0" />
                    <span className="truncate max-w-[220px]">{selectedPayungFile.name}</span>
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
              disabled={isUploadingPayung}
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleUploadSignedPayung}
              disabled={!selectedPayungFile || isUploadingPayung}
              className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white font-bold text-xs rounded-none hover:bg-[#367fa9] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
            >
              {isUploadingPayung ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
              {isUploadingPayung ? 'Mengunggah...' : 'Simpan & Kirim ke Kadis'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // SUB-ALUR 1: PKS PAYUNG TELAH DIAKTIFKAN KADIS
  // =========================================================================
  if (isContractActive && contract) {
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-emerald-50 border border-emerald-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-emerald-900">
                PKS Payung Bandara {airportName} ({airportCode}) Telah Aktif & Disahkan
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Perjanjian Kerja Sama Induk Anda telah disahkan oleh Kepala Dinas Perhubungan. Anda siap melanjutkan ke pemilihan armada dan jadwal operasional penerbangan perintis.
              </p>
            </div>
          </div>
          {!isReadOnly ? (
            <button
              type="button"
              onClick={() => onSuccess?.(app)}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-5 py-2.5 rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors flex-shrink-0"
            >
              Lanjut ke Pilih Layanan & Armada <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="bg-white border border-emerald-300 text-emerald-800 font-bold text-xs px-4 py-2 flex items-center gap-1.5 flex-shrink-0 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tahap 2 Selesai &bull; Kontrak Payung Aktif
            </div>
          )}
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

  // =========================================================================
  // SUB-ALUR 2: MENUNGGU PENGESAHAN KADIS ATAS PKS PAYUNG YANG SUDAH DITANDATANGANI
  // =========================================================================
  if (isWaitingEndorsement && contract) {
    return (
      <div className="flex flex-col gap-6">
        {/* Hero Banner Section (Desain identik dengan Permohonan Sewa) */}
        <div className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-[#f4f8fb] to-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start border-b border-[#e1ecf4] relative overflow-hidden">
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
              <div className="inline-flex items-center px-3 py-1 rounded bg-blue-100/50 text-[#3c8dbc] border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
                Tahap 2 &bull; Kontrak Payung (PKS Induk)
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
                Menunggu Verifikasi &amp; Pengesahan Kepala Dinas
              </h2>
              <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
                Berkas scan <strong>Kontrak Payung (PKS Induk) Bandara {airportName} ({airportCode})</strong> yang telah Anda tandatangani basah dan bubuhi meterai telah berhasil kami terima. Saat ini berkas sedang dalam proses peninjauan dan pengesahan akhir oleh <strong className="text-slate-700">Kepala Dinas Perhubungan</strong>. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>. Setelah disahkan, Anda dapat langsung melanjutkan ke <strong className="text-slate-700">Tahap 3</strong> untuk pemilihan armada dan jadwal operasional.
              </p>
            </div>
          </div>

          {/* Rangkuman Berkas Kontrak Payung */}
          <div className="p-8 md:p-12 bg-white space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                Rangkuman Berkas Kontrak Payung
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">
                PKS: {contract.contract_number}
              </span>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/80 p-6 rounded-lg border border-slate-100">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kontrak Payung</p>
                <p className="text-[14px] text-slate-800 font-bold font-mono">{contract.contract_number}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Unggah TTD</p>
                <p className="text-[14px] text-slate-800 font-medium">
                  {contract.tenant_signature 
                    ? dayjs(contract.tenant_signature).format('DD MMMM YYYY, HH:mm') 
                    : (contract.updated_at ? dayjs(contract.updated_at).format('DD MMMM YYYY') : '-')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bandara Tujuan</p>
                <p className="text-[14px] text-slate-800 font-medium">Bandara {airportName} ({airportCode})</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahap Selanjutnya</p>
                <p className="text-[13px] text-[#3c8dbc] font-semibold">
                  Tahap 3 &bull; Pilih Layanan & Armada
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
                    Scan_PKS_Payung_{airportCode}_{contract.contract_number ? contract.contract_number.replace(/\//g, '_') : 'Doc'}.pdf
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
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none transition-colors shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Unggah Ulang
                  </button>
                )}
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

        {renderPayungUploadModal()}
      </div>
    );
  }

  // =========================================================================
  // SUB-ALUR 3: MENUNGGU TANDA TANGAN DRAF PKS PAYUNG OLEH TENANT
  // =========================================================================
  if (isSigningPayung && contract) {
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
                    Langkah Wajib PKS Induk
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-900">
                    {contract.contract_number}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base mt-1">
                  Persetujuan &amp; Tanda Tangan PKS Payung - Bandara {airportName} ({airportCode})
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Surat Permohonan Anda <strong>telah disetujui oleh Kepala Dinas</strong>. Sesuai regulasi kebandarudaraan, 
                  sebelum dapat memilih jadwal pendaratan dan alokasi stand apron di Bandara {airportName}, Anda wajib menandatangani 
                  <strong> Perjanjian Kerja Sama (PKS) Kontrak Payung</strong> sebagai payung hukum operasional penerbangan perintis (berlaku 1 tahun kalender).
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
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-4 py-2.5 rounded-none flex items-center justify-center shadow-xs transition-colors cursor-pointer flex-1 sm:flex-none"
                >
                  <Upload className="w-4 h-4 mr-1.5" /> Upload TTD Basah
                </button>
              )}
            </div>
          </div>

          {/* 3 Step Instruction Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/60">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">1</span>
              <span>Unduh &amp; cetak draf PKS Payung</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">2</span>
              <span>Tanda tangan basah + meterai Rp 10.000</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3c8dbc] border border-blue-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">3</span>
              <span>Scan dokumen PDF &amp; unggah kembali</span>
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

        {renderPayungUploadModal()}
      </div>
    );
  }

  // =========================================================================
  // KONDISI UTAMA: MENUNGGU VERIFIKASI KEPALA DINAS ATAS SURAT PERMOHONAN RESMI
  // (Layout 100% konsisten dengan Step1WaitingLetter pada Permohonan Sewa)
  // =========================================================================
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
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Menunggu Verifikasi Kepala Dinas</h2>
          <p className="text-slate-600 text-[14px] leading-relaxed max-w-3xl">
            Surat permohonan penerbangan perintis / izin operasional Mini Airport resmi yang Anda ajukan telah kami terima dengan baik. Saat ini, berkas permohonan sedang dalam proses peninjauan dan persetujuan oleh <strong className="text-slate-700">Kepala Dinas Perhubungan</strong>. Proses ini biasanya memakan waktu <strong className="text-slate-700">1-2 hari kerja</strong>.
          </p>
        </div>
      </div>

      {/* Rangkuman Pengajuan & Pratinjau Dokumen */}
      <div className="p-8 md:p-12 bg-white space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Rangkuman Surat Permohonan
          </h3>
          <span className="text-xs font-bold text-slate-400">ID: {app.application_number}</span>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/80 p-6 rounded-lg border border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Permohonan</p>
            <p className="text-[14px] text-slate-800 font-bold">{app.application_number}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Pengajuan</p>
            <p className="text-[14px] text-slate-800 font-medium">
              {app.created_at ? dayjs(app.created_at).format('DD MMMM YYYY') : '-'}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bandara Tujuan</p>
            <p className="text-[14px] text-slate-800 font-medium">
              Bandara {airportName} ({airportCode})
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahap Berikutnya</p>
            <p className="text-[13px] text-[#3c8dbc] font-semibold">
              Penerbitan PKS Payung &amp; Armada
            </p>
          </div>
        </div>

        {/* Tujuan / Perihal */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal Permohonan</p>
          <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-md">
            <p className="text-[14px] text-slate-700 leading-relaxed">
              {app.purpose || 'Permohonan Izin Operasional Penerbangan Perintis'}
            </p>
          </div>
        </div>

        {/* Document Viewer Section */}
        <div 
          className="border-t border-slate-200 pt-6"
          onDragOver={(e) => { 
            if (isReadOnly) return;
            e.preventDefault(); e.stopPropagation(); setIsDraggingOfficial(true); 
          }}
          onDragLeave={(e) => { 
            if (isReadOnly) return;
            e.preventDefault(); e.stopPropagation(); setIsDraggingOfficial(false); 
          }}
          onDrop={(e) => {
            if (isReadOnly) return;
            handleOfficialDrop(e);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleOfficialFileChange}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                Dokumen Surat Permohonan Resmi
              </h4>
              <p className="text-xs text-slate-500 mt-1">Pratinjau berkas yang diajukan ke Kepala Dinas</p>
            </div>
            
            <div className="flex items-center gap-2">
              {app.official_letter_url && (
                <>
                  {!isReadOnly && (
                    <button
                      type="button"
                      disabled={isUploadingOfficial}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-none font-semibold transition-colors border border-slate-300 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingOfficial ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
                      Ganti Berkas
                    </button>
                  )}
                  <a 
                    href={resolveUrl(app.official_letter_url)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-[13px] bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded-none font-semibold transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" /> Buka di Tab Baru
                  </a>
                </>
              )}
            </div>
          </div>
          
          {app.official_letter_url ? (
            <div className={`p-2 md:p-3 rounded-none shadow-inner border transition-all ${
              isDraggingOfficial ? 'border-[#3c8dbc] bg-blue-50/50' : 'bg-slate-200 border-slate-300'
            }`}>
              <iframe 
                src={`${resolveUrl(app.official_letter_url)}#toolbar=1`}
                title="Dokumen Surat Permohonan Resmi"
                className="w-full h-[650px] md:h-[800px] rounded-none bg-white border border-slate-300 shadow-sm"
              />
            </div>
          ) : (
            <div className={`border-2 border-dashed rounded-none p-10 flex flex-col items-center justify-center text-center transition-all ${
              isDraggingOfficial ? 'border-[#3c8dbc] bg-blue-100/50' : 'border-blue-300 bg-blue-50/40'
            }`}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#3c8dbc] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-[15px] font-bold text-slate-800 mb-1">Dokumen Surat Permohonan Belum Terlampir</h4>
              <p className="text-xs text-slate-500 max-w-md mb-4">
                Berkas surat permohonan resmi belum tersimpan pada sistem. Silakan pilih dan unggah dokumen surat permohonan Anda dalam format PDF atau tarik dan lepas file di sini.
              </p>
              {!isReadOnly && (
                <button
                  type="button"
                  disabled={isUploadingOfficial}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-5 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-none shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isUploadingOfficial ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Mengunggah Berkas...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1.5" />
                      Pilih &amp; Unggah Surat PDF
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MiniAirportStep2WaitingKadis;
