"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { RentalApplication } from '@/types/rental';
import { FileText, Plus, Clock, Search, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

export default function PermohonanTenantPage() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getTenantApplications();
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
      case 'Approved': return 'bg-[#00a65a] text-white';
      case 'Rejected': return 'bg-[#dd4b39] text-white';
      case 'Reviewed': return 'bg-[#3c8dbc] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Permohonan Sewa <small className="text-[15px] text-[#777] ml-2 font-light">Riwayat pengajuan</small>
        </h1>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Daftar Permohonan Anda
          </h3>
          <Link href="/tenant/permohonan/buat" className="bg-[#3c8dbc] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#367fa9] transition-colors flex items-center rounded-sm">
            <Plus className="w-4 h-4 mr-1" /> Ajukan Sewa Baru
          </Link>
        </div>

        <div className="p-4 bg-slate-50 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-500 py-20">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-500" /> 
              <span className="font-medium text-lg">Memuat data permohonan...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Belum Ada Permohonan</h3>
              <p className="text-sm mt-1">Anda belum mengajukan permohonan sewa aset.</p>
              <Link href="/tenant/permohonan/buat" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Buat Permohonan Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Tiket</div>
                      <div className="font-bold text-lg text-blue-700 group-hover:text-blue-800 transition-colors">{app.application_number}</div>
                    </div>
                    <span className={`${getStatusColor(app.status)} text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm inline-flex items-center`}>
                      {app.status === 'Pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aset yang Diminati</div>
                      {app.assets ? (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 leading-tight">{app.assets.nama_aset}</div>
                            <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{app.assets.kode_aset} • {app.assets.jenis_aset}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 border-dashed text-slate-400 italic text-sm">
                          Belum dialokasikan / Aset tidak valid
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mulai</div>
                        <div className="font-semibold text-slate-700">{app.start_date ? dayjs(app.start_date).format('DD MMM YYYY') : '-'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Selesai</div>
                        <div className="font-semibold text-slate-700">{app.end_date ? dayjs(app.end_date).format('DD MMM YYYY') : '-'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 border-t border-slate-100 text-[12px] text-slate-500 flex justify-between items-center">
                    <span>Diajukan pada {dayjs(app.created_at).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
