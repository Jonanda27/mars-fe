"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, CheckCircle2, 
  Building2, Plane, FileText, PenTool, CreditCard, 
  Download, Upload, Clock, Loader2, ShieldCheck, MapPin, 
  Printer, Info, Check, BookOpen, AlertCircle, Send, FileCheck
} from 'lucide-react';

export interface BuatPermohonanTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'tour' | 'guide';
  currentTourIndex?: number;
  onTourIndexChange?: (index: number) => void;
}

interface TourStep {
  selector?: string;
  badge: string;
  title: string;
  description: string;
  tip?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  // ==========================================
  // PANDUAN LANGKAH 1: UNGGAH SURAT PERMOHONAN RESMI (6 STEP)
  // ==========================================
  {
    selector: '[data-tour="tour-stepper"]',
    badge: 'Langkah 1 dari 6',
    title: 'Indikator Tahapan Permohonan Sewa',
    description: 'Bilah indikator tahapan ini menunjukkan alur lengkap proses permohonan sewa. Saat ini Anda berada di Langkah 1: Unggah Surat Permohonan Resmi. Tahapan berikutnya akan aktif secara otomatis setelah permohonan diverifikasi oleh pihak bandara.',
    tip: 'Langkah 1 adalah tahapan awal yang wajib diselesaikan oleh mitra penyewa.',
    icon: Sparkles,
  },
  {
    selector: '[data-tour="tour-jenis-layanan"]',
    badge: 'Langkah 2 dari 6',
    title: 'Pilih Jenis Layanan Fasilitas',
    description: 'Pilih kategori fasilitas yang ingin disewa: Sewa Hanggar (penyimpanan & pemeliharaan pesawat), Sewa Apron (parkir pesawat terbuka), atau Sewa Ruangan (kantor/gudang operasional mitra di area bandara).',
    tip: 'Pilihan jenis layanan menentukan draf template surat resmi dan ketentuan verifikasi teknis yang akan diproses.',
    icon: Building2,
  },
  {
    selector: '[data-tour="tour-perihal"]',
    badge: 'Langkah 3 dari 6',
    title: 'Tentukan Perihal Surat Permohonan',
    description: 'Tuliskan perihal permohonan secara jelas dan formal, misalnya: "Permohonan Sewa Hanggar Bandara Mozes Kilangin untuk Periode Tahun 2026".',
    tip: 'Perihal ini akan tercantum pada berkas surat resmi dan menjadi rujukan administrasi bagi pimpinan bandara.',
    icon: FileText,
  },
  {
    selector: '[data-tour="tour-template-pdf"]',
    badge: 'Langkah 4 dari 6',
    title: 'Draf Surat Otomatis (Unduh PDF)',
    description: 'Belum memiliki format surat permohonan? Klik tombol "Unduh Draft PDF". Sistem MARS akan otomatis membuatkan draf surat resmi berformat standar yang sudah terisi dengan data identitas badan usaha Anda.',
    tip: 'Cetak draf PDF tersebut, bubuhkan tanda tangan basah pimpinan dan stempel perusahaan, lalu scan menjadi dokumen PDF.',
    icon: Download,
  },
  {
    selector: '[data-tour="tour-upload-surat"]',
    badge: 'Langkah 5 dari 6',
    title: 'Unggah Berkas Scan Surat Resmi',
    description: 'Unggah scan surat permohonan resmi ber-Kop Surat yang sudah ditandatangani dan distempel basah (format PDF, ukuran maksimal 5 MB). Berkas ini akan dievaluasi langsung oleh Kepala Dinas.',
    tip: 'Pastikan hasil scan tajam dan cap stempel terbaca jelas agar verifikasi dapat disetujui lebih cepat.',
    icon: Upload,
  },
  {
    selector: '[data-tour="tour-btn-kirim"]',
    badge: 'Langkah 6 dari 6',
    title: 'Kirim Permohonan Resmi',
    description: 'Setelah seluruh data terisi lengkap dan berkas scan surat terunggah, klik tombol "Kirim Permohonan" untuk mendaftarkan permohonan resmi Anda ke UPBU Bandara Mozes Kilangin dan memperoleh Nomor Registrasi Tiket unik.',
    tip: 'Dengan mengklik tombol ini, tutorial pengisian Langkah 1 telah selesai. Klik "Selesai Tutorial" di bawah untuk menutup panduan.',
    icon: Send,
  },
];

