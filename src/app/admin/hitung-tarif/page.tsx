"use client";

import React, { useState } from 'react';
import { Calculator, AlertCircle, PlayCircle, Receipt } from 'lucide-react';

// Data Tarif Berdasarkan Perbup Nomor 25 Tahun 2024
const tarifHanggar: Record<string, { nama: string, harga: number }> = {
  'heli_as350': { nama: 'Helicopter - AS350 Series', harga: 3500000 },
  'heli_bell206': { nama: 'Helicopter - Bell 206 / 407', harga: 3500000 },
  'heli_bell412': { nama: 'Helicopter - Bell 412 / 212', harga: 4500000 },
  'heli_kamov': { nama: 'Helicopter - Kamov / MI', harga: 6000000 },
  'fw_cessna': { nama: 'Fixed Wing - Cessna Caravan C208', harga: 3500000 },
  'fw_pac750': { nama: 'Fixed Wing - PAC 750 XL', harga: 3500000 },
  'fw_dhc6': { nama: 'Fixed Wing - DHC-6 Series', harga: 4500000 },
  'fw_atr': { nama: 'Fixed Wing - ATR Series', harga: 6000000 },
  'apron': { nama: 'Penggunaan Apron Area', harga: 2000000 },
};

const tarifRuangan: Record<string, Record<string, { nama: string, harga: number }>> = {
  dalam_terminal: {
    terbuka_no_ac: { nama: 'Terbuka tanpa AC', harga: 31000 },
    tertutup_no_ac: { nama: 'Tertutup tanpa AC', harga: 48000 },
    terbuka_ac: { nama: 'Terbuka dengan AC', harga: 65000 },
    tertutup_ac: { nama: 'Tertutup dengan AC', harga: 72000 },
  },
  luar_terminal: {
    terbuka_no_ac: { nama: 'Terbuka tanpa AC', harga: 21000 },
    tertutup_no_ac: { nama: 'Tertutup tanpa AC', harga: 38000 },
    terbuka_ac: { nama: 'Terbuka dengan AC', harga: 55000 },
    tertutup_ac: { nama: 'Tertutup dengan AC', harga: 72000 },
  }
};

