"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { AlertTriangle, Home, Search, Loader2, Info, Clock } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';

export default function AdminPeringatanPage() {
  const { warnings, isLoading, error, fetchAllWarnings } = useWarningStore();

  useEffect(() => {
    fetchAllWarnings();
  }, [fetchAllWarnings]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Surat Peringatan <small className="text-[15px] font-light text-[#777] ml-2">Monitoring Pengendalian Risiko</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Surat Peringatan</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar SP Terbit</h3>
          <div className="flex gap-2">
            <div className="relative">
              <input type="text" placeholder="Cari peringatan..." className="border border-[#d2d6de] pl-8 pr-3 py-1 text-sm outline-none focus:border-[#3c8dbc] w-full sm:w-64" />
              <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-1.5" />
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center items-center text-[#777]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data peringatan...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">NO. PERINGATAN</th>
                  <th className="py-3 px-4 font-bold">TENANT</th>
                  <th className="py-3 px-4 font-bold">INVOICE TERKAIT</th>
                  <th className="py-3 px-4 font-bold text-center">TIPE SP</th>
                  <th className="py-3 px-4 font-bold">PESAN</th>
                  <th className="py-3 px-4 font-bold">TANGGAL TERBIT</th>
                </tr>
              </thead>
              <tbody>
                {warnings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777]">
                      Tidak ada data surat peringatan. Tenant dalam kondisi baik.
                    </td>
                  </tr>
                ) : (
                  warnings.map((warn) => (
                    <tr key={warn.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-4 font-mono text-[13px] text-[#333]">
                        {warn.warning_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#3c8dbc]">{warn.tenants?.nama_perusahaan}</div>
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
                              {diffDays > 0 && (
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
                              )}
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
