"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  FileCheck,
  Sparkles,
  Info,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { rentalService } from '@/services/rentalService';
import { getErrorMessage } from '@/services/api';
import { SuratPermohonanMiniAirportTemplate } from './SuratPermohonanMiniAirportTemplate';
import { RentalApplication } from '@/types/rental';
import { MiniAirportItem } from './types';
import { resolveUrl } from '@/utils/url';

interface MiniAirportStep1LetterProps {
  tenantName: string;
  tenantAddress?: string;
  miniAirports?: MiniAirportItem[];
  onSuccess: (newApp: RentalApplication) => void;
  onCancel?: () => void;
  isReadOnly?: boolean;
  app?: RentalApplication | null;
}

const QUICK_PURPOSE_PRESETS = [
  'Permohonan Izin Operasional Penerbangan Perintis & Pendaratan Lapangan Terbang Perintis',
  'Pelayanan Angkutan Udara Penumpang Perintis & Mobilitas Masyarakat Pedalaman',
  'Penerbangan Distribusi Kargo Bahan Pokok (Bapok) dan Obat-Obatan ke Pedalaman',
  'Operasional Medis Darurat & Evakuasi Pasien (Medevac) di Wilayah Pegunungan'
];

export const MiniAirportStep1Letter: React.FC<MiniAirportStep1LetterProps> = ({
  tenantName,
  tenantAddress,
  miniAirports = [],
  onSuccess,
  onCancel,
  isReadOnly = false,
  app
}) => {
  const appSpec = useMemo(() => {
    if (!app?.specific_needs) return {};
    if (typeof app.specific_needs === 'string') {
      try {
        return JSON.parse(app.specific_needs);
      } catch (e) {
        return {};
      }
    }
    return app.specific_needs;
  }, [app?.specific_needs]);

  const initialAirportId = appSpec.airport_id || (miniAirports.length > 0 ? miniAirports[0].id : '');
  const initialPurpose = app?.purpose || appSpec.purpose || 'Permohonan Izin Operasional Penerbangan Perintis & Pendaratan Lapangan Terbang Perintis';

  const [selectedAirportId, setSelectedAirportId] = useState<number | ''>(initialAirportId);
  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [officialLetter, setOfficialLetter] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (app) {
      if (appSpec.airport_id) {
        setSelectedAirportId(Number(appSpec.airport_id));
      }
      if (app.purpose || appSpec.purpose) {
        setPurpose(app.purpose || appSpec.purpose);
      }
    }
  }, [app, appSpec]);

  const selectedAirport = miniAirports.find(a => a.id === Number(selectedAirportId)) || null;

  const handleDownloadTemplate = async () => {
    if (!templateRef.current) return;
    try {
      setIsDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = templateRef.current;
      const airportCode = selectedAirport?.kode_bandara || 'MINI';
      const opt = {
        margin: 0,
        filename: `Surat_Permohonan_${airportCode}_${tenantName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Template surat resmi berhasil diunduh. Silakan cetak, bubuhkan cap & tanda tangan basah, lalu unggah kembali.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal mengunduh template surat resmi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const processSelectedFile = (file: File) => {
    if (isReadOnly) return;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format berkas harus PDF, JPG, atau PNG');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran berkas maksimal 10MB');
      return;
    }
    setOfficialLetter(file);
    toast.success(`Berkas terpilih: ${file.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!selectedAirport) {
      toast.error('Harap pilih bandara perintis (Mini Airport) tujuan!');
      return;
    }
    if (!purpose.trim()) {
      toast.error('Harap masukkan perihal / tujuan permohonan!');
      return;
    }
    if (!officialLetter) {
      toast.error('Harap unggah Surat Permohonan Resmi bertandatangan!');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('purpose', purpose);
      formData.append('application_type', 'Mini Airport');
      formData.append('official_letter', officialLetter);
      formData.append('airport_id', String(selectedAirport.id));
      formData.append('airport_code', selectedAirport.kode_bandara);
      formData.append('airport_name', selectedAirport.nama_bandara);
      if (selectedAirport.lokasi) {
        formData.append('airport_location', selectedAirport.lokasi);
      }
      formData.append('specific_needs', JSON.stringify({
        airport_id: selectedAirport.id,
        airport_code: selectedAirport.kode_bandara,
        airport_name: selectedAirport.nama_bandara,
        airport_location: selectedAirport.lokasi
      }));

      const newApp = await rentalService.createApplication(formData);
      toast.success(`Surat permohonan ke ${selectedAirport.nama_bandara} berhasil diajukan! Menunggu disposisi Kadis.`);
      onSuccess(newApp);
    } catch (error: any) {
      console.error('Error creating application:', error);
      toast.error(getErrorMessage(error) || 'Gagal mengajukan surat permohonan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Hidden printable template untuk export PDF akurat */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <SuratPermohonanMiniAirportTemplate
          ref={templateRef}
          tenantName={tenantName}
          tenantAddress={tenantAddress}
          purpose={purpose}
          airportName={selectedAirport?.nama_bandara}
          airportCode={selectedAirport?.kode_bandara}
        />
      </div>

      {/* Main Container Card (Persis Form Permohonan Sewa) */}
      <form onSubmit={handleSubmit} className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        
        {/* Header Bar */}
        <div className="p-3 border-b border-[#f4f4f4] bg-slate-50 flex items-center justify-between">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Surat Permohonan Resmi
            <span className="text-xs font-normal text-slate-500 ml-2">Mini Airport</span>
          </h3>
          {onCancel && !isReadOnly && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Batalkan &amp; Kembali
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Info Box Alur (Persis Permohonan Sewa) */}
          <div className="bg-blue-50/50 border-l-4 border-blue-500 rounded-r-lg p-5 flex gap-4 text-blue-900">
            <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[15px] mb-1">Alur Permohonan Mini Airport</h4>
              <p className="text-[14px] text-blue-800/80 leading-relaxed">
                {isReadOnly ? (
                  'Langkah ini telah selesai diajukan dan telah disahkan oleh pihak berwenang. Dokumen dan parameter surat permohonan terkunci dalam mode baca (read-only).'
                ) : (
                  <>
                    Pilih bandara perintis tujuan dan perihal operasional, lalu unggah <strong>Surat Permohonan Resmi</strong> (ber-Kop Surat, ditandatangani, dan distempel). Jika belum memiliki draf surat, sistem dapat membuatkan template PDF otomatis untuk Anda cetak dan tandatangani. Setelah disetujui Kepala Dinas, Anda dapat melanjutkan ke pemilihan layanan operasional &amp; armada pesawat.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* DUA KOLOM SEIMBANG: KIRI (7 COLS) & KANAN (5 COLS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ============================================================ */}
            {/* KOLOM KIRI (7 cols): Form Inputs & Unduh Draft PDF          */}
            {/* ============================================================ */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Row 1: Dua Input Berdampingan (Bandara Tujuan & Perihal Surat) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="airport_select" className="block text-[14px] font-semibold text-slate-700 mb-2">
                    Bandara Perintis Tujuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="airport_select"
                    value={selectedAirportId}
                    disabled={isReadOnly}
                    onChange={(e) => !isReadOnly && setSelectedAirportId(e.target.value ? Number(e.target.value) : '')}
                    required
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-md text-[14px] outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] transition-all bg-white shadow-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Pilih Bandara Mini Airport --</option>
                    {miniAirports.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        [{airport.kode_bandara}] {airport.nama_bandara}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="purpose_input" className="block text-[14px] font-semibold text-slate-700 mb-2">
                    Perihal Permohonan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="purpose_input"
                    type="text"
                    value={purpose}
                    disabled={isReadOnly}
                    onChange={(e) => !isReadOnly && setPurpose(e.target.value)}
                    placeholder="Cth: Permohonan Izin Operasional..."
                    required
                    className="w-full border border-slate-300 px-4 py-2.5 rounded-md text-[14px] outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] transition-all bg-white shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Saran Perihal Cepat (Klik untuk memilih) */}
              {!isReadOnly && (
                <div className="space-y-1.5">
                  <div className="text-[12px] font-semibold text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f39c12]" />
                    Saran Perihal Cepat:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PURPOSE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPurpose(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border text-left transition-all cursor-pointer leading-tight ${
                          purpose === preset
                            ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] font-medium shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#3c8dbc] hover:text-[#3c8dbc] hover:bg-blue-50/30'
                        }`}
                        title={preset}
                      >
                        {preset.length > 42 ? preset.slice(0, 40) + '...' : preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Bandara Terpilih (Sleek Horizontal Pill) */}
              {selectedAirport && (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-blue-100 text-[#3c8dbc] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                      {selectedAirport.kode_bandara}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {selectedAirport.nama_bandara}{' '}
                        <span className="font-normal text-slate-500">
                          &bull; {selectedAirport.lokasi || 'Papua Tengah'}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tujuan: Kepala Dinas Perhubungan Prov. Papua Tengah
                      </p>
                    </div>
                  </div>
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold self-start sm:self-auto">
                    PKS Payung 1 Tahun
                  </span>
                </div>
              )}

              {/* Unduh Draft PDF Banner (Persis Permohonan Sewa) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[14px] text-slate-800 mb-1 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-[#3c8dbc]" /> Belum memiliki format surat?
                    </h4>
                    <p className="text-[13px] text-slate-500">
                      Sistem dapat membuatkan draft otomatis ber-Kop {tenantName} sesuai bandara tujuan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading || !selectedAirport}
                    className="whitespace-nowrap bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 px-4 rounded-md text-[13px] font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#3c8dbc]" />
                        <span>Menyiapkan PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#3c8dbc]" />
                        <span>Unduh Draft PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* ============================================================ */}
            {/* KOLOM KANAN (5 cols): Unggah Dokumen Surat Resmi             */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Dokumen Surat Resmi {isReadOnly ? '(Arsip)' : <span className="text-red-500">*</span>}</span>
                  <span className="text-[11px] text-slate-400 font-normal">PDF, JPG, PNG (Maks 10MB)</span>
                </label>

                {isReadOnly ? (
                  /* Read-Only Mode */
                  <div className="mt-1 p-5 border border-slate-200 rounded-lg bg-slate-50/70 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 font-mono truncate">
                          {app?.official_letter_url
                            ? app.official_letter_url.split('/').pop()
                            : `Surat_Permohonan_${selectedAirport?.kode_bandara || 'MINI'}_Resmi.pdf`}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Dokumen resmi telah tersimpan &amp; disahkan
                        </p>
                      </div>
                    </div>

                    {app?.official_letter_url && (
                      <a
                        href={resolveUrl(app.official_letter_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-[#3c8dbc] bg-white border border-[#3c8dbc] rounded-md hover:bg-blue-50 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Lihat Berkas PDF
                      </a>
                    )}
                  </div>
                ) : !officialLetter ? (
                  /* Active Upload Dropzone (Persis Permohonan Sewa) */
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-1 flex justify-center px-6 pt-9 pb-9 border-2 border-dashed rounded-lg transition-all group relative cursor-pointer ${
                      isDragging
                        ? 'border-[#3c8dbc] bg-blue-100/70 ring-2 ring-[#3c8dbc]/40 scale-[1.01]'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 bg-slate-50/40'
                    }`}
                  >
                    <input
                      id="officialLetterInput"
                      name="officialLetterInput"
                      type="file"
                      accept=".pdf,image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-3 text-center pointer-events-none">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col text-[14px] text-slate-600 justify-center">
                        <p className="font-semibold text-blue-600">Pilih file dokumen</p>
                        <p className="mt-1 text-xs text-slate-500">atau seret dan lepas ke sini</p>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Format PDF, JPG, PNG (Maks. 10MB)</p>
                    </div>
                  </div>
                ) : (
                  /* File Attached State (Persis Permohonan Sewa) */
                  <div className="mt-1 flex flex-col items-center justify-center px-6 py-6 border-2 border-blue-400 bg-blue-50/50 rounded-lg transition-all shadow-sm">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-sm transform transition-transform hover:scale-105">
                      <FileText className="w-7 h-7" />
                    </div>
                    <p className="text-[13px] font-bold text-slate-800 text-center truncate w-full px-2 mb-0.5" title={officialLetter.name}>
                      {officialLetter.name}
                    </p>
                    <p className="text-[12px] text-blue-600 font-semibold mb-3">
                      {(officialLetter.size / 1024 / 1024).toFixed(2)} MB &bull; File siap diunggah
                    </p>
                    
                    <button
                      type="button"
                      onClick={() => setOfficialLetter(null)}
                      className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-md text-[13px] font-semibold transition-colors shadow-sm text-slate-600 cursor-pointer"
                    >
                      Ganti File
                    </button>
                  </div>
                )}
              </div>

              {/* Status Checklist di Bawah Kolom Kanan */}
              <div className="pt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                <div className={`p-2 rounded border flex items-center gap-1.5 justify-center ${
                  selectedAirport ? 'bg-green-50 text-green-800 border-green-200 font-medium' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {selectedAirport ? <Check className="w-3.5 h-3.5 text-[#00a65a]" /> : <span className="text-slate-400">•</span>}
                  <span className="truncate">Bandara Dipilih</span>
                </div>

                <div className={`p-2 rounded border flex items-center gap-1.5 justify-center ${
                  purpose.trim() ? 'bg-green-50 text-green-800 border-green-200 font-medium' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {purpose.trim() ? <Check className="w-3.5 h-3.5 text-[#00a65a]" /> : <span className="text-slate-400">•</span>}
                  <span className="truncate">Perihal Terisi</span>
                </div>

                <div className={`p-2 rounded border flex items-center gap-1.5 justify-center ${
                  (officialLetter || isReadOnly) ? 'bg-green-50 text-green-800 border-green-200 font-medium' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {(officialLetter || isReadOnly) ? <Check className="w-3.5 h-3.5 text-[#00a65a]" /> : <span className="text-slate-400">•</span>}
                  <span className="truncate">Berkas Diunggah</span>
                </div>
              </div>

            </div>

          </div>

          {/* Form Actions Footer (Persis Permohonan Sewa) */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-[12px] text-slate-500 flex items-center gap-1.5 text-center sm:text-left">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isReadOnly 
                  ? 'Berkas permohonan ini telah diverifikasi dan disahkan oleh pihak berwenang.'
                  : 'Setelah diajukan, berkas akan diteruskan ke Kepala Dinas Perhubungan untuk disposisi persetujuan.'}
              </span>
            </div>

            {isReadOnly ? (
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tahap 1 Selesai &bull; Surat Permohonan Telah Disahkan
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !officialLetter || !selectedAirport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-2 px-6 rounded-sm text-[14px] font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Mengajukan Permohonan...
                  </>
                ) : (
                  <>
                    Kirim Permohonan
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </form>
    </div>
  );
};
