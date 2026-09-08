"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Loader2, FileText, Database } from 'lucide-react';
import { tariffService } from '@/services/tariffService';
import { MasterTariff } from '@/types/tariff';
import { formatRupiah } from '@/utils/formatCurrency';

export default function MasterTarifPage() {
  const [tariffs, setTariffs] = useState<MasterTariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const data = await tariffService.getAll();
      setTariffs(data);
    } catch (error) {
      console.error("Error fetching tariffs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tarif ini?')) return;
    
    try {
      setDeleting(true);
      await tariffService.delete(id);
      await fetchTariffs();
    } catch (error) {
      console.error("Error deleting tariff:", error);
      alert('Gagal menghapus tarif. Pastikan tidak ada data yang terikat.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredTariffs = tariffs.filter(t => 
    t.kode_tarif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.jenis_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.objek.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Tarif</h1>
          <p className="text-slate-500 text-sm">Kelola data tarif dan layanan bandara.</p>
        </div>
        <Link 
          href="/admin/tarif/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tarif</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Daftar Tarif ({filteredTariffs.length})
          </h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari tarif..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded text-sm focus:outline-none focus:border-[#3c8dbc]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Kode Tarif</th>
                <th className="p-4 font-semibold">Jenis Layanan</th>
                <th className="p-4 font-semibold">Objek</th>
                <th className="p-4 font-semibold">Tarif</th>
                <th className="p-4 font-semibold text-center">Satuan</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                    <p>Memuat data tarif...</p>
                  </td>
                </tr>
              ) : filteredTariffs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada data tarif ditemukan
                  </td>
                </tr>
              ) : (
                filteredTariffs.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-blue-600 font-medium">{t.kode_tarif}</td>
                    <td className="p-4 font-medium text-slate-800">{t.jenis_layanan}</td>
                    <td className="p-4 text-slate-600">{t.objek}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      {formatRupiah(t.tarif)}
                    </td>
                    <td className="p-4 text-center text-slate-600">
                      {t.satuan}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.status === 'Active' ? 'AKTIF' : 'INAKTIF'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/tarif/edit/${t.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors text-xs font-semibold"
                        >
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={deleting}
                          className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded transition-colors text-xs font-semibold disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
