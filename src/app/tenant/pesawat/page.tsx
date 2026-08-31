"use client";

import React, { useState } from 'react';
import { 
  Plane, Plus, Search, Trash2, Edit, X, Upload, 
  CheckCircle2, Wrench, ShieldAlert, Weight, Tag, LayoutGrid, List, Eye
} from 'lucide-react';

import { aircraftService } from '@/services/aircraftService';
import { Aircraft } from '@/types/aircraft';

export default function DataPesawatPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [armadaList, setArmadaList] = useState<Aircraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    try {
      const data = await aircraftService.getTenantAircrafts();
      setArmadaList(data);
    } catch (error) {
      console.error('Gagal mengambil data pesawat:', error);
    } finally {
      setIsLoading(false);
    }
  };



  // Form State
  const [formData, setFormData] = useState({
    registrasi: '',
    tipe: '',
    mtow: '',
    kapasitasPenumpang: '10',
    fotoPreview: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoPreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrasi || !formData.tipe || !formData.mtow) {
      alert("Mohon lengkapi Nomor Registrasi, Tipe Pesawat, dan Berat MTOW!");
      return;
    }

    try {
      if (editingId) {
        const updatedPesawat = await aircraftService.updateTenantAircraft(editingId, {
          registration_number: formData.registrasi.toUpperCase(),
          aircraft_type: formData.tipe,
          mtow: Number(formData.mtow),
          capacity: Number(formData.kapasitasPenumpang),
          foto: formData.fotoPreview || undefined
        });

        setArmadaList(armadaList.map(item => item.id === editingId ? updatedPesawat : item));
        alert(`Data pesawat ${updatedPesawat.registration_number} berhasil diperbarui!`);
      } else {
        const newPesawat = await aircraftService.createTenantAircraft({
          registration_number: formData.registrasi.toUpperCase(),
          aircraft_type: formData.tipe,
          mtow: Number(formData.mtow),
          capacity: Number(formData.kapasitasPenumpang),
          status: 'aktif',
          foto: formData.fotoPreview || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
        });
        setArmadaList([newPesawat, ...armadaList]);
        alert(`Pesawat ${newPesawat.registration_number} berhasil terdaftar di sistem!`);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        registrasi: '',
        tipe: '',
        mtow: '',
        kapasitasPenumpang: '10',
        fotoPreview: ''
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menyimpan pesawat');
    }
  };

  const handleEdit = (item: Aircraft) => {
    setEditingId(item.id!);
    setFormData({
      registrasi: item.registration_number,
      tipe: item.aircraft_type,
      mtow: item.mtow ? item.mtow.toString() : '',
      kapasitasPenumpang: item.capacity ? item.capacity.toString() : '',
      fotoPreview: item.foto || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pesawat ini?')) return;
    try {
      await aircraftService.deleteTenantAircraft(id);
      setArmadaList(armadaList.filter(item => item.id !== id));
      alert('Pesawat berhasil dihapus!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menghapus pesawat');
    }
  };

  const filteredArmada = armadaList.filter(item => {
    const matchesSearch = item.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.aircraft_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase">
            Registrasi Armada Pesawat
          </h1>
          <p className="text-[12px] text-[#777]">Kelola Visual Katalog & Spesifikasi Pesawat Terdaftar</p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Tenant Portal</span> / <span className="ml-1 font-medium">Data Pesawat</span>
        </div>
      </header>

      {/* Form Input Pesawat Baru */}
      {showForm && (
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              {editingId ? <Edit className="w-5 h-5 mr-2 text-[#3c8dbc]" /> : <Plus className="w-5 h-5 mr-2 text-[#3c8dbc]" />}
              {editingId ? 'Perbarui Data Pesawat' : 'Daftarkan Pesawat Baru'}
            </h3>
            <button 
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  registrasi: '',
                  tipe: '',
                  mtow: '',
                  kapasitasPenumpang: '10',
                  fotoPreview: ''
                });
              }}
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
                      Pilih Berkas Foto
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
                  <label className="block mb-1 font-bold text-[#444]">Nomor Registrasi (Tail Number) <span className="text-[#dd4b39]">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Contoh: PK-JDE" 
                    value={formData.registrasi}
                    onChange={(e) => setFormData({ ...formData, registrasi: e.target.value })}
                    className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none uppercase font-bold text-[#3c8dbc]" 
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-[#444]">Tipe Pesawat <span className="text-[#dd4b39]">*</span></label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none font-semibold"
                    required
                  >
                    <option value="" disabled>-- Pilih Tipe Pesawat --</option>
                    <optgroup label="Helicopter (Rotary Wing)">
                      <option value="AS350 Series">AS350 Series</option>
                      <option value="Bell 206 - Bell 407 Series">Bell 206 - Bell 407 Series</option>
                      <option value="Bell 412 - Bell 212">Bell 412 - Bell 212</option>
                      <option value="Kamov - MI">Kamov - MI</option>
                    </optgroup>
                    <optgroup label="Pesawat Terbang (Fixed Wing)">
                      <option value="Cessna Caravan C208">Cessna Caravan C208</option>
                      <option value="PAC 750 XL">PAC 750 XL</option>
                      <option value="DHC-6 Series">DHC-6 Series</option>
                      <option value="ATR Series">ATR Series</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-[#444]">Berat Maksimal (MTOW) <span className="text-[#dd4b39]">*</span></label>
                  <div className="flex">
                    <input 
                      type="number" 
                      placeholder="Contoh: 3629" 
                      value={formData.mtow}
                      onChange={(e) => setFormData({ ...formData, mtow: e.target.value })}
                      className="w-full p-2 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none font-mono" 
                    />
                    <span className="bg-[#f4f4f4] border border-[#d2d6de] px-3 flex items-center text-[#777] font-bold">Kg</span>
                  </div>
                </div>


                <div>
                  <label className="block mb-1 font-bold text-[#444]">Kapasitas Penumpang</label>
                  <input 
                    type="number" 
                    value={formData.kapasitasPenumpang}
                    onChange={(e) => setFormData({ ...formData, kapasitasPenumpang: e.target.value })}
                    className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none font-mono" 
                  />
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-[#f4f4f4] bg-slate-50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    registrasi: '',
                    tipe: '',
                    mtow: '',
                    kapasitasPenumpang: '10',
                    fotoPreview: ''
                  });
                }}
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
      )}

      {/* Controls: Header Filter & Layout Switcher */}
      {!showForm && (
        <>
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-[14px] font-bold text-[#333] flex items-center">
                <Plane className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Katalog Armada Terdaftar ({filteredArmada.length})
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
              
              {/* Status Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-[#d2d6de] bg-white px-3 py-1.5 text-[13px] focus:outline-none font-semibold text-[#555] w-full sm:w-auto"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif Operasional</option>
                <option value="maintenance">Dalam Pemeliharaan</option>
              </select>

              {/* Search Bar */}
              <div className="flex w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Cari registrasi atau tipe..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[200px]" 
                />
                <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                  <Search className="w-4 h-4 text-[#777]" />
                </button>
              </div>

              {/* Switcher Tampilan Grid / List */}
              <div className="flex border border-[#d2d6de] bg-slate-50 rounded-sm p-0.5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 text-[12px] flex items-center font-bold transition-colors ${viewMode === 'grid' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:text-[#333]'}`}
                  title="Tampilan Kartu Visual (Grid)"
                >
                  <LayoutGrid className="w-4 h-4 mr-1" /> Grid Kartu
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 text-[12px] flex items-center font-bold transition-colors ${viewMode === 'list' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:text-[#333]'}`}
                  title="Tampilan Baris Ringkas"
                >
                  <List className="w-4 h-4 mr-1" /> Daftar Ringkas
                </button>
              </div>

              <button 
                onClick={() => setShowForm(true)}
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-bold px-4 py-1.5 transition-colors flex items-center justify-center shadow-sm whitespace-nowrap w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Daftarkan Pesawat
              </button>
            </div>
          </div>

          {/* TAMPILAN 1: GRID KARTU VISUAL DENGAN GAMBAR PESAWAT */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in">
              {filteredArmada.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white shadow-sm border border-[#d2d6de] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Gambar Pesawat & Status Badge Overlay */}
                  <div className="relative h-[200px] bg-slate-800 overflow-hidden">
                    <img 
                      src={item.foto || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"} 
                      alt={item.aircraft_type} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Tail Number Badge Overlay */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 font-mono font-bold text-[16px] tracking-wider border border-white/20 shadow-md">
                      {item.registration_number}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {item.status === 'aktif' ? (
                        <span className="bg-[#00a65a] text-white font-bold text-[11px] px-3 py-1 uppercase tracking-wider shadow-sm flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Aktif
                        </span>
                      ) : (
                        <span className="bg-[#f39c12] text-white font-bold text-[11px] px-3 py-1 uppercase tracking-wider shadow-sm flex items-center">
                          <Wrench className="w-3 h-3 mr-1" /> Maintenance
                        </span>
                      )}
                    </div>

                    {/* Category Bar Bottom Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                      <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">{/* {item.kategori} */}</p>
                      <h3 className="text-[16px] font-bold leading-tight">{item.aircraft_type}</h3>
                    </div>
                  </div>

                  {/* Detail Spesifikasi Pesawat */}
                  <div className="p-4 flex-1 flex flex-col gap-3 bg-white text-[13px]">
                    
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-[#f4f4f4]">
                      <div>
                        <span className="text-[11px] text-[#777] uppercase font-bold block">Berat (MTOW)</span>
                        <span className="font-mono font-bold text-[#333] text-[14px]">{item.mtow?.toLocaleString('id-ID')} Kg</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#777] uppercase font-bold block">Kapasitas</span>
                        <span className="font-bold text-[#333] text-[14px]">{item.capacity || '-'} Penumpang</span>
                      </div>
                    </div>


                  </div>

                  {/* Action Footer */}
                  <div className="p-3 bg-slate-50 border-t border-[#f4f4f4] flex justify-end items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="bg-white border border-[#d2d6de] text-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white px-3 py-1.5 transition-colors shadow-sm flex items-center text-[12px] font-bold" title="Edit Data">
                      <Edit className="w-4 h-4 mr-1.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id!)} className="bg-white border border-[#d2d6de] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white px-3 py-1.5 transition-colors shadow-sm flex items-center text-[12px] font-bold" title="Hapus">
                      <Trash2 className="w-4 h-4 mr-1.5" /> Hapus
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* TAMPILAN 2: DAFTAR RINGKAS (COMPACT LIST VIEW) */}
          {viewMode === 'list' && (
            <div className="bg-white border border-[#d2d6de] shadow-sm animate-in fade-in">
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[14px]">
                  <thead>
                    <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-slate-50 uppercase text-[12px]">
                      <th className="py-4 px-5 font-bold w-[12%]">Foto</th>
                      <th className="py-4 px-5 font-bold w-[15%]">Registrasi</th>
                      <th className="py-4 px-5 font-bold w-[25%]">Tipe Pesawat</th>
                      <th className="py-4 px-5 font-bold w-[15%]">MTOW (Kg)</th>
                      <th className="py-4 px-5 font-bold text-center w-[13%]">Status</th>
                      <th className="py-4 px-5 font-bold text-center w-[10%]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArmada.map((item) => (
                      <tr key={item.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-5">
                          <img 
                            src={item.foto || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"} 
                            alt={item.registration_number} 
                            className="w-16 h-10 object-cover rounded border border-[#d2d6de]"
                          />
                        </td>
                        <td className="py-3 px-5">
                          <span className="font-mono font-bold text-[#3c8dbc] text-[15px]">{item.registration_number}</span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="font-bold text-[#333]">{item.aircraft_type}</div>
                        </td>
                        <td className="py-3 px-5 font-mono font-bold text-[#333]">
                          {item.mtow?.toLocaleString('id-ID')} Kg
                        </td>
                        <td className="py-3 px-5 text-center">
                          {item.status === 'aktif' ? (
                            <span className="bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 font-bold text-[11px] px-2.5 py-1 uppercase rounded-sm">
                              Aktif
                            </span>
                          ) : (
                            <span className="bg-[#f39c12]/10 text-[#f39c12] border border-[#f39c12]/20 font-bold text-[11px] px-2.5 py-1 uppercase rounded-sm">
                              Maintenance
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => handleEdit(item)} className="bg-white border border-[#d2d6de] text-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white p-1.5 transition-colors shadow-sm" title="Edit Data">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(item.id!)} className="bg-white border border-[#d2d6de] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white p-1.5 transition-colors shadow-sm" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
