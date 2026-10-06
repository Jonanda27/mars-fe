import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import { DinasDashboardData } from '@/services/dashboardService';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface DinasOverdueInvoicesTableProps {
  readonly overdueInvoices: DinasDashboardData['top_overdue_invoices'];
}

export const DinasOverdueInvoicesTable: React.FC<DinasOverdueInvoicesTableProps> = ({ overdueInvoices }) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
        <h3 className="text-[14px] text-[#333] font-bold flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-[#3c8dbc]" /> 
          Pengawasan Piutang &amp; Penagihan Retribusi (Perbup Mimika 25/2024)
        </h3>
        <Link href="/dinas/peringatan" className="text-xs font-bold text-[#3c8dbc] hover:underline flex items-center gap-1">
          Kelola Penagihan Piutang <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th className="py-2.5 px-4">Nomor e-SKRD</th>
              <th className="py-2.5 px-4">Wajib Retribusi (Tenant)</th>
              <th className="py-2.5 px-4 text-right">Nilai Tagihan</th>
              <th className="py-2.5 px-4 text-center">Jatuh Tempo</th>
              <th className="py-2.5 px-4 text-center">Tunggakan</th>
              <th className="py-2.5 px-4 text-center">Rekomendasi Dinas</th>
              <th className="py-2.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overdueInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-80" />
                  <p className="font-bold text-xs text-slate-600">Seluruh Pembayaran Berjalan Tertib</p>
                  <p className="text-[11px] text-slate-400">Tidak ada piutang yang melewati batas jatuh tempo.</p>
                </td>
              </tr>
            ) : (
              overdueInvoices.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">{inv.invoice_number}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{inv.tenant_name}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#dd4b39]">
                    {formatRupiah(inv.amount)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {inv.due_date ? dayjs(inv.due_date).format('DD/MM/YYYY') : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status="danger" label={`${inv.days_overdue} Hari`} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={inv.recommended_action} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href="/dinas/peringatan"
                      className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[11px] px-2.5 py-1 transition-colors inline-block"
                    >
                      Proses
                    </Link>
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
