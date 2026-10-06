"use client";

import React, { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { warningService } from '@/services/warningService';
import { 
  FileText, 
  Home, 
  Search, 
  Loader2, 
  Mail, 
  Clock, 
  Printer, 
  Download, 
  X, 
  BellRing, 
  AlertTriangle, 
  ReceiptText, 
  FileCheck2, 
  CheckCircle2,
  ShieldAlert,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import { SuratPemberitahuan, SuratPemberitahuanData } from '@/components/SuratPemberitahuan';
import { SuratTeguran, SuratTeguranData } from '@/components/SuratTeguran';
import { SuratSTRD, StrdData } from '@/components/SuratSTRD';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function DinasPeringatanPage() {
  const { warnings, isLoading, error, fetchAllWarnings } = useWarningStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PEMBERITAHUAN' | 'TEGURAN' | 'STRD'>('ALL');
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal State untuk preview & cetak naskah dinas resmi
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const modalPrintRef = useRef<HTMLDivElement>(null);

  // State & Ref untuk generate PDF naskah dinas resmi di latar belakang sebelum dikirim email
  const [renderingDoc, setRenderingDoc] = useState<any | null>(null);
  const offscreenPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllWarnings();
  }, [fetchAllWarnings]);

  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      const res = await warningService.triggerWarningCheck();
      toast.success(res.message || 'Sinkronisasi penagihan berhasil dijalankan!');
      await fetchAllWarnings();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Gagal menjalankan sinkronisasi penagihan';
      toast.error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendEmail = async (warn: any) => {
    try {
      setSendingId(warn.id);
      toast.loading('Menyiapkan naskah dinas resmi (PDF)...', { id: `email-${warn.id}` });

      // Ambil elemen DOM yang siap dirender menjadi PDF
      let element: HTMLElement | null = null;
      if (selectedDoc && selectedDoc.id === warn.id && modalPrintRef.current) {
        element = modalPrintRef.current;
      } else {
        // Render dokumen secara sinkron ke offscreen DOM container
        flushSync(() => {
          setRenderingDoc(warn);
        });
        // Jeda 100ms agar font dan styling dokumen termuat sempurna
        await new Promise(r => setTimeout(r, 100));
        element = offscreenPrintRef.current;
      }

      let pdfBase64: string | undefined = undefined;
      const docType = (warn.type || 'Naskah_Dinas').replace(/\s+/g, '_');
      const filename = `${docType}_${(warn.warning_number || 'dokumen').replace(/[\/\\:]/g, '_')}_${(warn.tenants?.nama_perusahaan || 'Tenant').replace(/[\s\W]+/g, '_')}.pdf`;

      if (element) {
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          const opt = {
            margin: 0,
            filename,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
          };
          pdfBase64 = await html2pdf().set(opt).from(element).outputPdf('datauristring');
        } catch (pdfErr) {
          console.error('Gagal generate PDF attachment:', pdfErr);
        }
      }

      toast.loading('Mengirim email resmi beserta lampiran PDF...', { id: `email-${warn.id}` });
      const recipientEmail = warn.tenants?.email || warn.tenants?.users?.username;
      const res = await warningService.sendWarningEmail(warn.id, {
        recipient_email: recipientEmail,
        pdf_base64: pdfBase64,
        filename
      });

      toast.success(res.message || `Naskah dinas ${warn.warning_number} (PDF) berhasil dikirim ke email!`, { id: `email-${warn.id}` });
      fetchAllWarnings();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Gagal mengirim email penagihan';
      toast.error(msg, { id: `email-${warn.id}` });
    } finally {
      setSendingId(null);
      setRenderingDoc(null);
    }
  };

  const handlePrintModal = () => {
    window.print();
  };

  const handleDownloadPdfModal = async () => {
    if (!modalPrintRef.current || !selectedDoc) return;
    try {
      setIsDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = modalPrintRef.current;
      const docType = (selectedDoc.type || '').replace(/\s+/g, '_');
      const opt = {
        margin: 0,
        filename: `${docType}_${selectedDoc.warning_number?.replace(/\//g, '_')}_${(selectedDoc.tenants?.nama_perusahaan || 'Tenant').replace(/[\s\W]+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Naskah dinas PDF berhasil diunduh!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh dokumen PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // Mappers dari record warning ke masing-masing komponen cetak resmi
  const getPemberitahuanData = (warn: any): SuratPemberitahuanData => {
    const inv = warn.invoices;
    const tenant = warn.tenants;
    const dueDate = inv?.due_date || dayjs().add(7, 'day').format('YYYY-MM-DD');
    const daysLeft = Math.max(0, dayjs(dueDate).diff(dayjs(warn.created_at || Date.now()), 'day')) || 7;

    return {
      nomor_surat: warn.warning_number || '550/PB-H7/082/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warn.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: tenant?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: tenant?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: (tenant as any)?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      skrd_number: inv?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(inv?.created_at || Date.now()).format('YYYY-MM-DD'),
      due_date: dueDate,
      days_remaining: daysLeft,
      retribution_type: inv?.invoice_type || 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: `Kewajiban Pembayaran Retribusi Daerah SKRD No. ${inv?.invoice_number || ''}`,
      amount: Number(inv?.amount) || 0,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    };
  };

  const getTeguranData = (warn: any): SuratTeguranData => {
    const inv = warn.invoices;
    const tenant = warn.tenants;
    const dueDate = inv?.due_date || dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    const overdueDays = Math.max(7, dayjs().diff(dayjs(dueDate), 'day'));

    return {
      nomor_surat: warn.warning_number || '550/ST-H7/041/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warn.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: tenant?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: tenant?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: (tenant as any)?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      skrd_number: inv?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(inv?.created_at || Date.now()).format('YYYY-MM-DD'),
      pemberitahuan_ref_number: `PB-${dayjs().format('YYYYMM')}-${inv?.id || '01'}`,
      pemberitahuan_date: dayjs(dueDate).subtract(7, 'day').format('YYYY-MM-DD'),
      due_date: dueDate,
      overdue_days: overdueDays,
      teguran_deadline_days: 7,
      teguran_deadline_date: dayjs(warn.created_at || Date.now()).add(7, 'day').format('YYYY-MM-DD'),
      retribution_type: inv?.invoice_type || 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: `Kewajiban Pembayaran Retribusi Daerah SKRD No. ${inv?.invoice_number || ''}`,
      amount: Number(inv?.amount) || 0,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    };
  };

  const getStrdData = (warn: any): StrdData => {
    const inv = warn.invoices;
    const tenant = warn.tenants;
    const amount = Number(inv?.amount) || 0;
    const sanksiDenda = Math.round(amount * 0.01); // Sanksi bunga 1% per bulan (Pasal 21 ayat 8)

    return {
      strd_number: warn.warning_number || 'STRD/2026/10/001',
      retribution_type: inv?.invoice_type || 'Pemanfaatan Barang Milik Daerah (Hanggar & Apron)',
      tenant_name: tenant?.nama_perusahaan || 'PT Wajib Retribusi',
      phone_fax_email: `${tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Bandara Mozes Kilangin, Timika',
      npwdr: (tenant as any)?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      items: [
        { 
          year: new Date().getFullYear().toString(), 
          retribusi_terhutang: amount, 
          sanksi_denda: sanksiDenda, 
          jumlah_terhutang: amount + sanksiDenda 
        },
        { year: (new Date().getFullYear() - 1).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 2).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 3).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 4).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
      ],
      city: 'Timika',
      issue_date: dayjs(warn.created_at || Date.now()).format('YYYY-MM-DD'),
      official_title: 'Kepala Dinas Perhubungan',
      official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      official_nip: '19740510 200212 1 008',
      bank_name: 'Bank Papua Cabang Timika'
    };
  };

  // Filter Tab & Pencarian
  const filteredWarnings = warnings.filter(w => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || (
      (w.warning_number || '').toLowerCase().includes(s) ||
      (w.tenants?.nama_perusahaan || '').toLowerCase().includes(s) ||
      (w.invoices?.invoice_number || '').toLowerCase().includes(s)
    );

    if (!matchSearch) return false;

    const t = (w.type || '').toLowerCase();
    if (activeTab === 'PEMBERITAHUAN') return t.includes('pemberitahuan') || t === 'sp 1' || t === 'sp1';
    if (activeTab === 'TEGURAN') return t.includes('teguran') || t === 'sp 2' || t === 'sp2' || t === 'sp 3';
    if (activeTab === 'STRD') return t.includes('strd');

    return true;
  });

  // Statistik Ringkas
  const countPemberitahuan = warnings.filter(w => (w.type || '').toLowerCase().includes('pemberitahuan') || (w.type || '').toLowerCase() === 'sp 1').length;
  const countTeguran = warnings.filter(w => (w.type || '').toLowerCase().includes('teguran') || (w.type || '').toLowerCase() === 'sp 2').length;
  const countSTRD = warnings.filter(w => (w.type || '').toLowerCase().includes('strd')).length;

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[22px] font-bold text-[#333] flex items-center gap-2">
            Penagihan Piutang Retribusi Daerah
            <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded-none">
              Perbup Mimika No. 25 Tahun 2024
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penegakan kepatuhan wajib retribusi melalui urutan yuridis: <strong>Surat Pemberitahuan (H-7)</strong> &rarr; <strong>Surat Teguran (H+7)</strong> &rarr; <strong>STRD (Bunga 1%/bln)</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Jalankan pengecekan penagihan otomatis untuk mendeteksi SKRD H-7, H+7, dan STRD"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Memeriksa SKRD...' : 'Sinkronkan Penagihan (H-7 / H+7 / STRD)'}
          </button>
          <div className="text-[12px] text-[#777] hidden sm:flex items-center bg-[#ecf0f5] p-2">
            <span className="mr-1">Dinas</span> / <span className="ml-1 font-medium text-slate-700">Penagihan Retribusi</span>
          </div>
        </div>
      </header>

      {/* Baris Ringkasan Statistik & Akses Template Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 border-t-3 border-[#3c8dbc] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-bold">Total Naskah Dinas</div>
            <div className="text-2xl font-bold text-slate-800 mt-0.5">{warnings.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Surat penagihan diterbitkan</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-[#3c8dbc]">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 border-t-3 border-[#f39c12] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-amber-700 uppercase font-bold">Pemberitahuan (H-7)</div>
            <div className="text-2xl font-bold text-amber-700 mt-0.5">{countPemberitahuan}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">7 hari sblm jatuh tempo</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600">
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 border-t-3 border-[#dd4b39] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-red-700 uppercase font-bold">Surat Teguran (H+7)</div>
            <div className="text-2xl font-bold text-red-700 mt-0.5">{countTeguran}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">7 hari stlh jatuh tempo</div>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 border-t-3 border-[#00a65a] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-800 uppercase font-bold">Tagihan STRD Terbit</div>
            <div className="text-2xl font-bold text-emerald-700 mt-0.5">{countSTRD}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sanksi bunga 1%/bulan</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600">
            <ReceiptText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Links Menu ke Format Baku Naskah Dinas */}
      <div className="bg-slate-100 p-2.5 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-[#3c8dbc]" />
          Format Dokumen Baku Perbup Mimika 25/2024:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link 
            href="/dinas/template-surat-pemberitahuan"
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-300 text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <BellRing className="w-3.5 h-3.5" /> Template Pemberitahuan (H-7)
          </Link>
          <Link 
            href="/dinas/template-surat-teguran"
            className="px-2.5 py-1 bg-white hover:bg-red-50 border border-slate-300 text-red-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Template Surat Teguran (H+7)
          </Link>
          <Link 
            href="/dinas/template-strd"
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 text-emerald-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <ReceiptText className="w-3.5 h-3.5" /> Template STRD (Lampiran IV)
          </Link>
          <Link 
            href="/dinas/template-ssrd"
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Template SSRD (Lampiran III)
          </Link>
        </div>
      </div>

      {/* Main Table Box */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        
        {/* Tab Filter & Search Header */}
        <div className="p-3 border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-[#3c8dbc] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Penagihan ({warnings.length})
            </button>
            <button
              onClick={() => setActiveTab('PEMBERITAHUAN')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors cursor-pointer ${
                activeTab === 'PEMBERITAHUAN'
                  ? 'bg-[#f39c12] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Surat Pemberitahuan (H-7)
            </button>
            <button
              onClick={() => setActiveTab('TEGURAN')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors cursor-pointer ${
                activeTab === 'TEGURAN'
                  ? 'bg-[#dd4b39] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Surat Teguran (H+7)
            </button>
            <button
              onClick={() => setActiveTab('STRD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors cursor-pointer ${
                activeTab === 'STRD'
                  ? 'bg-[#00a65a] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Tagihan STRD
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari naskah / tenant / SKRD..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#d2d6de] pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#3c8dbc] w-full bg-white shadow-inner" 
            />
            <Search className="w-3.5 h-3.5 text-[#777] absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#3c8dbc]" /> Memuat data penagihan retribusi...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">NO. NASKAH DINAS</th>
                  <th className="py-3 px-4 font-bold">WAJIB RETRIBUSI</th>
                  <th className="py-3 px-4 font-bold">SKRD &amp; STATUS JATUH TEMPO</th>
                  <th className="py-3 px-4 font-bold text-center">TAHAP PENAGIHAN</th>
                  <th className="py-3 px-4 font-bold">URAIAN KETENTUAN</th>
                  <th className="py-3 px-4 font-bold">TANGGAL TERBIT</th>
                  <th className="py-3 px-4 font-bold text-center">AKSI DOKUMEN</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarnings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[#777]">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
                        <span className="font-semibold text-slate-800">Tidak ada tunggakan retribusi aktif pada kategori ini.</span>
                        <span className="text-xs text-slate-400">Seluruh mitra tertib mematuhi tanggal jatuh tempo SKRD.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWarnings.map((warn) => {
                    const isPb = (warn.type || '').toLowerCase().includes('pemberitahuan') || (warn.type || '').toLowerCase() === 'sp 1';
                    const isTg = (warn.type || '').toLowerCase().includes('teguran') || (warn.type || '').toLowerCase() === 'sp 2';
                    const isStrd = (warn.type || '').toLowerCase().includes('strd');

                    return (
                      <tr key={warn.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9] transition-colors">
                        
                        {/* No. Naskah Dinas */}
                        <td className="py-3 px-4 font-mono text-[12.5px] font-bold text-[#3c8dbc]">
                          {warn.warning_number}
                        </td>

                        {/* Wajib Retribusi */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#333]">{warn.tenants?.nama_perusahaan}</div>
                          <div className="text-xs text-gray-500 font-mono">NPWDR: {(warn.tenants as any)?.npwdr || warn.tenants?.npwp || '-'}</div>
                        </td>

                        {/* SKRD Terkait */}
                        <td className="py-3 px-4">
                          {warn.invoices ? (() => {
                            const diffDays = warn.invoices.due_date
                              ? dayjs().diff(dayjs(warn.invoices.due_date), 'day')
                              : 0;
                            return (
                              <div>
                                <div className="text-[#333] font-medium font-mono">{warn.invoices.invoice_number}</div>
                                <div className="text-xs text-slate-900 font-bold font-mono">{formatRupiah(Number(warn.invoices.amount))}</div>
                                {diffDays > 0 ? (
                                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                      <Clock className="w-2.5 h-2.5 text-red-600" />
                                      Telat {diffDays} Hari
                                    </span>
                                    {warn.invoices.due_date && (
                                      <span className="text-[10px] text-slate-400">
                                        (JT: {dayjs(warn.invoices.due_date).format('DD/MM/YYYY')})
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                      <BellRing className="w-2.5 h-2.5 text-blue-600" />
                                      Jatuh tempo {Math.abs(diffDays)} hari lagi
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })() : '-'}
                        </td>

                        {/* Tahap Penagihan */}
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={warn.type} />
                        </td>

                        {/* Uraian Pesan / Dasar Hukum */}
                        <td className="py-3 px-4 text-[12px] text-[#555] max-w-xs" title={warn.message || ''}>
                          <p className="line-clamp-2 m-0">{warn.message}</p>
                        </td>

                        {/* Tanggal Terbit */}
                        <td className="py-3 px-4 text-[12px] text-[#777] whitespace-nowrap">
                          {dayjs(warn.created_at).format('DD/MM/YYYY')}
                        </td>

                        {/* Aksi Dokumen (Cetak Resmi & Kirim Email) */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Tombol Buka & Cetak Dokumen Resmi */}
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(warn)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold rounded-none shadow-xs cursor-pointer transition-colors"
                              title="Buka Dokumen & Cetak Naskah Dinas Resmi"
                            >
                              <Printer className="w-3 h-3" />
                              Cetak
                            </button>

                            {/* Tombol Kirim Email Resmi */}
                            {warn.status === 'Email Sent' ? (
                              <button
                                type="button"
                                onClick={() => handleSendEmail(warn)}
                                disabled={sendingId === warn.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium border border-slate-300 cursor-pointer disabled:opacity-50"
                                title="Kirim Ulang Email Resmi"
                              >
                                {sendingId === warn.id ? 'Mengirim...' : 'Kirim Ulang'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSendEmail(warn)}
                                disabled={sendingId === warn.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[11px] font-semibold rounded-none shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                                title="Kirim Surat Penagihan ke Email Resmi Tenant"
                              >
                                {sendingId === warn.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Kirim...
                                  </>
                                ) : (
                                  <>
                                    <Mail className="w-3 h-3" />
                                    Email
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL PRATINJAU DOKUMEN NASKAH DINAS RESMI UNTUK CETAK    */}
      {/* ======================================================== */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-[#ecf0f5] border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col rounded-none print:max-w-none print:max-h-none print:shadow-none print:border-none">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    Pratinjau Dokumen Naskah Dinas Resmi: {selectedDoc.warning_number}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Tipe: <span className="font-semibold text-amber-300">{selectedDoc.type}</span> &bull; Wajib Retribusi: {selectedDoc.tenants?.nama_perusahaan}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendEmail(selectedDoc)}
                  disabled={sendingId === selectedDoc.id}
                  className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                  title="Kirim naskah dinas ini beserta lampiran PDF resmi ke email wajib retribusi"
                >
                  {sendingId === selectedDoc.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  {sendingId === selectedDoc.id ? 'Mengirim PDF...' : 'Kirim ke Email (PDF)'}
                </button>
                <button
                  type="button"
                  onClick={handlePrintModal}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak (Print)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdfModal}
                  disabled={isDownloading}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloading ? 'Memproses...' : 'Unduh PDF'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 bg-slate-700 hover:bg-red-700 text-white rounded-none cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Document Viewer Body */}
            <div className="p-3 sm:p-6 overflow-y-auto flex justify-center bg-slate-300/80 print:p-0 print:bg-white">
              <div className="bg-white shadow-xl print:shadow-none">
                {(() => {
                  const t = (selectedDoc.type || '').toLowerCase();
                  if (t.includes('pemberitahuan') || t === 'sp 1') {
                    return <SuratPemberitahuan ref={modalPrintRef} data={getPemberitahuanData(selectedDoc)} />;
                  } else if (t.includes('teguran') || t === 'sp 2' || t === 'sp 3') {
                    return <SuratTeguran ref={modalPrintRef} data={getTeguranData(selectedDoc)} />;
                  } else if (t.includes('strd')) {
                    return <SuratSTRD ref={modalPrintRef} data={getStrdData(selectedDoc)} />;
                  } else {
                    return <SuratPemberitahuan ref={modalPrintRef} data={getPemberitahuanData(selectedDoc)} />;
                  }
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Offscreen container untuk generate PDF attachment otomatis saat kirim email dari tabel */}
      <div 
        className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none z-[-1]" 
        aria-hidden="true"
      >
        {renderingDoc && (
          <div ref={offscreenPrintRef} className="bg-white">
            {(() => {
              const t = (renderingDoc.type || '').toLowerCase();
              if (t.includes('pemberitahuan') || t === 'sp 1') {
                return <SuratPemberitahuan data={getPemberitahuanData(renderingDoc)} />;
              } else if (t.includes('teguran') || t === 'sp 2' || t === 'sp 3') {
                return <SuratTeguran data={getTeguranData(renderingDoc)} />;
              } else if (t.includes('strd')) {
                return <SuratSTRD data={getStrdData(renderingDoc)} />;
              } else {
                return <SuratPemberitahuan data={getPemberitahuanData(renderingDoc)} />;
              }
            })()}
          </div>
        )}
      </div>

    </div>
  );
}
