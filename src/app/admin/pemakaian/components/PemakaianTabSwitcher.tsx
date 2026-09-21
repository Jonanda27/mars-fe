import React from 'react';
import { ShieldCheck, Plane, ArrowUpRight } from 'lucide-react';

export type PemakaianTabType = 'overnight' | 'active_parkir' | 'checkout';

interface PemakaianTabSwitcherProps {
  readonly activeTab: PemakaianTabType;
  readonly setActiveTab: (tab: PemakaianTabType) => void;
  readonly totalOvernight: number;
  readonly totalActive: number;
  readonly totalCheckout: number;
}

export const PemakaianTabSwitcher: React.FC<PemakaianTabSwitcherProps> = ({
  activeTab,
  setActiveTab,
  totalOvernight,
  totalActive,
  totalCheckout,
}) => {
  return (
    <div className="flex border-b border-slate-200 bg-white px-4 pt-2 shadow-2xs">
      <button
        type="button"
        onClick={() => setActiveTab('overnight')}
        className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
          activeTab === 'overnight'
            ? 'border-[#3c8dbc] text-[#3c8dbc]'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        Laporan Tutup Hari ({totalOvernight})
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('active_parkir')}
        className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
          activeTab === 'active_parkir'
            ? 'border-[#3c8dbc] text-[#3c8dbc]'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        <Plane className="w-4 h-4" />
        Armada Aktif Parkir ({totalActive})
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('checkout')}
        className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
          activeTab === 'checkout'
            ? 'border-[#3c8dbc] text-[#3c8dbc]'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        <ArrowUpRight className="w-4 h-4" />
        Riwayat Check-Out ({totalCheckout})
      </button>
    </div>
  );
};
