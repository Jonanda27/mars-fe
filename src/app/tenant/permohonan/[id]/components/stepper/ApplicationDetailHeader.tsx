import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ApplicationDetailHeaderProps {
  readonly applicationNumber: string;
}

export const ApplicationDetailHeader: React.FC<ApplicationDetailHeaderProps> = ({ applicationNumber }) => {
  return (
    <>
      <div className="mb-4">
        <Link href="/tenant/permohonan" className="inline-flex items-center text-[14px] text-[#3c8dbc] hover:text-[#367fa9] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
        </Link>
      </div>
      
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Status Permohonan <small className="text-[15px] text-[#777] ml-2 font-light">ID: {applicationNumber}</small>
        </h1>
      </header>
    </>
  );
};
