"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TowerControl, Search, Loader2, RefreshCw, Eye, X, 
  MapPin, Clock, Moon, Sun, AlertCircle, FileText
} from 'lucide-react';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/StatusBadge';
import { StandCapacityCards } from '@/app/petugas/mini-airport/components/StandCapacityCards';

interface MiniAirportPemakaianViewProps {
  readonly user: any;
}

export const MiniAirportPemakaianView: React.FC<MiniAirportPemakaianViewProps> = ({ user }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await miniAirportLogService.getAllLogs();
      setLogs(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat log operasional Mini Airport');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Keterisian Stand Apron Aktif (pesawat yang belum takeoff / exit_time === null)
  const stand1Occupied = useMemo(() => {
    return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('01'));
  }, [logs]);

  const stand2Occupied = useMemo(() => {
    return logs.find((l) => !l.exit_time && (l.parking_location || '').includes('02'));
  }, [logs]);

  // KPIs
  const unbilledCount = useMemo(() => logs.filter((l) => l.billing_status === 'Unbilled').length, [logs]);
  const billedCount = useMemo(() => logs.filter((l) => l.billing_status === 'Billed').length, [logs]);
  const overnightCount = useMemo(() => logs.filter((l) => Boolean(l.is_overnight)).length, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const q = searchTerm.toLowerCase();
    return logs.filter((l) => {
      const reg = (l.registration_number || '').toLowerCase();
      const tenant = (l.tenants?.nama_perusahaan || '').toLowerCase();
      const stand = (l.parking_location || '').toLowerCase();
      const officer = (l.officer?.username || '').toLowerCase();
      return reg.includes(q) || tenant.includes(q) || stand.includes(q) || officer.includes(q);
    });
  }, [logs, searchTerm]);

  return (
    <div className="space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Log Realisasi Lapangan{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">
              {user?.airport_name || 'Bandara Perintis Papua Tengah'} {user?.airport_code ? `(${user.airport_code})` : ''}
            </span>
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Audit Realisasi Fisik Pendaratan, Kapasitas Stand Apron, Manifes Penumpang &amp; Dokumen SKRD
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            title="Refresh Data"
            className="p-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3c8dbc]" /> Refresh
          </button>
          <div className="text-[12px] text-[#777] flex items-center bg-white border border-[#d2d6de] p-2 shadow-2xs hidden sm:flex">
            <span className="mr-1">Admin Mini Airport</span> / <span className="ml-1 font-bold text-slate-800">Log Realisasi</span>
          </div>
        </div>
      </header>

      {/* 4 Small Boxes / KPI Cards Konsisten Style AdminLTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Total Realisasi */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <TowerControl className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Total Pendaratan</span>
            <span className="text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {logs.length} Flight
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-0.5 truncate">
              {user?.airport_name || 'Mini Airport'}
            </span>
          </div>
        </div>

        {/* Box 2: Belum Terbit SKRD */}
        <div className="bg-white border-t-[3px] border-[#f39c12] shadow-xs flex items-stretch">
          <div className="w-[75px] bg-amber-50/50 border-r border-[#f4f4f4] flex items-center justify-center text-[#f39c12] flex-shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Belum Terbit SKRD</span>
            <span className="text-[20px] font-bold text-[#f39c12] font-mono leading-tight mt-0.5">
              {unbilledCount} Log
            </span>
            <span className="text-[11px] text-[#f39c12] font-bold mt-0.5 truncate">
              Menunggu Penerbitan SKRD
            </span>
          </div>
        </div>

        {/* Box 3: Sudah Terbit SKRD */}
        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-xs flex items-stretch">
          <div className="w-[75px] bg-emerald-50/50 border-r border-[#f4f4f4] flex items-center justify-center text-[#00a65a] flex-shrink-0">
            <FileText className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Sudah Terbit SKRD</span>
            <span className="text-[20px] font-bold text-[#00a65a] font-mono leading-tight mt-0.5">
              {billedCount} SKRD
            </span>
            <span className="text-[11px] text-[#00a65a] font-bold mt-0.5 truncate">
              Selesai Ditetapkan Dinas
            </span>
          </div>
        </div>

        {/* Box 4: Parkir Inap (RON) */}
        <div className="bg-white border-t-[3px] border-[#605ca8] shadow-xs flex items-stretch">
          <div className="w-[75px] bg-purple-50/50 border-r border-[#f4f4f4] flex items-center justify-center text-[#605ca8] flex-shrink-0">
            <Moon className="w-8 h-8" />
          </div>
          <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Parkir Inap (RON)</span>
            <span className="text-[20px] font-bold text-[#605ca8] font-mono leading-tight mt-0.5">
              {overnightCount} Armada
            </span>
            <span className="text-[11px] text-[#605ca8] font-bold mt-0.5 truncate">
              Tarif Inap Malam Diaplikasikan
            </span>
          </div>
        </div>
      </div>

      {/* Visual Status Keterisian Apron (Stand 01 & Stand 02) */}
      <StandCapacityCards
        stand1Occupied={stand1Occupied}
        stand2Occupied={stand2Occupied}
      />

      {/* Main Container: Tabel Log Realisasi Pendaratan */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        {/* Toolbar Header with Search */}
        <div className="p-3.5 border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2">
            <TowerControl className="w-5 h-5 text-[#3c8dbc]" />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                Catatan Realisasi Fisik Lapangan — {user?.airport_name || 'Mini Airport'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Pencatatan realisasi pendaratan, alokasi stand 01/02, jumlah pax, dan status parkir inap dari Petugas Lapangan.
              </p>
            </div>
          </div>

          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <input
              type="text"
              placeholder="Cari armada, maskapai, stand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#d2d6de] text-xs focus:border-[#3c8dbc] outline-none bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc] mb-2" />
              <span className="text-xs">Memuat data realisasi pendaratan...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#f4f4f4] bg-[#f9fafb] text-[#555] uppercase text-[11px] font-semibold">
                  <th className="py-3 px-4">Waktu Pendaratan</th>
                  <th className="py-3 px-4">Armada &amp; Maskapai</th>
                  <th className="py-3 px-4">Alokasi Stand</th>
                  <th className="py-3 px-4">Penumpang (PAX)</th>
                  <th className="py-3 px-4">Kategori Parkir</th>
                  <th className="py-3 px-4">Foto Bukti</th>
                  <th className="py-3 px-4 text-center">Status Tagihan</th>
                  <th className="py-3 px-4 text-right">Estimasi Retribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Belum ada catatan realisasi pendaratan fisik di bandara ini.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => {
                    const isOvernight = Boolean(item.is_overnight);
                    const standName = (item.parking_location || '').includes('01') 
                      ? 'Stand 01' 
                      : ((item.parking_location || '').includes('02') ? 'Stand 02' : item.parking_location || 'Apron');

                    const photoUrl = item.evidence_photo || item.parsedNotes?.evidence_photo;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block">
                            {dayjs(item.entry_time).format('DD MMM YYYY, HH:mm')} WIT
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {item.exit_time 
                              ? `Takeoff: ${dayjs(item.exit_time).format('HH:mm')} WIT` 
                              : 'Masih di Apron (Active)'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 border border-blue-200 inline-block">
                            {item.registration_number}
                          </span>
                          <span className="text-slate-700 font-semibold block text-[11px] mt-0.5">
                            {item.tenants?.nama_perusahaan || 'Mitra Maskapai'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.parsedNotes?.aircraft_type || 'Armada Perintis'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                            <TowerControl className="w-3 h-3" />
                            {standName}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {item.parsedNotes?.passengers_count || 0} Orang
                        </td>
                        <td className="py-3 px-4">
                          {isOvernight ? (
                            <StatusBadge status="RON" label="Inap Malam (RON)" />
                          ) : (
                            <StatusBadge status="Parkir Siang" label="Parkir Siang" />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {photoUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewPhotoUrl(photoUrl)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3c8dbc] hover:text-[#367fa9] bg-blue-50 px-2 py-1 border border-blue-200 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Lihat Foto
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tidak ada foto</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={item.billing_status === 'Billed' ? 'SKRD Terbit' : 'Unbilled'} />
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                          {formatRupiah(item.amount || item.parsedNotes?.estimated_total || 0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Menampilkan {filteredLogs.length} realisasi pendaratan di {user?.airport_name || 'Mini Airport'}</span>
          <span className="font-semibold text-slate-700">Sistem MARS Jaringan Mini Airport Papua Tengah</span>
        </div>
      </div>

      {/* Modal Preview Foto Bukti */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full border-t-[3px] border-[#3c8dbc] shadow-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TowerControl className="w-4 h-4 text-[#3c8dbc]" /> Foto Bukti Fisik Lapangan Mini Airport
              </h3>
              <button
                type="button"
                onClick={() => setPreviewPhotoUrl(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-900 rounded-none overflow-hidden max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewPhotoUrl}
                alt="Bukti Fisik Mini Airport"
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setPreviewPhotoUrl(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
