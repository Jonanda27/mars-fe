import React from 'react';
import Link from 'next/link';
import { DinasDashboardData } from '@/services/dashboardService';

interface DinasActionQueueHubProps {
  readonly actionQueue: DinasDashboardData['action_queue'];
}

export const DinasActionQueueHub: React.FC<DinasActionQueueHubProps> = ({ actionQueue }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <Link 
        href="/dinas/permohonan" 
        className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">1. Permohonan</span>
          <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
            {actionQueue.pendingApplications} Berkas Ditelaah
          </p>
        </div>
        <span className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
          actionQueue.pendingApplications > 0 
            ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
            : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
        }`}>
          {actionQueue.pendingApplications}
        </span>
      </Link>

      <Link 
        href="/dinas/verifikasi" 
        className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">2. Legalitas Mitra</span>
          <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
            {actionQueue.pendingTenants} NIB/SIUAU Baru
          </p>
        </div>
        <span className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
          actionQueue.pendingTenants > 0 
            ? 'bg-amber-50 text-[#f39c12] border border-amber-200' 
            : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
        }`}>
          {actionQueue.pendingTenants}
        </span>
      </Link>

      <Link 
        href="/dinas/kontrak" 
        className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">3. Draf PKS Kadis</span>
          <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
            {actionQueue.pendingKadisContracts} Menunggu TTD
          </p>
        </div>
        <span className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
          actionQueue.pendingKadisContracts > 0 
            ? 'bg-blue-100 text-[#3c8dbc] border border-blue-300' 
            : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
        }`}>
          {actionQueue.pendingKadisContracts}
        </span>
      </Link>

      <Link 
        href="/dinas/tagihan" 
        className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">4. Penetapan SKRD</span>
          <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
            {actionQueue.unbilledHanggarLogs + actionQueue.pendingPaymentReceipts} Antrean Penetapan
          </p>
        </div>
        <span className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
          actionQueue.unbilledHanggarLogs + actionQueue.pendingPaymentReceipts > 0 
            ? 'bg-blue-100 text-[#3c8dbc] border border-blue-300' 
            : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
        }`}>
          {actionQueue.unbilledHanggarLogs + actionQueue.pendingPaymentReceipts}
        </span>
      </Link>

      <Link 
        href="/dinas/peringatan" 
        className="bg-white p-3 border-l-4 border-[#3c8dbc] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
      >
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">5. Surat Peringatan</span>
          <p className="text-xs font-bold text-slate-800 group-hover:text-[#3c8dbc] transition-colors">
            {actionQueue.pendingWarningLetters} Tagihan Jatuh Tempo
          </p>
        </div>
        <span className={`w-7 h-7 flex items-center justify-center font-bold text-xs ${
          actionQueue.pendingWarningLetters > 0 
            ? 'bg-red-50 text-[#dd4b39] border border-red-200' 
            : 'bg-blue-50 text-[#3c8dbc] border border-blue-200'
        }`}>
          {actionQueue.pendingWarningLetters}
        </span>
      </Link>
    </div>
  );
};
