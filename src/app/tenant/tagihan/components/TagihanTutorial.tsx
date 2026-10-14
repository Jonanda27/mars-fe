"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, CheckCircle2, 
  Banknote, Upload, FileText, Check, BookOpen, Info, 
  Layers, FileCheck, ShieldCheck, CreditCard
} from 'lucide-react';

export interface TagihanTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'tour' | 'guide';
}

interface TourStep {
  selector?: string;
  badge: string;
  title: string;
  description: string;
  tip?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GuideStepDetail {
  number: number;
  title: string;
  actor: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  details: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="tour-tagihan-filter"]',
    badge: 'Langkah 1 dari 5',
    title: 'Kategori & Filter Tagihan e-SKRD',
    description: 'Bilah tab ini memfilter seluruh ketetapan retribusi berdasarkan jenis layanan: Sewa Hanggar, Sewa Ruangan, Mini Airport, dan SKRD Denda. Anda juga dapat mencari nomor SKRD atau nama kontrak secara instan melalui kolom pencarian.',
    tip: 'Angka di dalam kurung menunjukkan jumlah surat ketetapan retribusi aktif pada masing-masing kategori.',
    icon: Layers,
  },
  {
    selector: '[data-tour="tour-tagihan-card-header"]',
    badge: 'Langkah 2 dari 5',
    title: 'Nomor SKRD & Status Pembayaran',
    description: 'Setiap lembar tagihan memiliki Nomor SKRD resmi daerah dan status penagihan: Belum Bayar (Unpaid), Menunggu Verifikasi, atau Lunas (Paid). Perhatikan tanggal jatuh tempo (Due Date) untuk menghindari sanksi administratif keterlambatan.',
    tip: 'Keterlambatan pembayaran dikenakan sanksi denda administratif 1% per bulan kalender sesuai ketentuan Perbup Mimika No. 25/2024.',
    icon: FileText,
  },
  {
    selector: '[data-tour="tour-tagihan-detail"]',
    badge: 'Langkah 3 dari 5',
    title: 'Rincian Objek & Nilai Retribusi',
    description: 'Bagian ini memuat objek sewa (unit hanggar, armada pesawat, atau nomor ruangan), durasi sewa, tarif dasar retribusi daerah, serta sisa total kewajiban yang wajib disetorkan. Anda dapat mengklik tombol "Lihat e-SKRD" untuk membuka naskah SKRD resmi berformat PDF.',
    tip: 'Dokumen e-SKRD dilengkapi barcode verifikasi yang sah dari Badan Pendapatan Daerah / UPBU Bandara.',
    icon: Banknote,
  },
  {
    selector: '[data-tour="tour-tagihan-btn-upload"]',
    badge: 'Langkah 4 dari 5',
    title: 'Unggah Bukti Setor / Transfer Bank',
    description: 'Lakukan penyetoran retribusi via transfer ke rekening Kas Daerah (Bank Papua). Setelah transfer berhasil, klik tombol hijau "Upload Bukti Bayar", pilih bank pengirim, masukkan nominal, dan unggah slip/struk transfer PDF atau gambar.',
    tip: 'Sistem MARS dilengkapi pembaca OCR otomatis untuk mencocokkan nominal dan nomor referensi transfer bank secara cepat.',
    icon: Upload,
  },
  {
    selector: '[data-tour="tour-tagihan-btn-ssrd"], [data-tour="tour-tagihan-card-actions"]',
    badge: 'Langkah 5 dari 5',
    title: 'Bukti Sah Setoran Daerah (e-SSRD)',
    description: 'Setelah Bendahara Penerimaan memvalidasi setoran Anda, status tagihan otomatis berubah menjadi "Lunas". Anda dapat mengunduh dokumen Surat Setoran Retribusi Daerah (e-SSRD) resmi sebagai bukti sah penyetoran retribusi daerah.',
    tip: 'Dokumen e-SSRD merupakan bukti resmi setoran kasda yang sah untuk lampiran audit akuntansi perusahaan Anda.',
    icon: CheckCircle2,
  },
];

