"use client";

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plane,
  FileText,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { airportSlides } from './data';

export default function ServicesSection() {
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

  return (
    <section id="layanan" className="py-20 lg:py-24 bg-white border-b border-gray-200 scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Tengah Sesuai Gambar Referensi ApeTech */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-3">
            Fitur & Layanan Utama
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Fitur Unggulan Sistem MARS
          </h2>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Ekosistem digital terpadu untuk efisiensi operasional apron, transparansi tata kelola aset bandara, dan kepatuhan retribusi daerah secara akuntabel.
          </p>
        </div>

        {/* 3-Kolom: Kiri (3 Fitur), Tengah (3-Monitor Perspective Showcase Gaya iMac), Kanan (3 Fitur) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 xl:gap-8 items-center">
          
          {/* KOLOM KIRI (3 FITUR) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-6 sm:gap-6 lg:gap-9 order-2 lg:order-1">
            
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
              <div className="relative flex items-end justify-center min-h-[250px] sm:min-h-[340px] md:min-h-[400px] pb-2 sm:pb-3 pt-1 sm:pt-2">
                
                {/* 1. MONITOR KIRI (Tilted Angled Inward - Dashboard Tenant) */}
                <div 
                  className="absolute -left-1 sm:-left-6 md:-left-8 bottom-2 sm:bottom-3 w-[46%] sm:w-[48%] md:w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[-4px]"
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
                    
                    {/* Screen: Dashboard Tenant */}
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
                  className="relative w-[76%] sm:w-[72%] md:w-[70%] z-20 transition-all duration-500 group-hover:scale-[1.01]"
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
                              <span className="px-2.5 py-0.5 rounded-md text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider bg-[#3c8dbc] text-white shadow-xs">
                                {slide.category}
                              </span>
                              <span className="text-[7.5px] sm:text-[8.5px] text-sky-200 font-medium bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/10">
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
                  className="absolute -right-1 sm:-right-6 md:-right-8 bottom-2 sm:bottom-3 w-[46%] sm:w-[48%] md:w-[46%] z-10 transition-transform duration-500 group-hover:translate-x-[4px]"
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

                    {/* Screen: MARS GIS */}
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
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-6 sm:gap-6 lg:gap-9 order-3">
            
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
                  Audit & Rekonsiliasi
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
  );
}
