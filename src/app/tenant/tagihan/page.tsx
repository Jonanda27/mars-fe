"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { 
  Banknote, AlertTriangle, Building2, Plane, Compass, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { TenantInvoiceFilterBar } from './components/TenantInvoiceFilterBar';
import { TenantInvoiceCard } from './components/TenantInvoiceCard';
import { UploadSTSModal } from '@/components/tagihan/modals/UploadSTSModal';
import { SKRDPreviewModal } from '@/components/tagihan/modals/SKRDPreviewModal';

export default function TenantTagihanPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  
  // Filter state
  const [serviceFilter, setServiceFilter] = useState<'ALL' | 'HANGGAR' | 'RUANGAN' | 'MINI_AIRPORT' | 'DENDA'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Payment Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadInvoice, setUploadInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank Papua');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // SKRD Modal state
  const [showSkrdModal, setShowSkrdModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getTenantInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
      toast.error('Gagal memuat daftar tagihan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const isInvoiceDenda = (invoice: Invoice) => {
    return Boolean(
      invoice.invoice_type === 'SKRD Denda' ||
      invoice.invoice_number?.includes('DND') ||
      invoice.details?.type === 'PENALTY_INVOICE'
    );
  };

  const isInvoiceMiniAirport = (invoice: Invoice) => {
    return Boolean(
      invoice.invoice_type === 'Mini Airport' ||
      invoice.invoice_number?.includes('MAP') ||
      invoice.details?.type === 'MINI_AIRPORT_LANDING' ||
      invoice.details?.airport_code
    );
  };

  const isInvoiceRuangan = (invoice: Invoice) => {
    if (isInvoiceDenda(invoice) || isInvoiceMiniAirport(invoice)) return false;
    return Boolean(
      invoice.invoice_type === 'Sewa Ruangan' ||
      invoice.contracts?.jenis_pemanfaatan?.toLowerCase().includes('ruang') ||
      invoice.contracts?.assets?.jenis_aset?.toLowerCase().includes('ruang') ||
      invoice.contracts?.contract_number?.includes('PKS-RG')
    );
  };

  const handleUploadReceipt = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!uploadInvoice || !receiptFile) {
      toast.error('Pilih file bukti bayar terlebih dahulu');
      return;
    }
    
    try {
      setIsPaying(true);
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('payment_method', paymentMethod);

      await invoiceService.uploadReceipt(uploadInvoice.id, formData);

      toast.success('Bukti bayar berhasil diunggah! Menunggu verifikasi admin.');
      setShowUploadModal(false);
      setReceiptFile(null);
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan saat mengunggah';
      toast.error(`Gagal mengunggah bukti bayar: ${msg}`);
    } finally {
      setIsPaying(false);
    }
  };

  // Counts for tabs
  const dendaCount = invoices.filter(inv => isInvoiceDenda(inv)).length;
  const miniAirportCount = invoices.filter(inv => isInvoiceMiniAirport(inv)).length;
  const ruanganCount = invoices.filter(inv => isInvoiceRuangan(inv)).length;
  const hanggarCount = invoices.filter(inv => !isInvoiceRuangan(inv) && !isInvoiceDenda(inv) && !isInvoiceMiniAirport(inv)).length;

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const isDenda = isInvoiceDenda(inv);
    const isMiniAirport = isInvoiceMiniAirport(inv);
    const isRuangan = isInvoiceRuangan(inv);

    if (serviceFilter === 'DENDA' && !isDenda) return false;
    if (serviceFilter === 'MINI_AIRPORT' && !isMiniAirport) return false;
    if (serviceFilter === 'HANGGAR' && (isRuangan || isDenda || isMiniAirport)) return false;
    if (serviceFilter === 'RUANGAN' && (!isRuangan || isDenda || isMiniAirport)) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchInvNum = (inv.invoice_number || '').toLowerCase().includes(q);
      const matchContract = (inv.contracts?.contract_number || '').toLowerCase().includes(q);
      const matchAsset = (inv.contracts?.assets?.nama_aset || '').toLowerCase().includes(q);
      const matchRefNote = (inv.details?.reference_note || '').toLowerCase().includes(q);
      const matchDetails = Array.isArray(inv.details) ? inv.details.some((d: any) => 
        (d.registration_number || '').toLowerCase().includes(q) ||
        (d.aircraft_type || '').toLowerCase().includes(q)
      ) : false;
      return matchInvNum || matchContract || matchAsset || matchRefNote || matchDetails;
    }
    return true;
  });

  const renderInvoiceList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc] mb-2" /> 
          <span className="font-medium text-sm">Memuat data tagihan e-SKRD...</span>
        </div>
      );
    }

    if (filteredInvoices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white border border-slate-200 shadow-2xs">
          <Banknote className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Tagihan Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm 
              ? 'Tidak ada tagihan yang cocok dengan kata kunci pencarian.'
              : serviceFilter !== 'ALL'
              ? `Tidak ada tagihan untuk kategori ${serviceFilter === 'HANGGAR' ? 'Sewa Hanggar' : serviceFilter === 'RUANGAN' ? 'Sewa Ruangan' : 'SKRD Denda'}.`
              : 'Anda belum memiliki tagihan SKRD saat ini.'}
          </p>
        </div>
      );
    }

    // Grouping by contract or independent billing
    const groupedInvoices = filteredInvoices.reduce((acc, invoice) => {
      const isDenda = isInvoiceDenda(invoice);
      const isMiniAirport = isInvoiceMiniAirport(invoice);
      const isRuangan = isInvoiceRuangan(invoice);
      let groupKey = '';
      let groupTitle = '';
      let groupType: 'denda' | 'room' | 'mini_airport' | 'hanggar' = 'hanggar';

      if (isDenda) {
        groupKey = 'DENDA_GROUP';
        groupTitle = 'Tagihan Denda Keterlambatan Retribusi Daerah (4.1.4.01.01)';
        groupType = 'denda';
      } else if (isMiniAirport) {
        const aptName = invoice.details?.airport_name || 'Mini Airport Perintis';
        groupKey = `MINI_AIRPORT_${invoice.details?.airport_code || 'GENERIC'}`;
        groupTitle = `Retribusi Pelayanan & Pendaratan ${aptName}`;
        groupType = 'mini_airport';
      } else if (invoice.contracts?.contract_number) {
        groupKey = invoice.contracts.contract_number;
        groupTitle = `Kontrak: ${invoice.contracts.contract_number}`;
        if (isRuangan) {
          groupTitle += ` • Sewa Ruangan (${invoice.contracts.assets?.nama_aset || 'Terminal'})`;
          groupType = 'room';
        } else {
          groupTitle += ` • Kontrak Sewa Hanggar & Apron`;
          groupType = 'hanggar';
        }
      } else {
        if (isRuangan) {
          groupKey = 'ROOM_INDEPENDENT';
          groupTitle = 'Tagihan Retribusi Sewa Ruangan Terminal';
          groupType = 'room';
        } else {
          groupKey = 'HANGGAR_OVERNIGHT';
          groupTitle = 'Tagihan Retribusi Sewa Hanggar & Apron (Pasca Operasional)';
          groupType = 'hanggar';
        }
      }

      if (!acc[groupKey]) {
        acc[groupKey] = {
          title: groupTitle,
          groupType,
          invoices: []
        };
      }
      acc[groupKey].invoices.push(invoice);
      return acc;
    }, {} as Record<string, { title: string; groupType: 'denda' | 'room' | 'mini_airport' | 'hanggar'; invoices: Invoice[] }>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedInvoices).map(([groupKey, group]) => {
          const isDendaGroup = group.groupType === 'denda';
          const isRoomGroup = group.groupType === 'room';
          const isMiniAirportGroup = group.groupType === 'mini_airport';

          return (
            <div key={groupKey} className="bg-white border border-slate-200 shadow-2xs overflow-hidden">
              {/* Group Header */}
              <div className={`px-4 py-3 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                isDendaGroup
                  ? 'bg-red-50/80 border-red-200'
                  : isMiniAirportGroup
                  ? 'bg-amber-50/80 border-amber-200'
                  : isRoomGroup 
                  ? 'bg-emerald-50/70 border-emerald-200' 
                  : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                  {isDendaGroup ? (
                    <div className="p-1 bg-red-600 text-white rounded-none">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : isMiniAirportGroup ? (
                    <div className="p-1 bg-amber-600 text-white rounded-none">
                      <Compass className="w-4 h-4" />
                    </div>
                  ) : isRoomGroup ? (
                    <div className="p-1 bg-emerald-600 text-white rounded-none">
                      <Building2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1 bg-[#3c8dbc] text-white rounded-none">
                      <Plane className="w-4 h-4" />
                    </div>
                  )}
                  <span className={
                    isDendaGroup 
                      ? 'text-red-950' 
                      : isMiniAirportGroup
                      ? 'text-amber-950'
                      : isRoomGroup 
                      ? 'text-emerald-950' 
                      : 'text-blue-950'
                  }>
                    {group.title}
                  </span>
                </div>
                
                <span className={`text-[11px] font-bold px-2 py-0.5 border ${
                  isDendaGroup
                    ? 'bg-white text-red-800 border-red-300'
                    : isMiniAirportGroup
                    ? 'bg-white text-amber-800 border-amber-300'
                    : isRoomGroup 
                    ? 'bg-white text-emerald-800 border-emerald-300' 
                    : 'bg-white text-blue-800 border-blue-300'
                }`}>
                  {group.invoices.length} SKRD
                </span>
              </div>
              
              {/* Cards Grid */}
              <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4 bg-slate-50/50">
                {group.invoices.map((invoice) => (
                  <TenantInvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    isDenda={isInvoiceDenda(invoice)}
                    isRuangan={isInvoiceRuangan(invoice)}
                    isMiniAirport={isInvoiceMiniAirport(invoice)}
                    onOpenSkrd={(inv) => {
                      setSelectedInvoice(inv);
                      setShowSkrdModal(true);
                    }}
                    onOpenUploadModal={(inv) => {
                      setUploadInvoice(inv);
                      setShowUploadModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4 font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Tagihan Saya{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Pembayaran Retribusi e-SKRD Daerah</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium text-slate-800">Tagihan &amp; e-SKRD</span>
        </div>
      </header>

      {/* Filter Tabs & Search */}
      <div className="bg-white shadow-xs">
        <TenantInvoiceFilterBar
          serviceFilter={serviceFilter}
          setServiceFilter={setServiceFilter}
          totalCount={invoices.length}
          hanggarCount={hanggarCount}
          ruanganCount={ruanganCount}
          miniAirportCount={miniAirportCount}
          dendaCount={dendaCount}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={fetchInvoices}
        />

        {/* Invoices List */}
        <div className="p-4 bg-slate-50/50 min-h-[400px]">
          {renderInvoiceList()}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>
            Menampilkan {filteredInvoices.length} dari total {invoices.length} SKRD
          </span>
          <span>UPBU Bandara Mozes Kilangin Timika</span>
        </div>
      </div>

      {/* MODAL UPLOAD BUKTI BAYAR */}
      <UploadSTSModal
        isOpen={showUploadModal}
        invoice={uploadInvoice}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        receiptFile={receiptFile}
        setReceiptFile={setReceiptFile}
        isPaying={isPaying}
        onClose={() => {
          setShowUploadModal(false);
          setReceiptFile(null);
        }}
        onSubmit={handleUploadReceipt}
      />

      {/* MODAL E-SKRD PREVIEW */}
      <SKRDPreviewModal
        isOpen={showSkrdModal}
        invoice={selectedInvoice}
        onClose={() => setShowSkrdModal(false)}
      />
    </div>
  );
}