export default function KalkulatorTarifPage() {
  const [kategoriUtama, setKategoriUtama] = useState<'hanggar' | 'ruangan'>('hanggar');
  
  // State untuk Hanggar
  const [jenisPesawat, setJenisPesawat] = useState('fw_cessna');
  const [jumlahPesawat, setJumlahPesawat] = useState<number | ''>(1);
  const [jumlahMalam, setJumlahMalam] = useState<number | ''>(1);

  // State untuk Ruangan
  const [lokasiRuang, setLokasiRuang] = useState<'dalam_terminal' | 'luar_terminal'>('luar_terminal');
  const [tipeRuang, setTipeRuang] = useState('tertutup_ac');
  const [luasM2, setLuasM2] = useState<number | ''>('');
  const [durasiBulan, setDurasiBulan] = useState<number | ''>(1);

  // State Hasil
  const [hasil, setHasil] = useState<any>(null);

  const hitungTarif = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (kategoriUtama === 'hanggar') {
      if (jumlahPesawat === '' || jumlahMalam === '') return;
      const item = tarifHanggar[jenisPesawat];
      const total = item.harga * Number(jumlahPesawat) * Number(jumlahMalam);
      setHasil({
        kategori: 'hanggar',
        nama: item.harga === 2000000 ? 'Penggunaan Apron Area' : `Penggunaan Hanggar (${item.nama})`,
        hargaSatuan: item.harga,
        satuanTeks: 'per unit / malam',
        qty1Lable: 'Jumlah Pesawat',
        qty1Value: jumlahPesawat,
        qty2Lable: 'Durasi',
        qty2Value: `${jumlahMalam} Malam`,
        total: total
      });
    } else {
      if (luasM2 === '' || durasiBulan === '') return;
      const item = tarifRuangan[lokasiRuang][tipeRuang];
      const total = item.harga * Number(luasM2) * Number(durasiBulan);
      setHasil({
        kategori: 'ruangan',
        nama: `Penggunaan Ruangan ${lokasiRuang === 'dalam_terminal' ? '(Di Dalam Terminal)' : '(Di Luar Terminal)'} - ${item.nama}`,
        hargaSatuan: item.harga,
        satuanTeks: 'per m² / bulan',
        qty1Lable: 'Luas Area',
        qty1Value: `${luasM2} m²`,
        qty2Lable: 'Durasi',
        qty2Value: `${durasiBulan} Bulan`,
        total: total
      });
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Kalkulator Simulasi Tarif Sewa
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Hitung Tarif</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Kiri: Form Input Kalkulator */}
        <div className="flex-1 lg:w-[45%]">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm h-full flex flex-col">
            <div className="p-[15px] border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Parameter Sewa Aset
              </h3>
            </div>
            
            <form onSubmit={hitungTarif} className="p-6 flex flex-col gap-5 text-[14px] flex-1">
              <div className="bg-[#00c0ef]/10 border border-[#00c0ef]/30 p-3 text-[#31708f] flex items-start text-[13px] mb-2">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0 text-[#00c0ef]" />
                <div>
                  <strong>Sesuai Perbup Nomor 25 Tahun 2024:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Hanggar/Apron dihitung per unit pesawat per malam.</li>
                    <li>Ruangan dihitung per meter persegi (m²) per bulan.</li>
                  </ul>
                </div>
              </div>

              {/* Pemilihan Kategori Utama */}
              <div className="flex border border-[#d2d6de] p-1 bg-slate-50">
                <button 
                  type="button"
                  onClick={() => { setKategoriUtama('hanggar'); setHasil(null); }}
                  className={`flex-1 py-2 font-bold text-[13px] uppercase transition-colors ${kategoriUtama === 'hanggar' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:bg-[#e2e8f0]'}`}
                >
                  Hanggar & Apron
                </button>
                <button 
                  type="button"
                  onClick={() => { setKategoriUtama('ruangan'); setHasil(null); }}
                  className={`flex-1 py-2 font-bold text-[13px] uppercase transition-colors ${kategoriUtama === 'ruangan' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:bg-[#e2e8f0]'}`}
                >
                  Ruangan & Gedung
                </button>
              </div>

              {kategoriUtama === 'hanggar' ? (
                <>
                  <div>
                    <label className="block mb-2 font-bold text-[#444]">Jenis Pesawat / Layanan <span className="text-[#dd4b39]">*</span></label>
                    <select 
                      value={jenisPesawat}
                      onChange={(e) => setJenisPesawat(e.target.value)}
                      className="w-full p-2.5 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none bg-white font-medium"
                    >
                      <optgroup label="Helicopter (Rotary Wing)">
                        <option value="heli_as350">AS350 Series (Rp 3.500.000)</option>
                        <option value="heli_bell206">Bell 206 - Bell 407 Series (Rp 3.500.000)</option>
                        <option value="heli_bell412">Bell 412 - Bell 212 (Rp 4.500.000)</option>
                        <option value="heli_kamov">Kamov - MI (Rp 6.000.000)</option>
                      </optgroup>
                      <optgroup label="Pesawat Terbang (Fixed Wing)">
                        <option value="fw_cessna">Cessna Caravan C208 (Rp 3.500.000)</option>
                        <option value="fw_pac750">PAC 750 XL (Rp 3.500.000)</option>
                        <option value="fw_dhc6">DHC-6 Series (Rp 4.500.000)</option>
                        <option value="fw_atr">ATR Series (Rp 6.000.000)</option>
                      </optgroup>
                      <optgroup label="Layanan Lainnya">
                        <option value="apron">Penggunaan Apron Area (Rp 2.000.000)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Jumlah Unit <span className="text-[#dd4b39]">*</span></label>
                      <div className="flex shadow-sm">
                        <input 
                          type="number" 
                          min="1"
                          value={jumlahPesawat}
                          onChange={(e) => setJumlahPesawat(e.target.value ? Number(e.target.value) : '')}
                          className="w-full p-2.5 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none" 
                          required 
                        />
                        <span className="bg-[#f4f4f4] border border-[#d2d6de] px-4 flex items-center text-[#777] font-bold">Pesawat</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Lama Parkir <span className="text-[#dd4b39]">*</span></label>
                      <div className="flex shadow-sm">
                        <input 
                          type="number" 
                          min="1"
                          value={jumlahMalam}
                          onChange={(e) => setJumlahMalam(e.target.value ? Number(e.target.value) : '')}
                          className="w-full p-2.5 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none" 
                          required 
                        />
                        <span className="bg-[#f4f4f4] border border-[#d2d6de] px-4 flex items-center text-[#777] font-bold">Malam</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Lokasi <span className="text-[#dd4b39]">*</span></label>
                      <select 
                        value={lokasiRuang}
                        onChange={(e) => setLokasiRuang(e.target.value as 'dalam_terminal' | 'luar_terminal')}
                        className="w-full p-2.5 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none bg-white font-medium"
                      >
                        <option value="dalam_terminal">Di Dalam Terminal</option>
                        <option value="luar_terminal">Di Luar Terminal</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Kondisi & Fasilitas <span className="text-[#dd4b39]">*</span></label>
                      <select 
                        value={tipeRuang}
                        onChange={(e) => setTipeRuang(e.target.value)}
                        className="w-full p-2.5 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none bg-white font-medium text-[13px]"
                      >
                        {Object.entries(tarifRuangan[lokasiRuang]).map(([key, item]) => (
                          <option key={key} value={key}>{item.nama} (Rp {item.harga.toLocaleString('id-ID')})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Luas Area <span className="text-[#dd4b39]">*</span></label>
                      <div className="flex shadow-sm">
                        <input 
                          type="number" 
                          min="1"
                          value={luasM2}
                          onChange={(e) => setLuasM2(e.target.value ? Number(e.target.value) : '')}
                          placeholder="0"
                          className="w-full p-2.5 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none" 
                          required 
                        />
                        <span className="bg-[#f4f4f4] border border-[#d2d6de] px-4 flex items-center text-[#777] font-bold">m²</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 font-bold text-[#444]">Durasi Sewa <span className="text-[#dd4b39]">*</span></label>
                      <div className="flex shadow-sm">
                        <input 
                          type="number" 
                          min="1"
                          value={durasiBulan}
                          onChange={(e) => setDurasiBulan(e.target.value ? Number(e.target.value) : '')}
                          placeholder="1"
                          className="w-full p-2.5 border border-[#d2d6de] border-r-0 focus:border-[#3c8dbc] focus:outline-none" 
                          required 
                        />
                        <span className="bg-[#f4f4f4] border border-[#d2d6de] px-4 flex items-center text-[#777] font-bold">Bulan</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-auto pt-4 border-t border-[#f4f4f4]">
                <button 
                  type="submit" 
                  className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[15px] px-6 py-3 transition-colors shadow-sm flex justify-center items-center"
                >
                  <PlayCircle className="w-5 h-5 mr-2" /> Kalkulasi Nilai
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Kanan: Hasil Kalkulasi (Struk Virtual) */}
        <div className="flex-1 lg:w-[55%]">
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm h-full flex flex-col">
            <div className="p-[15px] border-b border-[#f4f4f4] bg-slate-50">
              <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-[#00a65a]" /> Rincian Tagihan Resmi (Simulasi)
              </h3>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-center">
              {hasil !== null ? (
                <div className="border border-[#d2d6de] bg-white relative shadow-md animate-in fade-in zoom-in-95 duration-200">
                  {/* Kop Surat Mini */}
                  <div className="text-center p-6 border-b border-[#d2d6de] bg-slate-50">
                    <h2 className="font-bold text-[20px] text-[#333]">ESTIMASI RETRIBUSI DAERAH</h2>
                    <p className="text-[12px] text-[#777] mt-1">Sesuai Perbup Mimika No. 25 Tahun 2024</p>
                  </div>
                  
                  {/* Rincian Angka */}
                  <div className="p-8 flex flex-col gap-4 text-[14px] text-[#444]">
                    <div className="flex justify-between items-center border-b border-dashed border-[#d2d6de] pb-3">
                      <span className="text-[#666]">Layanan / Objek:</span>
                      <strong className="text-[#333] text-right">{hasil.nama}</strong>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-dashed border-[#d2d6de] pb-3">
                      <span className="text-[#666]">Tarif Dasar Perbup:</span>
                      <strong className="text-[#333] font-mono">{formatRupiah(hasil.hargaSatuan)} <span className="text-[11px] text-[#777] font-sans">{hasil.satuanTeks}</span></strong>
                    </div>

                    <div className="flex justify-between items-center border-b border-dashed border-[#d2d6de] pb-3">
                      <span className="text-[#666]">{hasil.qty1Lable}:</span>
                      <strong className="text-[#333] font-mono">{hasil.qty1Value}</strong>
                    </div>

                    <div className="flex justify-between items-center border-b-2 border-solid border-[#d2d6de] pb-4">
                      <span className="text-[#666]">{hasil.qty2Lable}:</span>
                      <strong className="text-[#333] font-mono">{hasil.qty2Value}</strong>
                    </div>

                    {/* Total Grand */}
                    <div className="mt-2 bg-[#00a65a]/10 p-5 border border-[#00a65a]/30 flex justify-between items-center">
                      <span className="text-[16px] font-bold text-[#555]">TOTAL TAGIHAN</span>
                      <span className="text-[26px] font-bold text-[#00a65a] font-mono">{formatRupiah(hasil.total)}</span>
                    </div>

                    <p className="text-[11px] text-[#777] text-center mt-4 italic">
                      *Catatan: Nilai di atas adalah estimasi murni dari perkalian tarif Perbup.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#777] border-2 border-dashed border-[#d2d6de] bg-slate-50/50">
                  <Calculator className="w-16 h-16 mb-4 text-[#d2d6de]" />
                  <p className="text-[16px] font-bold text-[#555] mb-1">Siap Melakukan Kalkulasi</p>
                  <p className="text-[13px] max-w-[300px] text-center">Pilih tab jenis fasilitas (Hanggar/Ruangan) di panel kiri, isi angka, lalu klik Kalkulasi.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
