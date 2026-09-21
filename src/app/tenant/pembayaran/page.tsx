"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Search, Calendar, FileText, 
  Loader2, ArrowRightLeft, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import { SkrdPreviewModal } from '@/app/tenant/permohonan/[id]/components/step5/SkrdPreviewModal';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function RiwayatPembayaranPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSkrd, setSelectedSkrd] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getTenantInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat riwayat pembayaran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter paid & verified transactions
  const paidTransactions = useMemo(() => {
    return invoices.filter((inv) => {
      const isPaidStatus = 
        inv.status === 'Paid' || 
        inv.status === 'Lunas' || 
        inv.status === 'Pending Verification' ||
        inv.payment_date !== null;

      if (!isPaidStatus) return false;

      // Filter by search query
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchNumber = (inv.invoice_number || '').toLowerCase().includes(s);
        const matchMethod = (inv.payment_method || '').toLowerCase().includes(s);
        const matchContract = (inv.contracts?.contract_number || '').toLowerCase().includes(s);
        const matchType = (inv.invoice_type || '').toLowerCase().includes(s);
        if (!matchNumber && !matchMethod && !matchContract && !matchType) return false;
      }

      // Filter by month
      if (selectedMonth) {
        const targetDate = inv.payment_date || inv.created_at;
        const invMonth = dayjs(targetDate).format('YYYY-MM');
        if (invMonth !== selectedMonth) return false;
      }

      return true;
    });
  }, [invoices, searchTerm, selectedMonth]);

  const totalNominalLunas = useMemo(() => {
    return paidTransactions
      .filter((inv) => inv.status === 'Paid' || inv.status === 'Lunas')
      .reduce((acc, inv) => acc + Number(inv.amount) + Number(inv.penalty_amount || 0), 0);
  }, [paidTransactions]);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Riwayat Pembayaran <span className="text-[15px] font-light text-[#777] ml-2">Daftar Transaksi e-SKRD Lunas</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant Portal</span> / <span className="ml-1 font-medium text-slate-800">Riwayat Pembayaran</span>
        </div>
      </header>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Total Transaksi Lunas</span>
            <div className="text-2xl font-bold text-[#3c8dbc]">
              {paidTransactions.filter((inv) => inv.status === 'Paid' || inv.status === 'Lunas').length}{' '}
              <span className="text-xs font-normal text-slate-500">e-SKRD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Bukti setor kasda terverifikasi</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] flex items-center justify-center rounded">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Total Retribusi Terbayar</span>
            <div className="text-2xl font-bold text-[#00a65a] font-mono">
              {formatRupiah(totalNominalLunas)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Akumulasi penerimaan daerah</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] flex items-center justify-center rounded">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabel Data Pembayaran */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Daftar Transaksi Pembayaran
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Filter Tanggal Bulan */}
            <div className="flex items-center border border-[#d2d6de] bg-white px-2">
              <Calendar className="w-4 h-4 text-[#777] mr-2" />
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="py-1.5 text-[13px] focus:outline-none text-[#555] bg-transparent" 
              />
              {selectedMonth && (
                <button
                  type="button"
                  onClick={() => setSelectedMonth('')}
                  className="text-xs text-slate-400 hover:text-slate-600 ml-1 font-bold"
                  title="Hapus Filter Bulan"
                >
                  &times;
                </button>
              )}
            </div>
            
            {/* Search Box */}
            <div className="flex">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari No. e-SKRD atau Metode..." 
                className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[220px]" 
              />
              <button 
                type="button"
                className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors"
              >
                <Search className="w-4 h-4 text-[#777]" />
              </button>
            </div>

            <button
              type="button"
              onClick={fetchInvoices}
              title="Segarkan Data"
              className="p-2 border border-[#d2d6de] bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#3c8dbc]" />
            </button>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-slate-100">
                <th className="py-3 px-5 font-bold">Tanggal Bayar</th>
                <th className="py-3 px-5 font-bold">No. e-SKRD</th>
                <th className="py-3 px-5 font-bold">Objek Retribusi</th>
                <th className="py-3 px-5 font-bold">Metode Pembayaran</th>
                <th className="py-3 px-5 font-bold text-right">Nominal (Rp)</th>
                <th className="py-3 px-5 font-bold text-center">Status</th>
                <th className="py-3 px-5 font-bold text-center w-28">Kwitansi e-SKRD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    <span>Memuat riwayat transaksi pembayaran...</span>
                  </td>
                </tr>
              ) : paidTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-600">Belum Ada Riwayat Pembayaran</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm || selectedMonth 
                        ? 'Tidak ada transaksi yang cocok dengan filter pencarian.' 
                        : 'Seluruh transaksi pembayaran e-SKRD yang telah lunas akan tercatat di sini.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paidTransactions.map((inv) => {
                  const total = Number(inv.amount) + Number(inv.penalty_amount || 0);
                  const payDate = inv.payment_date || inv.created_at;

                  return (
                    <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#333]">
                          {dayjs(payDate).format('DD MMM YYYY')}
                        </div>
                        <div className="text-[11px] text-[#777]">
                          {dayjs(payDate).format('HH:mm')} WIT
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold font-mono text-[#3c8dbc]">
                          {inv.invoice_number}
                        </div>
                        {inv.contracts?.contract_number && (
                          <div className="text-[11px] text-slate-400">
                            PKS: {inv.contracts.contract_number}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700">
                        <span className="font-semibold text-xs">
                          {inv.invoice_type || inv.contracts?.assets?.nama_aset || 'Sewa Fasilitas'}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {inv.contracts?.assets?.lokasi || 'UPBU Mozes Kilangin'}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-[#555]">
                        <span className="font-bold text-[#333] text-xs">
                          {inv.payment_method || 'STS Bank Papua'}
                        </span>
                        <div className="text-[11px] text-slate-400">Kasda Kab. Mimika</div>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-[#333]">
                        {formatRupiah(total)}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <button 
                          type="button"
                          onClick={() => setSelectedSkrd(inv)}
                          className="bg-white border border-[#d2d6de] text-[#3c8dbc] hover:bg-blue-50 px-3 py-1.5 text-[12px] flex items-center justify-center mx-auto shadow-xs transition-colors font-bold cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-1 text-[#3c8dbc]" /> PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>
            Menampilkan {paidTransactions.length} transaksi pembayaran
          </span>
          <div className="flex gap-1">
            <span className="px-3 py-1 border border-[#3c8dbc] bg-[#3c8dbc] text-white font-bold text-xs">
              Halaman 1
            </span>
          </div>
        </div>
      </div>

      {/* Modal Cetak Kwitansi / SKRD Preview */}
      {selectedSkrd && (
        <SkrdPreviewModal
          isOpen={Boolean(selectedSkrd)}
          skrdInvoice={selectedSkrd}
          onClose={() => setSelectedSkrd(null)}
        />
      )}
    </div>
  );
}
