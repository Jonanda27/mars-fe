"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { AlertTriangle, Home, Search, Loader2, Info } from 'lucide-react';
import formatRupiah from '@/utils/formatCurrency';

export default function AdminPeringatanPage() {
  const { warnings, isLoading, error, fetchAllWarnings } = useWarningStore();

  useEffect(() => {
    fetchAllWarnings();
  }, [fetchAllWarnings]);

  const getWarningColor = (type: string) => {
    if (type === 'SP 1') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (type === 'SP 2') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Daftar Surat Peringatan <small className="text-[15px] text-[#777] ml-2 font-light">Monitoring Pengendalian Risiko</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <Home className="w-3 h-3 mr-1" /> <span className="mr-1">Home</span> / <span className="ml-1 font-medium">Surat Peringatan</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#dd4b39] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-[#dd4b39]" /> Daftar SP Terbit
          </h3>
          <div className="relative">
            <input type="text" placeholder="Cari peringatan..." className="border border-[#d2d6de] pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-[#3c8dbc] w-full sm:w-64" />
            <Search className="w-4 h-4 text-[#777] absolute left-2.5 top-2" />
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
            <table className="w-full text-[14px] text-left">
              <thead>
                <tr className="border-b border-[#f4f4f4] bg-slate-50 text-[#333]">
                  <th className="py-3 px-4 font-bold w-[150px]">NO. PERINGATAN</th>
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
                        <div className="text-xs text-gray-500">Status: {warn.tenants?.status_pembayaran}</div>
                      </td>
                      <td className="py-3 px-4">
                        {warn.invoices ? (
                          <>
                            <div className="text-[#333] font-medium">{warn.invoices.invoice_number}</div>
                            <div className="text-xs text-red-600 font-semibold">{formatRupiah(Number(warn.invoices.amount))}</div>
                          </>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-sm border ${getWarningColor(warn.type)}`}>
                          {warn.type}
                        </span>
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
