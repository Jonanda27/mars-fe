"use client";

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Receipt, Search, Filter, 
  Clock, CheckCircle2, X, Loader2, Plane
} from 'lucide-react';
import api from '@/services/api';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

export default function AdminTagihanOverstayPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchOverstayLogs();
  }, []);

  const fetchOverstayLogs = async () => {
    try {
      const res = await api.get('/logs/overstay');
      setLogs(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerbitkanSKRD = async (logId: number) => {
    if (!confirm('Anda yakin ingin menerbitkan SKRD Tambahan (Penalti) untuk keterlambatan ini?')) return;
    
    try {
      setIsProcessing(logId);
      await api.post(`/invoices/generate-skrd-overstay/${logId}`);
      alert('SKRD Tambahan berhasil diterbitkan! Silakan cek di menu Manajemen Tagihan.');
      fetchOverstayLogs();
    } catch (error: any) {
      console.error(error);
      alert('Gagal menerbitkan SKRD: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase">
            Laporan Overstay Pesawat
          </h1>
          <p className="text-[12px] text-[#777]">Monitoring Keterlambatan Keluar Hanggar & SKRD Tambahan</p>
        </div>
      </header>

      <div className="bg-white shadow-sm flex-1 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-orange-50">
          <h3 className="text-[16px] text-orange-800 font-bold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" /> Daftar Pesawat Overstay (Belum Ditagih)
          </h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
             <div className="p-8 text-center text-gray-500 flex justify-center items-center"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Memuat data...</div>
          ) : (
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                <th className="py-4 px-5 font-bold">Tenant / Pesawat</th>
                <th className="py-4 px-5 font-bold">No. Kontrak Asal</th>
                <th className="py-4 px-5 font-bold">Jadwal Keluar</th>
                <th className="py-4 px-5 font-bold">Keluar Aktual</th>
                <th className="py-4 px-5 font-bold text-center">Overstay</th>
                <th className="py-4 px-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#f4f4f4] hover:bg-slate-50">
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333] text-[15px]">{log.tenants?.nama_perusahaan || '-'}</div>
                    <div className="text-[12px] text-blue-600 font-bold flex items-center mt-1">
                      <Plane className="w-3 h-3 mr-1" /> {log.registration_number}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333]">{log.contracts?.contract_number || '-'}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[#333]">{log.contracts?.end_date ? dayjs(log.contracts.end_date).format('DD MMM YYYY') : '-'}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-bold text-red-600">{log.exit_time ? dayjs(log.exit_time).format('DD MMM YYYY HH:mm') : '-'}</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center bg-red-100 text-red-700 border border-red-200 text-[12px] px-2.5 py-1 font-bold rounded-full">
                      {log.overstay_days} Hari
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                     <button 
                       onClick={() => handleTerbitkanSKRD(log.id)}
                       disabled={isProcessing === log.id}
                       className="bg-[#00a65a] border border-[#008d4c] text-white hover:bg-[#008d4c] px-3 py-1.5 text-[12px] font-bold inline-flex items-center justify-center shadow-sm rounded disabled:opacity-70"
                     >
                       {isProcessing === log.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Receipt className="w-4 h-4 mr-1" />}
                       Terbitkan SKRD
                     </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center text-gray-500">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                      <p className="font-bold text-lg">Bagus!</p>
                      <p>Tidak ada catatan pesawat yang overstay dan belum ditagihkan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}
