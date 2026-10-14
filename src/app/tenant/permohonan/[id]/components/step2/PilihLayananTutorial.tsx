"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, CheckCircle2, 
  Warehouse, Calendar, Plane, SlidersHorizontal, Building2, 
  BookOpen, Info, Check, Save, AlertCircle, Layers
} from 'lucide-react';

export interface PilihLayananTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  isHangar?: boolean;
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

const TOUR_STEPS_HANGAR: TourStep[] = [
  {
    selector: '[data-tour="tour-step4-stepper"]',
    badge: 'Langkah 1 dari 6',
    title: 'Indikator Tahapan: Pilih Layanan',
    description: 'Surat permohonan Anda telah resmi disetujui pihak bandara. Saat ini Anda berada di Tahap 4: Pilih Layanan untuk melengkapi data unit hanggar, jadwal tinggal, dan armada pesawat.',
    tip: 'Tahap ini merupakan pengisian data teknis sebelum admin bandara melakukan verifikasi slot alokasi fasilitas.',
    icon: Sparkles,
  },
  {
    selector: '[data-tour="tour-step4-pilih-aset"]',
    badge: 'Langkah 2 dari 6',
    title: 'Pilih Unit Fasilitas Hanggar',
    description: 'Pilih unit hanggar yang tersedia dari daftar dropdown. Sistem menampilkan kode aset, nama fasilitas, dan total luas ruangan efektif (m²).',
    tip: 'Pilihlah unit hanggar yang sesuai dengan kebutuhan operasional dan estimasi kapasitas armada maskapai Anda.',
    icon: Warehouse,
  },
  {
    selector: '[data-tour="tour-step4-kapasitas"]',
    badge: 'Langkah 3 dari 6',
    title: 'Kapasitas Hanggar & Spesifikasi Teknis',
    description: 'Bilah indikator kapasitas memantau sisa ruang hanggar secara real-time. Anda juga dapat meninjau spesifikasi teknis seperti tinggi gedung, dimensi pintu, kelistrikan, dan akses apron bandara.',
    tip: 'Sistem secara otomatis menghitung akumulasi luas pesawat agar tidak melebihi sisa kapasitas hanggar yang tersedia.',
    icon: SlidersHorizontal,
  },
  {
    selector: '[data-tour="tour-step4-jadwal"]',
    badge: 'Langkah 4 dari 6',
    title: 'Jadwal & Durasi Masa Sewa',
    description: 'Tentukan tanggal mulai dan tanggal selesai masa sewa hanggar. Sistem otomatis mengalkulasikan total durasi hari/malam sebagai dasar penagihan retribusi.',
    tip: 'Untuk permohonan perpanjangan, tanggal mulai terkunci otomatis menyambung dari akhir masa kontrak aktif sebelumnya.',
    icon: Calendar,
  },
  {
    selector: '[data-tour="tour-step4-armada"]',
    badge: 'Langkah 5 dari 6',
    title: 'Pilih & Daftarkan Armada Pesawat',
    description: 'Centang minimal satu armada pesawat yang akan ditempatkan di hanggar. Jika registrasi pesawat belum terdaftar di sistem, klik tombol "+ Tambah Armada" untuk mendaftarkannya.',
    tip: 'Kebutuhan luas area dan estimasi tarif sewa per malam dihitung presisi berdasarkan MTOW dan tipe armada pesawat.',
    icon: Plane,
  },
  {
    selector: '[data-tour="tour-step4-btn-simpan"]',
    badge: 'Langkah 6 dari 6',
    title: 'Simpan & Ajukan Detail Layanan',
    description: 'Setelah seluruh data hanggar, jadwal, dan armada pesawat terisi dengan benar, klik tombol "Simpan Detail Layanan" untuk mengajukan plotting fasilitas ke Admin UPBU Bandara.',
    tip: 'Tutorial pengisian Langkah 4 selesai. Klik tombol "Selesai Tutorial" di bawah untuk menutup panduan dan mulai mengisi formulir.',
    icon: Save,
  },
];

