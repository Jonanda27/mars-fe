"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';
import { TenantTable } from '@/app/admin/verifikasi/components/TenantTable';
import { TenantDetailModal } from '@/app/admin/verifikasi/components/TenantDetailModal';
import { RejectReasonModal } from '@/app/admin/verifikasi/components/RejectReasonModal';
import { isAdminRole } from '@/utils/routeGuard';

export interface VerifikasiMitraViewProps {
  portalType: 'admin' | 'dinas';
  portalSubtitle?: string;
  breadcrumbTitle?: string;
}

export default function VerifikasiMitraView({
  portalType,
  portalSubtitle,
  breadcrumbTitle = 'Verifikasi Mitra',
}: Readonly<VerifikasiMitraViewProps>) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  // Memastikan semua sub-role admin (admin, admin_hanggar, admin_apron, admin_ruangan, superadmin) dan dinas memiliki hak verifikasi
  const canVerify = isAdminRole(user?.role);

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTenantId, setRejectTenantId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchTenants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tenantService.getTenants();
      setTenants(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Gagal memuat data mitra/tenant'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const isDokumenLengkap = (tenant: Tenant | null): boolean => {
    if (!tenant?.legalitas) return false;
    const reqDocs = ['nib', 'npwp', 'akta'];
    if (tenant.jenis_tenant === 'Maskapai') {
      reqDocs.push('aoc');
    }
    return reqDocs.every((doc) => Boolean(tenant.legalitas?.[doc]));
  };

  const handleVerify = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin memverifikasi legalitas mitra ini?')) return;
    try {
      await tenantService.verifyTenant(id, 'Verified');
      toast.success('Legalitas mitra berhasil diverifikasi!');
      await fetchTenants();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal memverifikasi mitra'));
    }
  };

  const handleReject = (id: number) => {
    setRejectTenantId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectTenantId) return;
    if (!rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }

    try {
      await tenantService.verifyTenant(rejectTenantId, 'Rejected', rejectReason.trim());
      toast.success('Penolakan berkas mitra berhasil dikirim');
      setShowRejectModal(false);
      setRejectTenantId(null);
      await fetchTenants();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal menolak berkas mitra'));
    }
  };

  const defaultSubtitle =
    portalType === 'dinas'
      ? 'Dinas Perhubungan Kab. Mimika'
      : 'Unit Penyelenggara Bandar Udara (UPBU) Mozes Kilangin';

  const defaultPortalLabel = portalType === 'dinas' ? 'Dinas' : 'Admin';

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Verifikasi Mitra{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">
              {portalSubtitle || defaultSubtitle}
            </span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">{defaultPortalLabel}</span> /{' '}
          <span className="ml-1 font-medium">{breadcrumbTitle}</span>
        </div>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Main Tenant Table */}
      <TenantTable
        tenants={tenants}
        isLoading={isLoading}
        isSuperAdmin={canVerify}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onVerify={handleVerify}
        onReject={handleReject}
        onSelectTenant={(tenant) => {
          setSelectedTenant(tenant);
          setShowDetailModal(true);
        }}
        isDokumenLengkap={isDokumenLengkap}
      />

      {/* Modal Detail Tenant */}
      <TenantDetailModal
        tenant={selectedTenant}
        isOpen={showDetailModal && !!selectedTenant}
        onClose={() => setShowDetailModal(false)}
        isSuperAdmin={canVerify}
        isDokumenLengkap={isDokumenLengkap}
        onVerify={handleVerify}
        onReject={handleReject}
      />

      {/* Modal Reject Reason */}
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onSubmit={submitReject}
      />
    </div>
  );
}
