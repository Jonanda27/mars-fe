import React from 'react';
import { CheckCircle2, Clock, FileText, Users } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import { DinasDashboardData } from '@/services/dashboardService';

interface DinasKPICardsProps {
  readonly kpi: DinasDashboardData['kpi'];
}

export const DinasKPICards: React.FC<DinasKPICardsProps> = ({ kpi }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Realisasi Kas Masuk */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Realisasi Penerimaan PAD</span>
          <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
            {formatRupiah(kpi.realisasi_pad)}
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Target: Rp 15 M ({kpi.achievement_percent}%) &bull; {kpi.paid_invoices_count} SKRD Lunas
          </span>
        </div>
      </div>

      {/* KPI 2: Piutang Menunggak */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <Clock className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Piutang Retribusi Daerah</span>
          <span className="text-[18px] font-bold text-[#dd4b39] font-mono leading-tight mt-0.5">
            {formatRupiah(kpi.total_piutang)}
          </span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">
            {kpi.overdue_invoices_count > 0 ? (
              <span className="text-[#dd4b39] font-bold">
                {kpi.overdue_invoices_count} SKRD Melewati Jatuh Tempo
              </span>
            ) : (
              <span className="text-[#3c8dbc]">Pembayaran Berjalan Lancar</span>
            )}
          </span>
        </div>
      </div>

      {/* KPI 3: Permohonan Sewa Masuk */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <FileText className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Permohonan Sewa Masuk</span>
          <span className="text-[18px] font-bold text-[#333] leading-tight mt-0.5">
            {kpi.pending_applications_count} Berkas
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            Total {kpi.total_applications_count} permohonan diajukan tahun ini
          </span>
        </div>
      </div>

      {/* KPI 4: Kemitraan & PKS Aktif */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
          <Users className="w-8 h-8" />
        </div>
        <div className="p-3 flex flex-col justify-center flex-1">
          <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Mitra &amp; PKS Aktif</span>
          <span className="text-[18px] font-bold text-[#333] leading-tight mt-0.5">
            {kpi.active_contracts_count} Kontrak PKS
          </span>
          <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
            {kpi.verified_tenants_count} Mitra Terverifikasi &bull; {kpi.pending_tenants_count} Menunggu
          </span>
        </div>
      </div>
    </div>
  );
};
