import React from 'react';
import { Building2, X, User, Phone, Mail, MapPin, FileText, ExternalLink, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { Tenant } from '@/types/tenant';
import { getFileUrl } from '@/utils/url';

interface TenantDetailModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  isSuperAdmin: boolean;
  isDokumenLengkap: (tenant: Tenant | null) => boolean;
  onVerify: (id: number) => void;
  onReject: (id: number) => void;
}

export const TenantDetailModal: React.FC<TenantDetailModalProps> = ({
  tenant,
  isOpen,
  onClose,
  isSuperAdmin,
  isDokumenLengkap,
  onVerify,
  onReject,
}) => {
  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] p-4 flex justify-between items-center text-white rounded-none">
          <div>
            <h3 className="font-bold text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-3 text-white/90" />
              Detail Profil Mitra (Tenant)
            </h3>
          </div>
          <button
            onClick={onClose}
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
                    <p className="font-bold text-gray-800 text-[14px]">{tenant.nama_perusahaan}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] text-gray-500 mb-0.5">ID Tenant</p>
                      <p className="font-bold text-gray-800 text-[14px]">{tenant.tenant_id_str || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-0.5">NIB</p>
                      <p className="font-bold text-gray-800 text-[14px]">{tenant.nib || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500 mb-0.5">NPWP</p>
                    <p className="font-bold text-gray-800 text-[14px]">{tenant.npwp || '-'}</p>
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
                      <p className="font-bold text-gray-800 text-[13px]">{tenant.pic || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-gray-500 mb-0.5">Nomor Telepon</p>
                      <p className="font-bold text-gray-800 text-[13px]">{tenant.nomor_telepon || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-gray-500 mb-0.5">Email Utama</p>
                      <p className="font-bold text-gray-800 text-[13px]">{tenant.email || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-gray-500 mb-0.5">Alamat Perusahaan</p>
                      <p className="font-bold text-gray-800 text-[13px] leading-relaxed">{tenant.alamat || '-'}</p>
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
                  {tenant.legalitas && Object.keys(tenant.legalitas).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(tenant.legalitas).map(([docType, path]) => (
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

                {tenant.status_verifikasi === 'Pending' && isSuperAdmin && (
                  <div className="mt-6 pt-5 border-t border-gray-200">
                    {isDokumenLengkap(tenant) ? (
                      <>
                        <p className="text-xs text-center text-gray-500 mb-3">
                          Tentukan status verifikasi dokumen ini:
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              onVerify(tenant.id);
                              onClose();
                            }}
                            className="flex-1 bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 text-sm font-bold flex items-center justify-center transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> Setujui
                          </button>
                          <button
                            onClick={() => {
                              onReject(tenant.id);
                              onClose();
                            }}
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
                          <p className="text-[11px] text-yellow-700 mt-1">
                            Tenant belum melengkapi dokumen wajib (NIB, NPWP, Akta).
                          </p>
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
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
