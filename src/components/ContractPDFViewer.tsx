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
  readonly contract: Contract;
  readonly tenant?: any;
  readonly onClose: () => void;
  readonly isInline?: boolean;
}

interface ContractPageData {
  id: number;
  isFirstPage: boolean;
  tariffs: any[];
  hasSignature: boolean;
}

function computeContractPages(masterTariffs: any[]): ContractPageData[] {
  const pages: ContractPageData[] = [];
  const remainingTariffs = [...masterTariffs];
  
  const page1Capacity = 8;
  const page1Tariffs = remainingTariffs.splice(0, page1Capacity);
  
  const isSignatureOnPage1 = remainingTariffs.length === 0 && page1Tariffs.length <= 5;

  pages.push({
    id: 1,
    isFirstPage: true,
    tariffs: page1Tariffs,
    hasSignature: isSignatureOnPage1,
  });

  if (remainingTariffs.length === 0 && !isSignatureOnPage1) {
    pages.push({
      id: 2,
      isFirstPage: false,
      tariffs: [],
      hasSignature: true,
    });
  }

  let pageCounter = pages.length + 1;
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
      }
    }

    const chunk = remainingTariffs.splice(0, currentChunkCapacity);
    pages.push({
      id: pageCounter++,
      isFirstPage: false,
      tariffs: chunk,
      hasSignature,
    });

    if (isLastChunk && !hasSignature) {
      pages.push({
        id: pageCounter++,
        isFirstPage: false,
        tariffs: [],
        hasSignature: true,
      });
    }
  }

  return pages;
}

