"use client";

import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { newsData, NewsItem } from './data';

export default function NewsSection() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Karakteristik rounded adaptif:
  // - Mobile/Tablet (< lg): rounded-2xl sm:rounded-3xl untuk kartu individual yang rapi
  // - Desktop (lg+): Rounded khas referensi desain:
  //   * Baris 1: Card 0 (Kiri Atas) rounded-tl, Card 1 (Tengah) rounded-none, Card 2 (Kanan Atas) rounded-tr
  //   * Baris 2: Card 3 (Kiri Bawah) rounded-bl, Card 4 (Tengah) rounded-none, Card 5 (Kanan Bawah) rounded-br
  const getCardRounding = (index: number) => {
    switch (index) {
      case 0:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none lg:rounded-tl-[42px]';
      case 1:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none';
      case 2:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none lg:rounded-tr-[42px]';
      case 3:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none lg:rounded-bl-[42px]';
      case 4:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none';
      case 5:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none lg:rounded-br-[42px]';
      default:
        return 'rounded-2xl sm:rounded-3xl lg:rounded-none';
    }
  };

  return (
    <>
      <section id="berita" className="py-14 sm:py-20 bg-white border-b border-gray-200 scroll-mt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section: Title Kiri & Tombol Pill 'READ MORE ->' Kanan Sesuai Gambar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c3948] tracking-tight">
                News &amp; Promotion
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Kabar terbaru, pengumuman operasional, dan info fasilitas di Bandara Mozes Kilangin
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setSelectedNews(newsData[0])}
              className="self-start sm:self-center inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-gray-400 hover:border-[#0c3948] text-gray-700 hover:text-[#0c3948] text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs hover:bg-gray-50"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid Layout: 1 kolom di mobile, 2 kolom di tablet (sm/md), 3 kolom di desktop (lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {newsData.map((item, idx) => (
              <article
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className={`group relative aspect-square w-full ${getCardRounding(idx)} overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900 flex flex-col justify-between`}
              >
                {/* Background Image Full Bleed */}
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Gradient Proteksi Kontras Teks Bersih (Tanpa Splash Biru) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

                {/* Bagian Atas: Kategori Pill Badge Minimalis */}
                <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/45 backdrop-blur-md text-white/95 border border-white/20 shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Badge Khusus Tengah (Persis Card 3 pada Gambar Referensi: Travel Advisory) */}
                {item.id === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-5">
                    <div className="border-2 border-white rounded-full px-5 py-2 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase backdrop-blur-[2px] bg-black/20 shadow-sm text-center">
                      TRAVEL ADVISORY
                    </div>
                  </div>
                )}

                {/* Bagian Bawah: Tanggal & Judul Berita (Sesuai Referensi Gambar) */}
                <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end">
                  <span className="text-xs sm:text-[13px] font-medium text-white/80 mb-1.5 drop-shadow-sm">
                    {item.date}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 drop-shadow-sm group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* POPUP MODAL DETAIL BERITA */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Gambar Modal: Bersih Tanpa Teks Menutupi Gambar */}
            <div className="relative h-48 sm:h-64 md:h-72 w-full shrink-0 overflow-hidden bg-slate-900">
              <img 
                src={selectedNews.imageSrc} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Tombol Tutup X */}
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Isi Konten Modal di Bawah Gambar */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-3.5 sm:gap-4">
              {/* Kategori & Tanggal */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#3c8dbc]">
                  {selectedNews.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">
                  {selectedNews.date}
                </span>
              </div>

              {/* Judul Berita */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {selectedNews.title}
              </h3>

              {/* Ringkasan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {selectedNews.summary}
                </p>
              </div>

              {/* Konten Lengkap */}
              <div className="text-sm text-gray-600 leading-relaxed space-y-3.5">
                <p>{selectedNews.content}</p>
                <p>
                  Melalui sistem digitalisasi terpadu MARS, koordinasi antara pihak maskapai, operator perintis, serta tenant komersial dapat terus berlangsung transparan dan akuntabel guna mendukung kelancaran transportasi udara di Kabupaten Mimika dan Papua Tengah.
                </p>
              </div>

              {/* Footer Tombol Tutup */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
