import React from 'react';
import { 
  Building2, Users, DollarSign, Activity, 
  TrendingUp, MapPin, AlertCircle, Info, Plane
} from 'lucide-react';

export default function AdminExecutiveDashboard() {
  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Executive Dashboard
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Dashboard</span>
        </div>
      </header>

      {/* Baris 1: KPI Cards (Warna seragam Biru Admin #3c8dbc) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center">
            <span className="uppercase text-[12px] text-[#777] font-bold">Realisasi Pendapatan (YTD)</span>
            <span className="text-[18px] font-bold text-[#333]">Rp 8,4 Milyar</span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Target: Rp 12 Milyar (70%)</span>
          </div>
        </div>
        
        {/* KPI 2 */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Activity className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center">
            <span className="uppercase text-[12px] text-[#777] font-bold">Occupancy Rate Aset</span>
            <span className="text-[18px] font-bold text-[#333]">75.5%</span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Terisi: 12.000m² dari 15.800m²</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Users className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center">
            <span className="uppercase text-[12px] text-[#777] font-bold">Total Penyewa (Tenant)</span>
            <span className="text-[18px] font-bold text-[#333]">14 Maskapai</span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">2 Menunggu Verifikasi</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[80px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center">
            <span className="uppercase text-[12px] text-[#777] font-bold">Piutang (Outstanding)</span>
            <span className="text-[18px] font-bold text-[#333]">Rp 450 Juta</span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">Terdapat 3 SKRD Jatuh Tempo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        
        {/* Kolom Kiri: Peta Visual Aset (2/3 lebar) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
            <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50 cursor-move">
              <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Peta Visual Fasilitas Hanggar (Sisi Utara)
              </h3>
              <div className="flex gap-3 text-[11px] font-bold">
                <span className="flex items-center"><div className="w-3 h-3 bg-[#3c8dbc] mr-1"></div> Terisi</span>
                <span className="flex items-center"><div className="w-3 h-3 border border-[#d2d6de] mr-1"></div> Kosong</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-[#f4f4f4] mr-1"></div> Maintenance</span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50">
              {/* Grid Aset (Visual Map) - Tema Konsisten Biru */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Aset 1 - Terisi */}
                <div className="border border-[#3c8dbc] bg-white p-4 relative shadow-sm">
                  <div className="absolute top-0 right-0 bg-[#3c8dbc] text-white px-2 py-1 text-[10px] font-bold uppercase">Terisi (100%)</div>
                  <h4 className="font-bold text-[18px] text-[#333]">Hanggar HGR-001</h4>
                  <p className="text-[12px] text-[#666] mb-3">Luas Total: 3.000 m²</p>
                  
                  <div className="border-t border-[#f4f4f4] pt-3">
                    <p className="text-[11px] text-[#777] font-bold uppercase mb-1">Penyewa Saat Ini:</p>
                    <div className="flex items-center bg-slate-50 p-2 border border-[#d2d6de]">
                      <Plane className="w-6 h-6 mr-3 text-[#3c8dbc]" />
                      <div>
                        <p className="font-bold text-[#333] text-[13px]">Susi Air (PT. ASI Pudjiastuti)</p>
                        <p className="text-[11px] text-[#3c8dbc] font-bold">Kontrak hg. 31 Des 2026</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aset 2 - Kosong Sebagian */}
                <div className="border border-[#3c8dbc] bg-white p-4 relative shadow-sm">
                  <div className="absolute top-0 right-0 bg-[#3c8dbc] opacity-80 text-white px-2 py-1 text-[10px] font-bold uppercase">Terisi Sebagian (50%)</div>
                  <h4 className="font-bold text-[18px] text-[#333]">Hanggar HGR-002</h4>
                  <p className="text-[12px] text-[#666] mb-3">Luas Total: 4.000 m² (Tersisa: 2.000 m²)</p>
                  
                  <div className="border-t border-[#f4f4f4] pt-3">
                    <p className="text-[11px] text-[#777] font-bold uppercase mb-1">Penyewa Saat Ini:</p>
                    <div className="flex items-center bg-slate-50 p-2 border border-[#d2d6de]">
                      <Plane className="w-6 h-6 mr-3 text-[#3c8dbc]" />
                      <div>
                        <p className="font-bold text-[#333] text-[13px]">PT. Airfast Indonesia</p>
                        <p className="text-[11px] text-[#3c8dbc] font-bold">Menyewa 2.000 m² (Aktif)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aset 3 - Kosong Total */}
                <div className="border border-[#d2d6de] bg-white p-4 relative shadow-sm opacity-80">
                  <div className="absolute top-0 right-0 bg-[#f4f4f4] border-b border-l border-[#d2d6de] text-[#777] px-2 py-1 text-[10px] font-bold uppercase">Tersedia</div>
                  <h4 className="font-bold text-[18px] text-[#777]">Hanggar HGR-003</h4>
                  <p className="text-[12px] text-[#666] mb-3">Luas Total: 2.500 m² (Tersisa: 2.500 m²)</p>
                  
                  <div className="border-t border-[#d2d6de] pt-3 flex items-center justify-center h-[60px]">
                    <span className="text-[12px] font-bold text-[#777] italic">Kosong / Siap Disewakan</span>
                  </div>
                </div>

                {/* Aset 4 - Maintenance */}
                <div className="border border-[#d2d6de] bg-[#f9f9f9] p-4 relative shadow-sm">
                  <div className="absolute top-0 right-0 bg-[#d2d6de] text-[#444] px-2 py-1 text-[10px] font-bold uppercase">Maintenance</div>
                  <h4 className="font-bold text-[18px] text-[#555]">Gudang Kargo (CG-01)</h4>
                  <p className="text-[12px] text-[#666] mb-3">Luas Total: 1.200 m²</p>
                  
                  <div className="border-t border-[#d2d6de] pt-3 flex items-center h-[60px]">
                    <AlertCircle className="w-6 h-6 text-[#777] mr-3" />
                    <div>
                      <span className="text-[12px] font-bold text-[#555] block">Perbaikan Atap (Fasilitasi)</span>
                      <span className="text-[11px] text-[#777]">Estimasi selesai: 15 Sep 2026</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aktivitas & Kontrak (1/3 lebar) */}
        <div className="flex flex-col gap-4">
          
          {/* Box 1: Peringatan Kontrak */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50">
              <h3 className="text-[15px] text-[#444] font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Kontrak Segera Berakhir
              </h3>
            </div>
            <div className="p-0">
              <ul className="flex flex-col text-[13px]">
                <li className="p-3 border-b border-[#f4f4f4] flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-[#333] block">PT. Trigana Air Service</span>
                    <span className="text-[11px] text-[#666]">Ruang Kantor (OFF-05)</span>
                  </div>
                  <span className="bg-[#3c8dbc] text-white text-[10px] font-bold px-2 py-1">H-12</span>
                </li>
                <li className="p-3 border-b border-[#f4f4f4] flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-[#333] block">PT. Jaya Dirgantara</span>
                    <span className="text-[11px] text-[#666]">Ruang Kantor (OFF-01)</span>
                  </div>
                  <span className="border border-[#3c8dbc] text-[#3c8dbc] text-[10px] font-bold px-2 py-1">H-35</span>
                </li>
              </ul>
              <div className="p-2 text-center border-t border-[#f4f4f4]">
                <a href="/admin/kontrak" className="text-[12px] text-[#3c8dbc] font-bold hover:underline">Lihat Semua Kontrak &rarr;</a>
              </div>
            </div>
          </div>

          {/* Box 2: Info Sistem */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-[12px] border-b border-[#f4f4f4] bg-slate-50">
              <h3 className="text-[15px] text-[#444] font-bold flex items-center">
                <Info className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Info Tarif Perda No. 4/2023
              </h3>
            </div>
            <div className="p-4 text-[13px] text-[#444]">
              <p className="mb-2">Basis perhitungan sistem SKRD bulan ini menggunakan tarif retribusi berikut:</p>
              <ul className="list-disc pl-4 text-[#666] flex flex-col gap-1">
                <li><strong className="text-[#333]">Hanggar Tertutup:</strong> Rp 60.000 /m² /Tahun</li>
                <li><strong className="text-[#333]">Ruang Kantor:</strong> Rp 85.000 /m² /Tahun</li>
                <li><strong className="text-[#333]">Lahan Terbuka:</strong> Rp 25.000 /m² /Tahun</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
