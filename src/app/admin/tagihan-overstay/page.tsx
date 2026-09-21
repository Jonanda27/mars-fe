"use client";

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Search, Filter, 
  Clock, CheckCircle2, X, Loader2, Plane
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { logService } from '@/services/logService';
import { invoiceService } from '@/services/invoiceService';
import { OverstayLogItem } from '@/types/log';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function AdminTagihanOverstayPage() {
  const [logs, setLogs] = useState<OverstayLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchOverstayLogs();
  }, []);

  const fetchOverstayLogs = async () => {
    try {
      const data = await logService.getOverstayLogs();
      setLogs(data || []);
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
      await invoiceService.generateOverstaySkrd(logId);
      toast.success('SKRD Tambahan berhasil diterbitkan! Silakan cek di menu Manajemen Tagihan.');
      fetchOverstayLogs();
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal menerbitkan SKRD: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Tagihan Overstay <small className="text-[15px] font-light text-[#777] ml-2">Laporan Overstay Pesawat</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Tagihan Overstay</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Pesawat Overstay (Belum Ditagih)</h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
             <div className="p-10 flex justify-center items-center text-[#777]"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Memuat data...</div>
          ) : (
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
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
                       {isProcessing === log.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RupiahIcon className="w-4 h-4 mr-1" />}
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
