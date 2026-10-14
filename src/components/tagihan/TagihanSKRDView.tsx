"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, TowerControl } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { authService } from '@/services/authService';
import { Invoice } from '@/types/invoice';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import UnbilledHanggarTab from '@/app/admin/tagihan/components/UnbilledHanggarTab';
import UnbilledMiniAirportTab from '@/app/admin/tagihan/components/UnbilledMiniAirportTab';
import { TagihanTable } from './TagihanTable';
import { VerifyPaymentModal } from './modals/VerifyPaymentModal';
import { GeneratePenaltyModal } from './modals/GeneratePenaltyModal';
import { CancelInvoiceModal } from './modals/CancelInvoiceModal';
import { ReissueInvoiceModal } from './modals/ReissueInvoiceModal';
import { SKRDPreviewModal } from './modals/SKRDPreviewModal';
import { SSRDPreviewModal } from './modals/SSRDPreviewModal';
import { normalizeRole } from '@/utils/routeGuard';

interface TagihanSKRDViewProps {
  readonly role?: 'admin' | 'dinas';
}

export const TagihanSKRDView: React.FC<TagihanSKRDViewProps> = ({ role = 'admin' }) => {
  const [activeTab, setActiveTab] = useState<'terbit' | 'penetapan-hanggar' | 'penetapan-mini-airport'>('terbit');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingInvoice, setVerifyingInvoice] = useState<Invoice | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // SKRD Print Modal State
  const [showSkrdModal, setShowSkrdModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // SSRD Print Modal State (Lampiran III Perbup Mimika 25/2024)
  const [showSsrdModal, setShowSsrdModal] = useState(false);
  const [selectedSsrdInvoice, setSelectedSsrdInvoice] = useState<Invoice | null>(null);

  // SKRD Denda Modal State
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyTargetInvoice, setPenaltyTargetInvoice] = useState<Invoice | null>(null);
  const [penaltyRate, setPenaltyRate] = useState<number>(1);
  const [penaltyNotes, setPenaltyNotes] = useState<string>('');
  const [isSubmittingPenalty, setIsSubmittingPenalty] = useState(false);

  // SKRD Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTargetInvoice, setCancelTargetInvoice] = useState<Invoice | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // SKRD Reissue / Koreksi Modal State
  const [showReissueModal, setShowReissueModal] = useState(false);
  const [reissueTargetInvoice, setReissueTargetInvoice] = useState<Invoice | null>(null);
  const [reissueAmount, setReissueAmount] = useState<number>(0);
  const [reissueDueDate, setReissueDueDate] = useState<string>('');
  const [reissueReason, setReissueReason] = useState<string>('');
  const [isSubmittingReissue, setIsSubmittingReissue] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat daftar tagihan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const user = await authService.getMe();
      setCurrentUser(user);
    } catch {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch {}
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchInvoices();
  }, [fetchUserData, fetchInvoices]);

  const userRole = normalizeRole(currentUser?.role);
  const isMiniAdmin = userRole === 'admin_mini_airport' || Boolean(currentUser?.mini_airport_id);
  const isMozesAdmin = (userRole === 'admin' || ['admin_hanggar', 'admin_apron', 'admin_ruangan'].includes(userRole)) && !isMiniAdmin;
  const isDinas = role === 'dinas' || ['dinas', 'kepala dinas'].includes(userRole);

  useEffect(() => {
    if (isMiniAdmin && activeTab === 'penetapan-hanggar') {
      setActiveTab('penetapan-mini-airport');
    }
  }, [isMiniAdmin, activeTab]);

  const handleVerify = async (id: number, payload?: { amount_paid?: number; notes?: string }) => {
    try {
      setIsVerifying(true);
      await invoiceService.verifyPayment(id, payload);
      toast.success('Verifikasi setoran berhasil disahkan dan dibukukan.');
      setShowVerifyModal(false);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi';
      toast.error(`Gagal memverifikasi: ${msg}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      setIsVerifying(true);
      await invoiceService.rejectPayment(id, reason);
      toast.success('Bukti setoran ditolak dengan catatan.');
      setShowVerifyModal(false);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal menolak bukti pembayaran';
      toast.error(`Gagal menolak: ${msg}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenPenaltyModal = (inv: Invoice) => {
    setPenaltyTargetInvoice(inv);
    setPenaltyRate(1);
    const dueDateStr = inv.due_date ? dayjs(inv.due_date).format('DD-MM-YYYY') : '';
    setPenaltyNotes(`Denda keterlambatan atas SKRD ${inv.invoice_number} (Jatuh tempo: ${dueDateStr})`);
    setShowPenaltyModal(true);
  };

  const handleSubmitPenalty = async () => {
    if (!penaltyTargetInvoice) return;
    try {
      setIsSubmittingPenalty(true);
      await invoiceService.generatePenaltyInvoice(penaltyTargetInvoice.id, {
        rate_percent_per_month: Number(penaltyRate) || 1,
        notes: penaltyNotes
      });
      toast.success('SKRD Denda Keterlambatan (4.1.4.01.01) berhasil diterbitkan!');
      setShowPenaltyModal(false);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal menerbitkan SKRD Denda';
      toast.error(msg);
    } finally {
      setIsSubmittingPenalty(false);
    }
  };

  const handleOpenCancelModal = (inv: Invoice) => {
    setCancelTargetInvoice(inv);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleSubmitCancel = async () => {
    if (!cancelTargetInvoice) return;
    if (!cancelReason.trim()) {
      toast.error('Harap masukkan alasan pembatalan / koreksi SKRD');
      return;
    }
    try {
      setIsSubmittingCancel(true);
      await invoiceService.cancelInvoice(cancelTargetInvoice.id, cancelReason);
      toast.success(`SKRD ${cancelTargetInvoice.invoice_number} berhasil dibatalkan.`);
      setShowCancelModal(false);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal membatalkan SKRD';
      toast.error(msg);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleOpenReissueModal = (inv: Invoice) => {
    setReissueTargetInvoice(inv);
    setReissueAmount(Number(inv.amount) || 0);
    setReissueDueDate(inv.due_date ? dayjs(inv.due_date).format('YYYY-MM-DD') : dayjs().add(30, 'day').format('YYYY-MM-DD'));
    setReissueReason('');
    setShowReissueModal(true);
  };

  const handleSubmitReissue = async () => {
    if (!reissueTargetInvoice) return;
    if (!reissueReason.trim()) {
      toast.error('Harap masukkan alasan koreksi penetapan SKRD');
      return;
    }
    if (!reissueAmount || reissueAmount <= 0) {
      toast.error('Nominal ketetapan baru harus lebih besar dari Rp 0');
      return;
    }
    try {
      setIsSubmittingReissue(true);
      await invoiceService.reissueInvoice(reissueTargetInvoice.id, {
        new_amount: Number(reissueAmount),
        new_due_date: reissueDueDate,
        reason: reissueReason
      });
      toast.success('SKRD Pengganti (Koreksi) berhasil diterbitkan! SKRD lama telah dibatalkan.');
      setShowReissueModal(false);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal menerbitkan SKRD Pengganti';
      toast.error(msg);
    } finally {
      setIsSubmittingReissue(false);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Tagihan e-SKRD{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">
              {role === 'dinas' ? 'Dinas Perhubungan Kab. Mimika' : (isMiniAdmin ? (currentUser?.airport_name || 'Mini Airport') : 'Bandara Mozes Kilangin')}
            </span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">{role === 'dinas' ? 'Dinas' : (isMiniAdmin ? 'Admin Mini Airport' : 'Admin')}</span> / <span className="ml-1 font-medium">Tagihan e-SKRD</span>
        </div>
      </header>

      {/* Navigasi Tab */}
      <div className="flex border-b border-slate-300 mb-4 bg-white px-2 pt-2 rounded-t shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('terbit')}
          className={`py-2.5 px-5 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'terbit'
              ? 'border-[#3c8dbc] text-[#3c8dbc] bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Daftar SKRD Terbit ({invoices.length})
        </button>

        {!isMiniAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('penetapan-hanggar')}
            className={`py-2.5 px-5 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'penetapan-hanggar'
                ? 'border-[#3c8dbc] text-[#3c8dbc] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#3c8dbc]"></span>
            {isDinas ? 'Penetapan SKRD Hanggar (Unbilled Roster)' : 'Antrean SKRD Dinas (Roster Hanggar)'}
          </button>
        )}

        {!isMozesAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('penetapan-mini-airport')}
            className={`py-2.5 px-5 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'penetapan-mini-airport'
                ? 'border-[#00a65a] text-[#00a65a] bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TowerControl className="w-4 h-4 text-[#00a65a]" />
            {isDinas ? 'Penetapan SKRD Mini Airport' : 'Antrean SKRD Dinas (Pasca-Checkout)'}
          </button>
        )}
      </div>

      {activeTab === 'penetapan-hanggar' ? (
        <UnbilledHanggarTab 
          isDinas={isDinas}
          onInvoiceGenerated={fetchInvoices}
          onViewInvoice={(inv) => {
            setSelectedInvoice(inv);
            setShowSkrdModal(true);
          }}
        />
      ) : activeTab === 'penetapan-mini-airport' ? (
        <UnbilledMiniAirportTab 
          onInvoiceGenerated={fetchInvoices}
          isDinas={isDinas}
        />
      ) : (
        <TagihanTable
          invoices={invoices}
          isLoading={isLoading}
          isDinas={isDinas}
          onOpenVerify={(inv) => {
            setVerifyingInvoice(inv);
            setShowVerifyModal(true);
          }}
          onOpenSkrd={(inv) => {
            setSelectedInvoice(inv);
            setShowSkrdModal(true);
          }}
          onOpenSsrd={(inv) => {
            setSelectedSsrdInvoice(inv);
            setShowSsrdModal(true);
          }}
          onOpenPenalty={handleOpenPenaltyModal}
          onOpenReissue={handleOpenReissueModal}
          onOpenCancel={handleOpenCancelModal}
        />
      )}

      {/* MODAL VERIFIKASI PEMBAYARAN */}
      <VerifyPaymentModal
        isOpen={showVerifyModal}
        invoice={verifyingInvoice}
        isVerifying={isVerifying}
        onClose={() => setShowVerifyModal(false)}
        onVerify={handleVerify}
        onReject={handleReject}
        onScanSuccess={fetchInvoices}
      />

      {/* MODAL PENERBITAN SKRD DENDA (OTORITAS DINAS) */}
      <GeneratePenaltyModal
        isOpen={showPenaltyModal}
        targetInvoice={penaltyTargetInvoice}
        penaltyRate={penaltyRate}
        setPenaltyRate={setPenaltyRate}
        penaltyNotes={penaltyNotes}
        setPenaltyNotes={setPenaltyNotes}
        isSubmitting={isSubmittingPenalty}
        onClose={() => setShowPenaltyModal(false)}
        onSubmit={handleSubmitPenalty}
      />

      {/* MODAL PEMBATALAN / KOREKSI SKRD (OTORITAS DINAS) */}
      <CancelInvoiceModal
        isOpen={showCancelModal}
        targetInvoice={cancelTargetInvoice}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        isSubmitting={isSubmittingCancel}
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleSubmitCancel}
      />

      {/* MODAL KOREKSI & PENERBITAN SKRD PENGGANTI (Slide 6 PPTX) */}
      <ReissueInvoiceModal
        isOpen={showReissueModal}
        targetInvoice={reissueTargetInvoice}
        reissueAmount={reissueAmount}
        setReissueAmount={setReissueAmount}
        reissueDueDate={reissueDueDate}
        setReissueDueDate={setReissueDueDate}
        reissueReason={reissueReason}
        setReissueReason={setReissueReason}
        isSubmitting={isSubmittingReissue}
        onClose={() => setShowReissueModal(false)}
        onSubmit={handleSubmitReissue}
      />

      {/* MODAL E-SKRD PREVIEW */}
      <SKRDPreviewModal
        isOpen={showSkrdModal}
        invoice={selectedInvoice}
        onClose={() => setShowSkrdModal(false)}
      />

      {/* MODAL E-SSRD PREVIEW (Surat Setoran Retribusi Daerah - Lampiran III Perbup Mimika 25/2024) */}
      <SSRDPreviewModal
        isOpen={showSsrdModal}
        invoice={selectedSsrdInvoice}
        onClose={() => {
          setShowSsrdModal(false);
          setSelectedSsrdInvoice(null);
        }}
      />
    </div>
  );
};

export default TagihanSKRDView;
