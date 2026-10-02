"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Plane, Search, RefreshCw, Calendar, Clock, 
  Users, Building2, ArrowRight, Loader2, FileText, TowerControl,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { miniAirportLogService } from '@/services/miniAirportLogService';
import { useAuthStore } from '@/store/useAuthStore';

dayjs.locale('id');

export default function RencanaPendaratanMasukPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [standFilter, setStandFilter] = useState('ALL');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await miniAirportLogService.getEligibleApplications();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat rencana pendaratan masuk');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Parse specific_needs helper
  const parsedApps = useMemo(() => {
    return applications.map(app => {
      let spec = app.specific_needs || {};
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) { spec = {}; }
      }
      return {
        ...app,
        spec
      };
    });
  }, [applications]);

  const filteredApps = useMemo(() => {
    return parsedApps.filter(item => {
      const tenantName = (item.tenants?.nama_perusahaan || '').toLowerCase();
      const appNumber = (item.application_number || '').toLowerCase();
      const contractNumber = (item.contracts?.contract_number || '').toLowerCase();
      const regNumber = (item.spec?.registration_number || '').toLowerCase();
      const aircraftType = (item.spec?.aircraft_type || '').toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchSearch = tenantName.includes(query) || 
        appNumber.includes(query) || 
        contractNumber.includes(query) || 
        regNumber.includes(query) || 
        aircraftType.includes(query);

      const stand = (item.spec?.allocated_stand || 'STAND 01').toUpperCase();
      const matchStand = standFilter === 'ALL' || stand === standFilter;

      return matchSearch && matchStand;
    });
  }, [parsedApps, searchTerm, standFilter]);

  // KPI Calculations
  const totalApps = parsedApps.length;
  const stand1Count = parsedApps.filter(a => (a.spec?.allocated_stand || '').toUpperCase().includes('01')).length;
  const stand2Count = parsedApps.filter(a => (a.spec?.allocated_stand || '').toUpperCase().includes('02')).length;
  const uniqueTenants = new Set(parsedApps.map(a => a.tenants?.nama_perusahaan || a.tenant_id)).size;

  const displayAirport = useMemo(() => {
    if (!user?.airport_name) return 'Bandara Perintis Papua Tengah';
    if (user.airport_name.toLowerCase().startsWith('mini airport')) {
      return user.airport_name.replace(/^mini airport\s+/i, 'Bandara ');
    }
    return user.airport_name;
  }, [user?.airport_name]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* 1. Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">
              Rencana Kedatangan Pesawat
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#3c8dbc] border border-blue-200">
              <TowerControl className="w-3 h-3 text-[#3c8dbc]" />
              {displayAirport}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar permohonan pendaratan yang telah disetujui dinas dan dijadwalkan tiba di airstrip
          </p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Petugas Mini Airport</span> / <span className="ml-1 font-medium text-slate-800">Rencana Kedatangan</span>
        </div>
      </header>

      {/* 2. Stat Boxes (Small Box Style) - Konsisten Warna Biru Mozes Kilangin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Total Slot Berizin */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Slot Berizin</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{totalApps}</span>
              <span className="text-xs text-slate-500 font-medium">Armada</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Telah Disetujui Admin</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
        </div>

        {/* Box 2: Stand 01 */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Alokasi Stand 01</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{stand1Count}</span>
              <span className="text-xs text-slate-500 font-medium">Slot</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Kapasitas Apron Utama</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <TowerControl className="w-5 h-5" />
          </div>
        </div>

        {/* Box 3: Stand 02 */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Alokasi Stand 02</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{stand2Count}</span>
              <span className="text-xs text-slate-500 font-medium">Slot</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Kapasitas Apron Sekunder</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <TowerControl className="w-5 h-5" />
          </div>
        </div>

        {/* Box 4: Mitra Maskapai */}
        <div className="bg-white p-4 shadow-xs border border-slate-200 border-l-4 border-l-[#3c8dbc] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mitra Maskapai</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{uniqueTenants}</span>
              <span className="text-xs text-slate-500 font-medium">Maskapai</span>
            </div>
            <span className="text-[10px] text-[#3c8dbc] font-semibold block mt-0.5">Operator Terhubung</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Table Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        {/* Card Header & Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3c8dbc]" />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Daftar Slot Penerbangan Terverifikasi</h2>
              <p className="text-[11px] text-slate-500">Izin permohonan slot aktif yang siap dicatat kedatangannya saat armada mendarat.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stand Dropdown */}
            <select
              value={standFilter}
              onChange={(e) => setStandFilter(e.target.value)}
              className="border border-slate-300 text-xs px-2.5 py-1.5 bg-white text-slate-700 font-medium focus:border-[#3c8dbc] outline-none"
            >
              <option value="ALL">Semua Stand Pendaratan</option>
              <option value="STAND 01">Hanya Stand 01</option>
              <option value="STAND 02">Hanya Stand 02</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Cari maskapai, registrasi, no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              title="Segarkan Data"
              className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">No. Permohonan &amp; Kontrak</th>
                <th className="py-3 px-4">Maskapai / Tenant</th>
                <th className="py-3 px-4">Armada Pesawat</th>
                <th className="py-3 px-4">Rencana Mendarat</th>
                <th className="py-3 px-4">Alokasi Stand</th>
                <th className="py-3 px-4 text-center">Estimasi Pax</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    <span>Memuat rencana pendaratan masuk...</span>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>Tidak ada rencana pendaratan masuk yang sesuai dengan filter.</span>
                  </td>
                </tr>
              ) : (
                filteredApps.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3.5 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 font-mono">
                        {item.application_number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>PKS: {item.contracts?.contract_number || 'PKS Payung'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">
                        {item.tenants?.nama_perusahaan || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PIC: {item.tenants?.pic || '-'} • {item.tenants?.nomor_telepon || ''}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-black text-slate-800 font-mono text-[13px] flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                        {item.spec?.registration_number || 'PK-UNKNOWN'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.spec?.aircraft_type || 'Pesawat Perintis'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.spec?.landing_date ? dayjs(item.spec.landing_date).format('DD MMM YYYY') : '-'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.spec?.landing_time ? `${item.spec.landing_time} WIT` : 'Sesuai Roster'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 text-[11px] border border-slate-200 rounded">
                        <TowerControl className="w-3 h-3 text-slate-500" />
                        {item.spec?.allocated_stand || 'STAND 01'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                        <Users className="w-3 h-3 text-slate-500" />
                        {item.spec?.passengers_count || 1} Pax
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/petugas/mini-airport?appId=${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        <span>Realisasikan</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#f4f4f4] bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          <span>Menampilkan {filteredApps.length} rencana pendaratan masuk</span>
          <span className="text-[11px] text-gray-400">Jaringan Mini Airport Dinas Perhubungan Papua Tengah</span>
        </div>
      </div>
    </div>
  );
}
