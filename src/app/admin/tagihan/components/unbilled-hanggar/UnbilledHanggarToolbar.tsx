import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface UnbilledHanggarToolbarProps {
  readonly tenantList: Array<{ id: number; name: string }>;
  readonly selectedTenantFilter: string;
  readonly setSelectedTenantFilter: (val: string) => void;
  readonly searchQuery: string;
  readonly setSearchQuery: (val: string) => void;
  readonly isLoading: boolean;
  readonly onRefresh: () => void;
}

export const UnbilledHanggarToolbar: React.FC<UnbilledHanggarToolbarProps> = ({
  tenantList,
  selectedTenantFilter,
  setSelectedTenantFilter,
  searchQuery,
  setSearchQuery,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Tenant Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Maskapai:</label>
          <select
            value={selectedTenantFilter}
            onChange={(e) => setSelectedTenantFilter(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded p-1.5 focus:border-[#3c8dbc] focus:outline-none bg-slate-50"
          >
            <option value="ALL">Semua Maskapai ({tenantList.length})</option>
            {tenantList.map(t => (
              <option key={t.id} value={String(t.id)}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari registrasi / tipe armada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:border-[#3c8dbc] focus:outline-none w-56 bg-slate-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-bold px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#3c8dbc]' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
};
