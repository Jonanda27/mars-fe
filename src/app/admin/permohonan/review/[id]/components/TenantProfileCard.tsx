import React from 'react';
import { Building2, User, Phone } from 'lucide-react';

interface TenantProfileCardProps {
  tenant?: {
    nama_perusahaan?: string;
    nib?: string;
    npwp?: string;
    pic?: string;
    nomor_telepon?: string;
  } | null;
}

export const TenantProfileCard: React.FC<TenantProfileCardProps> = ({ tenant }) => {
  return (
    <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#3c8dbc] px-5 py-4 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold tracking-wide">Profil Perusahaan Tenant</h2>
      </div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{tenant?.nama_perusahaan || '-'}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                Verified Legal Entity
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">NIB Perusahaan</p>
            <p className="text-slate-800 font-medium">{tenant?.nib || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">NPWP Perusahaan</p>
            <p className="text-slate-800 font-mono font-medium">{tenant?.npwp || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PIC / Kontak Representatif</p>
            <div className="flex items-center gap-2 text-slate-800">
              <User className="w-4 h-4 text-slate-400" /> <span className="font-medium">{tenant?.pic || '-'}</span>
              <span className="text-slate-300">|</span>
              <Phone className="w-4 h-4 text-slate-400" /> <span>{tenant?.nomor_telepon || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfileCard;
