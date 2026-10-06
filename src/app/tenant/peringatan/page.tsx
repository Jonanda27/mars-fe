"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { AlertTriangle, Home, Loader2, Clock, Printer, Download, X, FileText, CheckCircle2, BellRing, ShieldAlert } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import { SuratPemberitahuan, SuratPemberitahuanData } from '@/components/SuratPemberitahuan';
import { SuratTeguran, SuratTeguranData } from '@/components/SuratTeguran';
import { SuratSTRD, StrdData } from '@/components/SuratSTRD';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function TenantPeringatanPage() {
  const { tenantWarnings, isLoading, error, fetchTenantWarnings } = useWarningStore();
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTenantWarnings();
  }, [fetchTenantWarnings]);

  const handlePrintModal = () => {
    window.print();
  };

  const handleDownloadPdfModal = async () => {
    if (!printRef.current || !selectedDoc) return;
    try {
      setIsDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;
      const docType = (selectedDoc.type || '').replace(/\s+/g, '_');
      const opt = {
        margin: 0,
        filename: `${docType}_${selectedDoc.warning_number?.replace(/\//g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen PDF resmi berhasil diunduh!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh dokumen PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const getPemberitahuanData = (warn: any): SuratPemberitahuanData => {
    const inv = warn.invoices;
    const dueDate = inv?.due_date || dayjs().add(7, 'day').format('YYYY-MM-DD');
    return {
      nomor_surat: warn.warning_number || '550/PB-H7/082/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warn.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: warn.tenants?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: warn.tenants?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${warn.tenants?.no_telepon || '(0901) 321778'} / ${warn.tenants?.email || 'operator@bandara.com'}`,
      address: warn.tenants?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: (warn.tenants as any)?.npwdr || warn.tenants?.npwp || '91.823.412.5-953.000',
      skrd_number: inv?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(inv?.created_at || Date.now()).format('YYYY-MM-DD'),
      due_date: dueDate,
      days_remaining: Math.max(0, dayjs(dueDate).diff(dayjs(warn.created_at || Date.now()), 'day')) || 7,
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
    const dueDate = inv?.due_date || dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    return {
      nomor_surat: warn.warning_number || '550/ST-H7/041/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warn.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: warn.tenants?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: warn.tenants?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${warn.tenants?.no_telepon || '(0901) 321778'} / ${warn.tenants?.email || 'operator@bandara.com'}`,
      address: warn.tenants?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: (warn.tenants as any)?.npwdr || warn.tenants?.npwp || '91.823.412.5-953.000',
      skrd_number: inv?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(inv?.created_at || Date.now()).format('YYYY-MM-DD'),
      pemberitahuan_ref_number: `PB-${dayjs().format('YYYYMM')}-${inv?.id || '01'}`,
      pemberitahuan_date: dayjs(dueDate).subtract(7, 'day').format('YYYY-MM-DD'),
      due_date: dueDate,
      overdue_days: Math.max(7, dayjs().diff(dayjs(dueDate), 'day')),
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
    const amount = Number(inv?.amount) || 0;
    const sanksiDenda = Math.round(amount * 0.01);
    return {
      strd_number: warn.warning_number || 'STRD/2026/10/001',
      retribution_type: inv?.invoice_type || 'Pemanfaatan Barang Milik Daerah (Hanggar & Apron)',
      tenant_name: warn.tenants?.nama_perusahaan || 'PT Wajib Retribusi',
      phone_fax_email: `${warn.tenants?.no_telepon || '(0901) 321778'} / ${warn.tenants?.email || 'operator@bandara.com'}`,
      address: warn.tenants?.alamat || 'Bandara Mozes Kilangin, Timika',
      npwdr: (warn.tenants as any)?.npwdr || warn.tenants?.npwp || '91.823.412.5-953.000',
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-10 flex justify-center items-center text-[#777]">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#3c8dbc]" /> Memuat surat penagihan retribusi...
        </div>
      );
    }

    if (error) {
      return <div className="p-6 text-center text-red-500 bg-red-50">{error}</div>;
    }

    return (
      <table className="w-full text-[13px] text-left border-collapse">
        <thead>
          <tr className="border-b border-[#f4f4f4] bg-slate-50 text-[#333]">
            <th className="py-3 px-4 font-bold">NO. NASKAH DINAS</th>
            <th className="py-3 px-4 font-bold">SKRD TERKAIT</th>
            <th className="py-3 px-4 font-bold text-center">TAHAP PENAGIHAN</th>
            <th className="py-3 px-4 font-bold">PESAN KETENTUAN HUKUM</th>
            <th className="py-3 px-4 font-bold">TANGGAL TERBIT</th>
            <th className="py-3 px-4 font-bold text-center">DOKUMEN RESMI</th>
          </tr>
        </thead>
        <tbody>
          {tenantWarnings.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[#777]">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-800">Tidak ada surat pemberitahuan atau teguran aktif.</p>
                  <p className="text-xs mt-1 text-gray-500">Terima kasih atas kepatuhan Anda membayar retribusi daerah tepat waktu.</p>
                </div>
              </td>
            </tr>
          ) : (
            tenantWarnings.map((warn) => (
              <tr key={warn.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9] transition-colors">
                <td className="py-3 px-4 font-mono text-[12.5px] font-bold text-[#3c8dbc]">
                  {warn.warning_number}
                </td>
                <td className="py-3 px-4">
                  {warn.invoices ? (() => {
                    const diffDays = warn.invoices.due_date
                      ? dayjs().diff(dayjs(warn.invoices.due_date), 'day')
                      : 0;
                    return (
                      <div>
                        <div className="text-[#3c8dbc] font-medium font-mono">
                          <Link href={`/tenant/tagihan`} className="hover:underline">
                            {warn.invoices.invoice_number}
                          </Link>
                        </div>
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
                <td className="py-3 px-4 text-center">
                  <StatusBadge status={warn.type} />
                </td>
                <td className="py-3 px-4 text-[12.5px] text-[#555] max-w-xs">
                  {warn.message}
                </td>
                <td className="py-3 px-4 text-[12px] text-[#777] whitespace-nowrap">
                  {dayjs(warn.created_at).format('DD/MM/YYYY')}
                </td>
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(warn)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold shadow-xs cursor-pointer transition-colors"
                  >
                    <Printer className="w-3 h-3" />
                    Lihat Dokumen
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[22px] font-bold text-[#333] flex items-center gap-2">
            Surat Pemberitahuan &amp; Teguran Retribusi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Naskah dinas resmi pemungutan retribusi daerah sesuai <strong>Peraturan Bupati Mimika Nomor 25 Tahun 2024</strong>.
          </p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <Home className="w-3 h-3 mr-1" /> <span className="mr-1">Home</span> / <span className="ml-1 font-medium text-slate-700">Surat Penagihan</span>
        </div>
      </header>

      {tenantWarnings.length > 0 && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 shadow-xs flex items-start">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-amber-600" />
          <div className="text-xs">
            <h4 className="font-bold text-sm">Pemberitahuan Kewajiban Pembayaran</h4>
            <p className="mt-1 leading-relaxed">
              Terdapat naskah dinas penagihan retribusi aktif dari Dinas Perhubungan Kabupaten Mimika. Mohon segera melakukan pelunasan ke <strong>Rekening Kas Daerah (Bank Papua)</strong> sebelum tanggal jatuh tempo atau batas akhir teguran untuk menghindari pengenaan sanksi administrasi bunga 1% per bulan dan penerbitan STRD.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-3 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[15px] text-[#444] font-bold flex items-center">
            <FileText className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Kotak Masuk Surat Penagihan Dinas
          </h3>
        </div>

        <div className="p-0 overflow-x-auto">
          {renderContent()}
        </div>
      </div>

      {/* Modal Pratinjau & Cetak Dokumen Naskah Dinas */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-[#ecf0f5] border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col rounded-none print:max-w-none print:max-h-none print:shadow-none print:border-none">
            
            <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    Dokumen Resmi Dinas: {selectedDoc.warning_number}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Klasifikasi: <span className="font-semibold text-amber-300">{selectedDoc.type}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
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

            <div className="p-3 sm:p-6 overflow-y-auto flex justify-center bg-slate-300/80 print:p-0 print:bg-white">
              <div className="bg-white shadow-xl print:shadow-none">
                {(() => {
                  const t = (selectedDoc.type || '').toLowerCase();
                  if (t.includes('pemberitahuan') || t === 'sp 1') {
                    return <SuratPemberitahuan ref={printRef} data={getPemberitahuanData(selectedDoc)} />;
                  } else if (t.includes('teguran') || t === 'sp 2' || t === 'sp 3') {
                    return <SuratTeguran ref={printRef} data={getTeguranData(selectedDoc)} />;
                  } else if (t.includes('strd')) {
                    return <SuratSTRD ref={printRef} data={getStrdData(selectedDoc)} />;
                  } else {
                    return <SuratPemberitahuan ref={printRef} data={getPemberitahuanData(selectedDoc)} />;
                  }
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
