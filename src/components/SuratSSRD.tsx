import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export interface SsrdRowItem {
  year: string | number;
  retribusi_terhutang: number;
  sanksi_denda: number;
  jumlah_terhutang: number;
}

export type DasarSetoranType = 'SKRD' | 'STRD' | 'SKRDT' | 'SK Pembetulan' | 'SK Keberatan' | 'Lain - lain';

export interface SsrdData {
  ssrd_year: string;
  // Identitas Wajib Retribusi
  tenant_name: string;
  phone_fax_email: string;
  address: string;
  npwdr: string;
  // Dasar Penyetoran
  dasar_setoran: DasarSetoranType | DasarSetoranType[];
  masa_retribusi: string;
  tahun_retribusi: string;
  no_urut: string;
  // Tabel Rincian Setoran
  items: SsrdRowItem[];
  // Informasi Pembayaran / Tempat Pembayaran
  payment_date: string;
  bank_name: string;
  petugas_penerima_name: string;
  penyetor_name: string;
  city: string;
  // Metadata register
  register_no?: string;
  ntpn_no?: string;
}

export const defaultSsrdDummy: SsrdData = {
  ssrd_year: '2026',
  tenant_name: 'PT SMART CAKRAWALA AVIATION',
  phone_fax_email: '(0901) 321778 / info@smartaviation.co.id',
  address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
  npwdr: '91.823.412.5-953.000',
  dasar_setoran: 'SKRD',
  masa_retribusi: 'Agustus 2026',
  tahun_retribusi: '2026',
  no_urut: '019',
  items: [
    { year: '2026', retribusi_terhutang: 35000000, sanksi_denda: 0, jumlah_terhutang: 35000000 },
    { year: '2025', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2024', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2023', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2022', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
  ],
  payment_date: dayjs().format('YYYY-MM-DD'),
  bank_name: 'Bank Papua Cabang Timika',
  petugas_penerima_name: 'YOHANIS MATURBONGGS, S.E.',
  penyetor_name: 'CAPT. HENDRA WIJAYA',
  city: 'Timika',
  register_no: 'REG-BKP/MMK/2026/0892',
  ntpn_no: 'NTPN-982341209887'
};

const terbilang = (angka: number): string => {
  const bilne = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (angka < 12) return bilne[angka];
  if (angka < 20) return terbilang(angka - 10) + " Belas";
  if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
  if (angka < 200) return "Seratus " + terbilang(angka - 100);
  if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
  if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
  if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Miliar " + terbilang(angka % 1000000000);
  return "";
};

const toTerbilang = (angka: number): string => {
  if (angka <= 0) return 'Nol Rupiah';
  return (terbilang(angka).trim().replace(/\s+/g, ' ') + ' Rupiah').replace('  ', ' ');
};

import { Invoice } from '@/types/invoice';

export const convertInvoiceToSsrdData = (invoice: Invoice): SsrdData => {
  const contract = invoice.contracts;
  const tenant = contract?.tenants || invoice.tenants;
  const currentYear = dayjs(invoice.payment_date || invoice.created_at || new Date()).format('YYYY');
  const currentMonth = dayjs(invoice.payment_date || invoice.created_at || new Date()).format('MM');
  const formattedNoUrut = invoice.id ? String(invoice.id).padStart(3, '0') : '001';

  // Dasar Setoran: jika sudah terbit STRD/denda -> hanya STRD yang dicentang (SKRD tidak dicentang), else SKRD
  const isSTRD = Boolean(
    invoice.warnings?.some(w => (w.type || '').toUpperCase().includes('STRD')) ||
    Number(invoice.penalty_amount || 0) > 0 ||
    invoice.invoice_type === 'SKRD Denda'
  );
  const dasarSetoran: DasarSetoranType = isSTRD ? 'STRD' : 'SKRD';

  // Ambil data pembayaran terbaru yang terverifikasi atau pembayaran pertama
  const latestPayment = invoice.invoice_payments?.find(p => p.status === 'Verified') 
    || invoice.invoice_payments?.[0];

  const paidAmount = Number(invoice.paid_amount || latestPayment?.amount || 0);
  const penaltyAmount = Number(invoice.penalty_amount || 0);
  const principalPaid = Math.max(0, paidAmount - penaltyAmount);

  // Items untuk tabel rincian tahun
  const items: SsrdRowItem[] = [
    {
      year: currentYear,
      retribusi_terhutang: principalPaid,
      sanksi_denda: penaltyAmount,
      jumlah_terhutang: paidAmount
    },
    { year: String(Number(currentYear) - 1), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: String(Number(currentYear) - 2), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: String(Number(currentYear) - 3), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: String(Number(currentYear) - 4), retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
  ];

  // Penomoran SSRD: SSRD/MMK/{TAHUN}/{BULAN}/{ID}
  const registerNo = `SSRD/MMK/${currentYear}/${currentMonth}/${formattedNoUrut}`;
  const ntpnNo = latestPayment?.ocr_data?.reference_number 
    ? `NTPN-${latestPayment.ocr_data.reference_number}` 
    : `NTPN-${dayjs().format('YYYYMMDD')}${formattedNoUrut}`;

  return {
    ssrd_year: currentYear,
    tenant_name: tenant?.nama_perusahaan || '-',
    phone_fax_email: tenant?.kontak || tenant?.email || '-',
    address: tenant?.alamat || 'Bandara Mozes Kilangin, Timika',
    npwdr: tenant?.npwp || '94.04.1.2024.0001',
    dasar_setoran: dasarSetoran,
    masa_retribusi: dayjs(invoice.created_at || new Date()).format('MMMM YYYY'),
    tahun_retribusi: currentYear,
    no_urut: formattedNoUrut,
    items,
    payment_date: dayjs(invoice.payment_date || new Date()).format('YYYY-MM-DD'),
    bank_name: latestPayment?.payment_method || invoice.payment_method || 'Bank Papua Kasda Mimika',
    petugas_penerima_name: 'BENDAHARA KHUSUS PENERIMA (BKP)',
    penyetor_name: tenant?.penanggung_jawab || tenant?.nama_perusahaan || 'Penyetor Wajib Retribusi',
    city: 'Timika',
    register_no: registerNo,
    ntpn_no: ntpnNo
  };
};

interface SuratSSRDProps {
  readonly data?: SsrdData;
  readonly invoice?: Invoice;
}

export const SuratSSRD = forwardRef<HTMLDivElement, SuratSSRDProps>(({ data, invoice }, ref) => {
  const d = data || (invoice ? convertInvoiceToSsrdData(invoice) : defaultSsrdDummy);

  const totalRetribusiTerhutang = d.items.reduce((acc, curr) => acc + (Number(curr.retribusi_terhutang) || 0), 0);
  const totalSanksiDenda = d.items.reduce((acc, curr) => acc + (Number(curr.sanksi_denda) || 0), 0);
  const grandTotal = d.items.reduce((acc, curr) => acc + (Number(curr.jumlah_terhutang) || 0), 0);

  const tglBayarFormatted = dayjs(d.payment_date).format('DD MMMM YYYY');

  const isDasarChecked = (type: DasarSetoranType) => {
    if (Array.isArray(d.dasar_setoran)) {
      return d.dasar_setoran.includes(type);
    }
    return d.dasar_setoran === type;
  };

  const renderCheckbox = (label: string, isChecked: boolean) => (
    <div className="flex items-center gap-1.5 py-0.5">
      <div 
        className="w-4 h-4 border border-black flex items-center justify-center text-[10pt] font-bold leading-none select-none bg-white"
        style={{ borderWidth: '1.2px' }}
      >
        {isChecked ? '✓' : ''}
      </div>
      <span className="text-[9.5pt]">{label}</span>
    </div>
  );

  return (
    <div
      ref={ref}
      id="ssrd-document-root"
      className="bg-white text-black print:p-0 mx-auto select-text"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        width: '210mm',
        height: '296mm',
        maxHeight: '296mm',
        boxSizing: 'border-box',
        padding: '7mm 12mm',
        fontSize: '9pt',
        lineHeight: 1.25,
        overflow: 'hidden',
        pageBreakAfter: 'avoid',
        pageBreakBefore: 'avoid',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}
    >
      {/* GLOBAL PRINT STYLE SO IT NEVER EXCEEDS 1 PAGE A4 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 0 !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #ssrd-document-root {
            width: 210mm !important;
            height: 296mm !important;
            max-height: 296mm !important;
            padding: 7mm 12mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* ======================================================== */}
      {/* KOTAK TABEL FORMULIR UTAMA SSRD (PERSIS LAMPIRAN III)     */}
      {/* ======================================================== */}
      <table 
        className="w-full border-collapse"
        style={{ 
          border: '1.5px solid #000000', 
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <tbody>
          
          {/* ---------------------------------------------------- */}
          {/* BARIS 1: KOP DINAS (KIRI) & JUDUL SSRD (KANAN)       */}
          {/* ---------------------------------------------------- */}
          <tr>
            {/* Kiri: Kop Dinas */}
            <td 
              className="p-2 align-middle"
              style={{ width: '65%', border: '1px solid #000000' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-14 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src="/images/logo dishub .png" 
                    alt="Logo Dishub Mimika" 
                    className="w-12 h-auto object-contain"
                  />
                </div>
                <div className="flex-1 text-center pr-2">
                  <h3 className="font-bold text-[10pt] uppercase tracking-wide leading-tight" style={{ margin: 0 }}>
                    PEMERINTAH KABUPATEN MIMIKA
                  </h3>
                  <h2 className="font-bold text-[11pt] uppercase tracking-wide leading-tight" style={{ margin: '1px 0' }}>
                    DINAS PERHUBUNGAN
                  </h2>
                  <div style={{ borderBottom: '2px double #000000', margin: '2px 0' }}></div>
                  <p className="text-[7.5pt] text-slate-800 leading-tight" style={{ margin: 0 }}>
                    Jln. Bandara Mozes Kilangin, Timika<br />
                    Kabupaten Mimika Tlp. (0901) 321123
                  </p>
                </div>
              </div>
            </td>

            {/* Kanan: Judul SSRD */}
            <td 
              className="p-1.5 text-center align-middle"
              style={{ width: '35%', border: '1px solid #000000' }}
            >
              <div className="font-bold text-[10pt] uppercase leading-tight">
                SURAT SETORAN
              </div>
              <div className="font-bold text-[10pt] uppercase leading-tight mt-0.5">
                RETRIBUSI DAERAH
              </div>
              <div className="font-bold text-[10.5pt] my-0.5">
                (SSRD)
              </div>
              <div className="text-[8.5pt] mt-0.5 text-slate-800">
                Tahun <span className="font-bold">{d.ssrd_year}</span>
              </div>
              {d.register_no && (
                <div className="text-[7pt] font-mono font-bold text-slate-800 mt-0.5 bg-slate-100 py-0.5 px-1 border border-slate-300">
                  {d.register_no}
                </div>
              )}
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 2: IDENTITAS WAJIB RETRIBUSI                   */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td 
              colSpan={2} 
              className="p-2 align-top"
              style={{ border: '1px solid #000000' }}
            >
              <table className="w-full border-collapse text-[9pt]">
                <tbody>
                  <tr>
                    <td className="w-40 py-0.5">Nama Wajib Retribusi</td>
                    <td className="w-3 py-0.5">:</td>
                    <td className="py-0.5 font-bold">{d.tenant_name}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Telp./ Fax/ Email</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{d.phone_fax_email}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 align-top">A l a m a t</td>
                    <td className="py-0.5 align-top">:</td>
                    <td className="py-0.5 leading-snug">{d.address}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">NPWRD</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 font-mono font-medium">{d.npwdr}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 3: MENYETOR BERDASARKAN *) & PILIHAN CHECKBOX  */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td 
              colSpan={2} 
              className="p-2 text-[9pt]"
              style={{ border: '1px solid #000000' }}
            >
              <div className="flex items-start">
                <div className="w-44 font-medium">
                  Menyetor berdasarkan *) :
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-x-6">
                  {/* Kolom Kiri Checkbox */}
                  <div>
                    {renderCheckbox('SKRD', isDasarChecked('SKRD'))}
                    {renderCheckbox('SKRDT', isDasarChecked('SKRDT'))}
                    {renderCheckbox('SK Keberatan', isDasarChecked('SK Keberatan'))}
                  </div>

                  {/* Kolom Kanan Checkbox */}
                  <div>
                    {renderCheckbox('STRD', isDasarChecked('STRD'))}
                    {renderCheckbox('SK Pembetulan', isDasarChecked('SK Pembetulan'))}
                    {renderCheckbox('Lain - lain', isDasarChecked('Lain - lain'))}
                  </div>
                </div>
              </div>

              {/* Baris Masa Retribusi, Tahun, No. Urut */}
              <div className="flex justify-end items-center gap-5 mt-2 pt-1 border-t border-dashed border-slate-300 text-[8.5pt]">
                <div>
                  Masa Retribusi : <span className="font-bold underline">{d.masa_retribusi}</span>
                </div>
                <div>
                  Tahun : <span className="font-bold underline">{d.tahun_retribusi}</span>
                </div>
                <div>
                  No. Urut : <span className="font-mono font-bold underline">{d.no_urut}</span>
                </div>
              </div>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 4: TABEL RINCIAN SETORAN RETRIBUSI TERHUTANG   */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td colSpan={2} className="p-0" style={{ border: '1px solid #000000' }}>
              <table className="w-full border-collapse text-[9pt]">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="p-1" style={{ width: '38%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Tahun
                    </th>
                    <th className="p-1" style={{ width: '22%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Retribusi<br/>Terhutang (Rp)
                    </th>
                    <th className="p-1" style={{ width: '18%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Sanksi/<br/>Denda (Rp)
                    </th>
                    <th className="p-1" style={{ width: '22%', borderBottom: '1px solid #000000' }}>
                      Jumlah<br/>Retribusi<br/>Terhutang (Rp)
                    </th>
                  </tr>
                  <tr className="italic text-center text-[8pt]">
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>1</th>
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>2</th>
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>3</th>
                    <th className="py-0.5" style={{ borderBottom: '1px solid #000000' }}>2 + 3 = 4</th>
                  </tr>
                </thead>
                <tbody>
                  {d.items.map((row, idx) => {
                    const isZero = Number(row.jumlah_terhutang) === 0;
                    return (
                      <tr key={idx}>
                        <td className="text-center py-0.5 px-1" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {row.year}
                        </td>
                        <td className="text-right py-0.5 px-1 font-mono pr-2.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.retribusi_terhutang).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right py-0.5 px-1 font-mono pr-2.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.sanksi_denda).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right py-0.5 px-1 font-mono pr-2.5 font-semibold" style={{ borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.jumlah_terhutang).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Baris Total Retribusi Terhutang */}
                  <tr className="font-bold">
                    <td className="p-1 italic" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Total Retribusi Terhutang ...
                    </td>
                    <td className="p-1 text-right font-mono pr-2.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalRetribusiTerhutang > 0 ? totalRetribusiTerhutang.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1 text-right font-mono pr-2.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalSanksiDenda > 0 ? totalSanksiDenda.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1 text-right font-mono pr-2.5 text-[9.5pt]" style={{ borderBottom: '1px solid #000000' }}>
                      {grandTotal > 0 ? grandTotal.toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>

                  {/* Baris Dengan Huruf */}
                  <tr>
                    <td colSpan={4} className="p-1.5" style={{ borderBottom: '1px solid #000000' }}>
                      <span className="font-medium">Dengan Huruf :</span> ( <span className="italic font-bold">{toTerbilang(grandTotal)}</span> )
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 5: TIGA KOLOM TANDA TANGAN (PERSIS GAMBAR)     */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td colSpan={2} className="p-0">
              <table className="w-full border-collapse text-[8.5pt]">
                <tbody>
                  <tr>
                    
                    {/* Kolom 1 (Kiri): Ruang Teraan Kas Register */}
                    <td 
                      className="p-2 align-top text-center"
                      style={{ width: '34%', borderRight: '1px solid #000000' }}
                    >
                      <div className="font-medium leading-tight text-[8.5pt]">
                        Ruang Untuk Teraan<br />
                        Kas Register / Tanda Tangan<br />
                        Petugas Penerima
                      </div>

                      {/* Area cap register teraan kas */}
                      <div className="mt-1.5 mx-auto p-1.5 border border-dashed border-slate-400 bg-slate-50/70 text-[7pt] text-slate-700 font-mono text-left space-y-0.5 max-w-[210px] w-full">
                        <div className="font-bold text-slate-800 text-center uppercase border-b border-slate-300 pb-0.5 mb-0.5 text-[7.5pt]">
                          TERAAN KAS REGISTER BANK
                        </div>
                        <div className="flex"><span className="w-11 text-slate-500 shrink-0">BANK</span><span className="truncate">: {d.bank_name}</span></div>
                        <div className="flex"><span className="w-11 text-slate-500 shrink-0">TGL</span><span>: {tglBayarFormatted}</span></div>
                        <div className="flex"><span className="w-11 text-slate-500 shrink-0">REK</span><span>: KAS DAERAH KAB. MIMIKA</span></div>
                        <div className="flex"><span className="w-11 text-slate-500 shrink-0">REG</span><span className="font-semibold truncate">: {d.register_no || '-'}</span></div>
                        <div className="flex"><span className="w-11 text-slate-500 shrink-0">NTPN</span><span className="font-semibold truncate">: {d.ntpn_no || '-'}</span></div>
                        <div className="text-center font-bold text-emerald-700 pt-0.5 tracking-wider text-[6.5pt]">
                          [ TERVERIFIKASI LUNAS ]
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2 (Tengah): Diterima Oleh Petugas Tempat Pembayaran */}
                    <td 
                      className="p-2 align-top"
                      style={{ width: '33%', borderRight: '1px solid #000000' }}
                    >
                      <div className="text-center font-medium leading-tight text-[8.5pt]">
                        Diterima Oleh,<br />
                        Petugas Tempat Pembayaran
                      </div>

                      <table className="w-full border-collapse text-[8.5pt] mt-1.5">
                        <tbody>
                          <tr>
                            <td className="w-18 py-0.5 align-top whitespace-nowrap text-slate-700">Tanggal</td>
                            <td className="w-3 py-0.5 align-top text-center">:</td>
                            <td className="py-0.5 align-top font-semibold">{tglBayarFormatted}</td>
                          </tr>
                          <tr>
                            <td className="py-0.5 align-top whitespace-nowrap text-slate-700">Tanda Tangan</td>
                            <td className="py-0.5 align-top text-center">:</td>
                            <td className="py-0.5 align-top">
                              <div className="border-b border-black w-24 h-5">&nbsp;</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-2 pb-0.5 align-top whitespace-nowrap text-slate-700">Nama Terang</td>
                            <td className="pt-2 pb-0.5 align-top text-center">:</td>
                            <td className="pt-2 pb-0.5 align-top font-bold underline leading-snug">
                              {d.petugas_penerima_name}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>

                    {/* Kolom 3 (Kanan): Penyetor */}
                    <td 
                      className="p-2 align-top text-center"
                      style={{ width: '33%' }}
                    >
                      <div className="text-[8.5pt] whitespace-nowrap">
                        {d.city}, {tglBayarFormatted}
                      </div>
                      <div className="font-medium mt-0.5 text-[8.5pt]">
                        Penyetor
                      </div>

                      <div className="mt-10 pb-0.5">
                        <div className="border-b border-black w-40 mx-auto font-bold text-[8.5pt] pb-0.5 leading-snug">
                          {d.penyetor_name}
                        </div>
                        {d.penyetor_name !== d.tenant_name && (
                          <div className="text-[7.5pt] text-slate-600 mt-0.5">
                            ({d.tenant_name})
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  );
});

SuratSSRD.displayName = 'SuratSSRD';
