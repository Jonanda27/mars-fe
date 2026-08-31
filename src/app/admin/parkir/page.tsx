"use client";

import React, { useState } from 'react';
import { 
  Car, Search, Activity, CreditCard, 
  CheckCircle2, XCircle, Clock, Smartphone, MapPin
} from 'lucide-react';

export default function AdminParkirPage() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'langganan'

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Command Center: Smart Parking
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Smart Parking</span>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#00c0ef]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#777] text-[12px] font-bold uppercase">Total Kendaraan Hari Ini</span>
              <div className="text-[24px] font-bold text-[#333] mt-1 font-mono">1.258</div>
            </div>
            <Car className="w-8 h-8 text-[#00c0ef]/30" />
          </div>
        </div>
        
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#00a65a]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#777] text-[12px] font-bold uppercase">Pendapatan Real-time</span>
              <div className="text-[24px] font-bold text-[#00a65a] mt-1 font-mono">Rp 8,4 Juta</div>
            </div>
            <CreditCard className="w-8 h-8 text-[#00a65a]/30" />
          </div>
        </div>
        
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#f39c12]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#777] text-[12px] font-bold uppercase">Langganan Aktif (RFID)</span>
              <div className="text-[24px] font-bold text-[#333] mt-1 font-mono">342</div>
            </div>
            <Activity className="w-8 h-8 text-[#f39c12]/30" />
          </div>
        </div>
        
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#dd4b39]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#777] text-[12px] font-bold uppercase">Unmatched Transaction</span>
              <div className="text-[24px] font-bold text-[#dd4b39] mt-1 font-mono">4</div>
            </div>
            <XCircle className="w-8 h-8 text-[#dd4b39]/30" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm font-bold text-[14px] mt-2">
        <button 
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-3 border-t-[3px] flex justify-center items-center ${activeTab === 'live' ? 'border-[#3c8dbc] bg-white text-[#3c8dbc]' : 'border-transparent bg-slate-50 text-[#777] hover:bg-slate-100'}`}
        >
          <Activity className="w-5 h-5 mr-2" /> Live Parking Session (Gate)
        </button>
        <button 
          onClick={() => setActiveTab('langganan')}
          className={`flex-1 py-3 border-t-[3px] flex justify-center items-center ${activeTab === 'langganan' ? 'border-[#f39c12] bg-white text-[#f39c12]' : 'border-transparent bg-slate-50 text-[#777] hover:bg-slate-100'}`}
        >
          <CreditCard className="w-5 h-5 mr-2" /> Parkir Langganan (RFID)
        </button>
      </div>

      {/* Tab 1: Live Parking Session */}
      {activeTab === 'live' && (
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1 flex flex-col animate-in fade-in">
          <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Monitor Kendaraan Masuk / Keluar (ANPR)
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex">
                <input type="text" placeholder="Cari Plat Nomor (ex: PA 1234)..." className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[250px] font-mono" />
                <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                  <Search className="w-4 h-4 text-[#777]" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                  <th className="py-4 px-5 font-bold">Waktu & Gate</th>
                  <th className="py-4 px-5 font-bold">Plat Nomor (ANPR)</th>
                  <th className="py-4 px-5 font-bold text-center">Durasi / Status</th>
                  <th className="py-4 px-5 font-bold text-right">Tarif Parkir</th>
                  <th className="py-4 px-5 font-bold text-center">Metode Bayar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333] flex items-center"><Clock className="w-3 h-3 mr-1 text-[#777]"/> 14:32:05 WIT (Keluar)</div>
                    <div className="text-[11px] text-[#777] flex items-center mt-1"><MapPin className="w-3 h-3 mr-1"/> Gate Out 2 (Terminal)</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono bg-black text-white px-2 py-1 rounded-sm font-bold tracking-wider">PA 4412 XX</span>
                    <div className="text-[11px] text-[#555] mt-1">Roda 4 (Pascabayar)</div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="font-bold text-[#555]">2 Jam 15 Menit</div>
                    <span className="text-[10px] bg-[#00a65a] text-white px-2 py-0.5 rounded-full mt-1 inline-block">SELESAI (KELUAR)</span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">Rp 10.000</td>
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center text-[#3c8dbc] text-[12px] font-bold">
                      <CreditCard className="w-4 h-4 mr-1" /> E-Money
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors bg-[#f4f4f4]/50">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333] flex items-center"><Clock className="w-3 h-3 mr-1 text-[#777]"/> 14:30:10 WIT (Masuk)</div>
                    <div className="text-[11px] text-[#777] flex items-center mt-1"><MapPin className="w-3 h-3 mr-1"/> Gate In 1 (Kargo)</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono bg-black text-white px-2 py-1 rounded-sm font-bold tracking-wider">B 1234 YYY</span>
                    <div className="text-[11px] text-[#555] mt-1">Roda 6+ (Truk)</div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="font-bold text-[#f39c12]">-</div>
                    <span className="text-[10px] bg-[#f39c12] text-white px-2 py-0.5 rounded-full mt-1 inline-block animate-pulse">SEDANG PARKIR</span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#999]">-</td>
                  <td className="py-4 px-5 text-center text-[#999]">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Parkir Langganan RFID */}
      {activeTab === 'langganan' && (
        <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm flex-1 flex flex-col animate-in fade-in">
          <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#f39c12]" /> Manajemen Kartu Akses (RFID) Staf & Tenant
            </h3>
            
            <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white text-[13px] font-bold px-4 py-2 transition-colors flex items-center shadow-sm">
              <Activity className="w-4 h-4 mr-1" /> Daftarkan RFID Baru
            </button>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                  <th className="py-4 px-5 font-bold">Data Pelanggan (Tenant)</th>
                  <th className="py-4 px-5 font-bold">Nomor RFID / Kartu</th>
                  <th className="py-4 px-5 font-bold text-center">Tipe Langganan</th>
                  <th className="py-4 px-5 font-bold text-center">Masa Berlaku</th>
                  <th className="py-4 px-5 font-bold text-center">Aksi (Barrier Gate)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">Budi Santoso (PT. Trigana)</div>
                    <div className="text-[11px] text-[#555] font-mono mt-1">Mobil: PA 9991 AB</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-[#3c8dbc] font-bold">RFID-2026-A001</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#ecf0f5] text-[#555] px-2 py-1 text-[11px] font-bold">Roda 4 Tahunan</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="text-[12px] text-[#00a65a] font-bold">Active</div>
                    <div className="text-[10px] text-[#777] mt-1">s/d 31 Des 2026</div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button className="text-[11px] bg-[#dd4b39] text-white px-3 py-1 hover:bg-[#d73925] transition-colors rounded-sm shadow-sm">Blokir Kartu</button>
                  </td>
                </tr>

                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors bg-[#dd4b39]/5">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">Agus Setiawan (Kargo)</div>
                    <div className="text-[11px] text-[#555] font-mono mt-1">Motor: PA 1122 YY</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-[#3c8dbc] font-bold">RFID-2025-M045</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#ecf0f5] text-[#555] px-2 py-1 text-[11px] font-bold">Roda 2 Bulanan</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="text-[12px] text-[#dd4b39] font-bold flex items-center justify-center">
                      <XCircle className="w-3 h-3 mr-1" /> Expired
                    </div>
                    <div className="text-[10px] text-[#777] mt-1">Berakhir 14 Ags 2026</div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button className="text-[11px] bg-[#00a65a] text-white px-3 py-1 hover:bg-[#008d4c] transition-colors rounded-sm shadow-sm">Perpanjang Akses</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
            <span>Menampilkan data akses RFID berlangganan. Kartu berstatus "Expired" akan otomatis <strong>Ditolak di Gate</strong>.</span>
          </div>
        </div>
      )}

    </div>
  );
}
