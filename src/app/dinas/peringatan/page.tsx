"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWarningStore } from '@/store/useWarningStore';
import { AlertTriangle, Home, Search, Loader2, Info, Plus } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';

export default function DinasPeringatanPage() {
  const { warnings, isLoading, error, fetchAllWarnings } = useWarningStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllWarnings();
  }, [fetchAllWarnings]);

  const getWarningColor = (type: string) => {
    if (type === 'SP 1') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (type === 'SP 2') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (type === 'SP 3') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
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
                </tr>
              </thead>
              <tbody>
                {filteredWarnings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777]">
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
                        {warn.invoices ? (
                          <>
                            <div className="text-[#333] font-medium font-mono">{warn.invoices.invoice_number}</div>
                            <div className="text-xs text-red-600 font-bold">{formatRupiah(Number(warn.invoices.amount))}</div>
                          </>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border ${getWarningColor(warn.type)}`}>
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
