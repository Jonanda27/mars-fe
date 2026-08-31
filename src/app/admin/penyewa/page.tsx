"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, Search, ShieldCheck, ShieldAlert, 
  CheckCircle2, XCircle, FileText, Lock, Loader2, ArrowRight
} from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import Link from 'next/link';

export default function AdminPenyewaPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await tenantService.getTenants();
      setTenants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.tenant_id_str && t.tenant_id_str.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.pic && t.pic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Verifikasi & Manajemen Penyewa (Tenant)
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Penyewa</span>
        </div>
      </header>

      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Master Data Maskapai & Operator
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="flex">
              <input 
                type="text" 
                placeholder="Cari Nama atau ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[250px]" 
              />
              <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                <Search className="w-4 h-4 text-[#777]" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                  <th className="py-4 px-5 font-bold w-[25%]">Identitas Perusahaan</th>
                  <th className="py-4 px-5 font-bold w-[25%]">Status Kelengkapan Dokumen</th>
                  <th className="py-4 px-5 font-bold text-center w-[15%]">Status Akun</th>
                  <th className="py-4 px-5 font-bold text-center w-[20%]">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Tidak ada data penyewa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => {
                    const legal = tenant.legalitas || {};
                    const isComplete = legal.akta && legal.nib && legal.npwp && legal.izin_usaha && legal.izin_operasional;

                    return (
                      <tr key={tenant.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-[#333] text-[15px]">{tenant.nama_perusahaan}</div>
                          <div className="text-[11px] text-[#777]">ID: {tenant.tenant_id_str || 'Belum Terbit (Pending)'}</div>
                          <div className="text-[11px] text-[#555] mt-1">PIC: {tenant.pic || '-'} ({tenant.nomor_telepon || '-'})</div>
                        </td>
                        <td className="py-4 px-5">
                          <ul className="flex flex-col gap-1 text-[11px] font-bold">
                            <li className="flex items-center">
                              {isComplete ? (
                                <span className="text-[#00a65a] flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Dokumen Wajib Lengkap</span>
                              ) : (
                                <span className="text-[#dd4b39] flex items-center"><XCircle className="w-3 h-3 mr-1" /> Dokumen Wajib Belum Lengkap</span>
                              )}
                            </li>
                            <li className="text-slate-500 font-normal mt-1 flex gap-2 flex-wrap">
                              {['akta', 'nib', 'npwp', 'izin_usaha', 'izin_operasional'].map(doc => (
                                <span key={doc} className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${legal[doc] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {doc.replace('_', ' ')}
                                </span>
                              ))}
                            </li>
                          </ul>
                        </td>
                        <td className="py-4 px-5 text-center">
                          {tenant.status_verifikasi === 'Verified' && (
                            <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                            </span>
                          )}
                          {tenant.status_verifikasi === 'Pending' && (
                            <span className="inline-flex items-center bg-[#f39c12] text-white text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                              Menunggu Review
                            </span>
                          )}
                          {tenant.status_verifikasi === 'Suspended' && (
                            <span className="inline-flex items-center bg-[#dd4b39] text-white text-[11px] px-2 py-1 font-bold uppercase tracking-wider shadow-sm">
                              Dibekukan
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <Link href={`/admin/penyewa/${tenant.id}`}>
                            <button className="bg-white border border-[#3c8dbc] text-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white transition-colors px-3 py-1.5 text-[12px] font-bold flex items-center justify-center mx-auto shadow-sm">
                              <FileText className="w-4 h-4 mr-1" /> Lihat Detail / Verifikasi <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>Menampilkan total {filteredTenants.length} Perusahaan</span>
        </div>
      </div>
    </div>
  );
}
