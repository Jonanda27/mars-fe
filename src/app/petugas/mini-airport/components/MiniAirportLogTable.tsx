import React from 'react';
import { 
  TowerControl, Plane, Plus, MapPin, Users, Clock, 
  Moon, Sun, Search, Loader2, Eye, AlertCircle, PlaneTakeoff, CheckCircle2 
} from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';

interface MiniAirportLogTableProps {
  readonly logs: any[];
  readonly filteredLogs: any[];
  readonly isLoading: boolean;
  readonly searchTerm: string;
  readonly setSearchTerm: (term: string) => void;
  readonly onOpenModal: () => void;
  readonly onPreviewPhoto: (url: string) => void;
  readonly onCheckout: (log: any) => void;
}

export const MiniAirportLogTable: React.FC<MiniAirportLogTableProps> = ({
  logs,
  filteredLogs,
  isLoading,
  searchTerm,
  setSearchTerm,
  onOpenModal,
  onPreviewPhoto,
  onCheckout,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex items-center gap-2">
          <TowerControl className="w-5 h-5 text-[#3c8dbc]" />
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Riwayat Pencatatan Realisasi Lapangan</h2>
            <p className="text-[11px] text-slate-500">
              Pencatatan realisasi fisik pendaratan, alokasi stand 01/02, checkout keberangkatan, dan antrean SKRD Dinas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Cari armada / airport / tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Pendaratan Masuk</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-10 text-center">No</th>
              <th className="py-3 px-3">Waktu Kedatangan</th>
              <th className="py-3 px-3">Bandara &amp; Stand</th>
              <th className="py-3 px-3">Armada &amp; Maskapai</th>
              <th className="py-3 px-3 text-center">Pax</th>
              <th className="py-3 px-3 text-center">Status Parkir</th>
              <th className="py-3 px-3">Petugas</th>
              <th className="py-3 px-3 text-center">Status SKRD</th>
              <th className="py-3 px-3 text-right">Retribusi</th>
              <th className="py-3 px-3 text-center">Foto</th>
              <th className="py-3 px-3 text-center">Aksi Operasional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                  <span>Memuat data realisasi...</span>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <span>Belum ada catatan realisasi pendaratan Mini Airport. Tekan tombol &quot;Catat Pendaratan Masuk&quot; untuk memulai.</span>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => {
                const spec = log.parsedNotes || {};
                const isStillParked = !log.exit_time;
                const entry = dayjs(log.entry_time);
                const exit = log.exit_time ? dayjs(log.exit_time) : dayjs();

                const totalMinutes = Math.max(0, exit.diff(entry, 'minute'));
                const days = Math.floor(totalMinutes / (24 * 60));
                const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
                const minutes = totalMinutes % 60;

                let durationStr = '';
                if (days > 0) {
                  durationStr = `${days}h ${hours}j ${minutes}m`;
                } else if (hours > 0) {
                  durationStr = `${hours}j ${minutes}m`;
                } else {
                  durationStr = `${minutes}m`;
                }

                // Cek cut-off jam 17:00 WIT
                const isDifferentDay = !exit.isSame(entry, 'day');
                const isPast17 = exit.hour() >= 17;
                const isOvernightActive = isDifferentDay || isPast17;

                return (
                  <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 block">
                        {dayjs(log.entry_time).format('DD MMM YYYY')}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" /> {dayjs(log.entry_time).format('HH:mm')} WIT
                      </span>
                      {log.exit_time && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                          Keluar: {dayjs(log.exit_time).format('DD/MM, HH:mm')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#3c8dbc] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {spec.airport_name || 'Mini Airport'} ({spec.airport_code || '-'})
                      </span>
                      <span className="text-[11px] font-mono text-slate-700 block mt-0.5">
                        Stand: <strong className={`font-bold ${isStillParked ? 'text-purple-700' : 'text-slate-800'}`}>{spec.allocated_stand || log.parking_location || 'STAND 01'}</strong>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1 text-[12px]">
                        <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                        {log.registration_number}
                      </span>
                      <span className="text-[11px] text-slate-600 block">
                        {spec.aircraft_type || 'Pesawat Perintis'} • <strong className="text-slate-700">{log.tenants?.nama_perusahaan || 'Mitra Maskapai'}</strong>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        <Users className="w-3 h-3 text-slate-500" />
                        {spec.passengers_count || 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isStillParked ? (
                        <div className="flex flex-col items-center gap-0.5">
                          {isOvernightActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200 rounded">
                              <Moon className="w-3 h-3 text-purple-600" /> Menginap (RON)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 rounded">
                              <Sun className="w-3 h-3 text-amber-600" /> Parkir Aktif
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-700 font-bold">
                            ⏱️ {durationStr}
                          </span>
                          {isOvernightActive && (
                            <span className="text-[9px] text-purple-600 font-medium">Lewat 17:00 WIT</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200 rounded">
                            {log.is_overnight ? <Moon className="w-3 h-3 text-purple-600" /> : <Sun className="w-3 h-3 text-amber-600" />}
                            {log.is_overnight ? `Inap (${spec.overnight_nights || 1}M)` : 'Transit'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Durasi: {durationStr}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-medium text-slate-800 block">{log.officer?.username || 'Petugas'}</span>
                      <span className="text-[10px] text-slate-400">Petugas Lapangan</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isStillParked ? (
                        <StatusBadge status="info" label="Pesawat di Apron" />
                      ) : log.billing_status === 'Billed' ? (
                        <StatusBadge status="Billed" label="SKRD Terbit Dinas" />
                      ) : (
                        <StatusBadge status="Unbilled" label="Menunggu SKRD Dinas" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(log.amount || spec.estimated_total || 0)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {log.evidence_photo ? (
                        <button
                          type="button"
                          onClick={() => onPreviewPhoto(log.evidence_photo)}
                          className="text-[#3c8dbc] hover:text-[#367fa9] p-1 cursor-pointer transition-colors"
                          title="Lihat foto bukti kedatangan"
                        >
                          <Eye className="w-4 h-4 mx-auto" />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isStillParked ? (
                        <button
                          type="button"
                          onClick={() => onCheckout(log)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 text-[11px] shadow-xs flex items-center gap-1 mx-auto cursor-pointer transition-all"
                          title="Catat lepas landas & teruskan data ke Dinas untuk SKRD"
                        >
                          <PlaneTakeoff className="w-3.5 h-3.5" />
                          <span>Checkout</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Checkout Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-[#f4f4f4] bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
        <span>Menampilkan {filteredLogs.length} dari {logs.length} catatan realisasi fisik</span>
        <span className="text-[11px] text-gray-400">
          Catatan: Penerbitan SKRD resmi dilakukan oleh <strong>Dinas Perhubungan</strong> setelah armada selesai di-checkout oleh Petugas Lapangan.
        </span>
      </div>
    </div>
  );
};
