import React from 'react';
import { Plane, X, Upload, Info, Loader2, Save } from 'lucide-react';

export interface AircraftModalProps {
  show: boolean;
  onClose: () => void;
  newAircraftData: {
    registrasi: string;
    tipe: string;
    customTipe: string;
    customLuas: string;
    mtow: string;
    kapasitasPenumpang: string;
    fotoPreview: string;
  };
  handleNewAircraftChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateAircraft: (e: React.FormEvent) => void;
  savingAircraft: boolean;
  masterAircraftTypes: { id: number; jenis_pesawat: string; luas_efektif_m2: string }[];
}

export const AircraftModal: React.FC<AircraftModalProps> = ({
  show,
  onClose,
  newAircraftData,
  handleNewAircraftChange,
  handleFileChange,
  handleCreateAircraft,
  savingAircraft,
  masterAircraftTypes,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <Plane className="w-5 h-5 mr-2 text-indigo-600" />
            Tambah Armada Pesawat
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="add-aircraft-form" onSubmit={handleCreateAircraft} className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Image Upload */}
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2">Foto Pesawat (Opsional)</label>
              <label className="flex-1 min-h-[200px] border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center overflow-hidden relative group">
                {newAircraftData.fotoPreview ? (
                  <>
                    <img src={newAircraftData.fotoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-xs font-medium">Ubah Gambar</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-sm text-slate-600 font-medium block mb-1">Unggah Gambar</span>
                    <span className="text-xs text-slate-400">Klik untuk memilih</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Right Column: Form Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">No. Registrasi <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="registrasi" 
                    value={newAircraftData.registrasi} 
                    onChange={handleNewAircraftChange} 
                    placeholder="Contoh: PK-XYZ"
                    className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm uppercase"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tipe Pesawat <span className="text-red-500">*</span></label>
                  <select 
                    name="tipe" 
                    value={newAircraftData.tipe} 
                    onChange={handleNewAircraftChange} 
                    className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                    required
                  >
                    <option value="">-- Pilih Tipe --</option>
                    {masterAircraftTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.jenis_pesawat} (Luas: {t.luas_efektif_m2}m²)</option>
                    ))}
                    <option value="Lainnya">Lainnya (Input Manual)</option>
                  </select>
                </div>
              </div>

              {newAircraftData.tipe === 'Lainnya' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 border border-orange-100 rounded-md">
                  <div>
                    <label className="block text-sm font-bold text-orange-900 mb-1">Tipe Custom <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="customTipe" 
                      value={newAircraftData.customTipe} 
                      onChange={handleNewAircraftChange} 
                      placeholder="Misal: Boeing 737"
                      className="w-full border border-orange-300 px-3 py-2 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-orange-900 mb-1">Luas (m²) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      name="customLuas" 
                      value={newAircraftData.customLuas} 
                      onChange={handleNewAircraftChange} 
                      placeholder="Contoh: 150"
                      className="w-full border border-orange-300 px-3 py-2 rounded-md outline-none focus:border-orange-500 text-sm bg-white"
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">MTOW (Kg) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="mtow" 
                    value={newAircraftData.mtow} 
                    onChange={handleNewAircraftChange} 
                    placeholder="Contoh: 5000"
                    className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kapasitas Penumpang</label>
                  <input 
                    type="number" 
                    name="kapasitasPenumpang" 
                    value={newAircraftData.kapasitasPenumpang} 
                    onChange={handleNewAircraftChange} 
                    placeholder="Contoh: 10"
                    className="w-full border border-slate-300 px-3 py-2 rounded-md outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100 flex items-start mt-2">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <p>Setelah pesawat disimpan, pesawat akan otomatis tercentang dalam formulir penyewaan Anda.</p>
              </div>
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg flex justify-end gap-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="add-aircraft-form"
            disabled={savingAircraft}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-70"
          >
            {savingAircraft ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan Armada
          </button>
        </div>
      </div>
    </div>
  );
};

export default AircraftModal;
