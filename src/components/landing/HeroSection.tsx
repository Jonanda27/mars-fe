"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroVideoSlides } from './data';

export default function HeroSection() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fungsi ganti slide dengan efek transisi hitam cepat & mulus di background
  const switchHeroSlide = (nextIndex: number) => {
    if (isTransitioning || nextIndex === currentHeroSlide) return;
    setIsTransitioning(true);

    // 1. Fade ke hitam cepat (250ms)
    setTimeout(() => {
      setCurrentHeroSlide(nextIndex);

      // 2. Jeda singkat (80ms) agar swap video mulus tanpa terasa lama
      setTimeout(() => {
        // 3. Fade in kembali menampilkan video berikutnya
        setIsTransitioning(false);
      }, 80);
    }, 250);
  };

  // Efek berganti slide: putar video yang aktif dari awal, pause video lain
  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === currentHeroSlide) {
        videoEl.currentTime = 0;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.pause();
      }
    });
  }, [currentHeroSlide]);

  // Ketika video selesai durasinya -> otomatis panggil switchHeroSlide
  const handleVideoEnded = (idx: number) => {
    if (idx === currentHeroSlide && !isTransitioning) {
      switchHeroSlide((idx + 1) % heroVideoSlides.length);
    }
  };

  const prevHeroSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    switchHeroSlide((currentHeroSlide - 1 + heroVideoSlides.length) % heroVideoSlides.length);
  };

  const nextHeroSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    switchHeroSlide((currentHeroSlide + 1) % heroVideoSlides.length);
  };

  return (
    <section 
      id="beranda"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-slate-950 text-white select-none"
    >
      {/* Video Background Slides dengan Transisi Opacity Halus & Auto-Next saat Video Habis */}
      {heroVideoSlides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out overflow-hidden ${
            currentHeroSlide === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => handleVideoEnded(idx)}
            className="w-full h-full object-cover object-top"
          >
            <source src={slide.videoSrc} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* Lapisan Gradient Gelap Halus untuk Kontras Teks Bersih */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/75 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 z-[1]" />

      {/* Quick Smooth Dark Overlay: Transisi hitam cepat di background */}
      <div 
        className={`absolute inset-0 bg-black z-[2] transition-opacity duration-300 ease-in-out pointer-events-none ${
          isTransitioning ? 'opacity-90' : 'opacity-0'
        }`} 
      />

      {/* Efek Gradasi Kabut Putih di Bagian Bawah (Sesuai Referensi Gambar) */}
      <div className="absolute bottom-0 inset-x-0 h-28 sm:h-44 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none z-10" />

      {/* Tombol Navigasi Panah Kiri (<) */}
      <button
        type="button"
        onClick={prevHeroSlide}
        disabled={isTransitioning}
        className="absolute left-3 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/35 hover:bg-black/65 text-white border border-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Tombol Navigasi Panah Kanan (>) */}
      <button
        type="button"
        onClick={nextHeroSlide}
        disabled={isTransitioning}
        className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/35 hover:bg-black/65 text-white border border-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Konten Utama Hero: Penempatan & Tipografi Sama Persis (Oswald Font, Single-Line, Centered Block) */}
      <div className="relative z-10 w-full px-6 sm:px-12 pb-24 sm:pb-28 lg:pb-32 flex justify-center items-center select-none">
        <div className="flex flex-col items-start text-left w-fit max-w-full">
          <span 
            className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-normal text-white tracking-normal mb-1 leading-tight"
            style={{ 
              fontFamily: 'var(--font-oswald), "Oswald", "Arial Narrow", sans-serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.8)' 
            }}
          >
            Welcome to
          </span>
          <h1 
            className="text-2xl sm:text-4xl md:text-[40px] lg:text-[46px] xl:text-[50px] font-bold text-white uppercase tracking-[0.02em] leading-none whitespace-nowrap"
            style={{ 
              fontFamily: 'var(--font-oswald), "Oswald", "Arial Narrow", sans-serif',
              textShadow: '0 3px 6px rgba(0, 0, 0, 0.95), 0 0 3px rgba(0, 0, 0, 0.85)' 
            }}
          >
            MIMIKA AIRPORT REVENUE SYSTEM
          </h1>
        </div>
      </div>

      {/* Indikator Titik Slide (Titik Bulat Bersih Seperti Gambar) */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroVideoSlides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => switchHeroSlide(idx)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentHeroSlide === idx
                ? 'bg-[#00c5ff] shadow-[0_0_10px_rgba(0,197,255,0.9)] scale-110'
                : 'bg-white/70 hover:bg-white'
            }`}
            aria-label={`Pindah ke slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
