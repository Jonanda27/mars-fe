"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Loader2, FileText, Database } from 'lucide-react';
import { tariffService } from '@/services/tariffService';
import { MasterTariff } from '@/types/tariff';
import { formatRupiah } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

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
      toast.error('Gagal menghapus tarif. Pastikan tidak ada data yang terikat.');
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
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Master Tarif <small className="text-[15px] font-light text-[#777] ml-2">Kelola data tarif dan layanan bandara.</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Master Tarif</span>
        </div>
      </header>

      <div className="mb-4">
        <Link 
          href="/admin/tarif/tambah" 
          className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 text-sm font-semibold shadow-sm inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tarif</span>
        </Link>
      </div>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Tarif ({filteredTariffs.length})</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari tarif..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 border border-[#d2d6de] text-sm focus:outline-none focus:border-[#3c8dbc]"
            />
            <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-1.5" />
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                <th className="py-3 px-4 font-bold">Kode Tarif</th>
                <th className="py-3 px-4 font-bold">Jenis Layanan</th>
                <th className="py-3 px-4 font-bold">Objek</th>
                <th className="py-3 px-4 font-bold">Tarif</th>
                <th className="py-3 px-4 font-bold text-center">Satuan</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-center">Aksi</th>
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
                  <tr key={t.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-[#3c8dbc] font-bold">{t.kode_tarif}</td>
                    <td className="py-3 px-4 font-bold text-[#333]">{t.jenis_layanan}</td>
                    <td className="py-3 px-4 text-[#555]">{t.objek}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#333]">
                      {formatRupiah(t.tarif)}
                    </td>
                    <td className="py-3 px-4 text-center text-[#555]">
                      {t.satuan}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-[11px] rounded-sm font-bold uppercase tracking-wide ${t.status === 'Active' ? 'bg-[#00a65a] text-white' : 'bg-[#dd4b39] text-white'}`}>
                        {t.status === 'Active' ? 'AKTIF' : 'INAKTIF'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          href={`/admin/tarif/edit/${t.id}`}
                          className="bg-[#3c8dbc] text-white p-1.5 hover:bg-[#367fa9] shadow-sm rounded-sm" title="Edit Tarif"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={deleting}
                          className="bg-[#dd4b39] text-white p-1.5 hover:bg-[#c9302c] shadow-sm rounded-sm disabled:opacity-50" title="Hapus Tarif"
                        >
                          <Trash2 className="w-4 h-4" />
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