export default function ContractPDFViewer({ contract, tenant, onClose, isInline = false }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const tenantData = contract.tenants || tenant;
  let fasilitasObj: any = contract.fasilitas;
  if (typeof fasilitasObj === 'string') {
    try {
      fasilitasObj = JSON.parse(fasilitasObj);
    } catch (e) {
      fasilitasObj = {};
    }
  }

  const isMini = contract.contract_type === 'PKS Payung Mini Airport' || 
                 (contract as any).airport_type === 'MINI_AIRPORT' ||
                 Boolean(
                   fasilitasObj && 
                   !Array.isArray(fasilitasObj) && 
                   (fasilitasObj.category === 'Mini Airport' ||
                    fasilitasObj.mini_airport_id ||
                    fasilitasObj.mini_airport_name ||
                    fasilitasObj.airport_code ||
                    (fasilitasObj.airport_name && !fasilitasObj.airport_name.toLowerCase().includes('mozes')))
                 );
  
  const miniSpec = isMini && !Array.isArray(fasilitasObj) ? fasilitasObj : null;
  const airportDisplayName = 
    miniSpec?.airport_name || 
    miniSpec?.nama_bandara || 
    miniSpec?.mini_airport_name || 
    (contract as any).airport_name || 
    'Mini Airport Perintis';

  const airportDisplayCode = 
    miniSpec?.airport_code || 
    miniSpec?.kode_bandara || 
    (contract as any).airport_code || 
    '';

  const airportLocation = 
    miniSpec?.airport_location || 
    miniSpec?.lokasi || 
    'Papua Tengah';

  const rawItems = isMini 
    ? (miniSpec?.master_taxes || [])
    : (Array.isArray(fasilitasObj) ? fasilitasObj : (Array.isArray(contract.fasilitas) ? contract.fasilitas : []));
  
  const pages = computeContractPages(rawItems);

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
    <div className={isInline ? "bg-slate-100 flex flex-col items-center p-4 md:p-8 rounded border border-slate-200 mt-4 overflow-auto max-h-[800px]" : "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm transition-all duration-300 flex flex-col items-center p-4 md:p-8"}>
      
      {/* Header Actions */}
      <div className={`w-full max-w-[794px] mb-4 flex justify-end print:hidden gap-3 ${isInline ? 'hidden' : ''}`}>
        {!isInline && (
          <button 
            onClick={onClose}
            className="flex items-center px-4 py-2 font-bold text-sm rounded-none transition bg-white text-gray-800 hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-2" /> Tutup
          </button>
        )}
        <button 
          id="download-pdf-btn"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center px-4 py-2 font-bold text-sm rounded-none shadow transition"
          style={{ backgroundColor: '#1f2937', color: '#ffffff', opacity: isDownloading ? 0.7 : 1 }}
        >
          {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {isDownloading ? "Memproses PDF..." : "Unduh PDF"}
        </button>
      </div>

      {/* Kontainer Utama Pengikat Lembaran Kertas */}
      <div id="contract-document" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', paddingBottom: '40px' }}>
        
        {pages.map((page) => (
          <div 
            key={`page-${page.id}`}
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
                    {isMini ? (
                      <>
                        <h1 className="text-xl font-bold uppercase m-0 p-0">Pemerintah Provinsi Papua Tengah</h1>
                        <h2 className="text-lg font-bold uppercase m-0 p-0">Dinas Perhubungan</h2>
                        <h3 className="text-md font-bold uppercase m-0 p-0">Unit Pelaksana Teknis Bandara Perintis — {airportDisplayName.toUpperCase()}</h3>
                        <p className="text-xs mt-1 m-0 p-0">{airportLocation}, Indonesia</p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-xl font-bold uppercase m-0 p-0">Kementerian Perhubungan Republik Indonesia</h1>
                        <h2 className="text-lg font-bold uppercase m-0 p-0">Direktorat Jenderal Perhubungan Udara</h2>
                        <h3 className="text-md font-bold uppercase m-0 p-0">Kantor Unit Penyelenggara Bandar Udara Mozes Kilangin</h3>
                        <p className="text-xs mt-1 m-0 p-0">Jl. Airport No. 1, Timika, Mimika, Papua Tengah - 99910</p>
                      </>
                    )}
                  </div>
                  <div className="w-[80px]"></div> {/* Spacer */}
                </div>
                <div className="mb-6" style={{ borderBottom: '1px solid #000000' }}></div>
                
                {/* Judul Dokumen */}
                <div className="text-center mb-6">
                  {isMini ? (
                    <>
                      <h2 className="text-lg font-bold uppercase underline underline-offset-4 m-0 p-0">
                        Perjanjian Kerja Sama Induk (PKS Payung) Pelayanan Penerbangan Perintis
                      </h2>
                      <h3 className="text-sm font-bold uppercase mt-1 m-0 p-0">
                        {airportDisplayName.toUpperCase().startsWith('BANDARA') || airportDisplayName.toUpperCase().startsWith('MINI')
                          ? airportDisplayName.toUpperCase()
                          : `Bandara ${airportDisplayName.toUpperCase()}`} {airportDisplayCode ? `(${airportDisplayCode})` : ''}
                      </h3>
                    </>
                  ) : (
                    <h2 className="text-lg font-bold uppercase underline underline-offset-4 m-0 p-0">
                      {contract.contract_type === 'Sewa' ? 'Kontrak Sewa Pemanfaatan Aset' : 'Kontrak Payung Pemanfaatan Aset'}
                    </h2>
                  )}
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
                      <span className="flex-1">
                        {isMini 
                          ? ': Kepala Dinas Perhubungan Provinsi Papua Tengah, dalam hal ini bertindak untuk dan atas nama Pemerintah Provinsi Papua Tengah.'
                          : ': Kepala Unit Penyelenggara Bandar Udara Mozes Kilangin, dalam hal ini bertindak untuk dan atas nama instansi tersebut.'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-8">II.</span>
                      <span className="w-32 font-bold">Pihak Kedua</span>
                      <span className="flex-1 space-y-1">
                        <div className="flex"><span className="w-32">Nama Perusahaan</span><span className="mr-2">:</span><span className="flex-1"><strong>{tenantData?.nama_perusahaan || '-'}</strong></span></div>
                        <div className="flex"><span className="w-32">Alamat</span><span className="mr-2">:</span><span className="flex-1">{tenantData?.alamat || '-'}</span></div>
                        <div className="flex"><span className="w-32">Diwakili Oleh</span><span className="mr-2">:</span><span className="flex-1">{tenantData?.pic || '-'}</span></div>
                        <div className="flex"><span className="w-32">NIB / NPWP</span><span className="mr-2">:</span><span className="flex-1">{tenantData?.nib || '-'} / {tenantData?.npwp || '-'}</span></div>
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
                    Kedua belah pihak telah sepakat untuk mengikatkan diri dalam {isMini ? 'Perjanjian Kerja Sama Induk (PKS Payung) Pelayanan Penerbangan Perintis' : (contract.contract_type === 'Sewa' ? 'Kontrak Sewa' : 'Kontrak Payung')} Pemanfaatan Jasa Kebandarudaraan dengan syarat dan ketentuan sebagai berikut:
                  </p>
                </div>

                {/* Pasal 1 */}
                <div className="text-[13px] leading-relaxed text-justify space-y-4 mb-4">
                  <div>
                    <h3 className="font-bold text-center m-0 p-0">PASAL 1<br/>MASA BERLAKU</h3>
                    <p className="m-0 p-0 mt-1">
                      Kontrak ini berlaku efektif selama 1 (satu) tahun terhitung mulai tanggal <strong>{dayjs(contract.start_date).format('DD MMMM YYYY')}</strong> sampai dengan tanggal <strong>{dayjs(contract.end_date).format('DD MMMM YYYY')}</strong>. Selama masa kontrak berstatus <strong>{contract.status?.toUpperCase() || 'ACTIVE'}</strong>, Pihak Kedua berhak memanfaatkan fasilitas penerbangan dan pendaratan bandara.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Jika ada tarif/pajak untuk halaman ini */}
            {page.tariffs.length > 0 && (
              <div className="text-[13px] leading-relaxed text-justify">
                {page.isFirstPage && (
                  <>
                    <h3 className="font-bold text-center m-0 p-0">
                      PASAL 2<br/>
                      {isMini ? 'DAFTAR KOMPONEN TAX RETRIBUSI JASA KEBANDARUDARAAN' : 'DAFTAR TARIF DAN FASILITAS'}
                    </h3>
                    <p className="m-0 p-0 mt-1 mb-2">
                      {isMini 
                        ? `Pihak Kedua tunduk pada Master Tax Retribusi Jasa Kebandarudaraan ${airportDisplayName} yang ditetapkan oleh Pemerintah Daerah di bawah ini:`
                        : 'Pihak Kedua tunduk pada Master Tarif pemanfaatan fasilitas Bandar Udara Mozes Kilangin yang telah ditetapkan di bawah ini:'}
                    </p>
                  </>
                )}
                {!page.isFirstPage && (
                  <p className="m-0 p-0 mb-2 italic">
                    {isMini ? 'Lanjutan Daftar Komponen Tax Retribusi...' : 'Lanjutan Daftar Tarif dan Fasilitas...'}
                  </p>
                )}
                
                {/* Tabel Tarif / Tax */}
                {isMini ? (
                  <table className="w-full text-left border-collapse mt-2" style={{ border: '1px solid #000000' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th className="p-1.5 font-bold text-center text-[11px]" style={{ border: '1px solid #000000' }}>Kode Tax</th>
                        <th className="p-1.5 font-bold text-left text-[11px]" style={{ border: '1px solid #000000' }}>Komponen Retribusi</th>
                        <th className="p-1.5 font-bold text-center text-[11px]" style={{ border: '1px solid #000000' }}>Kategori</th>
                        <th className="p-1.5 font-bold text-left text-[11px]" style={{ border: '1px solid #000000' }}>Armada / Tipe</th>
                        <th className="p-1.5 font-bold text-right text-[11px]" style={{ border: '1px solid #000000' }}>Tarif Retribusi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.tariffs.map((tax: any, tIndex: number) => (
                        <tr key={tax.id || `${tax.kode_tax}-${tIndex}`}>
                          <td className="p-1.5 text-center text-[10.5px] font-mono" style={{ border: '1px solid #000000' }}>{tax.kode_tax}</td>
                          <td className="p-1.5 text-[10.5px] font-semibold" style={{ border: '1px solid #000000' }}>{tax.nama_tax}</td>
                          <td className="p-1.5 text-center text-[10.5px]" style={{ border: '1px solid #000000' }}>{tax.kategori}</td>
                          <td className="p-1.5 text-[10.5px]" style={{ border: '1px solid #000000' }}>{tax.aircraft_types?.jenis_pesawat || '-'}</td>
                          <td className="p-1.5 text-right text-[10.5px] font-mono font-bold" style={{ border: '1px solid #000000' }}>
                            {formatRupiah(tax.tarif)} <span style={{ fontSize: '9px', fontWeight: 'normal' }}>/ {tax.satuan || 'Pendaratan'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
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
                        <tr key={tarif.id || `${tarif.kode_tarif}-${tIndex}`}>
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
                )}
              </div>
            )}

            {/* Pasal 3 dan Tanda Tangan hanya dirender di halaman yang dialokasikan */}
            {page.hasSignature && (
              <div className="mt-8">
                <div className="text-[13px] leading-relaxed text-justify mb-10">
                  <h3 className="font-bold text-center m-0 p-0 mt-6">PASAL 3<br/>SKEMA PENAGIHAN RETRIBUSI</h3>
                  <p className="m-0 p-0 mt-1">
                    {isMini 
                      ? 'Penagihan retribusi daerah atas pendaratan, penumpang, dan parkir/inap dihitung secara otomatis berdasarkan realisasi fisik kedatangan yang dicatat petugas lapangan, yang kemudian diterbitkan Surat Ketetapan Retribusi Daerah (SKRD) resmi oleh Dinas Perhubungan. Pembayaran wajib disetorkan sebelum batas waktu yang tertera pada SKRD.'
                      : `Penagihan atas pemanfaatan yang diajukan oleh Pihak Kedua akan ditagihkan dengan periode ${contract.periode_pembayaran || 'Sesuai Pemakaian'}. Pembayaran harus dilakukan sebelum batas waktu yang tertera pada dokumen Tagihan.`}
                  </p>
                </div>

                {/* Tanda Tangan */}
                <div className="text-[13px]">
                  <div className="flex justify-between px-10">
                    <div className="text-center">
                      <p className="mb-20"><strong>PIHAK KEDUA</strong></p>
                      <p className="font-bold inline-block min-w-[150px]" style={{ borderBottom: '1px solid #000000' }}>{tenantData?.pic || 'Nama Perwakilan'}</p>
                      <p className="mt-1 text-[11px]">{tenantData?.nama_perusahaan || 'Direktur Perusahaan'}</p>
                    </div>
                    <div className="text-center">
                      <p>{isMini ? (airportLocation.toLowerCase().includes('nabire') ? 'Nabire' : 'Papua Tengah') : 'Timika'}, {dayjs(contract.start_date).format('DD MMMM YYYY')}</p>
                      <p className="mb-14"><strong>PIHAK PERTAMA</strong></p>
                      <p className="font-bold inline-block min-w-[150px]" style={{ borderBottom: '1px solid #000000' }}>
                        {isMini ? 'Kepala Dinas Perhubungan' : 'Kepala UPBU Mozes Kilangin'}
                      </p>
                      {isMini ? (
                        <>
                          <p className="mt-1 text-[11px]">Pemerintah Provinsi Papua Tengah</p>
                          <p className="text-[10px] text-gray-500 italic">(Pengelola {airportDisplayName})</p>
                        </>
                      ) : (
                        <p className="mt-1 text-[11px]">UPBU Mozes Kilangin Timika</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Indikator Halaman */}
            <div className="absolute bottom-[20px] w-full text-center left-0 text-[10px]" style={{ color: '#666666' }}>
              - Halaman {page.id} dari {pages.length} -
            </div>
            
          </div>
        ))}

      </div>
    </div>
  );
}
