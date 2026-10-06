"use client";

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Building2, User, Phone, Mail, 
  AlertTriangle, CheckCircle2, RotateCcw, ArrowLeft, 
  Loader2, FileText, Printer, Eye, Sparkles, ZoomIn, ZoomOut
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import SuratPKSDarurat from '@/components/SuratPKSDarurat';
import { SuratPKSDaruratModal } from '@/components/SuratPKSDaruratModal';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const EMERGENCY_REASONS = [
  'Kerusakan Teknis / Engine Issue',
  'Kegagalan Sistem Hidrolik / Kelistrikan',
  'Cuaca Ekstrem / Pengalihan Pendaratan (Divert)',
  'Darurat Medis / Aviasi Penumpang & Awak',
  'Pemeriksaan Teknis Khusus / Unscheduled Maintenance',
  'Lainnya'
];

export default function BuatKontrakDaruratPage() {
  const router = useRouter();

  // Form State
  const [airlineName, setAirlineName] = useState('');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [emergencyReason, setEmergencyReason] = useState(EMERGENCY_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  // Signature State
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdContract, setCreatedContract] = useState<Contract | null>(null);

  // Preview Zoom & Page State
  const [previewZoom, setPreviewZoom] = useState<number>(0.65);
  const [activePreviewPage, setActivePreviewPage] = useState<'all' | '1' | '2'>('all');

  const finalReason = emergencyReason === 'Lainnya' ? customReason : emergencyReason;

  // Signature Handlers
  const handleSignatureEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setHasSignature(true);
      try {
        const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
        setSignatureDataUrl(dataUrl);
      } catch (err) {
        console.error('Error getting trimmed canvas signature:', err);
      }
    }
  };

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    setHasSignature(false);
    setSignatureDataUrl(null);
  };

  // Live Dynamic Preview Contract Object
  const previewContract = useMemo<Contract>(() => {
    const today = new Date().toISOString();
    return {
      id: 999999,
      contract_number: `PKS-EMG/${dayjs().format('YYYY/MM')}/DRAFT`,
      contract_type: 'PKS Pendaratan Darurat',
      status: 'Active',
      start_date: today,
      end_date: null,
      periode_pembayaran: 'Pasca-Checkout',
      tenants: {
        id: 0,
        nama_perusahaan: airlineName.trim() || 'Nama Maskapai / Operator Penerbangan',
        pic: picName.trim() || 'Capt. Pilot In Command (PIC)',
        nomor_telepon: picPhone.trim() || '-',
        email: picEmail.trim() || '-',
      },
      fasilitas: JSON.stringify({
        pic_name: picName.trim() || 'Capt. Pilot In Command (PIC)',
        pic_phone: picPhone.trim() || '-',
        pic_email: picEmail.trim() || '-',
        emergency_reason: finalReason.trim() || 'Pendaratan Darurat Insidentil',
        parking_location: 'Apron / Hanggar (Ditentukan Petugas Lapangan)',
        registration_number: 'Menunggu Pencatatan Petugas Lapangan',
      }),
      tenant_signature: signatureDataUrl || null,
      admin_signature: null,
      created_at: today,
      updated_at: today,
    } as any;
  }, [airlineName, picName, picPhone, picEmail, finalReason, signatureDataUrl]);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!airlineName.trim()) {
      toast.error('Nama maskapai / operator wajib diisi');
      return;
    }

    if (!picName.trim()) {
      toast.error('Nama PIC / Perwakilan maskapai wajib diisi');
      return;
    }

    if (!picEmail.trim() || !picEmail.includes('@')) {
      toast.error('Email aktif PIC wajib diisi dengan benar untuk pengiriman e-SKRD');
      return;
    }

    if (!hasSignature || !signatureDataUrl) {
      toast.error('Tanda tangan perwakilan maskapai wajib diisi di kanvas');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        airline_name: airlineName.trim(),
        pic_name: picName.trim(),
        pic_phone: picPhone.trim(),
        pic_email: picEmail.trim(),
        emergency_reason: finalReason.trim() || 'Pendaratan Darurat',
        tenant_signature: signatureDataUrl
      };

      const res = await contractService.createEmergencyContract(payload);
      const resultContract = res?.data?.contract || res?.contract;

      toast.success('PKS Pendaratan Darurat Berhasil Diterbitkan dan Berstatus Aktif!');
      
      if (resultContract) {
        setCreatedContract(resultContract);
      } else {
        router.push('/dinas/kontrak');
      }
    } catch (err: any) {
      console.error('Error creating emergency contract:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal menerbitkan PKS Darurat');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Penerbitan PKS Darurat <span className="text-[15px] font-light text-[#777] ml-2">Dinas Perhubungan Kab. Mimika</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <Link href="/dinas" className="hover:underline">Dinas</Link>
          <span className="mx-1">/</span>
          <Link href="/dinas/kontrak" className="hover:underline">Kontrak</Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-slate-800">Buat PKS Darurat</span>
        </div>
      </header>

      {/* Back Button */}
      <div className="mb-4">
        <Link
          href="/dinas/kontrak"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Kontrak</span>
        </Link>
      </div>

      {/* Split-Screen Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================== */}
        {/* SISI KIRI: FORMULIR INPUT & TANDA TANGAN (5 atau 6 Kolom) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white border-t-[3px] border-[#dd4b39] shadow-sm">
          
          <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-[14px] text-[#333] font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#dd4b39]" />
              Formulir PKS Pendaratan Darurat
            </h3>
            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
              Operasional Insidentil
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs font-sans">
            
            {/* Alert SOP Dinas */}
            <div className="bg-red-50 border-l-4 border-[#dd4b39] p-3 text-red-900 leading-relaxed text-[11px]">
              <strong>SOP Dinas:</strong> PKS Darurat langsung berstatus <strong>Aktif</strong> setelah ditandatangani oleh perwakilan maskapai yang hadir di kantor Dinas. Rincian fisik pesawat (tipe, nomor registrasi, dan lokasi apron/hanggar) akan dicatat langsung oleh <strong>Petugas Lapangan</strong> di lokasi.
            </div>

            {/* Bagian 1: Identitas Maskapai & PIC */}
            <div className="border border-slate-200 p-3.5 bg-white space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1.5 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#dd4b39]" />
                1. Identitas Maskapai &amp; Penanggung Jawab
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Maskapai / Operator Armada <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Trigana Air / Smart Aviation / Wings Air"
                    value={airlineName}
                    onChange={(e) => setAirlineName(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap PIC / Pilot <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Capt. John Doe"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Telepon / WhatsApp PIC
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Aktif PIC / Maskapai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: ops@trigana-air.com / pilot@smartaviation.id"
                    value={picEmail}
                    onChange={(e) => setPicEmail(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Salinan PKS resmi, link pembayaran, dan e-SKRD otomatis dikirimkan ke email ini.
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian 2: Alasan Pendaratan Darurat */}
            <div className="border border-slate-200 p-3.5 bg-white space-y-2.5">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1.5 border-b border-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#dd4b39]" />
                2. Alasan Pendaratan Darurat
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori Kejadian Darurat <span className="text-red-500">*</span>
                </label>
                <select
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-red-500 focus:outline-none mb-2"
                >
                  {EMERGENCY_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                {emergencyReason === 'Lainnya' && (
                  <textarea
                    rows={2}
                    required
                    placeholder="Jelaskan rincian alasan darurat secara spesifik..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Bagian 3: Kanvas Tanda Tangan Digital PIC */}
            <div className="border border-slate-200 p-3.5 bg-white space-y-2">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#dd4b39]" />
                  3. Tanda Tangan Digital PIC / Perwakilan Maskapai <span className="text-red-500">*</span>
                </h4>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Kanvas
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Silakan sodorkan kanvas ini kepada perwakilan maskapai yang hadir di kantor Dinas:
              </p>

              <div className="border-2 border-dashed border-slate-300 bg-slate-50 relative h-44 rounded-none overflow-hidden touch-none">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  onEnd={handleSignatureEnd}
                  canvasProps={{
                    className: 'w-full h-full cursor-crosshair'
                  }}
                  backgroundColor="#f8fafc"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-medium text-xs">
                    Tanda tangan perwakilan maskapai di sini
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={hasSignature ? "text-emerald-700 font-bold" : "text-slate-400"}>
                  {hasSignature ? "✓ Tanda tangan tersimpan & tertaut ke surat" : "Belum ada tanda tangan"}
                </span>
                <span className="text-slate-400 text-[10px]">
                  Format: PNG Transparan Otomatis
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex justify-between items-center gap-3 border-t border-slate-200">
              <Link
                href="/dinas/kontrak"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#dd4b39] hover:bg-[#d73925] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menerbitkan PKS Darurat...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Terbitkan &amp; Sahkan PKS Darurat</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* ======================================================== */}
        {/* SISI KANAN: LIVE PREVIEW DOKUMEN A4 SURAT PKS DARURAT   */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
          
          {/* Header Preview Toolbar */}
          <div className="p-3 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] text-[#333] font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#3c8dbc]" />
                Pratinjau Langsung Surat PKS
              </h3>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center border border-slate-200 bg-white rounded-none shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.max(0.45, Number((z - 0.05).toFixed(2))))}
                  className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Perkecil Tampilan"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono text-slate-700 font-bold border-x border-slate-100 min-w-12 text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.min(1.0, Number((z + 0.05).toFixed(2))))}
                  className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Perbesar Tampilan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Banner di atas Lembar Dokumen */}
          <div className="p-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                Dokumen ini otomatis mencantumkan identitas maskapai dan coretan tanda tangan dari kanvas di sebelah kiri.
              </span>
            </div>
          </div>

          {/* Canvas A4 Preview Viewport (Scrollable with zoom scaling) */}
          <div className="p-4 sm:p-6 bg-slate-200/80 overflow-x-auto overflow-y-auto max-h-[820px] flex justify-center">
            
            <div 
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                marginBottom: `${(1 - previewZoom) * -1122}px` // Compensate vertical empty space from scaling
              }}
              className="flex flex-col items-center shadow-xl select-none"
            >
              <SuratPKSDarurat contract={previewContract} />
            </div>

          </div>

        </div>

      </div>

      {/* Modal Cetak & Sukses setelah Berhasil Diterbitkan */}
      {createdContract && (
        <SuratPKSDaruratModal
          contract={createdContract}
          onClose={() => {
            setCreatedContract(null);
            router.push('/dinas/kontrak');
          }}
        />
      )}
    </div>
  );
}
