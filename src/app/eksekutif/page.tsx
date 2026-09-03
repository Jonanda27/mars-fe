"use client";

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, DollarSign, Target, Award, AlertTriangle, 
  Building2, Car, BarChart, PieChart, LogOut, Activity,
  BookOpen, CheckCircle2, ArrowRight, ShieldAlert
} from 'lucide-react';

export default function EksekutifDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#333]">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-[20px] font-bold tracking-widest text-[#333]">MARS</h1>
          <p className="text-[11px] text-[#999] uppercase tracking-wider">Airport Revenue Command Center</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[14px] font-bold text-[#333]">Ir. H. Johannes Rettob, M.Si</p>
            <p className="text-[11px] text-[#999]">Kepala Dinas Perhubungan Kab. Mimika</p>
          </div>
          <Link href="/" className="text-[#999] hover:text-[#333] transition-colors" title="Keluar">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="p-6 max-w-[1400px] mx-auto flex flex-col gap-5">
        
        {/* Baris 1: KPI Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 shadow-sm border-l-[4px] border-[#3c8dbc]">
            <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider mb-2">Pendapatan Hari Ini</p>
            <p className="text-[28px] font-bold text-[#333] font-mono leading-tight">Rp 48,2 Jt</p>
            <div className="flex items-center mt-2 text-[12px] text-[#3c8dbc]">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% dari kemarin
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm border-l-[4px] border-[#3c8dbc]">
            <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider mb-2">Pendapatan Bulan Ini</p>
            <p className="text-[28px] font-bold text-[#333] font-mono leading-tight">Rp 1,24 M</p>
            <div className="flex items-center mt-2 text-[12px] text-[#999]">
              <Activity className="w-3 h-3 mr-1" /> Sep 2026 (Berjalan)
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm border-l-[4px] border-[#3c8dbc]">
            <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider mb-2">Target PAD Tahun 2026</p>
            <p className="text-[28px] font-bold text-[#333] font-mono leading-tight">Rp 15 M</p>
            <div className="flex items-center mt-2 text-[12px] text-[#999]">
              <Target className="w-3 h-3 mr-1" /> APBD Kab. Mimika
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm border-l-[4px] border-[#00a65a]">
            <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider mb-2">Achievement (Capaian)</p>
            <p className="text-[28px] font-bold text-[#00a65a] font-mono leading-tight">82,7%</p>
            <div className="w-full bg-[#f0f0f0] h-2 mt-3 overflow-hidden">
              <div className="bg-[#00a65a] h-full" style={{ width: '82.7%' }}></div>
            </div>
          </div>
        </div>

        {/* Baris 2: Metrik Pendukung */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#dd4b39]/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#dd4b39]" />
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-bold uppercase">Total Piutang</p>
              <p className="text-[20px] font-bold text-[#dd4b39] font-mono">Rp 2,6 M</p>
            </div>
          </div>

          <div className="bg-white p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3c8dbc]/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-[#3c8dbc]" />
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-bold uppercase">Hanggar Utilization</p>
              <p className="text-[20px] font-bold text-[#333] font-mono">50%</p>
              <p className="text-[10px] text-[#999]">1 dari 2 hanggar terisi</p>
            </div>
          </div>

          <div className="bg-white p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3c8dbc]/10 flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6 text-[#3c8dbc]" />
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-bold uppercase">Karcis Parkir Terjual</p>
              <p className="text-[20px] font-bold text-[#333] font-mono">2.148</p>
              <p className="text-[10px] text-[#00a65a] font-bold">Timika & Sentani</p>
            </div>
          </div>

          <div className="bg-white p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00a65a]/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-[#00a65a]" />
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-bold uppercase">Setoran Parkir Riil</p>
              <p className="text-[20px] font-bold text-[#00a65a] font-mono">Rp 13,55 Jt</p>
              <p className="text-[10px] text-[#dd4b39] font-bold">Net Selisih: -Rp 50 Rb</p>
            </div>
          </div>
        </div>

        {/* Baris 3: Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Tren Bulanan */}
          <div className="lg:col-span-2 bg-white shadow-sm">
            <div className="p-4 border-b border-[#f0f0f0]">
              <h3 className="text-[14px] font-bold text-[#333] flex items-center">
                <BarChart className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Tren Pendapatan Retribusi (Jan — Sep 2026)
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-3 h-[200px]">
                {[
                  { bulan: 'Jan', persen: 65, nilai: '0.98' },
                  { bulan: 'Feb', persen: 72, nilai: '1.08' },
                  { bulan: 'Mar', persen: 80, nilai: '1.20' },
                  { bulan: 'Apr', persen: 68, nilai: '1.02' },
                  { bulan: 'Mei', persen: 85, nilai: '1.28' },
                  { bulan: 'Jun', persen: 90, nilai: '1.35' },
                  { bulan: 'Jul', persen: 78, nilai: '1.17' },
                  { bulan: 'Ags', persen: 95, nilai: '1.43' },
                  { bulan: 'Sep', persen: 82, nilai: '1.24' },
                ].map((item) => (
                  <div key={item.bulan} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-[#999] font-mono">{item.nilai}M</span>
                    <div 
                      className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] transition-colors relative group cursor-default"
                      style={{ height: `${item.persen}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#333] text-white text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow">
                        Rp {item.nilai} M
                      </div>
                    </div>
                    <span className="text-[11px] text-[#777] font-bold">{item.bulan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Komposisi Pendapatan */}
          <div className="bg-white shadow-sm">
            <div className="p-4 border-b border-[#f0f0f0]">
              <h3 className="text-[14px] font-bold text-[#333] flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Komposisi Sumber Pendapatan
              </h3>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {[
                { label: 'Sewa Hanggar', persen: 58, nilai: 'Rp 7.2 M' },
                { label: 'Sewa Ruang Kantor', persen: 18, nilai: 'Rp 2.2 M' },
                { label: 'Retribusi Parkir', persen: 14, nilai: 'Rp 1.7 M' },
                { label: 'Sewa Gudang & Lahan', persen: 7, nilai: 'Rp 0.9 M' },
                { label: 'Lain-lain (Utilitas)', persen: 3, nilai: 'Rp 0.4 M' },
              ].map((item, idx) => {
                const opacity = 1 - (idx * 0.15);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[13px] text-[#555]">{item.label}</span>
                      <span className="text-[12px] font-mono font-bold text-[#333]">{item.nilai}</span>
                    </div>
                    <div className="w-full bg-[#f0f0f0] h-2.5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-700"
                        style={{ width: `${item.persen}%`, backgroundColor: `rgba(60, 141, 188, ${opacity})` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-[#999] mt-1 text-right">{item.persen}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Baris 4: Audit & Monitoring Parkir Manual Multi-UPBU */}
        <div className="bg-white shadow-sm border-t-[3px] border-[#3c8dbc]">
          <div className="p-4 border-b border-[#f0f0f0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-[#333] flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-[#3c8dbc]" />
                Audit & Rekonsiliasi Parkir Manual Multi-Bandara (UPBU Dishub Mimika)
              </h3>
              <p className="text-[11px] text-[#777]">
                Pencatatan akuntansi logistik nomor seri karcis fisik & deteksi kebocoran kas (anti-leakage)
              </p>
            </div>
            <Link 
              href="/admin/parkir" 
              className="text-[12px] font-bold text-[#3c8dbc] hover:underline flex items-center gap-1"
            >
              Buka Konsol Parkir Manual <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Mozes Kilangin TIM Card */}
            <div className="p-4 bg-slate-50 border border-[#e0e0e0] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold bg-[#3c8dbc] text-white px-2 py-0.5 rounded-sm">UPBU PUSAT</span>
                    <h4 className="text-[15px] font-bold text-[#333] mt-1">Bandara Mozes Kilangin (Timika)</h4>
                    <p className="text-[11px] text-[#777]">6 Shift Juru Parkir Keliling Aktif</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#dd4b39] bg-red-100 px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Ada Selisih Minus
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-center">
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Terjual</span>
                    <span className="text-[14px] font-bold font-mono text-[#333]">1.258 lbr</span>
                  </div>
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Ekspektasi</span>
                    <span className="text-[14px] font-bold font-mono text-[#555]">Rp 8,40 Jt</span>
                  </div>
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Setoran Riil</span>
                    <span className="text-[14px] font-bold font-mono text-[#00a65a]">Rp 8,35 Jt</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-between items-center text-[12px]">
                <span className="text-[#666]">Selisih Kas / Kebocoran:</span>
                <span className="font-mono font-bold text-[#dd4b39]">-Rp 50.000 (2 lbr cacat fisik robek)</span>
              </div>
            </div>

            {/* Sentani DJJ Card */}
            <div className="p-4 bg-slate-50 border border-[#e0e0e0] rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold bg-[#605ca8] text-white px-2 py-0.5 rounded-sm">UPBU MITRA</span>
                    <h4 className="text-[15px] font-bold text-[#333] mt-1">Bandara Sentani (Jayapura)</h4>
                    <p className="text-[11px] text-[#777]">4 Shift Juru Parkir Keliling Aktif</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#00a65a] bg-emerald-100 px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Rekonsiliasi Klop
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-center">
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Terjual</span>
                    <span className="text-[14px] font-bold font-mono text-[#333]">890 lbr</span>
                  </div>
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Ekspektasi</span>
                    <span className="text-[14px] font-bold font-mono text-[#555]">Rp 5,20 Jt</span>
                  </div>
                  <div className="bg-white p-2 border border-[#eee]">
                    <span className="text-[10px] text-[#999] block font-bold uppercase">Setoran Riil</span>
                    <span className="text-[14px] font-bold font-mono text-[#00a65a]">Rp 5,20 Jt</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee] flex justify-between items-center text-[12px]">
                <span className="text-[#666]">Selisih Kas / Kebocoran:</span>
                <span className="font-mono font-bold text-[#00a65a]">Rp 0 (100% Akurat)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris 5: Tabel Piutang */}
        <div className="bg-white shadow-sm">
          <div className="p-4 border-b border-[#f0f0f0] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[#333] flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-[#dd4b39]" /> Top 5 Tenant — Piutang Terbesar
            </h3>
            <span className="text-[11px] text-[#999] font-bold">Per 24 Sep 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f0f0f0] text-[#777] uppercase text-[11px]">
                  <th className="py-3 px-5 font-bold">#</th>
                  <th className="py-3 px-5 font-bold">Nama Tenant</th>
                  <th className="py-3 px-5 font-bold">Aset yang Disewa</th>
                  <th className="py-3 px-5 font-bold text-right">Total Piutang</th>
                  <th className="py-3 px-5 font-bold text-center">Umur Terlama</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { no: 1, nama: 'CV. Kargo Ekspedisi Papua', aset: 'Gudang WHS-01', piutang: '100.000.000', umur: '140 Hari', severity: 'high' },
                  { no: 2, nama: 'PT. Global Aviasi', aset: 'Office OFF-02', piutang: '100.000.000', umur: '75 Hari', severity: 'high' },
                  { no: 3, nama: 'PT. Airfast Indonesia', aset: 'Lahan Terbuka', piutang: '120.000.000', umur: '15 Hari', severity: 'low' },
                  { no: 4, nama: 'PT. Trigana Air Service', aset: 'Office OFF-05', piutang: '15.500.000', umur: '4 Hari', severity: 'low' },
                  { no: 5, nama: 'PT. Jaya Dirgantara', aset: 'Hanggar HGR-002', piutang: '120.000.000', umur: 'Belum Jatuh Tempo', severity: 'none' },
                ].map((item) => (
                  <tr key={item.no} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-[#999] font-mono">{item.no}</td>
                    <td className="py-3 px-5 font-bold text-[#333]">{item.nama}</td>
                    <td className="py-3 px-5 text-[#777]">{item.aset}</td>
                    <td className="py-3 px-5 text-right font-mono font-bold text-[#333]">Rp {item.piutang}</td>
                    <td className="py-3 px-5 text-center">
                      <span className={`text-[11px] font-bold px-2 py-1 ${
                        item.severity === 'high' ? 'bg-[#dd4b39]/10 text-[#dd4b39]' : 
                        item.severity === 'low' ? 'bg-[#f39c12]/10 text-[#f39c12]' : 
                        'bg-[#f0f0f0] text-[#999]'
                      }`}>
                        {item.umur}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-[#999] py-4">
          MARS — Mimika (Mozes Kilangin) Airport Revenue System &copy; 2026 Pemerintah Kabupaten Mimika
        </div>

      </div>
    </div>
  );
}
