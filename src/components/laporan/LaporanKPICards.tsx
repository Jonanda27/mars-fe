import React from 'react';
import { 
  Building2, Plane, AlertTriangle, Layers, 
  Calendar, Warehouse, PlaneLanding 
} from 'lucide-react';
import { RetributionReportData } from '@/services/reportService';
import { formatRupiah } from '@/utils/formatCurrency';

interface LaporanKPICardsProps {
  readonly reportData: RetributionReportData | null;
  readonly userRole?: string;
}

export const LaporanKPICards: React.FC<LaporanKPICardsProps> = ({ reportData, userRole }) => {
  const summary = reportData?.summary || {
    total_realisasi_kas_masuk: 0,
    total_piutang_menunggak: 0,
    total_ketetapan_terbit: 0,
    total_denda_terkumpul: 0,
    total_skrd_count: 0,
  };

  const collectionRate = summary.total_ketetapan_terbit > 0 
    ? Math.round((summary.total_realisasi_kas_masuk / summary.total_ketetapan_terbit) * 100) 
    : 0;

  const ruanganBreakdown = reportData?.account_breakdown?.find(a => a.account_code === '4.1.2.02.01');
  const hanggarBreakdown = reportData?.account_breakdown?.find(a => a.account_code === '4.1.2.02.02');
  const apronBreakdown = reportData?.account_breakdown?.find(a => a.account_code === '4.1.2.02.03');
  const dendaBreakdown = reportData?.account_breakdown?.find(a => a.account_code === '4.1.4.01.01');

  const totalRuanganPaid = ruanganBreakdown?.total_realisasi || 0;
  const totalHanggarPaid = hanggarBreakdown?.total_realisasi || 0;
  const totalApronPaid = apronBreakdown?.total_realisasi || 0;
  const totalDendaPaid = dendaBreakdown?.total_realisasi || summary.total_denda_terkumpul || 0;

  return (
    <div className="space-y-4">
      {/* 4 KPI CARDS UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Ketetapan */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Ketetapan (SKRD)</span>
              <div className="text-[20px] font-bold text-slate-800 mt-1 font-mono">
                {formatRupiah(summary.total_ketetapan_terbit)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {summary.total_skrd_count || reportData?.invoices.length || 0} Berkas SKRD Ditetapkan
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-[#3c8dbc] rounded-none">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Realisasi Kas Daerah (Paid) */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Realisasi Masuk Kasda</span>
              <div className="text-[20px] font-bold text-slate-800 mt-1 font-mono">
                {formatRupiah(summary.total_realisasi_kas_masuk)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {reportData?.invoices.filter(i => (i.status || '').toUpperCase() === 'PAID').length || 0} SKRD Telah Disetor &amp; Lunas
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-[#3c8dbc] rounded-none">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Piutang Daerah (Unpaid) */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Piutang Belum Tertagih</span>
              <div className="text-[20px] font-bold text-slate-800 mt-1 font-mono">
                {formatRupiah(summary.total_piutang_menunggak)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {reportData?.invoices.filter(i => (i.status || '').toUpperCase() === 'UNPAID').length || 0} SKRD Belum Dilunasi
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-[#3c8dbc] rounded-none">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 4: Tingkat Realisasi / Efektivitas */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tingkat Realisasi PAD</span>
              <div className="text-[20px] font-bold text-slate-800 mt-1 font-mono">
                {collectionRate}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Persentase Target Ketetapan Terbayar
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-[#3c8dbc] rounded-none">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* RINCIAN PENDAPATAN PER KODE REKENING RETRIBUSI */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${['admin_hanggar', 'admin_apron', 'admin_ruangan'].includes(userRole || '') ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-4`}>
        {/* Rekening 1: Ruang Kantor/Komersil (4.1.2.02.01) */}
        {(!userRole || (!['admin_hanggar', 'admin_apron'].includes(userRole))) && (
          <div className="bg-white border border-slate-200 p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#3c8dbc]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block font-bold">REK. 4.1.2.02.01</span>
                <h4 className="text-xs font-bold text-slate-800">Sewa Ruangan &amp; Kantor</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-800 font-mono block">
                {formatRupiah(totalRuanganPaid)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Kasda Terealisasi</span>
            </div>
          </div>
        )}

        {/* Rekening 2: Hanggar Pesawat (4.1.2.02.02) */}
        {(!userRole || (!['admin_apron', 'admin_ruangan'].includes(userRole))) && (
          <div className="bg-white border border-slate-200 p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#3c8dbc]">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block font-bold">REK. 4.1.2.02.02</span>
                <h4 className="text-xs font-bold text-slate-800">Sewa Hanggar Pesawat</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-800 font-mono block">
                {formatRupiah(totalHanggarPaid)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Kasda Terealisasi</span>
            </div>
          </div>
        )}

        {/* Rekening 3: Apron Pesawat (4.1.2.02.03) */}
        {(!userRole || (!['admin_hanggar', 'admin_ruangan'].includes(userRole))) && (
          <div className="bg-white border border-slate-200 p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#3c8dbc]">
                <PlaneLanding className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block font-bold">REK. 4.1.2.02.03</span>
                <h4 className="text-xs font-bold text-slate-800">Sewa Apron Pesawat</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-800 font-mono block">
                {formatRupiah(totalApronPaid)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Kasda Terealisasi</span>
            </div>
          </div>
        )}

        {/* Rekening 4: Denda Retribusi (4.1.4.01.01) */}
        {(!userRole || (!['admin_hanggar', 'admin_apron', 'admin_ruangan'].includes(userRole))) && (
          <div className="bg-white border border-slate-200 p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#3c8dbc]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block font-bold">REK. 4.1.4.01.01</span>
                <h4 className="text-xs font-bold text-slate-800">Sanksi Denda Keterlambatan</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-bold text-slate-800 font-mono block">
                {formatRupiah(totalDendaPaid)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Denda Tertagih</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