const TOUR_STEPS_ROOM: TourStep[] = [
  {
    selector: '[data-tour="tour-step4-stepper"]',
    badge: 'Langkah 1 dari 6',
    title: 'Indikator Tahapan: Pilih Layanan',
    description: 'Surat permohonan Anda telah resmi disetujui. Sekarang Anda berada di tahapan penentuan spesifikasi dan alokasi ruangan yang diinginkan.',
    tip: 'Pastikan preferensi zona dan fasilitas kantor/gudang sesuai kebutuhan operasional tim Anda.',
    icon: Sparkles,
  },
  {
    selector: '[data-tour="tour-step4-pilih-aset"]',
    badge: 'Langkah 2 dari 6',
    title: 'Filter Preferensi Zona & Fasilitas Ruangan',
    description: 'Pilih preferensi zona terminal/perkantoran, tipe ruangan (Kantor Mitra / Gudang Operasional), serta kebutuhan fasilitas pendingin (AC / Non-AC).',
    tip: 'Filter ini mempermudah pencarian ruangan yang masih berstatus kosong di area lingkungan bandara.',
    icon: Layers,
  },
  {
    selector: '[data-tour="tour-step4-kapasitas"]',
    badge: 'Langkah 3 dari 6',
    title: 'Pilih Unit Ruangan Yang Tersedia',
    description: 'Klik salah satu kartu unit ruangan dari daftar ruangan yang tersedia untuk memilihnya sebagai objek sewa resmi.',
    tip: 'Rincian lantai, luas efektif ruangan (m²), dan estimasi tarif per bulan/tahun akan tampil secara detail.',
    icon: Building2,
  },
  {
    selector: '[data-tour="tour-step4-jadwal"]',
    badge: 'Langkah 4 dari 6',
    title: 'Tentukan Jadwal & Durasi Masa Sewa',
    description: 'Tentukan tanggal mulai dan selesai sewa. Sistem akan menghitung akumulasi periode sewa untuk penerbitan naskah kontrak PKS.',
    tip: 'Untuk perpanjangan sewa, jadwal mulai akan tersinkronisasi otomatis dengan kontrak aktif Anda.',
    icon: Calendar,
  },
  {
    selector: '[data-tour="tour-step4-armada"]',
    badge: 'Langkah 5 dari 6',
    title: 'Kebutuhan Spesifik & Catatan Operasional',
    description: 'Isi catatan kebutuhan khusus bila memerlukan penyesuaian daya listrik, partisi ruang, atau akses logistik khusus ke area steril bandara.',
    tip: 'Catatan ini akan ditelaah oleh tim teknis pengelola gedung bandara sebelum pengesahan draf PKS.',
    icon: Info,
  },
  {
    selector: '[data-tour="tour-step4-btn-simpan"]',
    badge: 'Langkah 6 dari 6',
    title: 'Simpan Detail Ruangan & Lanjutkan',
    description: 'Klik tombol "Simpan Detail Layanan" untuk mendaftarkan pilihan unit ruangan Anda ke pihak pengelola bandara.',
    tip: 'Tutorial Langkah 4 selesai. Klik tombol "Selesai Tutorial" di bawah untuk menutup panduan.',
    icon: Save,
  },
];

