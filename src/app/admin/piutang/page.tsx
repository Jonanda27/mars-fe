"use client";

import React, { useState } from 'react';
import { 
  Clock, AlertTriangle, AlertOctagon, TrendingDown, 
  Send, FileText, CheckCircle2, ChevronRight, BarChart
} from 'lucide-react';

export default function AdminPiutangPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', '0-30', '31-60', '61-90', '>90'

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Laporan Umur Piutang Sewa (Aging Report)
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Aging Piutang</span>
        </div>
      </header>

      {/* Overview Metrik Utama (Mirip PDF) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3 shadow-sm border-t-2 border-[#3c8dbc] text-center flex flex-col justify-center">
          <span className="text-[#777] text-[11px] font-bold uppercase mb-1">Total Tagihan (M)</span>
          <span className="text-[20px] font-bold text-[#333] font-mono">Rp 12,4 M</span>
        </div>
        <div className="bg-white p-3 shadow-sm border-t-2 border-[#00a65a] text-center flex flex-col justify-center">
          <span className="text-[#777] text-[11px] font-bold uppercase mb-1">Terbayar (M)</span>
          <span className="text-[20px] font-bold text-[#00a65a] font-mono">Rp 9,8 M</span>
        </div>
        <div className="bg-[#222d32] p-3 shadow-sm text-center flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <TrendingDown className="w-16 h-16" />
          </div>
          <span className="text-[#b8c7ce] text-[11px] font-bold uppercase mb-1 relative z-10">Total Outstanding</span>
          <span className="text-[22px] font-bold text-[#f39c12] font-mono relative z-10">Rp 2,6 M</span>
        </div>
        <div className="bg-white p-3 shadow-sm border-t-2 border-[#f39c12] text-center flex flex-col justify-center">
          <span className="text-[#777] text-[11px] font-bold uppercase mb-1">Current (Lancar)</span>
          <span className="text-[20px] font-bold text-[#f39c12] font-mono">Rp 1,9 M</span>
        </div>
        <div className="bg-white p-3 shadow-sm border-t-2 border-[#dd4b39] text-center flex flex-col justify-center">
          <span className="text-[#777] text-[11px] font-bold uppercase mb-1">Overdue (Tunggakan)</span>
          <span className="text-[20px] font-bold text-[#dd4b39] font-mono">Rp 700 Jt</span>
        </div>
      </div>

      {/* Rincian Aging (0-30, 31-60, 61-90, >90) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        <button 
          onClick={() => setActiveFilter('0-30')}
          className={`flex items-center justify-between p-4 shadow-sm transition-transform hover:scale-[1.02] ${activeFilter === '0-30' ? 'bg-[#f39c12] text-white ring-2 ring-offset-2 ring-[#f39c12]' : 'bg-white border-l-[4px] border-[#f39c12]'}`}
        >
          <div>
            <div className={`text-[12px] font-bold uppercase ${activeFilter === '0-30' ? 'text-white' : 'text-[#777]'}`}>0 - 30 Hari</div>
            <div className={`text-[20px] font-bold font-mono mt-1 ${activeFilter === '0-30' ? 'text-white' : 'text-[#333]'}`}>Rp 350 Juta</div>
          </div>
          <Clock className={`w-8 h-8 opacity-50 ${activeFilter === '0-30' ? 'text-white' : 'text-[#f39c12]'}`} />
        </button>
        
        <button 
          onClick={() => setActiveFilter('31-60')}
          className={`flex items-center justify-between p-4 shadow-sm transition-transform hover:scale-[1.02] ${activeFilter === '31-60' ? 'bg-[#ff7701] text-white ring-2 ring-offset-2 ring-[#ff7701]' : 'bg-white border-l-[4px] border-[#ff7701]'}`}
        >
          <div>
            <div className={`text-[12px] font-bold uppercase ${activeFilter === '31-60' ? 'text-white' : 'text-[#777]'}`}>31 - 60 Hari</div>
            <div className={`text-[20px] font-bold font-mono mt-1 ${activeFilter === '31-60' ? 'text-white' : 'text-[#333]'}`}>Rp 150 Juta</div>
          </div>
          <AlertTriangle className={`w-8 h-8 opacity-50 ${activeFilter === '31-60' ? 'text-white' : 'text-[#ff7701]'}`} />
        </button>
        
        <button 
          onClick={() => setActiveFilter('61-90')}
          className={`flex items-center justify-between p-4 shadow-sm transition-transform hover:scale-[1.02] ${activeFilter === '61-90' ? 'bg-[#dd4b39] text-white ring-2 ring-offset-2 ring-[#dd4b39]' : 'bg-white border-l-[4px] border-[#dd4b39]'}`}
        >
          <div>
            <div className={`text-[12px] font-bold uppercase ${activeFilter === '61-90' ? 'text-white' : 'text-[#777]'}`}>61 - 90 Hari</div>
            <div className={`text-[20px] font-bold font-mono mt-1 ${activeFilter === '61-90' ? 'text-white' : 'text-[#333]'}`}>Rp 100 Juta</div>
          </div>
          <AlertTriangle className={`w-8 h-8 opacity-50 ${activeFilter === '61-90' ? 'text-white' : 'text-[#dd4b39]'}`} />
        </button>
        
        <button 
          onClick={() => setActiveFilter('>90')}
          className={`flex items-center justify-between p-4 shadow-sm transition-transform hover:scale-[1.02] ${activeFilter === '>90' ? 'bg-[#8c1b1b] text-white ring-2 ring-offset-2 ring-[#8c1b1b]' : 'bg-white border-l-[4px] border-[#8c1b1b]'}`}
        >
          <div>
            <div className={`text-[12px] font-bold uppercase ${activeFilter === '>90' ? 'text-white' : 'text-[#777]'}`}>&gt; 90 Hari (Macet)</div>
            <div className={`text-[20px] font-bold font-mono mt-1 ${activeFilter === '>90' ? 'text-white' : 'text-[#333]'}`}>Rp 100 Juta</div>
          </div>
          <AlertOctagon className={`w-8 h-8 opacity-50 ${activeFilter === '>90' ? 'text-white' : 'text-[#8c1b1b]'}`} />
        </button>
      </div>

      {/* Tabel Detail Piutang per Tenant */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1 flex flex-col mt-2">
        <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Rincian Tenant Penunggak 
            {activeFilter !== 'all' && <span className="ml-2 text-[12px] font-normal bg-[#3c8dbc] text-white px-2 py-0.5 rounded-full">Filter: Umur {activeFilter} Hari</span>}
          </h3>
          
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')}
              className="text-[#3c8dbc] text-[13px] font-bold hover:underline"
            >
              Lihat Semua Data
            </button>
          )}
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                <th className="py-4 px-5 font-bold">Data Penyewa (Tenant)</th>
                <th className="py-4 px-5 font-bold">Nomor SKRD (Tagihan)</th>
                <th className="py-4 px-5 font-bold text-center">Umur Piutang</th>
                <th className="py-4 px-5 font-bold text-right">Nilai Tunggakan (Rp)</th>
                <th className="py-4 px-5 font-bold text-center">Tindakan Penagihan</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: 0-30 Hari */}
              {(activeFilter === 'all' || activeFilter === '0-30') && (
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors border-l-[3px] border-l-transparent hover:border-l-[#f39c12]">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">PT. Airfast Indonesia</div>
                    <div className="text-[11px] text-[#555] mt-1">Sewa Lahan Terbuka</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-[#3c8dbc] font-bold">SKRD-26-0610</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#f39c12] text-white px-3 py-1 text-[11px] font-bold rounded-full">15 Hari</span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">120.000.000</td>
                  <td className="py-4 px-5 text-center">
                    <button className="text-[11px] bg-white border border-[#d2d6de] text-[#444] px-3 py-1 hover:bg-[#f4f4f4] transition-colors shadow-sm flex items-center mx-auto">
                      <Send className="w-3 h-3 mr-1 text-[#3c8dbc]" /> Kirim Reminder email
                    </button>
                  </td>
                </tr>
              )}

              {/* Row 2: 61-90 Hari */}
              {(activeFilter === 'all' || activeFilter === '61-90') && (
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors border-l-[3px] border-l-transparent hover:border-l-[#dd4b39]">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">PT. Global Aviasi (Demo)</div>
                    <div className="text-[11px] text-[#555] mt-1">Sewa Ruang Kantor (OFF-02)</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-[#3c8dbc] font-bold">SKRD-26-0402</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#dd4b39] text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-[0_0_8px_rgba(221,75,57,0.5)]">75 Hari</span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">100.000.000</td>
                  <td className="py-4 px-5 text-center">
                    <button className="text-[11px] bg-[#dd4b39] border border-[#d73925] text-white px-3 py-1 hover:bg-[#d73925] transition-colors shadow-sm flex items-center mx-auto">
                      <FileText className="w-3 h-3 mr-1" /> Cetak SP-2 (Teguran)
                    </button>
                  </td>
                </tr>
              )}

              {/* Row 3: >90 Hari */}
              {(activeFilter === 'all' || activeFilter === '>90') && (
                <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors bg-[#8c1b1b]/5 border-l-[3px] border-l-[#8c1b1b]">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">CV. Kargo Ekspedisi Papua</div>
                    <div className="text-[11px] text-[#555] mt-1">Sewa Gudang (WHS-01)</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-[#3c8dbc] font-bold">SKRD-26-0115</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#8c1b1b] text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-[0_0_10px_rgba(140,27,27,0.6)] flex items-center justify-center w-max mx-auto">
                      <AlertOctagon className="w-3 h-3 mr-1" /> 140 Hari (Macet)
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#8c1b1b]">100.000.000</td>
                  <td className="py-4 px-5 text-center">
                    <button className="text-[11px] bg-[#8c1b1b] text-white px-3 py-1 hover:bg-[#721515] transition-colors shadow-sm flex items-center mx-auto">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Blokir / Terminasi Aset
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
