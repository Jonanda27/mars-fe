import React, { useState, useEffect } from 'react';
import { FileText, Loader2, ArrowUpRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { UnbilledHanggarLog } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

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
  const [confirmUncheckedOut, setConfirmUncheckedOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmUncheckedOut(false);
    }
  }, [isOpen, targetLog]);

  if (!isOpen) return null;

  const isNotCheckedOut = mode === 'single' 
    ? !targetLog?.exit_time 
    : selectedItemsData.selected.some(l => !l.exit_time);

  const uncheckedCount = mode === 'batch' 
    ? selectedItemsData.selected.filter(l => !l.exit_time).length 
    : (isNotCheckedOut ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className={`text-white px-5 py-3.5 flex justify-between items-center ${
          isNotCheckedOut ? 'bg-amber-900' : 'bg-slate-800'
        }`}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            {isNotCheckedOut ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <FileText className="w-4 h-4 text-[#3c8dbc]" />
            )}
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
          {/* Peringatan Khusus Jika Armada Belum Checkout */}
          {isNotCheckedOut ? (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-none p-3.5 text-amber-950 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                  Peringatan: Armada Belum Checkout!
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {mode === 'single' ? (
                    <>
                      Pesawat <strong>{targetLog?.registration_number}</strong> saat ini <strong>belum melakukan checkout</strong> di lapangan (status masih menginap/parkir aktif).
                    </>
                  ) : (
                    <>
                      Terdapat <strong>{uncheckedCount} dari {selectedItemsData.selected.length} armada</strong> yang dipilih saat ini <strong>belum melakukan checkout</strong> di lapangan.
                    </>
                  )}
                </p>
                <p className="text-[11px] font-semibold text-amber-900 pt-0.5">
                  Tagihan dihitung berdasarkan durasi inap berjalan saat ini ({mode === 'single' ? `${targetLog?.total_nights} malam` : `${selectedItemsData.totalNights} total malam`}). Apakah Anda yakin ingin menerbitkan SKRD sekarang?
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded p-3 text-blue-900">
              <p className="font-bold mb-1">
                {mode === 'single' 
                  ? `Penetapan SKRD Satuan (Check-Out Armada)`
                  : `Penetapan SKRD Terkonsolidasi (Rekapitulasi Periode)`
                }
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Sistem akan menerbitkan dokumen resmi Surat Ketetapan Retribusi Daerah (SKRD) berjangka waktu <strong>jatuh tempo 30 hari kalender</strong> sesuai hasil verifikasi Laporan Tutup Hari.
              </p>
            </div>
          )}

          {mode === 'single' && targetLog && (
            <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nomor Registrasi:</span>
                <span className="font-bold text-slate-800">{targetLog.registration_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tipe Pesawat:</span>
                <span className="font-medium text-slate-800">{targetLog.aircraft_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Maskapai / Tenant:</span>
                <span className="font-medium text-slate-800">{targetLog.tenant_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status Checkout:</span>
                {targetLog.exit_time ? (
                  <StatusBadge status="Billed" label={`Sudah Checkout (${dayjs(targetLog.exit_time).format('DD/MM/YYYY HH:mm')})`} />
                ) : (
                  <StatusBadge status="Unbilled" label="Belum Checkout (Sedang Inap)" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Durasi Inap:</span>
                <span className="font-bold text-slate-800">{targetLog.total_nights} Malam</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tarif / Malam:</span>
                <span className="font-mono text-slate-800">{formatRupiah(targetLog.rate_per_night)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-700">Total Retribusi:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatRupiah(targetLog.total_nights * targetLog.rate_per_night)}
                </span>
              </div>
            </div>
          )}

          {mode === 'batch' && (
            <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Jumlah Armada:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.selected.length} Pesawat</span>
              </div>
              {uncheckedCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Belum Checkout:</span>
                  <StatusBadge status="Unbilled" label={`${uncheckedCount} Armada Belum Checkout`} />
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Akumulasi Inap:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.totalNights} Malam</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Maskapai:</span>
                <span className="font-bold text-slate-800">{selectedItemsData.selected[0]?.tenant_name || '-'}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-700">Grand Total SKRD:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatRupiah(selectedItemsData.grandTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Konfirmasi Checkbox Wajib Centang Jika Belum Checkout */}
          {isNotCheckedOut && (
            <label className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-300 rounded cursor-pointer select-none hover:bg-amber-100/60 transition-colors">
              <input
                type="checkbox"
                checked={confirmUncheckedOut}
                onChange={(e) => setConfirmUncheckedOut(e.target.checked)}
                className="accent-amber-700 mt-0.5 w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-xs text-amber-950 font-medium leading-relaxed">
                Saya memahami bahwa armada ini <strong>belum melakukan checkout</strong> dan <strong>yakin ingin menerbitkan SKRD</strong> sekarang berdasarkan durasi inap berjalan saat ini.
              </span>
            </label>
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
            disabled={isGenerating || (isNotCheckedOut && !confirmUncheckedOut)}
            className={`px-5 py-2 font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              isNotCheckedOut
                ? 'bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-[#3c8dbc] hover:bg-[#367fa9] text-white disabled:opacity-60'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menerbitkan...
              </>
            ) : isNotCheckedOut ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Yakin &amp; Terbitkan SKRD Sekarang
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
