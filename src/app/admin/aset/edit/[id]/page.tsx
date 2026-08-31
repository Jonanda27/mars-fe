"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { assetService } from '@/services/assetService';
import { Building, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditAsetPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    kode_aset: '',
    jenis_aset: 'Hanggar',
    nama_aset: '',
    lokasi: '',
    zona: '',
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

  useEffect(() => {
    if (id) {
      assetService.getAssetById(parseInt(id)).then(data => {
        setFormData({
          kode_aset: data.kode_aset || '',
          jenis_aset: data.jenis_aset || 'Hanggar',
          nama_aset: data.nama_aset || '',
          lokasi: data.lokasi || '',
          zona: data.zona || '',
          koordinat_gis: data.koordinat_gis || '',
          luas: data.luas ? data.luas.toString() : '',
          satuan: data.satuan || 'm²',
          kapasitas: data.kapasitas || '',
          kondisi: data.kondisi || 'Baik',
          status: data.status || 'Available',
          master_tariff_id: data.master_tariff_id ? data.master_tariff_id.toString() : '',
          dokumen_kepemilikan: data.dokumen_kepemilikan || '',
        });
        
        if (data.jenis_aset === 'Hanggar' && data.spesifikasi_detail) {
          setSpesifikasi({
            ...spesifikasi,
            ...data.spesifikasi_detail
          });
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

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
    setSaving(true);
    try {
      const payload = {
        ...formData,
        luas: formData.luas ? parseFloat(formData.luas) : null,
        master_tariff_id: formData.master_tariff_id ? parseInt(formData.master_tariff_id) : null,
        spesifikasi_detail: formData.jenis_aset === 'Hanggar' ? spesifikasi : null
      };
      await assetService.updateAsset(parseInt(id), payload);
      router.push('/admin/aset');
    } catch (error: any) {
      alert('Gagal mengupdate aset: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const isHanggar = formData.jenis_aset === 'Hanggar';

  const statusOptions = isHanggar 
    ? ['Available', 'Reserved', 'Leased', 'Maintenance', 'Restricted', 'Closed']
    : ['Available', 'Reserved', 'Contracted', 'Active', 'Maintenance', 'Vacant'];

  if (loading) {
    return <div className="p-10 text-center flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" /></div>;
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Edit Data Aset
        </h1>
      </header>

      <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Building className="w-5 h-5 mr-2 text-[#f39c12]" /> Perbarui Formulir
          </h3>
          <Link href="/admin/aset" className="bg-[#f4f4f4] text-[#444] border border-[#d2d6de] px-3 py-1.5 text-[12px] hover:bg-[#e0e0e0] transition-colors flex items-center rounded-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <h4 className="font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]">Informasi Utama</h4>
              
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Asset ID (Kode) <span className="text-red-500">*</span></label>
                <input required type="text" name="kode_aset" value={formData.kode_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" disabled />
                <p className="text-[11px] text-[#777] mt-1">Kode aset tidak dapat diubah</p>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Jenis Aset <span className="text-red-500">*</span></label>
                <select required name="jenis_aset" value={formData.jenis_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  <option value="Hanggar">Hanggar</option>
                  <option value="Ruang Office">Ruang Office</option>
                  <option value="Gudang Warehouse">Gudang Warehouse</option>
                  <option value="Lahan">Lahan Terbuka</option>
                  <option value="Konter Tiket">Konter Tiket</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Nama Aset <span className="text-red-500">*</span></label>
                <input required type="text" name="nama_aset" value={formData.nama_aset} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Lokasi</label>
                  <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Zona</label>
                  <input type="text" name="zona" value={formData.zona} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Koordinat GIS</label>
                <input type="text" name="koordinat_gis" value={formData.koordinat_gis} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#333] mb-4 pb-2 border-b border-[#f4f4f4]">Dimensi & Pengelolaan</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Luas</label>
                  <input type="number" step="0.01" name="luas" value={formData.luas} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Satuan</label>
                  <input type="text" name="satuan" value={formData.satuan} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Kapasitas</label>
                  <input type="text" name="kapasitas" value={formData.kapasitas} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Kondisi</label>
                  <select name="kondisi" value={formData.kondisi} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Status Aset <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[#444] text-[13px] font-bold mb-1">Pilih Master Tarif / Harga (Opsional)</label>
                <select name="master_tariff_id" value={formData.master_tariff_id} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc] bg-white">
                  <option value="">-- Tidak ada tarif / Hanggar --</option>
                  <option value="1">Ruang Perkantoran / Gedung - Rp 60.000 / m2</option>
                  <option value="2">Ruang Kantin - Rp 35.000 / m2</option>
                  <option value="3">Gudang Tertutup - Rp 27.500 / m2</option>
                  <option value="4">Lahan Terbuka / Gudang Terbuka - Rp 15.000 / m2</option>
                </select>
                <p className="text-[11px] text-[#777] mt-1">Kosongkan jika ini aset Hanggar, karena tarif ditentukan dari pesawat.</p>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-bold text-[#333] mb-1">Dok. Kepemilikan/Pengelolaan</label>
                <input type="text" name="dokumen_kepemilikan" value={formData.dokumen_kepemilikan} onChange={handleChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
              </div>

            </div>

          </div>

          {isHanggar && (
            <div className="mt-8 bg-slate-50 p-6 border border-[#d2d6de] rounded-sm">
              <h4 className="font-bold text-[#f39c12] mb-4 pb-2 border-b border-[#f39c12]/20 flex items-center">
                Spesifikasi Khusus Hanggar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Tinggi Bangunan</label>
                  <input type="text" name="tinggi_bangunan" value={spesifikasi.tinggi_bangunan} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Kapasitas Pesawat</label>
                  <input type="text" name="kapasitas_pesawat" value={spesifikasi.kapasitas_pesawat} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Jenis Pesawat (Maks)</label>
                  <input type="text" name="jenis_pesawat" value={spesifikasi.jenis_pesawat} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Fasilitas Listrik</label>
                  <input type="text" name="fasilitas_listrik" value={spesifikasi.fasilitas_listrik} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Fasilitas Air</label>
                  <input type="text" name="fasilitas_air" value={spesifikasi.fasilitas_air} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Pintu Hanggar</label>
                  <input type="text" name="pintu_hanggar" value={spesifikasi.pintu_hanggar} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Apron Connection</label>
                  <input type="text" name="apron_connection" value={spesifikasi.apron_connection} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Fire Safety</label>
                  <input type="text" name="fire_safety" value={spesifikasi.fire_safety} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#333] mb-1">Workshop / Office / Toilet</label>
                  <input type="text" name="workshop" value={spesifikasi.workshop} onChange={handleSpesifikasiChange} className="w-full border border-[#d2d6de] px-3 py-2 text-[14px] outline-none focus:border-[#3c8dbc]" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]">
            <Link href="/admin/aset" className="bg-[#f4f4f4] text-[#444] border border-[#d2d6de] px-5 py-2 text-[14px] font-bold hover:bg-[#e0e0e0] transition-colors rounded-sm">
              Batal
            </Link>
            <button type="submit" disabled={saving} className="bg-[#f39c12] text-white px-5 py-2 text-[14px] font-bold hover:bg-[#e08e0b] transition-colors rounded-sm flex items-center shadow-sm disabled:opacity-70">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Perbarui Data Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
