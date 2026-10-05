"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { contractService } from '@/services/contractService';
import { airportService } from '@/services/airportService';
import { aircraftService } from '@/services/aircraftService';
import { rentalService } from '@/services/rentalService';
import { Contract } from '@/types/contract';
import { Aircraft } from '@/types/aircraft';
import { RentalApplication } from '@/types/rental';
import { useAuthStore } from '@/store/useAuthStore';

import {
  MiniAirportItem,
  MiniAirportStepper,
  MiniAirportStep1Letter,
  MiniAirportStep2WaitingKadis,
  MiniAirportStep3ChooseService,
  MiniAirportStep4WaitingAdmin,
  MiniAirportStep5ActivePermit,
  getStepFromStatus
} from '../components';

export default function TenantMiniAirportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const appId = Number(params?.id);
  const { user } = useAuthStore();

  const [app, setApp] = useState<RentalApplication | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [miniAirports, setMiniAirports] = useState<MiniAirportItem[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [tenantApps, setTenantApps] = useState<RentalApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewStepOverride, setViewStepOverride] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    if (!appId || isNaN(appId)) {
      router.replace('/tenant/mini-airport');
      return;
    }

    try {
      setIsLoading(true);
      const [appData, contractsData, miniAirportsData, aircraftsData, tenantAppsData] = await Promise.all([
        rentalService.getApplicationById(appId).catch(async () => {
          const list = await rentalService.getTenantApplications().catch(() => []);
          return (list || []).find((a: RentalApplication) => a.id === appId) || null;
        }),
        contractService.getTenantContracts().catch(() => []),
        airportService.getMiniAirports().catch(() => []),
        aircraftService.getTenantAircrafts().catch(() => []),
        rentalService.getTenantApplications().catch(() => [])
      ]);

      if (!appData) {
        toast.error('Permohonan Mini Airport tidak ditemukan.');
        router.replace('/tenant/mini-airport');
        return;
      }

      setApp(appData);
      setContracts(contractsData || []);
      setMiniAirports(miniAirportsData || []);
      setAircrafts(aircraftsData || []);
      setTenantApps(tenantAppsData || []);
    } catch (err: unknown) {
      console.error('Error fetching application detail:', err);
      toast.error('Gagal memuat detail permohonan Mini Airport');
    } finally {
      setIsLoading(false);
    }
  }, [appId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Identifikasi Kontrak Payung
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

  // Himpun set armada yang sedang digunakan di permohonan lain yang aktif
  const busyAircraftFromOtherApps = useMemo(() => {
    const busyIds = new Set<number>();
    const busyRegs = new Set<string>();

    for (const otherApp of tenantApps) {
      if (Number(otherApp.id) === Number(appId)) continue;

      const st = (otherApp.status || '').toLowerCase();
      // Permohonan yang sudah ditolak, dibatalkan, atau selesai tidak memblokir armada
      if (['ditolak', 'rejected', 'batal', 'cancelled', 'selesai', 'expired'].includes(st)) {
        continue;
      }

      let spec = otherApp.specific_needs;
      if (typeof spec === 'string') {
        try { spec = JSON.parse(spec); } catch (e) {}
      }
      if (spec) {
        if (spec.aircraft_id) {
          busyIds.add(Number(spec.aircraft_id));
        }
        if (spec.registration_number) {
          busyRegs.add(String(spec.registration_number).trim().toUpperCase());
        }
        if (Array.isArray(spec.aircraft_ids)) {
          spec.aircraft_ids.forEach((id: any) => busyIds.add(Number(id)));
        }
        if (Array.isArray(spec.aircraft_details)) {
          spec.aircraft_details.forEach((d: any) => {
            if (d.aircraft_id || d.id) busyIds.add(Number(d.aircraft_id || d.id));
            if (d.registration_number) busyRegs.add(String(d.registration_number).trim().toUpperCase());
          });
        }
      }
    }

    return { busyIds, busyRegs };
  }, [tenantApps, appId]);

  // Daftar armada yang SIAP & TIDAK dalam status maintenance / sedang digunakan pada permohonan lain
  const effectiveAircrafts = useMemo(() => {
    if (!aircrafts || aircrafts.length === 0) return [];

    return aircrafts.filter(ac => {
      // 1. Jangan tampilkan jika digunakan di permohonan lain
      if (busyAircraftFromOtherApps.busyIds.has(ac.id)) {
        return false;
      }
      const regUpper = (ac.registration_number || '').trim().toUpperCase();
      if (busyAircraftFromOtherApps.busyRegs.has(regUpper)) {
        return false;
      }

      // 2. Cek flag rental backend (jika terikat pada permohonan selain permohonan saat ini)
      const tiedAppId = (ac as any).rental_application?.appId;
      if (tiedAppId && Number(tiedAppId) !== Number(appId)) {
        return false;
      }

      const isTiedToCurrentApp = tiedAppId && Number(tiedAppId) === Number(appId);
      if (!isTiedToCurrentApp) {
        if (ac.is_tied_to_rental === true) return false;
        if (ac.is_in_use === true) return false;
        if (ac.is_available === false) return false;
      }

      const st = (ac.status || '').toLowerCase();
      if (['maintenance', 'perawatan', 'tidak aktif', 'inactive'].includes(st)) {
        return false;
      }
      return true;
    });
  }, [aircrafts, busyAircraftFromOtherApps, appId]);

  const naturalStep = app ? getStepFromStatus(app.status) : 1;
  const currentStep = viewStepOverride !== null ? viewStepOverride : naturalStep;
  const isReadOnly = currentStep < naturalStep;

  const handleStepSuccess = async (updatedApp: RentalApplication) => {
    setApp(updatedApp);
    setViewStepOverride(null);
    await loadData();
  };

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
          / <span className="ml-1 font-medium">Detail Permohonan</span>
        </div>
      </header>

      {/* 2. Loading State */}
      {isLoading && !app ? (
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#3c8dbc] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat data permohonan Mini Airport...</p>
        </div>
      ) : app ? (
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
                {app.application_number}
              </span>
            </div>
          </div>

          {/* Stepper Progres Alur */}
          <MiniAirportStepper 
            currentStep={currentStep} 
            naturalStep={naturalStep}
            onStepClick={(step) => {
              if (step <= naturalStep) {
                setViewStepOverride(step === naturalStep ? null : step);
              }
            }}
          />

          {/* Banner Review Mode jika sedang melihat langkah sebelumnya yang sudah selesai */}
          {isReadOnly && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 sm:p-4 rounded-xs shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                    <span>Mode Pratinjau Arsip &bull; Langkah {currentStep} Telah Selesai</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded-2xs font-semibold">Terkunci</span>
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Tahapan ini telah tuntas disetujui. Seluruh data ditampilkan dalam mode baca (read-only) untuk menjaga keabsahan berkas dan tidak dapat diedit kembali.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewStepOverride(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-xs shadow-xs transition-colors cursor-pointer flex-shrink-0 self-stretch sm:self-auto justify-center"
              >
                <span>Kembali ke Langkah Aktif (Langkah {naturalStep})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Router Tahapan Alur */}
          {/* Tahap 1: Surat Permohonan Resmi */}
          {currentStep === 1 && (
            <MiniAirportStep1Letter
              tenantName={companyName}
              tenantAddress={companyAddress}
              miniAirports={miniAirports}
              onSuccess={handleStepSuccess}
              isReadOnly={isReadOnly}
              app={app}
            />
          )}

          {/* Tahap 2: Menunggu Verifikasi Kadis */}
          {currentStep === 2 && (
            <MiniAirportStep2WaitingKadis
              app={app}
              onSuccess={handleStepSuccess}
              isReadOnly={isReadOnly}
            />
          )}

          {/* Tahap 3: Layanan & Armada Pesawat */}
          {currentStep === 3 && (
            <MiniAirportStep3ChooseService
              app={app}
              miniAirports={miniAirports}
              effectiveAircrafts={effectiveAircrafts}
              onSuccess={handleStepSuccess}
              isReadOnly={isReadOnly}
            />
          )}

          {/* Tahap 4: Menunggu Validasi Admin (Alokasi Stand Apron) */}
          {currentStep === 4 && (
            <MiniAirportStep4WaitingAdmin
              app={app}
              onPrevStep={() => setViewStepOverride(3)}
              onSuccess={handleStepSuccess}
              isReadOnly={isReadOnly}
            />
          )}

          {/* Tahap 5: Izin Operasional Mini Airport Aktif & Slip Pendaratan */}
          {currentStep === 5 && (
            <MiniAirportStep5ActivePermit
              app={app}
              onPlanNewFlight={() => router.push('/tenant/mini-airport/buat')}
              onBackToList={() => router.push('/tenant/mini-airport')}
            />
          )}
        </div>
      ) : (
        <div className="bg-white border-t-[3px] border-red-500 shadow-xs p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">Permohonan Tidak Ditemukan</p>
          <Link
            href="/tenant/mini-airport"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] rounded-xs shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Permohonan
          </Link>
        </div>
      )}
    </div>
  );
}
