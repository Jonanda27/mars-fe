import React from 'react';
import { RoomFormSectionProps } from './types';
import { RoomFilterConfig } from './RoomFilterConfig';
import { RoomListSection } from './RoomListSection';
import { RoomDetailsSchedule } from './RoomDetailsSchedule';

export const RoomFormSection: React.FC<RoomFormSectionProps> = (props) => (
  <div className="space-y-8">
    <RoomFilterConfig
      isExtension={props.isExtension}
      roomZone={props.roomZone}
      setRoomZone={props.setRoomZone}
      roomType={props.roomType}
      setRoomType={props.setRoomType}
      roomAC={props.roomAC}
      setRoomAC={props.setRoomAC}
      setFormData={props.setFormData}
    />
    <RoomListSection
      roomZone={props.roomZone}
      roomType={props.roomType}
      roomAC={props.roomAC}
      availableAssets={props.availableAssets}
      isExtension={props.isExtension}
      formData={props.formData}
      setFormData={props.setFormData}
    />
    {props.selectedAsset && (
      <RoomDetailsSchedule
        selectedAsset={props.selectedAsset}
        formData={props.formData}
        handleChange={props.handleChange}
        isExtension={props.isExtension}
        totalMalam={props.totalMalam}
        specificNeeds={props.specificNeeds}
        handleNeedsChange={props.handleNeedsChange}
      />
    )}
  </div>
);
