import React from 'react';
import { Search, ShieldCheck, XCircle, ExternalLink } from 'lucide-react';
import { Tenant } from '@/types/tenant';
import StatusBadge from '@/components/StatusBadge';
import { getFileUrl } from '@/utils/url';
import { formatDate } from '@/utils/date';

interface TenantTableProps {
  tenants: Tenant[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onVerify: (id: number) => void;
  onReject: (id: number) => void;
  onSelectTenant: (tenant: Tenant) => void;
  isDokumenLengkap: (tenant: Tenant | null) => boolean;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  isLoading,
  isSuperAdmin,
  searchTerm,
  onSearchChange,
  onVerify,
  onReject,
  onSelectTenant,
  isDokumenLengkap,
}) => {
  const filteredTenants = tenants.filter((tenant) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      tenant.nama_perusahaan.toLowerCase().includes(term) ||
      tenant.tenant_id_str?.toLowerCase().includes(term) ||
      tenant.pic?.toLowerCase().includes(term) ||
      tenant.nib?.toLowerCase().includes(term) ||
      tenant.npwp?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
        <h3 className="text-[16px] text-[#444] font-normal">Daftar Pendaftar Tenant</h3>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari perusahaan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Belum ada data pendaftar.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {formatDate(tenant.created_at)}
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
                      <StatusBadge status={tenant.status_verifikasi} />
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {tenant.status_verifikasi === 'Pending' ? (
                        <div className="flex items-center justify-center gap-1">
                          {isSuperAdmin && (
                            <>
                              <button
                                onClick={() => onVerify(tenant.id)}
                                disabled={!isDokumenLengkap(tenant)}
                                className={`${
                                  isDokumenLengkap(tenant)
                                    ? 'bg-[#00a65a] hover:bg-[#008d4c]'
                                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                                } text-white text-[12px] px-2 py-1 transition-colors shadow-sm`}
                                title={isDokumenLengkap(tenant) ? 'Verifikasi' : 'Dokumen Belum Lengkap'}
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onReject(tenant.id)}
                                className="bg-[#dd4b39] hover:bg-[#d73925] text-white text-[12px] px-2 py-1 transition-colors shadow-sm"
                                title="Tolak"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onSelectTenant(tenant)}
                            className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-[12px] px-2 py-1 transition-colors shadow-sm"
                            title="Lihat Dokumen"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectTenant(tenant)}
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
  );
};
