"use client";

import React, { useState } from 'react';
import { 
  Activity, Search, Plus, Filter, Plane, 
  Zap, Droplet, Edit, Trash2 
} from 'lucide-react';

export default function AdminPemakaianPage() {
  const [showForm, setShowForm] = useState(false);
  const [kategoriTab, setKategoriTab] = useState('pesawat'); // 'pesawat' | 'utilitas'

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Log Pemakaian Harian & Utilitas
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Pemakaian</span>
        </div>
      </header>

      {/* Tabs Kategori Pemakaian */}
      <div className="flex bg-white shadow-sm font-bold text-[14px]">
        <button 
          onClick={() => setKategoriTab('pesawat')}
          className={`flex-1 py-3 border-t-[3px] flex justify-center items-center ${kategoriTab === 'pesawat' ? 'border-[#3c8dbc] bg-white text-[#3c8dbc]' : 'border-transparent bg-slate-50 text-[#777] hover:bg-slate-100'}`}
        >
          <Plane className="w-5 h-5 mr-2" /> Log Parkir Pesawat
        </button>
        <button 
          onClick={() => setKategoriTab('utilitas')}
          className={`flex-1 py-3 border-t-[3px] flex justify-center items-center ${kategoriTab === 'utilitas' ? 'border-[#f39c12] bg-white text-[#f39c12]' : 'border-transparent bg-slate-50 text-[#777] hover:bg-slate-100'}`}
        >
          <Zap className="w-5 h-5 mr-2" /> Pemakaian Listrik / Air
        </button>
      </div>

      {/* Panel Form Tambah Data */}
      {showForm && (
        <div className={`bg-white border-t-[3px] shadow-sm animate-in slide-in-from-top-2 duration-200 ${kategoriTab === 'pesawat' ? 'border-[#3c8dbc]' : 'border-[#f39c12]'}`}>
          <div className="p-4 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <Plus className={`w-5 h-5 mr-2 ${kategoriTab === 'pesawat' ? 'text-[#3c8dbc]' : 'text-[#f39c12]'}`} /> 
              Catat {kategoriTab === 'pesawat' ? 'Aktivitas Parkir' : 'Meteran Utilitas'} Baru
            </h3>
          </div>
          
          <form className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[14px]">
              
              <div>
                <label className="block mb-1 font-bold text-[#444]">Maskapai (Penyewa) <span className="text-[#dd4b39]">*</span></label>
                <select className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none bg-white">
                  <option value="susi">Susi Air (PT. ASI)</option>
                  <option value="trigana">PT. Trigana Air Service</option>
                  <option value="airfast">PT. Airfast Indonesia</option>
                </select>
              </div>
              
              {kategoriTab === 'pesawat' ? (
                <>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Registrasi Pesawat <span className="text-[#dd4b39]">*</span></label>
                    <input type="text" placeholder="Contoh: PK-JDA" className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none font-semibold uppercase" />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Waktu Masuk <span className="text-[#dd4b39]">*</span></label>
                    <input type="datetime-local" className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Waktu Keluar</label>
                    <input type="datetime-local" className="w-full p-2 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Jenis Utilitas <span className="text-[#dd4b39]">*</span></label>
                    <select className="w-full p-2 border border-[#d2d6de] focus:border-[#f39c12] focus:outline-none bg-white">
                      <option value="listrik">Listrik (kWh)</option>
                      <option value="air">Air Bersih (m³)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Bulan Tagihan <span className="text-[#dd4b39]">*</span></label>
                    <input type="month" className="w-full p-2 border border-[#d2d6de] focus:border-[#f39c12] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-[#444]">Total Pemakaian Angka Meter <span className="text-[#dd4b39]">*</span></label>
                    <input type="number" placeholder="Contoh: 1500" className="w-full p-2 border border-[#d2d6de] focus:border-[#f39c12] focus:outline-none" />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#f4f4f4]">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="bg-white hover:bg-slate-50 border border-[#d2d6de] text-[#444] text-[14px] px-6 py-2 transition-colors"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className={`${kategoriTab === 'pesawat' ? 'bg-[#3c8dbc] hover:bg-[#367fa9]' : 'bg-[#f39c12] hover:bg-[#e08e0b]'} text-white font-bold text-[14px] px-8 py-2 transition-colors shadow-sm`}
              >
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Database Log */}
      <div className={`bg-white border-t-[3px] shadow-sm flex-1 flex flex-col ${kategoriTab === 'pesawat' ? 'border-[#3c8dbc]' : 'border-[#f39c12]'}`}>
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Activity className={`w-5 h-5 mr-2 ${kategoriTab === 'pesawat' ? 'text-[#3c8dbc]' : 'text-[#f39c12]'}`} /> 
            Database Log {kategoriTab === 'pesawat' ? 'Aktivitas Pesawat' : 'Pemakaian Listrik/Air'}
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Filter Date */}
            <div className="flex items-center border border-[#d2d6de] bg-white px-2">
              <Filter className="w-4 h-4 text-[#777] mr-2" />
              <input type="month" className="py-1.5 text-[13px] focus:outline-none text-[#555] bg-transparent" defaultValue="2026-09" />
            </div>

            {/* Search Box */}
            <div className="flex">
              <input type="text" placeholder="Cari Nama Maskapai..." className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[200px]" />
              <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                <Search className="w-4 h-4 text-[#777]" />
              </button>
            </div>
            
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className={`${kategoriTab === 'pesawat' ? 'bg-[#3c8dbc] hover:bg-[#367fa9]' : 'bg-[#f39c12] hover:bg-[#e08e0b]'} text-white text-[13px] font-bold px-4 py-1.5 transition-colors flex items-center justify-center shadow-sm whitespace-nowrap`}
              >
                <Plus className="w-4 h-4 mr-1" /> Catat Pemakaian
              </button>
            )}
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {kategoriTab === 'pesawat' ? (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                  <th className="py-4 px-5 font-bold">Maskapai</th>
                  <th className="py-4 px-5 font-bold">Registrasi Pesawat</th>
                  <th className="py-4 px-5 font-bold">Log Masuk / Keluar</th>
                  <th className="py-4 px-5 font-bold text-center">Total Durasi</th>
                  <th className="py-4 px-5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 font-bold text-[#333]">Susi Air (PT. ASI)</td>
                  <td className="py-4 px-5 font-bold text-[#3c8dbc]">PK-VVS (Cessna 208B)</td>
                  <td className="py-4 px-5 text-[12px] text-[#555]">
                    <div>IN: 12 Sep 2026 18:00 WIT</div>
                    <div>OUT: 14 Sep 2026 06:00 WIT</div>
                  </td>
                  <td className="py-4 px-5 text-center font-bold text-[#00a65a]">2 Malam</td>
                  <td className="py-4 px-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-[#3c8dbc] hover:text-[#367fa9]" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="text-[#dd4b39] hover:text-[#d73925]" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                  <th className="py-4 px-5 font-bold">Maskapai (Aset)</th>
                  <th className="py-4 px-5 font-bold">Jenis Utilitas</th>
                  <th className="py-4 px-5 font-bold">Bulan Tagihan</th>
                  <th className="py-4 px-5 font-bold text-right">Volume Pemakaian</th>
                  <th className="py-4 px-5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">PT. Trigana Air Service</div>
                    <div className="text-[11px] text-[#777]">Ruang Kantor (OFF-05)</div>
                  </td>
                  <td className="py-4 px-5 text-[#f39c12] font-bold flex items-center">
                    <Zap className="w-4 h-4 mr-1" /> Listrik
                  </td>
                  <td className="py-4 px-5 text-[#555]">September 2026</td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">320 kWh</td>
                  <td className="py-4 px-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-[#3c8dbc] hover:text-[#367fa9]" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="text-[#dd4b39] hover:text-[#d73925]" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>Menampilkan data bulan September 2026</span>
        </div>
      </div>

    </div>
  );
}
