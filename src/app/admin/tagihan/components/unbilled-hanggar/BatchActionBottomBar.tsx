import React from 'react';
import { Layers } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';

interface BatchActionBottomBarProps {
  readonly selectedCount: number;
  readonly totalNights: number;
  readonly grandTotal: number;
  readonly onTriggerBatch: () => void;
}

export const BatchActionBottomBar: React.FC<BatchActionBottomBarProps> = ({
  selectedCount,
  totalNights,
  grandTotal,
  onTriggerBatch,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 z-40 bg-slate-900 text-white rounded-lg shadow-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3c8dbc]/20 text-[#3c8dbc] border border-[#3c8dbc]/30 flex items-center justify-center font-bold text-base">
          {selectedCount}
        </div>
        <div>
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <span>{selectedCount} Armada Dipilih untuk Rekapitulasi</span>
            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded font-normal">
              Total {totalNights} Malam
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Penerbitan 1 Nomor SKRD Terkonsolidasi untuk seluruh armada terpilih.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        <div className="text-right">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Total Nilai SKRD:</div>
          <div className="text-xl font-bold text-white font-mono">
            {formatRupiah(grandTotal)}
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerBatch}
          className="px-5 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs rounded-md shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Layers className="w-4 h-4" />
          Terbitkan SKRD Massal
        </button>
      </div>
    </div>
  );
};