const FORM_STEPS_DATA = [
  {
    number: 1,
    title: 'Indikator Tahapan Permohonan',
    actor: 'Sistem MARS',
    status: 'Langkah 1 dari 6',
    icon: Sparkles,
    description: 'Bilah tahapan di bagian atas menampilkan posisi Anda dalam proses permohonan sewa. Tahapan dimulai dari Langkah 1 (Upload Surat) hingga selesai kontrak aktif.',
    details: [
      'Memahami posisi saat ini di Langkah 1: Unggah Surat Permohonan Resmi.',
      'Tahapan berikutnya (Verifikasi Kadis, Kontrak, dll.) akan aktif bertahap setelah pengajuan surat disetujui.',
      'Seluruh riwayat dan progres tahapan dapat dipantau langsung di sistem.'
    ]
  },
  {
    number: 2,
    title: 'Pilih Jenis Layanan Fasilitas',
    actor: 'Mitra Tenant',
    status: 'Input Formulir',
    icon: Building2,
    description: 'Pilih kategori fasilitas kebandarudaraan yang ingin disewa sesuai kebutuhan operasional maskapai/badan usaha Anda.',
    details: [
      'Sewa Hanggar: Penyimpanan dan pemeliharaan armada pesawat.',
      'Sewa Apron: Area parkir terbuka (open parking) untuk armada pesawat.',
      'Sewa Ruangan: Perkantoran atau gudang operasional mitra di lingkungan bandara.'
    ]
  },
  {
    number: 3,
    title: 'Tentukan Perihal Surat Permohonan',
    actor: 'Mitra Tenant',
    status: 'Input Formulir',
    icon: FileText,
    description: 'Ketik perihal permohonan yang spesifik dan formal sebagai rujukan administrasi bagi pimpinan UPBU Bandara Mozes Kilangin.',
    details: [
      'Gunakan format perihal yang baku dan jelas (cth: "Permohonan Sewa Hanggar Bandara Mozes Kilangin...").',
      'Cantumkan fasilitas dan periode sewa yang diinginkan.',
      'Perihal ini otomatis tercantum pada lembar draf surat resmi.'
    ]
  },
  {
    number: 4,
    title: 'Draf Surat Otomatis (Unduh PDF)',
    actor: 'Mitra Tenant & Sistem MARS',
    status: 'Bantuan Sistem',
    icon: Download,
    description: 'Jika belum memiliki format surat resmi sendiri, sistem MARS menyediakan fitur unduh draf surat PDF yang otomatis terisi dengan data profil perusahaan Anda.',
    details: [
      'Klik tombol "Unduh Draft PDF" untuk mengunduh naskah standar resmi.',
      'Cetak dokumen tersebut pada kop surat resmi perusahaan.',
      'Bubuhkan tanda tangan basah pimpinan dan cap stempel resmi perusahaan.'
    ]
  },
  {
    number: 5,
    title: 'Unggah Berkas Scan Surat Resmi',
    actor: 'Mitra Tenant',
    status: 'Wajib Diunggah',
    icon: Upload,
    description: 'Unggah scan dokumen surat permohonan resmi ber-Kop Surat yang telah ditandatangani dan distempel basah oleh pimpinan perusahaan.',
    details: [
      'Format dokumen wajib PDF dengan ukuran maksimal 5 MB.',
      'Pastikan hasil scan tajam, jernih, dan cap stempel terlihat sempurna.',
      'Dokumen ini menjadi dasar legalitas evaluasi persetujuan oleh Kepala Kantor UPBU.'
    ]
  },
  {
    number: 6,
    title: 'Kirim Permohonan Resmi',
    actor: 'Mitra Tenant',
    status: 'Selesai Langkah 1',
    icon: Send,
    description: 'Klik tombol "Kirim Permohonan" untuk mendaftarkan pengajuan Anda ke sistem bandara dan memperoleh Nomor Registrasi Tiket unik.',
    details: [
      'Formulir dan berkas surat resmi terkirim ke sistem MARS.',
      'Sistem menerbitkan Nomor Registrasi Tiket unik (contoh: SEWA-2026-0089).',
      'Setelah pengiriman berhasil, panduan Langkah 1 selesai dan permohonan berpindah ke antrean Verifikasi Kepala Dinas.'
    ]
  }
];

