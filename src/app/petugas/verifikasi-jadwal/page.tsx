"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, Filter, RefreshCw, 
  CheckCircle2, XCircle, Clock, Calendar, 
  Plane, Building2, MapPin, Loader2, Eye,
  AlertCircle, FileText, MessageSquare
} from 'lucide-react';
import { flightScheduleService } from '@/services/flightScheduleService';
import { FlightSchedule } from '@/types/flightSchedule';
import { JadwalVerifikasiModal } from '../components/JadwalVerifikasiModal';
import { KirimWhatsAppModal } from '../components/KirimWhatsAppModal';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function PetugasVerifikasiJadwalPage() {
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal state
  const [selectedSchedule, setSelectedSchedule] = useState<FlightSchedule | null>(null);
  const [selectedScheduleForWhatsApp, setSelectedScheduleForWhatsApp] = useState<FlightSchedule | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await flightScheduleService.getAllSchedules();
      setSchedules(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat daftar jadwal penerbangan');
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = schedules.filter(s => s.status === 'Menunggu Verifikasi Petugas').length;
  const approvedCount = schedules.filter(s => s.status === 'Disetujui').length;
  const rejectedCount = schedules.filter(s => s.status === 'Ditolak').length;
  const checkedInCount = schedules.filter(s => s.status === 'Checked-In').length;

  const filteredSchedules = schedules.filter(s => {
    // Pastikan hanya jadwal Bandara Mozes Kilangin (Hanggar / Apron) dan bukan Mini Airport
    const loc = (s.parking_location || '').toLowerCase();
    const purpose = (s.purpose || '').toLowerCase();
    if (
      loc.includes('stand') || 
      loc.includes('mini') || 
      loc.includes('airstrip') || 
      purpose.includes('mini airport') ||
      purpose.includes('perintis')
    ) {
      return false;
    }

    // Status Filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Checked-Out') {
        if (s.status !== 'Checked-Out' && s.status !== 'Selesai' && s.status !== 'Completed') {
          return false;
        }
      } else if (s.status !== statusFilter) {
        return false;
      }
    }
    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchReg = (s.registration_number || '').toLowerCase().includes(query);
      const matchTenant = (s.tenant?.nama_perusahaan || '').toLowerCase().includes(query);
      const matchNumber = (s.schedule_number || '').toLowerCase().includes(query);
      const matchPurpose = (s.purpose || '').toLowerCase().includes(query);
      if (!matchReg && !matchTenant && !matchNumber && !matchPurpose) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3c8dbc]" />
            Verifikasi Jadwal Masuk (Bandara Mozes Kilangin)
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Persetujuan Rencana Kedatangan Armada Hanggar &amp; Apron Bandara Mozes Kilangin Timika
          </p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-white border border-[#e0e0e0] py-1 px-3 shadow-2xs">
          <span className="mr-1">Petugas Mozes Kilangin</span> / <span className="ml-1 font-bold text-slate-800">Verifikasi Jadwal Masuk</span>
        </div>
      </header>

      {/* Small Box Summary Stats - Konsisten Warna Biru */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-3 bg-white border cursor-pointer transition-all ${
            statusFilter === 'ALL' 
              ? 'border-l-4 border-l-[#3c8dbc] shadow-xs ring-1 ring-blue-200' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Pengajuan</span>
          <span className="text-xl font-black text-slate-800 block mt-0.5">{schedules.length}</span>
          <span className="text-[10px] text-slate-400">Semua Jadwal</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Menunggu Verifikasi Petugas')}
          className={`p-3 bg-white border cursor-pointer transition-all ${
            statusFilter === 'Menunggu Verifikasi Petugas' 
              ? 'border-l-4 border-l-amber-500 ring-1 ring-amber-400 shadow-xs' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Menunggu Verifikasi</span>
          <span className="text-xl font-black text-amber-600 block mt-0.5">{pendingCount}</span>
          <span className="text-[10px] text-amber-600 font-semibold">Perlu Tinjauan Petugas</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Disetujui')}
          className={`p-3 bg-white border cursor-pointer transition-all ${
            statusFilter === 'Disetujui' 
              ? 'border-l-4 border-l-[#3c8dbc] ring-1 ring-blue-200 shadow-xs' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-[#3c8dbc] uppercase tracking-wider block">Disetujui</span>
          <span className="text-xl font-black text-[#3c8dbc] block mt-0.5">{approvedCount}</span>
          <span className="text-[10px] text-[#3c8dbc]">Siap Mendarat</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Checked-In')}
          className={`p-3 bg-white border cursor-pointer transition-all ${
            statusFilter === 'Checked-In' 
              ? 'border-l-4 border-l-[#3c8dbc] ring-1 ring-blue-200 shadow-xs' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-[#3c8dbc] uppercase tracking-wider block">Checked-In</span>
          <span className="text-xl font-black text-[#3c8dbc] block mt-0.5">{checkedInCount}</span>
          <span className="text-[10px] text-[#3c8dbc]">Fisik Sudah Masuk</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        {/* Card Header & Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3c8dbc]" />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Daftar Pengajuan Jadwal Pemakaian Hanggar</h2>
              <p className="text-[11px] text-slate-500">Tinjau dan setujui izin masuk pesawat tenant sebelum fisik tiba di bandara.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Cari Reg / Tenant / No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 text-xs px-2.5 py-1.5 bg-white text-slate-700 font-medium focus:border-[#3c8dbc] outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Menunggu Verifikasi Petugas">Menunggu Verifikasi</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchSchedules}
              title="Segarkan Data"
              className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">No. Pengajuan</th>
                <th className="px-4 py-3">Tenant / Maskapai</th>
                <th className="px-4 py-3">Armada Pesawat</th>
                <th className="px-4 py-3">Rencana Masuk</th>
                <th className="px-4 py-3">Lokasi Alokasi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    <span>Memuat daftar permohonan jadwal masuk...</span>
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>Tidak ada data jadwal penerbangan yang sesuai dengan filter.</span>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule, idx) => (
                  <tr key={schedule.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3.5 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {schedule.schedule_number}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">
                        {schedule.tenant?.nama_perusahaan || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ID: {schedule.tenant?.tenant_id_str || (schedule.tenant_id ? `T-${new Date(schedule.created_at || Date.now()).getFullYear()}-${String(schedule.tenant_id).padStart(4, '0')}` : '-')}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-black text-slate-800 font-mono text-[13px] flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                        {schedule.registration_number}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {schedule.aircraft_type || 'Pesawat Standar'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {dayjs(schedule.estimated_arrival).format('DD MMM YYYY')}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {dayjs(schedule.estimated_arrival).format('HH:mm')} WIT
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {schedule.parking_location || 'Hanggar'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={schedule.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {schedule.status === 'Menunggu Verifikasi Petugas' ? (
                        <button
                          onClick={() => setSelectedSchedule(schedule)}
                          className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer w-full transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verifikasi
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedSchedule(schedule)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1 border border-slate-300 cursor-pointer transition-colors"
                            title="Lihat Detail Verifikasi"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detail
                          </button>
                          {['Disetujui', 'Checked-In', 'Checked-Out', 'Selesai', 'Completed'].includes(schedule.status) && (
                            <button
                              onClick={() => setSelectedScheduleForWhatsApp(schedule)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-colors"
                              title="Kirim Tiket & Konfirmasi ke WhatsApp Tenant"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Menampilkan {filteredSchedules.length} dari {schedules.length} total pengajuan</span>
          <span>Sistem Informasi Hanggar Mozes Kilangin</span>
        </div>
      </div>

      {/* Modal Verifikasi */}
      {selectedSchedule && (
        <JadwalVerifikasiModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onSuccess={() => {
            fetchSchedules();
            setSelectedSchedule(null);
          }}
        />
      )}

      {/* Modal Kirim WhatsApp */}
      {selectedScheduleForWhatsApp && (
        <KirimWhatsAppModal
          schedule={selectedScheduleForWhatsApp}
          onClose={() => setSelectedScheduleForWhatsApp(null)}
        />
      )}
    </div>
  );
}
