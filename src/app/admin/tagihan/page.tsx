"use client";

import React, { useState } from 'react';
import { 
  Receipt, Search, Filter, Mail, Download, 
  CheckCircle2, Clock, AlertTriangle, PlayCircle, RotateCcw, X, Calculator
} from 'lucide-react';

export default function AdminTagihanSKRDPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedSkrd, setSelectedSkrd] = useState<any>(null);

  const [skrdList, setSkrdList] = useState([
    {
      id: "SKRD-26-0811",
      tenant: "PT. Trigana Air Service",
      tenantId: "T-2023-0042",
      pksRef: "PKS/OFF/2025-099",
      nominal: 15500000,
      dueDate: "20 Ags 2026",
      status: "overdue",
      overdueText: "Telat 4 Hari"
    },
    {
      id: "SKRD-26-0820",
      tenant: "PT. Jaya Dirgantara",
      tenantId: "T-2024-0018",
      pksRef: "PKS/HGR/2026-012",
      nominal: 120000000,
      dueDate: "10 Sep 2026",
      status: "pending",
      overdueText: ""
    },
    {
      id: "SKRD-26-0801",
      tenant: "Susi Air (PT. ASI)",
      tenantId: "T-2023-0001",
      pksRef: "PKS/HGR/2024-001",
      nominal: 180000000,
      dueDate: "15 Ags 2026",
      status: "paid",
      overdueText: ""
    }
  ]);

  const [adjustForm, setAdjustForm] = useState({
    alasan: "selisih_inap",
    keterangan: "Penyesuaian durasi menginap pesawat Cessna (potongan 2 malam karena maintenance runway)",
    nominalBaru: 105000000
  });

  const handleOpenAdjust = (item: any) => {
    setSelectedSkrd(item);
    setAdjustForm({
      alasan: "selisih_inap",
      keterangan: "Penyesuaian durasi menginap pesawat (koreksi log pemakaian)",
      nominalBaru: Math.round(item.nominal * 0.9)
    });
    setShowAdjustModal(true);
  };

  const handleApplyAdjustment = () => {
    if (!selectedSkrd) return;
    setSkrdList(skrdList.map(item => {
      if (item.id === selectedSkrd.id) {
        return { ...item, nominal: Number(adjustForm.nominalBaru) };
      }
      return item;
    }));
    setShowAdjustModal(false);
    alert(`Berhasil! Tagihan ${selectedSkrd.id} telah dikoreksi menjadi Rp ${Number(adjustForm.nominalBaru).toLocaleString('id-ID')}. e-SKRD revisi otomatis diperbarui di portal Tenant.`);
  };

  const handleGenerateSKRD = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("Berhasil! 18 SKRD untuk bulan September 2026 telah diterbitkan ke masing-masing portal Tenant.");
    }, 1500);
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase">
            Manajemen Tagihan & e-SKRD
          </h1>
          <p className="text-[12px] text-[#777]">Penerbitan SKRD, Monitoring Pembayaran, dan Koreksi Nilai Tagihan (Adjustment)</p>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin</span> / <span className="ml-1 font-medium">Tagihan</span>
        </div>
      </header>

      {/* Kontrol Utama: Generate Massal */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-[16px] text-[#444] font-bold mb-1">Siklus Penagihan: September 2026</h3>
          <p className="text-[13px] text-[#666]">Sistem telah mendeteksi 18 Kontrak PKS Aktif yang membutuhkan penerbitan tagihan SKRD bulan ini.</p>
        </div>
        
        <button 
          onClick={handleGenerateSKRD}
          disabled={isGenerating}
          className={`flex items-center justify-center font-bold text-[14px] px-6 py-3 transition-colors shadow-sm whitespace-nowrap ${
            isGenerating ? 'bg-[#d2d6de] text-[#777] cursor-not-allowed' : 'bg-[#00a65a] hover:bg-[#008d4c] text-white'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">Memproses...</span>
          ) : (
            <span className="flex items-center"><PlayCircle className="w-5 h-5 mr-2" /> Generate 18 e-SKRD Sekarang</span>
          )}
        </button>
      </div>

      {/* Tabel Database e-SKRD */}
      <div className="bg-white shadow-sm flex-1 mt-2 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Pantau Pembayaran SKRD
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Filter Status */}
            <div className="flex items-center border border-[#d2d6de] bg-white px-2">
              <Filter className="w-4 h-4 text-[#777] mr-2" />
              <select className="py-1.5 text-[13px] focus:outline-none text-[#555] bg-transparent">
                <option value="">Semua Status</option>
                <option value="lunas">Lunas (Paid)</option>
                <option value="pending">Belum Bayar (Pending)</option>
                <option value="overdue">Jatuh Tempo (Overdue)</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="flex">
              <input type="text" placeholder="Cari No SKRD atau Tenant..." className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[250px]" />
              <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                <Search className="w-4 h-4 text-[#777]" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px] bg-white">
                <th className="py-4 px-5 font-bold w-[25%]">Pihak Tertagih (Tenant)</th>
                <th className="py-4 px-5 font-bold w-[20%]">Nomor Ketetapan (SKRD)</th>
                <th className="py-4 px-5 font-bold text-right w-[18%]">Nominal Retribusi (Rp)</th>
                <th className="py-4 px-5 font-bold text-center w-[15%]">Batas Waktu</th>
                <th className="py-4 px-5 font-bold text-center w-[12%]">Status</th>
                <th className="py-4 px-5 font-bold text-center w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {skrdList.map((item) => (
                <tr 
                  key={item.id} 
                  className={`border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors ${
                    item.status === 'overdue' ? 'bg-[#dd4b39]/5' : ''
                  }`}
                >
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#333] text-[15px]">{item.tenant}</div>
                    <div className="text-[11px] text-[#777]">ID: {item.tenantId}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-[#3c8dbc]">{item.id}</div>
                    <div className="text-[11px] text-[#777]">Ref PKS: {item.pksRef}</div>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">
                    {item.nominal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className={`font-bold ${item.status === 'overdue' ? 'text-[#dd4b39]' : 'text-[#333]'}`}>{item.dueDate}</span>
                    {item.overdueText && <div className="text-[10px] text-[#dd4b39] uppercase mt-1">{item.overdueText}</div>}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.status === 'overdue' && (
                      <span className="inline-flex items-center bg-[#dd4b39] text-white text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Jatuh Tempo
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center bg-[#f39c12]/10 text-[#f39c12] border border-[#f39c12]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 mr-1" /> Menunggu
                      </span>
                    )}
                    {item.status === 'paid' && (
                      <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 text-[11px] px-2 py-1 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Lunas
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.status !== 'paid' ? (
                      <div className="flex flex-col gap-1">
                        <button className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-2 py-1 text-[12px] font-bold flex items-center justify-center shadow-sm w-full">
                          <Mail className="w-3.5 h-3.5 mr-1 text-[#dd4b39]" /> Tagih
                        </button>
                        <button 
                          onClick={() => handleOpenAdjust(item)}
                          className="bg-[#f39c12] border border-[#e08e0b] text-white hover:bg-[#e08e0b] px-2 py-1 text-[12px] font-bold flex items-center justify-center shadow-sm w-full transition-colors" 
                          title="Klik untuk koreksi nilai tagihan / selisih durasi inap"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Adjust
                        </button>
                      </div>
                    ) : (
                      <button className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-2 py-1 text-[12px] font-bold flex items-center justify-center shadow-sm w-full" title="Unduh Arsip Kwitansi">
                        <Download className="w-4 h-4 text-[#3c8dbc]" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>Menampilkan {skrdList.length} dari 18 Tagihan SKRD</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#d2d6de] bg-white hover:bg-[#e0e0e0]">Prev</button>
            <button className="px-3 py-1 border border-[#3c8dbc] bg-[#3c8dbc] text-white">1</button>
            <button className="px-3 py-1 border border-[#d2d6de] bg-white hover:bg-[#e0e0e0]">Next</button>
          </div>
        </div>
      </div>

      {/* Modal Adjust / Koreksi Nilai Tagihan SKRD */}
      {showAdjustModal && selectedSkrd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-t-[4px] border-[#f39c12] shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-[#f4f4f4] flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-[#333] flex items-center">
                <RotateCcw className="w-5 h-5 mr-2 text-[#f39c12]" /> Fitur Adjustment / Koreksi e-SKRD
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-[#777] hover:text-[#333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-[14px]">
              <div className="bg-slate-50 border border-[#d2d6de] p-3 text-[13px]">
                <div className="flex justify-between mb-1">
                  <span className="text-[#777]">Nomor e-SKRD:</span>
                  <span className="font-mono font-bold text-[#3c8dbc]">{selectedSkrd.id}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#777]">Nama Tenant:</span>
                  <span className="font-bold text-[#333]">{selectedSkrd.tenant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777]">Nominal Semula:</span>
                  <span className="font-mono font-bold text-[#dd4b39]">Rp {selectedSkrd.nominal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#444] text-[12px] uppercase">Alasan Koreksi (Adjustment)</label>
                <select 
                  value={adjustForm.alasan}
                  onChange={(e) => setAdjustForm({...adjustForm, alasan: e.target.value})}
                  className="w-full p-2 border border-[#d2d6de] focus:border-[#f39c12] focus:outline-none bg-white font-semibold"
                >
                  <option value="selisih_inap">Selisih Durasi Menginap Pesawat (Koreksi Log Pemakaian)</option>
                  <option value="koreksi_utilitas">Koreksi Meteran Utilitas (Stand KWh / M³ Air)</option>
                  <option value="diskon_pemda">Insentif / Diskon Tarif Kebijakan Pemda</option>
                  <option value="koreksi_denda">Penyesuaian / Penghapusan Denda Keterlambatan</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#444] text-[12px] uppercase">Rincian Keterangan Koreksi</label>
                <textarea 
                  rows={3}
                  value={adjustForm.keterangan}
                  onChange={(e) => setAdjustForm({...adjustForm, keterangan: e.target.value})}
                  className="w-full p-2 border border-[#d2d6de] focus:border-[#f39c12] focus:outline-none text-[13px]"
                  placeholder="Jelaskan alasan perubahan nilai tagihan..."
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#444] text-[12px] uppercase">Nominal Tagihan Baru (Rp) <span className="text-[#dd4b39]">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-[#777]">Rp</span>
                  <input 
                    type="number" 
                    value={adjustForm.nominalBaru}
                    onChange={(e) => setAdjustForm({...adjustForm, nominalBaru: Number(e.target.value)})}
                    className="w-full p-2 pl-10 border-2 border-[#f39c12] focus:outline-none font-mono font-bold text-[18px] text-[#333]"
                  />
                </div>
                <p className="text-[11px] text-[#777] mt-1">Perubahan nominal akan otomatis memperbarui dokumen e-SKRD revisi yang ada di portal Tenant.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-[#f4f4f4] flex justify-end gap-3">
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="bg-white border border-[#d2d6de] text-[#444] px-5 py-2 hover:bg-[#e0e0e0] text-[13px]"
              >
                Batal
              </button>
              <button 
                onClick={handleApplyAdjustment}
                className="bg-[#f39c12] hover:bg-[#e08e0b] text-white font-bold px-6 py-2 transition-colors text-[13px] shadow-sm flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" /> Simpan Koreksi (Apply Adjustment)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
