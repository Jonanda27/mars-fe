"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { RentalApplication } from '@/types/rental';
import { Eye, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

export default function EksekutifPermohonanPage() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getAllApplications();
      // Filter hanya yang relevan untuk dilihat Kadis atau yang butuh persetujuan
      // Kadis terutama perlu melihat "Menunggu Verifikasi Kadis" dan "Draft Kontrak"
      const filtered = data.filter(app => 
        ['Menunggu Verifikasi Kadis', 'Surat Disetujui', 'Draft Kontrak', 'Aktif', 'Ditolak'].includes(app.status)
      );
      setApplications(filtered);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Persetujuan Permohonan <small className="text-[15px] font-light text-[#777] ml-2">Daftar surat masuk</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Eksekutif Portal</span> / <span className="ml-1 font-medium">Persetujuan Permohonan</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Antrean Persetujuan Kepala Dinas</h3>
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
                  <th className="py-3 px-4 font-bold">TUJUAN / PERIHAL</th>
                  <th className="py-3 px-4 font-bold text-center">STATUS</th>
                  <th className="py-3 px-4 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#777]">
                      Belum ada permohonan sewa yang membutuhkan persetujuan.
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
                        <div className="font-medium text-[#333] max-w-md truncate" title={app.purpose || ''}>
                          {app.purpose || '-'}
                        </div>
                        {app.assets && (
                          <div className="text-[11px] text-[#777] mt-1">Aset: {app.assets.nama_aset}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link 
                          href={`/eksekutif/permohonan/${app.id}`}
                          className="inline-flex items-center justify-center bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1.5 rounded-none text-xs font-bold transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Ulas / Tindak Lanjuti
                        </Link>
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
