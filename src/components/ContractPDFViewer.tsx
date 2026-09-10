"use client";

import React, { useState } from 'react';
import { Contract } from '@/types/contract';
import { Loader2, Download, X } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

dayjs.locale('id');

interface Props {
  contract: Contract;
  onClose: () => void;
  isInline?: boolean;
}

export default function ContractPDFViewer({ contract, onClose, isInline = false }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const masterTariffs = Array.isArray(contract.fasilitas) ? contract.fasilitas : [];

  const pages: any[] = [];
  const remainingTariffs = [...masterTariffs];
  
  const page1Capacity = 8;
  const page1Tariffs = remainingTariffs.splice(0, page1Capacity);
  
  let isSignatureOnPage1 = false;
  if (remainingTariffs.length === 0 && page1Tariffs.length <= 5) {
    isSignatureOnPage1 = true;
  }

  pages.push({
    isFirstPage: true,
    tariffs: page1Tariffs,
    hasSignature: isSignatureOnPage1,
  });

  if (remainingTariffs.length === 0 && !isSignatureOnPage1) {
    pages.push({
      isFirstPage: false,
      tariffs: [],
      hasSignature: true,
    });
  }

  while (remainingTariffs.length > 0) {
    const pageCapacity = 20; 
    const isLastChunk = remainingTariffs.length <= pageCapacity;
    let currentChunkCapacity = pageCapacity;
    let hasSignature = false;

    if (isLastChunk) {
      if (remainingTariffs.length <= 10) {
        currentChunkCapacity = 10;
        hasSignature = true;
      } else {
        currentChunkCapacity = pageCapacity;
        hasSignature = false;
      }
    }

    const chunk = remainingTariffs.splice(0, currentChunkCapacity);
    pages.push({
      isFirstPage: false,
      tariffs: chunk,
      hasSignature: hasSignature,
    });

    if (isLastChunk && !hasSignature) {
      pages.push({
        isFirstPage: false,
        tariffs: [],
        hasSignature: true,
      });
    }
  }

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = document.getElementById('contract-document');
    if (!element) {
      setIsDownloading(false);
      toast("Dokumen tidak ditemukan.");
      return;
    }

    const originalGap = element.style.gap;
    const pages = document.querySelectorAll('.page-a4');

    try {
      element.style.gap = '0px';
      pages.forEach(p => p.classList.remove('shadow-xl'));

      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin:       0,
        filename:     `Kontrak_${contract.contract_type || 'Dokumen'}_${contract?.tenants?.nama_perusahaan || ''}.pdf`,
        image:        { type: 'jpeg' as const, quality: 1 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          windowWidth: 794
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Gagal membuat PDF", error);
      toast.error("Gagal mengunduh PDF.");
    } finally {
      element.style.gap = originalGap;
      pages.forEach(p => p.classList.add('shadow-xl'));
      setIsDownloading(false);
    }
  };

  return (
    <div className={isInline ? "bg-slate-100 flex flex-col items-center p-4 md:p-8 rounded border border-slate-200 mt-4 overflow-auto max-h-[800px]" : "fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex flex-col items-center p-4 md:p-8"}>
      
      {/* Header Actions */}
      <div className={`w-full max-w-[794px] mb-4 flex justify-end print:hidden gap-3 ${isInline ? 'hidden' : ''}`}>
        {!isInline && (
          <button 
            onClick={onClose}
            className="flex items-center px-4 py-2 font-bold text-sm rounded transition bg-white text-gray-800 hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-2" /> Tutup
          </button>
        )}
        <button 
          id="download-pdf-btn"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center px-4 py-2 font-bold text-sm rounded shadow transition"
          style={{ backgroundColor: '#1f2937', color: '#ffffff', opacity: isDownloading ? 0.7 : 1 }}
        >
          {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {isDownloading ? "Memproses PDF..." : "Unduh PDF"}
        </button>
      </div>

      {/* Kontainer Utama Pengikat Lembaran Kertas */}
      <div id="contract-document" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', paddingBottom: '40px' }}>
        
        {pages.map((page, index) => (
          <div 
            key={index}
            className="page-a4 shadow-xl box-border relative"
            style={{ 
              width: '794px', 
              height: '1122px', 
              backgroundColor: '#ffffff', 
              color: '#000000',
              fontFamily: '"Times New Roman", Times, serif',
              padding: '40px 50px',
              position: 'relative'
            }}
          >
            {page.isFirstPage && (
              <>
                {/* Kop Surat */}
                <div className="flex items-center justify-between pb-4 mb-1" style={{ borderBottom: '3px solid #000000' }}>
                  <div className="w-[80px] h-[80px] relative">
                    <img 
                      src="/images/logo dishub .png" 
                      alt="Logo Dishub" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="text-center flex-1 mx-4">
                    <h1 className="text-xl font-bold uppercase m-0 p-0">Kementerian Perhubungan Republik Indonesia</h1>
                    <h2 className="text-lg font-bold uppercase m-0 p-0">Direktorat Jenderal Perhubungan Udara</h2>
                    <h3 className="text-md font-bold uppercase m-0 p-0">Kantor Unit Penyelenggara Bandar Udara Mozes Kilangin</h3>
                    <p className="text-xs mt-1 m-0 p-0">Jl. Airport No. 1, Timika, Mimika, Papua Tengah - 99910</p>
                  </div>
                  <div className="w-[80px]"></div> {/* Spacer */}
                </div>
                <div className="mb-6" style={{ borderBottom: '1px solid #000000' }}></div>
                
                {/* Judul Dokumen */}
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold uppercase underline underline-offset-4 m-0 p-0">
                    {contract.contract_type === 'Sewa' ? 'Kontrak Sewa Pemanfaatan Aset' : 'Kontrak Payung Pemanfaatan Aset'}
                  </h2>
                  <p className="text-sm mt-1 m-0 p-0">Nomor: {contract.contract_number}</p>
                </div>

                {/* Paragraf Pembuka */}
                <div className="text-[13px] leading-relaxed text-justify mb-4 space-y-2">
                  <p className="m-0 p-0">
                    Pada hari ini, tanggal <strong>{dayjs(contract.start_date).format('DD')}</strong> bulan <strong>{dayjs(contract.start_date).format('MMMM')}</strong> tahun <strong>{dayjs(contract.start_date).format('YYYY')}</strong>, yang bertanda tangan di bawah ini:
                  </p>
                  
                  <div className="ml-6 space-y-1">
                    <div className="flex">
                      <span className="w-8">I.</span>
                      <span className="w-32 font-bold">Pihak Pertama</span>
                      <span className="flex-1">: Kepala Unit Penyelenggara Bandar Udara Mozes Kilangin, dalam hal ini bertindak untuk dan atas nama instansi tersebut.</span>
                    </div>
                    <div className="flex">
                      <span className="w-8">II.</span>
                      <span className="w-32 font-bold">Pihak Kedua</span>
                      <span className="flex-1 space-y-1">
                        <div className="flex"><span className="w-32">Nama Perusahaan</span><span className="mr-2">:</span><span className="flex-1"><strong>{contract.tenants?.nama_perusahaan || '-'}</strong></span></div>
                        <div className="flex"><span className="w-32">Alamat</span><span className="mr-2">:</span><span className="flex-1">{contract.tenants?.alamat || '-'}</span></div>
                        <div className="flex"><span className="w-32">Diwakili Oleh</span><span className="mr-2">:</span><span className="flex-1">{contract.tenants?.pic || '-'}</span></div>
                        <div className="flex"><span className="w-32">NIB / NPWP</span><span className="mr-2">:</span><span className="flex-1">{contract.tenants?.nib || '-'} / {contract.tenants?.npwp || '-'}</span></div>
                      </span>
                    </div>
                    
                    <div className="flex mt-2">
                      <span className="w-8"></span>
                      <span className="w-32"></span>
                      <span className="flex-1 text-justify">
                        Dalam hal ini bertindak untuk dan atas nama entitas perusahaan tersebut, yang selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
                      </span>
                    </div>
                  </div>

                  <p className="m-0 p-0 mt-4">
                    Kedua belah pihak telah sepakat untuk mengikatkan diri dalam {contract.contract_type === 'Sewa' ? 'Kontrak Sewa' : 'Kontrak Payung'} Pemanfaatan Aset Bandar Udara dengan syarat dan ketentuan sebagai berikut:
                  </p>
                </div>

                {/* Pasal 1 */}
                <div className="text-[13px] leading-relaxed text-justify space-y-4 mb-4">
                  <div>
                    <h3 className="font-bold text-center m-0 p-0">PASAL 1<br/>MASA BERLAKU</h3>
                    <p className="m-0 p-0 mt-1">
                      Kontrak ini berlaku efektif terhitung mulai tanggal <strong>{dayjs(contract.start_date).format('DD MMMM YYYY')}</strong> sampai dengan tanggal <strong>{dayjs(contract.end_date).format('DD MMMM YYYY')}</strong>. Selama masa kontrak berstatus <strong>{contract.status?.toUpperCase() || 'ACTIVE'}</strong>, Pihak Kedua berhak memanfaatkan aset bandara.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Jika ada tarif untuk halaman ini */}
            {page.tariffs.length > 0 && (
              <div className="text-[13px] leading-relaxed text-justify">
                {page.isFirstPage && (
                  <>
                    <h3 className="font-bold text-center m-0 p-0">PASAL 2<br/>DAFTAR TARIF DAN FASILITAS</h3>
                    <p className="m-0 p-0 mt-1 mb-2">
                      Pihak Kedua tunduk pada Master Tarif pemanfaatan fasilitas Bandar Udara Mozes Kilangin yang telah ditetapkan di bawah ini:
                    </p>
                  </>
                )}
                {!page.isFirstPage && (
                  <p className="m-0 p-0 mb-2 italic">Lanjutan Daftar Tarif dan Fasilitas...</p>
                )}
                
                {/* Tabel Tarif */}
                <table className="w-full text-left border-collapse mt-2" style={{ border: '1px solid #000000' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th className="p-1.5 font-bold text-center text-[12px]" style={{ border: '1px solid #000000' }}>Kode</th>
                      <th className="p-1.5 font-bold text-center text-[12px]" style={{ border: '1px solid #000000' }}>Objek / Fasilitas</th>
                      <th className="p-1.5 font-bold text-center text-[12px]" style={{ border: '1px solid #000000' }}>Jenis Layanan</th>
                      <th className="p-1.5 font-bold text-center text-[12px]" style={{ border: '1px solid #000000' }}>Tarif (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.tariffs.map((tarif: any, tIndex: number) => (
                      <tr key={tIndex}>
                        <td className="p-1.5 text-center text-[11px]" style={{ border: '1px solid #000000' }}>{tarif.kode_tarif}</td>
                        <td className="p-1.5 text-[11px]" style={{ border: '1px solid #000000' }}>{tarif.objek}</td>
                        <td className="p-1.5 text-[11px]" style={{ border: '1px solid #000000' }}>{tarif.jenis_layanan}</td>
                        <td className="p-1.5 text-right text-[11px]" style={{ border: '1px solid #000000' }}>
                          {formatRupiah(tarif.tarif)} <span style={{ fontSize: '9px' }}>/ {tarif.satuan}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pasal 3 dan Tanda Tangan hanya dirender di halaman yang dialokasikan */}
            {page.hasSignature && (
              <div className="mt-8">
                <div className="text-[13px] leading-relaxed text-justify mb-10">
                  <h3 className="font-bold text-center m-0 p-0 mt-6">PASAL 3<br/>SKEMA PENAGIHAN</h3>
                  <p className="m-0 p-0 mt-1">
                    Penagihan atas pemanfaatan yang diajukan oleh Pihak Kedua akan ditagihkan dengan periode <strong>{contract.periode_pembayaran || 'Sesuai Pemakaian'}</strong>. Pembayaran harus dilakukan sebelum batas waktu yang tertera pada dokumen Tagihan.
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="text-[13px]">
                  <div className="flex justify-between px-10">
                    <div className="text-center">
                      <p className="mb-20"><strong>PIHAK KEDUA</strong></p>
                      <p className="font-bold inline-block min-w-[150px]" style={{ borderBottom: '1px solid #000000' }}>{contract.tenants?.pic || 'Nama Perwakilan'}</p>
                      <p className="mt-1 text-[11px]">{contract.tenants?.nama_perusahaan || 'Direktur Perusahaan'}</p>
                    </div>
                    <div className="text-center">
                      <p>Timika, {dayjs(contract.start_date).format('DD MMMM YYYY')}</p>
                      <p className="mb-14"><strong>PIHAK PERTAMA</strong></p>
                      <p className="font-bold inline-block min-w-[150px]" style={{ borderBottom: '1px solid #000000' }}>Kepala Mozes Kilangin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Indikator Halaman */}
            <div className="absolute bottom-[20px] w-full text-center left-0 text-[10px]" style={{ color: '#666666' }}>
              - Halaman {index + 1} dari {pages.length} -
            </div>
            
          </div>
        ))}

      </div>
    </div>
  );
}
