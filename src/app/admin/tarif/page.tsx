"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Loader2, Database, ShieldCheck } from 'lucide-react';
import { tariffService } from '@/services/tariffService';
import { taxService } from '@/services/taxService';
import { MasterTariff } from '@/types/tariff';
import { MasterTax } from '@/types/tax';
import { formatRupiah } from '@/utils/formatCurrency';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/StatusBadge';

export default function MasterTarifPage() {
  const { user } = useAuthStore();
  const isMiniAdmin = (user?.role || '').toLowerCase() === 'admin_mini_airport' || Boolean(user?.mini_airport_id);
  const isMozesAdmin = (user?.role || '').toLowerCase() === 'admin' && !isMiniAdmin;

  const [activeTab, setActiveTab] = useState<'tariff' | 'tax'>(isMiniAdmin ? 'tax' : 'tariff');
  const [tariffs, setTariffs] = useState<MasterTariff[]>([]);
  const [taxes, setTaxes] = useState<MasterTax[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tariffData, taxData] = await Promise.all([
        tariffService.getAll().catch(() => []),
        taxService.getAll().catch(() => [])
      ]);
      setTariffs(tariffData || []);
      setTaxes(taxData || []);
    } catch (error) {
      console.error("Error fetching tariffs and taxes:", error);
      toast.error('Gagal memuat data master tarif / retribusi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTariff = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tarif sewa ini?')) return;
    try {
      setDeleting(true);
      await tariffService.delete(id);
      toast.success('Tarif berhasil dihapus');
      await fetchData();
    } catch (error) {
      console.error("Error deleting tariff:", error);
      toast.error('Gagal menghapus tarif. Pastikan tidak ada data yang terikat.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTariffs = tariffs.filter(t => 
    t.kode_tarif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.jenis_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.objek.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTaxes = taxes.filter(tx =>
    tx.kode_tax.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.nama_tax.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.aircraft_types?.jenis_pesawat || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline gap-2">
            {isMiniAdmin ? 'Master Tax Retribusi Daerah' : 'Master Tarif & Retribusi'}
            <small className="text-[15px] font-light text-[#777]">
              {isMiniAdmin
                ? `Dasar Perhitungan SKRD & Lampiran PKS Payung ${user?.airport_name || 'Mini Airport'}`
                : (activeTab === 'tax' ? 'Retribusi Pelayanan Kebandarudaraan Mini Airport' : 'Tarif Sewa Hanggar & Apron Mozes Kilangin')
              }
            </small>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">{isMiniAdmin ? 'Admin Mini Airport' : 'Admin'}</span> / <span className="ml-1 font-medium">Master Tarif</span>
        </div>
      </header>

      {/* Tabs Switcher: Mozes Kilangin vs Mini Airport (hanya untuk pengawas global) */}
      {!isMiniAdmin && !isMozesAdmin && (
        <div className="flex border-b border-[#d2d6de] mb-4 bg-white px-2 pt-2 rounded-t-xs shadow-2xs">
          <button
            type="button"
            onClick={() => { setActiveTab('tariff'); setSearchTerm(''); }}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'tariff'
                ? 'border-[#3c8dbc] text-[#3c8dbc]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database className="w-4 h-4" />
            Master Tarif Sewa Mozes Kilangin (m²)
            <span className="ml-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
              {tariffs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('tax'); setSearchTerm(''); }}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'tax'
                ? 'border-[#3c8dbc] text-[#3c8dbc]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Master Tax Retribusi Mini Airport (PKS Payung)
            <span className="ml-1 text-[10px] bg-blue-100 text-[#3c8dbc] font-bold px-1.5 py-0.5 rounded font-bold">
              {taxes.length}
            </span>
          </button>
        </div>
      )}

      {/* TAB 1: MASTER TARIF MOZES KILANGIN */}
      {activeTab === 'tariff' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/admin/tarif/tambah" 
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-2 text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-colors rounded-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tarif Mozes</span>
            </Link>
          </div>

          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
            <div className="p-3 border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="text-sm font-bold text-[#333]">
                Daftar Tarif Sewa Aset Bangunan &amp; Lahan ({filteredTariffs.length})
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari kode, layanan, objek..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-[#d2d6de] text-xs focus:outline-none focus:border-[#3c8dbc] rounded-xs w-64"
                />
                <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-2" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#f4f4f4] text-slate-700 bg-slate-50">
                    <th className="py-2.5 px-4 font-bold">Kode Tarif</th>
                    <th className="py-2.5 px-4 font-bold">Jenis Layanan</th>
                    <th className="py-2.5 px-4 font-bold">Objek</th>
                    <th className="py-2.5 px-4 font-bold">Tarif Dasar</th>
                    <th className="py-2.5 px-4 font-bold text-center">Satuan</th>
                    <th className="py-2.5 px-4 font-bold text-center">Status</th>
                    <th className="py-2.5 px-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin text-[#3c8dbc] mx-auto mb-2" />
                        <p>Memuat data tarif...</p>
                      </td>
                    </tr>
                  ) : filteredTariffs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Tidak ada data tarif sewa ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredTariffs.map((t) => (
                      <tr key={t.id} className="border-b border-[#f4f4f4] hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-[#3c8dbc] font-bold font-mono">{t.kode_tarif}</td>
                        <td className="py-2.5 px-4 font-bold text-[#333]">{t.jenis_layanan}</td>
                        <td className="py-2.5 px-4 text-slate-600">{t.objek}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {formatRupiah(t.tarif)}
                        </td>
                        <td className="py-2.5 px-4 text-center text-slate-600">
                          {t.satuan}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge status={t.status === 'Active' ? 'Aktif' : 'Inaktif'} />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link 
                              href={`/admin/tarif/edit/${t.id}`}
                              className="bg-[#3c8dbc] text-white p-1 hover:bg-[#367fa9] rounded-2xs shadow-2xs" 
                              title="Edit Tarif"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTariff(t.id)}
                              disabled={deleting}
                              className="bg-[#dd4b39] text-white p-1 hover:bg-[#c9302c] rounded-2xs shadow-2xs disabled:opacity-50 cursor-pointer" 
                              title="Hapus Tarif"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER TAX RETRIBUSI DAERAH (MINI AIRPORT) */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border-l-4 border-[#3c8dbc] p-4 text-xs text-slate-800">
            <h4 className="font-bold text-[#333]">Lampiran Resmi PKS Payung Mini Airport (master_taxes):</h4>
            <p className="text-slate-600 mt-1">
              Komponen retribusi di bawah ini merupakan lampiran sah <strong>Pasal 2 Dokumen PKS Payung Mini Airport</strong> dan menjadi acuan penerbitan SKRD pasca-realisasi fisik pendaratan di seluruh lapangan terbang perintis Provinsi Papua Tengah.
            </p>
          </div>

          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
            <div className="p-3 border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="text-sm font-bold text-[#333]">
                Daftar Komponen Retribusi Daerah Mini Airport ({filteredTaxes.length})
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari kode, nama tax, kategori..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-[#d2d6de] text-xs focus:outline-none focus:border-[#3c8dbc] rounded-xs w-64"
                />
                <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-2" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#f4f4f4] text-slate-700 bg-slate-50">
                    <th className="py-2.5 px-4 font-bold">Kode Tax</th>
                    <th className="py-2.5 px-4 font-bold">Komponen Retribusi</th>
                    <th className="py-2.5 px-4 font-bold text-center">Kategori</th>
                    <th className="py-2.5 px-4 font-bold">Tipe Armada Terkait</th>
                    <th className="py-2.5 px-4 font-bold text-right">Besaran Tarif</th>
                    <th className="py-2.5 px-4 font-bold text-center">Satuan</th>
                    <th className="py-2.5 px-4 font-bold">Dasar Hukum</th>
                    <th className="py-2.5 px-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin text-[#3c8dbc] mx-auto mb-2" />
                        <p>Memuat data retribusi daerah...</p>
                      </td>
                    </tr>
                  ) : filteredTaxes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        Tidak ada data komponen tax retribusi ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredTaxes.map((tx) => (
                      <tr key={tx.id} className="border-b border-[#f4f4f4] hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-[#3c8dbc] font-bold font-mono">{tx.kode_tax}</td>
                        <td className="py-2.5 px-4 font-bold text-[#333]">
                          {tx.nama_tax}
                          {tx.deskripsi && (
                            <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                              {tx.deskripsi}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            tx.kategori === 'Pendaratan' ? 'bg-[#3c8dbc] text-white' :
                            tx.kategori === 'Penumpang' ? 'bg-[#f39c12] text-white' :
                            tx.kategori === 'Parkir' ? 'bg-[#00c0ef] text-white' :
                            tx.kategori === 'Nginap' ? 'bg-[#dd4b39] text-white' :
                            'bg-slate-600 text-white'
                          }`}>
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">
                          {tx.aircraft_types?.jenis_pesawat ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                              ✈ {tx.aircraft_types.jenis_pesawat}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Semua Armada</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatRupiah(Number(tx.tarif))}
                        </td>
                        <td className="py-2.5 px-4 text-center text-slate-600">
                          {tx.satuan}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px] max-w-[200px] truncate" title={tx.dasar_hukum || '-'}>
                          {tx.dasar_hukum || '-'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge status={tx.status === 'Active' ? 'Aktif' : 'Inaktif'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
