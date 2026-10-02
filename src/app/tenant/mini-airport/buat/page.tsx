"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { contractService } from '@/services/contractService';
import { airportService } from '@/services/airportService';
import { Contract } from '@/types/contract';
import { useAuthStore } from '@/store/useAuthStore';

import {
  MiniAirportItem,
  MiniAirportStepper,
  MiniAirportStep1Letter
} from '../components';

export default function TenantMiniAirportBuatPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [miniAirports, setMiniAirports] = useState<MiniAirportItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [contractsData, miniAirportsData] = await Promise.all([
          contractService.getTenantContracts().catch(() => []),
          airportService.getMiniAirports().catch(() => [])
        ]);
        setContracts(contractsData || []);
        setMiniAirports(miniAirportsData || []);
      } catch (err) {
        console.error('Error loading data for new mini airport application:', err);
        toast.error('Gagal memuat data formulir permohonan.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const activePayung = useMemo(() => {
    if (!contracts || contracts.length === 0) return null;
    const payungList = contracts.filter(c => 
      c.contract_type?.toLowerCase() === 'payung' || 
      c.contract_type?.toLowerCase().includes('payung')
    );
    if (payungList.length === 0) return null;

    const active = payungList.find(c => {
      const s = (c.status || '').trim().toLowerCase();
      return s === 'aktif' || s === 'active' || s === 'signed';
    });

    return active || payungList[0];
  }, [contracts]);

  const companyName = user?.nama_perusahaan || activePayung?.tenants?.nama_perusahaan || 'Mitra Maskapai / Operator';
  const companyAddress = (user as any)?.alamat || (activePayung?.tenants as any)?.alamat || 'Timika, Papua Tengah';

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-3.5 font-sans">
      {/* 1. Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Permohonan Landing{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Mini Airport</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <Link href="/tenant/mini-airport" className="mr-1 hover:text-[#3c8dbc]">
            Tenant
          </Link>{' '}
          /{' '}
          <Link href="/tenant/mini-airport" className="mx-1 hover:text-[#3c8dbc]">
            Mini Airport
          </Link>{' '}
          / <span className="ml-1 font-medium text-slate-800">Buat Permohonan</span>
        </div>
      </header>

      {/* 2. Form Container */}
      <div className="space-y-4">
        {/* Top Navigation Bar: Kembali ke Daftar & Tiket Aktif */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white px-4 py-3 rounded-xs border border-[#d2d6de] shadow-xs">
          <Link
            href="/tenant/mini-airport"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3c8dbc] hover:text-[#367fa9] cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Permohonan
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Nomor Permohonan:</span>
            <span className="font-mono font-bold text-xs bg-white text-[#3c8dbc] px-2.5 py-1 rounded-2xs border border-[#3c8dbc]">
              Pengajuan Baru
            </span>
          </div>
        </div>

        {/* Stepper Progres Alur (Langkah 1 Aktif) */}
        <MiniAirportStepper currentStep={1} />

        {/* Tahap 1: Surat Permohonan Resmi */}
        {isLoading ? (
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#3c8dbc] animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Memuat formulir surat permohonan...</p>
          </div>
        ) : (
          <MiniAirportStep1Letter
            tenantName={companyName}
            tenantAddress={companyAddress}
            miniAirports={miniAirports}
            onSuccess={(newApp) => {
              router.push(`/tenant/mini-airport/${newApp.id}`);
            }}
            onCancel={() => router.push('/tenant/mini-airport')}
          />
        )}
      </div>
    </div>
  );
}
