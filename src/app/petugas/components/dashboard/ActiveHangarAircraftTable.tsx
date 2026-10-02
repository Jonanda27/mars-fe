import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plane, Search, Plus, Loader2, Camera, LogOut, AlertTriangle, FileText 
} from 'lucide-react';
import { getFileUrl } from '@/utils/url';
import { SuratPKSDaruratModal } from '@/components/SuratPKSDaruratModal';
import { Contract } from '@/types/contract';
import dayjs from 'dayjs';

interface ActiveHangarAircraftTableProps {
  readonly activeLogs: any[];
  readonly filteredLogs: any[];
  readonly isLoadingLogs: boolean;
  readonly searchLogTerm: string;
  readonly setSearchLogTerm: (val: string) => void;
  readonly onOpenCheckInModal: () => void;
  readonly onOpenEmergencyModal?: () => void;
  readonly onOpenCheckOutModal: (logId: number, registration: string) => void;
}

export const ActiveHangarAircraftTable: React.FC<ActiveHangarAircraftTableProps> = ({
  activeLogs,
  filteredLogs,
  isLoadingLogs,
  searchLogTerm,
  setSearchLogTerm,
  onOpenCheckInModal,
  onOpenCheckOutModal,
}) => {
  const [selectedEmergencyContract, setSelectedEmergencyContract] = useState<Contract | null>(null);
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
      <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#3c8dbc]" />
            Pesawat Sedang Parkir di Fasilitas ({activeLogs.length} Armada)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Armada yang saat ini berada di dalam hanggar atau apron. Catat Check-Out saat pesawat fisik keluar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <input
              type="text"
              placeholder="Cari registrasi / tenant..."
              value={searchLogTerm}
              onChange={(e) => setSearchLogTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <Link
            href="/petugas/pendaratan-darurat"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Pendaratan Darurat
          </Link>

          <button
            type="button"
            onClick={onOpenCheckInModal}
            className="px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Check-In Manual
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoadingLogs ? (
          <div className="p-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-[#3c8dbc]" />
            <span className="text-xs">Memuat data armada parkir...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Plane className="w-10 h-10 mx-auto text-slate-300 mb-1" />
            <p className="text-xs font-bold text-slate-600">Tidak ada pesawat yang sedang parkir saat ini</p>
            <p className="text-[11px] text-slate-400">Pesawat yang mendarat akan muncul di sini setelah di-check-in.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">No</th>
                <th className="py-2.5 px-4">Tail Number</th>
                <th className="py-2.5 px-4">Tenant / Operator</th>
                <th className="py-2.5 px-4 text-center">Status / PKS</th>
                <th className="py-2.5 px-4 text-center">Lokasi</th>
                <th className="py-2.5 px-4">Waktu Masuk</th>
                <th className="py-2.5 px-4 text-center">Durasi Inap</th>
                <th className="py-2.5 px-4 text-center">Foto Bukti</th>
                <th className="py-2.5 px-4 text-center">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, index) => {
                const entryDate = new Date(log.entry_time);
                const diffHours = Math.max(1, Math.round((new Date().getTime() - entryDate.getTime()) / (1000 * 60 * 60)));
                const diffDays = Math.max(1, Math.ceil(diffHours / 24));
                const isEmergency = log.contracts?.contract_type === 'PKS Pendaratan Darurat' || 
                  (log.notes && log.notes.includes('Pendaratan Darurat'));

                return (
                  <tr key={log.id} className={`transition-colors ${isEmergency ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {log.registration_number}
                        {isEmergency && (
                          <span className="px-1.5 py-0.2 bg-[#dd4b39] text-white text-[9px] font-bold rounded">
                            EMERGENCY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {log.schedule_id ? 'Via Jadwal Resmi' : (isEmergency ? 'PKS Darurat Lapangan' : 'Check-In Manual')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{log.tenants?.nama_perusahaan || 'Operator Tamu'}</div>
                      {isEmergency && log.contracts?.contract_number && (
                        <div className="text-[10px] text-red-600 font-mono">
                          {log.contracts.contract_number}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEmergency ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (log.contracts) {
                              setSelectedEmergencyContract({
                                ...log.contracts,
                                tenants: log.contracts.tenants || log.tenants
                              });
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 hover:bg-red-200 border border-red-300 rounded-none cursor-pointer transition-colors shadow-2xs"
                          title="Klik untuk melihat / mencetak Surat PKS Darurat"
                        >
                          <FileText className="w-2.5 h-2.5" /> PKS Darurat
                        </button>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded">
                          {log.contracts?.contract_type || 'PKS Reguler'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                        log.parking_location === 'Apron'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
                      }`}>
                        {log.parking_location || 'Hanggar'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {dayjs(log.entry_time).format('DD/MM/YYYY, HH:mm')} WIT
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 text-[11px] rounded">
                        {diffDays} Hari ({diffHours} Jam)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {log.log_evidence ? (
                        <a
                          href={getFileUrl(log.log_evidence)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#3c8dbc] hover:underline font-bold"
                        >
                          <Camera className="w-3 h-3" /> Lihat Foto
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {isEmergency && log.contracts && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEmergencyContract({
                                ...log.contracts,
                                tenants: log.contracts.tenants || log.tenants
                              });
                            }}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-[11px] shadow-2xs inline-flex items-center gap-1 cursor-pointer rounded-none transition-colors"
                            title="Buka &amp; Cetak Surat PKS Pendaratan Darurat"
                          >
                            <FileText className="w-3 h-3 text-red-600" /> Surat PKS
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenCheckOutModal(log.id, log.registration_number)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs inline-flex items-center gap-1 cursor-pointer rounded-none transition-colors"
                        >
                          <LogOut className="w-3 h-3" /> Check-Out Keluar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL SURAT PKS DARURAT */}
      {selectedEmergencyContract && (
        <SuratPKSDaruratModal
          contract={selectedEmergencyContract}
          onClose={() => setSelectedEmergencyContract(null)}
        />
      )}
    </div>
  );
};
