"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Send, CheckCircle2, AlertTriangle, 
  FileText, Plus, RefreshCw, UserCheck, 
  DollarSign, TrendingDown, Layers,
  ChevronRight, ArrowRight, ShieldCheck, Printer,
  Calendar, Check, X, Lock, ShieldAlert
} from 'lucide-react';
import { useParkingStore } from '../../../store/useParkingStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { TicketBook, WardenHandover } from '../../../types/parking';

export default function AdminParkirManualPage() {
  const { user } = useAuthStore();
  const {
    books,
    availableBooks,
    activeHandovers,
    handoverHistory,
    reconciliationReport,
    isLoading,
    error,
    clearError,
    fetchBooks,
    fetchAvailableBooks,
    fetchActiveHandovers,
    fetchHandoverHistory,
    fetchReconciliationReport,
    createBook,
    dispatchBooklet,
    settleHandover
  } = useParkingStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'handovers' | 'reconciliation'>('handovers');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Form Modals
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedHandoverToSettle, setSelectedHandoverToSettle] = useState<WardenHandover | null>(null);

  // Form State: Add Book
  const [newBook, setNewBook] = useState({
    kode_buku: '',
    jenis_karcis: 'Roda 2',
    seri_awal: 1,
    seri_akhir: 100,
    nominal_per_lembar: 2000
  });

  // Form State: Dispatch Handover
  const [dispatchData, setDispatchData] = useState({
    book_id: 0,
    warden_name: '',
    dispatched_serial_start: 1,
    dispatched_serial_end: 100
  });

  // Form State: Settle Handover
  const [settleData, setSettleData] = useState({
    last_returned_serial: 0,
    actual_cash_settled: 0,
    notes: ''
  });

  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, [user?.airport_id]);

  const loadAllData = async () => {
    await Promise.all([
      fetchBooks(),
      fetchAvailableBooks(),
      fetchActiveHandovers(),
      fetchHandoverHistory(),
      fetchReconciliationReport()
    ]);
  };

  // Default values per vehicle type
  const handleVehicleTypeChange = (type: string) => {
    let nominal = 2000;
    if (type === 'Roda 4') nominal = 5000;
    else if (type === 'VIP') nominal = 10000;
    else if (type === 'Inap') nominal = 20000;

    setNewBook(prev => ({
      ...prev,
      jenis_karcis: type,
      nominal_per_lembar: nominal
    }));
  };

  // On selecting book for dispatch, auto-fill serial numbers
  const handleSelectBookForDispatch = (bookId: number) => {
    const selected = availableBooks.find(b => b.id === bookId);
    if (selected) {
      const start = selected.effective_serial_start ?? selected.seri_awal;
      setDispatchData(prev => ({
        ...prev,
        book_id: bookId,
        dispatched_serial_start: start,
        dispatched_serial_end: selected.seri_akhir
      }));
    } else {
      setDispatchData(prev => ({ ...prev, book_id: bookId }));
    }
  };

  // Open Settle Modal
  const handleOpenSettle = (handover: WardenHandover) => {
    setSelectedHandoverToSettle(handover);
    setSettleData({
      last_returned_serial: handover.dispatched_serial_start,
      actual_cash_settled: 0,
      notes: ''
    });
    setFormFeedback(null);
  };

  // Settle calculations (Live reactive)
  const settleCalculations = useMemo(() => {
    if (!selectedHandoverToSettle) return { soldQty: 0, expectedAmount: 0, discrepancy: 0 };
    const start = selectedHandoverToSettle.dispatched_serial_start;
    const end = selectedHandoverToSettle.dispatched_serial_end;
    const nominal = parseFloat(String(selectedHandoverToSettle.ticket_books?.nominal_per_lembar || 0));
    
    const lastReturned = settleData.last_returned_serial;
    const soldQty = Math.max(0, Math.min(lastReturned - start, (end - start) + 1));
    const expectedAmount = soldQty * nominal;
    const discrepancy = (settleData.actual_cash_settled || 0) - expectedAmount;

    return { soldQty, expectedAmount, discrepancy };
  }, [selectedHandoverToSettle, settleData.last_returned_serial, settleData.actual_cash_settled]);

  // Handler: Add Book Submit
  const handleCreateBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    try {
      await createBook(newBook);
      setShowAddBookModal(false);
      setNewBook({
        kode_buku: '',
        jenis_karcis: 'Roda 2',
        seri_awal: 1,
        seri_akhir: 100,
        nominal_per_lembar: 2000
      });
      setFormFeedback({ type: 'success', message: 'Buku karcis baru berhasil ditambahkan!' });
      setTimeout(() => setFormFeedback(null), 4000);
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message });
    }
  };

  // Handler: Dispatch Handover Submit
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    try {
      await dispatchBooklet(dispatchData);
      setShowDispatchModal(false);
      setDispatchData({
        book_id: 0,
        warden_name: '',
        dispatched_serial_start: 1,
        dispatched_serial_end: 100
      });
      setFormFeedback({ type: 'success', message: 'Karcis berhasil dialokasikan ke Juru Parkir!' });
      setTimeout(() => setFormFeedback(null), 4000);
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message });
    }
  };

  // Handler: Settle Submit
  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHandoverToSettle) return;
    setFormFeedback(null);

    // If deficit, notes is strictly required
    if (settleCalculations.discrepancy < 0 && (!settleData.notes || settleData.notes.trim() === '')) {
      setFormFeedback({
        type: 'error',
        message: 'Wajib mengisi alasan/keterangan selisih kurang (defisit) sebelum menyelesaikan setoran!'
      });
      return;
    }

    try {
      await settleHandover(selectedHandoverToSettle.id, {
        last_returned_serial: Number(settleData.last_returned_serial),
        actual_cash_settled: Number(settleData.actual_cash_settled),
        notes: settleData.notes
      });
      setSelectedHandoverToSettle(null);
      setFormFeedback({ type: 'success', message: 'Rekonsiliasi & setoran juru parkir berhasil disimpan!' });
      setTimeout(() => setFormFeedback(null), 4000);
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message });
    }
  };

  // Stats calculation
  const totalStokBooks = books.filter(b => b.status === 'STOK').length;
  const totalActiveBooks = books.filter(b => b.status === 'ACTIVE').length;
  const totalHabisBooks = books.filter(b => b.status === 'HABIS').length;

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 text-[#333]">
      
      {/* Header AdminLTE Style */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[#d2d6de] pb-3">
        <div>
          <h1 className="text-[20px] font-bold text-[#333] uppercase flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#3c8dbc]" />
            Manajemen Parkir Manual (Fase 1)
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Logistik Karcis Berseri, Serah-Terima Lapangan & Rekonsiliasi Setoran Tunai (Anti-Leakage)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="bg-[#3c8dbc] text-white px-2.5 py-1 font-bold shadow-sm rounded-sm">
            UPBU: {user?.airport_id === 2 ? 'Sentani (DJJ)' : 'Mozes Kilangin (TIM)'}
          </span>
          <button 
            onClick={loadAllData} 
            className="bg-white border border-[#d2d6de] hover:bg-slate-100 p-1.5 rounded-sm transition-colors text-[#555]"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#3c8dbc]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Global Alert Notification */}
      {formFeedback && (
        <div className={`p-3 text-[13px] flex items-center justify-between shadow-sm border-l-4 ${
          formFeedback.type === 'success' 
            ? 'bg-[#dff0d8] text-[#3c763d] border-[#3c763d]' 
            : 'bg-[#f2dede] text-[#a94442] border-[#a94442]'
        }`}>
          <div className="flex items-center gap-2">
            {formFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{formFeedback.message}</span>
          </div>
          <button onClick={() => setFormFeedback(null)} className="text-current hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#f2dede] text-[#a94442] text-[13px] flex items-center justify-between border-l-4 border-[#a94442] shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-current hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Overview Cards (Modern Minimalist Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">Stok Buku Karcis</span>
            <div className="text-[22px] font-bold text-slate-800 font-mono mt-1">
              {totalStokBooks} <span className="text-[13px] font-normal text-slate-500">Buku Siap</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">Petugas Lapangan</span>
            <div className="text-[22px] font-bold text-slate-800 font-mono mt-1">
              {totalActiveBooks} <span className="text-[13px] font-normal text-slate-500">Shift Aktif</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">Setoran Kas Terkumpul</span>
            <div className="text-[20px] font-bold text-slate-800 font-mono mt-1 whitespace-nowrap">
              Rp {(reconciliationReport?.summary.total_actual_cash || 0).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">Net Selisih Kas</span>
            <div className={`text-[20px] font-bold font-mono mt-1 whitespace-nowrap ${
              (reconciliationReport?.summary.total_unmatched_amount || 0) < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {(reconciliationReport?.summary.total_unmatched_amount || 0) < 0 ? '-' : ''}Rp {Math.abs(reconciliationReport?.summary.total_unmatched_amount || 0).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
            {(reconciliationReport?.summary.total_unmatched_amount || 0) < 0 ? (
              <TrendingDown className="w-5 h-5 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation (Clean Minimalist Bar) */}
      <div className="flex flex-wrap bg-white rounded-md border border-slate-200/80 p-1 text-[13px] font-medium gap-1 shadow-xs">
        <button 
          onClick={() => setActiveTab('handovers')}
          className={`py-2 px-4 rounded transition-all flex items-center gap-2 ${
            activeTab === 'handovers' 
              ? 'bg-slate-800 text-white font-semibold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          Log Distribusi & Setoran ({activeHandovers.length})
        </button>

        <button 
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-4 rounded transition-all flex items-center gap-2 ${
            activeTab === 'inventory' 
              ? 'bg-slate-800 text-white font-semibold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Inventaris Buku Karcis ({books.length})
        </button>

        <button 
          onClick={() => setActiveTab('reconciliation')}
          className={`py-2 px-4 rounded transition-all flex items-center gap-2 ${
            activeTab === 'reconciliation' 
              ? 'bg-slate-800 text-white font-semibold shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Rekonsiliasi & Audit Kas
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INVENTARIS BUKU KARCIS */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          
          <div className="bg-white border-t-[3px] border-[#00c0ef] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#333] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00c0ef]" />
                Katalog & Stok Buku Karcis Fisik
              </h3>
              <p className="text-[12px] text-[#777]">
                Pencatatan buku karcis yang dicetak oleh Dinas Perhubungan Kab. Mimika
              </p>
            </div>
            
            <button 
              onClick={() => setShowAddBookModal(true)}
              className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white px-3.5 py-2 text-[13px] font-bold rounded-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Daftarkan Buku Baru
            </button>
          </div>

          <div className="bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#f4f4f4] bg-slate-50 text-[#555] uppercase text-[11px] font-bold">
                  <th className="py-3 px-4">Kode Buku</th>
                  <th className="py-3 px-4">Kategori / Objek</th>
                  <th className="py-3 px-4 text-center">Rentang Seri Asli</th>
                  <th className="py-3 px-4 text-center">Seri Tersedia Saat Ini</th>
                  <th className="py-3 px-4 text-right">Tarif / Lembar</th>
                  <th className="py-3 px-4 text-right">Nilai Total Buku</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#999]">
                      Belum ada data buku karcis. Klik tombol "Daftarkan Buku Baru" untuk memulai.
                    </td>
                  </tr>
                ) : (
                  books.map((b) => {
                    const totalLembar = (b.seri_akhir - b.seri_awal) + 1;
                    const totalNilai = totalLembar * parseFloat(String(b.nominal_per_lembar));
                    const effectiveStart = b.effective_serial_start ?? b.seri_awal;

                    return (
                      <tr key={b.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#333]">
                          {b.kode_buku}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {b.jenis_karcis}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 whitespace-nowrap">
                          {b.seri_awal} — {b.seri_akhir} <span className="text-slate-400 text-[11px]">({totalLembar} lbr)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                          {b.status === 'HABIS' ? '-' : `${effectiveStart} — ${b.seri_akhir}`}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                          Rp {parseFloat(String(b.nominal_per_lembar)).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                          Rp {totalNilai.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded ${
                            b.status === 'STOK' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            b.status === 'ACTIVE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {b.status === 'STOK' ? (
                            <button
                              onClick={() => {
                                handleSelectBookForDispatch(b.id);
                                setShowDispatchModal(true);
                              }}
                              title="Alokasikan Buku Karcis ke Petugas"
                              className="w-8 h-8 rounded border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors mx-auto shadow-2xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[12px] text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LOG DISTRIBUSI & SETORAN */}
      {/* ========================================================================= */}
      {activeTab === 'handovers' && (
        <div className="flex flex-col gap-5 animate-in fade-in">
          
          {/* Action Bar */}
          <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#333] flex items-center gap-2">
                <Send className="w-5 h-5 text-[#f39c12]" />
                Serah Terima Juru Parkir & Rekonsiliasi Kas
              </h3>
              <p className="text-[12px] text-[#777]">
                Kunci nomor seri saat juru parkir mulai shift, dan hitung matematis lembar disobek saat kembali
              </p>
            </div>
            
            <button 
              onClick={() => setShowDispatchModal(true)}
              disabled={availableBooks.length === 0}
              className={`px-4 py-2 text-[13px] font-bold rounded-sm shadow-sm flex items-center gap-1.5 transition-colors ${
                availableBooks.length > 0 
                  ? 'bg-[#f39c12] hover:bg-[#e08e0b] text-white' 
                  : 'bg-slate-200 text-[#999] cursor-not-allowed'
              }`}
              title={availableBooks.length === 0 ? 'Tidak ada buku karcis berstatus STOK' : 'Mulai shift baru'}
            >
              <Plus className="w-4 h-4" /> Buka Shift Petugas (Alokasi Karcis)
            </button>
          </div>

          {/* Sub-section 1: Petugas Sedang Bertugas (DISTRIBUTED) */}
          <div className="bg-white shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h4 className="text-[14px] font-bold text-[#333] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f39c12] animate-ping"></span>
                Penugasan Aktif di Lapangan ({activeHandovers.length} Petugas)
              </h4>
              <span className="text-[11px] text-[#777]">Memegang Buku Karcis Fisik</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#555] uppercase text-[11px] font-bold bg-white">
                    <th className="py-3 px-4">Nama Juru Parkir</th>
                    <th className="py-3 px-4">Buku & Jenis Karcis</th>
                    <th className="py-3 px-4 text-center">Nomor Seri Dibawa</th>
                    <th className="py-3 px-4 text-right">Potensi Nilai</th>
                    <th className="py-3 px-4">Waktu Mulai Shift</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi (Selesai Shift)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeHandovers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[#999]">
                        Saat ini tidak ada juru parkir yang sedang bertugas di lapangan.
                      </td>
                    </tr>
                  ) : (
                    activeHandovers.map(h => {
                      const lembarDibawa = (h.dispatched_serial_end - h.dispatched_serial_start) + 1;
                      const tarif = parseFloat(String(h.ticket_books?.nominal_per_lembar || 0));
                      const potensi = lembarDibawa * tarif;

                      return (
                        <tr key={h.id} className="border-b border-[#f4f4f4] hover:bg-amber-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#333] flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-[#f39c12]" />
                            {h.warden_name}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-[#333]">{h.ticket_books?.kode_buku}</div>
                            <div className="text-[11px] text-[#666]">{h.ticket_books?.jenis_karcis} (@Rp {tarif.toLocaleString('id-ID')})</div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-[#f39c12]">
                            {h.dispatched_serial_start} — {h.dispatched_serial_end}
                            <span className="text-[11px] text-[#777] font-normal block">({lembarDibawa} Lembar)</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#333]">
                            Rp {potensi.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-[#666] text-[12px]">
                            {h.dispatch_time ? new Date(h.dispatch_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#f39c12] text-white rounded-sm">
                              DISTRIBUTED
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleOpenSettle(h)}
                              title="Settle & Rekonsiliasi Shift"
                              className="w-8 h-8 rounded border border-emerald-300 hover:border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors mx-auto shadow-2xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section 2: Riwayat Serah Terima & Setoran yang Telah Settled */}
          <div className="bg-white shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h4 className="text-[14px] font-bold text-[#333] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3c8dbc]" />
                Log Riwayat Setoran Selesai (Settled Audit Trail)
              </h4>
              <span className="text-[11px] text-[#777]">Terkunci & Tervalidasi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#555] uppercase text-[11px] font-bold bg-white">
                    <th className="py-3 px-4">Waktu Settle</th>
                    <th className="py-3 px-4">Juru Parkir</th>
                    <th className="py-3 px-4">Buku Karcis</th>
                    <th className="py-3 px-4 text-center">Seri Terjual (Sobek)</th>
                    <th className="py-3 px-4 text-center">Qty Terjual</th>
                    <th className="py-3 px-4 text-right">Ekspektasi Uang</th>
                    <th className="py-3 px-4 text-right">Setoran Riil</th>
                    <th className="py-3 px-4 text-right">Selisih (+/-)</th>
                    <th className="py-3 px-4">Alasan / Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {handoverHistory.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#999]">
                        Belum ada riwayat setoran yang diselesaikan.
                      </td>
                    </tr>
                  ) : (
                    handoverHistory.map(h => {
                      const unmatched = parseFloat(String(h.unmatched_amount || 0));
                      const exp = parseFloat(String(h.expected_amount || 0));
                      const act = parseFloat(String(h.actual_cash_settled || 0));

                      return (
                        <tr key={h.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-[#777] text-[12px]">
                            {h.settle_time ? new Date(h.settle_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#333]">
                            {h.warden_name}
                          </td>
                          <td className="py-3 px-4 font-mono text-[12px]">
                            {h.ticket_books?.kode_buku} <span className="text-[#888]">({h.ticket_books?.jenis_karcis})</span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-[12px] text-[#444]">
                            {h.dispatched_serial_start} s/d {h.last_returned_serial ? h.last_returned_serial - 1 : '-'}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-[#333]">
                            {h.sold_qty} lbr
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                            Rp {exp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                            Rp {act.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                            {unmatched < 0 ? (
                              <span className="text-rose-600 font-bold">-Rp {Math.abs(unmatched).toLocaleString('id-ID')}</span>
                            ) : unmatched > 0 ? (
                              <span className="text-blue-600 font-bold">+Rp {unmatched.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-600 font-medium">Rp 0</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[12px] text-slate-600 max-w-[220px]" title={h.notes || '-'}>
                            {h.notes || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REKONSILIASI & LEAKAGE MAP */}
      {/* ========================================================================= */}
      {activeTab === 'reconciliation' && (
        <div className="flex flex-col gap-5 animate-in fade-in">
          
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#333] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00a65a]" />
                Laporan Rekonsiliasi & Peta Kebocoran (Anti-Leakage Audit)
              </h3>
              <p className="text-[12px] text-[#777]">
                Evaluasi komparatif uang teoretis vs fisik yang disetor ke bendahara penerimaan UPBU
              </p>
            </div>
            
            <button 
              onClick={() => window.print()}
              className="bg-white border border-[#d2d6de] hover:bg-slate-50 text-[#444] px-3.5 py-2 text-[13px] font-bold rounded-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#555]" /> Cetak Laporan
            </button>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 shadow-sm border-l-4 border-[#3c8dbc]">
              <span className="text-[11px] text-[#777] font-bold uppercase">Total Lembar Terjual (Fisik)</span>
              <p className="text-[26px] font-bold font-mono text-[#333] mt-1">
                {(reconciliationReport?.summary.total_sold_qty || 0).toLocaleString('id-ID')}
                <span className="text-[13px] text-[#777] font-normal ml-1">lembar karcis</span>
              </p>
              <div className="text-[11px] text-[#777] mt-1">Dari {reconciliationReport?.summary.total_settled_shifts || 0} shift bertugas</div>
            </div>

            <div className="bg-white p-4 shadow-sm border-l-4 border-[#00a65a]">
              <span className="text-[11px] text-[#777] font-bold uppercase">Ekspektasi Uang Masuk</span>
              <p className="text-[26px] font-bold font-mono text-[#00a65a] mt-1">
                Rp {(reconciliationReport?.summary.total_expected_amount || 0).toLocaleString('id-ID')}
              </p>
              <div className="text-[11px] text-[#777] mt-1">Dihitung otomatis oleh sistem MARS</div>
            </div>

            <div className="bg-white p-4 shadow-sm border-l-4 border-[#dd4b39]">
              <span className="text-[11px] text-[#777] font-bold uppercase">Tingkat Kebocoran (Leakage Rate)</span>
              <p className="text-[26px] font-bold font-mono text-[#dd4b39] mt-1">
                {(reconciliationReport?.summary.leakage_rate_pct || 0).toFixed(2)}%
              </p>
              <div className="text-[11px] text-[#dd4b39] mt-1 font-bold">
                {reconciliationReport?.summary.deficit_count || 0} Shift Tercatat Minus
              </div>
            </div>
          </div>

          {/* Breakdown per Juru Parkir */}
          <div className="bg-white shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
              <h4 className="text-[14px] font-bold text-[#333] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#dd4b39]" />
                Audit Integritas Juru Parkir (Leakage Matrix per Petugas)
              </h4>
              <span className="text-[11px] text-[#777]">Diurutkan berdasarkan selisih minus terbesar</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-[#f4f4f4] text-[#555] uppercase text-[11px] font-bold bg-white">
                    <th className="py-3 px-4">Nama Petugas</th>
                    <th className="py-3 px-4 text-center">Jumlah Shift</th>
                    <th className="py-3 px-4 text-center">Lembar Terjual</th>
                    <th className="py-3 px-4 text-right">Ekspektasi (Teoretis)</th>
                    <th className="py-3 px-4 text-right">Setoran Disetor</th>
                    <th className="py-3 px-4 text-right">Akumulasi Selisih</th>
                    <th className="py-3 px-4 text-center">Status Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {!reconciliationReport?.warden_breakdown || reconciliationReport.warden_breakdown.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[#999]">
                        Belum ada data rekonsiliasi yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    reconciliationReport.warden_breakdown.map((w, idx) => {
                      const isMinus = w.total_unmatched < 0;
                      return (
                        <tr key={idx} className={`border-b border-[#f4f4f4] transition-colors ${
                          isMinus ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-slate-50'
                        }`}>
                          <td className="py-3.5 px-4 font-bold text-[#333] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-[#666] text-[10px] flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            {w.warden_name}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-[#555]">
                            {w.shifts_count}x
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-[#333]">
                            {w.total_sold.toLocaleString('id-ID')} lbr
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-[#555]">
                            Rp {w.total_expected.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#00a65a]">
                            Rp {w.total_actual.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                            {w.total_unmatched < 0 ? (
                              <span className="text-rose-600">-Rp {Math.abs(w.total_unmatched).toLocaleString('id-ID')}</span>
                            ) : w.total_unmatched > 0 ? (
                              <span className="text-blue-600">+Rp {w.total_unmatched.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-600">Rp 0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {w.total_unmatched < 0 ? (
                              Math.abs(w.total_unmatched) >= 50000 || (w.total_expected > 0 && (Math.abs(w.total_unmatched) / w.total_expected) > 0.01) ? (
                                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" /> Kritikal ({w.deficits}x)
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-amber-600" /> Toleransi &le;1% ({w.deficits}x)
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Bersih
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Breakdown per Jenis Kendaraan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white shadow-sm p-4">
              <h4 className="text-[13px] font-bold text-[#333] uppercase border-b border-[#f4f4f4] pb-2 mb-3">
                Distribusi Pendapatan per Objek Kendaraan
              </h4>
              <div className="flex flex-col gap-3">
                {reconciliationReport?.vehicle_breakdown?.map((v, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 border border-[#eee]">
                    <div>
                      <span className="font-bold text-[#333] text-[13px]">{v.jenis_karcis}</span>
                      <div className="text-[11px] text-[#777]">{v.total_sold.toLocaleString('id-ID')} lembar</div>
                    </div>
                    <div className="text-right font-mono font-bold text-[#00a65a] text-[14px]">
                      Rp {v.total_amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-sm p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-[13px] font-bold text-[#333] uppercase border-b border-[#f4f4f4] pb-2 mb-2">
                  Protokol Rekonsiliasi Kas Dishub
                </h4>
                <p className="text-[12px] text-[#666] leading-relaxed">
                  Berdasarkan SOP Retribusi Pelayanan Parkir di Tempat Khusus Parkir Bandara:
                </p>
                <ul className="text-[12px] text-[#555] list-disc list-inside mt-2 space-y-1.5">
                  <li>Setiap karcis disobek bernilai tunai dan menjadi tanggung jawab juru parkir terkait.</li>
                  <li>Karcis sobek/cacat fisik harus diserahkan lembar fisiknya ke bendahara saat rekonsiliasi.</li>
                  <li>Selisih setoran wajib dibubuhi berita acara singkat pada kolom alasan.</li>
                </ul>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-[12px] text-[#3c8dbc]">
                <ShieldCheck className="w-4 h-4 inline mr-1" />
                Data rekonsiliasi ini terisolasi per UPBU dan otomatis disinkronisasi ke Dashboard Eksekutif Kadishub.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DAFTARKAN BUKU KARCIS BARU */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL 1: DAFTARKAN BUKU KARCIS BARU */}
      {/* ========================================================================= */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-[500px] bg-white rounded-lg shadow-xl my-auto overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-[15px] text-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Registrasi Buku Karcis Baru
              </h3>
              <button onClick={() => setShowAddBookModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-700">
              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">Kode Buku Karcis *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: B-TIM-R2-001"
                  value={newBook.kode_buku}
                  onChange={(e) => setNewBook({ ...newBook, kode_buku: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 text-[13px] font-mono rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">Jenis Karcis / Objek *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Roda 2', 'Roda 4', 'VIP', 'Inap'].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleVehicleTypeChange(type)}
                      className={`py-2 px-3 text-[12px] font-semibold border rounded text-center transition-colors ${
                        newBook.jenis_karcis === type
                          ? 'border-slate-800 bg-slate-800 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 block mb-1">Nomor Seri Awal *</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={newBook.seri_awal}
                    onChange={(e) => setNewBook({ ...newBook, seri_awal: parseInt(e.target.value, 10) || 1 })}
                    className="w-full border border-slate-300 px-3 py-2 text-[13px] font-mono rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 block mb-1">Nomor Seri Akhir *</label>
                  <input 
                    type="number" 
                    required
                    min={newBook.seri_awal}
                    value={newBook.seri_akhir}
                    onChange={(e) => setNewBook({ ...newBook, seri_akhir: parseInt(e.target.value, 10) || newBook.seri_awal })}
                    className="w-full border border-slate-300 px-3 py-2 text-[13px] font-mono rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">Nominal per Lembar (Rp) *</label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={newBook.nominal_per_lembar}
                  onChange={(e) => setNewBook({ ...newBook, nominal_per_lembar: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-300 px-3 py-2 text-[13px] font-mono font-bold text-slate-800 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[12px] flex justify-between font-mono">
                <span className="text-slate-500">Kapasitas Buku:</span>
                <span className="font-bold text-slate-800">
                  {Math.max(0, (newBook.seri_akhir - newBook.seri_awal) + 1)} Lembar (Rp {(Math.max(0, (newBook.seri_akhir - newBook.seri_awal) + 1) * newBook.nominal_per_lembar).toLocaleString('id-ID')})
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 text-[12px] font-semibold border border-slate-300 text-slate-600 rounded hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" /> Simpan Buku Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ALOKASIKAN KARCIS KE JURU PARKIR (MULAI SHIFT) */}
      {/* ========================================================================= */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-[520px] bg-white rounded-lg shadow-xl my-auto overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-[15px] text-slate-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-700" />
                Alokasi Karcis ke Juru Parkir
              </h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-700">
              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">Pilih Buku Karcis (Status: STOK) *</label>
                <select 
                  required
                  value={dispatchData.book_id}
                  onChange={(e) => handleSelectBookForDispatch(parseInt(e.target.value, 10))}
                  className="w-full border border-slate-300 px-3 py-2 text-[13px] rounded focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Pilih Buku Karcis Tersedia --</option>
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.kode_buku} — {b.jenis_karcis} (Sisa: seri {b.effective_serial_start ?? b.seri_awal} s/d {b.seri_akhir})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">Nama Juru Parkir *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Yohanes Kogoya"
                  value={dispatchData.warden_name}
                  onChange={(e) => setDispatchData({ ...dispatchData, warden_name: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 text-[13px] rounded focus:border-blue-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Input Nomor Seri yang Rata dan Simetris */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 block mb-1">
                    Nomor Seri Awal *
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      readOnly
                      disabled
                      value={dispatchData.dispatched_serial_start}
                      className="w-full border border-slate-300 bg-slate-100 pl-3 pr-8 py-2 text-[13px] font-mono font-bold text-slate-700 rounded cursor-not-allowed"
                    />
                    <span title="Terkunci otomatis dari sisa karcis fisik" className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Terkunci otomatis (sisa fisik)</span>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 block mb-1">
                    Nomor Seri Akhir *
                  </label>
                  <input 
                    type="number" 
                    required
                    value={dispatchData.dispatched_serial_end}
                    onChange={(e) => setDispatchData({ ...dispatchData, dispatched_serial_end: parseInt(e.target.value, 10) || dispatchData.dispatched_serial_start })}
                    className="w-full border border-slate-300 px-3 py-2 text-[13px] font-mono font-bold text-slate-800 rounded focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Batas akhir alokasi shift</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[12px] text-slate-700">
                <div className="flex justify-between font-mono">
                  <span>Total Lembar Dibawa:</span>
                  <span className="font-bold text-slate-900">
                    {Math.max(0, (dispatchData.dispatched_serial_end - dispatchData.dispatched_serial_start) + 1)} Lembar
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Buku ini akan otomatis berstatus <strong>ACTIVE</strong> dan tidak dapat dialokasikan ke juru parkir lain sebelum diselesaikan (Settle).
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 text-[12px] font-semibold border border-slate-300 text-slate-600 rounded hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !dispatchData.book_id}
                  className="px-4 py-2 text-[12px] font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Serahkan Karcis & Kunci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REKONSILIASI & SETORAN AKHIR SHIFT (SETTLE) */}
      {/* ========================================================================= */}
      {selectedHandoverToSettle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-[550px] bg-white rounded-lg shadow-xl my-auto overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-bold text-[16px] text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Settle & Rekonsiliasi Karcis Fisik
                </h3>
                <span className="text-[12px] text-slate-500">Penutupan shift dan verifikasi setoran uang tunai</span>
              </div>
              <button onClick={() => setSelectedHandoverToSettle(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-700">
              {/* Petugas & Buku Info Box */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Juru Parkir</span>
                  <div className="font-bold text-[14px] text-slate-800">{selectedHandoverToSettle.warden_name}</div>
                  <div className="text-[12px] text-slate-600 mt-0.5">
                    {selectedHandoverToSettle.ticket_books?.kode_buku} &bull; {selectedHandoverToSettle.ticket_books?.jenis_karcis}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Seri Dibawa</span>
                  <div className="text-[13px] font-bold text-slate-800">
                    {selectedHandoverToSettle.dispatched_serial_start} s/d {selectedHandoverToSettle.dispatched_serial_end}
                  </div>
                  <div className="text-[12px] text-slate-600">
                    @Rp {parseFloat(String(selectedHandoverToSettle.ticket_books?.nominal_per_lembar || 0)).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Input Nomor Seri Sisa Fisik */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-slate-700">
                    Nomor Seri Sisa Karcis Terkecil *
                  </label>
                  <button
                    type="button"
                    onClick={() => setSettleData({
                      ...settleData,
                      last_returned_serial: selectedHandoverToSettle.dispatched_serial_end + 1
                    })}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    Habis Terjual Total
                  </button>
                </div>
                <input 
                  type="number" 
                  required
                  min={selectedHandoverToSettle.dispatched_serial_start}
                  max={selectedHandoverToSettle.dispatched_serial_end + 1}
                  value={settleData.last_returned_serial}
                  onChange={(e) => setSettleData({
                    ...settleData,
                    last_returned_serial: parseInt(e.target.value, 10) || selectedHandoverToSettle.dispatched_serial_start
                  })}
                  className="w-full border border-slate-300 px-3 py-2 text-[14px] font-mono font-bold text-slate-800 rounded focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  *Karcis fisik pertama yang belum disobek. Jika habis, sistem mencatat {selectedHandoverToSettle.dispatched_serial_end + 1}.
                </span>
              </div>

              {/* Live Calculation: Lembar Terjual & Ekspektasi Rupiah */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Lembar Terjual</span>
                  <div className="text-[20px] font-bold font-mono text-slate-800">
                    {settleCalculations.soldQty} <span className="text-[12px] font-normal text-slate-500">Lembar</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Ekspektasi Uang</span>
                  <div className="text-[20px] font-bold font-mono text-blue-600 whitespace-nowrap">
                    Rp {settleCalculations.expectedAmount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Input Uang Fisik Riil yang Disetor */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-slate-700">
                    Jumlah Uang Tunai Fisik yang Disetor (Rp) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setSettleData({
                      ...settleData,
                      actual_cash_settled: settleCalculations.expectedAmount
                    })}
                    className="text-[11px] text-emerald-600 hover:underline font-semibold"
                  >
                    Setor Sesuai Ekspektasi
                  </button>
                </div>
                <input 
                  type="number" 
                  required
                  min={0}
                  value={settleData.actual_cash_settled}
                  onChange={(e) => setSettleData({
                    ...settleData,
                    actual_cash_settled: parseFloat(e.target.value) || 0
                  })}
                  className="w-full border border-slate-300 px-3 py-2 text-[15px] font-mono font-bold text-emerald-700 rounded focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Discrepancy Live Box */}
              <div className={`p-3 rounded border flex justify-between items-center font-mono ${
                settleCalculations.discrepancy < 0 ? 'bg-rose-50 border-rose-200 text-rose-800' :
                settleCalculations.discrepancy > 0 ? 'bg-blue-50 border-blue-200 text-blue-800' :
                'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <div>
                  <span className="text-[11px] uppercase font-semibold block">Status Rekonsiliasi</span>
                  <span className="text-[12px] font-sans font-semibold">
                    {settleCalculations.discrepancy < 0 ? '⚠️ Terjadi Selisih Kurang (Defisit)' :
                     settleCalculations.discrepancy > 0 ? 'ℹ️ Terjadi Surplus (Lebih Setor)' :
                     '✓ Setoran Seimbang & Klop'}
                  </span>
                </div>
                <div className="text-[18px] font-bold whitespace-nowrap">
                  {settleCalculations.discrepancy < 0 ? `-Rp ${Math.abs(settleCalculations.discrepancy).toLocaleString('id-ID')}` :
                   settleCalculations.discrepancy > 0 ? `+Rp ${settleCalculations.discrepancy.toLocaleString('id-ID')}` : 'Rp 0'}
                </div>
              </div>

              {/* Alasan / Keterangan (WAJIB JIKA DEFISIT) */}
              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">
                  Keterangan / Berita Acara Selisih {settleCalculations.discrepancy < 0 && <span className="text-rose-600 font-bold">*Wajib Diisi</span>}
                </label>
                <textarea
                  rows={2}
                  placeholder={settleCalculations.discrepancy < 0 ? "Contoh: 2 lembar karcis robek/rusak kena hujan, sisa disobek tapi fisik terlampir..." : "Keterangan opsional..."}
                  value={settleData.notes}
                  onChange={(e) => setSettleData({ ...settleData, notes: e.target.value })}
                  className={`w-full border rounded px-3 py-2 text-[12px] focus:outline-none ${
                    settleCalculations.discrepancy < 0 && (!settleData.notes || settleData.notes.trim() === '')
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                      : 'border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedHandoverToSettle(null)}
                  className="px-4 py-2 text-[12px] font-semibold border border-slate-300 text-slate-600 rounded hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Konfirmasi & Kunci Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
