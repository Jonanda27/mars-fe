"use client";

import React from 'react';
import { 
  FileText, ShieldCheck, CheckCircle2, Clock, 
  MapPin, Plane, CreditCard, ArrowRight, Download, 
  Printer, Check, AlertCircle, FileCheck, Building2, 
  UserCheck, Send, Eye, Sparkles, QrCode, Calendar
} from 'lucide-react';

// ==========================================
// STEP 2 PREVIEW: VERIFIKASI & DISPOSISI KADIS
// ==========================================
export function TutorialStep2View() {
  return (
    <div 
      data-tour="tour-step-2"
      className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg overflow-hidden animate-in fade-in duration-300"
    >
      {/* Banner Status Header */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3c8dbc]/10 border border-[#3c8dbc]/30 flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-[#3c8dbc]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
              <Clock className="w-3.5 h-3.5" />
              Status: Menunggu Telaah Kadis
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Tahap 2: Verifikasi & Disposisi Kepala Dinas
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Surat permohonan resmi Anda telah masuk ke meja pimpinan UPBU Bandara Mozes Kilangin. Kepala Dinas meninjau aspek kelayakan teknis, ketersediaan fasilitas, serta kesesuaian operasional sebelum memberikan disposisi persetujuan resmi.
            </p>
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-2xs text-right hidden sm:block">
          <span className="text-[11px] text-slate-400 block font-medium">Estimasi Waktu Proses</span>
          <span className="text-sm font-bold text-slate-700">1x24 Jam Kerja</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Rangkuman Berkas Surat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold mb-1">Nomor Registrasi Tiket</span>
            <span className="text-sm font-bold text-slate-800 font-mono">SEWA-2026-0089</span>
            <span className="text-[10px] text-emerald-600 block mt-1 font-medium">✓ Terdaftar di Sistem MARS</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold mb-1">Jenis Layanan Yang Diajukan</span>
            <span className="text-sm font-bold text-[#3c8dbc]">Sewa Hanggar Pesawat</span>
            <span className="text-[10px] text-slate-500 block mt-1">Bandara Mozes Kilangin Timika</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-semibold mb-1">Berkas Surat Resmi</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">Surat_Permohonan.pdf</span>
              <span className="text-[10px] bg-blue-100 text-[#3c8dbc] px-2 py-0.5 rounded font-bold">PDF 2.4 MB</span>
            </div>
          </div>
        </div>

        {/* Alur Verifikasi Real-time */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Alur Peninjauan Kepala Dinas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            <div className="p-3.5 bg-white rounded-lg border border-emerald-300 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                <span className="text-xs font-bold text-slate-800">1. Penerimaan Berkas</span>
              </div>
              <p className="text-[11px] text-slate-500">Berkas surat resmi ber-Kop Surat dan stempel lengkap telah diverifikasi sistem.</p>
            </div>

            <div className="p-3.5 bg-blue-50/70 rounded-lg border-2 border-[#3c8dbc] shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-[10px] font-bold animate-pulse">2</div>
                <span className="text-xs font-bold text-[#205081]">2. Telaah Teknis & Operasional</span>
              </div>
              <p className="text-[11px] text-slate-600">Pemeriksaan kapasitas hanggar dan validasi legalitas maskapai oleh tim dinas.</p>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200 opacity-60">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">3</div>
                <span className="text-xs font-bold text-slate-600">3. Disposisi Persetujuan</span>
              </div>
              <p className="text-[11px] text-slate-400">Penerbitan surat disposisi (Approved) membuka akses otomatis ke Step 3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STEP 3 PREVIEW: KONTRAK PAYUNG INDUK (PKS)
// ==========================================
export function TutorialStep3View() {
  return (
    <div 
      data-tour="tour-step-3"
      className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg overflow-hidden animate-in fade-in duration-300"
    >
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3c8dbc]/10 border border-[#3c8dbc]/30 flex items-center justify-center flex-shrink-0 shadow-xs">
            <FileCheck className="w-8 h-8 text-[#3c8dbc]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#3c8dbc] border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Surat Disetujui Kepala Dinas
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Tahap 3: Penandatanganan Kontrak Payung Induk (PKS)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Khusus penyewaan hanggar pesawat, diperlukan Perjanjian Kerja Sama (PKS) Payung Induk yang berlaku 1 tahun sebagai dasar legalitas. Sistem menerbitkan draf PKS resmi untuk ditandatangani oleh pimpinan mitra dan Kepala Bandara.
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
          Masa Berlaku: 1 Tahun Kalender
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Pratinjau Naskah Kontrak */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-2xs">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Draf PKS Payung Induk Bandara Mozes Kilangin</h4>
              <p className="text-xs text-slate-500 font-mono">Nomor: 553/PKS-PAYUNG/UPBU-TIMIKA/2026</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">12 Halaman</span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Terverifikasi Bagian Hukum</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs">
              <Eye className="w-4 h-4 text-slate-500" />
              Pratinjau Draf
            </button>
            <button type="button" className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs">
              <Download className="w-4 h-4" />
              Unduh Naskah PKS
            </button>
          </div>
        </div>

        {/* Card Tanda Tangan */}
        <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Pilihan Metode Penandatanganan</h5>
            <p className="text-xs text-blue-800/80 mt-0.5">Anda dapat menandatangani naskah secara Digital (e-Sign) atau mengunggah scan tanda tangan basah pimpinan.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-white text-[#3c8dbc] border border-blue-300 rounded-lg text-xs font-bold shadow-2xs">
              Tanda Tangan Digital
            </span>
            <span className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs">
              Upload Scan TTD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STEP 4 PREVIEW: PLOTTING HANGGAR & PESAWAT
// ==========================================
export function TutorialStep4View() {
  return (
    <div 
      data-tour="tour-step-4"
      className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg overflow-hidden animate-in fade-in duration-300"
    >
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3c8dbc]/10 border border-[#3c8dbc]/30 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Building2 className="w-8 h-8 text-[#3c8dbc]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              <Check className="w-3.5 h-3.5" />
              Kontrak Payung Aktif
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Tahap 4: Plotting Aset Hanggar & Armada Pesawat
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Tentukan pilihan fasilitas hanggar yang diinginkan, nomor registrasi armada pesawat (PK-...) yang akan masuk ke fasilitas, serta durasi tanggal sewa. Petugas apron akan memeriksa safe-clearance kapasitas ruang hanggar.
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 bg-blue-50 text-[#3c8dbc] border border-blue-200 rounded-lg text-xs font-bold">
          Validasi Kapasitas Apron
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Box Pilihan Hanggar */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Pilihan Fasilitas Hanggar
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Slot Tersedia</span>
            </div>
            <div className="p-3 bg-white border border-[#3c8dbc] rounded-lg shadow-2xs">
              <div className="font-bold text-xs text-slate-800">Hanggar A - Mozes Kilangin</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Luas: 1.200 m² | Kapasitas: 2 Pesawat ATR-72 / 4 Caravan</div>
              <div className="text-[10px] text-blue-600 font-semibold mt-1">Lantai Epoxy, Lampu Highbay, Hydrant Standby</div>
            </div>
          </div>

          {/* Box Armada Pesawat */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Plane className="w-4 h-4 text-indigo-600" />
                Armada Pesawat Masuk
              </span>
              <span className="text-[10px] bg-blue-100 text-[#3c8dbc] px-2 py-0.5 rounded font-bold">Terverifikasi</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="font-bold text-xs text-slate-800 font-mono">PK-MNA (Cessna 208B Grand Caravan)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">MTOW: 3.969 Kg | Wingspan: 15.88 Meter</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Memenuhi standar jarak safe-clearance hanggar</div>
            </div>
          </div>
        </div>

        {/* Periode Masa Sewa */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Periode Rencana Masa Sewa</span>
              <span className="text-xs text-slate-500">10 Oktober 2026 s/d 10 November 2026 (Durasi: 31 Hari Kalender)</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#3c8dbc] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            Plotting Siap Diterbitkan
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STEP 5 PREVIEW: KONTRAK SEWA & STS
// ==========================================
export function TutorialStep5View() {
  return (
    <div 
      data-tour="tour-step-5"
      className="bg-white border-t-[4px] border-[#3c8dbc] shadow-md rounded-lg overflow-hidden animate-in fade-in duration-300"
    >
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3c8dbc]/10 border border-[#3c8dbc]/30 flex items-center justify-center flex-shrink-0 shadow-xs">
            <CreditCard className="w-8 h-8 text-[#3c8dbc]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
              <Clock className="w-3.5 h-3.5" />
              Menunggu Pembayaran Retribusi (STS)
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Tahap 5: Draf Kontrak Sewa & Surat Tanda Setoran (STS)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Admin UPBU menerbitkan Draf Kontrak Sewa definitif dan Surat Tanda Setoran (STS) retribusi. Mitra melakukan pembayaran ke rekening kas penerimaan negara/daerah via bank, lalu mengunggah bukti transfer untuk divalidasi oleh Bendahara.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Total Tarif Retribusi Resmi</span>
          <span className="text-lg font-black text-slate-800">Rp 15.500.000</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rincian STS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">Surat Tanda Setoran (STS)</span>
              <span className="text-[11px] font-mono text-blue-600 font-bold">STS-2026-0042</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Bank Tujuan:</span>
                <span className="font-semibold text-slate-800">Bank Papua / BRI Penerimaan</span>
              </div>
              <div className="flex justify-between">
                <span>Nomor Rekening Kas:</span>
                <span className="font-mono font-bold text-slate-800">102-00-192837-1</span>
              </div>
              <div className="flex justify-between">
                <span>Atas Nama:</span>
                <span className="font-semibold text-slate-800">BPP UPBU MOZES KILANGIN</span>
              </div>
            </div>
            <button type="button" className="w-full mt-2 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs">
              <Download className="w-4 h-4 text-slate-500" />
              Unduh Lembar Tagihan STS (PDF)
            </button>
          </div>

          {/* Area Unggah Bukti Bayar */}
          <div className="bg-blue-50/50 border-2 border-dashed border-[#3c8dbc]/50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3c8dbc] shadow-xs mb-2">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">Unggah Bukti Setoran Bank</span>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">Lampirkan struk / bukti transfer mobile banking (PDF atau JPG, maks. 5MB).</p>
            <button type="button" className="mt-3 px-4 py-1.5 bg-[#3c8dbc] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#367fa9]">
              Pilih File Bukti Bayar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STEP 6 PREVIEW: KONTRAK AKTIF & TIKET OPERASIONAL
// ==========================================
export function TutorialStep6View() {
  return (
    <div 
      data-tour="tour-step-6"
      className="bg-white border-t-[4px] border-emerald-500 shadow-md rounded-lg overflow-hidden animate-in fade-in duration-300"
    >
      <div className="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/50 p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs mb-2">
              <Check className="w-3.5 h-3.5" />
              Selesai: Kontrak Sewa Sah & Aktif
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Tahap 6: Kontrak Sewa Aktif & Tiket Izin Operasional
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Seluruh tahapan verifikasi administrasi dan pembayaran telah tuntas. Sistem menerbitkan Tiket Izin Operasional Masuk Fasilitas resmi ber-barcode untuk ditunjukkan ke petugas bandara, serta naskah kontrak PKS berkekuatan hukum penuh.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs">
            <Printer className="w-4 h-4" />
            Cetak Tiket Izin Masuk
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Tiket Operasional Masuk Hanggar */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Plane className="w-48 h-48 text-white" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-700/80 gap-3">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-400">UPBU BANDARA MOZES KILANGIN TIMIKA</span>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">TIKET IZIN OPERASIONAL MASUK HANGGAR</h3>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-bold font-mono">
              STATUS: AKTIF & VALID
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Nomor Kontrak PKS:</span>
              <span className="font-bold text-white font-mono">553/PKS-HANGGAR/2026</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Fasilitas Terdaftar:</span>
              <span className="font-bold text-emerald-400">Hanggar A (Bay 02)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Armada Pesawat:</span>
              <span className="font-bold text-white font-mono">PK-MNA (Caravan)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Masa Tinggal:</span>
              <span className="font-bold text-white">10 Okt - 10 Nov 2026</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-white" />
              <span className="text-[11px]">Barcode resmi divalidasi oleh Petugas Apron & Avsec di pintu hanggar.</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold">
                Perpanjang Sewa (1-Click)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
