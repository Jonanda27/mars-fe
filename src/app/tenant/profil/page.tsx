"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { tenantService } from '@/services/tenantService';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Upload, FileCheck, CheckCircle2, AlertCircle, CreditCard, AlertTriangle, Clock, XCircle, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilLegalitasPage() {
  const { user, syncUser } = useAuthStore();
  const [tenantData, setTenantData] = useState<any>(null);
  const actualStatus = tenantData?.status_verifikasi || user?.status_verifikasi;
  
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    nib: '',
    npwp: '',
    pic: '',
    nomor_telepon: '',
    email: '',
    alamat: ''
  });

  useEffect(() => {
    if (user?.tenant_id) {
      tenantService.getTenantById(user.tenant_id).then(data => {
        setTenantData(data);
        setEditForm({
          nib: data.nib || '',
          npwp: data.npwp || '',
          pic: data.pic || '',
          nomor_telepon: data.nomor_telepon || '',
          email: data.email || '',
          alamat: data.alamat || ''
        });
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.tenant_id) return;
    
    setIsSaving(true);
    try {
      const updatedData = await tenantService.updateProfile(user.tenant_id, editForm);
      setTenantData(updatedData);
      await syncUser();
      setIsEditModalOpen(false);
      toast.success('Data profil berhasil diperbarui!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui data profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.tenant_id) return;
    
    setIsUploading(docType);
    try {
      await tenantService.uploadLegalitas(user.tenant_id, docType, file);
      // Refresh data
      const updatedData = await tenantService.getTenantById(user.tenant_id);
      setTenantData(updatedData);
      await syncUser();
      toast.success('Dokumen berhasil diunggah!');
    } catch (err: any) {
      toast.error('Gagal mengunggah dokumen: ' + err.message);
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

      {/* Info Alert - Pending */}
      {actualStatus === 'Pending' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 text-[15px] mb-1">Menunggu Verifikasi (Pending)</h4>
              <p className="text-amber-700 text-[14px]">
                Profil Anda sedang dalam tahap peninjauan oleh Admin. Selama proses ini, Anda tidak dapat mengubah data profil.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Alert - Rejected */}
      {actualStatus === 'Rejected' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-red-800 text-[15px] mb-1">Verifikasi Ditolak (Rejected)</h4>
              <p className="text-red-700 text-[14px] leading-relaxed">
                Terdapat masalah pada profil atau dokumen legalitas Anda. Silakan periksa pesan penolakan di bawah dan perbarui data Anda. Mengunggah dokumen baru akan secara otomatis mengirim ulang permohonan Anda ke Admin.
              </p>
              
              {tenantData?.alasan_penolakan && (
                <div className="mt-4 bg-white border border-red-200 rounded-md p-4 shadow-sm relative">
                  <div className="absolute -top-2.5 left-3 bg-white px-2 text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Catatan dari Admin
                  </div>
                  <p className="text-[14px] text-gray-800 font-medium font-serif italic">
                    "{tenantData.alasan_penolakan}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {actualStatus === 'Verified' && (
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
                  {tenantData?.nama_perusahaan?.substring(0, 2) || 'TN'}
                </div>
                <h2 className="text-[22px] font-bold text-[#333]">{tenantData?.nama_perusahaan || 'Nama Perusahaan'}</h2>
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
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-[#f4f4f4] border border-[#d2d6de] text-[#444] text-[13px] px-4 py-2 hover:bg-[#e0e0e0] transition-colors shadow-sm"
                >
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
              {tenantData?.status_verifikasi === 'Verified' && (
                <span className="bg-[#00a65a] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                </span>
              )}
              {tenantData?.status_verifikasi === 'Pending' && (
                <span className="bg-[#f39c12] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Pending
                </span>
              )}
              {tenantData?.status_verifikasi === 'Rejected' && (
                <span className="bg-[#dd4b39] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
                  <XCircle className="w-3 h-3 mr-1" /> Rejected
                </span>
              )}
            </div>
            
            <div className="p-6">
                <p className="text-[13px] text-[#666] mb-6">
                Bandara Mozes Kilangin mewajibkan seluruh tenant untuk mengunggah dan memperbarui dokumen legalitas. Dokumen yang kedaluwarsa akan membuat akun Anda dibekukan sementara (suspend).
              </p>

              <div className="flex flex-col gap-4">
                <DocumentRow title="Nomor Induk Berusaha (NIB)" docType="nib" />
                <DocumentRow title="Nomor Pokok Wajib Pajak (NPWP)" docType="npwp" />
                <DocumentRow title="Akta Pendirian Perusahaan" docType="akta" />
                {tenantData?.jenis_tenant === 'Maskapai' && (<DocumentRow title="Air Operator Certificate (AOC) / Izin Usaha" docType="aoc" isWarning={true} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#00a65a] to-emerald-700 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center tracking-wide">
                <Building2 className="w-5 h-5 mr-3 text-emerald-100" /> 
                Lengkapi / Ubah Data Perusahaan
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto bg-slate-50">
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-blue-800">
                    Pastikan **NIB** dan **NPWP** diisi dengan benar sesuai dokumen. Mengubah data ini akan mengharuskan Admin melakukan pengecekan ulang (status kembali menjadi Pending).
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Induk Berusaha (NIB) <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                        value={editForm.nib} 
                        onChange={(e) => setEditForm({...editForm, nib: e.target.value})} 
                        placeholder="Masukkan nomor NIB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Pokok Wajib Pajak (NPWP) <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                        value={editForm.npwp} 
                        onChange={(e) => setEditForm({...editForm, npwp: e.target.value})} 
                        placeholder="Masukkan NPWP"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penanggung Jawab (PIC)</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                        value={editForm.pic} 
                        onChange={(e) => setEditForm({...editForm, pic: e.target.value})} 
                        placeholder="Nama PIC"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                        value={editForm.nomor_telepon} 
                        onChange={(e) => setEditForm({...editForm, nomor_telepon: e.target.value})} 
                        placeholder="Nomor Telepon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Utama</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                      value={editForm.email} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                      placeholder="Email Perusahaan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Perusahaan Lengkap</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a65a] text-sm" 
                      value={editForm.alamat} 
                      onChange={(e) => setEditForm({...editForm, alamat: e.target.value})} 
                      placeholder="Alamat kantor pusat..."
                    ></textarea>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-lg text-sm font-bold transition-colors flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Simpan Data</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
