"use client";

import React, { useEffect, useState } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { FileText, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function KontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await contractService.getContracts();
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <span className="bg-slate-100 text-slate-600 px-2 py-1 text-xs font-bold rounded flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> DRAFT</span>;
      case 'Menunggu TTD Tenant':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-bold rounded flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU TTD</span>;
      case 'Menunggu Verifikasi Admin':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-bold rounded flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> MENUNGGU VERIFIKASI</span>;
      case 'Approved':
      case 'Active':
      case 'Aktif':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">AKTIF</span>;
      case 'Expiring':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">AKAN HABIS</span>;
      case 'Expired':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">KEDALUWARSA</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold rounded w-fit">{status?.toUpperCase() || ''}</span>;
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Manajemen Kontrak <small className="text-[15px] font-light text-[#777] ml-2">Kelola draft, verifikasi TTD basah, dan status kontrak penyewa.</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Manajemen Kontrak</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Kontrak ({contracts.length})</h3>
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
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Memuat data kontrak...</td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Belum ada data kontrak.</td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-blue-600">{contract.contract_number}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.contract_type === 'Payung' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                        {contract.contract_type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{contract.tenants?.nama_perusahaan}</td>
                    <td className="p-4 text-slate-600">{contract.contract_type === 'Payung' ? 'Semua Aset (Payung)' : (contract.assets ? `${contract.assets.kode_aset}` : '-')}</td>
                    <td className="p-4 text-slate-600 text-xs">
                      {contract.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'} <br/> 
                      s/d <br/> 
                      {contract.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : '-'}
                    </td>
                    <td className="p-4">{getStatusBadge(contract.status)}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Link href={`/admin/kontrak/${contract.id}`}>
                          <button className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors text-xs font-semibold">
                            <Eye className="w-4 h-4 mr-1" /> Review
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
