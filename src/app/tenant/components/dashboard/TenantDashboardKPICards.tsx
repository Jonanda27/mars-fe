import React from 'react';
import { 
  FileText, Building2, Plane 
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { RentalApplication } from '@/types/rental';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';

interface TenantDashboardKPICardsProps {
  readonly activeApps: RentalApplication[];
  readonly allApplications: RentalApplication[];
  readonly activeContracts: Contract[];
  readonly allContracts: Contract[];
  readonly aircrafts: Aircraft[];
  readonly unpaidInvoices: Invoice[];
  readonly totalUnpaidAmount: number;
  readonly legalitasPercent?: number;
}

export const TenantDashboardKPICards: React.FC<TenantDashboardKPICardsProps> = ({
  activeApps,
  allApplications,
  activeContracts,
  allContracts,
  aircrafts,
  unpaidInvoices,
  totalUnpaidAmount,
}) => {
  return (
    /* 4 KPI Cards: 2x2 di Mobile, 4-in-a-row di Desktop */
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* KPI 1: Permohonan Sewa Berjalan */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-10 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
          <FileText className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <div className="p-2 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
          <span className="uppercase text-[9.5px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
            Permohonan Sewa
          </span>
          <span className="text-[15px] sm:text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5 truncate">
            {activeApps.length} Berkas
          </span>
          <span className="text-[9.5px] sm:text-[11px] text-[#3c8dbc] font-bold mt-0.5 truncate">
            {allApplications.length} Pengajuan &bull; {allApplications.filter(a => a.status === 'Approved' || a.status === 'Selesai').length} Sah
          </span>
        </div>
      </div>

      {/* KPI 2: Kontrak Sewa Aktif */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-10 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
          <Building2 className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <div className="p-2 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
          <span className="uppercase text-[9.5px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
            Kontrak &amp; PKS
          </span>
          <span className="text-[15px] sm:text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5 truncate">
            {activeContracts.length} Kontrak
          </span>
          <span className="text-[9.5px] sm:text-[11px] text-[#3c8dbc] font-bold mt-0.5 truncate">
            {allContracts.length} Total PKS Terdaftar
          </span>
        </div>
      </div>

      {/* KPI 3: Armada Pesawat Terdaftar */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-10 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
          <Plane className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <div className="p-2 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
          <span className="uppercase text-[9.5px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
            Armada Pesawat
          </span>
          <span className="text-[15px] sm:text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5 truncate">
            {aircrafts.length} Unit
          </span>
          <span className="text-[9.5px] sm:text-[11px] text-[#3c8dbc] font-bold mt-0.5 truncate">
            PK-... Valid di UPBU
          </span>
        </div>
      </div>

      {/* KPI 4: Tagihan e-SKRD */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
        <div className="w-10 sm:w-[70px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] shrink-0">
          <RupiahIcon className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <div className="p-2 sm:p-3 flex flex-col justify-center flex-1 min-w-0">
          <span className="uppercase text-[9.5px] sm:text-[11px] text-[#777] font-bold tracking-wider truncate block">
            Tagihan e-SKRD
          </span>
          <span className={`text-[15px] sm:text-[18px] font-bold font-mono leading-tight mt-0.5 truncate ${unpaidInvoices.length > 0 ? 'text-[#dd4b39]' : 'text-[#00a65a]'}`}>
            {unpaidInvoices.length > 0 ? formatRupiah(totalUnpaidAmount) : 'Rp 0'}
          </span>
          <span className="text-[9.5px] sm:text-[11px] font-bold mt-0.5 truncate">
            {unpaidInvoices.length > 0 ? (
              <span className="text-[#dd4b39]">{unpaidInvoices.length} SKRD Tertunda</span>
            ) : (
              <span className="text-[#00a65a]">Semua Lunas</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
