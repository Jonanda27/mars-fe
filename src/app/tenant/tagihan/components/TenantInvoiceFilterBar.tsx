import React from 'react';
import { Plane, Building2, AlertTriangle, Search, RefreshCw } from 'lucide-react';

interface TenantInvoiceFilterBarProps {
  readonly serviceFilter: 'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA';
  readonly setServiceFilter: (val: 'ALL' | 'HANGGAR' | 'RUANGAN' | 'DENDA') => void;
  readonly totalCount: number;
  readonly hanggarCount: number;
  readonly ruanganCount: number;
  readonly dendaCount: number;
  readonly searchTerm: string;
  readonly setSearchTerm: (val: string) => void;
  readonly onRefresh: () => void;
}

export const TenantInvoiceFilterBar: React.FC<TenantInvoiceFilterBarProps> = ({
  serviceFilter,
  setServiceFilter,
  totalCount,
  hanggarCount,
  ruanganCount,
  dendaCount,
  searchTerm,
  setSearchTerm,
  onRefresh,
}) => {
  return (
    <>
      {/* Tabs Filter Bar */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setServiceFilter('ALL')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            serviceFilter === 'ALL'
              ? 'border-[#3c8dbc] text-[#3c8dbc]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Semua Tagihan ({totalCount})
        </button>

        <button
          onClick={() => setServiceFilter('HANGGAR')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            serviceFilter === 'HANGGAR'
              ? 'border-[#3c8dbc] text-[#3c8dbc]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Plane className="w-4 h-4 text-[#3c8dbc]" />
          Retribusi Sewa Hanggar ({hanggarCount})
        </button>

        <button
          onClick={() => setServiceFilter('RUANGAN')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            serviceFilter === 'RUANGAN'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-600" />
          Retribusi Sewa Ruangan ({ruanganCount})
        </button>

        {dendaCount > 0 && (
          <button
            onClick={() => setServiceFilter('DENDA')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              serviceFilter === 'DENDA'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            SKRD Denda ({dendaCount})
          </button>
        )}
      </div>

      {/* Search and Action Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">
            Daftar Ketetapan Retribusi (Surat Ketetapan Retribusi Daerah)
          </h2>
          <p className="text-[11px] text-slate-500">
            Pantau seluruh tagihan SKRD sewa hanggar pesawat, sewa ruangan terminal, dan SKRD denda Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Cari No SKRD / Kontrak / Objek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <button
            onClick={onRefresh}
            title="Segarkan Data"
            className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
