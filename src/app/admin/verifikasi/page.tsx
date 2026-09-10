"use client";

import React, { useEffect, useState } from 'react';
import { tenantService } from '@/services/tenantService';
import { getBaseUrl } from '@/services/api';
import { Tenant } from '@/types/tenant';
import { ShieldCheck, XCircle, Clock, Search, ExternalLink, X, FileText, User, MapPin, Building2, Phone, Mail, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function VerifikasiTenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin' || user?.role?.toLowerCase() === 'admin'; // admin can now verify too

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Using getBaseUrl from api.ts (imported above)

  const getFileUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${getBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTenantId, setRejectTenantId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantService.getTenants();
      setTenants(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data tenant');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const isDokumenLengkap = (tenant: Tenant | null) => {
    if (!tenant || !tenant.legalitas) return false;
    const reqDocs = ['nib', 'npwp', 'akta'];
    if (tenant.jenis_tenant === 'Maskapai') {
      reqDocs.push('aoc');
    }
    return reqDocs.every(doc => Object.keys(tenant.legalitas!).includes(doc));
  };

  const handleVerify = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin memverifikasi tenant ini?')) {
      try {
        await tenantService.verifyTenant(id, 'Verified');
        fetchTenants();
      } catch (err: any) {
        toast.error(err.message || 'Gagal memverifikasi tenant');
      }
    }
  };

  const handleReject = async (id: number) => {
    setRejectTenantId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };
  
  const submitReject = async () => {
    if (!rejectTenantId) return;
    if (!rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }
    
    try {
      await tenantService.verifyTenant(rejectTenantId, 'Rejected', rejectReason);
      fetchTenants();
      setShowRejectModal(false);
      setRejectTenantId(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menolak tenant');
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Verifikasi Tenant <small className="text-[15px] font-light text-[#777] ml-2">Manajemen pendaftar</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Verifikasi Tenant</span>
        </div>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Daftar Pendaftar Tenant</h3>
          <div className="flex gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari perusahaan..." 
                className="border border-[#d2d6de] px-3 py-1 text-sm focus:outline-none focus:border-[#3c8dbc]"
              />
              <Search className="w-4 h-4 absolute right-2 top-1.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                  <th className="py-3 px-4 font-bold">Tgl. Daftar</th>
                  <th className="py-3 px-4 font-bold">Perusahaan</th>
                  <th className="py-3 px-4 font-bold">NIB / NPWP</th>
                  <th className="py-3 px-4 font-bold">PIC & Kontak</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tenants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Belum ada data pendaftar.
                    </td>
                  </tr>
                ) : (
                  tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-4 whitespace-nowrap">
                        {new Date(tenant.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#333]">
                        {tenant.nama_perusahaan}
                        {tenant.tenant_id_str && (
                          <span className="block text-[11px] text-[#3c8dbc] mt-1 font-bold">
                            ID: {tenant.tenant_id_str}
                          </span>
                        )}
                        {tenant.legalitas && Object.keys(tenant.legalitas).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(tenant.legalitas).map(([docType, path]) => (
                              <a 
                                key={docType} 
                                href={getFileUrl(path as string)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-[#f4f4f4] text-[#444] text-[10px] px-1.5 py-0.5 border border-[#d2d6de] hover:bg-[#e0e0e0] uppercase"
                                title={`Lihat ${docType}`}
                              >
                                {docType}
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="block text-xs">NIB: {tenant.nib || '-'}</span>
                        <span className="block text-xs">NPWP: {tenant.npwp || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="block font-medium">{tenant.pic || '-'}</span>
                        <span className="block text-xs text-gray-500">{tenant.email || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        {tenant.status_verifikasi === 'Pending' && (
                          <span className="bg-[#f39c12] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center w-max">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                        {tenant.status_verifikasi === 'Verified' && (
                          <span className="bg-[#00a65a] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center w-max">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                        {tenant.status_verifikasi === 'Rejected' && (
                          <span className="bg-[#dd4b39] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center w-max">
                            <XCircle className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {tenant.status_verifikasi === 'Pending' ? (
                          <div className="flex items-center justify-center gap-1">
                            {isSuperAdmin && (
                              <>
                                <button 
                                  onClick={() => handleVerify(tenant.id)}
                                  disabled={!isDokumenLengkap(tenant)}
                                  className={`${isDokumenLengkap(tenant) ? 'bg-[#00a65a] hover:bg-[#008d4c]' : 'bg-gray-400 cursor-not-allowed opacity-50'} text-white text-[12px] px-2 py-1 transition-colors shadow-sm`}
                                  title={isDokumenLengkap(tenant) ? "Verifikasi" : "Dokumen Belum Lengkap"}
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleReject(tenant.id)}
                                  className="bg-[#dd4b39] hover:bg-[#d73925] text-white text-[12px] px-2 py-1 transition-colors shadow-sm"
                                  title="Tolak"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => { setSelectedTenant(tenant); setShowDetailModal(true); }}
                              className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-[12px] px-2 py-1 transition-colors shadow-sm"
                              title="Lihat Dokumen"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setSelectedTenant(tenant); setShowDetailModal(true); }}
                            className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-[12px] px-3 py-1 transition-colors shadow-sm"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Detail Tenant */}
      {showDetailModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-[#3c8dbc] p-4 flex justify-between items-center text-white rounded-t-xl">
              <div>
                <h3 className="font-bold text-lg flex items-center">
                  <Building2 className="w-5 h-5 mr-3 text-white/90" /> 
                  Detail Profil Mitra (Tenant)
                </h3>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="text-white/80 hover:text-white p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body Modal */}
            <div className="p-6 overflow-y-auto bg-[#f9fafb]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Kolom Kiri */}
                <div className="space-y-6">
                  {/* Informasi Perusahaan */}
                  <div className="bg-white p-5 shadow-sm border border-gray-200">
                    <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" /> Informasi Perusahaan
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[12px] text-gray-500 mb-0.5">Nama Perusahaan</p>
                        <p className="font-bold text-gray-800 text-[14px]">{selectedTenant.nama_perusahaan}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">ID Tenant</p>
                          <p className="font-bold text-gray-800 text-[14px]">{selectedTenant.tenant_id_str || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">NIB</p>
                          <p className="font-bold text-gray-800 text-[14px]">{selectedTenant.nib || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] text-gray-500 mb-0.5">NPWP</p>
                        <p className="font-bold text-gray-800 text-[14px]">{selectedTenant.npwp || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Kontak & Alamat */}
                  <div className="bg-white p-5 shadow-sm border border-gray-200">
                    <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" /> Kontak & Alamat
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">Penanggung Jawab (PIC)</p>
                          <p className="font-bold text-gray-800 text-[13px]">{selectedTenant.pic || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">Nomor Telepon</p>
                          <p className="font-bold text-gray-800 text-[13px]">{selectedTenant.nomor_telepon || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">Email Utama</p>
                          <p className="font-bold text-gray-800 text-[13px]">{selectedTenant.email || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-[12px] text-gray-500 mb-0.5">Alamat Perusahaan</p>
                          <p className="font-bold text-gray-800 text-[13px] leading-relaxed">{selectedTenant.alamat || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="h-full">
                  <div className="bg-white p-5 shadow-sm border border-gray-200 h-full flex flex-col">
                    <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" /> Dokumen Legalitas
                    </h4>
                    
                    <div className="flex-1">
                      {selectedTenant.legalitas && Object.keys(selectedTenant.legalitas).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(selectedTenant.legalitas).map(([docType, path]) => (
                            <a 
                              key={docType}
                              href={getFileUrl(path as string)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50 transition-all group"
                            >
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-400 mr-3 group-hover:text-[#3c8dbc]" />
                                <div>
                                  <span className="font-bold text-sm text-gray-700 uppercase">{docType}</span>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#3c8dbc]" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 border border-dashed border-gray-200 h-48">
                          <FileText className="w-10 h-10 mb-2 opacity-30" />
                          <p className="text-sm">Belum ada dokumen yang diunggah</p>
                        </div>
                      )}
                    </div>

                    {selectedTenant.status_verifikasi === 'Pending' && isSuperAdmin && (
                      <div className="mt-6 pt-5 border-t border-gray-200">
                        {isDokumenLengkap(selectedTenant) ? (
                          <>
                            <p className="text-xs text-center text-gray-500 mb-3">Tentukan status verifikasi dokumen ini:</p>
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => { handleVerify(selectedTenant.id); setShowDetailModal(false); }}
                                className="flex-1 bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 text-sm font-bold flex items-center justify-center transition-colors"
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" /> Setujui
                              </button>
                              <button 
                                onClick={() => { handleReject(selectedTenant.id); setShowDetailModal(false); }}
                                className="flex-1 bg-[#dd4b39] hover:bg-[#d73925] text-white px-4 py-2 text-sm font-bold flex items-center justify-center transition-colors"
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Tolak
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 p-3 flex items-start">
                            <Clock className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-yellow-800">Menunggu Kelengkapan</p>
                              <p className="text-[11px] text-yellow-700 mt-1">Tenant belum melengkapi dokumen wajib (NIB, NPWP, Akta).</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#dd4b39] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alasan Penolakan
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tuliskan alasan spesifik (Wajib)
              </label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[120px] focus:outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
                placeholder="Contoh: Dokumen NIB buram, harap upload ulang dengan resolusi lebih tinggi."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                autoFocus
              ></textarea>
              <p className="text-[11px] text-gray-500 mt-2">
                Pesan ini akan ditampilkan kepada Tenant di halaman profil mereka.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={submitReject}
                className="px-4 py-2 bg-[#dd4b39] hover:bg-[#d73925] text-white text-sm font-bold rounded-lg transition-colors"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
