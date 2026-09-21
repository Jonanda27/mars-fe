import React from 'react';
import { Filter, Printer, Download, RefreshCw, X } from 'lucide-react';
import { Tenant } from '@/types/tenant';
import { RetributionReportData } from '@/services/reportService';

interface LaporanFilterBarProps {
  readonly periodType: 'monthly' | 'quarterly' | 'semester' | 'annual' | 'custom';
  readonly setPeriodType: (val: 'monthly' | 'quarterly' | 'semester' | 'annual' | 'custom') => void;
  readonly selectedYear: number;
  readonly setSelectedYear: (val: number) => void;
  readonly selectedMonth: number;
  readonly setSelectedMonth: (val: number) => void;
  readonly selectedQuarter: number;
  readonly setSelectedQuarter: (val: number) => void;
  readonly selectedSemester: number;
  readonly setSelectedSemester: (val: number) => void;
  readonly startDate: string;
  readonly setStartDate: (val: string) => void;
  readonly endDate: string;
  readonly setEndDate: (val: string) => void;
  readonly serviceType: 'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA';
  readonly setServiceType: (val: 'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA') => void;
  readonly selectedTenantId: string;
  readonly setSelectedTenantId: (val: string) => void;
  readonly selectedStatus: string;
  readonly setSelectedStatus: (val: string) => void;
  readonly tenants: Tenant[];
  readonly isLoading: boolean;
  readonly reportData: RetributionReportData | null;
  readonly onPrintPdf: () => void;
  readonly onExportExcel: () => void;
  readonly onRefresh: () => void;
  readonly onResetFilters: () => void;
}

export const LaporanFilterBar: React.FC<LaporanFilterBarProps> = ({
  periodType,
  setPeriodType,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  selectedSemester,
  setSelectedSemester,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  serviceType,
  setServiceType,
  selectedTenantId,
  setSelectedTenantId,
  selectedStatus,
  setSelectedStatus,
  tenants,
  isLoading,
  reportData,
  onPrintPdf,
  onExportExcel,
  onRefresh,
  onResetFilters,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Filter className="w-4 h-4 text-[#3c8dbc]" />
          <span>Kriteria &amp; Periode Pelaporan Realisasi PAD</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrintPdf}
            disabled={isLoading || !reportData}
            className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak / Unduh PDF Resmi
          </button>
          <button
            onClick={onExportExcel}
            disabled={isLoading || !reportData}
            className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Excel (.csv)
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Segarkan Data"
            className="p-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Form Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Tipe Periode</label>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as any)}
            className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
          >
            <option value="monthly">Bulanan</option>
            <option value="quarterly">Triwulanan (TW)</option>
            <option value="semester">Semesteran</option>
            <option value="annual">Tahunan</option>
            <option value="custom">Rentang Tanggal Khusus</option>
          </select>
        </div>

        {periodType !== 'custom' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Tahun Anggaran</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {periodType === 'monthly' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Bulan Pelaporan</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
            >
              <option value={1}>Januari</option>
              <option value={2}>Februari</option>
              <option value={3}>Maret</option>
              <option value={4}>April</option>
              <option value={5}>Mei</option>
              <option value={6}>Juni</option>
              <option value={7}>Juli</option>
              <option value={8}>Agustus</option>
              <option value={9}>September</option>
              <option value={10}>Oktober</option>
              <option value={11}>November</option>
              <option value={12}>Desember</option>
            </select>
          </div>
        )}

        {periodType === 'quarterly' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Triwulan (TW)</label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
            >
              <option value={1}>Triwulan I (Jan - Mar)</option>
              <option value={2}>Triwulan II (Apr - Jun)</option>
              <option value={3}>Triwulan III (Jul - Sep)</option>
              <option value={4}>Triwulan IV (Okt - Des)</option>
            </select>
          </div>
        )}

        {periodType === 'semester' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
            >
              <option value={1}>Semester I (Januari - Juni)</option>
              <option value={2}>Semester II (Juli - Desember)</option>
            </select>
          </div>
        )}

        {periodType === 'custom' && (
          <>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Tanggal Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
              />
            </div>
          </>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Jenis Retribusi</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as any)}
            className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
          >
            <option value="ALL">Semua Jenis Layanan</option>
            <option value="HANGGAR">Hanggar &amp; Apron (4.1.2.02.02)</option>
            <option value="RUANGAN">Ruang Kantor/Komersil (4.1.2.02.01)</option>
            <option value="DENDA">Sanksi Denda (4.1.4.01.01)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Wajib Retribusi / Tenant</label>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
          >
            <option value="ALL">Semua Maskapai / Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id.toString()}>{t.nama_perusahaan}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Status Pembayaran</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-slate-300 p-2 font-medium focus:border-[#3c8dbc] focus:outline-none bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="PAID">Lunas (Paid)</option>
            <option value="UNPAID">Belum Lunas (Unpaid)</option>
            <option value="CANCELLED">Dibatalkan (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Filter Summary Tags & Reset */}
      <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] gap-2">
        <div className="flex items-center gap-1 text-slate-500">
          <span className="font-bold text-slate-700">Periode Aktif:</span>
          <span className="bg-blue-50 text-[#3c8dbc] font-bold px-2 py-0.5 border border-blue-100">
            {reportData?.meta.period_label || 'Memuat periode...'}
          </span>
          {serviceType !== 'ALL' && (
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
              Jenis: {serviceType}
            </span>
          )}
          {selectedStatus !== 'ALL' && (
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
              Status: {selectedStatus}
            </span>
          )}
        </div>

        <button
          onClick={onResetFilters}
          className="text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          <X className="w-3 h-3" /> Reset Filter
        </button>
      </div>
    </div>
  );
};
