"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Building2,
  Plane,
  FileText,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Radio,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FeatureService {
  id: number;
  number: string;
  title: string;
  category: string;
  tag: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  imageSrc: string;
  highlightStat: string;
  statLabel: string;
  gradient: string;
  accentBg: string;
  accentText: string;
}

const features: FeatureService[] = [
  {
    id: 0,
    number: "01",
    title: "Manajemen Tenant & Aset",
    category: "Objek Retribusi Ruangan",
    tag: "Sewa Ruang & Reklame",
    icon: Building2,
    badge: "Terminal & Hanggar",
    description: "Pendataan legalitas penyewa, counter terminal penumpang, ruang komersial, dan hanggar secara akurat dan transparan.",
    imageSrc: "/images/bandara/mozes-kilangin-terminal.jpg",
    highlightStat: "50+ Aset",
    statLabel: "Terdata Digital",
    gradient: "from-blue-600 to-cyan-500",
    accentBg: "bg-blue-50 border-blue-200 text-[#3c8dbc]",
    accentText: "text-[#3c8dbc]"
  },
  {
    id: 1,
    number: "02",
    title: "Database Pesawat & Apron",
    category: "Jasa Pelayanan Penerbangan",
    tag: "Pendaratan & Parkir",
    icon: Plane,
    badge: "Auto MTOW Calc",
    description: "Kalkulasi tarif retribusi otomatis untuk pendaratan dan parkir apron berdasarkan bobot MTOW dan durasi waktu parkir.",
    imageSrc: "/images/bandara/mozes-kilangin-apron.jpg",
    highlightStat: "100% Akurat",
    statLabel: "Rumus Perbup 25/2024",
    gradient: "from-sky-600 to-indigo-500",
    accentBg: "bg-sky-50 border-sky-200 text-sky-600",
    accentText: "text-sky-600"
  },
  {
    id: 2,
    number: "03",
    title: "Siklus Kontrak & e-SKRD",
    category: "Legalitas & Ketetapan",
    tag: "e-SKRD Sah Kasda",
    icon: FileText,
    badge: "Otomasi PKS & SKRD",
    description: "Penerbitan Surat Perjanjian Kerja Sama (PKS) dan dokumen e-SKRD resmi yang terhubung langsung ke rekening Kas Daerah.",
    imageSrc: "/images/showcase/dashboard-tenant.png",
    highlightStat: "Paperless",
    statLabel: "TTE & Nomor Otomatis",
    gradient: "from-indigo-600 to-blue-500",
    accentBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
    accentText: "text-indigo-600"
  },
  {
    id: 3,
    number: "04",
    title: "Pembayaran 100% Non-Tunai",
    category: "Kanal Kas Daerah",
    tag: "Bank Papua & QRIS",
    icon: CreditCard,
    badge: "Host-to-Host Kasda",
    description: "Integrasi host-to-host Virtual Account Bank Papua & QRIS dinamis nasional. Penerimaan retribusi langsung masuk ke Kasda.",
    imageSrc: "/images/bandara/mozes-kilangin-gedung.jpg",
    highlightStat: "Real-Time",
    statLabel: "Settlement Kasda",
    gradient: "from-emerald-600 to-teal-500",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
    accentText: "text-emerald-600"
  },
  {
    id: 4,
    number: "05",
    title: "Mini Airport Pedalaman",
    category: "Konektivitas Wilayah",
    tag: "14 Lapangan Terbang",
    icon: Radio,
    badge: "Pos Perintis Mimika",
    description: "Pencatatan log operasional lapangan dan penarikan retribusi terkomputerisasi di 14 pos lapangan terbang perintis pelosok.",
    imageSrc: "/images/bandara/mozes-kilangin-aerial.jpg",
    highlightStat: "14 Pos",
    statLabel: "Terintegrasi Online",
    gradient: "from-amber-600 to-orange-500",
    accentBg: "bg-amber-50 border-amber-200 text-amber-600",
    accentText: "text-amber-600"
  },
  {
    id: 5,
    number: "06",
    title: "Audit & Rekonsiliasi",
    category: "Tata Kelola Keuangan",
    tag: "Akuntabilitas Real-Time",
    icon: ShieldCheck,
    badge: "Monitoring Eksekutif",
    description: "Verifikasi otomatis penerimaan kasda, deteksi overstay armada pesawat, dan dashboard pemantauan pimpinan secara akuntabel.",
    imageSrc: "/images/showcase/mars-gis.png",
    highlightStat: "Transparan",
    statLabel: "Dashboard Eksekutif",
    gradient: "from-purple-600 to-pink-500",
    accentBg: "bg-purple-50 border-purple-200 text-purple-600",
    accentText: "text-purple-600"
  }
];

