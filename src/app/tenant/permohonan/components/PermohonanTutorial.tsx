"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  HelpCircle, X, ChevronRight, ChevronLeft, CheckCircle2, 
  Sparkles, BookOpen, FileText, ShieldCheck, Clock, Plus, 
  Info, ArrowRight, Check, AlertCircle, Building2, Plane, CreditCard, ExternalLink
} from 'lucide-react';

export interface PermohonanTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'tour' | 'guide';
}

interface TourStep {
  selector?: string;
  title: string;
  description: string;
  tip?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="tour-payung-status"]',
    title: 'Status Kontrak Payung Induk (PKS)',
    badge: 'Langkah 1 dari 5',
    description: 'Menampilkan status legalitas Perjanjian Kerja Sama (PKS) Payung Induk maskapai Anda dengan UPBU Bandara Mozes Kilangin. Pengajuan sewa hanggar hanya dapat diproses apabila kontrak payung dalam keadaan Aktif.',
    tip: 'Jika masa berlaku kontrak payung hampir habis, segera koordinasikan dengan pihak pengelola bandara.',
    icon: ShieldCheck,
  },
  {
    selector: '[data-tour="tour-btn-ajukan"]',
    title: 'Tombol Ajukan Sewa Baru',
    badge: 'Langkah 2 dari 5',
    description: 'Klik tombol ini untuk memulai proses pengajuan sewa fasilitas baru (Hanggar, Apron, atau Ruangan). Anda dapat mengunduh format Surat Permohonan resmi bertanda tangan, mengisi formulir, dan mengunggahnya.',
    tip: 'Tombol ini hanya dapat digunakan apabila akun mitra sudah berstatus Terverifikasi oleh Admin UPBU.',
    icon: Plus,
  },
  {
    selector: '[data-tour="tour-daftar-permohonan"]',
    title: 'Daftar & Tiket Permohonan',
    badge: 'Langkah 3 dari 5',
    description: 'Setiap permohonan yang diajukan akan mendapatkan Nomor Tiket unik (contoh: SEWA-...). Anda dapat memantau status persetujuan, tipe aset yang diminati, serta periode masa sewa secara transparan dan real-time.',
    tip: 'Badge status akan berubah otomatis seiring verifikasi dari tim teknis dan keuangan bandara.',
    icon: FileText,
  },
  {
    selector: '[data-tour="tour-card-actions"]',
    title: 'Aksi Perpanjangan & Detail Progres',
    badge: 'Langkah 4 dari 5',
    description: 'Untuk permohonan yang sudah aktif, Anda dapat memperpanjang masa tinggal pesawat dengan menekan tombol "Perpanjang Sewa". Klik "Lihat Detail" untuk membuka lembar progres 5 tahapan permohonan.',
    tip: 'Melalui halaman detail, Anda dapat meninjau draft PKS, menandatanganinya, dan mengunggah bukti bayar STS.',
    icon: Clock,
  },
  {
    title: 'Rangkuman Alur 5 Tahapan Sewa',
    badge: 'Langkah 5 dari 5',
    description: 'Proses permohonan sewa di MARS terbagi menjadi 5 tahapan terstruktur: ① Pengajuan Surat → ② Plotting Aset & Pesawat → ③ TTD Draft Kontrak → ④ Pembayaran & Upload STS → ⑤ Penerbitan Kontrak Aktif.',
    tip: 'Anda dapat membuka kembali panduan ini kapan saja melalui tombol "Panduan Tutorial".',
    icon: Sparkles,
  },
];

