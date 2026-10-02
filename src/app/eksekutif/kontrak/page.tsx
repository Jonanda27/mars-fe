"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { 
  ShieldCheck, 
  FileText, 
  Search, 
  Eye, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  Plane, 
  Building2,
  FileCheck,
  MapPin
} from 'lucide-react';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

type FilterTab = 'all' | 'pending' | 'active' | 'hanggar' | 'mini_airport' | 'ruangan';

export default function EksekutifKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await contractService.getContracts();
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper check for pending endorsement
  const isPendingKadis = (c: Contract) => {
    const s = (c.status || '').toLowerCase();
    return s.includes('menunggu pengesahan') || 
           s.includes('menunggu verifikasi') || 
           s.includes('review') ||
           s === 'draft';
  };

  const isMiniAirport = (c: Contract) => {
    return c.contract_type === 'PKS Payung Mini Airport' || 
           Boolean(
             c.fasilitas && 
             typeof c.fasilitas === 'object' && 
             ((c.fasilitas as any).category === 'Mini Airport' || 
              (c.fasilitas as any).mini_airport_id || 
              (c.fasilitas as any).airport_code)
           ) ||
           Boolean(c.contract_number && c.contract_number.startsWith('PKS-PAYUNG/'));
  };

  const isHanggar = (c: Contract) => {
    if (isMiniAirport(c)) return false;
    return c.contract_type === 'Payung' || 
           c.contract_type === 'PKS Payung Mozes Kilangin' || 
           (c.assets?.jenis_aset || '').toLowerCase().includes('hanggar');
  };

  const isRuangan = (c: Contract) => {
    if (isMiniAirport(c) || isHanggar(c)) return false;
    return (c.assets?.jenis_aset || '').toLowerCase().includes('ruang') || 
           (c.contract_type || '').toLowerCase().includes('ruang') ||
           Boolean(c.asset_id);
  };

  // KPIs / Counter Stats
  const stats = useMemo(() => {
    const pending = contracts.filter(isPendingKadis).length;
    const active = contracts.filter(c => ['Aktif', 'Active'].includes(c.status || '')).length;
    const hanggar = contracts.filter(isHanggar).length;
    const miniAirport = contracts.filter(isMiniAirport).length;
    const ruangan = contracts.filter(isRuangan).length;
    return { pending, active, hanggar, miniAirport, ruangan, total: contracts.length };
  }, [contracts]);

  // Filtered List
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      // Tab filter
      if (activeTab === 'pending' && !isPendingKadis(c)) return false;
      if (activeTab === 'active' && !['Aktif', 'Active'].includes(c.status || '')) return false;
      if (activeTab === 'hanggar' && !isHanggar(c)) return false;
      if (activeTab === 'mini_airport' && !isMiniAirport(c)) return false;
      if (activeTab === 'ruangan' && !isRuangan(c)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const num = (c.contract_number || '').toLowerCase();
        const tenant = (c.tenants?.nama_perusahaan || '').toLowerCase();
        const asset = (c.assets?.nama_aset || '').toLowerCase();
        const type = (c.contract_type || '').toLowerCase();
        const purpose = (c.jenis_pemanfaatan || '').toLowerCase();
        if (!num.includes(query) && !tenant.includes(query) && !asset.includes(query) && !type.includes(query) && !purpose.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [contracts, activeTab, searchQuery]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Persetujuan Kontrak <small className="text-[15px] font-light text-[#777] ml-2">Daftar kontrak masuk</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Eksekutif Portal</span> / <span className="ml-1 font-medium">Persetujuan Kontrak</span>
        </div>
      </header>

      {/* Box Utama Tabel Kontrak PKS */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        
        {/* Filter Tabs & Search Header */}
        <div className="p-3.5 border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          
          {/* Tabs Filter Konsisten */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-none border ${
                activeTab === 'pending'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> 
              <span>Menunggu Pengesahan</span>
              <span className={`px-1.5 py-0.2 rounded-none text-[10.5px] font-mono ${
                activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {stats.pending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-none border ${
                activeTab === 'active'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> 
              <span>Kontrak Aktif</span>
              <span className={`px-1.5 py-0.2 rounded-none text-[10.5px] font-mono ${
                activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.active}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hanggar')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-none border ${
                activeTab === 'hanggar'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Plane className="w-3.5 h-3.5" /> 
              <span>PKS Payung (Hanggar)</span>
              <span className={`px-1.5 py-0.2 rounded-none text-[10.5px] font-mono ${
                activeTab === 'hanggar' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.hanggar}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mini_airport')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-none border ${
                activeTab === 'mini_airport'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> 
              <span>PKS Payung (Mini Airport)</span>
              <span className={`px-1.5 py-0.2 rounded-none text-[10.5px] font-mono ${
                activeTab === 'mini_airport' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.miniAirport}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ruangan')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-none border ${
                activeTab === 'ruangan'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> 
              <span>PKS Sewa Ruangan</span>
              <span className={`px-1.5 py-0.2 rounded-none text-[10.5px] font-mono ${
                activeTab === 'ruangan' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.ruangan}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                activeTab === 'all'
                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              Semua ({stats.total})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor, mitra, atau aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#3c8dbc] bg-slate-50"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#3c8dbc]" /> Memuat daftar kontrak PKS...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">NOMOR KONTRAK / PKS</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">NAMA MITRA / TENANT</th>
                  <th className="py-2.5 px-3 font-bold">JENIS &amp; OBJEK SEWA</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">PERIODE KONTRAK</th>
                  <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap">DOKUMEN SCAN TTD</th>
                  <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap">STATUS</th>
                  <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap">TINDAKAN KADIS</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#777]">
                      <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-600">Tidak ada data kontrak pada kategori ini</p>
                      <p className="text-xs text-slate-400 mt-0.5">Semua dokumen kontrak telah diperbarui.</p>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((c) => {
                    const isPayungContract = c.contract_type === 'Payung';
                    return (
                      <tr key={c.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        
                        {/* No Kontrak */}
                        <td className="py-2.5 px-3 font-bold text-[#3c8dbc] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs">{c.contract_number}</span>
                          </div>
                          <div className="text-[10.5px] text-[#777] font-normal mt-0.5">
                            Dibuat: {dayjs(c.created_at).format('DD/MM/YYYY')}
                          </div>
                        </td>

                        {/* Tenant */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-bold text-[#333] text-xs">{c.tenants?.nama_perusahaan || 'N/A'}</div>
                          <div className="text-[11px] text-[#777] mt-0.5">PIC: {c.tenants?.pic || '-'}</div>
                        </td>

                        {/* Objek Sewa (Membungkus 2 baris agar tabel pas di layar tanpa horizontal scroll) */}
                        <td className="py-2.5 px-3 max-w-[220px]">
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              if (isMiniAirport(c)) {
                                return (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap bg-sky-50 text-sky-700 border border-sky-300">
                                    PKS Payung (Mini Airport)
                                  </span>
                                );
                              }
                              if (isHanggar(c)) {
                                return (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap bg-blue-50 text-[#3c8dbc] border border-blue-200">
                                    PKS Payung (Hanggar)
                                  </span>
                                );
                              }
                              return (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200">
                                  PKS Sewa Ruangan
                                </span>
                              );
                            })()}
                          </div>
                          <div className="text-[11.5px] font-medium text-slate-700 mt-1 leading-snug break-words" title={c.assets?.nama_aset || c.jenis_pemanfaatan || '-'}>
                            {c.assets?.nama_aset || c.jenis_pemanfaatan || '-'}
                          </div>
                        </td>

                        {/* Periode */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="text-slate-800 font-medium text-[11.5px] whitespace-nowrap">
                            {c.start_date ? dayjs(c.start_date).format('DD MMM YYYY') : '-'} s/d {c.end_date ? dayjs(c.end_date).format('DD MMM YYYY') : '-'}
                          </div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5">
                            {c.start_date && c.end_date ? `${dayjs(c.end_date).diff(dayjs(c.start_date), 'month')} Bulan` : '-'}
                          </div>
                        </td>

                        {/* Dokumen Lampiran (Tetap 1 baris) */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {c.signed_document_url ? (
                            <span className="inline-flex items-center text-[11px] font-bold text-[#3c8dbc] bg-blue-50 px-2.5 py-1 border border-blue-200 rounded whitespace-nowrap">
                              <FileCheck className="w-3.5 h-3.5 mr-1 text-[#3c8dbc] flex-shrink-0" />
                              <span>Tersedia (Scan TTD)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded whitespace-nowrap">
                              <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                              <span>Draf Sistem</span>
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <StatusBadge status={c.status || 'Draft'} />
                        </td>

                        {/* Tindakan (Tetap 1 baris) */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <Link 
                            href={`/eksekutif/kontrak/${c.id}`}
                            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-none text-xs font-bold transition-all shadow-2xs whitespace-nowrap ${
                              isPendingKadis(c)
                                ? 'bg-[#3c8dbc] hover:bg-[#367fa9] text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {isPendingKadis(c) ? (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                <span>Tinjau &amp; Sahkan</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                <span>Lihat Detail PKS</span>
                              </>
                            )}
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Info Tabel */}
        <div className="p-3 bg-slate-50 border-t border-[#f4f4f4] text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Menampilkan <strong className="text-slate-700">{filteredContracts.length}</strong> dari total <strong className="text-slate-700">{contracts.length}</strong> kontrak
          </span>
          <span className="font-mono text-[11px] text-slate-400">Sistem MARS &bull; Pengesahan Regulasi BMD Kab. Mimika</span>
        </div>
      </div>

      {/* Footer Hak Cipta MARS */}
      <footer className="text-center text-[11px] text-[#777] py-2 border-t border-[#d2d6de]/60 mt-2">
        MARS &mdash; Mimika (Mozes Kilangin) Airport Revenue System &copy; {new Date().getFullYear()} Pemerintah Kabupaten Mimika
      </footer>

    </div>
  );
}
