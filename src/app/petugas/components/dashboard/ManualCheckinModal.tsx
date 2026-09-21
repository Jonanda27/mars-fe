import React from 'react';
import { LogIn, X, Loader2 } from 'lucide-react';

interface ManualCheckinModalProps {
  readonly isOpen: boolean;
  readonly applications: any[];
  readonly selectedApplication: string;
  readonly setSelectedApplication: (val: string) => void;
  readonly registrationNumber: string;
  readonly setRegistrationNumber: (val: string) => void;
  readonly parkingLocation: string;
  readonly setParkingLocation: (val: string) => void;
  readonly setEvidencePhoto: (file: File | null) => void;
  readonly notes: string;
  readonly setNotes: (val: string) => void;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (e: React.FormEvent) => void;
}

export const ManualCheckinModal: React.FC<ManualCheckinModalProps> = ({
  isOpen,
  applications,
  selectedApplication,
  setSelectedApplication,
  registrationNumber,
  setRegistrationNumber,
  parkingLocation,
  setParkingLocation,
  setEvidencePhoto,
  notes,
  setNotes,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Check-In Pesawat Masuk (Manual)
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-200 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 text-xs text-slate-700 space-y-3.5">
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Pilih Permohonan Sewa / Tenant <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedApplication}
              onChange={(e) => setSelectedApplication(e.target.value)}
              required
              className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none bg-white font-medium"
            >
              <option value="">-- Pilih Permohonan Sewa Aktif --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.application_number} - {app.tenants?.nama_perusahaan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Nomor Registrasi (Tail Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: PK-GCA"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              required
              className="w-full p-2 border border-slate-300 font-mono font-bold uppercase focus:border-[#3c8dbc] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Lokasi Penempatan Parkir <span className="text-red-500">*</span>
            </label>
            <select
              value={parkingLocation}
              onChange={(e) => setParkingLocation(e.target.value)}
              className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none bg-white"
            >
              <option value="Hanggar">Hanggar Utama Mozes Kilangin</option>
              <option value="Apron">Apron Bandara</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Foto Bukti Kedatangan Fisik <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEvidencePhoto(e.target.files?.[0] || null)}
              required
              className="w-full p-1.5 border border-slate-300 text-xs file:mr-2 file:py-1 file:px-2.5 file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#3c8dbc]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Catatan Tambahan
            </label>
            <textarea
              placeholder="Keterangan kondisi pesawat..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
              Simpan Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
