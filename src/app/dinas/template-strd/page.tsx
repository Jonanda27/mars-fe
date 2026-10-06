"use client";

import React, { useState, useRef } from 'react';
import { SuratSTRD, StrdData, defaultStrdDummy } from '@/components/SuratSTRD';
import { 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  Building,
  Plane
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const dummyScenarios: { id: string; label: string; icon: string; data: StrdData }[] = [
  {
    id: 'hanggar-smart',
    label: 'Kasus 1: Sewa Hanggar Mozes Kilangin (PT Smart Cakrawala Aviation)',
    icon: 'hanggar',
    data: {
      strd_number: 'STRD/2026/10/001',
      retribution_type: 'Pemanfaatan Barang Milik Daerah (Sewa Hanggar & Apron)',
      tenant_name: 'PT SMART CAKRAWALA AVIATION',
      phone_fax_email: '(0901) 321778 / info@smartaviation.co.id',
      address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
      npwdr: '91.823.412.5-953.000',
      items: [
        { year: '2026', retribusi_terhutang: 35000000, sanksi_denda: 700000, jumlah_terhutang: 35700000 },
        { year: '2025', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2024', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2023', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2022', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
      ],
      city: 'Timika',
      issue_date: dayjs().format('YYYY-MM-DD'),
      official_title: 'Kepala Dinas Perhubungan',
      official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      official_nip: '19740510 200212 1 008',
      bank_name: 'Bank Papua Cabang Timika'
    }
  },
  {
    id: 'ruangan-trigana',
    label: 'Kasus 2: Sewa Ruangan Gedung Operasional (PT Trigana Air Service)',
    icon: 'ruangan',
    data: {
      strd_number: 'STRD/2026/10/002',
      retribution_type: 'Pemanfaatan Barang Milik Daerah (Sewa Ruangan Kantor Airside)',
      tenant_name: 'PT TRIGANA AIR SERVICE',
      phone_fax_email: '(0901) 322441 / contact@trigana-air.com',
      address: 'Gedung Operasional Airside Lt. 1, Bandara Mozes Kilangin, Timika',
      npwdr: '01.554.218.4-953.000',
      items: [
        { year: '2026', retribusi_terhutang: 18500000, sanksi_denda: 370000, jumlah_terhutang: 18870000 },
        { year: '2025', retribusi_terhutang: 6000000, sanksi_denda: 180000, jumlah_terhutang: 6180000 },
        { year: '2024', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2023', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2022', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
      ],
      city: 'Timika',
      issue_date: dayjs().format('YYYY-MM-DD'),
      official_title: 'Kepala Dinas Perhubungan',
      official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      official_nip: '19740510 200212 1 008',
      bank_name: 'Bank Papua Cabang Timika'
    }
  },
  {
    id: 'apron-asianone',
    label: 'Kasus 3: Retribusi Pelayanan Apron Pesawat (PT Asian One Air)',
    icon: 'apron',
    data: {
      strd_number: 'STRD/2026/10/003',
      retribution_type: 'Pemanfaatan Tempat Khusus Parkir & Apron Pesawat Udara',
      tenant_name: 'PT ASIAN ONE AIR',
      phone_fax_email: '(0901) 329002 / finance@asianoneair.co.id',
      address: 'Apron Terminal Kargo, Bandara Mozes Kilangin, Timika',
      npwdr: '82.912.771.2-953.000',
      items: [
        { year: '2026', retribusi_terhutang: 12000000, sanksi_denda: 360000, jumlah_terhutang: 12360000 },
        { year: '2025', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2024', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2023', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: '2022', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
      ],
      city: 'Timika',
      issue_date: dayjs().format('YYYY-MM-DD'),
      official_title: 'Kepala Dinas Perhubungan',
      official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      official_nip: '19740510 200212 1 008',
      bank_name: 'Bank Papua Cabang Timika'
    }
  }
];

export default function TemplateStrdPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('hanggar-smart');
  const [formData, setFormData] = useState<StrdData>(dummyScenarios[0].data);
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
        filename: `${formData.strd_number.replace(/\//g, '_')}_${formData.tenant_name.replace(/[\s\W]+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen STRD PDF resmi berhasil diunduh!');
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
      <div className="bg-white p-5 border-t-3 border-[#00a65a] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-none">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Format Surat Tagihan Retribusi Daerah (STRD)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Baku Lampiran IV <strong>Perbup Mimika No. 25 Tahun 2024</strong> &bull; Rekapitulasi Piutang &amp; Sanksi Bunga per Tahun/Masa Pajak.
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
            Cetak Dokumen STRD
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Membuat PDF...' : 'Unduh PDF Resmi'}
          </button>
        </div>
      </div>

      {/* Skenario Switcher (Screen only) */}
      <div className="bg-white p-4 border border-slate-200 shadow-xs print:hidden space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Pilih Contoh Data Dummy:
          </label>
          <span className="text-[11px] text-slate-400">Klik untuk mengganti rincian data piutang</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dummyScenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            const total = sc.data.items.reduce((acc, c) => acc + c.jumlah_terhutang, 0);
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-3 text-left border text-xs transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-600' 
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[11px] text-slate-500">
                    {sc.id === 'hanggar-smart' ? 'Hanggar Mozes' : sc.id === 'ruangan-trigana' ? 'Ruangan Airside' : 'Apron Pesawat'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-bold text-slate-900 leading-snug">{sc.data.tenant_name}</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-mono font-bold">
                  Total Piutang + Denda: Rp {total.toLocaleString('id-ID')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PREVIEW LEMBAR DOKUMEN STRD A4 RESMI */}
      <div className="flex justify-center p-2 sm:p-6 bg-slate-200 print:bg-white print:p-0 shadow-inner rounded-none">
        <div className="shadow-2xl print:shadow-none bg-white">
          <SuratSTRD data={formData} ref={docRef} />
        </div>
      </div>

    </div>
  );
}
