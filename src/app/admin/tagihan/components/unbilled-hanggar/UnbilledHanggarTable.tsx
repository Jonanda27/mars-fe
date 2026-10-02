import React from 'react';
import { 
  Plane, Loader2, CheckSquare, Square, ShieldCheck, Camera, FileText, CheckCircle2, Clock 
} from 'lucide-react';
import { UnbilledHanggarLog } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface UnbilledHanggarTableProps {
  readonly isLoading: boolean;
  readonly filteredLogs: UnbilledHanggarLog[];
  readonly selectedLogIds: number[];
  readonly customRates: Record<number, number>;
  readonly onSelectAll: () => void;
  readonly onToggleSelect: (logId: number) => void;
  readonly onTriggerSingle: (log: UnbilledHanggarLog) => void;
}

export const UnbilledHanggarTable: React.FC<UnbilledHanggarTableProps> = ({
  isLoading,
  filteredLogs,
  selectedLogIds,
  customRates,
  onSelectAll,
  onToggleSelect,
  onTriggerSingle,
}) => {
  return (
    <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc] mb-2" />
          <p className="text-sm font-medium">Memuat data armada siap tagih...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400">
          <Plane className="w-12 h-12 text-slate-300 mb-2" />
          <h4 className="text-base font-bold text-slate-700">Tidak Ada Armada Siap Tagih</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md text-center">
            Seluruh pergerakan pesawat di hanggar/apron saat ini telah diterbitkan tagihan SKRD atau belum memiliki catatan menginap.
          </p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 w-8 text-center">
                <button 
                  type="button"
                  onClick={onSelectAll}
                  className="cursor-pointer text-slate-600 hover:text-slate-900"
                >
                  {selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#3c8dbc]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-3">Registrasi & Tipe</th>
              <th className="py-3 px-3">Maskapai / Tenant</th>
              <th className="py-3 px-3 text-center">Lokasi</th>
              <th className="py-3 px-3">Waktu Masuk / Keluar</th>
              <th className="py-3 px-3 text-center">Malam Inap</th>
              <th className="py-3 px-3 text-right">Tarif / Malam</th>
              <th className="py-3 px-3 text-right">Subtotal</th>
              <th className="py-3 px-3 text-center">Aksi Penetapan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map(log => {
              const isSelected = selectedLogIds.includes(log.log_id);
              const currentRate = customRates[log.log_id] ?? log.rate_per_night;
              const calculatedSubtotal = log.total_nights * currentRate;

              return (
                <tr 
                  key={log.log_id} 
                  className={`hover:bg-blue-50/40 transition-colors ${isSelected ? 'bg-blue-50/60' : ''}`}
                >
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(log.log_id)}
                      className="cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#3c8dbc]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                      <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                      {log.registration_number}
                      {log.is_emergency && (
                        <StatusBadge status="danger" label="DARURAT" className="text-[9px] px-1.5 py-0.2" />
                      )}
                      {log.exit_time ? (
                        <StatusBadge status="Billed" label="SUDAH CHECKOUT" className="text-[9px] px-1.5 py-0.2" />
                      ) : (
                        <StatusBadge status="Unbilled" label="SEDANG INAP" className="text-[9px] px-1.5 py-0.2" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {log.aircraft_type}
                    </div>
                    {log.contract_number && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        {log.contract_number}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {log.tenant_name}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.parking_location || 'Hanggar'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[10px] uppercase font-bold w-12">Masuk:</span>
                      <span className="font-medium text-slate-800">{dayjs(log.entry_time).format('DD/MM/YYYY HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-400 text-[10px] uppercase font-bold w-12">Keluar:</span>
                      {log.exit_time ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          {dayjs(log.exit_time).format('DD/MM/YYYY HH:mm')}
                          <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1 py-0.2 border border-emerald-200">
                            Checkout
                          </span>
                        </span>
                      ) : (
                        <span className="font-medium text-amber-700 italic flex items-center gap-1">
                          (Sedang Inap)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-bold text-sm text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {log.total_nights} Malam
                      </span>
                      {log.verified_nights > 0 ? (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> {log.verified_nights} Tutup Hari
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {log.exit_time ? 'Durasi Final' : 'Sedang Berjalan'}
                        </span>
                      )}
                      {log.evidence_photos && log.evidence_photos.length > 0 && (
                        <span className="text-[9px] text-blue-600 font-semibold flex items-center gap-0.5 mt-0.5">
                          <Camera className="w-2.5 h-2.5" /> {log.evidence_photos.length} Foto
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="font-mono text-slate-800 font-bold">
                      {formatRupiah(currentRate)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">/ malam</div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="font-mono text-sm font-bold text-slate-900">
                      {formatRupiah(calculatedSubtotal)}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTriggerSingle(log)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                      title="Tetapkan SKRD untuk pergerakan armada ini"
                    >
                      <FileText className="w-3 h-3" />
                      Tetapkan SKRD
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
