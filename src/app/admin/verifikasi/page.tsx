"use client";

import React, { useEffect, useState } from 'react';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import { ShieldCheck, XCircle, Clock, Search, ExternalLink } from 'lucide-react';

export default function VerifikasiTenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleVerify = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin memverifikasi tenant ini?')) {
      try {
        await tenantService.verifyTenant(id, 'Verified');
        fetchTenants();
      } catch (err: any) {
        alert(err.message || 'Gagal memverifikasi tenant');
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menolak tenant ini?')) {
      try {
        await tenantService.verifyTenant(id, 'Rejected');
        fetchTenants();
      } catch (err: any) {
        alert(err.message || 'Gagal menolak tenant');
      }
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
                                href={`http://localhost:3001${path}`} 
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
                            <button 
                              onClick={() => handleVerify(tenant.id)}
                              className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-[12px] px-2 py-1 transition-colors shadow-sm"
                              title="Verifikasi"
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
                            <button 
                              className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-[12px] px-2 py-1 transition-colors shadow-sm"
                              title="Lihat Dokumen"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
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
    </div>
  );
}
