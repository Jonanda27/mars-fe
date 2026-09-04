"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { FileText, Eye, CheckCircle2, Clock, AlertCircle, Loader2, X } from 'lucide-react';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

export default function TenantKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extension Modal States
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [newEndDate, setNewEndDate] = useState<string>('');
  const [isExtending, setIsExtending] = useState(false);

  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract || !newEndDate) return;
    
    setIsExtending(true);
    try {
      await contractService.extendContract(selectedContract.id!, newEndDate);
      alert('Pengajuan perpanjangan berhasil dibuat! Silakan cek menu Permohonan Anda.');
      setShowExtendModal(false);
      setSelectedContract(null);
      setNewEndDate('');
      fetchContracts();
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Gagal mengajukan perpanjangan.');
    } finally {
      setIsExtending(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await contractService.getTenantContracts();
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    switch (status) {
      case 'Draft':
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center w-max"><Clock className="w-3 h-3 mr-1" /> Draft UPBU</span>;
      case 'Review':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center w-max"><AlertCircle className="w-3 h-3 mr-1" /> Butuh Persetujuan Anda</span>;
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

  const hasExpiringContracts = contracts.some(c => c.status === 'Expiring');

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Kontrak Sewa <small className="text-[15px] text-[#777] ml-2 font-light">Daftar Kontrak Anda</small>
        </h1>
      </header>

      {hasExpiringContracts && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded shadow-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Peringatan: Ada Kontrak Akan Kedaluwarsa</h4>
            <p className="text-sm">Anda memiliki kontrak yang akan berakhir dalam kurang dari 30 hari. Harap segera hubungi Admin UPBU untuk proses perpanjangan agar operasional Anda tidak terganggu.</p>
          </div>
        </div>
      )}

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Daftar Kontrak Anda
          </h3>
        </div>
        
        <div className="p-4 bg-slate-50 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-slate-500 py-20">
            <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-500" /> 
            <span className="font-medium text-lg">Memuat data kontrak...</span>
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
            <FileText className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Belum Ada Kontrak</h3>
            <p className="text-sm mt-1">Anda belum memiliki kontrak sewa yang aktif atau sedang diproses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kontrak</div>
                    <div className="font-bold text-lg text-slate-800">{contract.contract_number || 'Belum Terbit'}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Ref: {contract.rental_applications?.application_number}</div>
                  </div>
                  <div>
                    {renderStatusBadge(contract.status)}
                  </div>
                </div>
                
                <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Aset yang Disewa</div>
                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 leading-tight">{contract.assets?.nama_aset}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5 font-medium">{contract.assets?.kode_aset}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periode Sewa</div>
                      <div className="font-medium text-slate-700 text-sm">
                        {contract.start_date ? dayjs(contract.start_date).format('DD MMM YYYY') : '-'} <br/>
                        <span className="text-slate-400 text-xs">s/d</span> <br/>
                        {contract.end_date ? dayjs(contract.end_date).format('DD MMM YYYY') : '-'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Nilai Dasar</div>
                      <div className="font-bold text-blue-700 text-lg">
                        {formatRupiah(contract.total_amount)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  {(contract.status === 'Active' || contract.status === 'Expiring') && (
                    <button 
                      onClick={() => {
                        setSelectedContract(contract);
                        // Default new end date is 1 month after current end date
                        const defaultEnd = dayjs(contract.end_date).add(1, 'month').format('YYYY-MM-DD');
                        setNewEndDate(defaultEnd);
                        setShowExtendModal(true);
                      }}
                      className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                      <Clock className="w-4 h-4 mr-2" /> 
                      Perpanjang
                    </button>
                  )}
                  <Link 
                    href={`/tenant/kontrak/${contract.id}`}
                    className="inline-flex items-center justify-center bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" /> 
                    {contract.status === 'Review' ? 'Tinjau & Validasi' : 'Lihat Detail PKS'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* EXTENSION MODAL */}
      {showExtendModal && selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-indigo-100" />
                <h3 className="font-bold text-lg tracking-wide">Perpanjang Masa Sewa</h3>
              </div>
              <button onClick={() => setShowExtendModal(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleExtendSubmit} className="p-6">
              <div className="mb-5 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kontrak Saat Ini</p>
                <p className="font-bold text-lg text-slate-800">{selectedContract.contract_number}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Berakhir Pada</p>
                  <p className="font-bold text-slate-700 text-[15px]">{dayjs(selectedContract.end_date).format('DD MMM YYYY')}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Mulai Ekstensi</p>
                  <p className="font-bold text-indigo-700 text-[15px]">{dayjs(selectedContract.end_date).add(1, 'day').format('DD MMM YYYY')}</p>
                </div>
              </div>

              <div className="mb-6 relative">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Pilih Tanggal Berakhir Baru (New End Date)</label>
                <input 
                  type="date" 
                  required
                  min={dayjs(selectedContract.end_date).add(2, 'day').format('YYYY-MM-DD')}
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 cursor-pointer"
                />
                
                {newEndDate && (
                  <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Total Durasi Perpanjangan</p>
                      <p className="text-sm text-green-700">Akan diperpanjang hingga {dayjs(newEndDate).format('DD MMM YYYY')}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 font-bold px-3 py-1.5 rounded-lg text-lg border border-green-200 shadow-sm">
                      {Math.max(0, dayjs(newEndDate).diff(dayjs(selectedContract.end_date).add(1, 'day'), 'day'))} Malam
                    </div>
                  </div>
                )}
                
                <p className="text-[12px] text-slate-500 mt-3 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  Permohonan ini akan diteruskan ke Admin UPBU untuk ditinjau ulang sebelum SKRD baru diterbitkan.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowExtendModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isExtending || !newEndDate}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-indigo-200"
                >
                  {isExtending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</> : 'Ajukan Perpanjangan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
