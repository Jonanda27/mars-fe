"use client";

import React, { useEffect, useState, useRef } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { Loader2, AlertCircle, FileText, Upload, CheckCircle, X, Download } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';
import ContractPDFViewer from '@/components/ContractPDFViewer';
import toast from 'react-hot-toast';

dayjs.locale('id');

export default function TenantKontrakPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Payung' | 'Sewa'>('Payung');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contractToUpload, setContractToUpload] = useState<Contract | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const payungContracts = contracts.filter(c => c.contract_type === 'Payung');
  const sewaContracts = contracts.filter(c => c.contract_type === 'Sewa');

  const handleOpenUploadModal = (contract: Contract) => {
    setContractToUpload(contract);
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!contractToUpload || !contractToUpload.id || !selectedFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('signature_file', selectedFile);

    try {
      await contractService.uploadSignature(contractToUpload.id, formData);
      setIsUploadModalOpen(false);
      setContractToUpload(null);
      setSelectedFile(null);
      await fetchContracts();
      toast.success('Dokumen berhasil diunggah. Menunggu verifikasi Admin.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah dokumen');
    } finally {
      setIsUploading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
      case 'Active':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Aktif</span>;
      case 'Menunggu TTD Tenant':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Menunggu Tanda Tangan Anda</span>;
      case 'Menunggu Verifikasi Admin':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Menunggu Verifikasi Admin</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const renderContractList = (list: Contract[]) => {
    if (list.length === 0) {
      return (
        <div className="border shadow-sm p-8 text-center rounded bg-white mt-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Tidak ada kontrak</h2>
          <p className="text-gray-500 text-sm">
            Belum ada {activeTab === 'Payung' ? 'Kontrak Payung' : 'Kontrak Sewa'} yang diterbitkan.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 mt-4">
        {list.map(contract => (
          <div key={contract.id} className="bg-white border rounded shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-lg">{contract.contract_number}</h3>
                {renderStatusBadge(contract.status || '')}
              </div>
              <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-8 gap-y-1">
                <p><strong>Periode:</strong> {dayjs(contract.start_date).format('DD MMM YYYY')} - {dayjs(contract.end_date).format('DD MMM YYYY')}</p>
                <p><strong>Pemanfaatan:</strong> {contract.jenis_pemanfaatan}</p>
                {contract.total_amount && <p><strong>Total:</strong> {formatRupiah(contract.total_amount)}</p>}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 min-w-[160px]">
              {contract.status === 'Menunggu TTD Tenant' && (
                <>
                  <button 
                    onClick={() => setSelectedContract(contract)}
                    className="w-full text-center px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Unduh Draft (PDF)
                  </button>
                  <button 
                    onClick={() => handleOpenUploadModal(contract)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload TTD Basah
                  </button>
                </>
              )}
              {contract.status === 'Menunggu Verifikasi Admin' && (
                <div className="text-center p-2 border border-blue-100 bg-blue-50 rounded text-sm text-blue-700 flex flex-col items-center">
                   <CheckCircle className="w-5 h-5 mb-1" />
                   Sedang Diverifikasi
                </div>
              )}
              {(contract.status === 'Aktif' || contract.status === 'Active') && (
                <button 
                  onClick={() => setSelectedContract(contract)}
                  className="w-full text-center px-4 py-2 bg-gray-800 text-white rounded text-sm font-medium hover:bg-gray-900 transition"
                >
                  Lihat Dokumen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#333333' }} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Manajemen Kontrak <small className="text-[15px] text-[#777] ml-2 font-light">Dokumen & Pemanfaatan</small>
        </h1>
      </header>
      
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        {/* Tabs */}
        <div className="flex border-b border-[#f4f4f4] bg-slate-50">
          <button
            className={`py-3 px-6 font-bold text-sm border-b-[3px] transition-colors ${
              activeTab === 'Payung' 
                ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('Payung')}
          >
            Kontrak Payung
          </button>
          <button
            className={`py-3 px-6 font-bold text-sm border-b-[3px] transition-colors ${
              activeTab === 'Sewa' 
                ? 'border-[#3c8dbc] text-[#3c8dbc] bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('Sewa')}
          >
            Kontrak Sewa
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'Payung' ? (
            payungContracts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {payungContracts[0].status === 'Menunggu TTD Tenant' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex flex-col md:flex-row justify-between items-start md:items-center rounded-r gap-4">
                    <div>
                      <h3 className="font-bold text-yellow-800">Menunggu Tanda Tangan</h3>
                      <p className="text-yellow-700 text-sm mt-1">
                        Silakan unduh dokumen kontrak di bawah, cetak, beri <strong>tanda tangan basah dan meterai</strong>, kemudian <em>scan</em> dan unggah kembali dokumen tersebut.
                      </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                      <button 
                        onClick={() => document.getElementById('download-pdf-btn')?.click()} 
                        className="bg-slate-800 flex-1 md:flex-none justify-center text-white font-bold px-4 py-2.5 rounded-none text-sm hover:bg-slate-900 transition flex items-center shadow-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Unduh PDF
                      </button>
                      <button 
                        onClick={() => handleOpenUploadModal(payungContracts[0])} 
                        className="bg-blue-600 flex-1 md:flex-none justify-center text-white font-bold px-4 py-2.5 rounded-none text-sm hover:bg-blue-700 transition flex items-center shadow-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload TTD Basah
                      </button>
                    </div>
                  </div>
                )}
                {payungContracts[0].status === 'Menunggu Verifikasi Admin' && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex justify-between items-center rounded-r">
                    <div>
                      <h3 className="font-bold text-blue-800">Verifikasi Berkas</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Dokumen tertanda tangan telah berhasil diunggah dan saat ini sedang menunggu proses verifikasi oleh Admin.
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Sedang Diproses
                    </div>
                  </div>
                )}
                <ContractPDFViewer contract={payungContracts[0]} onClose={() => {}} isInline={true} />
              </div>
            ) : renderContractList(payungContracts)
          ) : renderContractList(sewaContracts)}
        </div>
      </div>

      {/* Contract PDF Viewer Modal Overlay (for Sewa Contracts) */}
      {selectedContract && activeTab === 'Sewa' && (
        <ContractPDFViewer 
          contract={selectedContract} 
          onClose={() => setSelectedContract(null)} 
        />
      )}

      {/* Upload Signature Modal */}
      {isUploadModalOpen && contractToUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white tracking-wide">Upload TTD Basah</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 mb-6">
                <Upload className="w-6 h-6 flex-shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm leading-relaxed">
                    Unggah dokumen PDF Kontrak <strong className="text-blue-900">({contractToUpload.contract_number})</strong> yang sudah dicetak, ditandatangani basah, dan di-scan.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-3">Pilih Dokumen PDF <span className="text-red-500">*</span></label>
                <div className="border-2 border-slate-200 border-dashed rounded-xl p-6 text-center hover:bg-slate-50 transition-colors group">
                  <input 
                    type="file" 
                    id="file-upload-modal"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload-modal" className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-blue-600 hover:text-blue-700 mb-1">Pilih File PDF</span>
                    <span className="text-xs text-slate-500">Maksimal ukuran file 5MB</span>
                  </label>
                  
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-bold flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors border border-transparent hover:border-slate-300"
                disabled={isUploading}
              >
                Batal
              </button>
              <button 
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
              >
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {isUploading ? 'Mengunggah...' : 'Unggah Dokumen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
