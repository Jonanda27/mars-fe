"use client";

import { 
  Wallet, Building2, CalendarDays, Plane, 
  ArrowRight, FileText, CheckCircle2, ShieldAlert, AlertTriangle
} from 'lucide-react';
import { useEffect } from 'react';
import { useWarningStore } from '@/store/useWarningStore';
import Link from 'next/link';

export default function TenantDashboard() {
  const { tenantWarnings, fetchTenantWarnings } = useWarningStore();

  useEffect(() => {
    fetchTenantWarnings();
  }, [fetchTenantWarnings]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Tenant Portal - Ringkasan Akun
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Dashboard</span> / <span className="ml-1 font-medium">PT. Jaya Dirgantara</span>
        </div>
      </header>

      {tenantWarnings.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded flex items-start shadow-sm">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Peringatan Penting</h4>
            <p className="text-sm mt-1">Anda memiliki Surat Peringatan aktif terkait tunggakan pembayaran. Segera selesaikan tagihan Anda untuk menghindari penghentian layanan.</p>
          </div>
          <Link href="/tenant/peringatan" className="bg-red-600 text-white px-3 py-1.5 text-xs rounded font-medium hover:bg-red-700 transition-colors ml-4">
            Lihat Surat
          </Link>
        </div>
      )}

      {/* 4 Single-Color Metric Boxes (Green for Tenant) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Box 1: Outstanding */}
        <div className="bg-[#3c8dbc] text-white">
          <div className="p-4 flex justify-between relative overflow-hidden">
            <div className="z-10">
              <h3 className="text-[28px] font-bold leading-none mb-1">450 <span className="text-[16px]">Jt</span></h3>
              <p className="text-[13px] text-white/90">Tagihan Belum Dibayar</p>
            </div>
            <Wallet className="w-[60px] h-[60px] absolute -right-2 -bottom-2 opacity-20 z-0" strokeWidth={1.5} />
          </div>
          <button className="w-full bg-black/10 hover:bg-black/20 py-1.5 text-[12px] text-center flex items-center justify-center transition-colors z-10 relative">
            Lihat Rincian <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Box 2: Kontrak Aktif */}
        <div className="bg-[#3c8dbc] text-white">
          <div className="p-4 flex justify-between relative overflow-hidden">
            <div className="z-10">
              <h3 className="text-[28px] font-bold leading-none mb-1">3 <span className="text-[16px]">Aset</span></h3>
              <p className="text-[13px] text-white/90">Kontrak Sewa Aktif</p>
            </div>
            <Building2 className="w-[60px] h-[60px] absolute -right-2 -bottom-2 opacity-20 z-0" strokeWidth={1.5} />
          </div>
          <button className="w-full bg-black/10 hover:bg-black/20 py-1.5 text-[12px] text-center flex items-center justify-center transition-colors z-10 relative">
            1 Hanggar, 2 Office <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Box 3: Jatuh Tempo */}
        <div className="bg-[#3c8dbc] text-white">
          <div className="p-4 flex justify-between relative overflow-hidden">
            <div className="z-10">
              <h3 className="text-[28px] font-bold leading-none mb-1">15 <span className="text-[16px]">Hari</span></h3>
              <p className="text-[13px] text-white/90">Jatuh Tempo Terdekat</p>
            </div>
            <CalendarDays className="w-[60px] h-[60px] absolute -right-2 -bottom-2 opacity-20 z-0" strokeWidth={1.5} />
          </div>
          <button className="w-full bg-black/10 hover:bg-black/20 py-1.5 text-[12px] text-center flex items-center justify-center transition-colors z-10 relative">
            SKRD Bulan Ini <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Box 4: Armada */}
        <div className="bg-[#3c8dbc] text-white">
          <div className="p-4 flex justify-between relative overflow-hidden">
            <div className="z-10">
              <h3 className="text-[28px] font-bold leading-none mb-1">5</h3>
              <p className="text-[13px] text-white/90">Armada Terdaftar</p>
            </div>
            <Plane className="w-[60px] h-[60px] absolute -right-2 -bottom-2 opacity-20 z-0" strokeWidth={1.5} />
          </div>
          <button className="w-full bg-black/10 hover:bg-black/20 py-1.5 text-[12px] text-center flex items-center justify-center transition-colors z-10 relative">
            Kelola Data Pesawat <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Main Content 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Left Col (Daftar Tagihan e-SKRD) */}
        <div className="flex-1 lg:w-[65%] flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
            <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center cursor-move">
              <h3 className="text-[16px] text-[#444] font-normal flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-500" /> Tagihan Belum Dibayar (e-SKRD)
              </h3>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[14px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#444]">
                    <th className="py-2 px-3 font-bold">No. SKRD</th>
                    <th className="py-2 px-3 font-bold">Objek Sewa</th>
                    <th className="py-2 px-3 font-bold">Periode</th>
                    <th className="py-2 px-3 font-bold">Jatuh Tempo</th>
                    <th className="py-2 px-3 font-bold text-right">Nilai Tagihan (Rp)</th>
                    <th className="py-2 px-3 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                    <td className="py-3 px-3">SKRD-26-0801</td>
                    <td className="py-3 px-3">HGR-001 (Hanggar)</td>
                    <td className="py-3 px-3">Agustus 2026</td>
                    <td className="py-3 px-3 text-[#dd4b39] font-semibold">10 Sep 2026</td>
                    <td className="py-3 px-3 text-right">250.000.000</td>
                    <td className="py-3 px-3 text-center">
                      <button className="bg-[#00a65a] hover:bg-[#367fa9] text-white text-[12px] px-3 py-1 transition-colors shadow-sm">Bayar</button>
                    </td>
                  </tr>
                  <tr className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                    <td className="py-3 px-3">SKRD-26-0802</td>
                    <td className="py-3 px-3">OFF-01 (Kantor)</td>
                    <td className="py-3 px-3">Agustus 2026</td>
                    <td className="py-3 px-3">10 Sep 2026</td>
                    <td className="py-3 px-3 text-right">25.000.000</td>
                    <td className="py-3 px-3 text-center">
                      <button className="bg-[#00a65a] hover:bg-[#367fa9] text-white text-[12px] px-3 py-1 transition-colors shadow-sm">Bayar</button>
                    </td>
                  </tr>
                  <tr className="border-b border-[#f4f4f4] bg-[#dd4b39]/5 hover:bg-[#dd4b39]/10">
                    <td className="py-3 px-3">SKRD-26-0701</td>
                    <td className="py-3 px-3">HGR-001 (Hanggar)</td>
                    <td className="py-3 px-3">Juli 2026</td>
                    <td className="py-3 px-3 text-[#dd4b39] font-bold">10 Ags 2026</td>
                    <td className="py-3 px-3 text-right font-semibold">250.000.000</td>
                    <td className="py-3 px-3 text-center">
                      <button className="bg-[#dd4b39] hover:bg-[#d73925] text-white text-[12px] px-3 py-1 transition-colors shadow-sm">Tunggakan</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-[10px] bg-[#f4f4f4] border-t border-[#d2d6de] text-right">
              <span className="text-[14px] font-bold text-[#444]">Total Menunggu Pembayaran: <span className="text-[#dd4b39]">Rp 525.000.000</span></span>
            </div>
          </div>
        </div>

        {/* Right Col (Aset & Profil) */}
        <div className="flex-1 lg:w-[35%] flex flex-col gap-4">
          
          {/* Legalitas & Profil */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-4 flex flex-col items-center border-b border-[#f4f4f4]">
              <div className="w-16 h-16 bg-[#3c8dbc] text-white rounded-full flex items-center justify-center mb-3 text-2xl font-bold">
                JD
              </div>
              <h3 className="text-[18px] font-bold text-[#333]">PT. Jaya Dirgantara</h3>
              <p className="text-[13px] text-[#777] mb-2">Maskapai Charter Nasional</p>
              <div className="flex items-center text-[12px] bg-[#3c8dbc] text-white px-2 py-0.5 rounded-sm">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi
              </div>
            </div>
            
            <div className="p-0">
              <ul className="text-[13px] text-[#444]">
                <li className="flex justify-between p-3 border-b border-[#f4f4f4] hover:bg-slate-50">
                  <span className="font-semibold">NIB</span>
                  <span>812000000001</span>
                </li>
                <li className="flex justify-between p-3 border-b border-[#f4f4f4] hover:bg-slate-50">
                  <span className="font-semibold">NPWP</span>
                  <span>01.234.567.8-900.000</span>
                </li>
                <li className="flex justify-between p-3 hover:bg-slate-50">
                  <span className="font-semibold">Status</span>
                  <span className="text-[#00a65a] font-bold">Aktif (Good Standing)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Ringkasan Aset Sewa */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
            <div className="p-[10px] border-b border-[#f4f4f4]">
              <h3 className="text-[16px] text-[#444] font-normal">Aset yang Disewa</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              
              <div className="border border-[#d2d6de] p-3 hover:border-[#3c8dbc] transition-colors cursor-pointer bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-bold text-[#333]">HGR-001 (Hanggar A)</h4>
                  <span className="text-[10px] bg-[#3c8dbc] text-white px-1.5 py-0.5 uppercase">Aktif</span>
                </div>
                <p className="text-[12px] text-[#666] mb-1">Luas: 2.000 m²</p>
                <div className="flex items-center text-[11px] text-[#f39c12]">
                  <ShieldAlert className="w-3 h-3 mr-1" /> Kedaluwarsa: 31 Des 2026
                </div>
              </div>

              <div className="border border-[#d2d6de] p-3 hover:border-[#3c8dbc] transition-colors cursor-pointer bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-bold text-[#333]">OFF-01 (Office)</h4>
                  <span className="text-[10px] bg-[#3c8dbc] text-white px-1.5 py-0.5 uppercase">Aktif</span>
                </div>
                <p className="text-[12px] text-[#666] mb-1">Luas: 100 m²</p>
                <div className="flex items-center text-[11px] text-[#777]">
                  Kedaluwarsa: 31 Des 2027
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
