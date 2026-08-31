"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assetService } from '@/services/assetService';
import { Building, Save, ArrowLeft, Loader2, ChevronRight, ChevronLeft, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAirportStore } from '@/store/useAirportStore';
import { useZoneStore } from '@/store/useZoneStore';
import { useTariffStore } from '@/store/useTariffStore';

export default function TambahAsetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const { airports, fetchAirports } = useAirportStore();
  const { zones, fetchZones } = useZoneStore();
  const { tariffs, fetchTariffs } = useTariffStore();

  useEffect(() => {
    fetchAirports();
    fetchZones();
    fetchTariffs();
  }, []);

  const [formData, setFormData] = useState({
    kode_aset: '',
    jenis_aset: 'Hanggar',
    nama_aset: '',
    lokasi: '',
    airport_id: '',
    zone_id: '',
    koordinat_gis: '',
    luas: '',
    satuan: 'm²',
    kapasitas: '',
    kondisi: 'Baik',
    status: 'Available',
    master_tariff_id: '',
    dokumen_kepemilikan: '',
  });

  const [spesifikasi, setSpesifikasi] = useState({
    tinggi_bangunan: '',
    kapasitas_pesawat: '',
    jenis_pesawat: '',
    fasilitas_listrik: '',
    fasilitas_air: '',
    pintu_hanggar: '',
    apron_connection: '',
    workshop: '',
    office: '',
    storage: '',
    toilet: '',
    fire_safety: '',
    fasilitas_lainnya: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpesifikasiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpesifikasi(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        airport_id: formData.airport_id ? parseInt(formData.airport_id) : null,
        zone_id: formData.zone_id ? parseInt(formData.zone_id) : null,
        luas: formData.luas ? parseFloat(formData.luas) : null,
        master_tariff_id: formData.master_tariff_id ? parseInt(formData.master_tariff_id) : null,
        spesifikasi_detail: formData.jenis_aset === 'Hanggar' ? spesifikasi : null
      };
      await assetService.createAsset(payload);
      router.push('/admin/aset');
    } catch (error: any) {
      alert('Gagal menyimpan aset: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isHanggar = formData.jenis_aset === 'Hanggar';

  const statusOptions = isHanggar 
    ? ['Available', 'Reserved', 'Leased', 'Maintenance', 'Restricted', 'Closed']
    : ['Available', 'Reserved', 'Contracted', 'Active', 'Maintenance', 'Vacant'];

  const filteredZones = zones.filter(z => !formData.airport_id || z.airport_id === parseInt(formData.airport_id));
  const activeTariffs = tariffs.filter(t => t.status === 'Active');

  const tabs = [
    { id: 1, title: 'Informasi Dasar', icon: Building },
    { id: 2, title: 'Dimensi & Pengelolaan', icon: MapPin },
    ...(isHanggar ? [{ id: 3, title: 'Spesifikasi Hanggar', icon: CheckCircle }] : [])
  ];

  const handleNext = () => {
    if (activeTab < tabs.length) setActiveTab(activeTab + 1);
  };

  const handlePrev = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Tambah Aset Baru
        </h1>
      </header>

      <div className="bg-white shadow-sm rounded-sm overflow-hidden">
        
        {/* WIZARD HEADER */}
        <div className="bg-[#f4f4f4] border-b border-[#d2d6de]">
          <div className="flex">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isPast = activeTab > tab.id;
              return (
                <div 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 flex flex-col items-center justify-center border-t-[3px] cursor-pointer transition-colors
                    ${isActive ? 'border-[#3c8dbc] bg-white text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                    ${isActive ? 'bg-[#3c8dbc] text-white' : isPast ? 'bg-[#00a65a] text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {isPast ? <CheckCircle className="w-4 h-4" /> : tab.id}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">{tab.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* TAB 1: Informasi Dasar */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Asset ID (Kode) <span className="text-red-500">*</span></label>
                  <input required type="text" name="kode_aset" value={formData.kode_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Contoh: HGR-001" />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Jenis Aset <span className="text-red-500">*</span></label>
                  <select required name="jenis_aset" value={formData.jenis_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    <option value="Hanggar">Hanggar</option>
                    <option value="Ruang Office">Ruang Office</option>
                    <option value="Gudang Warehouse">Gudang Warehouse</option>
                    <option value="Lahan">Lahan Terbuka</option>
                    <option value="Konter Tiket">Konter Tiket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Nama Aset <span className="text-red-500">*</span></label>
                  <input required type="text" name="nama_aset" value={formData.nama_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Contoh: Hanggar A" />
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Bandara <span className="text-red-500">*</span></label>
                  <select required name="airport_id" value={formData.airport_id} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    <option value="">-- Pilih Bandara --</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>{airport.kode_bandara} - {airport.nama_bandara}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Zona <span className="text-red-500">*</span></label>
                  <select required name="zone_id" value={formData.zone_id} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white" disabled={!formData.airport_id}>
                    <option value="">-- Pilih Zona --</option>
                    {filteredZones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.nama_zona} ({zone.kode_zona})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Koordinat GIS</label>
                  <input type="text" name="koordinat_gis" value={formData.koordinat_gis} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Contoh: -4.545, 136.885" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dimensi & Pengelolaan */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#333] mb-1">Luas</label>
                    <input type="number" step="0.01" name="luas" value={formData.luas} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#333] mb-1">Satuan</label>
                    <input type="text" name="satuan" value={formData.satuan} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="m²" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Kapasitas</label>
                  <input type="text" name="kapasitas" value={formData.kapasitas} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Dok. Kepemilikan/Pengelolaan</label>
                  <input type="text" name="dokumen_kepemilikan" value={formData.dokumen_kepemilikan} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Contoh: SHM No. 123" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Kondisi</label>
                  <select name="kondisi" value={formData.kondisi} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Status Aset <span className="text-red-500">*</span></label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#444] text-[13px] font-bold mb-1">Pilih Master Tarif / Harga (Opsional)</label>
                  <select name="master_tariff_id" value={formData.master_tariff_id} onChange={handleChange} className="w-full border border-[#d2d6de] px-4 py-2.5 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    <option value="">-- Tidak ada tarif / Custom --</option>
                    {activeTariffs.map(tariff => (
                      <option key={tariff.id} value={tariff.id}>
                        {tariff.jenis_layanan} - {tariff.objek} (Rp {parseInt(tariff.tarif as string).toLocaleString('id-ID')} / {tariff.satuan})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#777] mt-1">Sesuai Peraturan yang berlaku. Kosongkan jika tagihan dihitung dari sistem lain.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Spesifikasi Hanggar */}
          {activeTab === 3 && isHanggar && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-[#f0f7fb] p-6 border-l-4 border-[#3c8dbc] mb-6">
                <h4 className="font-bold text-[#3c8dbc] text-lg mb-1">Spesifikasi Detail Hanggar</h4>
                <p className="text-sm text-gray-600">Mohon lengkapi data spesifikasi fisik dan utilitas hanggar untuk ditampilkan di katalog Tenant.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Tinggi Bangunan</label>
                  <input type="text" name="tinggi_bangunan" value={spesifikasi.tinggi_bangunan} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: 25 Meter" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Kapasitas Pesawat</label>
                  <input type="text" name="kapasitas_pesawat" value={spesifikasi.kapasitas_pesawat} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: 2 Pesawat Narrow Body" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Jenis Pesawat (Maks)</label>
                  <input type="text" name="jenis_pesawat" value={spesifikasi.jenis_pesawat} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: Boeing 737 / A320" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Daya Listrik</label>
                  <input type="text" name="fasilitas_listrik" value={spesifikasi.fasilitas_listrik} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: 15.000 VA" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Sistem Air</label>
                  <input type="text" name="fasilitas_air" value={spesifikasi.fasilitas_air} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: PAM / Sumur Bor" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Pintu Hanggar</label>
                  <input type="text" name="pintu_hanggar" value={spesifikasi.pintu_hanggar} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: Motorized Sliding Door" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Koneksi Apron</label>
                  <input type="text" name="apron_connection" value={spesifikasi.apron_connection} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: Akses Langsung Taxiway" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Fire Safety System</label>
                  <input type="text" name="fire_safety" value={spesifikasi.fire_safety} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: Hydrant & Sprinkler" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase font-bold tracking-wider text-gray-600 mb-1">Office & Toilet</label>
                  <input type="text" name="office" value={spesifikasi.office} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-4 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-gray-50 focus:bg-white" placeholder="Misal: 2 Ruang Office, 4 Toilet" />
                </div>
              </div>
            </div>
          )}

          {/* WIZARD NAVIGATION */}
          <div className="mt-10 flex justify-between pt-6 border-t border-gray-200">
            {activeTab > 1 ? (
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors flex items-center">
                <ChevronLeft className="w-4 h-4 mr-2" /> Sebelumnya
              </button>
            ) : (
              <Link href="/admin/aset" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-600 font-bold uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors flex items-center">
                Batal
              </Link>
            )}

            {activeTab < tabs.length ? (
              <button type="button" onClick={handleNext} className="px-6 py-2.5 bg-[#3c8dbc] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#367fa9] transition-colors flex items-center shadow-sm">
                Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="px-8 py-2.5 bg-[#00a65a] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#008d4c] transition-colors flex items-center shadow-md disabled:opacity-70">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                {loading ? 'Menyimpan...' : 'Simpan Aset'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
