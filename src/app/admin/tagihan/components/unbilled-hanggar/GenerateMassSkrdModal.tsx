import React from 'react';
import { FileText, Loader2, ArrowUpRight } from 'lucide-react';
import { UnbilledHanggarLog } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';

interface GenerateMassSkrdModalProps {
  readonly isOpen: boolean;
  readonly mode: 'single' | 'batch';
  readonly targetLog?: UnbilledHanggarLog;
  readonly selectedItemsData: {
    selected: UnbilledHanggarLog[];
    totalNights: number;
    grandTotal: number;
  };
  readonly isGenerating: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export const GenerateMassSkrdModal: React.FC<GenerateMassSkrdModalProps> = ({
  isOpen,
  mode,
  targetLog,
  selectedItemsData,
  isGenerating,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            Konfirmasi Penetapan SKRD Sewa Hanggar
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 text-xs text-slate-700 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded p-3 text-blue-900">
            <p className="font-bold mb-1">
              {mode === 'single' 
                ? `Penetapan SKRD Satuan (Opsi A: Check-Out)`
                : `Penetapan SKRD Terkonsolidasi (Opsi B: Rekapitulasi Periode)`
              }
            </p>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Sistem akan menerbitkan dokumen resmi Surat Ketetapan Retribusi Daerah (SKRD) berjangka waktu <strong>jatuh tempo 30 hari kalender</strong> sesuai hasil verifikasi Laporan Tutup Hari.
            </p>
          </div>

          {mode === 'single' && targetLog && (
            <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Registrasi:</span>
                <span className="font-bold text-slate-800">{targetLog.registration_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipe Pesawat:</span>
                <span className="font-medium text-slate-800">{targetLog.aircraft_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maskapai / Tenant:</span>
                <span className="font-medium text-slate-800">{targetLog.tenant_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Durasi Inap:</span>
                <span className="font-bold text-slate-800">{targetLog.total_nights} Malam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarif / Malam:</span>
                <span className="font-mono text-slate-800">{formatRupiah(targetLog.rate_per_night)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm">
                <span className="font-bold text-slate-700">Total Retribusi:</span>
                <span className="font-bold text-orange-600 font-mono">
                  {formatRupiah(targetLog.total_nights * targetLog.rate_per_night)}
                </span>
              </div>
            </div>
          )}

          {mode === 'batch' && (
            <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Armada:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.selected.length} Pesawat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Akumulasi Inap:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.totalNights} Malam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maskapai:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.selected[0]?.tenant_name || '-'}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm">
                <span className="font-bold text-slate-700">Grand Total SKRD:</span>
                <span className="font-bold text-orange-600 font-mono">
                  {formatRupiah(selectedItemsData.grandTotal)}
                </span>
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 italic">
            *Setelah diterbitkan, status log operasional akan menjadi <strong>Billed</strong> dan tagihan langsung terdistribusi ke modul SKRD Tenant.
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 border border-slate-300 rounded font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isGenerating}
            className="px-5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menerbitkan...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                Terbitkan SKRD Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
