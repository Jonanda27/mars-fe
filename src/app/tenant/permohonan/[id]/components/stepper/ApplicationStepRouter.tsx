import React from 'react';
import { RentalApplication } from '@/types/rental';
import { Asset } from '@/types/asset';
import { Aircraft } from '@/types/aircraft';

import { Step1WaitingLetter } from '../Step1WaitingLetter';
import { StepPayungSigning } from '../StepPayungSigning';
import { Step2AssetForm } from '../Step2AssetForm';
import { Step2WaitingAdmin } from '../Step2WaitingAdmin';
import { Step3DraftSigning } from '../Step3DraftSigning';
import { Step5ActiveContract } from '../Step5ActiveContract';
import { FallbackStatusView } from '../FallbackStatusView';

interface ApplicationStepRouterProps {
  readonly app: RentalApplication;
  readonly isHangar: boolean;
  readonly isWaitingKadis: boolean;
  readonly isPayungStep?: boolean;
  readonly formData: any;
  readonly setFormData: any;
  readonly specificNeeds: any;
  readonly setSpecificNeeds: any;
  readonly availableAssets: Asset[];
  readonly tenantAircrafts: Aircraft[];
  readonly allTenantAircrafts: Aircraft[];
  readonly assetCapacity: any;
  readonly isExtension: boolean;
  readonly roomZone: string;
  readonly setRoomZone: (val: string) => void;
  readonly roomType: string;
  readonly setRoomType: (val: string) => void;
  readonly roomAC: string;
  readonly setRoomAC: (val: string) => void;
  readonly masterAircraftTypes: any[];
  readonly saving: boolean;
  readonly onFetchData: () => void;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => Promise<void>;
  readonly onNeedsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  readonly onSubmitDetails: (e: React.SyntheticEvent) => Promise<void>;
  readonly onOpenAircraftModal: () => void;
}

export const ApplicationStepRouter: React.FC<ApplicationStepRouterProps> = ({
  app,
  isHangar,
  isWaitingKadis,
  isPayungStep,
  formData,
  setFormData,
  specificNeeds,
  setSpecificNeeds,
  availableAssets,
  tenantAircrafts,
  allTenantAircrafts,
  assetCapacity,
  isExtension,
  roomZone,
  setRoomZone,
  roomType,
  setRoomType,
  roomAC,
  setRoomAC,
  masterAircraftTypes,
  saving,
  onFetchData,
  onChange,
  onNeedsChange,
  onSubmitDetails,
  onOpenAircraftModal,
}) => {
  return (
    <>
      {/* Step 2: Menunggu Verifikasi Kadis */}
      {isWaitingKadis && <Step1WaitingLetter app={app} onSuccess={onFetchData} />}

      {/* Step 3: TTD Kontrak Payung & Menunggu Pengesahan Kadis (Hanggar Mitra Baru) */}
      {isHangar && (isPayungStep || app.status === 'Menunggu TTD Kontrak Payung' || app.status === 'Menunggu Pengesahan Kadis') && (
        <StepPayungSigning app={app} onSuccess={onFetchData} />
      )}

      {/* Step 3 (Sewa Ruangan) / Step 3-4 (Hanggar): Pilih Detail Layanan / Form Aset */}
      {app.status === 'Surat Disetujui' && (
        <Step2AssetForm
          formData={formData}
          setFormData={setFormData}
          specificNeeds={specificNeeds}
          setSpecificNeeds={setSpecificNeeds}
          availableAssets={availableAssets}
          tenantAircrafts={tenantAircrafts}
          assetCapacity={assetCapacity}
          isExtension={isExtension}
          roomZone={roomZone}
          setRoomZone={setRoomZone}
          roomType={roomType}
          setRoomType={setRoomType}
          roomAC={roomAC}
          setRoomAC={setRoomAC}
          masterAircraftTypes={masterAircraftTypes}
          handleChange={onChange}
          handleNeedsChange={onNeedsChange}
          handleSubmitDetails={onSubmitDetails}
          saving={saving}
          setShowAircraftModal={onOpenAircraftModal}
        />
      )}
      
      {/* Step 4 (Sewa Ruangan) / Step 4 (Hanggar): Menunggu Validasi Admin */}
      {app.status === 'Menunggu Validasi Admin' && (
        <Step2WaitingAdmin
          app={app}
          tenantAircrafts={tenantAircrafts}
          allTenantAircrafts={allTenantAircrafts}
          masterAircraftTypes={masterAircraftTypes}
        />
      )}

      {/* Step 5 (Sewa Ruangan) / Draft Kontrak: Penandatanganan Kontrak Sewa (Surat PKS) */}
      {(app.status === 'Draft Kontrak' || app.status === 'Disetujui') && (
        <Step3DraftSigning app={app} onSuccess={onFetchData} />
      )}

      {/* Step Terakhir: Selesai / Kontrak Aktif */}
      {(app.status === 'Signed' || app.status === 'Aktif') && (
        <Step5ActiveContract 
          app={app} 
          tenantAircrafts={tenantAircrafts}
          allTenantAircrafts={allTenantAircrafts}
          masterAircraftTypes={masterAircraftTypes}
        />
      )}

      {/* Fallback / Status Lainnya (e.g. Ditolak) */}
      {!isWaitingKadis && 
        app.status !== 'Menunggu TTD Kontrak Payung' &&
        app.status !== 'Surat Disetujui' && 
        app.status !== 'Menunggu Validasi Admin' && 
        app.status !== 'Draft Kontrak' && 
        app.status !== 'Disetujui' && 
        app.status !== 'Signed' && 
        app.status !== 'Aktif' && (
          <FallbackStatusView app={app} />
      )}
    </>
  );
};
