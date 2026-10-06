"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { Eye, ShieldAlert, FileText, Printer } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';
import { SuratPKSDaruratModal } from '@/components/SuratPKSDaruratModal';

function getAssetLabel(contract: Contract): string {
  if (contract.contract_type === 'PKS Payung Mini Airport' || (contract.fasilitas as any)?.category === 'Mini Airport' || Boolean(contract.contract_number?.startsWith('PKS-PAYUNG/'))) {
    const f = (contract.fasilitas as any) || {};
    return `Bandara ${f.airport_name || 'Perintis'} (${f.airport_code || 'MINI'})`;
  }
  if (contract.contract_type === 'Payung' || contract.contract_type === 'PKS Payung Mozes Kilangin') {
    return 'Semua Aset (Payung Mozes)';
  }
  if (contract.contract_type === 'PKS Pendaratan Darurat') {
    const fas = typeof contract.fasilitas === 'string' ? JSON.parse(contract.fasilitas) : (contract.fasilitas || {});
    return `${fas.parking_location || 'Apron/Hanggar'} (Darurat)`;
  }
  if (contract.assets?.kode_aset) {
    return `${contract.assets.kode_aset}`;
  }
  return '-';
}

function getContractTypeBadge(contract: Contract) {
  const isEmergency = contract.contract_type === 'PKS Pendaratan Darurat' || contract.contract_type === 'Pendaratan Darurat';
  const isMiniPayung = contract.contract_type === 'PKS Payung Mini Airport' || (Boolean(contract.contract_number?.startsWith('PKS-PAYUNG/')) && !contract.contract_number?.includes('MOZES'));
  const isMozesPayung = contract.contract_type === 'Payung' || contract.contract_type === 'PKS Payung Mozes Kilangin' || Boolean(contract.contract_number?.includes('MOZES'));

  if (isEmergency) {
    return (
      <span className="inline-flex items-center whitespace-nowrap px-3 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
        Pendaratan Darurat
      </span>
    );
  }
  if (isMiniPayung) {
    return (
      <span className="inline-flex items-center whitespace-nowrap px-3 py-1 text-[11px] font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
        PKS Payung (Mini)
      </span>
    );
  }
  if (isMozesPayung) {
    return (
      <span className="inline-flex items-center whitespace-nowrap px-3 py-1 text-[11px] font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
        PKS Payung (Mozes)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center whitespace-nowrap px-3 py-1 text-[11px] font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs">
      {contract.contract_type || 'Sewa Baru'}
    </span>
  );
}

export default function DinasKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPksContract, setPreviewPksContract] = useState<Contract | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contractService.getContracts();
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className="p-8 text-center text-slate-500">Memuat data kontrak...</td>
        </tr>
      );
    }

    if (contracts.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="p-8 text-center text-slate-500">Belum ada data kontrak.</td>
        </tr>
      );
    }

    return contracts.map((contract) => {
      const isEmergency = contract.contract_type === 'PKS Pendaratan Darurat';

      return (
        <tr key={contract.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isEmergency ? 'bg-red-50/20' : ''}`}>
          <td className="p-4 font-mono font-medium text-blue-600 whitespace-nowrap">
            {contract.contract_number}
          </td>
          <td className="p-4 whitespace-nowrap">
            {getContractTypeBadge(contract)}
          </td>
          <td className="p-4 font-medium text-slate-800">
            {contract.tenants?.nama_perusahaan}
            {isEmergency && contract.tenants?.pic && (
              <span className="block text-[11px] font-normal text-slate-500">PIC: {contract.tenants.pic}</span>
            )}
          </td>
          <td className="p-4 text-slate-600">{getAssetLabel(contract)}</td>
          <td className="p-4 text-slate-600 text-xs whitespace-nowrap">
            <div>{contract.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'}</div>
            <div className="text-[11px] text-slate-400">s/d</div>
            <div>{contract.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : (isEmergency ? 'Pasca-Checkout' : '-')}</div>
          </td>
          <td className="p-4 text-center whitespace-nowrap">
            <StatusBadge status={contract.status} />
          </td>
          <td className="p-4 text-center whitespace-nowrap">
            <div className="flex justify-center items-center">
              {isEmergency ? (
                <button
                  type="button"
                  onClick={() => setPreviewPksContract(contract)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Lihat Dokumen Kontrak Darurat"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail PKS</span>
                </button>
              ) : (
                <Link
                  href={`/dinas/kontrak/${contract.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Lihat Detail Kontrak & PKS"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail PKS</span>
                </Link>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Kontrak &amp; PKS <span className="text-[15px] font-light text-[#777] ml-2">Dinas Perhubungan Kab. Mimika</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Dinas</span> / <span className="ml-1 font-medium">Kontrak</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50 flex-wrap gap-2">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Kontrak Sewa &amp; PKS Payung ({contracts.length})</h3>
          
          <Link
            href="/dinas/kontrak/darurat"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#dd4b39] hover:bg-[#d73925] text-white text-xs font-bold rounded-none shadow-2xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Buat Kontrak Darurat
          </Link>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                <th className="py-3 px-4 font-bold whitespace-nowrap">Nomor Kontrak</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Tipe</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Tenant</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Aset</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Masa Berlaku</th>
                <th className="py-3 px-4 font-bold text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-bold text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview & Cetak Surat PKS Darurat A4 */}
      {previewPksContract && (
        <SuratPKSDaruratModal
          contract={previewPksContract}
          onClose={() => setPreviewPksContract(null)}
        />
      )}
    </div>
  );
}

