"use client";

import React, { useState } from 'react';
import { 
  RefreshCcw, Search, Download, CheckCircle, 
  XCircle, Filter, FileSpreadsheet, ArrowRightLeft, DollarSign 
} from 'lucide-react';

export default function AdminRekonsiliasiPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncBank = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Sinkronisasi Selesai! Menemukan 3 transaksi baru dari Bank Papua yang cocok dengan SKRD.");
    }, 2000);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Rekonsiliasi Pendapatan Daerah
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Rekonsiliasi</span>
        </div>
      </header>

      {/* Box Panel Kontrol Sinkronisasi */}
      <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#00a65a]/10 text-[#00a65a] rounded flex items-center justify-center mr-4">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[16px] text-[#444] font-bold mb-1">Status Mutasi Bank Daerah (Kasda)</h3>
            <p className="text-[13px] text-[#666]">Terakhir sinkronisasi: <span className="font-bold">Hari ini, 10:45 WIT</span></p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="flex items-center justify-center bg-white border border-[#d2d6de] hover:bg-slate-50 text-[#444] font-bold text-[13px] px-4 py-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-[#00a65a]" /> Ekspor Laporan BPK (.xlsx)
          </button>
          
          <button 
            onClick={handleSyncBank}
            disabled={isSyncing}
            className={`flex items-center justify-center font-bold text-[13px] px-4 py-2 transition-colors shadow-sm ${
              isSyncing ? 'bg-[#d2d6de] text-[#777] cursor-not-allowed' : 'bg-[#00a65a] hover:bg-[#008d4c] text-white'
            }`}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Menarik Data Bank...' : 'Sinkronisasi Mutasi Sekarang'}
          </button>
        </div>
      </div>

      {/* Ringkasan Saldo Bulan Ini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#3c8dbc]">
          <span className="text-[#777] text-[12px] font-bold uppercase">Total Tagihan (SKRD) Terbit Bulan Ini</span>
          <div className="text-[24px] font-bold text-[#333] mt-1 font-mono">Rp 450.000.000</div>
        </div>
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#00a65a]">
          <span className="text-[#777] text-[12px] font-bold uppercase">Berhasil Direkonsiliasi (Uang Masuk)</span>
          <div className="text-[24px] font-bold text-[#00a65a] mt-1 font-mono">Rp 180.000.000</div>
        </div>
        <div className="bg-white p-4 shadow-sm border-l-[4px] border-[#dd4b39]">
          <span className="text-[#777] text-[12px] font-bold uppercase">Belum Terekonsiliasi (Selisih)</span>
          <div className="text-[24px] font-bold text-[#dd4b39] mt-1 font-mono">Rp 270.000.000</div>
        </div>
      </div>

      {/* Tabel Jurnal Mutasi & Pencocokan */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1 flex flex-col mt-2">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Jurnal Rekonsiliasi (Bank vs Sistem MARS)
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Filter Date */}
            <div className="flex items-center border border-[#d2d6de] bg-white px-2">
              <Filter className="w-4 h-4 text-[#777] mr-2" />
              <input type="date" className="py-1.5 text-[13px] focus:outline-none text-[#555] bg-transparent" defaultValue="2026-09-15" />
            </div>

            {/* Search Box */}
            <div className="flex">
              <input type="text" placeholder="Cari Kode VA atau Ref..." className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[200px]" />
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
                <th className="py-4 px-5 font-bold">Waktu Transaksi (Bank)</th>
                <th className="py-4 px-5 font-bold">Keterangan Mutasi Masuk</th>
                <th className="py-4 px-5 font-bold text-right">Nominal Masuk (Rp)</th>
                <th className="py-4 px-5 font-bold text-center">Status Rekonsiliasi</th>
                <th className="py-4 px-5 font-bold">Pencocokan e-SKRD Sistem</th>
              </tr>
            </thead>
            <tbody>
              
              {/* Row 1 - Matched */}
              <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors bg-[#00a65a]/5">
                <td className="py-4 px-5">
                  <div className="font-bold text-[#333]">15 Sep 2026</div>
                  <div className="text-[11px] text-[#777]">09:12:45 WIT</div>
                </td>
                <td className="py-4 px-5">
                  <div className="font-bold text-[#3c8dbc] text-[13px]">TRANSFER VIA VA 8989-1122-3344</div>
                  <div className="text-[11px] text-[#555] uppercase mt-1">Pengirim: PT. ASI PUDJIASTUTI</div>
                </td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#00a65a]">
                  180.000.000
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center text-[#00a65a] text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 mr-1" /> Cocok (Matched)
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="font-bold text-[#555] text-[12px]">SKRD-26-0801</div>
                  <div className="text-[11px] text-[#777]">Tagihan HGR-001 (Rp 180.000.000)</div>
                </td>
              </tr>

              {/* Row 2 - Unmatched (Suspense) */}
              <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors bg-[#dd4b39]/5">
                <td className="py-4 px-5">
                  <div className="font-bold text-[#333]">14 Sep 2026</div>
                  <div className="text-[11px] text-[#777]">14:30:00 WIT</div>
                </td>
                <td className="py-4 px-5">
                  <div className="font-bold text-[#dd4b39] text-[13px]">SETORAN TUNAI TELLER CAB. TIMIKA</div>
                  <div className="text-[11px] text-[#555] uppercase mt-1">Pengirim: NN / Tanpa Referensi</div>
                </td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">
                  15.500.000
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center text-[#dd4b39] text-[11px] font-bold uppercase tracking-wider">
                    <XCircle className="w-4 h-4 mr-1" /> Menggantung (Unmatched)
                  </span>
                  <div className="mt-1">
                    <button className="text-[10px] bg-[#dd4b39] text-white px-2 py-0.5 rounded-sm hover:bg-[#d73925]">Cocokkan Manual</button>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="text-[11px] text-[#dd4b39] font-bold italic">Sistem tidak menemukan SKRD dengan nominal tersebut yang dibayar via tunai.</span>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>Menampilkan mutasi tanggal 14-15 September 2026</span>
        </div>
      </div>

    </div>
  );
}
