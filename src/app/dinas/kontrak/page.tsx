"use client";

import React, { useEffect, useState } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

function getAssetLabel(contract: Contract): string {
  if (contract.contract_type === 'Payung') {
    return 'Semua Aset (Payung)';
  }
  if (contract.assets?.kode_aset) {
    return `${contract.assets.kode_aset}`;
  }
  return '-';
}

export default function DinasKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchContracts = async () => {
      try {
        const data = await contractService.getContracts();
        if (isMounted) {
          setContracts(data);
        }
      } catch (error) {
        console.error('Failed to fetch contracts', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContracts();
    return () => {
      isMounted = false;
    };
  }, []);

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

    return contracts.map((contract) => (
      <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="p-4 font-mono font-medium text-blue-600">{contract.contract_number}</td>
        <td className="p-4">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.contract_type === 'Payung' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
            {contract.contract_type}
          </span>
        </td>
        <td className="p-4 font-medium text-slate-800">{contract.tenants?.nama_perusahaan}</td>
        <td className="p-4 text-slate-600">{getAssetLabel(contract)}</td>
        <td className="p-4 text-slate-600 text-xs">
          {contract.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'} <br/> 
          s/d <br/> 
          {contract.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : '-'}
        </td>
        <td className="p-4 text-center"><StatusBadge status={contract.status} /></td>
        <td className="p-4">
          <div className="flex justify-center">
            <Link href={`/dinas/kontrak/${contract.id}`}>
              <button type="button" className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors text-xs font-semibold cursor-pointer">
                <Eye className="w-4 h-4 mr-1" /> Review &amp; PKS
              </button>
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Kontrak &amp; PKS <small className="text-[15px] font-light text-[#777] ml-2">Manajemen Perjanjian Kerja Sama Sewa</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Dinas Portal</span> / <span className="ml-1 font-medium">Kontrak &amp; PKS</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Kontrak Sewa &amp; PKS Payung ({contracts.length})</h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                <th className="py-3 px-4 font-bold">Nomor Kontrak</th>
                <th className="py-3 px-4 font-bold">Tipe</th>
                <th className="py-3 px-4 font-bold">Tenant</th>
                <th className="py-3 px-4 font-bold">Aset</th>
                <th className="py-3 px-4 font-bold">Masa Berlaku</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
