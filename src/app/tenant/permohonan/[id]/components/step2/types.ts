import React from 'react';
import { Asset } from '@/types/asset';
import { Aircraft } from '@/types/aircraft';

export interface Step2AssetFormProps {
  readonly formData: {
    application_type: string;
    asset_id: string;
    start_date: string;
    end_date: string;
  };
  readonly setFormData: React.Dispatch<React.SetStateAction<{
    application_type: string;
    asset_id: string;
    start_date: string;
    end_date: string;
  }>>;
  readonly specificNeeds: {
    aircraft_ids: string[];
    kebutuhan_ruang_pendukung: string;
  };
  readonly setSpecificNeeds: React.Dispatch<React.SetStateAction<{
    aircraft_ids: string[];
    kebutuhan_ruang_pendukung: string;
  }>>;
  readonly availableAssets: Asset[];
  readonly tenantAircrafts: Aircraft[];
  readonly assetCapacity: { isHangar: boolean; totalArea: number; usedArea: number; remainingArea: number } | null;
  readonly isExtension: boolean;
  readonly roomZone: string;
  readonly setRoomZone: (val: string) => void;
  readonly roomType: string;
  readonly setRoomType: (val: string) => void;
  readonly roomAC: string;
  readonly setRoomAC: (val: string) => void;
  readonly masterAircraftTypes: { id: number; jenis_pesawat: string; luas_efektif_m2: string }[];
  readonly handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => Promise<void>;
  readonly handleNeedsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  readonly handleSubmitDetails: (e: React.SyntheticEvent) => Promise<void>;
  readonly saving: boolean;
  readonly setShowAircraftModal: (show: boolean) => void;
}

export interface HangarFormSectionProps {
  readonly formData: Step2AssetFormProps['formData'];
  readonly handleChange: Step2AssetFormProps['handleChange'];
  readonly availableAssets: Step2AssetFormProps['availableAssets'];
  readonly selectedAsset: Asset | undefined;
  readonly assetCapacity: Step2AssetFormProps['assetCapacity'];
  readonly isOverCapacity: boolean | null | undefined;
  readonly requiredArea: number;
  readonly isExtension: boolean;
  readonly totalMalam: number;
  readonly specificNeeds: Step2AssetFormProps['specificNeeds'];
  readonly setSpecificNeeds: Step2AssetFormProps['setSpecificNeeds'];
  readonly handleNeedsChange: Step2AssetFormProps['handleNeedsChange'];
  readonly tenantAircrafts: Step2AssetFormProps['tenantAircrafts'];
  readonly masterAircraftTypes: Step2AssetFormProps['masterAircraftTypes'];
  readonly setShowAircraftModal: Step2AssetFormProps['setShowAircraftModal'];
}

export interface RoomFilterConfigProps {
  readonly isExtension: boolean;
  readonly roomZone: string;
  readonly setRoomZone: (val: string) => void;
  readonly roomType: string;
  readonly setRoomType: (val: string) => void;
  readonly roomAC: string;
  readonly setRoomAC: (val: string) => void;
  readonly setFormData: Step2AssetFormProps['setFormData'];
}

export interface RoomListSectionProps {
  readonly roomZone: string;
  readonly roomType: string;
  readonly roomAC: string;
  readonly availableAssets: Asset[];
  readonly isExtension: boolean;
  readonly formData: Step2AssetFormProps['formData'];
  readonly setFormData: Step2AssetFormProps['setFormData'];
}

export interface RoomDetailsScheduleProps {
  readonly selectedAsset: Asset;
  readonly formData: Step2AssetFormProps['formData'];
  readonly handleChange: Step2AssetFormProps['handleChange'];
  readonly isExtension: boolean;
  readonly totalMalam: number;
  readonly specificNeeds: Step2AssetFormProps['specificNeeds'];
  readonly handleNeedsChange: Step2AssetFormProps['handleNeedsChange'];
}

export interface RoomFormSectionProps {
  readonly formData: Step2AssetFormProps['formData'];
  readonly setFormData: Step2AssetFormProps['setFormData'];
  readonly handleChange: Step2AssetFormProps['handleChange'];
  readonly availableAssets: Step2AssetFormProps['availableAssets'];
  readonly selectedAsset: Asset | undefined;
  readonly isExtension: boolean;
  readonly roomZone: string;
  readonly setRoomZone: (val: string) => void;
  readonly roomType: string;
  readonly setRoomType: (val: string) => void;
  readonly roomAC: string;
  readonly setRoomAC: (val: string) => void;
  readonly totalMalam: number;
  readonly specificNeeds: Step2AssetFormProps['specificNeeds'];
  readonly handleNeedsChange: Step2AssetFormProps['handleNeedsChange'];
}
