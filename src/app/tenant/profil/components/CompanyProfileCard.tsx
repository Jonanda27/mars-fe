import React from 'react';
import { Building2, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

interface CompanyProfileCardProps {
  tenantData: any;
  userTenantIdStr?: string | null;
  onOpenEditModal: () => void;
}

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
  tenantData,
  userTenantIdStr,
  onOpenEditModal,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
      <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
        <h3 className="text-[16px] text-[#444] font-bold flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Identitas Perusahaan
        </h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6 border-b border-[#f4f4f4] pb-6">
          <div className="w-24 h-24 bg-[#3c8dbc] text-white rounded-full flex items-center justify-center mb-4 text-3xl font-bold shadow-md uppercase">
            {tenantData?.nama_perusahaan?.substring(0, 2) || 'TN'}
          </div>
          <h2 className="text-[22px] font-bold text-[#333]">
            {tenantData?.nama_perusahaan || 'Nama Perusahaan'}
          </h2>
          <p className="text-[14px] text-[#777]">Mitra Operasional Bandara</p>
          <div className="mt-2 bg-[#3c8dbc]/10 text-[#3c8dbc] border border-[#3c8dbc]/20 px-3 py-1 text-[12px] font-bold">
            Tenant ID: {userTenantIdStr || 'Menunggu Verifikasi'}
          </div>
        </div>

        <ul className="text-[14px] text-[#555] flex flex-col gap-0">
          <li className="flex items-start py-3 border-b border-[#f4f4f4]">
            <MapPin className="w-4 h-4 mr-3 text-[#3c8dbc] mt-1 flex-shrink-0" />
            <div>
              <span className="font-bold text-[#333] block mb-1">Alamat Kantor Pusat</span>
              {tenantData?.alamat || 'Belum diatur'}
            </div>
          </li>
          <li className="flex items-center justify-between py-3 border-b border-[#f4f4f4]">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-[#3c8dbc]" />
              <span className="font-bold text-[#333]">Telepon / PIC</span>
            </div>
            <span>
              {tenantData?.nomor_telepon || '-'} ({tenantData?.pic || '-'})
            </span>
          </li>
          <li className="flex items-center justify-between py-3 border-b border-[#f4f4f4]">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-[#3c8dbc]" />
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
            onClick={onOpenEditModal}
            className="bg-[#f4f4f4] border border-[#d2d6de] text-[#444] text-[13px] px-4 py-2 hover:bg-[#e0e0e0] transition-colors shadow-sm"
          >
            Ajukan Perubahan Data
          </button>
        </div>
      </div>
    </div>
  );
};
