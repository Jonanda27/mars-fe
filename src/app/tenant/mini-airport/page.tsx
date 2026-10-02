"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import toast from 'react-hot-toast';

import { contractService } from '@/services/contractService';
import { rentalService } from '@/services/rentalService';
import { airportService } from '@/services/airportService';
import { Contract } from '@/types/contract';
import { RentalApplication } from '@/types/rental';
import { useAuthStore } from '@/store/useAuthStore';

import {
  MiniAirportItem,
  MiniAirportCoveragePanel,
  MiniAirportApplicationList
} from './components';

dayjs.locale('id');

export default function TenantMiniAirportPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [miniAirports, setMiniAirports] = useState<MiniAirportItem[]>([]);
  const [selectedAirportId, setSelectedAirportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load contracts, applications, and mini airports for the dashboard view
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [contractsData, rentalsData, miniAirportsData] = await Promise.all([
        contractService.getTenantContracts().catch(() => []),
        rentalService.getTenantApplications().catch(() => []),
        airportService.getMiniAirports().catch(() => [])
      ]);

      setContracts(contractsData || []);
      setApplications(rentalsData || []);
      setMiniAirports(miniAirportsData || []);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      toast.error('Gagal memuat data Mini Airport');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const companyName = user?.nama_perusahaan || 'Mitra Maskapai / Operator';
  const selectedAirportName = miniAirports.find(a => a.id === selectedAirportId)?.nama_bandara || null;

  // Handlers untuk navigasi halaman terpisah (URL-based routing)
  const handleCreateNew = () => {
    router.push('/tenant/mini-airport/buat');
  };

  const handleSelectApp = (app: RentalApplication) => {
    router.push(`/tenant/mini-airport/${app.id}`);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-3.5 font-sans">
      {/* 1. Header Halaman (Dinas Perhubungan - Layanan Lapangan Terbang Perintis) */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Permohonan Landing{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Mini Airport</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium text-slate-800">Mini Airport</span>
        </div>
      </header>

      {/* 2. Cakupan Kontrak Payung Mini Airport (Solusi 1: Multi-Airport Visual Strip) */}
      <MiniAirportCoveragePanel
        miniAirports={miniAirports}
        contracts={contracts}
        companyName={companyName}
        isLoading={isLoading}
        selectedAirportId={selectedAirportId}
        onSelectAirport={(id) => setSelectedAirportId(id)}
      />

      {/* 3. TAMPILAN DAFTAR PERMOHONAN (LIST VIEW) */}
      <MiniAirportApplicationList
        applications={applications}
        isLoading={isLoading}
        onSelectApp={handleSelectApp}
        onCreateNew={handleCreateNew}
        selectedAirportId={selectedAirportId}
        selectedAirportName={selectedAirportName}
        onClearAirportFilter={() => setSelectedAirportId(null)}
      />
    </div>
  );
}
