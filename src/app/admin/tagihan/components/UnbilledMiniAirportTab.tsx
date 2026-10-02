"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TowerControl, Plane, MapPin, Users, Calendar, Clock, 
  ShieldCheck, AlertCircle, CheckCircle2, Moon, Sun, 
  Search, Loader2, FileText, ArrowRight, Eye, RefreshCw, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { miniAirportLogService, UnbilledMiniAirportLog } from '@/services/miniAirportLogService';
import { invoiceService } from '@/services/invoiceService';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';

dayjs.locale('id');

interface UnbilledMiniAirportTabProps {
  onInvoiceGenerated?: () => void;
  isDinas?: boolean;
}

export default function UnbilledMiniAirportTab({ 
  onInvoiceGenerated,
  isDinas = false
}: Readonly<UnbilledMiniAirportTabProps>) {
  const [logs, setLogs] = useState<UnbilledMiniAirportLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Review & Generate Modal State
  const [selectedLog, setSelectedLog] = useState<UnbilledMiniAirportLog | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchUnbilledLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await miniAirportLogService.getUnbilledLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat log pendaratan Mini Airport');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnbilledLogs();
  }, [fetchUnbilledLogs]);

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const q = searchTerm.toLowerCase();
    return logs.filter(l => 
      l.registration_number.toLowerCase().includes(q) ||
      l.tenant_name.toLowerCase().includes(q) ||
      l.airport_name.toLowerCase().includes(q) ||
      l.application_number.toLowerCase().includes(q)
    );
  }, [logs, searchTerm]);

  const handleGenerateSkrd = async () => {
    if (!selectedLog) return;
    try {
      setIsGenerating(true);
      const newInvoice = await invoiceService.generateMiniAirportSkrd(selectedLog.log_id);
      toast.success(`SKRD Mini Airport berhasil diterbitkan oleh Dinas! Nomor: ${newInvoice.invoice_number}`);
      setSelectedLog(null);
      await fetchUnbilledLogs();
      if (onInvoiceGenerated) {
        onInvoiceGenerated();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Gagal menerbitkan SKRD Mini Airport');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Notice */}
      <div className="bg-[#e8f0fe] border-l-4 border-[#3c8dbc] p-4 text-xs text-slate-700 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <TowerControl className="w-5 h-5 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-slate-900 font-bold text-sm">
              {isDinas 
                ? 'Penetapan SKRD Layanan Lapangan Terbang Perintis (Kewenangan Dinas)' 
                : 'Antrean Penetapan SKRD Dinas (Log Pasca-Checkout Petugas Lapangan)'}
            </strong>
            <p className="leading-relaxed">
              {isDinas ? (
                <>
                  Daftar di bawah memuat realisasi operasional pesawat yang telah selesai <strong>di-checkout oleh Petugas Lapangan Mini Airport</strong>. 
                  Sebagai otoritas Dinas, Anda berwenang menerbitkan SKRD resmi berdasarkan rincian komponen retribusi daerah (Landing Tax, Pax Tax, Airport Tax, dan Parkir Inap).
                </>
              ) : (
                <>
                  Daftar di bawah memuat log operasional yang telah selesai <strong>di-checkout oleh Petugas Lapangan</strong> dan diteruskan ke Dinas. 
                  Sesuai ketentuan, <strong>penerbitan dan penetapan SKRD dilakukan oleh Dinas Perhubungan</strong>, bukan oleh Admin Mini Airport.
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchUnbilledLogs}
          disabled={isLoading}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Muat Ulang
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari nomor permohonan, maskapai, tail number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs border border-slate-300 px-3 py-2 pl-8 bg-white focus:outline-none focus:border-[#3c8dbc]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total Log Pasca-Checkout: <strong className="text-slate-800">{filteredLogs.length} Log</strong>
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafc] border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-4 w-12 text-center">No</th>
              <th className="py-2.5 px-4">Waktu Operasional</th>
              <th className="py-2.5 px-4">Bandara Perintis &amp; Stand</th>
              <th className="py-2.5 px-4">Maskapai &amp; Armada</th>
              <th className="py-2.5 px-4 text-center">Penumpang</th>
              <th className="py-2.5 px-4 text-center">Realisasi Checkout</th>
              <th className="py-2.5 px-4">Petugas Lapangan</th>
              <th className="py-2.5 px-4 text-right">Total Retribusi</th>
              <th className="py-2.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                  Memuat log realisasi Mini Airport...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  Belum ada log pasca-checkout yang menunggu penetapan SKRD oleh Dinas.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={log.log_id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-400 font-mono">{index + 1}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">
                      {dayjs(log.entry_time).format('DD MMM YYYY')}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Masuk: {dayjs(log.entry_time).format('HH:mm')} WIT
                    </span>
                    {log.exit_time && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Keluar: {dayjs(log.exit_time).format('HH:mm')} WIT
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#3c8dbc] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {log.airport_name} ({log.airport_code})
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 block mt-0.5">
                      Stand: <strong className="text-slate-800 font-bold">{log.parking_location}</strong>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-slate-500" />
                      {log.registration_number}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {log.aircraft_type} • <strong className="text-slate-800">{log.tenant_name}</strong>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Users className="w-3 h-3" />
                      {log.passengers_count} Pax
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {log.is_overnight ? (
                      <StatusBadge status="RON" label={`Inap (${log.overnight_nights} Malam)`} />
                    ) : (
                      <StatusBadge status="Parkir Siang" label="Transit (Parkir)" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium text-slate-800 block">{log.officer_name}</span>
                    <span className="text-[10px] text-slate-400">Petugas Lapangan</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 text-[13px]">
                    {formatRupiah(log.total_amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isDinas ? (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold px-3 py-1.5 text-xs shadow-xs flex items-center gap-1 mx-auto cursor-pointer"
                        title="Otoritas Dinas: Terbitkan SKRD Resmi"
                      >
                        <FileText className="w-3.5 h-3.5" /> Review &amp; Terbitkan SKRD
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 text-xs border border-slate-300 shadow-xs flex items-center gap-1 mx-auto cursor-pointer"
                        title="Tinjau rincian log pasca-checkout (Penerbitan SKRD oleh Dinas)"
                      >
                        <Eye className="w-3.5 h-3.5" /> Tinjau Rincian Log
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REVIEW & GENERATE MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-2xl w-full border-t-4 border-[#3c8dbc] my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3c8dbc]" />
                <h3 className="text-sm font-bold text-slate-800">
                  {isDinas 
                    ? 'Penetapan Dokumen SKRD Mini Airport Resmi (Dinas)' 
                    : 'Rincian Realisasi Pendaratan Mini Airport (Pasca-Checkout)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Ringkasan Penerbangan */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 border border-slate-200 text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bandara Perintis Tujuan:</span>
                  <strong className="text-slate-900 text-sm">{selectedLog.airport_name} ({selectedLog.airport_code})</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Stand: <span className="font-mono font-bold text-slate-800">{selectedLog.parking_location}</span></p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Maskapai / Tenant:</span>
                  <strong className="text-slate-900 text-sm">{selectedLog.tenant_name}</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kontrak Payung: <span className="font-mono font-semibold">{selectedLog.contract_number}</span></p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Armada Pesawat:</span>
                  <strong className="text-slate-900 font-mono">{selectedLog.registration_number}</strong>
                  <p className="text-[11px] text-slate-500">{selectedLog.aircraft_type}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Operasional Lapangan:</span>
                  <strong className="text-emerald-700">Checkout Selesai (Lepas Landas)</strong>
                  <p className="text-[11px] text-slate-500">
                    {selectedLog.is_overnight ? `Menginap (${selectedLog.overnight_nights} Malam)` : 'Transit (Parkir Siang)'} • {selectedLog.passengers_count} Pax
                  </p>
                </div>
              </div>

              {/* Rincian Komponen Tax */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Rincian Komponen Retribusi Daerah (master_taxes):
                </h4>
                <div className="border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Uraian Komponen Tax</th>
                        <th className="py-2 px-3 text-right">Tarif Dasar</th>
                        <th className="py-2 px-3 text-center">Volume</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedLog.taxes.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3">
                            <span className="font-semibold text-slate-900 block">{t.nama_tax}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">Kode: {t.kode_tax} • {t.satuan}</span>
                            {t.dasar_hukum && (
                              <span className="text-[9px] text-slate-400 block italic leading-tight">{t.dasar_hukum}</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-700">
                            {formatRupiah(t.tarif)}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-800">
                            {t.qty}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            {formatRupiah(t.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-emerald-50/80 border-t-2 border-emerald-300 font-bold text-emerald-950">
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3 text-right text-xs">
                          TOTAL KETETAPAN RETRIBUSI DAERAH (SKRD):
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-sm text-emerald-900">
                          {formatRupiah(selectedLog.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Ketentuan Penerbitan */}
              {isDinas ? (
                <div className="bg-amber-50/80 border border-amber-200 p-3 text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold block">Pemberitahuan Wewenang Dinas:</span>
                  <p className="leading-relaxed">
                    Dengan mengklik tombol di bawah, Dinas Perhubungan secara resmi menetapkan Surat Ketetapan Retribusi Daerah (SKRD) bernomor <strong>SKRD-MAP/YYYY/MM/XXX</strong> yang secara otomatis ditagihkan kepada maskapai dan terhubung ke Kontrak Payung induk.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-3 text-[11px] text-blue-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Wewenang Penerbitan SKRD:</strong>
                    <p className="mt-0.5">
                      Penerbitan dokumen SKRD resmi merupakan kewenangan <strong>Dinas Perhubungan Kabupaten Mimika</strong>. 
                      Data realisasi pasca-checkout ini telah berhasil diteruskan ke Dinas dan sedang menunggu verifikasi penetapan ketetapan retribusi daerah.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  disabled={isGenerating}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  {isDinas ? 'Batal' : 'Tutup'}
                </button>
                {isDinas && (
                  <button
                    type="button"
                    onClick={handleGenerateSkrd}
                    disabled={isGenerating}
                    className="px-5 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Tetapkan &amp; Terbitkan SKRD Resmi (Dinas)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
