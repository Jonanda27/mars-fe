"use client";

import React, { useEffect, useState } from 'react';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types/tenant';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';
import { TenantTable } from './components/TenantTable';
import { TenantDetailModal } from './components/TenantDetailModal';
import { RejectReasonModal } from './components/RejectReasonModal';

export default function VerifikasiTenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const isSuperAdmin = ['superadmin', 'admin', 'dinas'].includes(user?.role?.toLowerCase() || '');

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTenantId, setRejectTenantId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantService.getTenants();
      setTenants(data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal memuat data tenant'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const isDokumenLengkap = (tenant: Tenant | null) => {
    if (!tenant?.legalitas) return false;
    const reqDocs = ['nib', 'npwp', 'akta'];
    if (tenant.jenis_tenant === 'Maskapai') {
      reqDocs.push('aoc');
    }
    return reqDocs.every((doc) => Object.keys(tenant.legalitas!).includes(doc));
  };

  const handleVerify = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin memverifikasi tenant ini?')) {
      try {
        await tenantService.verifyTenant(id, 'Verified');
        toast.success('Tenant berhasil diverifikasi');
        fetchTenants();
      } catch (err: any) {
        toast.error(getErrorMessage(err, 'Gagal memverifikasi tenant'));
      }
    }
  };

  const handleReject = async (id: number) => {
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
      await tenantService.verifyTenant(rejectTenantId, 'Rejected', rejectReason);
      toast.success('Penolakan tenant berhasil dikirim');
      fetchTenants();
      setShowRejectModal(false);
      setRejectTenantId(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Gagal menolak tenant'));
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333]">
          Verifikasi Tenant <small className="text-[15px] font-light text-[#777] ml-2">Manajemen pendaftar</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Verifikasi Tenant</span>
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
        isSuperAdmin={isSuperAdmin}
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
        isSuperAdmin={isSuperAdmin}
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
