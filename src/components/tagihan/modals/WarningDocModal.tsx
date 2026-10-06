"use client";

import React, { useRef, useState } from 'react';
import { X, Download, Printer, FileText, AlertTriangle } from 'lucide-react';
import { Invoice, InvoiceWarning } from '@/types/invoice';
import { SuratSTRD, StrdData } from '@/components/SuratSTRD';
import { SuratTeguran, SuratTeguranData } from '@/components/SuratTeguran';
import { SuratPemberitahuan, SuratPemberitahuanData } from '@/components/SuratPemberitahuan';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

interface WarningDocModalProps {
  readonly isOpen: boolean;
  readonly warning: InvoiceWarning | null;
  readonly invoice: Invoice | null;
  readonly onClose: () => void;
}

export const WarningDocModal: React.FC<WarningDocModalProps> = ({
  isOpen,
  warning,
  invoice,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !warning) return null;

  const isStrd = (warning.type || '').toUpperCase().includes('STRD');
  const isTeguran = (warning.type || '').toUpperCase().includes('TEGURAN');
  const isPemberitahuan = (warning.type || '').toUpperCase().includes('PEMBERITAHUAN');

  const getDocTitle = () => {
    if (isStrd) return 'Surat Tagihan Retribusi Daerah (STRD)';
    if (isTeguran) return 'Surat Teguran Keterlambatan Pembayaran (H+7)';
    if (isPemberitahuan) return 'Surat Pemberitahuan Jatuh Tempo (H-7)';
    return 'Naskah Dinas Resmi Penagihan';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current || !warning) return;
    try {
      setIsDownloading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;
      const docType = (warning.type || 'Dokumen').replace(/\s+/g, '_');
      const filename = `${docType}_${(warning.warning_number || 'dokumen').replace(/[\/\\:]/g, '_')}.pdf`;

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Dokumen PDF berhasil diunduh!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh dokumen PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStrdData = (): StrdData => {
    const tenant = invoice?.contracts?.tenants || invoice?.tenants || warning.tenants;
    const amount = Number(invoice?.amount || 0);
    const penalty = Number(invoice?.penalty_amount || 0) || Math.round(amount * 0.01);
    const currentYear = new Date().getFullYear().toString();

    return {
      strd_number: warning.warning_number || 'STRD/2026/10/001',
      retribution_type: invoice?.invoice_type || 'Pemanfaatan Barang Milik Daerah (Sewa Hanggar & Apron)',
      tenant_name: tenant?.nama_perusahaan || 'PT SMART CAKRAWALA AVIATION',
      phone_fax_email: `${tenant?.nomor_telepon || tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
      npwdr: tenant?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      items: [
        {
          year: currentYear,
          retribusi_terhutang: amount,
          sanksi_denda: penalty,
          jumlah_terhutang: amount + penalty
        },
        { year: (new Date().getFullYear() - 1).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 2).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 3).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
        { year: (new Date().getFullYear() - 4).toString(), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
      ],
      city: 'Timika',
      issue_date: dayjs(warning.created_at || Date.now()).format('YYYY-MM-DD'),
      official_title: 'Kepala Dinas Perhubungan',
      official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      official_nip: '19740510 200212 1 008',
      bank_name: 'Bank Papua Cabang Timika'
    };
  };

  const getTeguranData = (): SuratTeguranData => {
    const tenant = invoice?.contracts?.tenants || invoice?.tenants || warning.tenants;
    const dueDate = invoice?.due_date || dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    const overdueDays = Math.max(7, dayjs().diff(dayjs(dueDate), 'day'));
    const amount = Number(invoice?.amount || 0);

    return {
      nomor_surat: warning.warning_number || '550/ST-H7/041/DISHUB/X/2026',
      sifat: 'Segera / Peringatan Keras',
      lampiran: '1 (satu) Berkas Salinan SKRD & Surat Pemberitahuan',
      perihal: 'SURAT TEGURAN ATAS TUNGGAKAN PEMBAYARAN RETRIBUSI DAERAH (H+7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warning.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: tenant?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: tenant?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${tenant?.nomor_telepon || tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: tenant?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      skrd_number: invoice?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(invoice?.created_at || Date.now()).format('YYYY-MM-DD'),
      pemberitahuan_ref_number: `PB-${dayjs().format('YYYYMM')}-${invoice?.id || '01'}`,
      pemberitahuan_date: dayjs(dueDate).subtract(7, 'day').format('YYYY-MM-DD'),
      due_date: dueDate,
      overdue_days: overdueDays,
      teguran_deadline_days: 7,
      teguran_deadline_date: dayjs(warning.created_at || Date.now()).add(7, 'day').format('YYYY-MM-DD'),
      retribution_type: invoice?.invoice_type || 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: `Kewajiban Pembayaran Retribusi Daerah SKRD No. ${invoice?.invoice_number || ''}`,
      amount: amount,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    };
  };

  const getPemberitahuanData = (): SuratPemberitahuanData => {
    const tenant = invoice?.contracts?.tenants || invoice?.tenants || warning.tenants;
    const dueDate = invoice?.due_date || dayjs().add(7, 'day').format('YYYY-MM-DD');
    const daysLeft = Math.max(0, dayjs(dueDate).diff(dayjs(warning.created_at || Date.now()), 'day')) || 7;
    const amount = Number(invoice?.amount || 0);

    return {
      nomor_surat: warning.warning_number || '550/PB-H7/082/DISHUB/X/2026',
      sifat: 'Penting / Segera',
      lampiran: '1 (satu) Berkas Salinan SKRD',
      perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
      kota_terbit: 'Timika',
      tanggal_surat: dayjs(warning.created_at || Date.now()).format('YYYY-MM-DD'),
      tenant_name: tenant?.nama_perusahaan || 'Operator Armada / Wajib Retribusi',
      pic_name: tenant?.pic || 'Pimpinan / Direktur Operasional',
      phone_email: `${tenant?.nomor_telepon || tenant?.no_telepon || '(0901) 321778'} / ${tenant?.email || 'operator@bandara.com'}`,
      address: tenant?.alamat || 'Kawasan Bandara Mozes Kilangin, Timika',
      npwdr: tenant?.npwdr || tenant?.npwp || '91.823.412.5-953.000',
      skrd_number: invoice?.invoice_number || 'SKRD/2026/09/019',
      skrd_date: dayjs(invoice?.created_at || Date.now()).format('YYYY-MM-DD'),
      due_date: dueDate,
      days_remaining: daysLeft,
      retribution_type: invoice?.invoice_type || 'Pemanfaatan Barang Milik Daerah',
      uraian_retribusi: `Kewajiban Pembayaran Retribusi Daerah SKRD No. ${invoice?.invoice_number || ''}`,
      amount: amount,
      bank_name: 'Bank Papua Cabang Timika',
      bank_account_number: '100-01-02-00045-8',
      bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
      pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
      pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
      pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
      pejabat_nip: '19740510 200212 1 008'
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#ecf0f5] border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col rounded-none print:max-w-none print:max-h-none print:shadow-none print:border-none">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-sm">
                {getDocTitle()}: <span className="font-mono text-amber-300">{warning.warning_number}</span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Ref SKRD: <span className="font-mono font-semibold text-white">{invoice?.invoice_number || '-'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak (Print)
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloading ? 'Memproses...' : 'Unduh PDF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-700 hover:bg-red-700 text-white rounded-none cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Document Viewer Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex justify-center bg-slate-300/80 print:p-0 print:bg-white flex-1">
          <div className="bg-white shadow-xl print:shadow-none">
            {isStrd ? (
              <SuratSTRD ref={printRef} data={getStrdData()} />
            ) : isTeguran ? (
              <SuratTeguran ref={printRef} data={getTeguranData()} />
            ) : (
              <SuratPemberitahuan ref={printRef} data={getPemberitahuanData()} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