const GUIDE_STEPS_HANGAR: GuideStepDetail[] = [
  {
    number: 1,
    title: 'Indikator Tahapan Pilih Layanan',
    actor: 'Sistem MARS',
    status: 'Langkah 4 dari 6',
    icon: Sparkles,
    description: 'Memahami progres permohonan pada Step 4 setelah surat resmi disetujui pimpinan bandara. Tahap ini berfokus pada alokasi teknis ruang hanggar dan armada pesawat.',
    details: [
      'Surat permohonan telah diverifikasi dan disetujui (Approved).',
      'Kontrak Payung Induk telah terdaftar/aktif sebagai legalitas utama.',
      'Mitra kini mengisi preferensi fasilitas hanggar secara spesifik.'
    ]
  },
  {
    number: 2,
    title: 'Pemilihan Objek Unit Hanggar',
    actor: 'Mitra Tenant',
    status: 'Input Formulir',
    icon: Warehouse,
    description: 'Menentukan pilihan unit hanggar (Hanggar A, B, atau C) sesuai ketersediaan fasilitas di Bandara Mozes Kilangin.',
    details: [
      'Pilih unit hanggar yang tersedia dari menu dropdown.',
      'Periksa kode aset dan luas total fasilitas (m²).',
      'Untuk permohonan perpanjangan, unit hanggar telah dikunci otomatis sesuai kontrak berjalan.'
    ]
  },
  {
    number: 3,
    title: 'Monitoring Kapasitas & Spesifikasi Teknis',
    actor: 'Sistem & Mitra',
    status: 'Validasi Real-time',
    icon: SlidersHorizontal,
    description: 'Memeriksa sisa kapasitas ruang hanggar dan spesifikasi fasilitas penunjang untuk menjamin keselamatan operasional pesawat.',
    details: [
      'Bilah kapasitas menampilkan persentase ruang terpakai dan sisa luas efektif.',
      'Tinjau parameter teknis: tinggi bangunan, bukaan pintu hanggar, suplai listrik, dan fire safety.',
      'Sistem otomatis memblokir penyimpanan jika luas pesawat melebihi sisa kapasitas.'
    ]
  },
  {
    number: 4,
    title: 'Penentuan Jadwal & Durasi Masa Sewa',
    actor: 'Mitra Tenant',
    status: 'Input Jadwal',
    icon: Calendar,
    description: 'Menetapkan rentang waktu masa tinggal pesawat di hanggar dari tanggal mulai hingga selesai.',
    details: [
      'Pilih tanggal mulai sewa (start date).',
      'Pilih tanggal selesai sewa (end date).',
      'Sistem menghitung durasi total malam penyewaan secara otomatis.'
    ]
  },
  {
    number: 5,
    title: 'Pemilihan & Pendaftaran Armada Pesawat',
    actor: 'Mitra Tenant',
    status: 'Wajib Centang Minimal 1',
    icon: Plane,
    description: 'Memilih armada pesawat yang akan menempati hanggar serta mendaftarkan registrasi baru bila belum tercatat di profil.',
    details: [
      'Centang minimal satu registrasi pesawat (PK-...) pada daftar armada.',
      'Gunakan tombol "+ Tambah Armada" untuk mendaftarkan armada pesawat baru.',
      'Tarif retribusi dihitung otomatis berdasarkan MTOW dan tipe pesawat.'
    ]
  },
  {
    number: 6,
    title: 'Pengiriman Data Detail Layanan',
    actor: 'Mitra & Admin UPBU',
    status: 'Selesai Langkah 4',
    icon: Save,
    description: 'Menyimpan formulir detail layanan agar diteruskan ke meja Admin UPBU Bandara untuk validasi slot teknis.',
    details: [
      'Pastikan unit aset, jadwal sewa, dan armada pesawat sudah sesuai.',
      'Klik tombol "Simpan Detail Layanan" di sudut kanan bawah.',
      'Tahapan akan berpindah ke Step 5: Validasi Admin & Penerbitan Draf Kontrak/STS.'
    ]
  }
];

