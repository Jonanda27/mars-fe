"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll listener untuk efek navbar transparan di atas video menjadi frosted dark saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3' 
          : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        
        {/* Logo Kiri: MARS Brand */}
        <Link href="/" className="flex items-center group shrink-0 py-0.5">
          <img 
            src="/images/mars-logo-white.png" 
            alt="MARS - Mimika Airport Revenue System" 
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-md group-hover:opacity-90 group-hover:scale-[1.02] transition-all" 
          />
        </Link>

        {/* Menu Navigasi Tengah (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium text-white/85">
          <a href="#beranda" className="hover:text-sky-300 transition-colors py-1 drop-shadow-sm">
            Beranda
          </a>
          <a href="#layanan" className="hover:text-sky-300 transition-colors py-1 drop-shadow-sm">
            Fitur Unggulan
          </a>
          <a href="#cek-tagihan" className="hover:text-sky-300 transition-colors py-1 drop-shadow-sm">
            Cek SKRD
          </a>
          <a href="#pembayaran" className="hover:text-sky-300 transition-colors py-1 drop-shadow-sm">
            Sistem Pembayaran
          </a>
          <a href="#berita" className="hover:text-sky-300 transition-colors py-1 drop-shadow-sm">
            Berita &amp; Informasi
          </a>
        </nav>

        {/* Tombol Aksi Kanan (Desktop): Masuk & Daftar Sekarang */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/login"
            className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white px-3 py-2 transition-colors cursor-pointer drop-shadow-sm"
          >
            Masuk
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Daftar Sekarang
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-5 shadow-2xl text-xs sm:text-sm font-medium flex flex-col gap-3.5">
          <a 
            href="#beranda" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-sky-400 py-1"
          >
            Beranda
          </a>
          <a 
            href="#layanan" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-400 py-1"
          >
            Fitur Unggulan
          </a>
          <a 
            href="#cek-tagihan" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-400 py-1"
          >
            Cek SKRD
          </a>
          <a 
            href="#pembayaran" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-400 py-1"
          >
            Sistem Pembayaran
          </a>
          <a 
            href="#berita" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-sky-400 py-1"
          >
            Berita &amp; Informasi
          </a>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-white font-bold border border-slate-700 rounded-xl hover:bg-slate-900"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-sky-500 text-white font-bold rounded-xl shadow-sm hover:bg-sky-600"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