export default function ServicesSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  // Auto-slide rotasi untuk demonstrasi visual
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % features.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Sinkronisasi scroll horizontal mobile saat activeSlide berubah
  useEffect(() => {
    if (!carouselRef.current) return;
    isProgrammaticScroll.current = true;
    const container = carouselRef.current;
    const targetCard = container.children[activeSlide] as HTMLElement;
    if (targetCard) {
      const containerWidth = container.offsetWidth;
      const cardWidth = targetCard.offsetWidth;
      const cardLeft = targetCard.offsetLeft;
      // Tengahkan kartu yang aktif
      const scrollPos = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      container.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });
    }
    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
    return () => clearTimeout(timeout);
  }, [activeSlide]);

  // Listener scroll manual (swipe jari) pada mobile
  const handleMobileScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !carouselRef.current) return;
    const container = carouselRef.current;
    const scrollCenter = container.scrollLeft + (container.offsetWidth / 2);
    
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const card = child as HTMLElement;
      const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
      const distance = Math.abs(scrollCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeSlide && closestIndex >= 0 && closestIndex < features.length) {
      setActiveSlide(closestIndex);
    }
  }, [activeSlide]);

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % features.length);
  };

  const currentFeature = features[activeSlide];

  return (
    <section id="layanan" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-gray-200 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#3c8dbc] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#3c8dbc]" />
            <span>Fitur &amp; Layanan Unggulan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-4">
            Ekosistem Terintegrasi <span className="bg-gradient-to-r from-[#3c8dbc] to-blue-700 bg-clip-text text-transparent">Sistem MARS</span>
          </h2>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Satu platform terpadu untuk efisiensi pergerakan apron, transparansi tata kelola aset bandara, dan kepatuhan retribusi daerah Kabupaten Mimika.
          </p>
        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 1: MOBILE & TABLET VIEW (< 1024px)                     */}
        {/* Responsive, Interaktif, Horizontal Swipeable (Tidak Monoton)   */}
        {/* ============================================================== */}
        <div className="block lg:hidden space-y-6">
          
          {/* A. 3-Monitor Perspective Studio Showcase (Tampilan Laptop / Display seperti awal) */}
          <div 
            className="relative w-full max-w-[420px] sm:max-w-[520px] mx-auto select-none group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* 3D Perspective Trio Displays Container */}
            <div className="relative flex items-end justify-center min-h-[220px] sm:min-h-[270px] pb-3 pt-2">
              
              {/* 1. MONITOR KIRI (Tilted Angled Inward - Dashboard Tenant) */}
              <div 
                className="absolute -left-1 sm:-left-4 bottom-2 w-[46%] sm:w-[47%] z-10"
                style={{
                  transform: 'perspective(800px) rotateY(24deg) scale(0.92)',
                  transformOrigin: 'right bottom',
                  filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.22))'
                }}
              >
                <div className="relative rounded-t-[10px] sm:rounded-t-[14px] border-[4px] sm:border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700 z-20"></div>
                  <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
                    <img
                      src="/images/showcase/dashboard-tenant.png"
                      alt="Dashboard Tenant Bandara Mozes Kilangin"
                      className="w-full h-full object-cover object-left-top"
                    />
                  </div>
                  <div className="h-4 sm:h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                  </div>
                </div>
                <div className="w-7 sm:w-9 h-5 sm:h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                <div className="w-18 sm:w-24 h-1.5 sm:h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                <div className="w-22 sm:w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
              </div>

              {/* 2. MONITOR TENGAH (Front-Facing, Layar Utama Terhubung ke Fitur Aktif) */}
              <div 
                className="relative w-[76%] sm:w-[72%] z-20 transition-all duration-300"
                style={{
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.3))'
                }}
              >
                <div className="relative rounded-t-[12px] sm:rounded-t-[16px] border-[5px] sm:border-[6px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-2xl flex flex-col">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 z-30 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-sky-400"></div>
                  </div>

                  {/* Screen Slides dengan Penjelasan Dinamis Sesuai Fitur yang Aktif */}
                  <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
                    {features.map((feat, idx) => (
                      <div
                        key={feat.id}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={feat.imageSrc}
                          alt={feat.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Keterangan Layar Glassmorphism */}
                        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent flex flex-col justify-end text-left z-20">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`px-2 py-0.5 rounded text-[7.5px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${feat.gradient} shadow-xs`}>
                              {feat.category}
                            </span>
                            <span className="text-[7.5px] text-sky-200 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                              {feat.tag}
                            </span>
                          </div>
                          <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-xs truncate">
                            {feat.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-5 sm:h-6 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-slate-600/70"></div>
                  </div>
                </div>

                <div className="w-11 sm:w-14 h-7 sm:h-8 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                <div className="w-26 sm:w-34 h-2 sm:h-2.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-md border-b border-slate-400/50"></div>
                <div className="w-32 sm:w-42 h-2 bg-black/30 blur-sm rounded-full mx-auto -mt-1"></div>
              </div>

              {/* 3. MONITOR KANAN (Tilted Angled Inward - MARS GIS) */}
              <div 
                className="absolute -right-1 sm:-right-4 bottom-2 w-[46%] sm:w-[47%] z-10"
                style={{
                  transform: 'perspective(800px) rotateY(-24deg) scale(0.92)',
                  transformOrigin: 'left bottom',
                  filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.22))'
                }}
              >
                <div className="relative rounded-t-[10px] sm:rounded-t-[14px] border-[4px] sm:border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700 z-20"></div>
                  <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
                    <img
                      src="/images/showcase/mars-gis.png"
                      alt="MARS GIS Airport Revenue System"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="h-4 sm:h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                  </div>
                </div>
                <div className="w-7 sm:w-9 h-5 sm:h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                <div className="w-18 sm:w-24 h-1.5 sm:h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                <div className="w-22 sm:w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
              </div>

            </div>

            {/* Soft Floor Shadow */}
            <div className="w-[88%] h-3.5 bg-black/20 blur-md rounded-full mx-auto -mt-1"></div>

            {/* Navigasi Titik & Panah Mobile */}
            <div className="flex items-center justify-center gap-3 mt-3 mb-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#3c8dbc] text-gray-700 hover:text-white flex items-center justify-center border border-gray-200 hover:border-[#3c8dbc] transition-all cursor-pointer shadow-xs"
                aria-label="Slide Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {features.map((feat, idx) => (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx 
                        ? 'w-5 bg-[#3c8dbc] shadow-xs' 
                        : 'w-1.5 bg-blue-100 hover:bg-[#3c8dbc]/50 border border-blue-200'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#3c8dbc] text-gray-700 hover:text-white flex items-center justify-center border border-gray-200 hover:border-[#3c8dbc] transition-all cursor-pointer shadow-xs"
                aria-label="Slide Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Cards Track */}
          <div
            ref={carouselRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 px-4 py-1 -mx-4 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              const isActive = activeSlide === idx;

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`shrink-0 w-[78vw] max-w-[290px] snap-center rounded-xl p-3.5 transition-all duration-200 cursor-pointer select-none text-left relative flex flex-col justify-between border ${
                    isActive
                      ? 'bg-blue-50/50 border-[#3c8dbc] shadow-sm ring-1 ring-[#3c8dbc]/25'
                      : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header Kartu: Nomor & Icon */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${feat.gradient} text-white shadow-xs`
                          : `${feat.accentBg}`
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-blue-100 text-[#3c8dbc] border-blue-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {feat.badge}
                        </span>
                        <span className="font-mono font-bold text-xs text-gray-300">
                          {feat.number}
                        </span>
                      </div>
                    </div>

                    {/* Judul & Deskripsi */}
                    <h3 className={`text-sm font-bold mb-1 transition-colors line-clamp-1 ${
                      isActive ? 'text-[#3c8dbc]' : 'text-gray-900'
                    }`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                      {feat.description}
                    </p>
                  </div>

                  {/* Footer Kartu: Highlight Stat */}
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isActive ? 'border-blue-200/60' : 'border-gray-100'
                  }`}>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-normal">{feat.statLabel}</span>
                      <span className="font-semibold text-gray-800">{feat.highlightStat}</span>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isActive ? 'text-[#3c8dbc]' : 'text-gray-400'
                    }`}>
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ============================================================== */}
        {/* TAMPILAN 2: DESKTOP VIEW (>= 1024px)                            */}
        {/* 3-Kolom Studio Perspective: Kiri 3 Fitur, Tengah iMac Studio,   */}
        {/* Kanan 3 Fitur dengan Interaksi Hover & Click Real-Time          */}
        {/* ============================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 xl:gap-8 items-center">
          
          {/* KOLOM KIRI (FITUR 1, 2, 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6 xl:gap-8 order-1">
            {features.slice(0, 3).map((feat) => {
              const IconComp = feat.icon;
              const isActive = activeSlide === feat.id;

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveSlide(feat.id)}
                  onMouseEnter={() => {
                    setActiveSlide(feat.id);
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-left group border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50/90 to-white border-[#3c8dbc]/70 shadow-md shadow-blue-500/10 ring-1 ring-blue-300'
                      : 'bg-white border-transparent hover:border-gray-200 hover:bg-slate-50/70'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${feat.gradient} text-white shadow-md shadow-blue-500/20 scale-105`
                      : 'bg-blue-50 border border-blue-200 text-[#3c8dbc] group-hover:bg-[#3c8dbc] group-hover:text-white'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-gray-400">
                        {feat.number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isActive ? 'bg-blue-100 text-[#3c8dbc] border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-base font-bold mb-1 transition-colors ${
                      isActive ? 'text-[#3c8dbc]' : 'text-gray-900 group-hover:text-[#3c8dbc]'
                    }`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KOLOM TENGAH (3-MONITOR PERSPECTIVE SHOWCASE GAYA IMAC STUDIO) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 w-full">
            <div 
              className="relative w-full max-w-[580px] sm:max-w-[650px] xl:max-w-[700px] select-none group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* 3D Perspective Trio Displays Container */}
              <div className="relative flex items-end justify-center min-h-[380px] xl:min-h-[420px] pb-3 pt-2">
                
                {/* 1. MONITOR KIRI (Tilted Angled Inward - Dashboard Tenant) */}
                <div 
                  className="absolute -left-6 md:-left-8 bottom-3 w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[-4px]"
                  style={{
                    transform: 'perspective(1000px) rotateY(24deg) scale(0.92)',
                    transformOrigin: 'right bottom',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))'
                  }}
                >
                  <div className="relative rounded-t-[14px] border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700 z-20"></div>
                    <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
                      <img
                        src="/images/showcase/dashboard-tenant.png"
                        alt="Dashboard Tenant Bandara Mozes Kilangin"
                        className="w-full h-full object-cover object-left-top"
                      />
                    </div>
                    <div className="h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                    </div>
                  </div>
                  <div className="w-9 h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                  <div className="w-24 h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                  <div className="w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
                </div>

                {/* 2. MONITOR TENGAH (Front-Facing, Layar Utama Terhubung ke Fitur Aktif) */}
                <div 
                  className="relative w-[70%] z-20 transition-all duration-500 group-hover:scale-[1.01]"
                  style={{
                    filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.32))'
                  }}
                >
                  <div className="relative rounded-t-[16px] border-[6px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-2xl flex flex-col">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 z-30 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-sky-400"></div>
                    </div>

                    {/* Screen Slides dengan Penjelasan Dinamis Sesuai Fitur yang Aktif */}
                    <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
                      {features.map((feat, idx) => (
                        <div
                          key={feat.id}
                          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          <img
                            src={feat.imageSrc}
                            alt={feat.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Keterangan Layar Glassmorphism */}
                          <div className="absolute inset-x-0 bottom-0 p-3.5 xl:p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent flex flex-col justify-end text-left z-20">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2.5 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${feat.gradient} shadow-xs`}>
                                {feat.category}
                              </span>
                              <span className="text-[8.5px] text-sky-200 font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/10">
                                {feat.tag}
                              </span>
                            </div>
                            <h4 className="text-white font-extrabold text-xs md:text-sm tracking-tight mb-0.5 drop-shadow-xs truncate">
                              {feat.title}
                            </h4>
                            <p className="text-slate-200 text-[9.5px] leading-tight line-clamp-2">
                              {feat.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-6 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-slate-600/70"></div>
                    </div>
                  </div>

                  <div className="w-14 h-8 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                  <div className="w-34 h-2.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-md border-b border-slate-400/50"></div>
                  <div className="w-42 h-2 bg-black/30 blur-sm rounded-full mx-auto -mt-1"></div>
                </div>

                {/* 3. MONITOR KANAN (Tilted Angled Inward - MARS GIS) */}
                <div 
                  className="absolute -right-6 md:-right-8 bottom-3 w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[4px]"
                  style={{
                    transform: 'perspective(1000px) rotateY(-24deg) scale(0.92)',
                    transformOrigin: 'left bottom',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))'
                  }}
                >
                  <div className="relative rounded-t-[14px] border-[5px] border-slate-900 bg-slate-900 overflow-hidden aspect-[16/10] shadow-xl flex flex-col">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700 z-20"></div>
                    <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
                      <img
                        src="/images/showcase/mars-gis.png"
                        alt="MARS GIS Airport Revenue System"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="h-5 bg-gradient-to-b from-[#e8ecef] via-[#dbe0e5] to-[#bcc5cc] border-t border-slate-400/40 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600/70"></div>
                    </div>
                  </div>
                  <div className="w-9 h-7 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 mx-auto -mt-0.5"></div>
                  <div className="w-24 h-2 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 rounded-[2px] mx-auto shadow-xs border-b border-slate-400/50"></div>
                  <div className="w-28 h-1.5 bg-black/25 blur-xs rounded-full mx-auto -mt-0.5"></div>
                </div>

              </div>

              {/* Soft Floor Shadow */}
              <div className="w-[88%] h-4 bg-black/20 blur-lg rounded-full mx-auto -mt-1.5"></div>

              {/* Navigasi Titik & Panah Desktop */}
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
                  {features.map((feat, idx) => (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx 
                          ? 'w-6 bg-[#3c8dbc] shadow-xs' 
                          : 'w-2 bg-blue-100 hover:bg-[#3c8dbc]/50 border border-blue-200'
                      }`}
                      aria-label={`Slide ${idx + 1}: ${feat.title}`}
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

          {/* KOLOM KANAN (FITUR 4, 5, 6) */}
          <div className="lg:col-span-3 flex flex-col gap-6 xl:gap-8 order-3">
            {features.slice(3, 6).map((feat) => {
              const IconComp = feat.icon;
              const isActive = activeSlide === feat.id;

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveSlide(feat.id)}
                  onMouseEnter={() => {
                    setActiveSlide(feat.id);
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-left group border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50/90 to-white border-[#3c8dbc]/70 shadow-md shadow-blue-500/10 ring-1 ring-blue-300'
                      : 'bg-white border-transparent hover:border-gray-200 hover:bg-slate-50/70'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${feat.gradient} text-white shadow-md shadow-blue-500/20 scale-105`
                      : 'bg-blue-50 border border-blue-200 text-[#3c8dbc] group-hover:bg-[#3c8dbc] group-hover:text-white'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-gray-400">
                        {feat.number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isActive ? 'bg-blue-100 text-[#3c8dbc] border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-base font-bold mb-1 transition-colors ${
                      isActive ? 'text-[#3c8dbc]' : 'text-gray-900 group-hover:text-[#3c8dbc]'
                    }`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
