"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { tenantService } from '@/services/tenantService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';
import { ProfileStatusAlert } from './components/ProfileStatusAlert';
import { CompanyProfileCard } from './components/CompanyProfileCard';
import { LegalDocumentsCard } from './components/LegalDocumentsCard';
import { EditProfileModal, EditProfileFormData } from './components/EditProfileModal';

export default function ProfilLegalitasPage() {
  const { user, syncUser } = useAuthStore();
  const [tenantData, setTenantData] = useState<any>(null);
  const actualStatus = tenantData?.status_verifikasi || user?.status_verifikasi;

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditProfileFormData>({
    nib: '',
    npwp: '',
    pic: '',
    nomor_telepon: '',
    email: '',
    alamat: '',
  });

  useEffect(() => {
    if (user?.tenant_id) {
      tenantService
        .getTenantById(user.tenant_id)
        .then((data) => {
          setTenantData(data);
          setEditForm({
            nib: data.nib || '',
            npwp: data.npwp || '',
            pic: data.pic || '',
            nomor_telepon: data.nomor_telepon || '',
            email: data.email || '',
            alamat: data.alamat || '',
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleEditSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user?.tenant_id) return;

    setIsSaving(true);
    try {
      const updatedData = await tenantService.updateProfile(user.tenant_id, editForm);
      setTenantData(updatedData);
      await syncUser();
      setIsEditModalOpen(false);
      toast.success('Data profil berhasil diperbarui!');
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Gagal memperbarui data profil'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.tenant_id) return;

    setIsUploading(docType);
    try {
      await tenantService.uploadLegalitas(user.tenant_id, docType, file);
      // Refresh data
      const updatedData = await tenantService.getTenantById(user.tenant_id);
      setTenantData(updatedData);
      await syncUser();
      toast.success('Dokumen berhasil diunggah!');
    } catch (err: any) {
      toast.error('Gagal mengunggah dokumen: ' + getErrorMessage(err));
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
          Profil Perusahaan <span className="text-[15px] font-light text-[#777] ml-2">Identitas & Legalitas</span>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Profil</span>
        </div>
      </header>

      {/* Info Status Alert */}
      <ProfileStatusAlert
        status={actualStatus}
        alasanPenolakan={tenantData?.alasan_penolakan}
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        {/* Kolom Kiri: Profil Identitas */}
        <div className="flex-1 lg:w-[40%] flex flex-col gap-4">
          <CompanyProfileCard
            tenantData={tenantData}
            userTenantIdStr={user?.tenant_id_str}
            onOpenEditModal={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* Kolom Kanan: Dokumen Legalitas */}
        <div className="flex-1 lg:w-[60%] flex flex-col gap-4">
          <LegalDocumentsCard
            tenantData={tenantData}
            statusVerifikasi={tenantData?.status_verifikasi}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>

      {/* Modal Edit Profil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editForm={editForm}
        onFormChange={setEditForm}
        onSubmit={handleEditSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}
