"use client";

import React, { useState, useRef } from 'react';
import { SuratTeguran, SuratTeguranData, defaultTeguranDummy } from '@/components/SuratTeguran';
import { 
  Printer, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  Building,
  Plane,
  ShieldAlert,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const dummyScenarios: { id: string; label: string; icon: string; data: SuratTeguranData }[] = [
  {
    id: 'hanggar-smart',
    label: 'Kasus 1: Tunggakan Sewa Hanggar (PT Smart Cakrawala Aviation)',
    icon: 'hanggar',
    data: {
      nomor_surat: '550/ST-H7/041/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT SMART CAKRAWALA AVIATION',
      pic_name: 'Pimpinan / Direktur Operasional',
      phone_email: '(0901) 321778 / info@smartaviation.co.id',
      address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
      npwdr: '91.823.412.5-953.000',
      skrd_number: 'SKRD/2026/09/019',
      skrd_date: dayjs().subtract(37, 'day').format('YYYY-MM-DD'),
      pemberitahuan_ref_number: '550/PB-H7/082/DISHUB/X/2026',
      pemberitahuan_date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      overdue_days: 7,
      teguran_deadline_days: 7,
      teguran_deadline_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
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
    label: 'Kasus 2: Tunggakan Sewa Ruangan Gedung (PT Trigana Air Service)',
    icon: 'ruangan',
    data: {
      nomor_surat: '550/ST-H7/042/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT TRIGANA AIR SERVICE',
      pic_name: 'Station Manager Timika',
      phone_email: '(0901) 322441 / contact@trigana-air.com',
      address: 'Gedung Operasional Airside Lt. 1, Bandara Mozes Kilangin, Timika',
      npwdr: '01.554.218.4-953.000',
      skrd_number: 'SKRD/2026/09/022',
      skrd_date: dayjs().subtract(37, 'day').format('YYYY-MM-DD'),
      pemberitahuan_ref_number: '550/PB-H7/083/DISHUB/X/2026',
      pemberitahuan_date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      overdue_days: 7,
      teguran_deadline_days: 7,
      teguran_deadline_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
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
    label: 'Kasus 3: Tunggakan Parkir Apron Pesawat (PT Asian One Air)',
    icon: 'apron',
    data: {
      nomor_surat: '550/ST-H7/043/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs().format('YYYY-MM-DD'),
      tenant_name: 'PT ASIAN ONE AIR',
      pic_name: 'Direktur Keuangan & Operasi',
      phone_email: '(0901) 329002 / finance@asianoneair.co.id',
      address: 'Apron Terminal Kargo, Bandara Mozes Kilangin, Timika',
      npwdr: '82.912.771.2-953.000',
      skrd_number: 'SKRD/2026/09/025',
      skrd_date: dayjs().subtract(37, 'day').format('YYYY-MM-DD'),
      pemberitahuan_ref_number: '550/PB-H7/084/DISHUB/X/2026',
      pemberitahuan_date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
      due_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      overdue_days: 7,
      teguran_deadline_days: 7,
      teguran_deadline_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
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

export default function TemplateSuratTeguranPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('hanggar-smart');
  const [formData, setFormData] = useState<SuratTeguranData>(dummyScenarios[0].data);
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
        filename: `Surat_Teguran_H7_${formData.skrd_number.replace(/\//g, '_')}_${formData.tenant_name.replace(/[\s\W]+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen Surat Teguran PDF resmi berhasil diunduh!');
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
      <div className="bg-white p-5 border-t-3 border-[#dd4b39] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-100 text-red-800 rounded-none">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Format Resmi Surat Teguran (H+7)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Baku Naskah Dinas <strong>Pasal 21 ayat (2), (4), (5), (6) Perbup Mimika No. 25 Tahun 2024</strong> &bull; Disampaikan 7 hari setelah jatuh tempo SKRD terlewati.
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
            className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c9302c] text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Memproses PDF...' : 'Unduh PDF Resmi'}
          </button>
        </div>
      </div>

      {/* Info Panel Ketentuan Hukum Teguran H+7 (Screen only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
        <div className="bg-white p-3.5 border-l-4 border-red-600 shadow-xs flex items-start gap-3">
          <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">1. Pemicu: Telat 7 Hari (H+7)</strong>
            Pasal 21 ayat (4): Surat teguran disampaikan apabila 7 hari setelah jatuh tempo pembayaran SKRD wajib retribusi belum melunasi kewajibannya.
          </div>
        </div>

        <div className="bg-white p-3.5 border-l-4 border-amber-600 shadow-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">2. Batas Pelunasan: 7 Hari</strong>
            Pasal 21 ayat (6): Wajib retribusi wajib melunasi retribusi terutang paling lama 7 hari setelah Surat Teguran diterbitkan sebelum STRD diterbitkan.
          </div>
        </div>

        <div className="bg-white p-3.5 border-l-4 border-slate-700 shadow-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block text-slate-900 font-bold mb-0.5">3. Distribusi 3 Rangkap &amp; STRD</strong>
            Pasal 21 ayat (5): 3 rangkap (WR, Dishub, Bapenda). Bila lewat 7 hari tetap mangkir, STRD terbit dengan bunga 1%/bulan (Pasal 21 ayat 7-8).
          </div>
        </div>
      </div>

      {/* Pilihan Skenario Uji Coba Data Dummy (Screen only) */}
      <div className="bg-white p-4 border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2 mb-3 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#dd4b39]" />
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
                    ? 'border-[#dd4b39] bg-red-50/70 text-red-950 font-medium' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {sc.icon === 'hanggar' ? (
                    <Building className={`w-4 h-4 ${isSelected ? 'text-[#dd4b39]' : 'text-slate-400'}`} />
                  ) : sc.icon === 'ruangan' ? (
                    <Building className={`w-4 h-4 ${isSelected ? 'text-[#dd4b39]' : 'text-slate-400'}`} />
                  ) : (
                    <Plane className={`w-4 h-4 ${isSelected ? 'text-[#dd4b39]' : 'text-slate-400'}`} />
                  )}
                  <div>
                    <div className="text-xs font-semibold">{sc.label}</div>
                    <div className="text-[11px] text-red-800 font-mono mt-0.5">
                      Tunggakan Pokok: Rp {sc.data.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#dd4b39]" />}
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
          <SuratTeguran ref={docRef} data={formData} />
        </div>
      </div>

    </div>
  );
}
