import React from 'react';
import { Edit, Plus, X, Upload, CheckCircle2 } from 'lucide-react';

interface AircraftFormCardProps {
  editingId: number | null;
  formData: {
    registrasi: string;
    tipe: string;
    customTipe: string;
    customLuas: string;
    mtow: string;
    kapasitasPenumpang: string;
    fotoPreview: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    registrasi: string;
    tipe: string;
    customTipe: string;
    customLuas: string;
    mtow: string;
    kapasitasPenumpang: string;
    fotoPreview: string;
  }>>;
  aircraftTypes: { id: number; jenis_pesawat: string; luas_efektif_m2: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (e: React.SyntheticEvent) => Promise<void>;
  onCancel: () => void;
}

export const AircraftFormCard: React.FC<AircraftFormCardProps> = ({
  editingId,
  formData,
  setFormData,
  aircraftTypes,
  handleChange,
  handleFileChange,
  handleSubmitForm,
  onCancel,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm animate-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
        <h3 className="text-[16px] text-[#444] font-bold flex items-center">
          {editingId ? <Edit className="w-5 h-5 mr-2 text-[#3c8dbc]" /> : <Plus className="w-5 h-5 mr-2 text-[#3c8dbc]" />}
          {editingId ? 'Perbarui Data Pesawat' : 'Daftarkan Pesawat Baru'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-[#777] hover:text-[#dd4b39] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmitForm} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Upload Gambar */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d2d6de] p-4 bg-slate-50 min-h-[220px] relative">
            {formData.fotoPreview ? (
              <div className="w-full h-full relative group">
                <img 
                  src={formData.fotoPreview} 
                  alt="Preview Pesawat" 
                  className="w-full h-[180px] object-cover rounded-sm border border-[#d2d6de]"
                />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, fotoPreview: '' })}
                  className="absolute top-2 right-2 bg-[#dd4b39] text-white p-1 rounded-full opacity-80 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <Upload className="w-10 h-10 text-[#3c8dbc] mx-auto mb-2" />
                <p className="font-bold text-[13px] text-[#333]">Unggah Foto Pesawat</p>
                <p className="text-[11px] text-[#777] mb-3">Format JPG/PNG (Maks 5MB)</p>
                <label className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[12px] font-bold px-4 py-2 cursor-pointer transition-colors inline-block shadow-sm">
                  <span>Pilih Berkas Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Input Form Fields */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
            <div>
              <label htmlFor="pesawat-registrasi" className="block mb-1 font-bold text-[#444]">
                Nomor Registrasi (Tail Number) <span className="text-[#dd4b39]">*</span>
              </label>
              <input 
                id="pesawat-registrasi"
                type="text" 
                name="registrasi"
                placeholder="Contoh: PK-JDE" 
                value={formData.registrasi}
                onChange={handleChange}
                className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none uppercase font-bold text-[#3c8dbc]" 
              />
            </div>

            <div>
              <label htmlFor="pesawat-tipe" className="block mb-1 font-bold text-[#444]">
                Tipe Pesawat <span className="text-[#dd4b39]">*</span>
              </label>
              <select 
                id="pesawat-tipe"
                name="tipe" 
                value={formData.tipe} 
                onChange={handleChange} 
                required 
                className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white"
              >
                <option value="" disabled>Pilih Tipe Pesawat</option>
                {aircraftTypes.map(t => (
                  <option key={t.id} value={t.id.toString()}>{t.jenis_pesawat} (Dimensi: {t.luas_efektif_m2} m²)</option>
                ))}
                <option value="Lainnya">Lainnya (Kustom)</option>
              </select>
            </div>

            {formData.tipe === 'Lainnya' && (
              <>
                <div>
                  <label htmlFor="pesawat-custom-tipe" className="block mb-1 font-bold text-[#444]">
                    Nama Tipe Kustom <span className="text-[#dd4b39]">*</span>
                  </label>
                  <input 
                    id="pesawat-custom-tipe"
                    type="text" 
                    name="customTipe"
                    placeholder="Contoh: Pilatus PC-6" 
                    value={formData.customTipe}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none" 
                  />
                </div>
                <div>
                  <label htmlFor="pesawat-custom-luas" className="block mb-1 font-bold text-[#444]">
                    Luas Efektif (m²) <span className="text-[#dd4b39]">*</span>
                  </label>
                  <input 
                    id="pesawat-custom-luas"
                    type="text" 
                    name="customLuas"
                    placeholder="Contoh: 150" 
                    value={formData.customLuas}
                    onChange={(e) => {
                       const val = e.target.value.replace(/[^0-9.]/g, '');
                       setFormData(prev => ({ ...prev, customLuas: val }));
                    }}
                    required
                    className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none font-mono" 
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="pesawat-mtow" className="block mb-1 font-bold text-[#444]">
                Berat Maksimal (MTOW) <span className="text-[#dd4b39]">*</span>
              </label>
              <div className="flex">
                <input 
                  id="pesawat-mtow"
                  type="text" 
                  name="mtow"
                  placeholder="Contoh: 3629" 
                  value={formData.mtow}
                  onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '');
                     setFormData(prev => ({ ...prev, mtow: val }));
                  }}
                  className="w-full p-2 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none font-mono" 
                />
                <span className="bg-[#f4f4f4] border border-[#d2d6de] px-3 flex items-center text-[#777] font-bold">Kg</span>
              </div>
            </div>

            <div>
              <label htmlFor="pesawat-kapasitas" className="block mb-1 font-bold text-[#444]">
                Kapasitas Penumpang
              </label>
              <input 
                id="pesawat-kapasitas"
                type="number" 
                name="kapasitasPenumpang"
                value={formData.kapasitasPenumpang}
                onChange={handleChange}
                className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none font-mono" 
              />
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-[#f4f4f4] bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-[#d2d6de] text-[#444] font-bold text-[13px] hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[13px] flex items-center transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> {editingId ? 'Simpan Perubahan' : 'Simpan Data Armada'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AircraftFormCard;
