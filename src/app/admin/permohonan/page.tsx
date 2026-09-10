"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { RentalApplication } from '@/types/rental';
import { FileText, Eye, Clock, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

export default function PermohonanAdminPage() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-[#f39c12] text-white';
      case 'Menunggu Persetujuan Kadis': return 'bg-purple-500 text-white';
      case 'Disetujui Kadis': return 'bg-[#00a65a] text-white';
      case 'Ditolak': return 'bg-[#dd4b39] text-white';
      case 'Draft Kontrak': return 'bg-blue-500 text-white';
      case 'Approved': return 'bg-[#00a65a] text-white';
      case 'Rejected': return 'bg-[#dd4b39] text-white';
      case 'Reviewed': return 'bg-[#3c8dbc] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Permohonan Sewa <small className="text-[15px] font-light text-[#777] ml-2">Daftar permohonan masuk</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Permohonan Sewa</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Semua Permohonan</h3>
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data permohonan...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">NOMOR TIKET</th>
                  <th className="py-3 px-4 font-bold">TENANT</th>
                  <th className="py-3 px-4 font-bold">ASET DIMINATI</th>
                  <th className="py-3 px-4 font-bold">RENCANA PERIODE</th>
                  <th className="py-3 px-4 font-bold text-center">STATUS</th>
                  <th className="py-3 px-4 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777]">
                      Belum ada permohonan sewa masuk.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-4 font-bold text-[#3c8dbc]">
                        {app.application_number}
                        <div className="text-[11px] text-[#777] font-normal mt-1">{dayjs(app.created_at).format('DD MMM YYYY HH:mm')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#333]">{app.tenants?.nama_perusahaan || 'N/A'}</div>
                        <div className="text-[12px] text-[#777]">PIC: {app.tenants?.pic || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px] font-bold text-[#3c8dbc] mb-1 uppercase tracking-wider">{app.application_type || 'Sewa Baru'}</div>
                        {app.assets ? (
                          <>
                            <div className="font-medium text-[#333]">{app.assets.nama_aset}</div>
                            <div className="text-[12px] text-[#777]">{app.assets.kode_aset}</div>
                          </>
                        ) : (
                          <span className="text-[#777] italic">Belum dialokasikan</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#555]">
                        {app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-'} <br/>
                        <span className="text-[12px] text-[#777]">s/d</span> <br/>
                        {app.end_date ? dayjs(app.end_date).format('DD MMM YYYY') : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`${getStatusColor(app.status)} text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm inline-flex items-center text-center leading-tight`}>
                          {(app.status === 'Pending' || app.status === 'Menunggu Persetujuan Kadis') && <Clock className="w-3 h-3 mr-1" />}
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          <Link href={`/admin/permohonan/review/${app.id}`} className="bg-[#3c8dbc] text-white p-1.5 hover:bg-[#367fa9] shadow-sm rounded-sm" title="Tinjau & Verifikasi">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
