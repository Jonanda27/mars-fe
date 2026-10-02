"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, X, Camera, CheckCircle2, RotateCcw, Loader2, Plane, User, Phone, Mail, FileText, Info
} from 'lucide-react';
import { aircraftService } from '@/services/aircraftService';
import toast from 'react-hot-toast';

interface EmergencyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const EmergencyCheckinModal: React.FC<EmergencyCheckinModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [aircraftTypeId, setAircraftTypeId] = useState<number | ''>('');
  const [parkingLocation, setParkingLocation] = useState<'Hanggar' | 'Apron'>('Apron');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('Kerusakan Teknis / Engine Issue');
  const [customReason, setCustomReason] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [masterTypes, setMasterTypes] = useState<{ id: number; jenis_pesawat: string; luas_efektif_m2: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen) {
      aircraftService.getMasterTypes()
        .then(types => {
          setMasterTypes(types);
          if (types.length > 0) setAircraftTypeId(types[0].id);
        })
        .catch(err => console.error('Gagal mengambil master types:', err));
    }
  }, [isOpen]);

  // Helper to calculate exact coordinates on canvas accounting for responsive scaling
  const getCanvasCoordinates = (
    canvas: HTMLCanvasElement, 
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Handle Canvas Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(canvas, e);

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(canvas, e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidencePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEvidencePhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationNumber.trim()) {
      toast.error('Nomor Registrasi (Tail Number) wajib diisi');
      return;
    }
    if (!airlineName.trim()) {
      toast.error('Nama Maskapai / Operator wajib diisi');
      return;
    }
    if (!picName.trim()) {
      toast.error('Nama PIC (Pilot In Command) wajib diisi');
      return;
    }
    if (!picPhone.trim()) {
      toast.error('Nomor HP/WhatsApp PIC wajib diisi untuk penagihan e-SKRD');
      return;
    }
    if (!hasSignature || !canvasRef.current) {
      toast.error('Tanda Tangan PIC di lokasi wajib dibubuhkan');
      return;
    }
    if (!evidencePhoto) {
      toast.error('Foto bukti fisik pesawat di lokasi wajib dilampirkan');
      return;
    }

    try {
      setIsSubmitting(true);
      const signatureDataUrl = canvasRef.current.toDataURL('image/png');
      const finalReason = emergencyReason === 'Lainnya' ? customReason : emergencyReason;

      const fd = new FormData();
      fd.append('registration_number', registrationNumber.toUpperCase().trim());
      fd.append('airline_name', airlineName.trim());
      if (aircraftTypeId) fd.append('aircraft_type_id', String(aircraftTypeId));
      fd.append('parking_location', parkingLocation);
      fd.append('pic_name', picName.trim());
      fd.append('pic_phone', picPhone.trim());
      fd.append('pic_email', picEmail.trim());
      fd.append('emergency_reason', finalReason);
      fd.append('pic_signature', signatureDataUrl);
      fd.append('log_evidence', evidencePhoto);

      await onSubmit(fd);
      onClose();
    } catch (err: any) {
      console.error('Gagal submit emergency check-in:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal check-in pendaratan darurat');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal - Sharp & High Contrast Emergency Header */}
        <div className="bg-red-700 text-white px-6 py-4 flex justify-between items-center border-b border-red-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-none border border-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                Pendaratan Darurat (PKS Darurat)
              </h3>
              <p className="text-red-100 text-xs mt-0.5">
                Check-in insidentil pesawat tanpa reservasi awal &bull; Penerbitan PKS otomatis &amp; penagihan pasca-checkout
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

        {/* Form Body - Scrollable Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            
            {/* Banner Regulasi SOP */}
            <div className="bg-amber-50 border-l-4 border-amber-500 border-y border-r border-amber-200 p-3 rounded-none text-xs text-amber-900 leading-relaxed flex items-start gap-2.5 shadow-2xs">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>SOP Pendaratan Darurat Bandara Mozes Kilangin:</strong> Armada diperbolehkan mendarat &amp; parkir langsung. Sistem secara otomatis membuat <strong>PKS Pendaratan Darurat</strong> bernomor resmi. Pembayaran retribusi diproses setelah checkout via e-SKRD Dinas Perhubungan.
              </div>
            </div>

            {/* Bagian 1: Data Armada & Penempatan Parkir */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-red-600" />
                <span>1. Data Armada &amp; Penempatan Parkir</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tail Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Registrasi (Tail Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: PK-EMG / PK-RAV"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-none text-xs font-mono font-bold uppercase focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                      required
                    />
                    <Plane className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Nama Maskapai / Operator */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Maskapai / Operator Pemilik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Sky Carstensz / Charter Ad-Hoc"
                    value={airlineName}
                    onChange={(e) => setAirlineName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                    required
                  />
                </div>

                {/* Tipe Pesawat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Pesawat <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={aircraftTypeId}
                    onChange={(e) => setAircraftTypeId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-none text-xs bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    {masterTypes.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.jenis_pesawat} ({t.luas_efektif_m2} m²)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lokasi Parkir */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Penempatan Parkir <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setParkingLocation('Apron')}
                      className={`py-2 px-3 border rounded-none text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        parkingLocation === 'Apron'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🅿️</span> Apron (Terbuka)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParkingLocation('Hanggar')}
                      className={`py-2 px-3 border rounded-none text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        parkingLocation === 'Hanggar'
                          ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🏢</span> Hanggar (Tertutup)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 2: Data PIC & Alasan Pendaratan */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600" />
                <span>2. Data Kontak PIC &amp; Alasan Pendaratan</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama PIC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama PIC (Pilot In Command) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: Capt. Handoko Pratama"
                      value={picName}
                      onChange={(e) => setPicName(e.target.value)}
                      className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* No WhatsApp PIC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / HP PIC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={picPhone}
                      onChange={(e) => setPicPhone(e.target.value)}
                      className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Link e-SKRD tagihan akan dikirimkan ke nomor ini pasca-checkout.</p>
                </div>

                {/* Email PIC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email PIC / Operator <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="ops@operator.com"
                      value={picEmail}
                      onChange={(e) => setPicEmail(e.target.value)}
                      className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Alasan Pendaratan Darurat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alasan Pendaratan Darurat / Ad-Hoc <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={emergencyReason}
                    onChange={(e) => setEmergencyReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-none text-xs bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Kerusakan Teknis / Engine Issue">Kerusakan Teknis / Engine Issue</option>
                    <option value="Cuaca Buruk Enroute (Bad Weather Diversion)">Cuaca Buruk Enroute (Bad Weather Diversion)</option>
                    <option value="Bahan Bakar Kritis (Low Fuel Emergency)">Bahan Bakar Kritis (Low Fuel Emergency)</option>
                    <option value="Kebutuhan Medevac (Emergency Pasien Kritis)">Kebutuhan Medevac (Emergency Pasien Kritis)</option>
                    <option value="Inspeksi Khusus / Safety Landing">Inspeksi Khusus / Safety Landing</option>
                    <option value="Lainnya">Lainnya (Tuliskan secara manual)</option>
                  </select>

                  {emergencyReason === 'Lainnya' && (
                    <input
                      type="text"
                      placeholder="Tuliskan alasan spesifik..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 3: Bukti Fisik & Pengesahan TTE (Side by Side Grid) */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>3. Bukti Fisik &amp; Pengesahan TTE PIC</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Upload Bukti Foto Pesawat */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none flex flex-col justify-between">
                  <div className="mb-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Foto Bukti Fisik Pesawat di Apron/Hanggar <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Lampirkan foto fisik armada yang mendarat di area bandara
                    </p>
                  </div>

                  {!photoPreview ? (
                    <label className="flex-1 min-h-[140px] flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-red-400 rounded-none cursor-pointer bg-white transition-colors text-center">
                      <Camera className="w-7 h-7 text-slate-400 mb-1.5" />
                      <span className="text-xs font-bold text-slate-700">Ambil / Unggah Foto Pesawat</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG (Maks. 10MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative border border-slate-300 rounded-none bg-slate-100 flex-1 min-h-[140px] flex items-center justify-center overflow-hidden">
                      <img 
                        src={photoPreview} 
                        alt="Preview Pesawat" 
                        className="max-h-[140px] w-full object-cover" 
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1.5">
                        <label className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold rounded-none cursor-pointer transition-colors">
                          Ganti
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-none cursor-pointer transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tanda Tangan Digital PIC */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-red-600" />
                      Tanda Tangan Elektronik (TTE) PIC <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[11px] text-slate-600 hover:text-red-600 flex items-center gap-1 font-semibold rounded-none cursor-pointer border border-slate-300 bg-white px-2 py-0.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Ulangi TTD
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Pilot In Command membubuhkan paraf/tanda tangan langsung di area ini:
                  </p>

                  <div className="border border-slate-300 bg-white rounded-none overflow-hidden touch-none relative flex-1 min-h-[140px]">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        draw(e);
                      }}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-crosshair block"
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs italic font-medium">
                        (Goreskan tanda tangan PIC di area ini)
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Pernyataan Hukum */}
            <div className="bg-slate-100 border border-slate-200 p-3 rounded-none text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
              <span className="text-sm flex-shrink-0 mt-0.5">⚖️</span>
              <div>
                <strong>Pernyataan Hukum:</strong> Saya selaku Pilot In Command (PIC) / Perwakilan Sah Operator menyatakan pendaratan ini adalah pendaratan darurat/insidentil, menyetujui penerbitan <em>PKS Pendaratan Darurat Mozes Kilangin</em>, dan berkomitmen melunasi kewajiban retribusi pemanfaatan fasilitas bandara pasca-checkout setelah e-SKRD resmi diterbitkan oleh Dinas Perhubungan Kab. Mimika.
              </div>
            </div>

          </div>

          {/* Action Footer Modal - Fixed at bottom */}
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              * Pastikan seluruh data fisik dan tanda tangan telah terverifikasi.
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-none cursor-pointer transition-colors shadow-2xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-none text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menerbitkan PKS Darurat...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Terbitkan PKS Darurat &amp; Check-In
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
