"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      
      {/* Navbar / Header (Sticky) */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-300 h-16">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center transition-colors ${isScrolled ? 'bg-[#3c8dbc]' : 'bg-white'}`}>
              <span className={`font-bold text-xl ${isScrolled ? 'text-white' : 'text-[#3c8dbc]'}`}>M</span>
            </div>
            <span className={`text-xl md:text-2xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>MARS</span>
          </div>
          <nav className={`hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest transition-colors ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
            <a href="#beranda" className={`transition-colors ${isScrolled ? 'hover:text-[#3c8dbc]' : 'hover:text-white'}`}>Beranda</a>
            <a href="#layanan" className={`transition-colors ${isScrolled ? 'hover:text-[#3c8dbc]' : 'hover:text-white'}`}>Layanan & Operasional</a>
            <a href="#pembayaran" className={`transition-colors ${isScrolled ? 'hover:text-[#3c8dbc]' : 'hover:text-white'}`}>Sistem Pembayaran</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/register" className={`hidden md:flex items-center text-xs font-bold uppercase tracking-widest transition-colors ${isScrolled ? 'text-gray-900 hover:text-[#3c8dbc]' : 'text-white hover:text-[#3c8dbc]/70'}`}>
              Daftar Tenant
            </Link>
            <Link href="/login" className={`text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-all hover:bg-[#367fa9] hover:text-white rounded-none ${isScrolled ? 'bg-[#3c8dbc] text-white' : 'bg-white text-blue-900'}`}>
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section 
        id="beranda"
        className="relative h-screen flex items-center bg-gray-900 overflow-hidden pt-20"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 z-0"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
              Mimika Airport <br className="hidden md:block"/> 
              <span className="text-[#3c8dbc]">Revenue System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light">
              Transformasi digital pengelolaan retribusi UPBU Mozes Kilangin. Menghubungkan Manajemen Aset, Pesawat, e-SKRD, dan Pembayaran Non-Tunai dalam satu ekosistem transparan.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 animate-bounce">
          <span className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">Scroll ke Bawah</span>
          <div className="w-px h-12 bg-white/50"></div>
        </div>
      </section>

      {/* 2. Layanan Operasional Section */}
      <section id="layanan" className="py-32 px-6 md:px-12 bg-white text-[#333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6 text-gray-900 tracking-tighter">Layanan & Operasional</h2>
              <div className="w-24 h-2 bg-[#3c8dbc] mb-8"></div>
              <p className="text-xl text-gray-500 font-light leading-relaxed">
                MARS menangani pendaftaran entitas hingga pencetakan tagihan. Proses operasional disederhanakan tanpa mengurangi akuntabilitas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t-2 border-gray-100 pt-16">
            <div className="group">
              <div className="text-[#3c8dbc] text-6xl font-black mb-6 opacity-20 group-hover:opacity-100 transition-opacity">01</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Manajemen Tenant & Aset</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Pendataan perusahaan penyewa secara lengkap mencakup legalitas, PIC, dan rekening. Aset seperti Ruangan, Lahan, dan Hanggar dicatat rinci dengan koordinat GIS, luasan, dan tarif dasar retribusi yang transparan.
              </p>
            </div>
            
            <div className="group">
              <div className="text-[#3c8dbc] text-6xl font-black mb-6 opacity-20 group-hover:opacity-100 transition-opacity">02</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Database Pesawat</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Operator penerbangan dapat mendaftarkan registrasi pesawat, tipe (Komersial, Perintis, Helikopter), MTOW, dan alokasi pemakaian hanggar, memudahkan perhitungan tagihan berdasarkan bobot pesawat.
              </p>
            </div>

            <div className="group">
              <div className="text-[#3c8dbc] text-6xl font-black mb-6 opacity-20 group-hover:opacity-100 transition-opacity">03</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Siklus Kontrak (e-SKRD)</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Permohonan penyewaan diproses menjadi Perjanjian Kerja Sama (PKS), yang secara berkala akan menerbitkan Surat Ketetapan Retribusi Daerah (SKRD) elektronik untuk pelaporan pendapatan asli daerah (PAD).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sistem Pembayaran Terpusat Section */}
      <section id="pembayaran" className="py-32 px-6 md:px-12 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black mb-6 text-gray-900 tracking-tighter">Pembayaran Transparan & Terintegrasi</h2>
            <div className="w-24 h-2 bg-[#3c8dbc] mb-8"></div>
            <p className="text-xl text-gray-500 font-light leading-relaxed mb-10">
              Sesuai amanat digitalisasi daerah, MARS tidak lagi menerima pembayaran tunai. Seluruh transaksi wajib dilakukan secara perbankan untuk menjamin keamanan kas daerah.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#3c8dbc]/10 text-[#3c8dbc] flex items-center justify-center font-bold text-xl shrink-0">VA</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Virtual Account Bank Papua</h4>
                  <p className="text-gray-600 font-light leading-relaxed">Invoice otomatis terhubung dengan *Payment Gateway* Bank Papua. Tagihan terbayar akan langsung memperbarui status *Risk Profile* penyewa menjadi 'Current'.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#3c8dbc]/10 text-[#3c8dbc] flex items-center justify-center font-bold text-xl shrink-0">QR</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Dukungan QRIS</h4>
                  <p className="text-gray-600 font-light leading-relaxed">Untuk tagihan berskala kecil atau pelintas harian, sistem dapat menerbitkan kode QRIS dinamis di setiap lembar tagihan untuk pelunasan instan.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-12 shadow-2xl border-l-4 border-[#3c8dbc]">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tighter">Sudah Siap Memulai?</h3>
            <p className="text-gray-600 font-light leading-relaxed mb-10">
              Semua pengelolaan mulai dari administrasi, pembuatan kontrak, penagihan, hingga *dashboard* laporan eksekutif dapat dilakukan di satu platform MARS. 
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/register" className="bg-gray-900 text-white text-center font-bold text-sm tracking-widest uppercase py-5 px-8 hover:bg-[#3c8dbc] transition-colors">
                DAFTAR SEKARANG
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 md:px-12 border-t-4 border-[#3c8dbc]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3c8dbc] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <span className="text-3xl font-black tracking-tighter">MARS</span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed text-sm">
              Mimika Airport Revenue System. Solusi digital untuk tata kelola pendapatan retribusi Bandara Mozes Kilangin secara terpusat.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-widest uppercase text-sm mb-2 text-gray-300">Tautan Akses</h4>
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login Portal</Link>
            <Link href="/register" className="text-gray-400 hover:text-white transition-colors text-sm">Registrasi Tenant Baru</Link>
            <Link href="/eksekutif" className="text-gray-400 hover:text-white transition-colors text-sm">Portal Eksekutif (Dashboard)</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500 font-light flex flex-col md:flex-row justify-between">
          <span>&copy; 2026 Dinas Perhubungan Kabupaten Mimika. Hak Cipta Dilindungi.</span>
          <span className="mt-2 md:mt-0">UPBU Mozes Kilangin</span>
        </div>
      </footer>

    </div>
  );
}
