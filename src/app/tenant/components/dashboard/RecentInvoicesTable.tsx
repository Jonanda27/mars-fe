import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import dayjs from 'dayjs';

interface RecentInvoicesTableProps {
  readonly unpaidInvoices: Invoice[];
  readonly totalInvoiceCount: number;
}

export const RecentInvoicesTable: React.FC<RecentInvoicesTableProps> = ({
  unpaidInvoices,
  totalInvoiceCount,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <h3 className="text-[14px] text-[#333] font-bold flex items-center">
          <RupiahIcon className="w-4 h-4 mr-2 text-[#3c8dbc]" /> 
          Tagihan e-SKRD Menunggu Pembayaran
        </h3>
        <Link href="/tenant/tagihan" className="text-xs font-bold text-[#3c8dbc] hover:underline flex items-center gap-1">
          Semua Tagihan ({totalInvoiceCount}) <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th className="py-2.5 px-4">No e-SKRD</th>
              <th className="py-2.5 px-4">Layanan / Objek Sewa</th>
              <th className="py-2.5 px-4 text-center">Jatuh Tempo</th>
              <th className="py-2.5 px-4 text-right">Nilai Tagihan</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {unpaidInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-80" />
                  <p className="font-bold text-xs text-slate-700">Seluruh Tagihan Retribusi Tertib / Lunas</p>
                  <p className="text-[11px] text-slate-400">Tidak ada kewajiban pembayaran yang tertunda saat ini.</p>
                </td>
              </tr>
            ) : (
              unpaidInvoices.slice(0, 5).map((inv, idx) => {
                const totalAmount = Number(inv.amount || 0) + Number(inv.penalty_amount || 0);
                const isOverdue = inv.status === 'Overdue' || (inv.due_date && dayjs().isAfter(dayjs(inv.due_date)));

                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {inv.contracts?.assets?.nama_aset || inv.invoice_type || 'Retribusi Pemakaian Fasilitas'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {inv.invoice_type === 'Sewa Ruangan' ? 'Kode Akun: 4.1.2.02.01' : inv.invoice_type === 'SKRD Denda' ? 'Kode Akun: 4.1.4.01.01' : 'Kode Akun: 4.1.2.02.02'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {inv.due_date ? dayjs(inv.due_date).format('DD MMM YYYY') : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-[#dd4b39]">
                        {formatRupiah(totalAmount)}
                      </div>
                      {Number(inv.penalty_amount) > 0 && (
                        <div className="text-[10px] text-red-500">
                          Termasuk Denda {formatRupiah(inv.penalty_amount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={isOverdue ? 'Jatuh Tempo' : (inv.status || 'Menunggu Bayar')} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href="/tenant/tagihan"
                        className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[11px] px-2.5 py-1 transition-colors inline-block shadow-2xs"
                      >
                        Bayar / STS
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
