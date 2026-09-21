import React from 'react';
import { Plus, X, Info, Camera } from 'lucide-react';

interface AddManualAircraftModalProps {
  readonly isOpen: boolean;
  readonly manualReg: string;
  readonly setManualReg: (val: string) => void;
  readonly manualTenantId: string;
  readonly setManualTenantId: (val: string) => void;
  readonly manualType: string;
  readonly setManualType: (val: string) => void;
  readonly manualLocation: string;
  readonly setManualLocation: (val: string) => void;
  readonly manualPhoto: File | null;
  readonly manualPhotoPreview: string | null;
  readonly onManualPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly manualNotes: string;
  readonly setManualNotes: (val: string) => void;
  readonly tenantsList: any[];
  readonly onClose: () => void;
  readonly onSubmit: (e: React.FormEvent) => void;
}

export const AddManualAircraftModal: React.FC<AddManualAircraftModalProps> = ({
  isOpen,
  manualReg,
  setManualReg,
  manualTenantId,
  setManualTenantId,
  manualType,
  setManualType,
  manualLocation,
  setManualLocation,
  manualPhoto,
  manualPhotoPreview,
  onManualPhotoChange,
  manualNotes,
  setManualNotes,
  tenantsList,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Pesawat Menginap Manual
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-5 text-xs text-slate-700 space-y-3.5">
          <div className="bg-blue-50 border border-blue-100 p-2.5 text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Gunakan form ini bila terdapat pesawat insidentil/transit yang menginap di fasilitas bandara di luar check-in terjadwal.
            </p>
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Nomor Registrasi Pesawat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={manualReg}
              onChange={(e) => setManualReg(e.target.value)}
              placeholder="Contoh: PK-GCA, PK-BKA"
              className="w-full border border-slate-300 p-2 font-mono font-bold text-slate-900 uppercase focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Maskapai / Pemilik Pesawat
            </label>
            <select
              value={manualTenantId}
              onChange={(e) => setManualTenantId(e.target.value)}
              className="w-full border border-slate-300 p-2 text-slate-800 focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white font-medium"
            >
              <option value="">-- Pilih Maskapai / Pemilik (Opsional) --</option>
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama_perusahaan}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Tipe Pesawat
              </label>
              <input
                type="text"
                value={manualType}
                onChange={(e) => setManualType(e.target.value)}
                placeholder="Contoh: Cessna, Caravan"
                className="w-full border border-slate-300 p-2 text-slate-800 focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Lokasi Penempatan
              </label>
              <select
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="w-full border border-slate-300 p-2 text-slate-800 focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none bg-white font-medium"
              >
                <option value="Hanggar">Hanggar Utama</option>
                <option value="Apron">Pelataran Apron</option>
                <option value="Helipad">Helipad Area</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Foto Bukti Keberadaan Fisik <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <Camera className="w-4 h-4 text-[#3c8dbc]" />
                <span>{manualPhoto ? 'Ganti Foto' : 'Ambil Foto Fisik'}</span>
                <input
                  type="file"
                  required={!manualPhoto}
                  accept="image/*"
                  capture="environment"
                  onChange={onManualPhotoChange}
                  className="hidden"
                />
              </label>
              
              {manualPhotoPreview && (
                <div className="w-12 h-12 border border-[#3c8dbc] overflow-hidden shadow-2xs">
                  <img src={manualPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Catatan / Keterangan Tambahan
            </label>
            <input
              type="text"
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              placeholder="Contoh: Pesawat charter transit perbaikan mesin"
              className="w-full border border-slate-300 p-2 text-slate-800 focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2 font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambahkan ke Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
