import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, FileSignature, ShieldCheck, Plus, Plane, 
  ChevronDown, ChevronUp, Calendar, Search, FileText, CheckCircle2 
} from 'lucide-react';
import { Contract } from '@/types/contract';
import { RentalApplication } from '@/types/rental';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';
import Link from 'next/link';

interface PayungContractStatusBannerProps {
  readonly activePayung: Contract | null;
  readonly isPayungExpired: boolean;
  readonly isPayungExpiringSoon: boolean;
  readonly daysUntilPayungExpired: number | null;
  readonly activeHanggarApps: RentalApplication[];
  readonly locationName: string;
  readonly onOpenModal: () => void;
  readonly onRequestExtension?: (app: RentalApplication) => void;
}

export const PayungContractStatusBanner: React.FC<PayungContractStatusBannerProps> = ({
  activePayung,
  isPayungExpired,
  isPayungExpiringSoon,
  daysUntilPayungExpired,
  activeHanggarApps,
  locationName,
  onOpenModal,
  onRequestExtension,
}) => {
  // State untuk toggle laci detail saat permohonan banyak
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Total armada terdaftar di seluruh permohonan aktif
  const totalFleetCount = useMemo(() => {
    const ids = new Set<string>();
    for (const app of activeHanggarApps) {
      const spec = typeof app.specific_needs === 'string' ? JSON.parse(app.specific_needs) : (app.specific_needs || {});
      for (const id of (spec.aircraft_ids || [])) {
        ids.add(String(id));
      }
    }
    return ids.size || activeHanggarApps.length;
  }, [activeHanggarApps]);

  // Rentang operasional global (tanggal paling awal s/d tanggal paling akhir)
  const globalRange = useMemo(() => {
    if (activeHanggarApps.length === 0) return null;
    let minDate = activeHanggarApps[0].start_date;
    let maxDate = activeHanggarApps[0].end_date;

    for (const app of activeHanggarApps) {
      if (app.start_date && (!minDate || new Date(app.start_date) < new Date(minDate))) {
        minDate = app.start_date;
      }
      if (app.end_date && (!maxDate || new Date(app.end_date) > new Date(maxDate))) {
        maxDate = app.end_date;
      }
    }

    return {
      startStr: minDate ? dayjs(minDate).format('DD MMM YYYY') : '-',
      endStr: maxDate ? dayjs(maxDate).format('DD MMM YYYY') : '-'
    };
  }, [activeHanggarApps]);

  // Hitung sisa hari permohonan
  const getDaysRemaining = (endDateStr?: string | Date | null) => {
    if (!endDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter daftar aplikasi
  const filteredApps = useMemo(() => {
    if (!searchFilter.trim()) return activeHanggarApps;
    const q = searchFilter.toLowerCase();
    return activeHanggarApps.filter(app => {
      const numMatch = (app.application_number || '').toLowerCase().includes(q);
      const statusMatch = (app.status || '').toLowerCase().includes(q);
      return numMatch || statusMatch;
    });
  }, [activeHanggarApps, searchFilter]);

  return (
    <>
      {/* 1. PERINGATAN H-7 KONTRAK PAYUNG */}
      {isPayungExpiringSoon && activePayung && (
        <div className="bg-white border-t-[3px] border-[#f39c12] p-4 shadow-xs rounded-none">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#f39c12] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-[#333] text-sm">
                Peringatan: Masa Berlaku Kontrak Payung Akan Berakhir ({daysUntilPayungExpired} Hari Lagi)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kontrak Payung No. <strong>{activePayung.contract_number}</strong> akan berakhir pada tanggal <strong>{dayjs(activePayung.end_date).format('DD MMMM YYYY')}</strong>. Segera ajukan perpanjangan kontrak agar tidak menghentikan izin pengajuan jadwal pendaratan pesawat.
              </p>
              <div className="mt-2.5">
                <Link
                  href="/tenant/kontrak-payung"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f39c12] hover:bg-[#e08e0b] text-white text-xs font-bold rounded-none shadow-xs transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Perpanjang Kontrak Payung
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KONTRAK TIDAK AKTIF ATAU EXPIRED */}
      {!activePayung || isPayungExpired ? (
        <div className="bg-white border-t-[3px] border-[#dd4b39] p-4 shadow-xs rounded-none">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#dd4b39] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-[#333] text-sm">
                Kontrak Payung (PKS Induk) Tidak Aktif atau Telah Berakhir
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Anda wajib memiliki Kontrak Payung (PKS Induk) aktif untuk dapat mengajukan jadwal pemakaian fasilitas hanggar/apron.
                {activePayung?.end_date && (
                  <span> Masa berlaku Kontrak Payung Anda berakhir pada tanggal <strong>{dayjs(activePayung.end_date).format('DD MMMM YYYY')}</strong>.</span>
                )}
              </p>
              <div className="mt-3">
                <Link
                  href="/tenant/kontrak-payung"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#dd4b39] hover:bg-[#c93b2a] text-white rounded-none text-xs font-bold shadow-xs transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Buka Modul Kontrak Payung
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : activeHanggarApps.length === 0 ? (
        /* 3. TIDAK ADA PERMOHONAN SEWA AKTIF */
        <div className="bg-white border-t-[3px] border-[#f39c12] p-4 shadow-xs rounded-none">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#f39c12] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-[#333] text-sm">
                Belum Ditemukan Izin Sewa Hanggar Aktif
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kontrak Payung Anda aktif (No: <strong>{activePayung.contract_number}</strong>), namun Anda belum memiliki permohonan sewa hanggar yang telah disetujui atau periode sewa hanggar Anda telah berakhir. Silakan lengkapi permohonan sewa hanggar terlebih dahulu.
              </p>
              <div className="mt-3">
                <Link
                  href="/tenant/permohonan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white rounded-none text-xs font-bold shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Lihat Menu Permohonan Sewa
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4. EXECUTIVE SMART BANNER (COLLAPSIBLE & SCALABLE FOR ANY NUMBER OF PERMOHONAN) */
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs rounded-none transition-all">
          {/* Header Baris Utama Ringkas */}
          <div className="p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <ShieldCheck className="w-5 h-5 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
              <div className="w-full">
                {/* Info Baris 1: PKS, Lokasi, dan Status Izin */}
                <div className="flex items-center gap-2 flex-wrap text-sm font-bold text-slate-900">
                  <span>PKS: {activePayung.contract_number}</span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                    Lokasi: {locationName}
                  </span>
                  <span className="text-[11px] font-bold bg-[#00a65a] text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    {activeHanggarApps.length} Izin Sewa Aktif
                  </span>
                  <span className="text-[11px] font-bold bg-[#3c8dbc] text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <Plane className="w-3 h-3 text-white" />
                    Total {totalFleetCount} Armada
                  </span>
                </div>

                {/* Info Baris 2: Rentang Operasional Global + Quick Toggle Button */}
                <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-slate-600">
                  {globalRange && (
                    <span>
                      Rentang Operasional: <strong>{globalRange.startStr}</strong> s/d <strong>{globalRange.endStr}</strong>
                    </span>
                  )}

                  {/* Tombol Toggle Laci Rincian */}
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3c8dbc] hover:text-[#367fa9] bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 border border-blue-200 rounded-none cursor-pointer transition-colors"
                  >
                    {isDrawerOpen ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Tutup Rincian Izin ({activeHanggarApps.length})
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Lihat Rincian Izin ({activeHanggarApps.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="w-full lg:w-auto flex items-center justify-end">
              <button
                type="button"
                onClick={onOpenModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs rounded-none shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-white" />
                Ajukan Jadwal Pemakaian
              </button>
            </div>
          </div>

          {/* LACI RINCIAN EXPANDABLE (TABLE ENTERPRISE UNTUK BERAPAPUN JUMLAH IZIN SEWA) */}
          {isDrawerOpen && (
            <div className="border-t border-slate-200 bg-slate-50/70 p-4 animate-in slide-in-from-top-2 duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  Daftar Seluruh Permohonan Sewa Hanggar Aktif
                </div>

                {/* Kolom Pencarian Cepat jika izin lebih dari 3 */}
                {activeHanggarApps.length > 3 && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nomor tiket permohonan..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-none text-xs bg-white focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc]"
                    />
                  </div>
                )}
              </div>

              {/* Tabel Ringkasan Ramping */}
              <div className="overflow-x-auto border border-slate-200 bg-white max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] text-[#333] font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider sticky top-0 z-10">
                      <th className="py-2.5 px-3">No. Tiket</th>
                      <th className="py-2.5 px-3">Periode Sewa</th>
                      <th className="py-2.5 px-3">Jumlah Armada</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Masa Berlaku</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.map((app) => {
                      const spec = typeof app.specific_needs === 'string' ? JSON.parse(app.specific_needs) : (app.specific_needs || {});
                      const count = spec.aircraft_ids?.length || 1;
                      const remainingDays = getDaysRemaining(app.end_date);
                      const hasPendingExt = spec.extension_request?.status === 'Pending';

                      return (
                        <tr key={app.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#3c8dbc]">
                            {app.application_number}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            {dayjs(app.start_date).format('DD MMM YYYY')} s/d {dayjs(app.end_date).format('DD MMM YYYY')}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              <Plane className="w-3 h-3 text-[#3c8dbc]" />
                              {count} Pesawat
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <StatusBadge status={app.status || 'Aktif'} />
                          </td>
                          <td className="py-2.5 px-3 text-center font-medium">
                            {remainingDays !== null ? (
                              <span className={`text-[11px] font-bold ${
                                remainingDays <= 3 ? 'text-red-600' : remainingDays <= 7 ? 'text-amber-600' : 'text-slate-600'
                              }`}>
                                {remainingDays > 0 ? `${remainingDays} hari lagi` : 'Hari Terakhir'}
                              </span>
                            ) : '-'}
                            {hasPendingExt && (
                              <div className="mt-1">
                                <StatusBadge status="Menunggu" label={`⏳ Verifikasi (+${spec.extension_request.additional_days}H)`} className="text-[9px] px-1.5 py-0.2" />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  💡 Setiap armada pesawat terikat pada salah satu tiket di atas. Tanggal kalender pada form jadwal akan otomatis mengunci sesuai izin armada yang dipilih.
                </span>
                <span className="font-medium text-slate-400">
                  Menampilkan {filteredApps.length} dari {activeHanggarApps.length} Izin
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
