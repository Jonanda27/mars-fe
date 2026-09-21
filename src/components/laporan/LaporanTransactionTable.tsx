import React from 'react';
import { Search, FileText } from 'lucide-react';
import { ReportInvoiceItem } from '@/services/reportService';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

interface LaporanTransactionTableProps {
  readonly invoices: ReportInvoiceItem[];
  readonly searchQuery: string;
  readonly setSearchQuery: (val: string) => void;
  readonly isLoading: boolean;
}

export const LaporanTransactionTable: React.FC<LaporanTransactionTableProps> = ({
  invoices,
  searchQuery,
  setSearchQuery,
  isLoading,
}) => {
  const filteredInvoiceList = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.tenant_name.toLowerCase().includes(q) ||
      inv.asset_name.toLowerCase().includes(q) ||
      inv.account_code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      {/* Table Header & Search Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3c8dbc]" />
            Rincian Transaksi Ketetapan &amp; Pembayaran SKRD
          </h3>
          <p className="text-[11px] text-slate-500">
            Daftar transaksi ketetapan dan pembayaran SKRD pada periode laporan terpilih.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            placeholder="Cari nomor SKRD, tenant, aset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs focus:border-[#3c8dbc] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#f9fafb] text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="p-3 w-12 text-center">No</th>
              <th className="p-3">Nomor SKRD</th>
              <th className="p-3">Wajib Retribusi</th>
              <th className="p-3">Kode Rekening</th>
              <th className="p-3">Objek / Layanan</th>
              <th className="p-3">Tgl Penetapan</th>
              <th className="p-3">Jatuh Tempo</th>
              <th className="p-3 text-right">Pokok (Rp)</th>
              <th className="p-3 text-right">Denda (Rp)</th>
              <th className="p-3 text-right">Total (Rp)</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#3c8dbc] border-t-transparent rounded-full animate-spin"></div>
                    <span>Memuat data realisasi transaksi...</span>
                  </div>
                </td>
              </tr>
            ) : filteredInvoiceList.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-400">
                  Tidak ada transaksi SKRD yang sesuai dengan kriteria / periode filter.
                </td>
              </tr>
            ) : (
              filteredInvoiceList.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-[#3c8dbc]">
                    {inv.invoice_number}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {inv.tenant_name}
                  </td>
                  <td className="p-3 font-mono text-slate-600 text-[11px]">
                    <span className="bg-slate-100 px-1.5 py-0.5 border border-slate-200">
                      {inv.account_code}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    {inv.asset_name}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {dayjs(inv.created_at).format('DD/MM/YYYY')}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {dayjs(inv.due_date).format('DD/MM/YYYY')}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    {formatRupiah(inv.amount)}
                  </td>
                  <td className="p-3 text-right font-mono text-amber-600">
                    {inv.penalty_amount > 0 ? formatRupiah(inv.penalty_amount) : '-'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(inv.total_amount)}
                  </td>
                  <td className="p-3 text-center">
                    {inv.status === 'PAID' ? (
                      <span className="bg-[#00a65a]/10 text-[#00a65a] font-bold text-[10px] px-2 py-0.5 border border-[#00a65a]/20">
                        LUNAS
                      </span>
                    ) : inv.status === 'CANCELLED' ? (
                      <span className="bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-0.5 border border-slate-300">
                        BATAL
                      </span>
                    ) : (
                      <span className="bg-[#dd4b39]/10 text-[#dd4b39] font-bold text-[10px] px-2 py-0.5 border border-[#dd4b39]/20">
                        BELUM LUNAS
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
