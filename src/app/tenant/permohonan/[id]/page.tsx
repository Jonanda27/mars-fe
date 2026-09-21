"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Stepper } from '@/components/Stepper';
import { Loader2 } from 'lucide-react';
import { AircraftModal } from '@/components/AircraftModal';

import { useApplicationDetailState } from './components/stepper/useApplicationDetailState';
import { ApplicationDetailHeader } from './components/stepper/ApplicationDetailHeader';
import { ApplicationStepRouter } from './components/stepper/ApplicationStepRouter';

export default function TenantPermohonanDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const {
    loading,
    saving,
    isExtension,
    app,
    availableAssets,
    tenantAircrafts,
    allTenantAircrafts,
    assetCapacity,
    formData,
    setFormData,
    specificNeeds,
    setSpecificNeeds,
    roomZone,
    setRoomZone,
    roomType,
    setRoomType,
    roomAC,
    setRoomAC,
    showAircraftModal,
    setShowAircraftModal,
    savingAircraft,
    masterAircraftTypes,
    newAircraftData,
    fetchData,
    handleChange,
    handleNeedsChange,
    handleNewAircraftChange,
    handleFileChange,
    handleCreateAircraft,
    handleSubmitDetails,
  } = useApplicationDetailState(id);

  const isHangar = useMemo(() => Boolean(
    app?.application_type?.toLowerCase().includes('hanggar') ||
    app?.assets?.kategori?.toLowerCase().includes('hanggar') ||
    app?.contracts?.contract_type === 'Payung'
  ), [app?.application_type, app?.assets?.kategori, app?.contracts?.contract_type]);

  if (loading || !app) {
    return (
      <div className="p-10 text-center flex justify-center min-h-screen items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  const requiresPayung = isHangar && Boolean(
    app.requires_payung ?? (
      app.status === 'Menunggu TTD Kontrak Payung' ||
      app.status === 'Menunggu Pengesahan Kadis' ||
      app.contracts?.contract_type === 'Payung'
    )
  );

  // Jika sedang dalam tahapan Kontrak Payung (Tahap 3):
  // Baik saat menunggu TTD tenant maupun saat sudah upload scan TTD basah dan menunggu pengesahan Kadis
  const isPayungStep = Boolean(
    requiresPayung && (
      app.status === 'Menunggu TTD Kontrak Payung' ||
      app.status === 'Menunggu Pengesahan Kadis' ||
      (
        app.contracts?.contract_type === 'Payung' &&
        app.contracts?.status !== 'Aktif' &&
        app.contracts?.status !== 'Active' &&
        app.status !== 'Surat Disetujui' &&
        app.status !== 'Menunggu Validasi Admin' &&
        app.status !== 'Signed' &&
        app.status !== 'Aktif' &&
        (
          app.contracts?.status === 'Menunggu Pengesahan Kadis' ||
          Boolean(app.contracts?.signed_document_url) ||
          app.status === 'Menunggu Persetujuan Kadis'
        )
      )
    )
  );

  const getStepNumber = (status: string, hasPayung: boolean, hangarMode: boolean, isPayungPhase: boolean) => {
    if (isPayungPhase) {
      return 3;
    }

    if (!hangarMode) {
      switch (status) {
        case 'Pengajuan Baru': 
        case 'Menunggu Verifikasi Kadis': 
        case 'Menunggu Persetujuan Kadis':
        case 'Pending':
          return 2;
        case 'Surat Disetujui':
          return 3;
        case 'Menunggu Validasi Admin':
        case 'Validasi Aset':
          return 4;
        case 'Draft Kontrak':
        case 'Disetujui':
          return 5;
        case 'Signed':
        case 'Aktif':
          return 6;
        default:
          return 1;
      }
    }

    if (hasPayung) {
      switch (status) {
        case 'Pengajuan Baru': 
        case 'Menunggu Verifikasi Kadis': 
        case 'Pending':
          return 2;
        case 'Menunggu Persetujuan Kadis':
          return isPayungPhase ? 3 : 2;
        case 'Menunggu TTD Kontrak Payung':
        case 'Menunggu Pengesahan Kadis':
          return 3;
        case 'Surat Disetujui':
          return 4;
        case 'Menunggu Validasi Admin':
        case 'Validasi Aset':
        case 'Draft Kontrak':
        case 'Disetujui':
          return 5;
        case 'Signed':
        case 'Aktif':
          return 6;
        default:
          return 1;
      }
    }

    switch (status) {
      case 'Pengajuan Baru': 
      case 'Menunggu Verifikasi Kadis': 
      case 'Menunggu Persetujuan Kadis':
      case 'Pending':
        return 2;
      case 'Surat Disetujui':
        return 3;
      case 'Menunggu Validasi Admin':
      case 'Validasi Aset':
      case 'Draft Kontrak':
      case 'Disetujui':
        return 4;
      case 'Signed':
      case 'Aktif':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(app.status, requiresPayung, isHangar, isPayungStep);
  const isWaitingKadis = 
    !isPayungStep && (
      app.status === 'Menunggu Verifikasi Kadis' || 
      app.status === 'Menunggu Persetujuan Kadis' || 
      app.status === 'Pengajuan Baru' || 
      app.status === 'Pending'
    );

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)]">
      {/* Header & Back Navigation */}
      <ApplicationDetailHeader applicationNumber={app.application_number} />

      {/* Stepper Visualization */}
      <div className="mb-6">
        <Stepper currentStep={currentStep} requiresPayung={requiresPayung} isHangar={isHangar} />
      </div>

      {/* Dynamic Sub-Step Rendering Router */}
      <ApplicationStepRouter
        app={app}
        isHangar={isHangar}
        isWaitingKadis={isWaitingKadis}
        isPayungStep={isPayungStep}
        formData={formData}
        setFormData={setFormData}
        specificNeeds={specificNeeds}
        setSpecificNeeds={setSpecificNeeds}
        availableAssets={availableAssets}
        tenantAircrafts={tenantAircrafts}
        allTenantAircrafts={allTenantAircrafts}
        assetCapacity={assetCapacity}
        isExtension={isExtension}
        roomZone={roomZone}
        setRoomZone={setRoomZone}
        roomType={roomType}
        setRoomType={setRoomType}
        roomAC={roomAC}
        setRoomAC={setRoomAC}
        masterAircraftTypes={masterAircraftTypes}
        saving={saving}
        onFetchData={fetchData}
        onChange={handleChange}
        onNeedsChange={handleNeedsChange}
        onSubmitDetails={handleSubmitDetails}
        onOpenAircraftModal={() => setShowAircraftModal(true)}
      />

      {/* Modal Tambah Pesawat */}
      <AircraftModal
        show={showAircraftModal}
        onClose={() => setShowAircraftModal(false)}
        newAircraftData={newAircraftData}
        handleNewAircraftChange={handleNewAircraftChange}
        handleFileChange={handleFileChange}
        handleCreateAircraft={handleCreateAircraft}
        savingAircraft={savingAircraft}
        masterAircraftTypes={masterAircraftTypes}
      />
    </div>
  );
}
