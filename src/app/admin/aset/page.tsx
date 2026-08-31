"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { assetService } from '@/services/assetService';
import { Asset } from '@/types/asset';
import { Building, MapPin, Plus, Edit, Trash2, Home, Search, Loader2 } from 'lucide-react';

export default function MasterAsetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id: number, kode: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aset ${kode}?`)) {
      try {
        await assetService.deleteAsset(id);
        fetchAssets();
      } catch (error) {
        alert('Gagal menghapus aset');
      }
    }
  };

  const filteredAssets = filterType === 'All' ? assets : assets.filter(a => a.jenis_aset === filterType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-[#00a65a]';
      case 'Reserved': return 'bg-[#f39c12]';
      case 'Contracted': return 'bg-[#3c8dbc]';
      case 'Active': return 'bg-[#0073b7]';
      case 'Maintenance': return 'bg-[#dd4b39]';
      case 'Vacant': return 'bg-[#6c757d]';
      case 'Leased': return 'bg-[#3c8dbc]';
      case 'Restricted': return 'bg-[#dd4b39]';
      case 'Closed': return 'bg-[#333333]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Master Data Aset <small className="text-[15px] text-[#777] ml-2 font-light">Kelola Fasilitas Bandara</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <Home className="w-3 h-3 mr-1" /> <span className="mr-1">Home</span> / <span className="ml-1 font-medium">Data Aset</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Building className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Daftar Aset & Fasilitas
          </h3>
          <Link href="/admin/aset/tambah" className="bg-[#3c8dbc] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#367fa9] transition-colors flex items-center rounded-sm">
            <Plus className="w-4 h-4 mr-1" /> Tambah Aset
          </Link>
        </div>
        
        <div className="p-4 border-b border-[#f4f4f4] bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#333]">
            <span>Filter Jenis:</span>
            <select 
              className="border border-[#d2d6de] px-2 py-1 outline-none focus:border-[#3c8dbc] bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">Semua Aset</option>
              <option value="Hanggar">Hanggar</option>
              <option value="Ruang Office">Ruang Office</option>
              <option value="Gudang Warehouse">Gudang Warehouse</option>
            </select>
          </div>
          <div className="relative">
            <input type="text" placeholder="Cari aset..." className="border border-[#d2d6de] pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-[#3c8dbc] w-full sm:w-64" />
            <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data aset...
            </div>
          ) : (
            <table className="w-full text-[14px] text-left">
              <thead>
                <tr className="border-b border-[#f4f4f4] bg-slate-50 text-[#333]">
                  <th className="py-3 px-4 font-bold w-[120px]">KODE ASET</th>
                  <th className="py-3 px-4 font-bold">JENIS</th>
                  <th className="py-3 px-4 font-bold">NAMA ASET</th>
                  <th className="py-3 px-4 font-bold">LUAS / KAPASITAS</th>
                  <th className="py-3 px-4 font-bold">STATUS</th>
                  <th className="py-3 px-4 font-bold text-center w-[150px]">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777]">
                      Belum ada data aset. Silakan tambah aset baru.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-4 font-bold text-[#3c8dbc]">{asset.kode_aset}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[#f4f4f4] text-[#444] px-2 py-0.5 text-[12px] border border-[#d2d6de]">
                          {asset.jenis_aset}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#333]">{asset.nama_aset}</div>
                        {asset.lokasi && (
                          <div className="text-[12px] text-[#777] flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" /> {asset.lokasi}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#555]">
                        <div>{asset.luas ? `${asset.luas} m²` : '-'}</div>
                        {asset.kapasitas && <div className="text-[12px] text-[#777] mt-0.5">Kapasitas: {asset.kapasitas}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`${getStatusColor(asset.status || '')} text-white text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm`}>
                          {asset.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          <Link href={`/admin/aset/edit/${asset.id}`} className="bg-[#f39c12] text-white p-1.5 hover:bg-[#e08e0b] shadow-sm rounded-sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(asset.id, asset.kode_aset)} className="bg-[#dd4b39] text-white p-1.5 hover:bg-[#d73925] shadow-sm rounded-sm" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