const GUIDE_STEPS: GuideStepDetail[] = [
  {
    number: 1,
    title: 'Penerbitan Surat Ketetapan Retribusi (e-SKRD)',
    actor: 'Admin UPBU & Sistem MARS',
    status: 'Penerbitan Tagihan',
    icon: FileText,
    description: 'Setelah kontrak sewa atau layanan operasional disetujui, sistem menerbitkan Surat Ketetapan Retribusi Daerah (e-SKRD) resmi dengan nomor seri unik daerah.',
    details: [
      'Penerbitan dokumen e-SKRD dengan rincian objek dan tarif dasar retribusi.',
      'Penetapan batas tanggal jatuh tempo pembayaran (Due Date).',
      'Dokumen resmi e-SKRD dapat diunduh langsung dalam format PDF ber-barcode.'
    ]
  },
  {
    number: 2,
    title: 'Penghitungan Nilai & Penyetoran Bank',
    actor: 'Mitra Tenant',
    status: 'Pembayaran Setoran',
    icon: Banknote,
    description: 'Mitra memeriksa total tagihan retribusi dan melakukan transfer pembayaran ke Rekening Kas Daerah (Kasda) Pemerintah Kabupaten Mimika di Bank Papua.',
    details: [
      'Rekening tujuan: Kas Daerah (Bank Papua).',
      'Penyetoran dapat dilakukan via Teller Bank, ATM, atau Internet Banking.',
      'Simpan bukti transfer / struk setor cetak atau tangkapan layar digital.'
    ]
  },
  {
    number: 3,
    title: 'Unggah Bukti Setor di Sistem MARS',
    actor: 'Mitra Tenant',
    status: 'Upload Bukti',
    icon: Upload,
    description: 'Mitra mengunggah bukti transfer melalui tombol "Upload Bukti Bayar" pada kartu tagihan yang bersangkutan.',
    details: [
      'Klik tombol "Upload Bukti Bayar" pada tagihan berstatus Unpaid.',
      'Pilih metode pembayaran dan masukkan nominal yang ditransfer.',
      'Unggah berkas bukti bayar (PDF, JPG, PNG maksimal 5 MB).',
      'Sistem melakukan pra-pemeriksaan otomatis menggunakan OCR.'
    ]
  },
  {
    number: 4,
    title: 'Verifikasi oleh Bendahara Penerimaan',
    actor: 'Bendahara Penerimaan UPBU',
    status: 'Validasi Mutasi Bank',
    icon: ShieldCheck,
    description: 'Bendahara Penerimaan UPBU mencocokkan mutasi rekening koran korporat Bank Papua dengan bukti bayar yang diunggah mitra.',
    details: [
      'Pencocokan nomor rekening, nama pengirim, dan nilai setoran.',
      'Proses verifikasi umumnya tuntas dalam rentang 1x24 jam kerja.',
      'Status tagihan otomatis berubah menjadi "Lunas" (Paid) seketika disetujui.'
    ]
  },
  {
    number: 5,
    title: 'Penerbitan Surat Setoran Retribusi (e-SSRD)',
    actor: 'Sistem MARS & Bendahara',
    status: 'Lunas & Bukti Sah',
    icon: CheckCircle2,
    description: 'Sistem menerbitkan dokumen Surat Setoran Retribusi Daerah (e-SSRD) Lampiran III Perbup Mimika No. 25/2024 sebagai bukti sah pelunasan retribusi daerah.',
    details: [
      'Tombol "Lihat e-SSRD" muncul otomatis pada kartu tagihan lunas.',
      'Dokumen resmi e-SSRD berkekuatan hukum penuh dan dapat dicetak kapan saja.',
      'Pelunasan tagihan menjadi prasyarat pembukaan akses izin operasional penuh di bandara.'
    ]
  }
];

