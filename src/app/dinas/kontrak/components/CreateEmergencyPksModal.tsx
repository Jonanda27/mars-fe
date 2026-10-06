"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, AlertTriangle, User, Phone, Mail, FileText, 
  RotateCcw, CheckCircle2, Loader2, ShieldAlert, Building2, AlertCircle
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import toast from 'react-hot-toast';

interface CreateEmergencyPksModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: (newContract: Contract) => void;
}

const EMERGENCY_REASONS = [
  'Kerusakan Teknis / Engine Issue',
  'Kegagalan Sistem Hidrolik / Kelistrikan',
  'Cuaca Ekstrem / Pengalihan Pendaratan (Divert)',
  'Darurat Medis / Aviasi Penumpang & Awak',
  'Pemeriksaan Teknis Khusus / Unscheduled Maintenance',
  'Lainnya'
];

export const CreateEmergencyPksModal: React.FC<CreateEmergencyPksModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [airlineName, setAirlineName] = useState('');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [emergencyReason, setEmergencyReason] = useState(EMERGENCY_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen) return null;

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    setHasSignature(false);
  };

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
      toast.error('Email aktif PIC wajib diisi dengan benar untuk pengiriman SKRD');
      return;
    }

    if (!hasSignature || sigCanvasRef.current?.isEmpty()) {
      toast.error('Tanda tangan perwakilan maskapai wajib dibubuhkan di canvas');
      return;
    }

    const signatureDataUrl = sigCanvasRef.current?.getTrimmedCanvas().toDataURL('image/png');
    if (!signatureDataUrl) {
      toast.error('Gagal memproses tanda tangan digital');
      return;
    }

    const finalReason = emergencyReason === 'Lainnya' ? customReason : emergencyReason;

    try {
      setIsSubmitting(true);
      const payload = {
        airline_name: airlineName.trim(),
        pic_name: picName.trim(),
        pic_phone: picPhone.trim(),
        pic_email: picEmail.trim(),
        emergency_reason: finalReason,
        tenant_signature: signatureDataUrl
      };

      const res = await contractService.createEmergencyContract(payload);
      toast.success('PKS Pendaratan Darurat Berhasil Diterbitkan dan Berstatus Aktif!');
      
      const createdContract = res?.data?.contract || res?.contract;
      onSuccess(createdContract);
      onClose();
    } catch (err: any) {
      console.error('Error creating emergency contract:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal menerbitkan PKS Darurat');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-[#dd4b39] text-white px-6 py-4 flex justify-between items-center border-b border-[#d73925] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-none border border-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Penerbitan Surat PKS Pendaratan Darurat
              </h3>
              <p className="text-red-100 text-xs mt-0.5">
                Dinas Perhubungan Kab. Mimika &bull; UPBU Mozes Kilangin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-none transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 font-sans text-xs">
          
          {/* SOP Alert Banner */}
          <div className="bg-red-50 border-l-4 border-[#dd4b39] p-3 text-red-900 leading-relaxed text-xs">
            <strong>Perhatian Dinas:</strong> PKS Darurat diterbitkan saat perwakilan maskapai/operator melapor ke Dinas. Kontrak ini langsung berstatus <strong>Aktif</strong> dan ditandatangani secara digital oleh perwakilan maskapai yang hadir di kantor Dinas. Rincian fisik pesawat (nomor registrasi, tipe pesawat, dan alokasi penempatan parkir) selanjutnya akan dicatat dan diverifikasi langsung oleh <strong>Petugas Lapangan</strong>.
          </div>

          {/* Section 1: Identitas Maskapai & PIC */}
          <div className="bg-white border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#dd4b39]" />
              1. Identitas Maskapai &amp; Penanggung Jawab (PIC)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Maskapai / Operator <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Trigana Air / Smart Aviation"
                  value={airlineName}
                  onChange={(e) => setAirlineName(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
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
                  className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Aktif PIC / Maskapai <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Untuk pengiriman e-SKRD"
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  e-SKRD &amp; link pembayaran retribusi akan otomatis dikirim ke email ini
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Alasan Pendaratan Darurat */}
          <div className="bg-white border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#dd4b39]" />
              2. Alasan Pendaratan Darurat
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kategori Alasan Darurat <span className="text-red-500">*</span>
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
                  placeholder="Tuliskan rincian alasan darurat..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Section 3: Canvas Tanda Tangan Perwakilan Maskapai di Dinas */}
          <div className="bg-white border border-slate-200 p-4 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#dd4b39]" />
                3. Tanda Tangan Digital Perwakilan Maskapai (Di Kantor Dinas) <span className="text-red-500">*</span>
              </h4>
              <button
                type="button"
                onClick={handleClearSignature}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Tanda Tangan
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Perwakilan maskapai yang hadir di kantor Dinas wajib menandatangani surat perjanjian kerja sama darurat di area bawah ini:
            </p>

            <div className="border-2 border-dashed border-slate-300 bg-slate-50 relative h-40">
              <SignatureCanvas
                ref={sigCanvasRef}
                onBegin={() => setHasSignature(true)}
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
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-none transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#dd4b39] hover:bg-[#d73925] text-white font-bold text-xs rounded-none shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menerbitkan PKS Darurat...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Terbitkan PKS Darurat &amp; Aktifkan
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
