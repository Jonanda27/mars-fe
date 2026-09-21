"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { UnbilledHanggarLog } from '@/types/invoice';
import toast from 'react-hot-toast';

import { UnbilledHanggarStats } from './unbilled-hanggar/UnbilledHanggarStats';
import { UnbilledHanggarToolbar } from './unbilled-hanggar/UnbilledHanggarToolbar';
import { UnbilledHanggarTable } from './unbilled-hanggar/UnbilledHanggarTable';
import { BatchActionBottomBar } from './unbilled-hanggar/BatchActionBottomBar';
import { GenerateMassSkrdModal } from './unbilled-hanggar/GenerateMassSkrdModal';

interface UnbilledHanggarTabProps {
  onInvoiceGenerated?: () => void;
  onViewInvoice?: (invoice: any) => void;
}

export default function UnbilledHanggarTab({ onInvoiceGenerated, onViewInvoice }: UnbilledHanggarTabProps) {
  const [logs, setLogs] = useState<UnbilledHanggarLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLogIds, setSelectedLogIds] = useState<number[]>([]);
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom rate overrides per log_id
  const [customRates] = useState<Record<number, number>>({});

  // Loading state for generation action
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: 'single' | 'batch';
    targetLog?: UnbilledHanggarLog;
  }>({ isOpen: false, mode: 'batch' });

  const fetchUnbilledLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getUnbilledHanggarLogs();
      setLogs(data || []);
      setSelectedLogIds([]);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data armada siap tagih');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnbilledLogs();
  }, [fetchUnbilledLogs]);

  // Unique list of tenants for dropdown filter
  const tenantList = useMemo(() => {
    const map = new Map<number, string>();
    logs.forEach(l => {
      if (l.tenant_id && l.tenant_name) {
        map.set(l.tenant_id, l.tenant_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchTenant = selectedTenantFilter === 'ALL' || String(l.tenant_id) === selectedTenantFilter;
      const matchSearch = searchQuery.trim() === '' || 
        l.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.aircraft_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTenant && matchSearch;
    });
  }, [logs, selectedTenantFilter, searchQuery]);

  // Calculations for selected items
  const selectedItemsData = useMemo(() => {
    const selected = logs.filter(l => selectedLogIds.includes(l.log_id));
    const totalNights = selected.reduce((sum, item) => sum + (item.total_nights || 1), 0);
    const grandTotal = selected.reduce((sum, item) => {
      const rate = customRates[item.log_id] ?? item.rate_per_night;
      return sum + ((item.total_nights || 1) * rate);
    }, 0);
    return { selected, totalNights, grandTotal };
  }, [logs, selectedLogIds, customRates]);

  // Metrics totals for all filtered
  const totalStats = useMemo(() => {
    const totalUnits = filteredLogs.length;
    const totalNights = filteredLogs.reduce((sum, l) => sum + (l.total_nights || 1), 0);
    const estRevenue = filteredLogs.reduce((sum, l) => sum + (l.subtotal || 0), 0);
    return { totalUnits, totalNights, estRevenue };
  }, [filteredLogs]);

  const handleToggleSelect = (logId: number) => {
    setSelectedLogIds(prev => 
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogIds.length === filteredLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(filteredLogs.map(l => l.log_id));
    }
  };

  // Trigger Opsi A: Generate Single Invoice
  const handleGenerateSingle = async (log: UnbilledHanggarLog) => {
    try {
      setIsGenerating(true);
      const rate = customRates[log.log_id] ?? log.rate_per_night;
      const newInvoice = await invoiceService.generateHanggarCheckoutInvoice(log.log_id, rate);
      toast.success(`SKRD ${newInvoice.invoice_number} berhasil diterbitkan!`);
      setConfirmModal({ isOpen: false, mode: 'single' });
      await fetchUnbilledLogs();
      if (onInvoiceGenerated) onInvoiceGenerated();
      if (onViewInvoice) onViewInvoice(newInvoice);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Gagal menerbitkan SKRD';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Opsi B: Generate Batch/Periodic Invoice
  const handleGenerateBatch = async () => {
    if (selectedLogIds.length === 0) {
      toast.error('Pilih minimal 1 armada untuk diterbitkan SKRD');
      return;
    }

    const firstTenantId = logs.find(l => selectedLogIds.includes(l.log_id))?.tenant_id;
    const isMultiTenant = logs
      .filter(l => selectedLogIds.includes(l.log_id))
      .some(l => l.tenant_id !== firstTenantId);

    if (isMultiTenant) {
      toast.error('Untuk penetapan SKRD Terkonsolidasi, seluruh armada yang dipilih harus dari maskapai/tenant yang sama.');
      return;
    }

    try {
      setIsGenerating(true);
      const newInvoice = await invoiceService.generateHanggarPeriodicInvoice({
        tenant_id: firstTenantId!,
        log_ids: selectedLogIds,
        custom_rates: customRates
      });

      toast.success(`SKRD Terkonsolidasi ${newInvoice.invoice_number} berhasil diterbitkan!`);
      setConfirmModal({ isOpen: false, mode: 'batch' });
      setSelectedLogIds([]);
      await fetchUnbilledLogs();
      if (onInvoiceGenerated) onInvoiceGenerated();
      if (onViewInvoice) onViewInvoice(newInvoice);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Gagal menerbitkan SKRD Terkonsolidasi';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner & KPI Metrics */}
      <UnbilledHanggarStats totalStats={totalStats} />

      {/* Filter & Toolbar */}
      <UnbilledHanggarToolbar
        tenantList={tenantList}
        selectedTenantFilter={selectedTenantFilter}
        setSelectedTenantFilter={setSelectedTenantFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onRefresh={fetchUnbilledLogs}
      />

      {/* Main Table */}
      <UnbilledHanggarTable
        isLoading={isLoading}
        filteredLogs={filteredLogs}
        selectedLogIds={selectedLogIds}
        customRates={customRates}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        onTriggerSingle={(log) => setConfirmModal({ isOpen: true, mode: 'single', targetLog: log })}
      />

      {/* Floating Bottom Batch Action Bar */}
      <BatchActionBottomBar
        selectedCount={selectedLogIds.length}
        totalNights={selectedItemsData.totalNights}
        grandTotal={selectedItemsData.grandTotal}
        onTriggerBatch={() => setConfirmModal({ isOpen: true, mode: 'batch' })}
      />

      {/* Confirmation Modal */}
      <GenerateMassSkrdModal
        isOpen={confirmModal.isOpen}
        mode={confirmModal.mode}
        targetLog={confirmModal.targetLog}
        selectedItemsData={selectedItemsData}
        isGenerating={isGenerating}
        onClose={() => setConfirmModal({ isOpen: false, mode: 'batch' })}
        onConfirm={() => {
          if (confirmModal.mode === 'single' && confirmModal.targetLog) {
            handleGenerateSingle(confirmModal.targetLog);
          } else {
            handleGenerateBatch();
          }
        }}
      />
    </div>
  );
}
