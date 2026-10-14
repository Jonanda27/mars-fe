import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface ApplicationDetailHeaderProps {
  readonly applicationNumber: string;
  readonly onOpenTutorial?: () => void;
  readonly tutorialTitle?: string;
}

export const ApplicationDetailHeader: React.FC<ApplicationDetailHeaderProps> = ({ 
  applicationNumber,
  onOpenTutorial,
  tutorialTitle = "Panduan Tutorial"
}) => {
  return (
    <>
      <div className="mb-4">
        <Link href="/tenant/permohonan" className="inline-flex items-center text-[14px] text-[#3c8dbc] hover:text-[#367fa9] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
        </Link>
      </div>
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Status Permohonan <small className="text-[15px] text-[#777] ml-2 font-light">ID: {applicationNumber}</small>
        </h1>
        {onOpenTutorial && (
          <button
            type="button"
            onClick={onOpenTutorial}
            className="bg-white border border-[#3c8dbc] text-[#3c8dbc] hover:bg-blue-50 px-3 py-1.5 text-[12px] font-semibold transition-colors flex items-center rounded-sm cursor-pointer shadow-2xs"
            title={tutorialTitle}
          >
            <HelpCircle className="w-4 h-4 mr-1.5 text-[#3c8dbc]" />
            {tutorialTitle}
          </button>
        )}
      </header>
    </>
  );
};

