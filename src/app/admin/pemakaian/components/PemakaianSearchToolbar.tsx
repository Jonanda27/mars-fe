import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { PemakaianTabType } from './PemakaianTabSwitcher';

interface PemakaianSearchToolbarProps {
  readonly activeTab: PemakaianTabType;
  readonly searchTerm: string;
  readonly setSearchTerm: (term: string) => void;
  readonly onRefresh: () => void;
}

export const PemakaianSearchToolbar: React.FC<PemakaianSearchToolbarProps> = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  onRefresh,
}) => {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      <div>
        <h2 className="font-bold text-slate-800 text-sm">
          {activeTab === 'overnight' && 'Arsip Rekonsiliasi Tutup Hari (End of Day)'}
          {activeTab === 'active_parkir' && 'Daftar Armada Aktif Parkir di Hanggar & Apron'}
          {activeTab === 'checkout' && 'Daftar Log Keberangkatan & Check-Out Selesai'}
        </h2>
        <p className="text-[11px] text-slate-500">
          {activeTab === 'overnight' && 'Catatan verifikasi inap malam yang disubmit petugas lapangan.'}
          {activeTab === 'active_parkir' && 'Pesawat yang saat ini tercatat sedang berada di apron / hanggar.'}
          {activeTab === 'checkout' && 'Catatan waktu keluar dan status penagihan parkir / overstay.'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <input
            type="text"
            placeholder={
              activeTab === 'overnight' 
                ? 'Cari Tanggal / Petugas / Reg...' 
                : 'Cari Tail Number / Tenant / Lokasi...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          title="Segarkan Data"
          className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