export function PilihLayananTutorial({
  isOpen,
  onClose,
  isHangar = true,
  defaultMode = 'tour',
}: PilihLayananTutorialProps) {
  const [mode, setMode] = useState<'tour' | 'guide'>(defaultMode);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [activeGuideStep, setActiveGuideStep] = useState(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const tourSteps = isHangar ? TOUR_STEPS_HANGAR : TOUR_STEPS_ROOM;
  const guideSteps = GUIDE_STEPS_HANGAR;

  // Reset or initialize when opened
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setActiveTourIndex(0);
      setActiveGuideStep(1);
    }
  }, [isOpen, defaultMode]);

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(tourSteps.length - 1, index));
    setActiveTourIndex(clamped);
  }, [tourSteps.length]);

  // Recalculate target element position for tour mode
  const updateTargetRect = useCallback(() => {
    if (!isOpen || mode !== 'tour') return;
    const step = tourSteps[activeTourIndex];
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

      const t1 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 100);
      const t2 = setTimeout(() => {
        const el = document.querySelector(step.selector!);
        if (el) setTargetRect(el.getBoundingClientRect());
      }, 300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setTargetRect(null);
  }, [isOpen, mode, activeTourIndex, tourSteps]);

  useEffect(() => {
    const timerCleanup = updateTargetRect();
    const handleResize = () => {
      const step = tourSteps[activeTourIndex];
      if (step?.selector) {
        const el = document.querySelector(step.selector);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };
    const handleScroll = () => {
      const step = tourSteps[activeTourIndex];
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
  }, [updateTargetRect, activeTourIndex, tourSteps]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (mode === 'tour') {
        if (e.key === 'ArrowRight' && activeTourIndex < tourSteps.length - 1) {
          goToStep(activeTourIndex + 1);
        } else if (e.key === 'ArrowLeft' && activeTourIndex > 0) {
          goToStep(activeTourIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, activeTourIndex, tourSteps.length, onClose, goToStep]);

  if (!isOpen) return null;

  const currentStep = tourSteps[activeTourIndex];
  const StepIcon = currentStep?.icon || Sparkles;

  // ==========================================
  // RENDER GUIDE MODAL (BUKU PANDUAN LANGKAH 4)
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
                  Buku Panduan: Langkah 4 - Pilih Layanan
                  <span className="text-[11px] font-medium bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Bandara Mozes Kilangin
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Petunjuk 6 prosedur pengisian detail objek aset, jadwal sewa, dan armada pesawat
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
              {guideSteps.map((s) => {
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
              const currentDetail = guideSteps.find(s => s.number === activeGuideStep) || guideSteps[0];
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
                          Prosedur {currentDetail.number} dari {guideSteps.length}
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
                      disabled={activeGuideStep <= 1}
                      onClick={() => setActiveGuideStep(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Langkah Sebelumnya
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      Langkah {activeGuideStep} dari {guideSteps.length}
                    </span>

                    {activeGuideStep < guideSteps.length ? (
                      <button
                        type="button"
                        onClick={() => setActiveGuideStep(prev => Math.min(guideSteps.length, prev + 1))}
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
                <strong>Langkah Selanjutnya:</strong> Setelah menyimpan detail layanan, permohonan akan divalidasi oleh petugas operasional apron. Setelah disetujui, draf kontrak sewa dan tagihan STS akan terbit di Langkah 5.
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
  // RENDER SPOTLIGHT TOUR MODE (SMART NON-OVERLAPPING PLACEMENT)
  // ==========================================
  const isCentered = !targetRect;

  let popoverStyle: React.CSSProperties = {};
  let arrowIndicator: 'top' | 'bottom' | 'left' | 'right' | null = null;

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

    // 1. Prioritas Layar Lebar (Desktop >= 960px): Jika elemen di kolom kanan, taruh di kiri target
    if (vw >= 960 && targetRect.left > vw * 0.4 && spaceLeft >= cardWidth + 8) {
      left = Math.max(margin, targetRect.left - cardWidth - margin);
      // Pusatkan vertikal searah target, clamped agar tetap dalam viewport
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
      arrowIndicator = 'right';
    } 
    // 2. Jika elemen di kolom kiri (Desktop >= 960px), taruh di kanan target
    else if (vw >= 960 && targetRect.right < vw * 0.6 && spaceRight >= cardWidth + 8) {
      left = Math.min(vw - cardWidth - margin, targetRect.right + margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
      arrowIndicator = 'left';
    }
    // 3. Jika ruang bawah cukup, taruh di bawah target (TIDAK PERNAH MENUTUPI)
    else if (spaceBelow >= estimatedCardHeight + margin) {
      top = targetRect.bottom + margin;
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = Math.max(margin, targetRect.right - cardWidth);
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
      arrowIndicator = 'top';
    } 
    // 4. Jika ruang atas cukup, taruh di atas target
    else if (spaceAbove >= estimatedCardHeight + margin) {
      top = Math.max(margin, targetRect.top - estimatedCardHeight - margin);
      left = targetRect.left;
      if (left + cardWidth > vw - margin) {
        left = Math.max(margin, targetRect.right - cardWidth);
      }
      left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
      arrowIndicator = 'bottom';
    } 
    // 5. Cek sisi samping kiri/kanan sebagai cadangan
    else if (spaceLeft >= cardWidth + margin) {
      left = Math.max(margin, targetRect.left - cardWidth - margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
      arrowIndicator = 'right';
    } else if (spaceRight >= cardWidth + margin) {
      left = Math.min(vw - cardWidth - margin, targetRect.right + margin);
      top = Math.max(margin, Math.min(targetRect.top, vh - estimatedCardHeight - margin));
      arrowIndicator = 'left';
    } 
    // 6. Fallback Vertikal: Selalu tempatkan di luar elemen (tidak pernah tumpang tindih)
    else if (spaceBelow >= spaceAbove) {
      top = targetRect.bottom + 12;
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
      arrowIndicator = 'top';
    } else {
      top = Math.max(margin, targetRect.top - estimatedCardHeight - 12);
      left = Math.max(margin, Math.min(targetRect.left, vw - cardWidth - margin));
      arrowIndicator = 'bottom';
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
      {/* SVG Spotlight Mask */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9991]">
        <defs>
          <mask id="pilih-layanan-spotlight-mask">
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
          mask="url(#pilih-layanan-spotlight-mask)"
        />
      </svg>

      {/* Target Element Glowing & Pulsing Ring Highlight */}
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

      {/* Tour Popover Card */}
      <div
        style={isCentered ? undefined : popoverStyle}
        className={
          isCentered
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92vw] max-w-md"
            : "z-[9999]"
        }
      >
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Header */}
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

            {/* Stepper Dots (6 Langkah Interaktif) */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {tourSteps.map((_, idx) => (
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

              {activeTourIndex < tourSteps.length - 1 ? (
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
