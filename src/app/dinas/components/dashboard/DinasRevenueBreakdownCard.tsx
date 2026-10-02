import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '@/utils/formatCurrency';
import { DinasDashboardData } from '@/services/dashboardService';

interface DinasRevenueBreakdownCardProps {
  readonly revenueBreakdown: DinasDashboardData['revenue_breakdown'];
}

export const DinasRevenueBreakdownCard: React.FC<DinasRevenueBreakdownCardProps> = ({ revenueBreakdown }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Card C: Komposisi Realisasi PAD per Objek Retribusi */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[14px] text-[#333] font-bold flex items-center">
            <Layers className="w-4 h-4 mr-2 text-[#3c8dbc]" /> Komposisi Realisasi PAD
          </h3>
          <span className="text-[10px] font-bold bg-blue-50 text-[#3c8dbc] px-2 py-0.5 border border-blue-200">
            Tahun {new Date().getFullYear()}
          </span>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Objek 1: Hanggar & Apron */}
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Sewa Hanggar &amp; Apron (4.1.2.02.02)</span>
              <span className="font-mono">{formatRupiah(revenueBreakdown.hanggar)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 overflow-hidden">
              <div 
                className="bg-[#3c8dbc] h-full" 
                style={{ 
                  width: `${revenueBreakdown.total > 0 ? (revenueBreakdown.hanggar / revenueBreakdown.total) * 100 : 0}%` 
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {revenueBreakdown.total > 0 ? ((revenueBreakdown.hanggar / revenueBreakdown.total) * 100).toFixed(1) : 0}% dari total PAD
            </span>
          </div>

          {/* Objek 2: Ruangan Terminal */}
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Sewa Ruang &amp; Kantor (4.1.2.02.01)</span>
              <span className="font-mono">{formatRupiah(revenueBreakdown.ruangan)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 overflow-hidden">
              <div 
                className="bg-[#00a65a] h-full" 
                style={{ 
                  width: `${revenueBreakdown.total > 0 ? (revenueBreakdown.ruangan / revenueBreakdown.total) * 100 : 0}%` 
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {revenueBreakdown.total > 0 ? ((revenueBreakdown.ruangan / revenueBreakdown.total) * 100).toFixed(1) : 0}% dari total PAD
            </span>
          </div>

          {/* Objek 3: Denda Keterlambatan */}
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Denda Keterlambatan (4.1.4.01.01)</span>
              <span className="font-mono text-red-600">{formatRupiah(revenueBreakdown.denda)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 overflow-hidden">
              <div 
                className="bg-[#dd4b39] h-full" 
                style={{ 
                  width: `${revenueBreakdown.total > 0 ? (revenueBreakdown.denda / revenueBreakdown.total) * 100 : 0}%` 
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Sanksi bunga 1% per bulan terbayar
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Laporan Resmi Kasda:</span>
            <Link href="/dinas/laporan" className="text-[#3c8dbc] font-bold hover:underline">
              Buku Kas &amp; Cetak PDF &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Card D: Standar Regulasi & SOP Pelayanan Dinas */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
          <h3 className="text-[14px] text-[#333] font-bold flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#3c8dbc]" /> SOP Pelayanan Dinas
          </h3>
          <span className="text-[10px] font-mono text-slate-400">UPBU</span>
        </div>
        
        <div className="p-4 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</div>
            <p>Verifikasi kelengkapan berkas &amp; legalitas mitra dalam waktu maksimal 2 hari kerja.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</div>
            <p>Penyusunan draf PKS dan penetapan e-SKRD wajib mengacu pada Master Tarif Perda.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-blue-50 text-[#3c8dbc] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</div>
            <p>Penerbitan Surat Peringatan berjenjang (SP-1 H+7, SP-2 H+14, SP-3 H+21) bagi wajib retribusi menunggak.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
