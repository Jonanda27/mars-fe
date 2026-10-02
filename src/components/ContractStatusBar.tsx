"use client";

import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Contract } from '@/types/contract';
import StatusBadge from '@/components/StatusBadge';

export interface ContractStatusBarProps {
  activePayung: Contract | null;
  companyName: string;
  isLoading: boolean;
  isContractActive: boolean;
  isPendingSignature?: boolean;
  isPendingVerification?: boolean;
  label?: string;
  subtitle?: string;
}

export const ContractStatusBar: React.FC<ContractStatusBarProps> = ({
  activePayung,
  companyName,
  isLoading,
  isContractActive,
  isPendingSignature = false,
  isPendingVerification = false,
  label = 'KONTRAK PAYUNG:',
  subtitle = '• Izin operasional kebandarudaraan & jaringan perintis aktif'
}) => {
  return (
    <div className="bg-white shadow-xs border-t-[3px] border-[#3c8dbc] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-blue-50 text-[#3c8dbc] border border-blue-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            {label}
          </span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs">
            {activePayung?.contract_number || 'Belum Ada Kontrak'}
          </span>
          <span className="text-xs text-slate-500 hidden md:inline truncate">
            ({companyName})
          </span>
          {isContractActive && (
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center flex-shrink-0 self-end sm:self-center">
        {isLoading ? (
          <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-500 flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3c8dbc]" /> Memeriksa...
          </span>
        ) : isContractActive ? (
          <StatusBadge status="Aktif" />
        ) : isPendingSignature ? (
          <StatusBadge status="Menunggu TTD" />
        ) : isPendingVerification ? (
          <StatusBadge status="Menunggu Verifikasi" />
        ) : (
          <StatusBadge status="Belum Aktif" />
        )}
      </div>
    </div>
  );
};

export default ContractStatusBar;
