"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { warningService } from '@/services/warningService';
import { AlertTriangle, Home, Search, Loader2, Info, Plus, Mail, CheckCircle2, Clock } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function DinasPeringatanPage() {
  const { warnings, isLoading, error, fetchAllWarnings } = useWarningStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingId, setSendingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllWarnings();
  }, [fetchAllWarnings]);

  const handleSendEmail = async (warn: any) => {
    try {
      setSendingId(warn.id);
      const res = await warningService.sendWarningEmail(warn.id);
      toast.success(res.message || `Surat Peringatan ${warn.warning_number} berhasil dikirim ke email!`);
      fetchAllWarnings();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Gagal mengirim email peringatan';
      toast.error(msg);
    } finally {
      setSendingId(null);
    }
  };

  const filteredWarnings = warnings.filter(w => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (w.warning_number || '').toLowerCase().includes(s) ||
      (w.tenants?.nama_perusahaan || '').toLowerCase().includes(s) ||
      (w.invoices?.invoice_number || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333]">
            Surat Peringatan (SP) <small className="text-[15px] font-light text-[#777] ml-2">Pengendalian Piutang &amp; Penegakan Sanksi Retribusi</small>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Dinas Portal</span> / <span className="ml-1 font-medium">Surat Peringatan</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Surat Peringatan Terbit ({filteredWarnings.length})</h3>
          <div className="flex gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari SP / Tenant / SKRD..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#d2d6de] pl-8 pr-3 py-1 text-xs outline-none focus:border-[#3c8dbc] w-full sm:w-64 bg-white" 
              />
              <Search className="w-3.5 h-3.5 text-[#777] absolute left-2.5 top-2" />
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#3c8dbc]" /> Memuat data surat peringatan...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">NO. SURAT PERINGATAN</th>
                  <th className="py-3 px-4 font-bold">WAJIB RETRIBUSI</th>
                  <th className="py-3 px-4 font-bold">SKRD TERKAIT</th>
                  <th className="py-3 px-4 font-bold text-center">TINGKAT SP</th>
                  <th className="py-3 px-4 font-bold">PESAN &amp; KETENTUAN</th>
                  <th className="py-3 px-4 font-bold">TANGGAL TERBIT</th>
                  <th className="py-3 px-4 font-bold text-center">AKSI PENGIRIMAN</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarnings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#777]">
                      Tidak ada data surat peringatan. Seluruh mitra tertib membayar retribusi.
                    </td>
                  </tr>
                ) : (
                  filteredWarnings.map((warn) => (
                    <tr key={warn.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-4 font-mono text-[13px] font-bold text-[#3c8dbc]">
                        {warn.warning_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#333]">{warn.tenants?.nama_perusahaan}</div>
                        <div className="text-xs text-gray-500">Status: {warn.tenants?.status_verifikasi}</div>
                      </td>
                      <td className="py-3 px-4">
                        {warn.invoices ? (() => {
                          const diffDays = warn.invoices.due_date
                            ? Math.max(0, dayjs().diff(dayjs(warn.invoices.due_date), 'day'))
                            : 0;
                          return (
                            <div>
                              <div className="text-[#333] font-medium font-mono">{warn.invoices.invoice_number}</div>
                              <div className="text-xs text-slate-900 font-bold font-mono">{formatRupiah(Number(warn.invoices.amount))}</div>
                              {diffDays > 0 ? (
                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                    <Clock className="w-2.5 h-2.5 text-red-600" />
                                    Telat {diffDays} Hari
                                  </span>
                                  {warn.invoices.due_date && (
                                    <span className="text-[10px] text-slate-400">
                                      (JT: {dayjs(warn.invoices.due_date).format('DD/MM/YYYY')})
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          );
                        })() : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={warn.type} />
                      </td>
                      <td className="py-3 px-4 text-[13px] text-[#555] max-w-xs truncate" title={warn.message || ''}>
                        {warn.message}
                      </td>
                      <td className="py-3 px-4 text-[13px] text-[#777]">
                        {new Date(warn.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {warn.status === 'Email Sent' ? (
                          <div className="flex flex-col items-center gap-1">
                            <StatusBadge status="Aktif" label="Email Terkirim" />
                            <button
                              type="button"
                              onClick={() => handleSendEmail(warn)}
                              disabled={sendingId === warn.id}
                              className="text-[10px] text-slate-500 hover:text-[#3c8dbc] underline cursor-pointer disabled:opacity-50"
                            >
                              {sendingId === warn.id ? 'Mengirim...' : 'Kirim Ulang'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendEmail(warn)}
                            disabled={sendingId === warn.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[11px] font-bold rounded shadow-xs cursor-pointer disabled:opacity-60 transition-colors"
                            title={`Kirim ${warn.type} ke email resmi tenant`}
                          >
                            {sendingId === warn.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <Mail className="w-3 h-3" />
                                Kirim ke Email
                              </>
                            )}
                          </button>
                        )}
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
