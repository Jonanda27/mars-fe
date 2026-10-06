"use client";

import React, { useState, useRef } from 'react';
import { SuratPemberitahuan, SuratPemberitahuanData, defaultPemberitahuanDummy } from '@/components/SuratPemberitahuan';
import { 
  Printer, 
  Download, 
  BellRing, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  Building,
  Plane,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const dummyScenarios: { id: string; label: string; icon: string; data: SuratPemberitahuanData }[] = [
  {
    id: 'hanggar-smart',
    label: 'Kasus 1: Sewa Hanggar Sisi Timur (PT Smart Cakrawala Aviation)',
    icon: 'hanggar',
    data: {
      nomor_surat: '550/PB-H7/082/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT SMART CAKRAWALA AVIATION',
      pic_name: 'Pimpinan / Direktur Operasional',
      phone_email: '(0901) 321778 / info@smartaviation.co.id',
      address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
      npwdr: '91.823.412.5-953.000',
      skrd_number: 'SKRD/2026/09/019',
      skrd_date: dayjs().subtract(23, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      days_remaining: 7,
      retribution_type: 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: 'Sewa Fasilitas Hanggar dan Apron Sisi Timur Bandara Mozes Kilangin Periode Oktober 2026',
      amount: 35000000,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    }
  },
  {
    id: 'ruangan-trigana',
    label: 'Kasus 2: Sewa Ruangan Gedung Operasional (PT Trigana Air Service)',
    icon: 'ruangan',
    data: {
      nomor_surat: '550/PB-H7/083/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT TRIGANA AIR SERVICE',
      pic_name: 'Station Manager Timika',
      phone_email: '(0901) 322441 / contact@trigana-air.com',
      address: 'Gedung Operasional Airside Lt. 1, Bandara Mozes Kilangin, Timika',
      npwdr: '01.554.218.4-953.000',
      skrd_number: 'SKRD/2026/09/022',
      skrd_date: dayjs().subtract(23, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      days_remaining: 7,
      retribution_type: 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: 'Sewa Ruangan Kantor Operasional Flight Dispatch Bandara Mozes Kilangin Periode Oktober 2026',
      amount: 18500000,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    }
  },
  {
    id: 'apron-asianone',
    label: 'Kasus 3: Retribusi Parkir Apron Pesawat (PT Asian One Air)',
    icon: 'apron',
    data: {
      nomor_surat: '550/PB-H7/084/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT ASIAN ONE AIR',
      pic_name: 'Direktur Keuangan & Operasi',
      phone_email: '(0901) 329002 / finance@asianoneair.co.id',
      address: 'Apron Terminal Kargo, Bandara Mozes Kilangin, Timika',
      npwdr: '82.912.771.2-953.000',
      skrd_number: 'SKRD/2026/09/025',
      skrd_date: dayjs().subtract(23, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      days_remaining: 7,
      retribution_type: 'Penyediaan Tempat Khusus Parkir di Luar Badan Jalan',
      uraian_retribusi: 'Pelayanan Parkir & Penempatan Armada Pesawat Udara Apron Mozes Kilangin',
      amount: 12000000,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    }
  }
];

export default function TemplateSuratPemberitahuanPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('hanggar-smart');
  const [formData, setFormData] = useState<SuratPemberitahuanData>(dummyScenarios[0].data);
  const [isDownloading, setIsDownloading] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  const handleSelectScenario = (id: string) => {
    setSelectedScenario(id);
    const found = dummyScenarios.find(s => s.id === id);
    if (found) {
      setFormData(found.data);
      toast.success(`Memuat skenario: ${found.label}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    try {
      setIsDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = docRef.current;
      const opt = {
        margin: 0,
        filename: `Surat_Pemberitahuan_H7_${formData.skrd_number.replace(/\//g, '_')}_${formData.tenant_name.replace(/[\s\W]+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen Surat Pemberitahuan PDF berhasil diunduh!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh dokumen PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#ecf0f5] min-h-screen space-y-5 font-sans">
      
      {/* Header Halaman (Screen only) */}
      <div className="bg-white p-5 border-t-3 border-[#3c8dbc] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-none">
              <BellRing className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Format Resmi Surat Pemberitahuan (H-7)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Baku Naskah Dinas <strong>Pasal 21 ayat (2), (3), dan (5) Perbup Mimika No. 25 Tahun 2024</strong> &bull; Disampaikan 7 hari sebelum jatuh tempo SKRD.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen (Print)
          </button>
          
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Memproses PDF...' : 'Unduh PDF Resmi'}
          </button>
        </div>
      </div>

      {/* Info Panel Regulasi & Alur Hukum Perbup (Screen only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
        <div className="bg-white p-3.5 border-l-4 border-blue-600 shadow-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">1. Tahap Pertama Penagihan</strong>
            Sesuai Pasal 21 ayat (2), penagihan retribusi didahului surat pemberitahuan dan surat teguran (menggantikan istilah SP 1 / SP 2 swasta).
          </div>
        </div>

        <div className="bg-white p-3.5 border-l-4 border-amber-600 shadow-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">2. Waktu Penyampaian: H-7</strong>
            Pasal 21 ayat (3) mewajibkan dinas menyampaikan surat pemberitahuan tepat 7 hari sebelum tanggal jatuh tempo SKRD berakhir.
          </div>
        </div>

        <div className="bg-white p-3.5 border-l-4 border-emerald-600 shadow-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">3. Distribusi 3 Rangkap</strong>
            Pasal 21 ayat (5): Lembar 1 untuk Wajib Retribusi, Lembar 2 untuk Dinas Perhubungan, dan Lembar 3 untuk Bapenda.
          </div>
        </div>
      </div>

      {/* Pilihan Skenario Uji Coba Data Dummy (Screen only) */}
      <div className="bg-white p-4 border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2 mb-3 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#3c8dbc]" />
          Pilih Contoh Data Wajib Retribusi (Uji Coba Tampilan Dokumen)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dummyScenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`text-left p-3 border rounded-none transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'border-[#3c8dbc] bg-blue-50/70 text-blue-900 font-medium' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {sc.icon === 'hanggar' ? (
                    <Building className={`w-4 h-4 ${isSelected ? 'text-[#3c8dbc]' : 'text-slate-400'}`} />
                  ) : sc.icon === 'ruangan' ? (
                    <Building className={`w-4 h-4 ${isSelected ? 'text-[#3c8dbc]' : 'text-slate-400'}`} />
                  ) : (
                    <Plane className={`w-4 h-4 ${isSelected ? 'text-[#3c8dbc]' : 'text-slate-400'}`} />
                  )}
                  <div>
                    <div className="text-xs font-semibold">{sc.label}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Ketetapan: Rp {sc.data.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#3c8dbc]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* AREA PRATINJAU DOKUMEN CETAK A4                          */}
      {/* ======================================================== */}
      <div className="flex justify-center p-2 sm:p-6 bg-slate-200/80 rounded-none shadow-inner print:p-0 print:bg-white">
        <div className="shadow-2xl print:shadow-none bg-white">
          <SuratPemberitahuan ref={docRef} data={formData} />
        </div>
      </div>

    </div>
  );
}
