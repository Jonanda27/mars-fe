"use client";

import React, { useState, useEffect } from 'react';
import { 
  History, Clock, FileText, Loader2, Search, 
  MapPin, Eye, Calendar, User, ShieldCheck, Plane,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { logService } from '@/services/logService';
import { overnightReportService, OvernightReport } from '@/services/overnightReportService';
import { TutupHariDetailModal } from '../components/TutupHariDetailModal';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function RiwayatPetugasPage() {
  const [activeTab, setActiveTab] = useState<'overnight' | 'checkout'>('overnight');

  // Overnight reports state
  const [overnightReports, setOvernightReports] = useState<OvernightReport[]>([]);
  const [isLoadingOvernight, setIsLoadingOvernight] = useState(true);
  const [selectedOvernight, setSelectedOvernight] = useState<OvernightReport | null>(null);

  // Check-Out logs state
  const [checkoutLogs, setCheckoutLogs] = useState<any[]>([]);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOvernightReports();
  }, []);

  useEffect(() => {
    if (activeTab === 'checkout' && checkoutLogs.length === 0) {
      fetchCheckoutLogs();
    }
  }, [activeTab]);

  const fetchOvernightReports = async () => {
    try {
      setIsLoadingOvernight(true);
      const data = await overnightReportService.getAllOvernightReports();
      setOvernightReports(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat riwayat laporan tutup hari');
    } finally {
      setIsLoadingOvernight(false);
    }
  };

  const fetchCheckoutLogs = async () => {
    try {
      setIsLoadingCheckout(true);
      const allLogs = await logService.getAllLogs();
      const finishedLogs = (allLogs || []).filter((log: any) => log.exit_time !== null);
      finishedLogs.sort((a: any, b: any) => new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime());
      setCheckoutLogs(finishedLogs);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat riwayat check-out pesawat');
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const filteredOvernight = overnightReports.filter(report => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchDate = dayjs(report.report_date).format('DD MMMM YYYY').toLowerCase().includes(s);
    const matchOfficer = (report.officer?.username || '').toLowerCase().includes(s);
    const matchNotes = (report.general_notes || '').toLowerCase().includes(s);
    const matchAircraft = (report.items || []).some(item => 
      (item.registration_number || '').toLowerCase().includes(s) ||
      (item.tenant?.nama_perusahaan || item.tenant_name || '').toLowerCase().includes(s)
    );
    return matchDate || matchOfficer || matchNotes || matchAircraft;
  });

  const filteredCheckout = checkoutLogs.filter(log => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const matchReg = (log.registration_number || '').toLowerCase().includes(s);
    const matchTenant = (log.tenants?.nama_perusahaan || '').toLowerCase().includes(s);
    const matchLocation = (log.parking_location || '').toLowerCase().includes(s);
    return matchReg || matchTenant || matchLocation;
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Riwayat Tutup Hari &amp; Operasional{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Arsip Laporan Inap Malam &amp; Keberangkatan Pesawat</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Petugas</span> / <span className="ml-1 font-medium text-slate-800">Riwayat</span>
        </div>
      </header>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 shadow-2xs">
        <button
          onClick={() => setActiveTab('overnight')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'overnight'
              ? 'border-[#3c8dbc] text-[#3c8dbc]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Laporan Tutup Hari ({overnightReports.length})
        </button>

        <button
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'checkout'
              ? 'border-[#3c8dbc] text-[#3c8dbc]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Plane className="w-4 h-4" />
          Riwayat Pesawat Keluar / Check-Out ({checkoutLogs.length})
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
        
        {/* Card Header with Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              {activeTab === 'overnight' ? 'Arsip Laporan Tutup Hari' : 'Daftar Log Keberangkatan (Check-Out Selesai)'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {activeTab === 'overnight' 
                ? 'Seluruh catatan rekonsiliasi pesawat menginap yang telah disahkan oleh petugas lapangan.' 
                : 'Pencatatan waktu keluar dan durasi parkir pesawat yang telah meninggalkan hanggar/apron.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder={activeTab === 'overnight' ? 'Cari Tanggal / Petugas / Armada...' : 'Cari Reg / Tenant / Lokasi...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <button
              onClick={() => activeTab === 'overnight' ? fetchOvernightReports() : fetchCheckoutLogs()}
              title="Segarkan Data"
              className="px-2.5 py-1.5 border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {activeTab === 'overnight' ? (
            // TAB 1: OVERNIGHT REPORTS TABLE
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">Tanggal Laporan</th>
                  <th className="px-4 py-3">Petugas Pelapor</th>
                  <th className="px-4 py-3 text-center">Total Armada Menginap</th>
                  <th className="px-4 py-3">Catatan Shift</th>
                  <th className="px-4 py-3">Waktu Submit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingOvernight ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                      <span>Memuat arsip laporan tutup hari...</span>
                    </td>
                  </tr>
                ) : filteredOvernight.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <span>Tidak ada data laporan tutup hari yang ditemukan.</span>
                    </td>
                  </tr>
                ) : (
                  filteredOvernight.map((report, idx) => (
                    <tr key={report.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
                          {dayjs(report.report_date).format('DD MMMM YYYY')}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Ref ID #{report.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {report.officer?.username || 'Petugas'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block bg-blue-50 text-[#3c8dbc] border border-blue-200 font-black px-2 py-0.5 text-xs">
                          {report.total_aircraft_staying} Armada
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {report.general_notes ? (
                          <span className="text-slate-600 italic bg-slate-50 px-2 py-0.5 border border-slate-100 line-clamp-1 max-w-[200px]" title={report.general_notes}>
                            {report.general_notes}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {dayjs(report.created_at).format('DD/MM/YYYY HH:mm')} WIT
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={report.status || 'VERIFIED'} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setSelectedOvernight(report)}
                          className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer w-full transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // TAB 2: CHECKOUT LOGS TABLE
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">Tail Number</th>
                  <th className="px-4 py-3">Tenant / Maskapai</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Waktu Masuk</th>
                  <th className="px-4 py-3">Waktu Keluar</th>
                  <th className="px-4 py-3">Catatan</th>
                  <th className="px-4 py-3">Status Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingCheckout ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                      <span>Memuat riwayat pesawat keluar...</span>
                    </td>
                  </tr>
                ) : filteredCheckout.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <span>Tidak ada riwayat pesawat keluar yang ditemukan.</span>
                    </td>
                  </tr>
                ) : (
                  filteredCheckout.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{index + 1}</td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-800 text-[13px]">
                        {log.registration_number}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {log.tenants?.nama_perusahaan || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {log.parking_location || 'Hanggar'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {dayjs(log.entry_time).format('DD MMM YYYY HH:mm')}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {dayjs(log.exit_time).format('DD MMM YYYY HH:mm')}
                      </td>
                      <td className="px-4 py-3.5">
                        {log.notes ? (
                          <span className="text-[11px] text-slate-600 italic bg-slate-50 px-2 py-0.5 border border-slate-100 line-clamp-1 max-w-[150px]" title={log.notes}>
                            {log.notes}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge 
                          status={log.billing_status === 'Unbilled' ? 'Unbilled' : 'Billed'} 
                          label={log.billing_status === 'Unbilled' ? 'Menunggu Tagihan' : 'Sudah Ditagih'} 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>
            Menampilkan {activeTab === 'overnight' ? filteredOvernight.length : filteredCheckout.length} data
          </span>
          <span>Sistem Informasi Hanggar Mozes Kilangin</span>
        </div>
      </div>

      {/* Overnight Report Detail Modal */}
      {selectedOvernight && (
        <TutupHariDetailModal
          report={selectedOvernight}
          onClose={() => setSelectedOvernight(null)}
        />
      )}
    </div>
  );
}
