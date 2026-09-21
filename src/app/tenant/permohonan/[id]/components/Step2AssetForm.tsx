import React from 'react';
import { MapPin, AlertCircle, Loader2, Save } from 'lucide-react';
import dayjs from 'dayjs';
import { Step2AssetFormProps } from './step2/types';
import { calculateAircraftArea } from './step2/utils';
import { HangarFormSection } from './step2/HangarFormSection';
import { RoomFormSection } from './step2/RoomFormSection';

// Re-export for backward compatibility
export { calculateAircraftArea };
export type { Step2AssetFormProps };

export const Step2AssetForm: React.FC<Step2AssetFormProps> = ({
  formData,
  setFormData,
  specificNeeds,
  setSpecificNeeds,
  availableAssets,
  tenantAircrafts,
  assetCapacity,
  isExtension,
  roomZone,
  setRoomZone,
  roomType,
  setRoomType,
  roomAC,
  setRoomAC,
  masterAircraftTypes,
  handleChange,
  handleNeedsChange,
  handleSubmitDetails,
  saving,
  setShowAircraftModal,
}) => {
  const isHangar = formData.application_type.toLowerCase().includes('hanggar');

  const calculateRequiredArea = () => {
    return specificNeeds.aircraft_ids.reduce((acc, idStr) => {
      const aircraft = tenantAircrafts.find(a => a.id.toString() === idStr);
      return acc + (aircraft ? calculateAircraftArea(aircraft, masterAircraftTypes) : 0);
    }, 0);
  };

  const calculateTotalMalam = () => {
    if (formData.start_date && formData.end_date) {
      const start = dayjs(formData.start_date);
      const end = dayjs(formData.end_date);
      const diff = end.diff(start, 'day');
      return Math.max(0, diff);
    }
    return 0;
  };

  const requiredArea = calculateRequiredArea();
  const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;
  const totalMalam = calculateTotalMalam();
  const selectedAsset = availableAssets.find(a => a.id.toString() === formData.asset_id);

  return (
    <form onSubmit={handleSubmitDetails} className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-none mb-8">
      <div className="p-4 border-b border-[#f4f4f4] bg-slate-50">
        <h3 className="text-[16px] text-[#444] font-bold flex items-center mb-1">
          <MapPin className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Lengkapi Detail Layanan Sewa
        </h3>
        <p className="text-[13px] text-slate-500 ml-7">Surat Anda telah disetujui. Silakan pilih aset dan jadwalkan penyewaan.</p>
      </div>
        
      <div className="p-6 md:p-8">
        {isHangar ? (
          <HangarFormSection
            formData={formData}
            handleChange={handleChange}
            availableAssets={availableAssets}
            selectedAsset={selectedAsset}
            assetCapacity={assetCapacity}
            isOverCapacity={isOverCapacity}
            requiredArea={requiredArea}
            isExtension={isExtension}
            totalMalam={totalMalam}
            specificNeeds={specificNeeds}
            setSpecificNeeds={setSpecificNeeds}
            handleNeedsChange={handleNeedsChange}
            tenantAircrafts={tenantAircrafts}
            masterAircraftTypes={masterAircraftTypes}
            setShowAircraftModal={setShowAircraftModal}
          />
        ) : (
          <RoomFormSection
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            availableAssets={availableAssets}
            selectedAsset={selectedAsset}
            isExtension={isExtension}
            roomZone={roomZone}
            setRoomZone={setRoomZone}
            roomType={roomType}
            setRoomType={setRoomType}
            roomAC={roomAC}
            setRoomAC={setRoomAC}
            totalMalam={totalMalam}
            specificNeeds={specificNeeds}
            handleNeedsChange={handleNeedsChange}
          />
        )}

        {/* Actions */}
        <div className="pt-6 border-t border-slate-200 mt-6">
          {isHangar && specificNeeds.aircraft_ids.length === 0 && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center text-red-600 bg-red-50 px-4 py-2.5 rounded-none border border-red-200 shadow-sm max-w-lg">
                <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                <p className="text-[13px] font-medium leading-tight">
                  Anda wajib menambahkan dan mencentang minimal 1 armada pesawat untuk menyewa fasilitas Hanggar.
                </p>
              </div>
            </div>
          )}
          {isHangar && isOverCapacity && specificNeeds.aircraft_ids.length > 0 && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center text-red-600 bg-red-50 px-4 py-2.5 rounded-none border border-red-200 shadow-sm max-w-lg">
                <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                <p className="text-[13px] font-medium leading-tight">
                  Total luas armada pesawat yang dipilih melebihi sisa kapasitas Hanggar yang tersedia.
                </p>
              </div>
            </div>
          )}
          {!isHangar && !formData.asset_id && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center text-amber-700 bg-amber-50 px-4 py-2.5 rounded-none border border-amber-200 shadow-sm max-w-lg">
                <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0" />
                <p className="text-[13px] font-medium leading-tight">
                  Silakan pilih preferensi ruangan dan klik salah satu ruangan yang tersedia sebelum melanjutkan.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={saving || !formData.asset_id || (isHangar && isOverCapacity) || (isHangar && specificNeeds.aircraft_ids.length === 0)}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-2.5 px-8 rounded-none text-[14px] font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Detail Layanan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Step2AssetForm;