export function BuatPermohonanTutorial({
  isOpen,
  onClose,
  defaultMode = 'tour',
  currentTourIndex,
  onTourIndexChange,
}: BuatPermohonanTutorialProps) {
  const [mode, setMode] = useState<'tour' | 'guide'>(defaultMode);
  const [internalTourIndex, setInternalTourIndex] = useState(0);
  const [activeStepDetail, setActiveStepDetail] = useState(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const activeIndex = currentTourIndex !== undefined ? currentTourIndex : internalTourIndex;

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOUR_STEPS.length - 1, index));
    setInternalTourIndex(clamped);
    onTourIndexChange?.(clamped);
  }, [onTourIndexChange]);

  // Sync mode with prop
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      if (currentTourIndex !== undefined) {
        setInternalTourIndex(currentTourIndex);
      } else {
        setInternalTourIndex(0);
      }
    }
  }, [isOpen, defaultMode, currentTourIndex]);

  // Recalculate target element position for tour mode
  const updateTargetRect = useCallback(() => {
    if (!isOpen || mode !== 'tour') return;
    const step = TOUR_STEPS[activeIndex];
    if (step?.selector) {
      const tryFind = () => {
        const el = document.querySelector(step.selector!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTargetRect(el.getBoundingClientRect());
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

      // Check during scroll animation
      const t1 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 100);
      const t2 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 300);
      const t3 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    setTargetRect(null);
  }, [isOpen, mode, activeIndex]);

  useEffect(() => {
    const timerCleanup = updateTargetRect();
    const handleResize = () => {
      const step = TOUR_STEPS[activeIndex];
      if (step?.selector) {
        const el = document.querySelector(step.selector);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };
    const handleScroll = () => {
      const step = TOUR_STEPS[activeIndex];
      if (step?.selector) {
        const el = document.querySelector(step.selector);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      if (typeof timerCleanup === 'function') timerCleanup();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, { capture: true } as any);
    };
  }, [updateTargetRect, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (mode === 'tour') {
        if (e.key === 'ArrowRight' && activeIndex < TOUR_STEPS.length - 1) {
          goToStep(activeIndex + 1);
        } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
          goToStep(activeIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, activeIndex, onClose, goToStep]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[activeIndex];
  const StepIcon = currentStep?.icon || Sparkles;

  // ==========================================
  // RENDER GUIDE MODAL (BUKU PANDUAN STEP 1-6)
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
                  Buku Panduan: Langkah 1 - Unggah Surat Permohonan
                  <span className="text-[11px] font-medium bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Bandara Mozes Kilangin
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Petunjuk terperinci 6 langkah pengisian formulir pengajuan surat permohonan sewa baru
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('tour');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-white/20"
                title="Mulai tur spotlight di formulir ini"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Kembali ke Tur di Formulir
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
              {FORM_STEPS_DATA.map((s) => {
                const isSelected = activeStepDetail === s.number;
                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => setActiveStepDetail(s.number)}
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
              const currentDetail = FORM_STEPS_DATA.find(s => s.number === activeStepDetail) || FORM_STEPS_DATA[0];
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
                          Langkah {currentDetail.number} dari {FORM_STEPS_DATA.length}
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
                      Rincian Prosedur Langkah {currentDetail.number}:
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
                      disabled={activeStepDetail <= 1}
                      onClick={() => setActiveStepDetail(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Langkah Sebelumnya
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      Langkah {activeStepDetail} dari {FORM_STEPS_DATA.length}
                    </span>

                    {activeStepDetail < FORM_STEPS_DATA.length ? (
                      <button
                        type="button"
                        onClick={() => setActiveStepDetail(prev => Math.min(FORM_STEPS_DATA.length, prev + 1))}
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
                <strong>Panduan Langkah 1 Selesai:</strong> Setelah mengklik tombol "Kirim Permohonan", berkas pengajuan Anda tersimpan resmi dan masuk ke antrean verifikasi Kepala Dinas Bandara. Anda dapat memantau perkembangan status secara langsung di halaman Daftar Permohonan.
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('tour');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Mulai Tur Spotlight di Formulir
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
  // RENDER SPOTLIGHT TOUR MODE (PERSIS GAMBAR)
  // ==========================================
  const isCentered = !targetRect;

  // Calculate Popover Position (smart clamping & exact screenshot match)
  let popoverStyle: React.CSSProperties = {};
  if (targetRect) {
    const cardWidth = Math.min(420, window.innerWidth - 32);
    const estimatedCardHeight = 290;
    const margin = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - targetRect.bottom - margin;
    const spaceAbove = targetRect.top - margin;
    const spaceLeft = targetRect.left - margin;
    const spaceRight = vw - targetRect.right - margin;

    let top = 0;
    let left = 0;

    // 1. Prioritas Layar Lebar (Desktop >= 960px): Jika target di kolom kanan, taruh di kiri target
    if (vw >= 960 && targetRect.left > vw * 0.45 && spaceLeft >= cardWidth + 8) {
      left = Math.max(margin, targetRect.left - cardWidth - margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
    }
    // 2. Jika target di kolom kiri, taruh di kanan target
    else if (vw >= 960 && targetRect.right < vw * 0.55 && spaceRight >= cardWidth + 8) {
      left = Math.min(vw - cardWidth - margin, targetRect.right + margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
    }
    // 3. Jika ruang bawah cukup, taruh di bawah target
    else if (spaceBelow >= estimatedCardHeight + margin) {
      top = targetRect.bottom + margin;
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = Math.max(margin, targetRect.right - cardWidth);
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
    }
    // 4. Jika ruang atas cukup, taruh di atas target
    else if (spaceAbove >= estimatedCardHeight + margin) {
      top = Math.max(margin, targetRect.top - estimatedCardHeight - margin);
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = Math.max(margin, targetRect.right - cardWidth);
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
    }
    // 5. Cek sisi samping kiri/kanan
    else if (spaceLeft >= cardWidth + margin) {
      left = Math.max(margin, targetRect.left - cardWidth - margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
    } else if (spaceRight >= cardWidth + margin) {
      left = Math.min(vw - cardWidth - margin, targetRect.right + margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
    }
    // 6. Fallback vertikal: tetap di luar elemen target
    else if (spaceBelow >= spaceAbove) {
      top = targetRect.bottom + 12;
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
    } else {
      top = Math.max(margin, targetRect.top - estimatedCardHeight - 12);
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
    }

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
      {/* SVG Spotlight Mask (Dark Backdrop with Cutout) */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9991]">
        <defs>
          <mask id="buat-permohonan-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
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
          mask="url(#buat-permohonan-spotlight-mask)"
        />
      </svg>

      {/* Target Element Glowing & Pulsing Ring Highlight (Persis Tampilan Gambar) */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-[9992] rounded-xl ring-4 ring-[#3c8dbc] ring-offset-2 ring-offset-transparent shadow-[0_0_25px_rgba(60,141,188,0.7)] animate-pulse transition-all duration-300"
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

      {/* Tour Popover Card (Persis Komponen Gambar) */}
      <div
        style={isCentered ? undefined : popoverStyle}
        className={
          isCentered
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92vw] max-w-md"
            : "z-[9999]"
        }
      >
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Header (Persis Gradasi & Ikon pada Gambar) */}
          <div className="p-4 bg-gradient-to-r from-[#205081] to-[#3c8dbc] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <StepIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 block">
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
          <div className="p-4 space-y-3 text-xs text-slate-700">
            <p className="leading-relaxed">
              {currentStep.description}
            </p>

            {currentStep.tip && (
              <div className="p-2.5 bg-blue-50/90 border border-blue-200/80 rounded-lg flex items-start gap-2 text-blue-900">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="leading-tight text-[11px]">
                  <strong>Tips:</strong> {currentStep.tip}
                </span>
              </div>
            )}

            {/* Stepper Dots (11 Langkah Interaktif Lengkap) */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 bg-[#3c8dbc]'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Ke langkah ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Card Footer (Persis Layout Tombol pada Gambar) */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
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
              {activeIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex - 1)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
              )}

              {activeIndex < TOUR_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex + 1)}
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
