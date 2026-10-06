"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { RentalApplication } from '@/types/rental';
import { Eye, Loader2, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';
import { useAuthStore } from '@/store/useAuthStore';
import { ReviewExtensionModal } from './components/ReviewExtensionModal';

export default function PermohonanAdminPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = (user?.role || '').toLowerCase();
  const isMiniAdmin = userRole === 'admin_mini_airport' || Boolean(user?.mini_airport_id);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXTENSIONS'>('ALL');
  const [airportCategory, setAirportCategory] = useState<'ALL' | 'MOZES' | 'MINI'>(
    isMiniAdmin ? 'MINI' : (user?.airport_id || userRole === 'admin' ? 'MOZES' : 'ALL')
  );

  // Modal Review Perpanjangan
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppForReview, setSelectedAppForReview] = useState<RentalApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hitung jumlah per kategori (Mozes Kilangin vs Mini Airport)
  const { mozesCount, miniCount } = useMemo(() => {
    let m = 0;
    let mini = 0;
    applications.forEach((app) => {
      const type = (app.application_type || '').toLowerCase();
      let spec: any = app.specific_needs;
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) {}
      }
      const isMini = type.includes('mini') || type.includes('perintis') || spec?.service_type === 'Mini Airport' || Boolean(spec?.airport_id && spec?.airport_code);
      if (isMini) mini++;
      else m++;
    });
    return { mozesCount: m, miniCount: mini };
  }, [applications]);

  // Permohonan dengan perpanjangan berstatus Pending
  const pendingExtensions = useMemo(() => {
    return applications.filter((app) => {
      const spec = typeof app.specific_needs === 'string'
        ? JSON.parse(app.specific_needs)
        : (app.specific_needs || {});
      return spec.extension_request && spec.extension_request.status === 'Pending';
    });
  }, [applications]);

  const displayedApplications = useMemo(() => {
    let list = applications;
    if (activeTab === 'EXTENSIONS') {
      list = pendingExtensions;
    }

    if (airportCategory === 'MOZES') {
      return list.filter((app) => {
        const type = (app.application_type || '').toLowerCase();
        let spec: any = app.specific_needs;
        if (typeof spec === 'string') {
          try { spec = JSON.parse(spec); } catch (e) {}
        }
        const isMini = type.includes('mini') || type.includes('perintis') || spec?.service_type === 'Mini Airport' || Boolean(spec?.airport_id && spec?.airport_code);
        return !isMini;
      });
    }

    if (airportCategory === 'MINI') {
      return list.filter((app) => {
        const type = (app.application_type || '').toLowerCase();
        let spec: any = app.specific_needs;
        if (typeof spec === 'string') {
          try { spec = JSON.parse(spec); } catch (e) {}
        }
        const isMini = type.includes('mini') || type.includes('perintis') || spec?.service_type === 'Mini Airport' || Boolean(spec?.airport_id && spec?.airport_code);
        return isMini;
      });
    }

    return list;
  }, [activeTab, airportCategory, applications, pendingExtensions]);

  const handleOpenReview = (app: RentalApplication) => {
    setSelectedAppForReview(app);
    setReviewModalOpen(true);
  };

  const isMiniAirportAdmin = user?.role === 'admin_mini_airport' || Boolean(user?.mini_airport_id);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Permohonan Masuk{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">
              {isMiniAirportAdmin ? (user?.airport_name || 'Mini Airport') : 'Bandara Mozes Kilangin'}
            </span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">{isMiniAirportAdmin ? 'Admin Mini Airport' : 'Admin'}</span> / <span className="ml-1 font-medium">Permohonan</span>
        </div>
      </header>

      {/* BANNER NOTIFIKASI JIKA ADA PERPANJANGAN PENDING */}
      {pendingExtensions.length > 0 && activeTab !== 'EXTENSIONS' && (
        <div className="mb-4 bg-amber-50 border-l-4 border-l-[#f39c12] p-3 shadow-xs flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f39c12]" />
            <span>
              Terdapat <strong>{pendingExtensions.length} pengajuan perpanjangan masa sewa</strong> yang menunggu verifikasi ketersediaan hanggar dan penempatan aset!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('EXTENSIONS')}
            className="px-3 py-1 bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold rounded-none cursor-pointer text-xs transition-colors"
          >
            Lihat Pengajuan Perpanjangan
          </button>
        </div>
      )}

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        {/* TABS HEADER */}
        <div className="border-b border-[#f4f4f4] flex flex-col sm:flex-row justify-between sm:items-center px-4 pt-2 gap-2">
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`py-2 px-3 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ALL'
                  ? 'border-[#3c8dbc] text-[#3c8dbc]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isMiniAdmin ? `Izin Pendaratan Masuk (${applications.length})` : `Semua Permohonan (${applications.length})`}
            </button>
            {!isMiniAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('EXTENSIONS')}
                className={`py-2 px-3 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'EXTENSIONS'
                    ? 'border-[#f39c12] text-[#f39c12]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Pengajuan Perpanjangan Sewa</span>
                {pendingExtensions.length > 0 && (
                  <span className="bg-[#f39c12] text-white text-[10px] px-1.5 py-0.2 font-bold rounded animate-pulse">
                    {pendingExtensions.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Filter Wilayah Bandara (Khusus akun dengan pengawasan global: Superadmin / Kadis / Dinas) */}
          {!user?.mini_airport_id && !user?.airport_id && (
            <div className="flex items-center gap-1 pb-2 sm:pb-0 text-xs">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Filter Wilayah:</span>
              <button
                type="button"
                onClick={() => setAirportCategory('ALL')}
                className={`px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  airportCategory === 'ALL'
                    ? 'bg-[#3c8dbc] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setAirportCategory('MOZES')}
                className={`px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  airportCategory === 'MOZES'
                    ? 'bg-[#3c8dbc] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mozes Kilangin ({mozesCount})
              </button>
              <button
                type="button"
                onClick={() => setAirportCategory('MINI')}
                className={`px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  airportCategory === 'MINI'
                    ? 'bg-[#3c8dbc] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mini Airport ({miniCount})
              </button>
            </div>
          )}
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data permohonan...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">NOMOR TIKET</th>
                  <th className="py-3 px-4 font-bold">{isMiniAdmin ? 'MASKAPAI / OPERATOR' : 'TENANT'}</th>
                  <th className="py-3 px-4 font-bold">{isMiniAdmin ? 'DESTINASI & ARMADA' : 'ASET & PENEMPATAN'}</th>
                  <th className="py-3 px-4 font-bold">{isMiniAdmin ? 'JADWAL OPERASIONAL' : 'RENCANA PERIODE'}</th>
                  <th className="py-3 px-4 font-bold text-center">{isMiniAdmin ? 'STATUS IZIN' : 'STATUS'}</th>
                  <th className="py-3 px-4 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {displayedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777]">
                      {activeTab === 'EXTENSIONS'
                        ? 'Tidak ada pengajuan perpanjangan sewa yang pending saat ini.'
                        : (isMiniAdmin ? 'Belum ada permohonan izin pendaratan masuk untuk wilayah ini.' : 'Belum ada permohonan sewa masuk.')}
                    </td>
                  </tr>
                ) : (
                  displayedApplications.map((app) => {
                    const spec = typeof app.specific_needs === 'string'
                      ? JSON.parse(app.specific_needs)
                      : (app.specific_needs || {});
                    const extReq = spec.extension_request;
                    const hasPendingExt = extReq && extReq.status === 'Pending';
                    const hasApprovedExt = extReq && extReq.status === 'Approved';

                    return (
                      <tr 
                        key={app.id} 
                        className={`border-b border-[#f4f4f4] transition-colors ${
                          hasPendingExt ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-[#f9f9f9]'
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-[#3c8dbc]">
                          {app.application_number}
                          <div className="text-[11px] text-[#777] font-normal mt-0.5">
                            {dayjs(app.created_at).format('DD MMM YYYY HH:mm')}
                          </div>
                          {hasPendingExt && (
                            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f39c12] text-white">
                              <Clock className="w-3 h-3" /> Perpanjangan +{extReq.additional_days} Hari
                            </span>
                          )}
                          {hasApprovedExt && (
                            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00a65a] text-white">
                              <CheckCircle2 className="w-3 h-3 text-white" /> Diperpanjang s/d {dayjs(extReq.requested_end_date).format('DD MMM')}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-[#333]">{app.tenants?.nama_perusahaan || 'N/A'}</div>
                          <div className="text-[11px] text-[#777]">PIC: {app.tenants?.pic || '-'}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-[10px] font-bold text-[#3c8dbc] mb-0.5 uppercase tracking-wider">
                            {app.application_type || 'Sewa Baru'}
                          </div>
                          {app.assets ? (
                            <>
                              <div className="font-medium text-[#333]">{app.assets.nama_aset}</div>
                              <div className="text-[11px] text-[#777]">{app.assets.kode_aset} ({app.assets.jenis_aset})</div>
                            </>
                          ) : spec?.airport_name ? (
                            <>
                              <div className="font-bold text-slate-800 text-[12px]">{spec.airport_name}</div>
                              <div className="text-[11px] text-slate-500">
                                <span className="font-mono text-[#3c8dbc] font-bold">{spec.airport_code}</span> • Armada: <span className="font-mono font-bold text-slate-700">{spec.registration_number || '-'}</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-[#777] italic">Belum dialokasikan</span>
                          )}
                          {spec.relocations && spec.relocations.length > 0 && (
                            <div className="mt-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 border border-blue-200 inline-block font-medium">
                              🔄 Relokasi dari: {spec.relocations[spec.relocations.length - 1].previous_asset_name}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-[#555]">
                          <div>
                            {app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-'}
                          </div>
                          <span className="text-[11px] text-[#777]">s/d</span>
                          <div>
                            {app.end_date ? dayjs(app.end_date).format('DD MMM YYYY') : '-'}
                          </div>
                          {hasPendingExt && (
                            <div className="mt-1 text-[11px] font-bold text-[#f39c12] flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> {dayjs(extReq.requested_end_date).format('DD MMM YYYY')}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={app.status} />
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            {hasPendingExt ? (
                              <button
                                type="button"
                                onClick={() => handleOpenReview(app)}
                                className="px-2.5 py-1.5 bg-[#f39c12] hover:bg-[#e08e0b] text-white text-xs font-bold rounded-none shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                                title="Review Ketersediaan & Alokasi Penempatan"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                Review Perpanjangan
                              </button>
                            ) : null}

                            <Link 
                              href={`/admin/permohonan/review/${app.id}`} 
                              className="bg-[#3c8dbc] text-white p-1.5 hover:bg-[#367fa9] shadow-sm rounded-none" 
                              title="Tinjau Detail Permohonan"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL VERIFIKASI PERPANJANGAN OLEH ADMIN UPBU */}
      <ReviewExtensionModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedAppForReview(null);
        }}
        application={selectedAppForReview}
        onSuccess={fetchApplications}
      />
    </div>
  );
}

