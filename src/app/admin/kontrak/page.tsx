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
      case 'Review':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-bold rounded flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> REVIEW</span>;
      case 'Approved':
      case 'Active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">AKTIF</span>;
      case 'Expiring':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">AKAN HABIS</span>;
      case 'Expired':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">KEDALUWARSA</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold rounded w-fit">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Kontrak</h1>
          <p className="text-slate-500 text-sm">Kelola draft, persetujuan, dan status kontrak penyewa.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Daftar Kontrak ({contracts.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Nomor Kontrak</th>
                <th className="p-4 font-semibold">Tenant</th>
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Masa Berlaku</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Memuat data kontrak...</td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Belum ada data kontrak. Setujui permohonan terlebih dahulu untuk membuat draft kontrak.</td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-blue-600">{contract.contract_number}</td>
                    <td className="p-4 font-medium text-slate-800">{contract.tenants?.nama_perusahaan}</td>
                    <td className="p-4 text-slate-600">{contract.assets?.kode_aset} - {contract.assets?.nama_aset}</td>
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
