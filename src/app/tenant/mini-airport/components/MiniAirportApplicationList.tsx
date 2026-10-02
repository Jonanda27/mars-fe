"use client";

import React, { useState, useMemo } from 'react';
import { 
  FileText, Plus, Search, Filter, Clock, CheckCircle2, 
  MapPin, Plane, ArrowRight, ShieldCheck, AlertCircle, Calendar, X,
  ChevronDown
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { RentalApplication } from '@/types/rental';
import StatusBadge from '@/components/StatusBadge';

dayjs.locale('id');

interface MiniAirportApplicationListProps {
  applications: RentalApplication[];
  isLoading: boolean;
  onSelectApp: (app: RentalApplication) => void;
  onCreateNew: () => void;
  selectedAirportId?: number | null;
  selectedAirportName?: string | null;
  onClearAirportFilter?: () => void;
}

export const MiniAirportApplicationList: React.FC<MiniAirportApplicationListProps> = ({
  applications,
  isLoading,
  onSelectApp,
  onCreateNew,
  selectedAirportId = null,
  selectedAirportName = null,
  onClearAirportFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter khusus Mini Airport
  const miniAirportApps = useMemo(() => {
    return applications.filter(app => {
      const type = (app.application_type || '').toLowerCase();
      let spec: any = app.specific_needs;
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) {}
      }
      const isMiniAirportType = type.includes('mini') || type.includes('airport') || type.includes('perintis');
      const isMiniAirportService = spec?.service_type === 'Mini Airport' || Boolean(spec?.airport_id);
      return isMiniAirportType || isMiniAirportService;
    });
  }, [applications]);

  // Hasil Filter & Pencarian
  const filteredApps = useMemo(() => {
    return miniAirportApps.filter(app => {
      const q = searchQuery.toLowerCase().trim();
      let spec: any = app.specific_needs;
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) {}
      }

      // Filter berdasarkan Mini Airport yang dipilih di panel cakupan
      if (selectedAirportId) {
        const specAirportId = Number(spec?.airport_id || spec?.mini_airport_id);
        const specAirportName = (spec?.airport_name || '').toLowerCase();
        const matchesId = specAirportId === Number(selectedAirportId);
        const matchesName = selectedAirportName && specAirportName.includes(selectedAirportName.toLowerCase());
        if (!matchesId && !matchesName) return false;
      }

      const matchQuery = 
        !q ||
        app.application_number?.toLowerCase().includes(q) ||
        app.purpose?.toLowerCase().includes(q) ||
        spec?.airport_name?.toLowerCase().includes(q) ||
        spec?.registration_number?.toLowerCase().includes(q);

      if (!matchQuery) return false;

      if (statusFilter === 'ALL') return true;
      const s = (app.status || '').toLowerCase();
      if (statusFilter === 'WAITING_KADIS') {
        return ['pengajuan baru', 'menunggu verifikasi kadis', 'pending', 'menunggu ttd kontrak payung', 'menunggu ttd tenant', 'menunggu pengesahan kadis'].includes(s);
      }
      if (statusFilter === 'SURAT_APPROVED') {
        return s === 'surat disetujui';
      }
      if (statusFilter === 'WAITING_ADMIN') {
        return ['menunggu validasi admin', 'validasi aset'].includes(s);
      }
      if (statusFilter === 'ACTIVE') {
        return ['aktif', 'active', 'signed', 'disetujui'].includes(s);
      }
      if (statusFilter === 'LANDED') {
        return ['telah mendarat', 'mendarat', 'direalisasikan', 'realisasi'].includes(s);
      }
      return true;
    });
  }, [miniAirportApps, searchQuery, statusFilter, selectedAirportId, selectedAirportName]);

  return (
    <div className="space-y-4">
      {/* ACTION & FILTER BAR */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-3.5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari nomor tiket, bandara, atau armada..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs border border-[#d2d6de] rounded-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] outline-none bg-white text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative shrink-0">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 pl-8 pr-8 text-xs border border-[#d2d6de] rounded-xs bg-white text-slate-700 outline-none focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="WAITING_KADIS">Menunggu Kadis</option>
              <option value="SURAT_APPROVED">Surat Disetujui</option>
              <option value="WAITING_ADMIN">Menunggu Validasi</option>
              <option value="ACTIVE">Izin Aktif</option>
              <option value="LANDED">Telah Mendarat</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Primary CTA Button: Buat Permohonan Baru */}
        <button
          type="button"
          onClick={onCreateNew}
          className="h-9 inline-flex items-center justify-center gap-2 px-4 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Permohonan Mini Airport Baru</span>
        </button>
      </div>

      {/* 3. DAFTAR PERMOHONAN */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-xs border border-[#d2d6de]">
          <div className="inline-block w-8 h-8 border-4 border-[#3c8dbc] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Memuat data permohonan Mini Airport...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xs border border-dashed border-[#d2d6de] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Permohonan Mini Airport</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Anda belum memiliki permohonan operasional ke lapangan terbang perintis. Mulai alur permohonan resmi dengan mengunggah Surat Permohonan.
            </p>
          </div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Mulai Permohonan Mini Airport
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            let spec: any = app.specific_needs;
            if (typeof spec === 'string') {
              try { spec = JSON.parse(spec); } catch (e) {}
            }

            return (
              <div
                key={app.id}
                className="bg-white border border-[#d2d6de] hover:border-[#3c8dbc] rounded-xs shadow-xs hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header Card */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Tiket Permohonan
                    </span>
                    <span className="font-mono font-bold text-sm text-[#3c8dbc] group-hover:text-[#367fa9] transition-colors">
                      {app.application_number}
                    </span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Body Card */}
                <div className="p-4 space-y-3 flex-1 text-xs">
                  {/* Target Mini Airport */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Layanan Lapangan Terbang Perintis
                    </span>
                    {spec?.airport_name ? (
                      <div className="bg-blue-50/60 p-2.5 rounded-xs border border-blue-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#3c8dbc] flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{spec.airport_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {spec.airport_code || '-'} • {spec.airport_location || 'Papua Tengah'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-2.5 rounded-xs border border-dashed border-slate-200 text-slate-400 text-[11px] italic">
                        Menunggu pemilihan layanan di Tahap 3
                      </div>
                    )}
                  </div>

                  {/* Armada & Manifes */}
                  {spec?.registration_number && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xs border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Armada:</span>
                        <span className="font-mono font-bold text-[#3c8dbc] flex items-center gap-1">
                          <Plane className="w-3 h-3" />
                          {spec.registration_number}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Penumpang:</span>
                        <span className="font-bold text-emerald-700">
                          {spec.passengers_count || 0} Pax
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tanggal Pengajuan */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {dayjs(app.created_at).format('DD MMM YYYY')}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {spec?.allocated_stand || 'Alokasi Apron'}
                    </span>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectApp(app)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold text-[#3c8dbc] hover:text-white bg-white hover:bg-[#3c8dbc] border border-[#3c8dbc] rounded-xs transition-colors cursor-pointer"
                  >
                    Buka Alur Permohonan
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
