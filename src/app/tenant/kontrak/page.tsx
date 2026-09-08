"use client";

import React, { useEffect, useState, useRef } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { Loader2, AlertCircle, FileText, Upload, CheckCircle, X } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';
import ContractPDFViewer from '@/components/ContractPDFViewer';

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
      alert('Dokumen berhasil diunggah. Menunggu verifikasi Admin.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal mengunggah dokumen');
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
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Kontrak</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'Payung' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('Payung')}
        >
          Kontrak Payung
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'Sewa' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('Sewa')}
        >
          Kontrak Sewa
        </button>
      </div>

      {activeTab === 'Payung' ? renderContractList(payungContracts) : renderContractList(sewaContracts)}

      {/* Contract PDF Viewer Modal Overlay */}
      {selectedContract && (
        <ContractPDFViewer 
          contract={selectedContract} 
          onClose={() => setSelectedContract(null)} 
        />
      )}

      {/* Upload Signature Modal */}
      {isUploadModalOpen && contractToUpload && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Upload Dokumen Tertanda Tangan</h3>
            <p className="text-sm text-gray-600 mb-6">
              Silakan unggah dokumen PDF Kontrak ({contractToUpload.contract_number}) yang sudah dicetak, ditandatangani basah, dan di-scan.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File PDF</label>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                disabled={isUploading}
              >
                Batal
              </button>
              <button 
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
