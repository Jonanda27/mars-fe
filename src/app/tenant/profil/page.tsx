"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { tenantService } from '@/services/tenantService';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Upload, FileCheck, CheckCircle2, AlertCircle, CreditCard, AlertTriangle } from 'lucide-react';

export default function ProfilLegalitasPage() {
  const { user } = useAuthStore();
  const isPending = user?.status_verifikasi === 'Pending';
  const [tenantData, setTenantData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.tenant_id) {
      tenantService.getTenantById(user.tenant_id).then(data => {
        setTenantData(data);
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.tenant_id) return;
    
    setIsUploading(docType);
    try {
      await tenantService.uploadLegalitas(user.tenant_id, docType, file);
      // Refresh data
      const updatedData = await tenantService.getTenantById(user.tenant_id);
      setTenantData(updatedData);
      alert('Dokumen berhasil diunggah!');
    } catch (err: any) {
      alert('Gagal mengunggah dokumen: ' + err.message);
    } finally {
      setIsUploading(null);
    }
  };

  const getDocStatus = (docType: string) => {
    return tenantData?.legalitas?.[docType] ? true : false;
  };

  const DocumentRow = ({ title, docType, isWarning = false }: { title: string, docType: string, isWarning?: boolean }) => {
    const isUploaded = getDocStatus(docType);
    const borderColor = isWarning && !isUploaded ? 'border-[#f39c12]' : 'border-[#d2d6de]';
    const bgColor = isWarning && !isUploaded ? 'bg-[#f39c12]/5' : 'bg-slate-50';

    return (
      <div className={`border ${borderColor} p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${bgColor} hover:border-[#00a65a] transition-colors relative overflow-hidden`}>
        {isWarning && !isUploaded && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f39c12]"></div>}
        <div className="flex items-start">
          {isWarning && !isUploaded ? (
            <AlertCircle className="w-8 h-8 mr-3 text-[#f39c12]" />
          ) : (
            <FileCheck className={`w-8 h-8 mr-3 ${isUploaded ? 'text-[#00a65a]' : 'text-[#3c8dbc] opacity-70'}`} />
          )}
          <div>
            <h4 className="font-bold text-[#333] text-[15px]">{title}</h4>
            <p className="text-[12px] text-[#777]">
              {isUploaded ? 'Telah diunggah' : 'Belum diunggah'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {isUploaded ? (
            <span className="bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 font-bold text-[10px] px-2 py-1 uppercase tracking-wider">
              Tersedia
            </span>
          ) : (
            <span className="bg-[#f39c12]/10 text-[#f39c12] border border-[#f39c12]/20 font-bold text-[10px] px-2 py-1 uppercase tracking-wider">
              Kosong
            </span>
          )}
          <label className="bg-white border border-[#d2d6de] text-[#444] px-3 py-1.5 text-[12px] hover:bg-[#f4f4f4] flex items-center shadow-sm cursor-pointer">
            {isUploading === docType ? 'Mengunggah...' : <><Upload className="w-3 h-3 mr-1" /> {isUploaded ? 'Perbarui' : 'Unggah'}</>}
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={(e) => handleFileUpload(e, docType)} 
              disabled={isUploading === docType}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Profil & Legalitas Perusahaan
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Tenant Portal</span> / <span className="ml-1 font-medium">Profil</span>
        </div>
      </header>

      {/* Info Alert */}
      {isPending ? (
        <div className="bg-[#f39c12] text-white p-3 shadow-sm flex items-start text-[14px]">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Status: Menunggu Verifikasi (Pending)</h4>
            <p>Akun Anda sedang dalam peninjauan oleh Admin. Anda belum dapat mengakses fitur permohonan penyewaan fasilitas hingga akun ini diverifikasi. Harap lengkapi profil dan legalitas perusahaan Anda.</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#00a65a] text-white p-3 shadow-sm flex items-start text-[14px]">
          <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Status: Terverifikasi (Good Standing)</h4>
            <p>Seluruh dokumen legalitas perusahaan Anda berstatus valid dan aktif. Anda diizinkan untuk melakukan permohonan penyewaan fasilitas dan aktivitas operasional di bandara.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        
        {/* Kolom Kiri: Profil Identitas */}
        <div className="flex-1 lg:w-[40%] flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm flex-1">
            <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
              <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-[#00a65a]" /> Identitas Perusahaan
              </h3>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center mb-6 border-b border-[#f4f4f4] pb-6">
                <div className="w-24 h-24 bg-[#00a65a] text-white rounded-full flex items-center justify-center mb-4 text-3xl font-bold shadow-md uppercase">
                  {user?.username?.substring(0, 2) || 'TN'}
                </div>
                <h2 className="text-[22px] font-bold text-[#333]">{user?.username || 'Nama Perusahaan'}</h2>
                <p className="text-[14px] text-[#777]">Mitra Operasional Bandara</p>
                <div className="mt-2 bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 px-3 py-1 text-[12px] font-bold">
                  Tenant ID: {user?.tenant_id_str ? user.tenant_id_str : 'Menunggu Verifikasi'}
                </div>
              </div>

              <ul className="text-[14px] text-[#555] flex flex-col gap-0">
                <li className="flex items-start py-3 border-b border-[#f4f4f4]">
                  <MapPin className="w-4 h-4 mr-3 text-[#00a65a] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-[#333] block mb-1">Alamat Kantor Pusat</span>
                    {tenantData?.alamat || 'Belum diatur'}
                  </div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-[#f4f4f4]">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-[#00a65a]" />
                    <span className="font-bold text-[#333]">Telepon / PIC</span>
                  </div>
                  <span>{tenantData?.nomor_telepon || '-'} ({tenantData?.pic || '-'})</span>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-[#f4f4f4]">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-[#00a65a]" />
                    <span className="font-bold text-[#333]">Email Resmi</span>
                  </div>
                  <span>{tenantData?.email || '-'}</span>
                </li>
                <li className="flex items-start py-3 border-b border-[#f4f4f4] bg-slate-50 -mx-6 px-6 mt-3">
                  <CreditCard className="w-4 h-4 mr-3 text-[#3c8dbc] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-[#333] block mb-1">Rekening Pembayaran Utama</span>
                    {tenantData?.informasi_bank ? (
                      `${tenantData.informasi_bank.nama_bank || ''} - ${tenantData.informasi_bank.nomor_rekening || ''} (a.n ${tenantData.informasi_bank.atas_nama || ''})`
                    ) : (
                      'Belum diatur'
                    )}
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-[#f4f4f4] border border-[#d2d6de] text-[#444] text-[13px] px-4 py-2 hover:bg-[#e0e0e0] transition-colors shadow-sm">
                  Ajukan Perubahan Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Dokumen Legalitas */}
        <div className="flex-1 lg:w-[60%] flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm flex-1">
            <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
              <h3 className="text-[16px] text-[#444] font-bold flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-[#00a65a]" /> Manajemen Dokumen Legal
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-[13px] text-[#666] mb-6">
                Bandara Mozes Kilangin mewajibkan seluruh tenant untuk mengunggah dan memperbarui dokumen legalitas. Dokumen yang kedaluwarsa akan membuat akun Anda dibekukan sementara (suspend).
              </p>

              <div className="flex flex-col gap-4">
                <DocumentRow title="Nomor Induk Berusaha (NIB)" docType="nib" />
                <DocumentRow title="Nomor Pokok Wajib Pajak (NPWP)" docType="npwp" />
                <DocumentRow title="Akta Pendirian Perusahaan" docType="akta" />
                <DocumentRow title="Air Operator Certificate (AOC) / Izin Usaha" docType="aoc" isWarning={true} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
