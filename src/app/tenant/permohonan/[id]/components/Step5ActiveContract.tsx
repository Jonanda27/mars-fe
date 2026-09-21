import React, { useState, useMemo } from 'react';
import { RentalApplication } from '@/types/rental';
import { calculateHangarRentalTotal } from '@/utils/aircraftTariff';
import dayjs from 'dayjs';

import { ContractHeroBanner } from './step5/ContractHeroBanner';
import { ContractAssetDetailCard } from './step5/ContractAssetDetailCard';
import { ContractOfficialDocumentsCard } from './step5/ContractOfficialDocumentsCard';
import { ContractBillingRulesCard } from './step5/ContractBillingRulesCard';
import { SkrdPreviewModal } from './step5/SkrdPreviewModal';

interface Step5ActiveContractProps {
  readonly app: RentalApplication;
  readonly tenantAircrafts?: any[];
  readonly allTenantAircrafts?: any[];
  readonly masterAircraftTypes?: any[];
}

export const Step5ActiveContract: React.FC<Step5ActiveContractProps> = ({ 
  app,
  tenantAircrafts = [],
  allTenantAircrafts = [],
  masterAircraftTypes = []
}) => {
  const [showSkrdModal, setShowSkrdModal] = useState(false);

  const isHangar = useMemo(() => Boolean(
    app.application_type?.toLowerCase().includes('hanggar') ||
    app.assets?.kategori?.toLowerCase().includes('hanggar') ||
    app.contracts?.contract_type === 'Payung'
  ), [app.application_type, app.assets?.kategori, app.contracts?.contract_type]);

  const skrdInvoice = useMemo(() => {
    return app.contracts?.invoices && app.contracts.invoices.length > 0 
      ? app.contracts.invoices[0] 
      : null;
  }, [app.contracts?.invoices]);

  // Ambil daftar pesawat yang disetujui
  const approvedAircrafts = useMemo(() => {
    if (app.specific_needs?.aircraft_details && Array.isArray(app.specific_needs.aircraft_details) && app.specific_needs.aircraft_details.length > 0) {
      return app.specific_needs.aircraft_details;
    }
    if (app.specific_needs?.aircraft_ids && Array.isArray(app.specific_needs.aircraft_ids)) {
      return app.specific_needs.aircraft_ids
        .map((idStr: string) => allTenantAircrafts.find(a => a.id.toString() === idStr) || tenantAircrafts.find(a => a.id.toString() === idStr))
        .filter(Boolean);
    }
    return [];
  }, [app.specific_needs?.aircraft_details, app.specific_needs?.aircraft_ids, allTenantAircrafts, tenantAircrafts]);

  const calculateAircraftArea = (aircraft: any) => {
    if (aircraft.custom_type_area) return Number.parseFloat(aircraft.custom_type_area.toString());
    if (aircraft.aircraft_types?.luas_efektif_m2) return Number.parseFloat(aircraft.aircraft_types.luas_efektif_m2.toString());
    if (aircraft.aircraft_type_id && masterAircraftTypes.length > 0) {
      const found = masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id);
      if (found?.luas_efektif_m2) return Number.parseFloat(found.luas_efektif_m2.toString());
    }
    return 0;
  };

  const totalArmadaArea = useMemo(() => {
    return approvedAircrafts.reduce((acc: number, ac: any) => acc + calculateAircraftArea(ac), 0);
  }, [approvedAircrafts, masterAircraftTypes]);

  const totalMalam = useMemo(() => {
    const start = app.start_date || app.contracts?.start_date;
    const end = app.end_date || app.contracts?.end_date;
    if (!start || !end) return 1;
    return Math.max(1, dayjs(end).diff(dayjs(start), 'day'));
  }, [app.start_date, app.end_date, app.contracts?.start_date, app.contracts?.end_date]);

  // Kalkulasi tarif sewa hanggar per unit pesawat per malam dari master tarif
  const hangarRentalCalc = useMemo(() => {
    return calculateHangarRentalTotal(approvedAircrafts, totalMalam);
  }, [approvedAircrafts, totalMalam]);

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Success Hero Banner */}
      <ContractHeroBanner
        isHangar={isHangar}
        app={app}
      />

      {/* 2. Main Content: Symmetrical 50/50 Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* === KOLOM KIRI (50%): OBJEK SEWA & ARMADA PESAWAT === */}
        <ContractAssetDetailCard
          app={app}
          isHangar={isHangar}
          totalMalam={totalMalam}
          approvedAircrafts={approvedAircrafts}
          totalArmadaArea={totalArmadaArea}
          hangarRentalCalc={hangarRentalCalc}
          calculateAircraftArea={calculateAircraftArea}
        />

        {/* === KOLOM KANAN (50%): DOKUMEN ACUAN, KETENTUAN TARIF & PANDUAN === */}
        <div className="space-y-6">
          <ContractOfficialDocumentsCard
            app={app}
            isHangar={isHangar}
          />

          <ContractBillingRulesCard
            app={app}
            isHangar={isHangar}
            approvedAircrafts={approvedAircrafts}
            hangarRentalCalc={hangarRentalCalc}
            skrdInvoice={skrdInvoice}
            onOpenSkrdModal={() => setShowSkrdModal(true)}
          />
        </div>
      </div>

      {/* MODAL E-SKRD */}
      <SkrdPreviewModal
        isOpen={showSkrdModal}
        skrdInvoice={skrdInvoice}
        onClose={() => setShowSkrdModal(false)}
      />
    </div>
  );
};

export default Step5ActiveContract;
