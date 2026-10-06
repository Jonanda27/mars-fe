"use client";

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  FileText,
  RefreshCw,
  Search,
  AlertCircle,
  Download,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import api from '@/services/api';
import { QuickBillResult } from './data';

export default function BillCheckSection() {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<QuickBillResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e?: React.FormEvent, sampleCode?: string) => {
    if (e) e.preventDefault();
    const query = sampleCode || searchQuery;
    if (!query.trim()) {
      setSearchError('Silakan masukkan nomor SKRD atau Kode Invoice.');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setSearchResult(null);

    try {
      const res = await api.get('/invoices/public/check', {
        params: { q: query.trim() }
      });

      if (res.data?.success && res.data?.data) {
        setSearchResult(res.data.data);
      } else {
        setSearchError(res.data?.message || 'Nomor SKRD atau kode invoice tidak ditemukan di database.');
      }
    } catch (err: any) {
      console.error('Invoice search error:', err);
      const msg = err?.response?.data?.message || 'Gagal memeriksa status tagihan. Silakan periksa koneksi Anda.';
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="cek-tagihan" className="py-16 sm:py-20 bg-[#f8fafc] border-b border-gray-200 scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3c8dbc] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-2 shadow-2xs">
            Layanan Mandiri
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Cek Tagihan &amp; Status e-SKRD
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl mx-auto">
            Masukkan Nomor SKRD atau Nomor Invoice untuk melihat rincian tagihan dan nomor pembayaran Virtual Account Bank Papua.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-7 shadow-sm">
          
          <form onSubmit={handleSearch} className="space-y-4">
            <label htmlFor={searchInputId} className="sr-only">
              Nomor SKRD atau Nomor Invoice
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nomor SKRD atau Invoice (contoh: SKRD-2026-02-0145)..."
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Cek Tagihan</span>
                  </>
                )}
              </button>
            </div>

            {searchError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{searchError}</span>
              </div>
            )}
          </form>

          {/* Hasil Pencarian */}
          {searchResult && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200 mb-4">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Nomor SKRD / Surat Ketetapan:</span>
                    <span className="font-extrabold text-sm text-gray-900">{searchResult.skrdNo}</span>
                  </div>
                  <div>
                    {searchResult.status === 'PAID' ? (
                      <StatusBadge status="Lunas" label="LUNAS TERVERIFIKASI" className="text-xs px-3 py-1" />
                    ) : searchResult.status === 'EMERGENCY' ? (
                      <StatusBadge status="Menunggu Bayar" label="MENUNGGU PEMBAYARAN DARURAT" className="text-xs px-3 py-1" />
                    ) : (
                      <StatusBadge status="Menunggu Bayar" label="MENUNGGU PEMBAYARAN" className="text-xs px-3 py-1" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Wajib Retribusi / Mitra:</span>
                    <span className="font-bold text-gray-800">{searchResult.wajibRetribusi}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Layanan / Objek Retribusi:</span>
                    <span className="font-medium text-gray-800">{searchResult.layanan}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Tanggal Terbit:</span>
                    <span className="font-medium text-gray-800">{searchResult.tglTerbit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">
                      {searchResult.status === 'PAID' ? 'Waktu Pelunasan:' : 'Batas Jatuh Tempo:'}
                    </span>
                    <span className={`font-semibold ${searchResult.status === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {searchResult.status === 'PAID' ? searchResult.tglLunas : searchResult.jatuhTempo}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-0.5">Total Tagihan:</span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900">
                      Rp {searchResult.totalTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {searchResult.status === 'PAID' ? (
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-gray-500 block mb-0.5">Nomor Transaksi Kasda:</span>
                      <span className="font-mono text-xs font-bold text-emerald-700">{searchResult.ntb}</span>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                      <span className="text-[11px] text-gray-500 block">Virtual Account Bank Papua:</span>
                      <span className="font-mono text-sm font-bold text-[#367fa9] tracking-wider">
                        {searchResult.noVa}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <span className="text-gray-500 italic text-[11px]">
                    {searchResult.keterangan}
                  </span>

                  {searchResult.status === 'PAID' ? (
                    <Link
                      href="/cetak/skrd/sample"
                      className="w-full sm:w-auto justify-center px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Cetak Bukti</span>
                    </Link>
                  ) : searchResult.tokenDarurat ? (
                    <Link
                      href={`/pembayaran-darurat/${searchResult.tokenDarurat}`}
                      className="w-full sm:w-auto justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bayar Sekarang (QRIS / VA)</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Masuk Portal untuk Bayar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
