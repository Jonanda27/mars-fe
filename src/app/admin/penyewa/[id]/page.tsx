"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, FileText, Landmark, TrendingDown, TrendingUp, AlertTriangle, 
  CheckCircle2, XCircle, ArrowLeft, ShieldCheck, Lock, Loader2, Download
} from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah } from '@/utils/formatCurrency';

export default function AdminPenyewaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const fetchTenant = async () => {
    try {
      const data = await tenantService.getTenantById(Number(id));
      setTenant(data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil data penyewa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (status: 'Verified' | 'Suspended') => {
    if (!tenant) return;
    if (!confirm(`Apakah Anda yakin ingin mengatur status penyewa menjadi ${status}?`)) return;

    try {
      setIsUpdating(true);
      await tenantService.verifyTenant(tenant.id, status);
      alert(`Penyewa berhasil di-${status}`);
      fetchTenant(); // Refresh
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal memverifikasi penyewa.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-4 text-center mt-20">
        <h2 className="text-xl font-bold text-gray-700">Penyewa tidak ditemukan</h2>
        <Link href="/admin/penyewa" className="text-blue-500 hover:underline mt-2 inline-block">
          Kembali ke Daftar Penyewa
        </Link>
      </div>
    );
  }

  // Wajib validasi
  const legal = tenant.legalitas || {};
  const isComplete = Boolean(legal.akta && legal.nib && legal.npwp && legal.izin_usaha && legal.izin_operasional);

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-center">
            Detail Penyewa <small className="text-[15px] text-[#777] ml-2 font-light">{tenant.tenant_id_str || '(Pending ID)'}</small>
          </h1>
        </div>
        <Link 
          href="/admin/penyewa"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm flex items-center text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm rounded-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500 mr-2">Status Verifikasi:</span>
          {tenant.status_verifikasi === 'Verified' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED</span>}
          {tenant.status_verifikasi === 'Pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> PENDING</span>}
          {tenant.status_verifikasi === 'Suspended' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><Lock className="w-3 h-3 mr-1" /> SUSPENDED</span>}
        </div>
        
        <div className="flex gap-2">
          {!isComplete && tenant.status_verifikasi !== 'Verified' && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-center mr-2 border border-red-100">
              <AlertTriangle className="w-4 h-4 mr-1" /> Dokumen Legalitas Belum Lengkap.
            </div>
          )}
          
          {isSuperAdmin && (
            <>
              <button
                onClick={() => handleVerify('Verified')}
                disabled={isUpdating || tenant.status_verifikasi === 'Verified'}
                className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Approve & Verify
              </button>
              
              <button
                onClick={() => handleVerify('Suspended')}
                disabled={isUpdating || tenant.status_verifikasi === 'Suspended'}
                className="bg-[#dd4b39] hover:bg-[#d73925] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center disabled:opacity-50"
              >
                <Lock className="w-4 h-4 mr-2" /> Suspend Account
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Identitas */}
        <div className="bg-white shadow-sm rounded-sm border-t-[3px] border-[#f39c12]">
          <div className="p-3 border-b border-[#f4f4f4]">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-slate-500" /> Identitas Perusahaan
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Nama Perusahaan</div>
              <div className="font-bold text-slate-800 text-lg">{tenant.nama_perusahaan}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Tenant ID</div>
              <div className="font-medium text-slate-800">{tenant.tenant_id_str || '-'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">NIB</div>
              <div className="font-medium text-slate-800">{tenant.nib || '-'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">NPWP</div>
              <div className="font-medium text-slate-800">{tenant.npwp || '-'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Tgl Daftar</div>
              <div className="font-medium text-slate-800">{new Date(tenant.created_at).toLocaleDateString('id-ID')}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Alamat Lengkap</div>
              <div className="font-medium text-slate-800">{tenant.alamat || '-'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">PIC (Penanggung Jawab)</div>
              <div className="font-medium text-slate-800">{tenant.pic || '-'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Kontak (Telepon / Email)</div>
              <div className="font-medium text-slate-800">{tenant.nomor_telepon || '-'} / {tenant.email || '-'}</div>
            </div>
          </div>
        </div>

        {/* Card Risk Profile */}
        <div className="bg-white shadow-sm rounded-sm border-t-[3px] border-[#dd4b39]">
          <div className="p-3 border-b border-[#f4f4f4]">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-slate-500" /> Profil Risiko (Risk Profile)
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            
            <div className={`col-span-2 p-3 rounded flex justify-between items-center ${tenant.risk_profile?.status_pembayaran === 'Delinquent' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Status Pembayaran Saat Ini</div>
                <div className={`font-bold text-lg ${tenant.risk_profile?.status_pembayaran === 'Delinquent' ? 'text-red-600' : 'text-green-600'}`}>
                  {tenant.risk_profile?.status_pembayaran || 'Unknown'}
                </div>
              </div>
              <div>
                {tenant.risk_profile?.status_pembayaran === 'Delinquent' ? <AlertTriangle className="text-red-500 w-8 h-8" /> : <CheckCircle2 className="text-green-500 w-8 h-8" />}
              </div>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-100 rounded">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Tagihan Keseluruhan</div>
              <div className="font-bold text-slate-700 text-lg">{formatRupiah(tenant.risk_profile?.total_tagihan || 0)}</div>
            </div>
            
            <div className="bg-slate-50 p-3 border border-slate-100 rounded">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Tunggakan Aktif</div>
              <div className={`font-bold text-lg ${tenant.risk_profile?.tunggakan ? 'text-red-600' : 'text-slate-700'}`}>
                {formatRupiah(tenant.risk_profile?.tunggakan || 0)}
              </div>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-100 rounded">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Umur Piutang Tertinggi</div>
              <div className="font-bold text-slate-700 text-lg">{tenant.risk_profile?.umur_piutang || 0} Hari</div>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-100 rounded">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Status Kontrak Berjalan</div>
              <div className="font-bold text-slate-700 text-lg">{tenant.risk_profile?.status_kontrak || '-'}</div>
            </div>

          </div>
        </div>

        {/* Card Legalitas */}
        <div className="bg-white shadow-sm rounded-sm border-t-[3px] border-[#00a65a]">
          <div className="p-3 border-b border-[#f4f4f4]">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <FileText className="w-5 h-5 mr-2 text-slate-500" /> Dokumen Legalitas 
              {isComplete ? <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">LENGKAP</span> : <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">BELUM LENGKAP</span>}
            </h3>
          </div>
          <div className="p-4 space-y-3">
            
            {[
              { id: 'akta', name: 'Akta Perusahaan' },
              { id: 'nib', name: 'Nomor Induk Berusaha (NIB)' },
              { id: 'npwp', name: 'NPWP Perusahaan' },
              { id: 'izin_usaha', name: 'Izin Usaha / SIUP' },
              { id: 'izin_operasional', name: 'Sertifikat AOC / Izin Operasional' },
            ].map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-2 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <div className="flex items-center text-sm font-medium text-slate-700">
                  {legal[doc.id] ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <XCircle className="w-4 h-4 text-red-400 mr-2" />}
                  {doc.name}
                </div>
                <div>
                  {legal[doc.id] ? (
                    <a href={`http://localhost:5000${legal[doc.id]}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs flex items-center">
                      <Download className="w-3 h-3 mr-1" /> View PDF
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum Diunggah</span>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Card Rekening */}
        <div className="bg-white shadow-sm rounded-sm border-t-[3px] border-[#00c0ef]">
          <div className="p-3 border-b border-[#f4f4f4]">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <Landmark className="w-5 h-5 mr-2 text-slate-500" /> Informasi Rekening Bank
            </h3>
          </div>
          <div className="p-4">
            {tenant.informasi_bank ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded border border-blue-100">
                <div className="text-[12px] font-bold text-blue-400 uppercase mb-1">Nama Bank</div>
                <div className="font-bold text-blue-900 text-xl mb-3">{tenant.informasi_bank.bank || '-'}</div>
                
                <div className="text-[12px] font-bold text-blue-400 uppercase mb-1">Nomor Rekening</div>
                <div className="font-bold text-blue-900 text-lg mb-3 tracking-widest">{tenant.informasi_bank.nomor_rekening || '-'}</div>
                
                <div className="text-[12px] font-bold text-blue-400 uppercase mb-1">Nama Pemilik Rekening</div>
                <div className="font-bold text-blue-900 text-md">{tenant.informasi_bank.nama_rekening || '-'}</div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                Data rekening bank belum dimasukkan oleh tenant.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
