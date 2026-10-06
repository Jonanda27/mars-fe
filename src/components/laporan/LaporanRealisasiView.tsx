"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { reportService, RetributionReportData, ReportFilterParams } from '@/services/reportService';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import LaporanRealisasiPDF from '@/components/LaporanRealisasiPDF';
import { LaporanFilterBar } from './LaporanFilterBar';
import { LaporanKPICards } from './LaporanKPICards';
import { LaporanTransactionTable } from './LaporanTransactionTable';
import { X, Loader2, Download } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface LaporanRealisasiViewProps {
  readonly roleLabel?: string;
}

export const LaporanRealisasiView: React.FC<LaporanRealisasiViewProps> = ({
  roleLabel = 'Admin / Dinas'
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Filter States
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'semester' | 'annual' | 'custom'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil(currentMonth / 3));
  const [selectedSemester, setSelectedSemester] = useState<number>(currentMonth <= 6 ? 1 : 2);
  const [startDate, setStartDate] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [serviceType, setServiceType] = useState<'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA'>('ALL');
  const [selectedTenantId, setSelectedTenantId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Data States
  const [reportData, setReportData] = useState<RetributionReportData | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Official PDF Print
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchTenants = async () => {
    try {
      const data = await tenantService.getTenants();
      setTenants(data || []);
    } catch (e) {
      console.error('Failed to load tenants', e);
    }
  };

  const loadReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: ReportFilterParams = {
        period_type: periodType,
        year: selectedYear,
        month: selectedMonth,
        quarter: selectedQuarter,
        semester: selectedSemester,
        start_date: startDate,
        end_date: endDate,
        service_type: serviceType,
        tenant_id: selectedTenantId,
        status: selectedStatus
      };

      const data = await reportService.getRetributionReport(params);
      setReportData(data);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat data laporan realisasi');
    } finally {
      setIsLoading(false);
    }
  }, [periodType, selectedYear, selectedMonth, selectedQuarter, selectedSemester, startDate, endDate, serviceType, selectedTenantId, selectedStatus]);

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleResetFilters = () => {
    setPeriodType('monthly');
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedQuarter(Math.ceil(currentMonth / 3));
    setSelectedSemester(currentMonth <= 6 ? 1 : 2);
    setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'));
    setEndDate(dayjs().endOf('month').format('YYYY-MM-DD'));
    setServiceType('ALL');
    setSelectedTenantId('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  // Handle Export to PDF via html2pdf
  const handleDownloadPdf = async () => {
    if (!pdfRef.current || !reportData) return;
    try {
      setIsExportingPdf(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pdfRef.current;
      const opt = {
        margin: 0,
        filename: `Laporan_Realisasi_Retribusi_${reportData.meta.period_label.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Laporan PDF resmi berhasil diunduh');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat dokumen PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Handle Export to CSV / Excel
  const handleExportExcel = () => {
    if (!reportData || !reportData.invoices.length) {
      toast.error('Tidak ada data transaksi untuk diekspor');
      return;
    }

    const headers = [
      'No',
      'Nomor SKRD',
      'Wajib Retribusi',
      'Kode Rekening',
      'Jenis Retribusi',
      'Objek / Layanan',
      'Nomor Kontrak',
      'Tanggal Penetapan',
      'Tanggal Jatuh Tempo',
      'Tanggal Pembayaran',
      'Metode Pembayaran',
      'Pokok Retribusi (Rp)',
      'Denda Keterlambatan (Rp)',
      'Total Ketetapan (Rp)',
      'Status Pembayaran'
    ];

    const rows = reportData.invoices.map((inv, idx) => [
      idx + 1,
      `"${inv.invoice_number}"`,
      `"${inv.tenant_name}"`,
      `"${inv.account_code}"`,
      `"${inv.account_name}"`,
      `"${inv.asset_name}"`,
      `"${inv.contract_number || '-'}"`,
      `"${dayjs(inv.created_at).format('YYYY-MM-DD')}"`,
      `"${dayjs(inv.due_date).format('YYYY-MM-DD')}"`,
      `"${inv.payment_date ? dayjs(inv.payment_date).format('YYYY-MM-DD') : '-'}"`,
      `"${inv.payment_method || '-'}"`,
      inv.amount,
      inv.penalty_amount,
      inv.total_amount,
      `"${inv.status}"`
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Retribusi_${reportData.meta.period_label.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data laporan berhasil diekspor ke format spreadsheet (CSV/Excel)');
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Laporan Realisasi Retribusi{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">
              {roleLabel === 'Dinas' ? 'Dinas Perhubungan Kab. Mimika' : 'Bandara Mozes Kilangin'}
            </span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">{roleLabel}</span> / <span className="ml-1 font-medium">Laporan Realisasi</span>
        </div>
      </header>

      {/* 1. FILTER BAR PANEL */}
      <LaporanFilterBar
        periodType={periodType}
        setPeriodType={setPeriodType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedQuarter={selectedQuarter}
        setSelectedQuarter={setSelectedQuarter}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        serviceType={serviceType}
        setServiceType={setServiceType}
        selectedTenantId={selectedTenantId}
        setSelectedTenantId={setSelectedTenantId}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        tenants={tenants}
        isLoading={isLoading}
        reportData={reportData}
        onPrintPdf={() => setShowPdfModal(true)}
        onExportExcel={handleExportExcel}
        onRefresh={loadReport}
        onResetFilters={handleResetFilters}
      />

      {/* 2. STATISTIK & KPI PAD */}
      <LaporanKPICards reportData={reportData} />

      {/* 3. TABEL RINCIAN TRANSAKSI */}
      <LaporanTransactionTable
        invoices={reportData?.invoices || []}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
      />

      {/* MODAL PRINT PREVIEW DOKUMEN RESMI PDF */}
      {showPdfModal && reportData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-4 bg-[#3c8dbc] text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  Cetak Dokumen Resmi Laporan Realisasi Retribusi Daerah
                </h4>
                <p className="text-[11px] text-blue-100 mt-0.5">
                  Format dokumen siap cetak A4 sesuai format pelaporan kedinasan UPBU Mozes Kilangin.
                </p>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-white/80 hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Document Preview */}
            <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
              <LaporanRealisasiPDF reportData={reportData} ref={pdfRef} />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Total Ketetapan: <strong>{reportData.invoices.length} Transaksi</strong> | Periode: <strong>{reportData.meta.period_label}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Tutup Preview
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="px-5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download PDF Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanRealisasiView;
