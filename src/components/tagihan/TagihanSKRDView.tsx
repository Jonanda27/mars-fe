"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { authService } from '@/services/authService';
import { Invoice } from '@/types/invoice';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import UnbilledHanggarTab from '@/app/admin/tagihan/components/UnbilledHanggarTab';
import { TagihanTable } from './TagihanTable';
import { VerifyPaymentModal } from './modals/VerifyPaymentModal';
import { GeneratePenaltyModal } from './modals/GeneratePenaltyModal';
import { CancelInvoiceModal } from './modals/CancelInvoiceModal';
import { ReissueInvoiceModal } from './modals/ReissueInvoiceModal';
import { SKRDPreviewModal } from './modals/SKRDPreviewModal';

interface TagihanSKRDViewProps {
  readonly role?: 'admin' | 'dinas';
}

export const TagihanSKRDView: React.FC<TagihanSKRDViewProps> = ({ role = 'admin' }) => {
  const [activeTab, setActiveTab] = useState<'terbit' | 'penetapan-hanggar'>('terbit');
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

  // SKRD Denda Modal State
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyTargetInvoice, setPenaltyTargetInvoice] = useState<Invoice | null>(null);
  const [penaltyRate, setPenaltyRate] = useState<number>(2);
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

  const userRole = (currentUser?.role || '').toLowerCase();
  const isDinas = role === 'dinas' || ['dinas', 'kepala dinas'].includes(userRole);

  const handleVerify = async (id: number) => {
    if (!confirm('Anda yakin ingin memverifikasi dan melunaskan tagihan ini?')) return;
    try {
      setIsVerifying(true);
      await invoiceService.verifyPayment(id);
      toast.success('Verifikasi berhasil, status tagihan menjadi Lunas (Paid).');
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

  const handleOpenPenaltyModal = (inv: Invoice) => {
    setPenaltyTargetInvoice(inv);
    setPenaltyRate(2);
    const dueDateStr = inv.due_date ? dayjs(inv.due_date).format('DD-MM-YYYY') : '';
    setPenaltyNotes(`Denda keterlambatan atas SKRD ${inv.invoice_number} (Jatuh tempo: ${dueDateStr})`);
    setShowPenaltyModal(true);
  };

  const handleSubmitPenalty = async () => {
    if (!penaltyTargetInvoice) return;
    try {
      setIsSubmittingPenalty(true);
      await invoiceService.generatePenaltyInvoice(penaltyTargetInvoice.id, {
        rate_percent_per_month: Number(penaltyRate) || 2,
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
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333]">
            Tagihan e-SKRD <small className="text-[15px] font-light text-[#777] ml-2">Manajemen &amp; Monitoring Pembayaran</small>
          </h1>
          {isDinas && (
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                Otoritas Dinas Aktif: Penerbitan SKRD Denda &amp; Pembatalan SKRD Diizinkan
              </span>
            </div>
          )}
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">{role === 'dinas' ? 'Dinas Portal' : 'Admin Portal'}</span> / <span className="ml-1 font-medium">Tagihan e-SKRD</span>
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

        <button
          type="button"
          onClick={() => setActiveTab('penetapan-hanggar')}
          className={`py-2.5 px-5 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'penetapan-hanggar'
              ? 'border-[#3c8dbc] text-[#3c8dbc] bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Penetapan SKRD Hanggar (Unbilled Roster)
        </button>
      </div>

      {activeTab === 'penetapan-hanggar' ? (
        <UnbilledHanggarTab 
          onInvoiceGenerated={fetchInvoices}
          onViewInvoice={(inv) => {
            setSelectedInvoice(inv);
            setShowSkrdModal(true);
          }}
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
    </div>
  );
};

export default TagihanSKRDView;
