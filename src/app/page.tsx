"use client";

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import {
  Plane,
  Building2,
  Warehouse,
  Radio,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  FileText,
  Menu,
  X,
  RefreshCw,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  BarChart3,
  Bell,
  User,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

const airportSlides = [
  {
    id: 1,
    imageSrc: '/images/bandara/mozes-kilangin-terminal.jpg',
    category: 'Objek Retribusi Ruangan',
    title: 'Terminal Penumpang & Garbarata',
    description: 'Tata kelola sewa gerai komersial, counter tiket maskapai, ruang VIP, serta jembatan garbarata.',
    tag: 'Sewa Ruang & Reklame'
  },
  {
    id: 2,
    imageSrc: '/images/bandara/mozes-kilangin-apron.jpg',
    category: 'Objek Retribusi Jasa Pelayanan',
    title: 'Area Parkir Apron Pesawat',
    description: 'Penghitungan tarif pendaratan dan penempatan armada pesawat komersial, perintis, serta helikopter.',
    tag: 'Pendaratan & Parkir'
  },
  {
    id: 3,
    imageSrc: '/images/bandara/mozes-kilangin-gedung.jpg',
    category: 'Objek Retribusi Bangunan',
    title: 'Gedung Utama & Bengkel Hanggar',
    description: 'Penyewaan hanggar perawatan armada (MRO) dan fasilitas perkantoran operasional penerbangan.',
    tag: 'Sewa Hanggar & Lahan'
  },
  {
    id: 4,
    imageSrc: '/images/bandara/mozes-kilangin-aerial.jpg',
    category: 'Kawasan Operasional Bandara',
    title: 'Kawasan Keselamatan Operasi (KKOP)',
    description: 'Integrasi tata kelola aset dan pengawasan retribusi di 14 pos lapangan terbang pedalaman Mimika.',
    tag: '14 Pos Mini Airport'
  }
];

interface QuickBillResult {
  status: 'PAID' | 'UNPAID' | 'EMERGENCY';
  skrdNo: string;
  invoiceNo: string;
  wajibRetribusi: string;
  layanan: string;
  tglTerbit: string;
  jatuhTempo?: string;
  tglLunas?: string;
  totalTagihan: number;
  noVa: string;
  ntb?: string;
  tokenDarurat?: string;
  keterangan: string;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputId = useId();

  // Carousel Slide State untuk Layar Laptop di Section Fitur
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % airportSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isHovered]);

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + airportSlides.length) % airportSlides.length);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % airportSlides.length);
  };

  // State Cek Tagihan
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<QuickBillResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e?: React.FormEvent, sampleCode?: string) => {
    if (e) e.preventDefault();
    const query = sampleCode || searchQuery;
    if (!query.trim()) {
      setSearchError('Silakan masukkan nomor SKRD atau Kode Invoice.');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const q = query.trim().toUpperCase();

      if (q.includes('LUNAS') || q.includes('0089')) {
        setSearchResult({
          status: 'PAID',
          skrdNo: q.startsWith('SKRD') ? q : 'SKRD-2026-01-0089',
          invoiceNo: 'INV/2026/01/MKQ-0089',
          wajibRetribusi: 'PT Smart Cakrawala Aviation',
          layanan: 'Parkir Apron & Pendaratan Pesawat (C208B Caravan)',
          tglTerbit: '15 Januari 2026',
          tglLunas: '15 Januari 2026, 14:10 WIT',
          totalTagihan: 1250000,
          noVa: '9388 0101 2938 4712',
          ntb: 'BP-TRX-20260115-8841',
          keterangan: 'Tagihan telah lunas tervalidasi ke Kas Daerah (Kasda) Kab. Mimika.'
        });
      } else if (q.includes('DARURAT') || q.includes('EMG')) {
        setSearchResult({
          status: 'EMERGENCY',
          skrdNo: 'SKRD-EMG-2026-0042',
          invoiceNo: 'INV/EMG/2026/042',
          wajibRetribusi: 'Helivida Air Papua (Charter Insidental)',
          layanan: 'Pendaratan Darurat & Penginapan Apron Insidental',
          tglTerbit: '28 Februari 2026',
          jatuhTempo: '01 Maret 2026',
          totalTagihan: 1850000,
          noVa: '9388 0888 1192 0042',
          tokenDarurat: 'emg-token-9812-safe',
          keterangan: 'Tagihan pendaratan darurat. Dapat dibayar langsung via QRIS / Virtual Account.'
        });
      } else {
        setSearchResult({
          status: 'UNPAID',
          skrdNo: q.startsWith('SKRD') ? q : 'SKRD-2026-02-0145',
          invoiceNo: 'INV/2026/02/MKQ-0145',
          wajibRetribusi: 'PT Trigana Air Service',
          layanan: 'Sewa Ruang Counter Tiket & Lahan Terminal Domestik',
          tglTerbit: '01 Februari 2026',
          jatuhTempo: '15 Februari 2026',
          totalTagihan: 4500000,
          noVa: '9388 0202 8841 0145',
          keterangan: 'Menunggu pembayaran via Virtual Account Bank Papua (Kasda Kab. Mimika).'
        });
      }
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800">
      
      {/* Top Navbar: Solid White Bersih Langsung Sesuai Permintaan */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-2xs py-2.5 sm:py-3">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between gap-6">
          
          {/* Logo Kiri: [M] MARS */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#3c8dbc] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">
              MARS
            </span>
          </Link>

          {/* Menu Navigasi Tengah (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-bold text-gray-700">
            <a href="#beranda" className="text-gray-900 hover:text-[#3c8dbc] transition-colors">
              Beranda
            </a>
            <a href="#solusi" className="hover:text-[#3c8dbc] transition-colors">
              Masalah &amp; Solusi
            </a>
            <a href="#layanan" className="hover:text-[#3c8dbc] transition-colors">
              Fitur Unggulan
            </a>
            <a href="#cek-tagihan" className="hover:text-[#3c8dbc] transition-colors">
              Cek SKRD
            </a>
            <a href="#pembayaran" className="hover:text-[#3c8dbc] transition-colors">
              Sistem Pembayaran
            </a>
          </nav>

          {/* Tombol Aksi Kanan (Desktop): Masuk & Daftar Sekarang */}
          <div className="hidden md:flex items-center gap-5">
            <Link 
              href="/login"
              className="text-xs font-bold text-gray-700 hover:text-[#3c8dbc] transition-colors cursor-pointer"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
          </button>

        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 shadow-xl text-xs font-bold flex flex-col gap-3">
            <a 
              href="#beranda" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-900 hover:text-[#3c8dbc] py-1"
            >
              Beranda
            </a>
            <a 
              href="#solusi" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#3c8dbc] py-1"
            >
              Masalah &amp; Solusi
            </a>
            <a 
              href="#layanan" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#3c8dbc] py-1"
            >
              Fitur Unggulan
            </a>
            <a 
              href="#cek-tagihan" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#3c8dbc] py-1"
            >
              Cek SKRD
            </a>
            <a 
              href="#pembayaran" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#3c8dbc] py-1"
            >
              Sistem Pembayaran
            </a>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-gray-800 font-bold border border-gray-200 rounded-lg"
              >
                Masuk
              </Link>
              <Link 
                href="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION (TATA LETAK HARMONIS & SEIMBANG) */}
      <section 
        id="beranda"
        className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-slate-950"
      >
        {/* Real Airport Background Image with Adjusted Dark Overlay - Gambar bandara tetap tampak jelas */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 transition-transform duration-1000 opacity-65 blur-[1px]"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        {/* Subtle Dark Vignette & Gradient Overlays - Tidak terlalu pekat agar pesawat dan runway terlihat */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/80 z-0" />

        {/* Konten Utama Hero: 2 Kolom Proporsional & Seimbang */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16 my-auto flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

            {/* KOLOM KIRI: Brand, Headline Luminous, Deskripsi dengan Highlight, 2 Tombol, & Kartu Layanan Cepat */}
            <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col items-start pr-0 lg:pr-2">
              
              {/* Brand Title Besar (MARS) dengan Gradient Titanium/Luminous */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-3 sm:mb-4 bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                MARS
              </h2>

              {/* Headline Utama: Mimika Airport Revenue System */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-white leading-[1.2] tracking-tight mb-5">
                Mimika Airport <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#38bdf8] bg-clip-text text-transparent">
                  Revenue System
                </span>
              </h1>

              {/* Deskripsi Paragraf dengan Highlight Frasa Kunci */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8 max-w-lg">
                Platform digital terintegrasi untuk tata kelola retribusi <strong className="text-white font-semibold">operasional pesawat</strong>, <strong className="text-white font-semibold">sewa hanggar & aset</strong>, serta penerbitan <strong className="text-sky-300 font-semibold">e-SKRD langsung ke Kas Daerah</strong>.
              </p>

              {/* 2 Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/register"
                  className="h-12 px-7 bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#075985] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-sky-400/30"
                >
                  <span>Daftar Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#cek-tagihan"
                  className="h-12 px-7 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-sky-400" />
                  <span>Cek Status SKRD</span>
                </a>
              </div>

            </div>

            {/* KOLOM KANAN: Gambar Laptop Asli MARS */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center lg:items-end select-none mt-8 lg:mt-0">
              
              {/* Container Gambar Laptop */}
              <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[590px] xl:max-w-[630px] lg:translate-x-4 xl:translate-x-6 transition-transform duration-300 hover:scale-[1.01]">
                {/* Backlight Ambient Glow */}
                <div className="absolute -inset-4 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
                
                {/* Laptop Mockup */}
                <img
                  src="/laptop-tenant-mars.png"
                  alt="Dashboard Pelayanan Retribusi MARS Tenant Portal"
                  className="w-full h-auto object-contain mx-auto block filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
                  loading="eager"
                />

                {/* Contact Shadow di Bawah Laptop agar tidak terlihat melayang */}
                <div className="w-[82%] h-4 mx-auto -mt-2 bg-black/90 rounded-full blur-md pointer-events-none" />
              </div>

            </div>

          </div>
        </div>

        {/* Garis Dasar Mulus Menyatu ke Section Berikutnya */}
        <div className="w-full h-[1px] bg-slate-800/80"></div>

      </section>

      {/* 2. SECTION MASALAH & SOLUSI (PROBLEM & SOLUTION - KONSISTEN WARNA BIRU & OUTLINE ICONS) */}
      <section id="solusi" className="py-20 lg:py-24 bg-gradient-to-b from-white via-sky-50/25 to-slate-50/60 border-b border-gray-200 scroll-mt-12 relative overflow-hidden">
        
        {/* Ambient Decorative Blue Glows */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-100/35 to-transparent pointer-events-none -z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50/90 border border-blue-200/80 px-4 py-1.5 rounded-full inline-block shadow-2xs mb-3">
              Tantangan &amp; Solusi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
              Tantangan Pengelolaan &amp; <span className="bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#3c8dbc] bg-clip-text text-transparent">Solusi Terpadu MARS</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Mengatasi kendala operasional lapangan yang dihadapi mitra dan petugas melalui ekosistem digital yang transparan, akuntabel, dan terstandar.
            </p>
          </div>

          {/* 4 Kartu Problem & Solution (Grid 2 Kolom - Aksen Biru Konsisten & Ikon Outline) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* KARTU 1: PEMBAYARAN & e-SKRD */}
            <div className="group relative bg-white rounded-2xl border border-blue-100/90 hover:border-sky-300 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-sky-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3c8dbc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                {/* Header: Outline Icon + Domain Title & Scope */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-200/70 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                    <CreditCard className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#0284c7] uppercase tracking-wider block">
                      Tata Kelola Retribusi
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                      Pembayaran &amp; e-SKRD
                    </h3>
                  </div>
                </div>

                {/* Masalah (Kendala Lapangan) */}
                <div className="mb-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 group-hover:border-slate-200 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kendala Lapangan
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Wajib retribusi harus datang langsung membawa bukti transfer fisik; proses verifikasi bendahara lambat dan rawan ketidaksesuaian nomor rekening kasda.
                  </p>
                </div>

                {/* Solusi MARS */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-sky-50/30 to-white border border-blue-200/80 shadow-2xs group-hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] uppercase tracking-wider mb-1">
                    <Check className="w-3.5 h-3.5 text-[#0284c7]" strokeWidth={2.2} />
                    <span>Solusi Praktis MARS</span>
                  </div>
                  <p className="text-xs text-gray-900 font-semibold leading-relaxed">
                    Penerbitan e-SKRD instan dengan Virtual Account Bank Papua &amp; QRIS 24/7. Transaksi tervalidasi seketika langsung ke Kas Daerah.
                  </p>
                </div>
              </div>

              {/* Dampak Hasil (Single Clean Highlight) */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Hasil Nyata:</span>
                <span className="font-semibold text-[#0284c7] bg-blue-50/80 border border-blue-200/70 px-2.5 py-0.5 rounded-md group-hover:bg-blue-100/70 transition-colors">
                  100% Non-Tunai &amp; Validasi Otomatis
                </span>
              </div>
            </div>

            {/* KARTU 2: OPERASIONAL PESAWAT & APRON */}
            <div className="group relative bg-white rounded-2xl border border-blue-100/90 hover:border-sky-300 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-sky-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3c8dbc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                {/* Header: Outline Icon + Domain Title & Scope */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-200/70 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                    <Plane className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#0284c7] uppercase tracking-wider block">
                      Pelayanan Penerbangan
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                      Operasional Pesawat &amp; Apron
                    </h3>
                  </div>
                </div>

                {/* Masalah (Kendala Lapangan) */}
                <div className="mb-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 group-hover:border-slate-200 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kendala Lapangan
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Perhitungan rumus bobot pesawat (MTOW) dan jam parkir dilakukan manual di lembar kerja terpisah, memicu selisih hitung antara operator dan petugas.
                  </p>
                </div>

                {/* Solusi MARS */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-sky-50/30 to-white border border-blue-200/80 shadow-2xs group-hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] uppercase tracking-wider mb-1">
                    <Check className="w-3.5 h-3.5 text-[#0284c7]" strokeWidth={2.2} />
                    <span>Solusi Praktis MARS</span>
                  </div>
                  <p className="text-xs text-gray-900 font-semibold leading-relaxed">
                    Kalkulasi otomatis presisi sesuai formula Perda Kabupaten Mimika. Sistem langsung mengunci nilai tagihan begitu pergerakan armada tercatat.
                  </p>
                </div>
              </div>

              {/* Dampak Hasil (Single Clean Highlight) */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Hasil Nyata:</span>
                <span className="font-semibold text-[#0284c7] bg-blue-50/80 border border-blue-200/70 px-2.5 py-0.5 rounded-md group-hover:bg-blue-100/70 transition-colors">
                  Kalkulasi Presisi &amp; Bebas Selisih
                </span>
              </div>
            </div>

            {/* KARTU 3: TRANSPARANSI & REKAM DOKUMEN */}
            <div className="group relative bg-white rounded-2xl border border-blue-100/90 hover:border-sky-300 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-sky-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3c8dbc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                {/* Header: Outline Icon + Domain Title & Scope */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-200/70 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                    <FileText className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#0284c7] uppercase tracking-wider block">
                      Transparansi &amp; Akuntabilitas
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                      Transparansi &amp; Rekam Dokumen
                    </h3>
                  </div>
                </div>

                {/* Masalah (Kendala Lapangan) */}
                <div className="mb-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 group-hover:border-slate-200 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kendala Lapangan
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Tagihan tiba-tiba menumpuk tanpa pemberitahuan dini, dan lembar fisik bukti setor rentan terselip atau rusak saat pemeriksaan audit berkala.
                  </p>
                </div>

                {/* Solusi MARS */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-sky-50/30 to-white border border-blue-200/80 shadow-2xs group-hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] uppercase tracking-wider mb-1">
                    <Check className="w-3.5 h-3.5 text-[#0284c7]" strokeWidth={2.2} />
                    <span>Solusi Praktis MARS</span>
                  </div>
                  <p className="text-xs text-gray-900 font-semibold leading-relaxed">
                    Portal tenant mandiri 24/7 dengan notifikasi jatuh tempo otomatis dan arsip Surat Tanda Setoran (STS) digital sah siap diunduh kapan saja.
                  </p>
                </div>
              </div>

              {/* Dampak Hasil (Single Clean Highlight) */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Hasil Nyata:</span>
                <span className="font-semibold text-[#0284c7] bg-blue-50/80 border border-blue-200/70 px-2.5 py-0.5 rounded-md group-hover:bg-blue-100/70 transition-colors">
                  Arsip Digital Lengkap &amp; Siap Audit
                </span>
              </div>
            </div>

            {/* KARTU 4: SEWA FASILITAS & HANGGAR */}
            <div className="group relative bg-white rounded-2xl border border-blue-100/90 hover:border-sky-300 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-sky-500/8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3c8dbc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                {/* Header: Outline Icon + Domain Title & Scope */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-200/70 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                    <Building2 className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#0284c7] uppercase tracking-wider block">
                      Pemanfaatan Aset Daerah
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                      Sewa Aset &amp; Fasilitas Hanggar
                    </h3>
                  </div>
                </div>

                {/* Masalah (Kendala Lapangan) */}
                <div className="mb-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 group-hover:border-slate-200 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kendala Lapangan
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Jadwal penggunaan slot hanggar perawatan sering bentrok tumpang tindih, serta masa perpanjangan kontrak sewa ruang dan counter sering terlewat.
                  </p>
                </div>

                {/* Solusi MARS */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 via-sky-50/30 to-white border border-blue-200/80 shadow-2xs group-hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0284c7] uppercase tracking-wider mb-1">
                    <Check className="w-3.5 h-3.5 text-[#0284c7]" strokeWidth={2.2} />
                    <span>Solusi Praktis MARS</span>
                  </div>
                  <p className="text-xs text-gray-900 font-semibold leading-relaxed">
                    Kalender ketersediaan hanggar interaktif dan alur permohonan kontrak PKS digital terpusat yang transparan dan tertib administrasi.
                  </p>
                </div>
              </div>

              {/* Dampak Hasil (Single Clean Highlight) */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Hasil Nyata:</span>
                <span className="font-semibold text-[#0284c7] bg-blue-50/80 border border-blue-200/70 px-2.5 py-0.5 rounded-md group-hover:bg-blue-100/70 transition-colors">
                  Slot Terjadwal &amp; Alur Kontrak Tertib
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>




      {/* 3. FITUR UNGGULAN & LAYANAN (GAYA APETECH: 3 KOLOM - FITUR KIRI, LAPTOP REALISTIS SLIDES DI TENGAH, FITUR KANAN) */}
      <section id="layanan" className="py-20 lg:py-24 bg-white border-b border-gray-200 scroll-mt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Tengah Sesuai Gambar Referensi ApeTech */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-3">
              Fitur & Layanan Utama
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Fitur Unggulan Sistem MARS
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Ekosistem digital terpadu untuk efisiensi operasional apron, transparansi tata kelola aset bandara, dan kepatuhan retribusi daerah secara akuntabel.
            </p>
          </div>

          {/* 3-Kolom: Kiri (3 Fitur), Tengah (3-Monitor Perspective Showcase Gaya iMac), Kanan (3 Fitur) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 xl:gap-8 items-center">
            
            {/* KOLOM KIRI (3 FITUR) */}
            <div className="lg:col-span-3 flex flex-col gap-8 sm:gap-9 order-2 lg:order-1">
              
              {/* Fitur 1 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Manajemen Tenant & Aset
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Pendataan legalitas penyewa, counter terminal penumpang, ruang komersial, dan hanggar secara rinci.
                  </p>
                </div>
              </div>

              {/* Fitur 2 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Database Pesawat & Apron
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Kalkulasi retribusi otomatis pendaratan dan parkir berdasarkan bobot MTOW dan durasi waktu parkir.
                  </p>
                </div>
              </div>

              {/* Fitur 3 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Siklus Kontrak & e-SKRD
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Penerbitan Surat Perjanjian Kerja Sama (PKS) dan SKRD elektronik sah yang terhubung langsung ke kas daerah.
                  </p>
                </div>
              </div>

            </div>

            {/* KOLOM TENGAH (3-MONITOR PERSPECTIVE SHOWCASE GAYA IMAC SESUAI GAMBAR REFERENSI) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
              
              <div 
                className="relative w-full max-w-[580px] sm:max-w-[650px] xl:max-w-[700px] select-none group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                
                {/* 3D Perspective Trio Displays Container - Grounded Base */}
                <div className="relative flex items-end justify-center min-h-[320px] sm:min-h-[360px] md:min-h-[400px] pb-3 pt-2">
                  
                  {/* 1. MONITOR KIRI (Tilted Angled Inward - Dashboard Tenant) */}
                  <div 
                    className="absolute -left-3 sm:-left-6 md:-left-8 bottom-3 w-[50%] sm:w-[48%] md:w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[-4px]"
                    style={{
                      transform: 'perspective(1000px) rotateY(24deg) scale(0.92)',
                      transformOrigin: 'right bottom',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))'
                    }}
                  >
                    {/* Monitor Frame */}
                    <div className="relative rounded-t-[10px] sm:rounded-t-[14px] border-[4px] sm:border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                      {/* Webcam */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700 z-20"></div>
                      
                      {/* Screen: Dashboard Tenant (Tanpa Penjelasan Sesuai Permintaan) */}
                      <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
                        <img
                          src="/images/showcase/dashboard-tenant.png"
                          alt="Dashboard Tenant Bandara Mozes Kilangin"
                          className="w-full h-full object-cover object-left-top"
                        />
                      </div>

                      {/* iMac Chin */}
                      <div className="h-4 sm:h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                      </div>
                    </div>
                    {/* Stand Neck & Base Foot */}
                    <div className="w-7 sm:w-9 h-5 sm:h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                    <div className="w-18 sm:w-24 h-1.5 sm:h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                    <div className="w-22 sm:w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
                  </div>

                  {/* 2. MONITOR TENGAH (Front-Facing, Layar Utama dengan Slides Berganti & Penjelasan Langsung) */}
                  <div 
                    className="relative w-[74%] sm:w-[72%] md:w-[70%] z-20 transition-all duration-500 group-hover:scale-[1.01]"
                    style={{
                      filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.32))'
                    }}
                  >
                    {/* Monitor Frame */}
                    <div className="relative rounded-t-[12px] sm:rounded-t-[16px] border-[5px] sm:border-[6px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-2xl flex flex-col">
                      
                      {/* Webcam */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 z-30 flex items-center justify-center">
                        <div className="w-0.5 h-0.5 rounded-full bg-sky-400"></div>
                      </div>

                      {/* Screen Slides dengan Penjelasan Langsung di Atas Gambar */}
                      <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
                        {airportSlides.map((slide, idx) => (
                          <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                              activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                          >
                            <img
                              src={slide.imageSrc}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                            />

                            {/* Penjelasan Langsung di Atas Gambar (Glassmorphism Elegan) */}
                            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent flex flex-col justify-end text-left z-20">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="px-2 py-0.5 rounded text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider bg-[#3c8dbc] text-white shadow-xs">
                                  {slide.category}
                                </span>
                                <span className="text-[7.5px] sm:text-[8.5px] text-sky-200 font-medium bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                                  {slide.tag}
                                </span>
                              </div>
                              <h4 className="text-white font-extrabold text-[11px] sm:text-xs md:text-sm tracking-tight mb-0.5 drop-shadow-xs truncate">
                                {slide.title}
                              </h4>
                              <p className="text-slate-200 text-[8px] sm:text-[9.5px] leading-tight line-clamp-2">
                                {slide.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* iMac Metallic Chin */}
                      <div className="h-5 sm:h-6 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-slate-600/70"></div>
                      </div>
                    </div>

                    {/* Stand Neck & Base Foot */}
                    <div className="w-11 sm:w-14 h-7 sm:h-8 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                    <div className="w-26 sm:w-34 h-2 sm:h-2.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-md border-b border-slate-400/50"></div>
                    <div className="w-32 sm:w-42 h-2 bg-black/30 blur-sm rounded-full mx-auto -mt-1"></div>
                  </div>

                  {/* 3. MONITOR KANAN (Tilted Angled Inward - MARS GIS) */}
                  <div 
                    className="absolute -right-3 sm:-right-6 md:-right-8 bottom-3 w-[50%] sm:w-[48%] md:w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[4px]"
                    style={{
                      transform: 'perspective(1000px) rotateY(-24deg) scale(0.92)',
                      transformOrigin: 'left bottom',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))'
                    }}
                  >
                    {/* Monitor Frame */}
                    <div className="relative rounded-t-[10px] sm:rounded-t-[14px] border-[4px] sm:border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                      {/* Webcam */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700 z-20"></div>

                      {/* Screen: MARS GIS (Tanpa Penjelasan Sesuai Permintaan) */}
                      <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
                        <img
                          src="/images/showcase/mars-gis.png"
                          alt="MARS GIS Airport Revenue System"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* iMac Chin */}
                      <div className="h-4 sm:h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                      </div>
                    </div>
                    {/* Stand Neck & Base Foot */}
                    <div className="w-7 sm:w-9 h-5 sm:h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                    <div className="w-18 sm:w-24 h-1.5 sm:h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                    <div className="w-22 sm:w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
                  </div>

                </div>

                {/* Soft Floor Shadow beneath the 3 monitors */}
                <div className="w-[88%] h-4 bg-black/20 blur-lg rounded-full mx-auto -mt-1.5"></div>

                {/* Navigasi Titik & Panah di Bawah Display */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#3c8dbc] text-gray-700 hover:text-white flex items-center justify-center border border-gray-200 hover:border-[#3c8dbc] transition-all cursor-pointer hover:scale-110 shadow-xs"
                    aria-label="Slide Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {airportSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeSlide === idx 
                            ? 'w-6 bg-[#3c8dbc] shadow-xs' 
                            : 'w-2 bg-blue-100 hover:bg-[#3c8dbc]/50 border border-blue-200'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#3c8dbc] text-gray-700 hover:text-white flex items-center justify-center border border-gray-200 hover:border-[#3c8dbc] transition-all cursor-pointer hover:scale-110 shadow-xs"
                    aria-label="Slide Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* KOLOM KANAN (3 FITUR) */}
            <div className="lg:col-span-3 flex flex-col gap-8 sm:gap-9 order-3">
              
              {/* Fitur 4 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Pembayaran 100% Non-Tunai
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Integrasi host-to-host Virtual Account Bank Papua & QRIS dinamis nasional, dana langsung masuk rekening Kas Daerah.
                  </p>
                </div>
              </div>

              {/* Fitur 5 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Mini Airport Pedalaman
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Pencatatan log operasional dan retribusi terkomputerisasi di 14 pos lapangan terbang perintis pelosok Mimika.
                  </p>
                </div>
              </div>

              {/* Fitur 6 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#3c8dbc] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#3c8dbc] group-hover:text-white group-hover:border-[#3c8dbc] group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#3c8dbc] transition-colors">
                    Audit & Rekonsiliasi Real-Time
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Verifikasi otomatis penerimaan kasda, deteksi overstay armada pesawat, dan dashboard pemantauan pimpinan eksekutif.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. FITUR UTAMA: CEK TAGIHAN CEPAT (LANGSUNG DI BAWAH HERO) */}
      <section id="cek-tagihan" className="py-16 sm:py-20 bg-[#f8fafc] border-b border-gray-200 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50 px-3 py-1 rounded border border-blue-100 inline-block mb-2">
              Layanan Mandiri
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Cek Tagihan & Status e-SKRD
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Masukkan Nomor SKRD atau Nomor Invoice untuk melihat rincian tagihan dan nomor pembayaran Virtual Account Bank Papua.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-7 shadow-sm">
            
            <form onSubmit={handleSearch} className="space-y-4">
              <label htmlFor={searchInputId} className="sr-only">
                Nomor SKRD atau Nomor Invoice
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id={searchInputId}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan Nomor SKRD atau Invoice (contoh: SKRD-2026-02-0145)..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-3 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memeriksa...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Cek Tagihan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Contoh Cepat */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-1">
                <span className="text-[11px] font-medium text-gray-400">Coba Cepat:</span>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('SKRD-2026-02-0145'); handleSearch(undefined, 'SKRD-2026-02-0145'); }}
                  className="px-2.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 text-[11px]"
                >
                  Tagihan Belum Lunas
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('SKRD-2026-01-0089-LUNAS'); handleSearch(undefined, 'SKRD-2026-01-0089-LUNAS'); }}
                  className="px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 text-[11px]"
                >
                  SKRD Lunas
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('SKRD-EMG-DARURAT'); handleSearch(undefined, 'SKRD-EMG-DARURAT'); }}
                  className="px-2.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 text-[11px]"
                >
                  Pendaratan Darurat
                </button>
              </div>

              {searchError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{searchError}</span>
                </div>
              )}
            </form>

            {/* Hasil Pencarian */}
            {searchResult && (
              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200 mb-4">
                    <div>
                      <span className="text-[11px] text-gray-500 block">Nomor SKRD / Surat Ketetapan:</span>
                      <span className="font-extrabold text-sm text-gray-900">{searchResult.skrdNo}</span>
                    </div>
                    <div>
                      {searchResult.status === 'PAID' ? (
                        <StatusBadge status="Lunas" label="LUNAS TERVERIFIKASI" className="text-xs px-3 py-1" />
                      ) : searchResult.status === 'EMERGENCY' ? (
                        <StatusBadge status="Menunggu Bayar" label="MENUNGGU PEMBAYARAN DARURAT" className="text-xs px-3 py-1" />
                      ) : (
                        <StatusBadge status="Menunggu Bayar" label="MENUNGGU PEMBAYARAN" className="text-xs px-3 py-1" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Wajib Retribusi / Mitra:</span>
                      <span className="font-bold text-gray-800">{searchResult.wajibRetribusi}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Layanan / Objek Retribusi:</span>
                      <span className="font-medium text-gray-800">{searchResult.layanan}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Tanggal Terbit:</span>
                      <span className="font-medium text-gray-800">{searchResult.tglTerbit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">
                        {searchResult.status === 'PAID' ? 'Waktu Pelunasan:' : 'Batas Jatuh Tempo:'}
                      </span>
                      <span className={`font-semibold ${searchResult.status === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {searchResult.status === 'PAID' ? searchResult.tglLunas : searchResult.jatuhTempo}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded p-4 border border-gray-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-gray-500 block mb-0.5">Total Tagihan:</span>
                      <span className="text-2xl font-black text-gray-900">
                        Rp {searchResult.totalTagihan.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {searchResult.status === 'PAID' ? (
                      <div className="text-right">
                        <span className="text-[11px] text-gray-500 block mb-0.5">Nomor Transaksi Kasda:</span>
                        <span className="font-mono text-xs font-bold text-emerald-700">{searchResult.ntb}</span>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
                        <span className="text-[11px] text-gray-500 block">Virtual Account Bank Papua:</span>
                        <span className="font-mono text-sm font-bold text-[#367fa9] tracking-wider">
                          {searchResult.noVa}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <span className="text-gray-500 italic text-[11px]">
                      {searchResult.keterangan}
                    </span>

                    {searchResult.status === 'PAID' ? (
                      <Link
                        href="/cetak/skrd/sample"
                        className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Cetak Bukti</span>
                      </Link>
                    ) : searchResult.tokenDarurat ? (
                      <Link
                        href={`/pembayaran-darurat/${searchResult.tokenDarurat}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang (QRIS / VA)</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold rounded text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Masuk Portal untuk Bayar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. SISTEM PEMBAYARAN NON-TUNAI */}
      <section id="pembayaran" className="py-16 bg-[#f0f7fb] border-b border-gray-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-white px-3 py-1 rounded border border-blue-200 inline-block mb-3">
                Zero Cash Policy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                Pembayaran 100% Non-Tunai & Langsung ke Kasda
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Untuk menjamin transparansi, akuntabilitas, dan mencegah pungutan liar, seluruh pembayaran retribusi Bandara Mozes Kilangin wajib dilakukan secara perbankan elektronik. Petugas dilarang keras menerima uang tunai fisik.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-xs">
                      VA
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Virtual Account Bank Papua</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-normal">
                    Tagihan terhubung langsung dengan rekening kas daerah (Kasda). Pelunasan otomatis tercatat tanpa perlu konfirmasi manual.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-xs">
                      <QrCode className="w-4 h-4 text-[#3c8dbc]" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">QRIS Dinamis Nasional</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-normal">
                    Tersedia untuk transaksi insidental atau pendaratan darurat. Cukup pindai barcode dari aplikasi mobile banking bank mana pun.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Daftar Akun Mitra Baru
                </h3>
                <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                  Bagi maskapai, operator penerbangan charter, atau pemilik usaha bandara yang belum terdaftar, silakan buat akun untuk mengelola armada dan sewa aset Anda.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="w-full py-3 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded transition-all text-center block shadow-sm"
                  >
                    Pendaftaran Akun Mitra
                  </Link>
                  <Link
                    href="/login"
                    className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider rounded border border-gray-300 transition-all text-center block"
                  >
                    Sudah Punya Akun? Login
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <Link href="/eksekutif" className="text-xs text-[#3c8dbc] font-bold hover:underline">
                    Portal Eksekutif (Dashboard Pimpinan) &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PUSAT UNDUHAN RESMI */}
      <section id="unduhan" className="py-14 bg-white border-b border-gray-200 scroll-mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50 px-3 py-1 rounded border border-blue-100 inline-block mb-2">
              Dokumen Resmi
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Pusat Unduhan Brosur & Buku Panduan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Unduh panduan penggunaan sistem dan brosur resmi aplikasi MARS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-[#f8fafc] p-5 rounded-lg border border-gray-200 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3c8dbc] block mb-1">
                  Buku Pedoman Lengkap (PDF)
                </span>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Panduan Alur Kerja & Hak Akses MARS
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Panduan alur peran Tenant, Petugas Lapangan, dan Admin Dinas Perhubungan.
                </p>
                <a
                  href="/Panduan_Alur_Kerja_dan_Hak_Akses_MARS.pdf"
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Panduan</span>
                </a>
              </div>
              <div className="w-10 h-10 rounded bg-blue-100 text-[#3c8dbc] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#f8fafc] p-5 rounded-lg border border-gray-200 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3c8dbc] block mb-1">
                  Brosur Resmi (PDF)
                </span>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Brosur Aplikasi MARS 2026
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Ringkasan transformasi digital retribusi daerah Bandara Mozes Kilangin.
                </p>
                <a
                  href="/Brosur_Aplikasi_MARS.pdf"
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Brosur</span>
                </a>
              </div>
              <div className="w-10 h-10 rounded bg-blue-100 text-[#3c8dbc] flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FOOTER RESMI */}
      <footer className="bg-white border-t-2 border-[#3c8dbc] text-gray-600 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-200">
            
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#3c8dbc] text-white flex items-center justify-center font-bold text-lg rounded">
                  M
                </div>
                <span className="text-lg font-black text-gray-900 tracking-tight">MARS</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mb-3">
                Mimika Airport Revenue System. Portal digital resmi pengelolaan retribusi jasa kebandarudaraan UPBU Mozes Kilangin, Dinas Perhubungan Kabupaten Mimika.
              </p>
              <div className="text-[11px] text-gray-500">
                Dasar Hukum: Peraturan Daerah Kabupaten Mimika & Standar Ditjen Hubud RI.
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Tautan Cepat</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#beranda" className="hover:text-[#3c8dbc] transition-colors">Beranda</a></li>
                <li><a href="#cek-tagihan" className="hover:text-[#3c8dbc] transition-colors">Cek Status Tagihan</a></li>
                <li><Link href="/login" className="hover:text-[#3c8dbc] transition-colors">Login Portal</Link></li>
                <li><Link href="/register" className="hover:text-[#3c8dbc] transition-colors">Pendaftaran Akun</Link></li>
                <li><Link href="/eksekutif" className="hover:text-[#3c8dbc] transition-colors">Portal Eksekutif (Dashboard)</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Kantor & Layanan</h4>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#3c8dbc] shrink-0 mt-0.5" />
                  <span>Dinas Perhubungan Kab. Mimika / UPBU Mozes Kilangin, Jalan Cenderawasih, Timika, Papua Tengah</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#3c8dbc] shrink-0" />
                  <span>dishub@mimikakab.go.id</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              &copy; {new Date().getFullYear()} Dinas Perhubungan Kabupaten Mimika. Hak Cipta Dilindungi.
            </div>
            <div className="text-[11px] text-gray-400">
              UPBU Mozes Kilangin • Bank Papua Host-to-Host
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
