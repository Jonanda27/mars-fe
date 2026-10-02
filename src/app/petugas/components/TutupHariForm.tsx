"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, Loader2, CheckCircle2 
} from 'lucide-react';
import { overnightReportService, OvernightItem, DraftRosterResponse } from '@/services/overnightReportService';
import { tenantService } from '@/services/tenantService';
import { assetService } from '@/services/assetService';
import Link from 'next/link';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { TutupHariStatsCards } from './tutup-hari/TutupHariStatsCards';
import { OvernightChecklistTable } from './tutup-hari/OvernightChecklistTable';
import { ShiftDocumentationCard } from './tutup-hari/ShiftDocumentationCard';
import { AddManualAircraftModal } from './tutup-hari/AddManualAircraftModal';

interface TutupHariFormProps {
  onSuccess: () => void;
}

export const TutupHariForm: React.FC<TutupHariFormProps> = ({ onSuccess }) => {
  const [reportDate, setReportDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [rosterItems, setRosterItems] = useState<OvernightItem[]>([]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [generalPhoto, setGeneralPhoto] = useState<File | null>(null);
  const [generalPhotoPreview, setGeneralPhotoPreview] = useState<string | null>(null);

  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  // For Manual Add Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualReg, setManualReg] = useState('');
  const [manualTenantId, setManualTenantId] = useState<string>('');
  const [manualAssetId, setManualAssetId] = useState<string>('');
  const [manualType, setManualType] = useState('');
  const [manualLocation, setManualLocation] = useState('Hanggar');
  const [manualPhoto, setManualPhoto] = useState<File | null>(null);
  const [manualPhotoPreview, setManualPhotoPreview] = useState<string | null>(null);
  const [manualNotes, setManualNotes] = useState('');

  const [tenantsList, setTenantsList] = useState<any[]>([]);
  const [assetsList, setAssetsList] = useState<any[]>([]);

  const fetchDropdowns = async () => {
    try {
      const [tRes, aRes] = await Promise.all([
        tenantService.getTenants().catch((err) => {
          console.warn('Could not fetch tenants list:', err);
          return [];
        }),
        assetService.getAssets().catch((err) => {
          console.warn('Could not fetch assets list:', err);
          return [];
        })
      ]);
      setTenantsList(tRes || []);
      setAssetsList(aRes?.filter((a: any) => a.jenis_aset === 'Hanggar' || a.jenis_aset === 'Apron') || []);
    } catch (err) {
      console.error('Failed to load dropdowns:', err);
    }
  };

  const fetchDraftRoster = useCallback(async (date: string) => {
    try {
      setLoadingDraft(true);
      const data: DraftRosterResponse = await overnightReportService.getTodayDraftRoster(date);
      setIsAlreadySubmitted(data.is_already_submitted);
      
      if (data.is_already_submitted && data.existing_report) {
        // Jika laporan tanggal ini sudah pernah disubmit, tampilkan data yang tersimpan di database
        const submittedItems: OvernightItem[] = (data.existing_report.items || []).map((item: any) => ({
          operational_log_id: item.operational_log_id,
          registration_number: item.registration_number,
          tenant_id: item.tenant_id,
          tenant_name: item.tenant?.nama_perusahaan || item.tenant_name || '-',
          asset_id: item.asset_id,
          asset_name: item.asset?.nama_aset || item.asset_name || '-',
          parking_location: item.parking_location,
          aircraft_type: item.aircraft_type,
          is_adhoc: item.is_adhoc,
          is_staying: true,
          photo_file: null,
          photo_preview: item.evidence_photo || null,
          evidence_photo: item.evidence_photo,
          notes: item.notes || ''
        }));
        setRosterItems(submittedItems);
        setGeneralNotes(data.existing_report.general_notes || '');
        setGeneralPhotoPreview(data.existing_report.general_evidence_photo || null);
      } else {
        // Untuk draft tutup hari baru: foto fisik setiap hari wajib baru (jangan lampirkan foto kemarin/sebelumnya)
        const initialItems: OvernightItem[] = (data.candidate_roster || []).map((item) => ({
          ...item,
          photo_file: null,
          photo_preview: null,
          evidence_photo: null,
          is_staying: true,
          notes: ''
        }));

        setRosterItems(initialItems);
        setGeneralNotes('');
        setGeneralPhoto(null);
        setGeneralPhotoPreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat kandidat armada untuk tutup hari');
    } finally {
      setLoadingDraft(false);
    }
  }, []);

  useEffect(() => {
    fetchDraftRoster(reportDate);
    fetchDropdowns();
  }, [reportDate, fetchDraftRoster]);

  const handleToggleStaying = (index: number) => {
    setRosterItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, is_staying: !item.is_staying } : item))
    );
  };

  const handleItemPhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRosterItems((prev) =>
          prev.map((item, idx) =>
            idx === index
              ? { ...item, photo_file: file, photo_preview: reader.result as string }
              : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemNotesChange = (index: number, val: string) => {
    setRosterItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, notes: val } : item))
    );
  };

  const handleGeneralPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGeneralPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneralPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setManualPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddManualAircraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReg || !manualPhoto) {
      toast.error('Nomor Registrasi dan Foto Bukti Fisik wajib diisi!');
      return;
    }

    const selectedTenant = tenantsList.find((t) => t.id.toString() === manualTenantId);
    const selectedAsset = assetsList.find((a) => a.id.toString() === manualAssetId);

    const newItem: OvernightItem = {
      registration_number: manualReg.toUpperCase().trim(),
      tenant_id: manualTenantId ? Number.parseInt(manualTenantId, 10) : undefined,
      tenant_name: selectedTenant ? selectedTenant.nama_perusahaan : 'Maskapai Insidentil / Umum',
      asset_id: manualAssetId ? Number.parseInt(manualAssetId, 10) : undefined,
      asset_name: selectedAsset ? selectedAsset.nama_aset : 'Hanggar / Apron',
      aircraft_type: manualType || 'Pesawat Insidentil',
      parking_location: manualLocation,
      photo_file: manualPhoto,
      photo_preview: manualPhotoPreview,
      is_adhoc: true,
      is_staying: true,
      notes: manualNotes
    };

    setRosterItems((prev) => [...prev, newItem]);
    toast.success(`Pesawat ${newItem.registration_number} berhasil ditambahkan ke daftar malam ini!`);

    // Reset manual form
    setManualReg('');
    setManualTenantId('');
    setManualAssetId('');
    setManualType('');
    setManualLocation('Hanggar');
    setManualPhoto(null);
    setManualPhotoPreview(null);
    setManualNotes('');
    setShowManualModal(false);
  };

  const handleRemoveManualItem = (index: number) => {
    setRosterItems((prev) => prev.filter((_, idx) => idx !== index));
    toast.success('Armada manual dihapus dari daftar');
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    const stayingList = rosterItems.filter((i) => i.is_staying);
    if (stayingList.length === 0) {
      toast.error('Pilih minimal satu armada yang menginap malam ini.');
      return;
    }

    // Validate mandatory photos
    const missingPhotos = stayingList.filter(
      (item) => !item.photo_file && !item.photo_preview && !item.evidence_photo
    );
    if (missingPhotos.length > 0) {
      toast.error(
        `Wajib upload foto bukti fisik untuk: ${missingPhotos.map((m) => m.registration_number).join(', ')}`
      );
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('report_date', reportDate);
      formData.append('general_notes', generalNotes);

      if (generalPhoto) {
        formData.append('general_photo', generalPhoto);
      }

      const itemsPayload = stayingList.map((item, idx) => {
        const photoKey = `photo_${idx}`;
        if (item.photo_file) {
          formData.append(photoKey, item.photo_file);
        }
        return {
          operational_log_id: item.operational_log_id,
          registration_number: item.registration_number,
          tenant_id: item.tenant_id,
          asset_id: item.asset_id,
          aircraft_type: item.aircraft_type,
          parking_location: item.parking_location,
          is_adhoc: item.is_adhoc,
          notes: item.notes,
          photo_key: photoKey,
          existing_photo: item.photo_preview?.startsWith('http') ? item.photo_preview : undefined
        };
      });

      formData.append('items_json', JSON.stringify(itemsPayload));

      await overnightReportService.submitDailyOvernightReport(formData);
      toast.success('Laporan Tutup Hari berhasil disubmit & diverifikasi!');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Gagal submit laporan tutup hari');
    } finally {
      setSubmitting(false);
    }
  };

  const totalStaying = rosterItems.filter((i) => i.is_staying).length;
  const activeLogCount = rosterItems.filter((i) => !i.is_adhoc && i.is_staying).length;
  const manualCount = rosterItems.filter((i) => i.is_adhoc && i.is_staying).length;

  return (
    <div className="space-y-4">
      {/* 1. STATS & DATE BAR */}
      <TutupHariStatsCards
        totalStaying={totalStaying}
        activeLogCount={activeLogCount}
        manualCount={manualCount}
        reportDate={reportDate}
        setReportDate={setReportDate}
        isAlreadySubmitted={isAlreadySubmitted}
      />

      {/* 2. MAIN FORM */}
      {loadingDraft ? (
        <div className="bg-white p-12 text-center border-t-[3px] border-[#3c8dbc] shadow-xs flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-7 h-7 text-[#3c8dbc] animate-spin" />
          <span className="text-xs text-slate-600 font-medium">Menyiapkan daftar kandidat pesawat di hanggar...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmitReport} className="space-y-4">
          {/* CARD 1: DAFTAR CHECKLIST ARMADA */}
          <OvernightChecklistTable
            rosterItems={rosterItems}
            totalStaying={totalStaying}
            onOpenManualModal={() => setShowManualModal(true)}
            onToggleStaying={handleToggleStaying}
            onItemPhotoChange={handleItemPhotoChange}
            onItemNotesChange={handleItemNotesChange}
            onRemoveManualItem={handleRemoveManualItem}
          />

          {/* CARD 2: CATATAN SHIFT & FOTO HANGGAR KESELURUHAN */}
          <ShiftDocumentationCard
            generalNotes={generalNotes}
            setGeneralNotes={setGeneralNotes}
            generalPhoto={generalPhoto}
            generalPhotoPreview={generalPhotoPreview}
            onGeneralPhotoChange={handleGeneralPhotoChange}
          />

          {/* CARD 3: ACTION BAR & SUBMIT */}
          <div className="bg-white border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3c8dbc] flex-shrink-0" />
              <span>
                Total <strong>{totalStaying} Armada</strong> terverifikasi menginap untuk dasar kalkulasi tarif inap malam.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                href="/petugas/riwayat"
                className="px-4 py-2 border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Lihat Riwayat
              </Link>
              
              <button
                type="submit"
                disabled={submitting || totalStaying === 0}
                className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan Laporan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Simpan &amp; Sahkan Laporan Tutup Hari
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: Tambah Pesawat Manual */}
      <AddManualAircraftModal
        isOpen={showManualModal}
        manualReg={manualReg}
        setManualReg={setManualReg}
        manualTenantId={manualTenantId}
        setManualTenantId={setManualTenantId}
        manualType={manualType}
        setManualType={setManualType}
        manualLocation={manualLocation}
        setManualLocation={setManualLocation}
        manualPhoto={manualPhoto}
        manualPhotoPreview={manualPhotoPreview}
        onManualPhotoChange={handleManualPhotoChange}
        manualNotes={manualNotes}
        setManualNotes={setManualNotes}
        tenantsList={tenantsList}
        onClose={() => setShowManualModal(false)}
        onSubmit={handleAddManualAircraft}
      />
    </div>
  );
};

export default TutupHariForm;
