"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { assetService } from '@/services/assetService';
import { getErrorMessage } from '@/services/api';
import { RentalApplication } from '@/types/rental';
import { Asset } from '@/types/asset';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';

// Subcomponents imported from admin review components
import { TenantProfileCard } from '@/app/admin/permohonan/review/[id]/components/TenantProfileCard';
import { RentalPlanCard } from '@/app/admin/permohonan/review/[id]/components/RentalPlanCard';
import { MiniAirportPlanCard } from '@/app/admin/permohonan/review/[id]/components/MiniAirportPlanCard';
import { AdminReviewActionPanel } from '@/app/admin/permohonan/review/[id]/components/AdminReviewActionPanel';

export default function DinasReviewPermohonanPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<RentalApplication | null>(null);
  
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  const [assetCapacity, setAssetCapacity] = useState<{ isHangar: boolean, totalArea: number, usedArea: number, remainingArea: number } | null>(null);
  const [fetchingCapacity, setFetchingCapacity] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appData = await rentalService.getApplicationById(Number.parseInt(id, 10));
      setApp(appData);
      setSelectedAssetId(appData.asset_id?.toString() || '');

      const assetsData = await assetService.getAssets();
      const available = assetsData.filter(a => a.status === 'Available' || a.status === 'Tersedia' || a.id === appData.asset_id);
      setAvailableAssets(available);
      
      if (appData.asset_id) {
        fetchCapacity(appData.asset_id.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data permohonan');
    } finally {
      setLoading(false);
    }
  };

  const fetchCapacity = async (idStr: string) => {
    setFetchingCapacity(true);
    try {
      const capacity = await assetService.getAssetCapacity(Number.parseInt(idStr, 10));
      setAssetCapacity(capacity);
    } catch (err) {
      console.error(err);
      setAssetCapacity(null);
    } finally {
      setFetchingCapacity(false);
    }
  };

  const handleAssetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAssetId(val);
    if (val) {
      fetchCapacity(val);
    } else {
      setAssetCapacity(null);
    }
  };

  // Calculate required area based on application details
  const calculateRequiredArea = () => {
    let area = 0;
    if (app?.specific_needs?.aircraft_details && Array.isArray(app.specific_needs.aircraft_details)) {
      app.specific_needs.aircraft_details.forEach((ac: any) => {
        if (ac.aircraft_types?.luas_efektif_m2) {
          area += Number.parseFloat(ac.aircraft_types.luas_efektif_m2);
        }
      });
    }
    return area;
  };

  const requiredArea = calculateRequiredArea();
  const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;

  const handleVerifyLetter = async (status: string) => {
    if (confirm(`Apakah Anda yakin ingin menandai surat ini sebagai ${status}?`)) {
      setSaving(true);
      try {
        await rentalService.verifyLetter(Number.parseInt(id, 10), status);
        toast.success(`Surat permohonan berhasil ${status === 'Surat Disetujui' ? 'disetujui' : 'ditolak'}!`);
        fetchData();
      } catch (error: any) {
        toast.error(getErrorMessage(error) || 'Gagal memperbarui status surat');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAction = async (status: string) => {
    if ((status === 'Approved' || status === 'Draft Kontrak' || status === 'Aktif') && !selectedAssetId) {
      toast.error('Anda harus menetapkan alokasi aset sebelum menyetujui permohonan!');
      return;
    }
    
    if ((status === 'Approved' || status === 'Draft Kontrak' || status === 'Aktif') && isOverCapacity) {
      toast.error('Kapasitas hanggar tidak mencukupi untuk jumlah armada yang diajukan. Silakan pilih hanggar lain atau tolak permohonan.');
      return;
    }
    
    const isHangar = Boolean(
      app?.application_type?.toLowerCase().includes('hanggar') ||
      app?.assets?.kategori?.toLowerCase().includes('hanggar') ||
      app?.contracts?.contract_type === 'Payung'
    );

    const confirmMessage = isHangar && status === 'Aktif'
      ? 'Apakah Anda yakin ingin menyetujui dan memvalidasi permohonan sewa hanggar ini?'
      : `Apakah Anda yakin ingin menandai permohonan ini sebagai ${status}?`;

    if (confirm(confirmMessage)) {
      setSaving(true);
      try {
        if (status === 'Draft Kontrak') {
          if (app?.asset_id?.toString() !== selectedAssetId) {
             await rentalService.updateApplicationStatus(Number.parseInt(id, 10), 'Reviewed', Number.parseInt(selectedAssetId, 10));
          }
          await rentalService.approveKadis(Number.parseInt(id, 10));
          toast.success('Validasi berhasil! Draft PKS berhasil dibuat otomatis.');
        } else {
          await rentalService.updateApplicationStatus(Number.parseInt(id, 10), status, Number.parseInt(selectedAssetId, 10));
          if (isHangar && status === 'Aktif') {
            toast.success('Validasi berhasil! Permohonan sewa hanggar telah disetujui.');
          }
        }
        router.push('/dinas/permohonan');
      } catch (error: any) {
        toast.error(getErrorMessage(error) || 'Gagal update status permohonan');
        setSaving(false);
      }
    }
  };

  const getStepNumber = (status: string) => {
    if (status === 'Menunggu Verifikasi Kadis' || status === 'Pending') return 1;
    if (status === 'Surat Disetujui' || status === 'Menunggu TTD Kontrak Payung') return 2;
    if (status === 'Menunggu Validasi Admin' || status === 'Reviewed') return 3;
    if (status === 'Draft Kontrak' || status === 'Approved') return 4;
    if (status === 'Signed') return 5;
    if (status === 'Active' || status === 'Aktif') return 6;
    return 1;
  };

  if (loading || !app) {
    return (
      <div className="p-10 text-center flex justify-center min-h-screen items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  const currentStep = getStepNumber(app.status);
  const isKadisStep = app.status === 'Menunggu Verifikasi Kadis';
  const isAdminStep = app.status === 'Menunggu Validasi Admin';

  const isMini = Boolean(
    app.application_type?.toLowerCase().includes('mini') ||
    (app.specific_needs && (
      typeof app.specific_needs === 'string'
        ? app.specific_needs.includes('airport_name') || app.specific_needs.includes('Mini Airport')
        : ('airport_name' in app.specific_needs || app.specific_needs.service_type === 'Mini Airport')
    ))
  );

  const miniAirportName = (() => {
    if (!app.specific_needs) return '';
    if (typeof app.specific_needs === 'string') {
      try {
        const parsed = JSON.parse(app.specific_needs);
        return parsed.airport_name || '';
      } catch (e) {
        return '';
      }
    }
    return app.specific_needs.airport_name || '';
  })();

  return (
    <div className="p-4 sm:p-6 bg-[#ecf0f5] min-h-full font-sans">
      
      {/* Header & Breadcrumb */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/dinas/permohonan" className="inline-flex items-center text-sm text-slate-500 hover:text-[#3c8dbc] transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isMini ? 'Telaah Permohonan Mini Airport' : 'Telaah Permohonan Sewa'}
            </h1>
            <StatusBadge status={app.status} className="text-xs px-4 py-1.5" />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            ID Ref: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{app.application_number}</span> &bull; Diajukan pada: {app.created_at ? dayjs(app.created_at).format('DD MMMM YYYY') : '-'}
            {isMini && miniAirportName && (
              <span className="ml-2 font-medium text-slate-600">
                &bull; Wilayah: <span className="text-[#3c8dbc] font-bold">{miniAirportName}</span>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Tenant & Plan Information */}
        <div className="lg:col-span-2 space-y-6">
          <TenantProfileCard tenant={app.tenants} />
          {isMini ? (
            <MiniAirportPlanCard app={app} currentStep={currentStep} />
          ) : (
            <RentalPlanCard app={app} currentStep={currentStep} />
          )}
        </div>

        {/* Right Column: Action Decision Panel */}
        <div className="lg:col-span-1 sticky top-6">
          <AdminReviewActionPanel 
            app={app}
            currentStep={currentStep}
            isKadisStep={isKadisStep}
            isAdminStep={isAdminStep}
            userRole={user?.role}
            saving={saving}
            selectedAssetId={selectedAssetId}
            handleAssetSelect={handleAssetSelect}
            availableAssets={availableAssets}
            assetCapacity={assetCapacity}
            fetchingCapacity={fetchingCapacity}
            isOverCapacity={isOverCapacity}
            requiredArea={requiredArea}
            handleVerifyLetter={handleVerifyLetter}
            handleAction={handleAction}
          />
        </div>

      </div>
    </div>
  );
}
