"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';

import { InvoiceSearchPanel } from './components/InvoiceSearchPanel';
import { PosCashierPanel } from './components/PosCashierPanel';

export default function AdminPembayaranKasirPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Selected Invoice
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Cashier State
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [uangDiterima, setUangDiterima] = useState<number | ''>('');
  const [edcReference, setEdcReference] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data tagihan e-SKRD");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const unpaidInvoices = invoices.filter(
    (inv) => inv.status !== 'Paid' && inv.status !== 'Lunas' && inv.status !== 'Dibatalkan' && inv.status !== 'Cancelled'
  );

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Masukkan nomor SKRD atau nama tenant untuk mencari");
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const found = invoices.find(
      (inv) =>
        inv.invoice_number?.toLowerCase().includes(q) ||
        inv.tenants?.nama_perusahaan?.toLowerCase().includes(q) ||
        inv.id?.toString() === q
    );

    if (found) {
      setSelectedInvoice(found);
      setIsPaid(found.status === 'Paid' || found.status === 'Lunas');
      setUangDiterima('');
      setEdcReference('');
      toast.success(`Ditemukan tagihan: ${found.invoice_number}`);
    } else {
      toast.error(`Tagihan "${searchQuery}" tidak ditemukan.`);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice) return;

    const totalTagihan = Number(selectedInvoice.amount) + Number(selectedInvoice.penalty_amount || 0);

    if (paymentMethod === 'tunai' && Number(uangDiterima) < totalTagihan) {
      toast.error("Uang yang diterima kurang dari total tagihan!");
      return;
    }

    if ((paymentMethod === 'edc' || paymentMethod === 'transfer') && !edcReference.trim()) {
      toast.error("Mohon masukkan nomor referensi transaksi / bukti setor!");
      return;
    }

    try {
      setIsProcessing(true);
      await invoiceService.verifyPayment(selectedInvoice.id, {
        payment_method: paymentMethod.toUpperCase(),
        reference_number: edcReference || undefined,
        amount_paid: paymentMethod === 'tunai' ? Number(uangDiterima) : totalTagihan
      });

      toast.success(`Pembayaran e-SKRD ${selectedInvoice.invoice_number} berhasil diproses!`);
      setIsPaid(true);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal memproses pelunasan tagihan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetTransaction = () => {
    setSelectedInvoice(null);
    setSearchQuery('');
    setIsPaid(false);
    setUangDiterima('');
    setEdcReference('');
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333]">
            Pembayaran <small className="text-[15px] font-light text-[#777] ml-2">Loket Kasir &amp; POS Retribusi</small>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Pembayaran Loket</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri: Panel Pencarian & Detail Tagihan */}
        <InvoiceSearchPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          selectedInvoice={selectedInvoice}
          onSelectInvoice={(inv) => {
            setSelectedInvoice(inv);
            setIsPaid(inv.status === 'Paid' || inv.status === 'Lunas');
            setUangDiterima('');
            setEdcReference('');
          }}
          unpaidInvoices={unpaidInvoices}
          isLoading={isLoading}
        />

        {/* Kolom Kanan: Panel Kasir (Point of Sales) */}
        <PosCashierPanel
          selectedInvoice={selectedInvoice}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          uangDiterima={uangDiterima}
          setUangDiterima={setUangDiterima}
          edcReference={edcReference}
          setEdcReference={setEdcReference}
          isPaid={isPaid}
          isProcessing={isProcessing}
          onProcessPayment={handleProcessPayment}
          onResetTransaction={handleResetTransaction}
        />
      </div>
    </div>
  );
}