export function PermohonanTutorial({
  isOpen,
  onClose,
  defaultMode = 'tour'
}: PermohonanTutorialProps) {
  const [mode, setMode] = useState<'tour' | 'guide'>(defaultMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'alur' | 'syarat' | 'perpanjangan' | 'faq'>('alur');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Sync mode with prop
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setCurrentStepIndex(0);
    }
  }, [isOpen, defaultMode]);

  // Recalculate target element position for tour mode
  const updateTargetRect = useCallback(() => {
    if (!isOpen || mode !== 'tour') return;
    const step = TOUR_STEPS[currentStepIndex];
    if (step.selector) {
      const el = document.querySelector(step.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        return;
      }
    }
    setTargetRect(null);
  }, [isOpen, mode, currentStepIndex]);

  useEffect(() => {
    updateTargetRect();
    const handleResize = () => updateTargetRect();
    const handleScroll = () => {
      // update bounding rect on scroll
      const step = TOUR_STEPS[currentStepIndex];
      if (step.selector) {
        const el = document.querySelector(step.selector);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateTargetRect, currentStepIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (mode === 'tour') {
        if (e.key === 'ArrowRight' && currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, currentStepIndex, onClose]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  // Render Guide Modal Mode
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
                  Panduan Alur Permohonan Sewa
                  <span className="text-[11px] font-medium bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Mozes Kilangin
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Petunjuk lengkap prosedur pengajuan dan pengelolaan sewa fasilitas bandara
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('tour');
                  setCurrentStepIndex(0);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-white/20"
                title="Mulai tur interaktif di halaman ini"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Mulai Tur di Halaman
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

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('alur')}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'alur' 
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white font-bold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#3c8dbc]" />
              Alur 5 Tahapan Sewa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('syarat')}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'syarat' 
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white font-bold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Syarat & Dokumen Legalitas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perpanjangan')}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'perpanjangan' 
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white font-bold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Perpanjangan & Relokasi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'faq' 
                  ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white font-bold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              Tanya Jawab (FAQ)
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
            
            {/* TAB 1: ALUR 5 TAHAPAN SEWA */}
            {activeTab === 'alur' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-1">
                    Diagram Alur Proses Permohonan Sewa
                  </h4>
                  <p className="text-xs text-slate-500">
                    Setiap pengajuan diproses melalui 5 tahapan terintegrasi untuk menjamin kepastian operasional dan akuntabilitas hukum.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                  {/* Step 1 */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                        1
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs mb-1">Surat Permohonan</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Mitra mengunduh template resmi, mengisi data sewa, lalu mengunggah surat bertanda tangan.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-semibold">
                      Verifikasi: Admin UPBU
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                        2
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs mb-1">Plotting Aset & Pesawat</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Menentukan titik hanggar/ruangan serta registrasi armada pesawat (PK-...) yang masuk.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-semibold">
                      Kapasitas & Keselamatan
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                        3
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs mb-1">Draft Kontrak (PKS)</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Sistem menerbitkan draft perjanjian sewa. Ditandatangani tenant dan Kepala Bandara.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-semibold">
                      Persetujuan Formal
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                        4
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs mb-1">Tagihan & STS</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Surat Tanda Setoran (STS) diterbitkan. Mitra bayar via bank & unggah bukti transfer.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-semibold">
                      Verifikasi Bendahara
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                        ✓
                      </div>
                      <h5 className="font-bold text-emerald-950 text-xs mb-1">Kontrak Aktif</h5>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Kontrak sah & aktif. Tiket Izin Operasional diterbitkan untuk masuk fasilitas.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-emerald-200 text-[10px] text-emerald-800 font-bold">
                      Siap Digunakan
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <strong>Catatan Transparansi:</strong> Anda dapat memantau setiap perubahan status permohonan secara langsung. Notifikasi sistem akan memberikan peringatan jika terdapat dokumen yang perlu ditandatangani atau diperbaiki.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SYARAT & LEGALITAS */}
            {activeTab === 'syarat' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-base">
                  Persyaratan Legalitas Pengajuan Sewa
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      1. Verifikasi Akun & Legalitas Badan Usaha
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sebelum mengajukan sewa baru, profil mitra wajib melampirkan Dokumen NIB (Nomor Induk Berusaha), NPWP Perusahaan, Akta Perusahaan, dan identitas Penanggung Jawab (PIC).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      2. Kontrak Payung Induk (PKS)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Khusus penyewaan hanggar pesawat di Bandara Mozes Kilangin, wajib memiliki Kontrak Payung Induk aktif sebagai payung hukum kerja sama operasional bandara.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                      <Plane className="w-4 h-4 text-indigo-600" />
                      3. Data Armada Pesawat Valid
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pesawat yang didaftarkan wajib memiliki registrasi resmi (PK-...), tipe pesawat yang terdaftar di database, dan sertifikat kelaikudaraan aktif.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      4. Ketaatan Pembayaran Retribusi
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pembayaran sewa disetorkan langsung ke Kas Negara/Daerah melalui Surat Tanda Setoran (STS) yang diterbitkan resmi oleh Bendahara Penerimaan UPBU.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PERPANJANGAN & RELOKASI */}
            {activeTab === 'perpanjangan' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-base">
                  Mekanisme Perpanjangan Sewa & Relokasi Penempatan
                </h4>
                
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 leading-relaxed space-y-2">
                  <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Perpanjangan Sewa Praktis (1-Click Extension)
                  </div>
                  <p>
                    Apabila pesawat Anda membutuhkan masa parkir atau pemeliharaan tambahan di hanggar, Anda tidak perlu mengulang proses pembuatan permohonan dari awal:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 font-medium">
                    <li>Klik tombol <strong>"Perpanjang Sewa"</strong> pada kartu permohonan yang aktif.</li>
                    <li>Tentukan jumlah hari tambahan atau tanggal selesai baru yang diinginkan.</li>
                    <li>Pilih apakah ingin tetap di hanggar yang sama atau meminta relokasi penempatan jika diperlukan.</li>
                    <li>Setelah disetujui Admin, masa sewa akan langsung diperpanjang dan tagihan penyesuaian akan diterbitkan.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Penyesuaian Relokasi Hanggar
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Petugas operasional bandara dapat merekomendasikan pemindahan posisi pesawat ke hanggar atau apron lain sesuai ketersediaan kapasitas apron dan dimensi pesawat tanpa membatalkan perjanjian sewa yang sedang berlangsung.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-base mb-2">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h4>

                <div className="space-y-2.5 text-xs">
                  <details className="bg-slate-50 border border-slate-200 rounded-lg p-3 group">
                    <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                      <span>Berapa lama proses verifikasi surat permohonan sewa?</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                      Verifikasi administratif oleh tim Admin UPBU umumnya diselesaikan dalam waktu 1x24 jam kerja sejak berkas permohonan resmi diunggah secara lengkap.
                    </p>
                  </details>

                  <details className="bg-slate-50 border border-slate-200 rounded-lg p-3 group">
                    <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                      <span>Apakah bisa mengajukan sewa untuk beberapa pesawat sekaligus?</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                      Ya. Pada Tahap 2 (Plotting Aset), Anda dapat mendaftarkan armada pesawat utama dan pesawat pendukung yang akan masuk ke fasilitas hanggar yang disewa.
                    </p>
                  </details>

                  <details className="bg-slate-50 border border-slate-200 rounded-lg p-3 group">
                    <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                      <span>Bagaimana jika akun saya masih berstatus Belum Terverifikasi?</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                      Silakan buka menu <strong>Profil & Dokumen</strong> di bilah navigasi kiri, lalu lengkapi dokumen legalitas perusahaan Anda. Admin akan memverifikasi berkas Anda dalam waktu singkat.
                    </p>
                  </details>

                  <details className="bg-slate-50 border border-slate-200 rounded-lg p-3 group">
                    <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                      <span>Di mana saya dapat mengunduh Tiket Izin Operasional?</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                      Setelah kontrak disahkan dan mencapai Tahap 5, tombol cetak Tiket Izin Masuk Fasilitas dan lembar kontrak PKS lengkap akan tersedia di halaman detail permohonan.
                    </p>
                  </details>
                </div>
              </div>
            )}

          </div>

          {/* Footer Modal */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('tour');
                setCurrentStepIndex(0);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Mulai Tur Interaktif di Halaman
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

  // Render Tour Spotlight Mode
  const isCentered = !targetRect;

  // Calculate Popover Position
  let popoverStyle: React.CSSProperties = {};
  if (targetRect) {
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const cardWidth = Math.min(420, window.innerWidth - 32);

    let left = Math.max(16, Math.min(targetRect.left, window.innerWidth - cardWidth - 16));
    let top = 0;

    if (spaceBelow >= 300 || spaceBelow >= spaceAbove) {
      top = targetRect.bottom + 16;
    } else {
      top = Math.max(16, targetRect.top - 280);
    }

    popoverStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: 9999,
    };
  }

  return (
    <div className="fixed inset-0 z-[9990] select-none pointer-events-auto">
      {/* SVG Spotlight Mask */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9991]">
        <defs>
          <mask id="tutorial-spotlight-mask">
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
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Target Element Pulsing Ring Highlight */}
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

      {/* Backdrop click to dismiss or step forward */}
      <div 
        className="fixed inset-0 z-[9993] cursor-default"
        onClick={() => {
          // Keep active or close if wanted
        }}
      />

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
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
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

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-[#3c8dbc]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
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
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => prev - 1)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
              )}

              {currentStepIndex < TOUR_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  Selanjutnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Selesai
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
