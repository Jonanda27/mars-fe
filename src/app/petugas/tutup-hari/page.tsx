"use client";

import React from 'react';
import { Clock, History, ShieldCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TutupHariForm } from '../components/TutupHariForm';
import Link from 'next/link';

export default function PetugasTutupHariPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to Riwayat Tutup Hari upon successful submit
    router.push('/petugas/riwayat');
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Laporan Tutup Hari <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <Link href="/petugas" className="mr-1 hover:text-[#3c8dbc]">Petugas</Link> / <span className="ml-1 font-medium">Laporan Tutup Hari</span>
        </div>
      </header>

      {/* Main Content Component */}
      <TutupHariForm onSuccess={handleSuccess} />

    </div>
  );
}