export function TagihanTutorial({
  isOpen,
  onClose,
  defaultMode = 'tour',
}: TagihanTutorialProps) {
  const [mode, setMode] = useState<'tour' | 'guide'>(defaultMode);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [activeGuideStep, setActiveGuideStep] = useState(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setActiveTourIndex(0);
      setActiveGuideStep(1);
    }
  }, [isOpen, defaultMode]);

  // Cleanup tracking animation on unmount
  useEffect(() => {
    return () => {
      if (trackingRef.current) cancelAnimationFrame(trackingRef.current);
    };
  }, []);

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOUR_STEPS.length - 1, index));
    setActiveTourIndex(clamped);
  }, []);

  // Smooth scroll langsung memusatkan elemen target yang di-highlight pada container <main>
  const scrollToElement = useCallback((el: Element) => {
    // 1. Browser native scrollIntoView (secara otomatis mencari scroll container seperti <main>)
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } catch {
      // Fallback
    }

    // 2. Eksplisit scroll pada <main> jika ada
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const elRect = el.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      const currentScrollTop = mainEl.scrollTop;
      const elOffsetTop = elRect.top - mainRect.top + currentScrollTop;
      const targetScrollTop = Math.max(0, elOffsetTop - (mainEl.clientHeight - elRect.height) / 2);

      mainEl.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }

    // 3. Fallback window.scrollTo
    const rect = el.getBoundingClientRect();
    const elPageTop = rect.top + window.scrollY;
    const targetScrollY = Math.max(0, elPageTop - (window.innerHeight - rect.height) / 2);
    if (Math.abs(window.scrollY - targetScrollY) > 10) {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  }, []);

  // Animasi tracking 60fps mengikuti pergerakan scroll elemen secara real-time
  const startTracking = useCallback((targetEl: Element) => {
    if (trackingRef.current) {
      cancelAnimationFrame(trackingRef.current);
    }
    const startTime = Date.now();
    const duration = 800; // Selama animasi smooth scroll berlangsung

    const tick = () => {
      if (!isOpen) return;
      setTargetRect(targetEl.getBoundingClientRect());
      if (Date.now() - startTime < duration) {
        trackingRef.current = requestAnimationFrame(tick);
      } else {
        trackingRef.current = null;
      }
    };

    trackingRef.current = requestAnimationFrame(tick);
  }, [isOpen]);

  // Update target rect & trigger scroll on step change
  const updateTargetRect = useCallback(() => {
    if (!isOpen || mode !== 'tour') return;
    const step = TOUR_STEPS[activeTourIndex];
    if (step?.selector) {
      const tryFind = () => {
        const el = document.querySelector(step.selector!);
        if (el) {
          scrollToElement(el);
          startTracking(el);
          return true;
        }
        return false;
      };

      if (!tryFind()) {
        const t0 = setTimeout(tryFind, 50);
        const t1 = setTimeout(tryFind, 150);
        return () => {
          clearTimeout(t0);
          clearTimeout(t1);
        };
      }

      const t1 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 100);
      const t2 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setTargetRect(null);
  }, [isOpen, mode, activeTourIndex, scrollToElement, startTracking]);

  useEffect(() => {
    const timerCleanup = updateTargetRect();
    const mainEl = document.querySelector('main');

    const handleScrollOrResize = () => {
      const step = TOUR_STEPS[activeTourIndex];
      if (step?.selector) {
        const el = document.querySelector(step.selector);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };

    if (mainEl) {
      mainEl.addEventListener('scroll', handleScrollOrResize, { passive: true });
    }
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });

    return () => {
      if (typeof timerCleanup === 'function') timerCleanup();
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScrollOrResize);
      }
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true } as any);
    };
  }, [updateTargetRect, activeTourIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (mode === 'tour') {
        if (e.key === 'ArrowRight' && activeTourIndex < TOUR_STEPS.length - 1) {
          goToStep(activeTourIndex + 1);
        } else if (e.key === 'ArrowLeft' && activeTourIndex > 0) {
          goToStep(activeTourIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, activeTourIndex, onClose, goToStep]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[activeTourIndex];
  const StepIcon = currentStep?.icon || Sparkles;

  // ==========================================
  // RENDER GUIDE MODAL (BUKU PANDUAN TAGIHAN)
  // ==========================================
  if (mode === 'guide') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          
          {/* Header Modal */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-[#205081] to-[#3c8dbc] text-white flex items-center justify-between border-b border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shadow-inner">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                  Buku Panduan: Pembayaran Retribusi e-SKRD
                  <span className="text-[11px] font-medium bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Bandara Mozes Kilangin
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Petunjuk alur penetapan retribusi daerah, transfer bank, hingga penerbitan bukti lunas e-SSRD
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('tour')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-white/20"
                title="Mulai tur spotlight di formulir ini"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Kembali ke Tur di Halaman
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Tutup panduan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Selector Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[640px] gap-2">
              {GUIDE_STEPS.map((s) => {
                const isSelected = activeGuideStep === s.number;
                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => setActiveGuideStep(s.number)}
                    className={`flex-1 p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-white border-[#3c8dbc] shadow-xs ring-2 ring-blue-100'
                        : 'bg-slate-100/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#3c8dbc] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {s.number}
                    </div>
                    <div className="truncate">
                      <span className="text-[11px] font-bold text-slate-800 block truncate leading-tight">
                        {s.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {s.actor}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Detail Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
            {(() => {
              const currentDetail = GUIDE_STEPS.find(s => s.number === activeGuideStep) || GUIDE_STEPS[0];
              const IconComp = currentDetail.icon;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                          Tahapan {currentDetail.number} dari {GUIDE_STEPS.length}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base">
                          {currentDetail.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Penanggung Jawab:</span>
                      <span className="text-xs font-bold text-slate-700">{currentDetail.actor}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentDetail.description}
                  </p>

                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                    <div className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Poin Penting Tahapan {currentDetail.number}:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                      {currentDetail.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Navigation between steps */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={activeGuideStep <= 1}
                      onClick={() => setActiveGuideStep(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Langkah Sebelumnya
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      Langkah {activeGuideStep} dari {GUIDE_STEPS.length}
                    </span>

                    {activeGuideStep < GUIDE_STEPS.length ? (
                      <button
                        type="button"
                        onClick={() => setActiveGuideStep(prev => Math.min(GUIDE_STEPS.length, prev + 1))}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Langkah Berikutnya <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Selesai Panduan
                      </button>
                    )}
                  </div>

                </div>
              );
            })()}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>Catatan Keuangan:</strong> Seluruh pembayaran retribusi bandara disetorkan langsung ke Kas Daerah Kabupaten Mimika melalui rekening resmi Bank Papua. Jangan melakukan pembayaran ke rekening perorangan.
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('tour')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Mulai Tur Spotlight di Halaman
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              Tutup Panduan
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER SPOTLIGHT TOUR MODE (SMART NON-OVERLAPPING PLACEMENT)
  // ==========================================
  const isCentered = !targetRect;

  let popoverStyle: React.CSSProperties = {};
  if (targetRect) {
    const cardWidth = Math.min(420, window.innerWidth - 32);
    const popoverHeight = popoverRef.current?.offsetHeight || 280;
    const margin = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Ruang di sekeliling elemen yang di-highlight
    const spaceBelow = vh - targetRect.bottom - margin;
    const spaceAbove = targetRect.top - margin;
    const spaceRight = vw - targetRect.right - margin;
    const spaceLeft = targetRect.left - margin;

    let top = 0;
    let left = 0;

    // 1. Jika ruang bawah cukup (>= popoverHeight + 8), taruh di BAWAH elemen
    if (spaceBelow >= popoverHeight + 8) {
      top = targetRect.bottom + 12;
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = targetRect.right - cardWidth;
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
    }
    // 2. Jika ruang bawah sempit tapi ruang atas cukup (>= popoverHeight + 8), taruh di ATAS elemen
    else if (spaceAbove >= popoverHeight + 8) {
      top = targetRect.top - popoverHeight - 12;
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = targetRect.right - cardWidth;
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
    }
    // 3. Jika ruang di samping kanan luas (desktop multi-kolom), taruh di samping kanan
    else if (vw >= 960 && spaceRight >= cardWidth + 8) {
      left = targetRect.right + 12;
      top = Math.max(margin, Math.min(targetRect.top, vh - popoverHeight - margin));
    }
    // 4. Jika ruang di samping kiri luas, taruh di samping kiri
    else if (vw >= 960 && spaceLeft >= cardWidth + 8) {
      left = targetRect.left - cardWidth - 12;
      top = Math.max(margin, Math.min(targetRect.top, vh - popoverHeight - margin));
    }
    // 5. Fallback vertikal: pilih yang paling lapang (bawah vs atas)
    else if (spaceBelow >= spaceAbove) {
      top = targetRect.bottom + 8;
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
    } else {
      top = Math.max(margin, targetRect.top - popoverHeight - 8);
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
    }

    // CLAMPING KETAT: Popover TIDAK BOLEH PERNAH terpotong di tepi layar
    top = Math.max(12, Math.min(top, vh - popoverHeight - 12));
    left = Math.max(12, Math.min(left, vw - cardWidth - 12));

    popoverStyle = {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${cardWidth}px`,
      zIndex: 9999,
    };
  }

  return (
    <div className="fixed inset-0 z-[9990] select-none pointer-events-auto">
      {/* SVG Spotlight Mask */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9991]">
        <defs>
          <mask id="tagihan-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
                style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.72)"
          mask="url(#tagihan-spotlight-mask)"
        />
      </svg>

      {/* Target Element Glowing & Pulsing Ring Highlight */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-[9992] rounded-xl ring-4 ring-[#3c8dbc] ring-offset-2 ring-offset-transparent shadow-[0_0_25px_rgba(60,141,188,0.7)] animate-pulse transition-all duration-300 ease-out"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
        />
      )}

      {/* Transparent Click Interceptor */}
      <div className="fixed inset-0 z-[9993] cursor-default" />

      {/* Tour Popover Card */}
      <div
        ref={popoverRef}
        style={isCentered ? undefined : popoverStyle}
        className={
          isCentered
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92vw] max-w-md transition-all duration-300 ease-out"
            : "z-[9999] transition-all duration-300 ease-out"
        }
      >
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#205081] to-[#3c8dbc] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <StepIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-100 block">
                  {currentStep.badge}
                </span>
                <h4 className="font-bold text-sm text-white leading-tight">
                  {currentStep.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Tutup tutorial"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-3.5 space-y-2.5 text-xs text-slate-700">
            <p className="leading-relaxed">
              {currentStep.description}
            </p>

            {currentStep.tip && (
              <div className="p-2 bg-blue-50/90 border border-blue-200/80 rounded-lg flex items-start gap-2 text-blue-900">
                <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="leading-tight text-[11px]">
                  <strong>Tips:</strong> {currentStep.tip}
                </span>
              </div>
            )}

            {/* Stepper Dots (5 Langkah) */}
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeTourIndex
                      ? 'w-6 bg-[#3c8dbc]'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Ke langkah ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('guide')}
                className="text-[11px] text-[#3c8dbc] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Buku Panduan
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTourIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goToStep(activeTourIndex - 1)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
              )}

              {activeTourIndex < TOUR_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeTourIndex + 1)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  Selanjutnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Selesai Tutorial
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
