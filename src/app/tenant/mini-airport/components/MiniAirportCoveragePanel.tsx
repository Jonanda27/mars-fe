"use client";

import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  X
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Contract } from '@/types/contract';
import { MiniAirportItem } from './types';

dayjs.locale('id');

export interface MiniAirportCoveragePanelProps {
  miniAirports: MiniAirportItem[];
  contracts: Contract[];
  companyName: string;
  isLoading: boolean;
  selectedAirportId?: number | null;
  onSelectAirport?: (airportId: number | null) => void;
}

interface AirportStatusItem {
  airport: MiniAirportItem;
  contract: Contract | null;
  status: 'ACTIVE' | 'PENDING_SIGNATURE' | 'PENDING_VERIFICATION' | 'NO_CONTRACT';
  contractNumber?: string;
  daysRemaining?: number | null;
  endDateFormatted?: string;
}

export const MiniAirportCoveragePanel: React.FC<MiniAirportCoveragePanelProps> = ({
  miniAirports = [],
  contracts = [],
  companyName,
  isLoading,
  selectedAirportId = null,
  onSelectAirport
}) => {
  // Evaluasi status kontrak payung untuk tiap mini airport
  const airportStatusList = useMemo<AirportStatusItem[]>(() => {
    if (!miniAirports || miniAirports.length === 0) return [];

    return miniAirports.map((airport) => {
      // Cari kontrak yang cocok dengan bandara ini
      const matchingContract = contracts.find((c) => {
        let fas: any = c.fasilitas;
        if (typeof fas === 'string') {
          try { fas = JSON.parse(fas); } catch (e) { fas = {}; }
        }
        fas = fas || {};

        const num = (c.contract_number || '').toUpperCase();
        const type = (c.contract_type || '').toLowerCase();
        const code = (airport.kode_bandara || '').toUpperCase();

        // 1. Cocokkan ID bandara jika tersimpan di JSON fasilitas
        if (fas.mini_airport_id && Number(fas.mini_airport_id) === Number(airport.id)) return true;
        if (fas.airport_id && Number(fas.airport_id) === Number(airport.id)) return true;

        // 2. Cocokkan kode bandara (ILA, EWI, UGU, dll.)
        if (fas.airport_code && String(fas.airport_code).toUpperCase() === code) return true;
        if (num.includes(`/${code}/`) || num.includes(`-${code}-`) || num.includes(`PKS/${code}`)) return true;

        // 3. Fallback jika nama bandara ada di nomor kontrak atau catatan
        if (code && num.includes(code)) return true;

        // 4. Jika kontrak payung mencakup seluruh mini airport
        if (fas.all_mini_airports === true && (type.includes('mini') || type.includes('payung'))) return true;

        return false;
      });

      if (!matchingContract) {
        return {
          airport,
          contract: null,
          status: 'NO_CONTRACT'
        };
      }

      // Hitung sisa hari berlaku
      let daysRemaining: number | null = null;
      let endDateFormatted: string | undefined = undefined;

      if (matchingContract.end_date) {
        const today = dayjs().startOf('day');
        const end = dayjs(matchingContract.end_date).startOf('day');
        daysRemaining = end.diff(today, 'day');
        endDateFormatted = dayjs(matchingContract.end_date).format('DD/MM/YYYY');
      }

      const s = (matchingContract.status || '').trim().toLowerCase();
      const isExpired = daysRemaining !== null && daysRemaining < 0;

      let status: 'ACTIVE' | 'PENDING_SIGNATURE' | 'PENDING_VERIFICATION' | 'NO_CONTRACT' = 'ACTIVE';

      if (isExpired) {
        status = 'NO_CONTRACT';
      } else if (s === 'aktif' || s === 'active' || s === 'signed') {
        status = 'ACTIVE';
      } else if (s === 'menunggu ttd tenant' || s === 'menunggu ttd') {
        status = 'PENDING_SIGNATURE';
      } else if (s.includes('verifikasi') || s === 'pending') {
        status = 'PENDING_VERIFICATION';
      } else {
        status = 'ACTIVE';
      }

      return {
        airport,
        contract: matchingContract,
        status,
        contractNumber: matchingContract.contract_number,
        daysRemaining,
        endDateFormatted
      };
    });
  }, [miniAirports, contracts]);

  const activeCount = airportStatusList.filter((item) => item.status === 'ACTIVE').length;

  if (isLoading) {
    return (
      <div className="bg-white shadow-xs border-t-[3px] border-[#3c8dbc] px-3.5 py-2 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3c8dbc] animate-pulse" />
          Memuat status cakupan kontrak mini airport...
        </span>
      </div>
    );
  }

  if (airportStatusList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-xs border-t-[3px] border-[#3c8dbc] px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
      {/* Kiri: Label ringkas + Chips status tiap Mini Airport */}
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs shrink-0 mr-1">
          <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
          <span className="hidden sm:inline">Status Kontrak Payung:</span>
          <span className="sm:hidden">PKS Bandara:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {airportStatusList.map((item) => {
            const isSelected = selectedAirportId === item.airport.id;
            const isContractActive = item.status === 'ACTIVE';
            const isPending =
              item.status === 'PENDING_SIGNATURE' || item.status === 'PENDING_VERIFICATION';

            let tooltip = `${item.airport.nama_bandara} (${item.airport.kode_bandara})`;
            if (item.contract) {
              tooltip += ` • No. PKS: ${item.contractNumber || '-'}`;
              if (item.endDateFormatted) {
                tooltip += ` • Berlaku s/d ${item.endDateFormatted}`;
              }
            } else {
              tooltip += ` • Belum memiliki kontrak payung di bandara ini`;
            }

            return (
              <button
                key={item.airport.id}
                type="button"
                onClick={() => onSelectAirport && onSelectAirport(isSelected ? null : item.airport.id)}
                title={tooltip}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all border ${
                  isSelected
                    ? 'ring-2 ring-[#3c8dbc] border-[#3c8dbc] shadow-xs'
                    : 'hover:shadow-xs'
                } ${
                  isContractActive
                    ? isSelected
                      ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-medium'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:border-emerald-300'
                    : isPending
                    ? isSelected
                      ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-medium'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900 hover:border-amber-300'
                    : isSelected
                    ? 'bg-slate-200 border-slate-400 text-slate-900 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span
                  className={`font-mono font-bold text-[10.5px] px-1 py-0.2 rounded ${
                    isContractActive
                      ? 'bg-emerald-200/70 text-emerald-800'
                      : isPending
                      ? 'bg-amber-200/70 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.airport.kode_bandara}
                </span>

                <span className="font-semibold text-slate-800 text-[11.5px]">
                  {item.airport.nama_bandara.replace(/^Mini Airport\s+/i, '')}
                </span>

                {isContractActive ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Aktif</span>
                  </span>
                ) : isPending ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Proses</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Belum Terikat
                  </span>
                )}

                {isSelected && (
                  <X className="w-3 h-3 text-slate-400 hover:text-rose-600 ml-0.5" />
                )}
              </button>
            );
          })}

          {selectedAirportId && (
            <button
              type="button"
              onClick={() => onSelectAirport && onSelectAirport(null)}
              className="text-[11px] text-[#3c8dbc] hover:underline font-medium ml-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Kanan: Ringkasan Jumlah */}
      <div className="flex items-center shrink-0 self-end md:self-center">
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          <strong className="text-[#3c8dbc]">{activeCount}</strong>/{airportStatusList.length} Bandara Aktif
        </span>
      </div>
    </div>
  );
};

export default MiniAirportCoveragePanel;
