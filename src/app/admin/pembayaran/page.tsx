"use client";

import React, { useState } from 'react';
import { 
  CreditCard, Search, CheckCircle2, Printer, 
  Banknote, ScanLine, FileText 
} from 'lucide-react';

export default function AdminPembayaranKasirPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [uangDiterima, setUangDiterima] = useState<number | ''>('');
  const [isPaid, setIsPaid] = useState(false);

  // Mock Data Tagihan
  const totalTagihan = 15500000;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setIsSearched(true);
      setIsPaid(false);
      setUangDiterima('');
    }
  };

  const handlePay = () => {
    if (paymentMethod === 'tunai' && Number(uangDiterima) < totalTagihan) {
      alert("Uang yang diterima kurang dari total tagihan!");
      return;
    }
    setIsPaid(true);
  };

  const kembalian = paymentMethod === 'tunai' && uangDiterima !== '' 
    ? Number(uangDiterima) - totalTagihan 
    : 0;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Loket Pembayaran Retribusi (POS)
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Loket Kasir</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Kolom Kiri: Panel Pencarian & Detail Tagihan */}
        <div className="flex-1 lg:w-[60%] flex flex-col gap-4">
          
          {/* Panel Pencarian */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-6">
            <h3 className="text-[16px] text-[#444] font-bold mb-4 flex items-center">
              <ScanLine className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Scan / Cari Nomor Tagihan SKRD
            </h3>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan No. SKRD (Contoh: SKRD-26-0811)..." 
                className="flex-1 p-3 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none text-[15px] font-mono uppercase font-bold" 
              />
              <button 
                type="submit" 
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-6 py-3 font-bold transition-colors shadow-sm flex items-center"
              >
                <Search className="w-5 h-5 mr-2" /> Cari Data
              </button>
            </form>
          </div>

          {/* Rincian Tagihan Ditemukan */}
          {isSearched && (
            <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
                <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#f39c12]" /> Rincian Objek Retribusi
                </h3>
                <span className="bg-[#dd4b39] text-white text-[11px] font-bold px-2 py-1 uppercase tracking-wider">
                  Belum Lunas
                </span>
              </div>
              
              <div className="p-6 text-[14px]">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 border-b border-[#f4f4f4] pb-6">
                  <div>
                    <p className="text-[#777] text-[12px] font-bold uppercase mb-1">Pihak Tertagih / Wajib Retribusi</p>
                    <p className="font-bold text-[#333] text-[16px]">PT. Trigana Air Service</p>
                    <p className="text-[#555] text-[12px]">NPWP: 01.234.567.8-901.000</p>
                  </div>
                  <div>
                    <p className="text-[#777] text-[12px] font-bold uppercase mb-1">Nomor Ketetapan (e-SKRD)</p>
                    <p className="font-bold text-[#3c8dbc] text-[16px]">SKRD-26-0811</p>
                    <p className="text-[#555] text-[12px]">Tgl Jatuh Tempo: 20 Ags 2026</p>
                  </div>
                </div>

                {/* Tabel Item Tagihan */}
                <table className="w-full text-left border-collapse mb-6">
                  <thead>
                    <tr className="border-b-2 border-[#d2d6de] text-[#444]">
                      <th className="py-2 px-2 font-bold">Keterangan Retribusi</th>
                      <th className="py-2 px-2 font-bold text-center">Volume</th>
                      <th className="py-2 px-2 font-bold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f4f4f4]">
                      <td className="py-3 px-2 text-[#555]">
                        <div className="font-bold">Sewa Ruang Kantor (OFF-05)</div>
                        <div className="text-[11px] text-[#777]">Tarif Dasar: Rp 85.000 / m²</div>
                      </td>
                      <td className="py-3 px-2 text-center text-[#555]">1 Bulan</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-[#333]">Rp 4.250.000</td>
                    </tr>
                    <tr className="border-b border-[#f4f4f4]">
                      <td className="py-3 px-2 text-[#555]">
                        <div className="font-bold">Tagihan Listrik & Utilitas (Okt 2026)</div>
                        <div className="text-[11px] text-[#777]">Sesuai Meteran Induk</div>
                      </td>
                      <td className="py-3 px-2 text-center text-[#555]">320 kWh</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-[#333]">Rp 11.250.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Panel Kasir (Point of Sales) */}
        <div className="flex-1 lg:w-[40%]">
          {isSearched ? (
            <div className="bg-[#222d32] shadow-sm text-white sticky top-4">
              <div className="p-4 border-b border-[#1a2226]">
                <h3 className="text-[16px] text-[#b8c7ce] font-bold uppercase tracking-wider text-center">
                  Total Tagihan
                </h3>
                <div className="text-[36px] font-bold text-center text-[#00a65a] font-mono mt-2">
                  {formatRupiah(totalTagihan)}
                </div>
              </div>
              
              {!isPaid ? (
                <div className="p-6 flex flex-col gap-5">
                  <div>
                    <label className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPaymentMethod('tunai')}
                        className={`py-3 border flex flex-col items-center justify-center font-bold text-[13px] transition-colors ${paymentMethod === 'tunai' ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white' : 'bg-[#1a2226] border-[#333] text-[#777] hover:border-[#3c8dbc]'}`}
                      >
                        <Banknote className="w-6 h-6 mb-1" /> TUNAI
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('edc')}
                        className={`py-3 border flex flex-col items-center justify-center font-bold text-[13px] transition-colors ${paymentMethod === 'edc' ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white' : 'bg-[#1a2226] border-[#333] text-[#777] hover:border-[#3c8dbc]'}`}
                      >
                        <CreditCard className="w-6 h-6 mb-1" /> EDC / DEBIT
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'tunai' && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">Uang Diterima (Rp)</label>
                      <input 
                        type="number" 
                        value={uangDiterima}
                        onChange={(e) => setUangDiterima(e.target.value ? Number(e.target.value) : '')}
                        placeholder="0" 
                        className="w-full p-3 bg-[#1a2226] border border-[#333] focus:border-[#00a65a] focus:outline-none font-mono text-[20px] font-bold text-white text-right" 
                      />
                      
                      {uangDiterima !== '' && Number(uangDiterima) >= totalTagihan && (
                        <div className="mt-3 flex justify-between items-center text-[14px]">
                          <span className="text-[#b8c7ce]">Kembalian:</span>
                          <span className="font-bold text-[#f39c12] font-mono text-[18px]">{formatRupiah(kembalian)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'edc' && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block mb-2 font-bold text-[#b8c7ce] text-[13px] uppercase">Nomor Referensi EDC / Kartu</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: 1234-5678-9012" 
                        className="w-full p-3 bg-[#1a2226] border border-[#333] focus:border-[#3c8dbc] focus:outline-none font-mono text-[15px] font-bold text-white" 
                      />
                    </div>
                  )}

                  <button 
                    onClick={handlePay}
                    className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold text-[16px] px-6 py-4 mt-2 transition-colors flex justify-center items-center"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Proses Pembayaran
                  </button>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-[#00a65a] rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-1">Transaksi Berhasil</h3>
                  <p className="text-[#b8c7ce] text-[13px] mb-6">SKRD-26-0811 telah dinyatakan LUNAS.</p>
                  
                  <button className="w-full bg-[#f4f4f4] hover:bg-white text-[#333] font-bold text-[14px] px-6 py-3 transition-colors flex justify-center items-center shadow-sm">
                    <Printer className="w-5 h-5 mr-2 text-[#444]" /> Cetak Kwitansi Fisik
                  </button>
                  <button 
                    onClick={() => {
                      setIsSearched(false);
                      setSearchQuery('');
                    }}
                    className="w-full bg-transparent border border-[#333] text-[#b8c7ce] hover:bg-[#1a2226] font-bold text-[14px] px-6 py-3 mt-3 transition-colors"
                  >
                    Layani Transaksi Baru
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-[#d2d6de] flex flex-col items-center justify-center text-[#777] bg-slate-50 p-8 text-center min-h-[400px]">
              <Banknote className="w-16 h-16 mb-4 text-[#d2d6de]" />
              <p className="font-bold text-[15px] mb-1">Panel Kasir Belum Aktif</p>
              <p className="text-[13px]">Silakan cari data tagihan (SKRD) terlebih dahulu di kolom sebelah kiri untuk memulai transaksi pembayaran loket.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
