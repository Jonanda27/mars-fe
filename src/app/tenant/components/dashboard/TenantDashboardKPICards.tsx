import React from 'react';
import { 
  FileText, Building2, Plane, Plus, Calendar, ShieldCheck 
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { RentalApplication } from '@/types/rental';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import Link from 'next/link';

interface TenantDashboardKPICardsProps {
  readonly activeApps: RentalApplication[];
  readonly allApplications: RentalApplication[];
  readonly activeContracts: Contract[];
  readonly allContracts: Contract[];
  readonly aircrafts: Aircraft[];
  readonly unpaidInvoices: Invoice[];
  readonly totalUnpaidAmount: number;
  readonly legalitasPercent: number;
}

export const TenantDashboardKPICards: React.FC<TenantDashboardKPICardsProps> = ({
  activeApps,
  allApplications,
  activeContracts,
  allContracts,
  aircrafts,
  unpaidInvoices,
  totalUnpaidAmount,
  legalitasPercent,
}) => {
  return (
    <>
      {/* Baris 1: 4 KPI Cards (AdminLTE Flat Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Permohonan Sewa Berjalan */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <FileText className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Permohonan Sewa Berjalan</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {activeApps.length} Berkas
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Total {allApplications.length} Pengajuan &bull; {allApplications.filter(a => a.status === 'Approved' || a.status === 'Selesai').length} Disetujui
            </span>
          </div>
        </div>

        {/* KPI 2: Kontrak Sewa Aktif */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Kontrak Sewa &amp; PKS Aktif</span>
            <span className="text-[18px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
              {activeContracts.length} Kontrak
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              {allContracts.length} Total PKS Terdaftar &bull; Hak Operasional Valid
            </span>
          </div>
        </div>

        {/* KPI 3: Armada Pesawat Terdaftar */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <Plane className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Armada Pesawat Terdaftar</span>
            <span className="text-[18px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {aircrafts.length} Unit Pesawat
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1">
              Registrasi PK-... Valid &bull; Terdaftar di Database UPBU
            </span>
          </div>
        </div>

        {/* KPI 4: Tagihan e-SKRD */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc]">
            <RupiahIcon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider">Tagihan e-SKRD Retribusi</span>
            <span className={`text-[18px] font-bold font-mono leading-tight mt-0.5 ${unpaidInvoices.length > 0 ? 'text-[#dd4b39]' : 'text-[#00a65a]'}`}>
              {unpaidInvoices.length > 0 ? formatRupiah(totalUnpaidAmount) : 'Rp 0 (Lunas)'}
            </span>
            <span className="text-[11px] font-bold mt-1">
              {unpaidInvoices.length > 0 ? (
                <span className="text-[#dd4b39]">{unpaidInvoices.length} SKRD Menunggu Bayar</span>
              ) : (
                <span className="text-[#00a65a]">Seluruh Kewajiban Tertib / Lunas</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Baris 2: Tenant Action Command Hub (5 Quick Action Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Link 
          href="/tenant/permohonan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">1. Permohonan</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              Ajukan Sewa Baru
            </p>
          </div>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-50 text-[#3c8dbc] border border-blue-200 text-xs font-bold">
            <Plus className="w-4 h-4" />
          </span>
        </Link>

        <Link 
          href="/tenant/jadwal-hanggar" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">2. Slot Hanggar</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              Booking Jadwal
            </p>
          </div>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-50 text-[#3c8dbc] border border-blue-200 text-xs font-bold">
            <Calendar className="w-4 h-4" />
          </span>
        </Link>

        <Link 
          href="/tenant/pesawat" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">3. Armada</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              Tambah Pesawat
            </p>
          </div>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-50 text-[#3c8dbc] border border-blue-200 text-xs font-bold">
            <Plane className="w-4 h-4" />
          </span>
        </Link>

        <Link 
          href="/tenant/tagihan" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">4. e-SKRD Retribusi</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {unpaidInvoices.length > 0 ? `${unpaidInvoices.length} Perlu Dibayar` : 'Konfirmasi STS'}
            </p>
          </div>
          <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold ${
            unpaidInvoices.length > 0
              ? 'bg-red-50 text-[#dd4b39] border border-red-200'
              : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
          }`}>
            <RupiahIcon className="w-4 h-4" />
          </span>
        </Link>

        <Link 
          href="/tenant/profil" 
          className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">5. Legalitas Mitra</span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
              {legalitasPercent}% Lengkap
            </p>
          </div>
          <span className="w-7 h-7 flex items-center justify-center bg-blue-50 text-[#3c8dbc] border border-blue-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </>
  );
};
