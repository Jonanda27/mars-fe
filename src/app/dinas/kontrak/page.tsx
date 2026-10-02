"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { Eye, ShieldAlert, FileText, Printer } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';
import { CreateEmergencyPksModal } from './components/CreateEmergencyPksModal';
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

export default function DinasKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
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

  const handleEmergencyCreated = (newContract: Contract) => {
    fetchContracts();
    if (newContract) {
      setPreviewPksContract(newContract);
    }
  };

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
          <td className="p-4 font-mono font-medium text-blue-600">
            {contract.contract_number}
          </td>
          <td className="p-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${
              contract.contract_type === 'PKS Payung Mini Airport' || Boolean(contract.contract_number?.startsWith('PKS-PAYUNG/')) ? 'bg-sky-100 text-sky-800 border border-sky-200' :
              contract.contract_type === 'Payung' || contract.contract_type === 'PKS Payung Mozes Kilangin' ? 'bg-purple-100 text-purple-700' : 
              isEmergency ? 'bg-red-100 text-red-700 border border-red-200' :
              'bg-teal-100 text-teal-700'
            }`}>
              {contract.contract_type === 'PKS Payung Mini Airport' ? 'PKS Payung (Mini Airport)' : isEmergency ? 'Pendaratan Darurat' : contract.contract_type}
            </span>
          </td>
          <td className="p-4 font-medium text-slate-800">
            {contract.tenants?.nama_perusahaan}
            {isEmergency && contract.tenants?.pic && (
              <span className="block text-[11px] font-normal text-slate-500">PIC: {contract.tenants.pic}</span>
            )}
          </td>
          <td className="p-4 text-slate-600">{getAssetLabel(contract)}</td>
          <td className="p-4 text-slate-600 text-xs">
            {contract.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'} <br/> 
            s/d <br/> 
            {contract.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : (isEmergency ? 'Pasca-Checkout' : '-')}
          </td>
          <td className="p-4 text-center"><StatusBadge status={contract.status} /></td>
          <td className="p-4">
            <div className="flex justify-center items-center gap-2">
              {isEmergency ? (
                <button
                  type="button"
                  onClick={() => setPreviewPksContract(contract)}
                  className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 border border-red-200 transition-colors text-xs font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Lihat Kontrak Darurat
                </button>
              ) : (
                <Link href={`/dinas/kontrak/${contract.id}`}>
                  <button type="button" className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors text-xs font-semibold cursor-pointer">
                    <Eye className="w-4 h-4 mr-1" /> Review &amp; PKS
                  </button>
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
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333]">
            Kontrak &amp; PKS <small className="text-[15px] font-light text-[#777] ml-2">Manajemen Perjanjian Kerja Sama Sewa</small>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Dinas Portal</span> / <span className="ml-1 font-medium">Kontrak &amp; PKS</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50 flex-wrap gap-2">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Kontrak Sewa &amp; PKS Payung ({contracts.length})</h3>
          
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#dd4b39] hover:bg-[#d73925] text-white text-xs font-bold rounded-none shadow-2xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Buat Kontrak Darurat
          </button>
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

      {/* Modal Buat PKS Darurat Baru */}
      <CreateEmergencyPksModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSuccess={handleEmergencyCreated}
      />

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

