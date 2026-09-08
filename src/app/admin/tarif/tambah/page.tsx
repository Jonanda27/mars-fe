"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { tariffService } from '@/services/tariffService';

export default function TambahTarifPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kode_tarif: '',
    jenis_layanan: '',
    objek: '',
    satuan: '',
    tarif: '',
    dasar_hukum: '',
    valid_from: '',
    valid_to: '',
    status: 'Active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validasi dan konversi
      const payload = {
        ...formData,
        tarif: parseFloat(formData.tarif),
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : undefined,
        valid_to: formData.valid_to ? new Date(formData.valid_to).toISOString() : undefined,
      };

      await tariffService.create(payload);
      router.push('/admin/tarif');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyimpan tarif baru.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tarif" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tambah Tarif Baru</h1>
            <p className="text-gray-600 mt-1">Masukkan detail master tarif bandara</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow border-t-[3px] border-[#3c8dbc] p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Tarif *</label>
              <input
                type="text"
                name="kode_tarif"
                required
                value={formData.kode_tarif}
                onChange={handleChange}
                placeholder="Contoh: PJK-BDR-01"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Layanan *</label>
              <input
                type="text"
                name="jenis_layanan"
                required
                value={formData.jenis_layanan}
                onChange={handleChange}
                placeholder="Contoh: Sewa Ruangan"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Objek Tarif *</label>
              <input
                type="text"
                name="objek"
                required
                value={formData.objek}
                onChange={handleChange}
                placeholder="Contoh: Ruang Perkantoran Terminal Penumpang"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Satuan *</label>
              <input
                type="text"
                name="satuan"
                required
                value={formData.satuan}
                onChange={handleChange}
                placeholder="Contoh: m2/Bulan"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tarif Dasar (Rp) *</label>
              <input
                type="number"
                name="tarif"
                required
                min="0"
                step="0.01"
                value={formData.tarif}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dasar Hukum</label>
              <input
                type="text"
                name="dasar_hukum"
                value={formData.dasar_hukum}
                onChange={handleChange}
                placeholder="Contoh: Perda No. X Tahun 2024"
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Berlaku Dari (Opsional)</label>
              <input
                type="date"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Berlaku Sampai (Opsional)</label>
              <input
                type="date"
                name="valid_to"
                value={formData.valid_to}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#3c8dbc]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <Link 
              href="/admin/tarif" 
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-[#3c8dbc] text-white font-semibold rounded hover:bg-[#367fa9] transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Tarif</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
