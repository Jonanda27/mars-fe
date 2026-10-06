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
  dasar_setoran: DasarSetoranType;
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

interface SuratSSRDProps {
  data?: SsrdData;
}

export const SuratSSRD = forwardRef<HTMLDivElement, SuratSSRDProps>(({ data = defaultSsrdDummy }, ref) => {
  const d = data;

  const totalRetribusiTerhutang = d.items.reduce((acc, curr) => acc + (Number(curr.retribusi_terhutang) || 0), 0);
  const totalSanksiDenda = d.items.reduce((acc, curr) => acc + (Number(curr.sanksi_denda) || 0), 0);
  const grandTotal = d.items.reduce((acc, curr) => acc + (Number(curr.jumlah_terhutang) || 0), 0);

  const tglBayarFormatted = dayjs(d.payment_date).format('DD MMMM YYYY');

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
      className="bg-white text-black print:p-0 mx-auto"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        width: '794px', // Standar A4 (210mm)
        minHeight: '1122px', // Standar A4 (297mm)
        boxSizing: 'border-box',
        padding: '36px 40px',
        fontSize: '10pt',
        lineHeight: 1.35
      }}
    >
      {/* JUDUL LAMPIRAN RESMI DI ATAS FORMULIR */}
      <div className="font-bold text-[11pt] mb-2 tracking-tight">
        Format Surat Setoran Retribusi Daerah (SSRD)
      </div>

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
              className="p-2.5 align-middle"
              style={{ width: '65%', border: '1px solid #000000' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src="/images/logo dishub .png" 
                    alt="Logo Dishub Mimika" 
                    className="w-14 h-auto object-contain"
                  />
                </div>
                <div className="flex-1 text-center pr-3">
                  <h3 className="font-bold text-[10.5pt] uppercase tracking-wide leading-tight" style={{ margin: 0 }}>
                    PEMERINTAH KABUPATEN MIMIKA
                  </h3>
                  <h2 className="font-bold text-[12pt] uppercase tracking-wide leading-tight" style={{ margin: '1px 0' }}>
                    DINAS PERHUBUNGAN
                  </h2>
                  <div style={{ borderBottom: '2.5px double #000000', margin: '3px 0' }}></div>
                  <p className="text-[8pt] text-slate-800 leading-tight" style={{ margin: 0 }}>
                    Jln. Bandara Mozes Kilangin, Timika<br />
                    Kabupaten Mimika Tlp. (0901) 321123
                  </p>
                </div>
              </div>
            </td>

            {/* Kanan: Judul SSRD */}
            <td 
              className="p-2 text-center align-middle"
              style={{ width: '35%', border: '1px solid #000000' }}
            >
              <div className="font-bold text-[10.5pt] uppercase leading-tight">
                SURAT SETORAN
              </div>
              <div className="font-bold text-[10.5pt] uppercase leading-tight mt-0.5">
                RETRIBUSI DAERAH
              </div>
              <div className="font-bold text-[11pt] my-0.5">
                (SSRD)
              </div>
              <div className="text-[9pt] mt-1 text-slate-800">
                Tahun <span className="font-bold">{d.ssrd_year}</span>
              </div>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 2: IDENTITAS WAJIB RETRIBUSI                   */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td 
              colSpan={2} 
              className="p-2.5 align-top"
              style={{ border: '1px solid #000000' }}
            >
              <table className="w-full border-collapse text-[9.5pt]">
                <tbody>
                  <tr>
                    <td className="w-44 py-0.5">Nama Wajib Retribusi</td>
                    <td className="w-4 py-0.5">:</td>
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
              className="p-2.5 text-[9.5pt]"
              style={{ border: '1px solid #000000' }}
            >
              <div className="flex items-start">
                <div className="w-48 font-medium">
                  Menyetor berdasarkan *) :
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-x-8">
                  {/* Kolom Kiri Checkbox */}
                  <div>
                    {renderCheckbox('SKRD', d.dasar_setoran === 'SKRD')}
                    {renderCheckbox('SKRDT', d.dasar_setoran === 'SKRDT')}
                    {renderCheckbox('SK Keberatan', d.dasar_setoran === 'SK Keberatan')}
                  </div>

                  {/* Kolom Kanan Checkbox */}
                  <div>
                    {renderCheckbox('STRD', d.dasar_setoran === 'STRD')}
                    {renderCheckbox('SK Pembetulan', d.dasar_setoran === 'SK Pembetulan')}
                    {renderCheckbox('Lain - lain', d.dasar_setoran === 'Lain - lain')}
                  </div>
                </div>
              </div>

              {/* Baris Masa Retribusi, Tahun, No. Urut */}
              <div className="flex justify-end items-center gap-6 mt-3 pt-2 border-t border-dashed border-slate-300 text-[9pt]">
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
              <table className="w-full border-collapse text-[9.5pt]">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="p-1.5" style={{ width: '38%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Tahun
                    </th>
                    <th className="p-1.5" style={{ width: '22%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Retribusi<br/>Terhutang (Rp)
                    </th>
                    <th className="p-1.5" style={{ width: '18%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Sanksi/<br/>Denda (Rp)
                    </th>
                    <th className="p-1.5" style={{ width: '22%', borderBottom: '1px solid #000000' }}>
                      Jumlah<br/>Retribusi<br/>Terhutang (Rp)
                    </th>
                  </tr>
                  <tr className="italic text-center text-[8.5pt]">
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
                        <td className="text-center p-1" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {row.year}
                        </td>
                        <td className="text-right p-1 font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.retribusi_terhutang).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right p-1 font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.sanksi_denda).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right p-1 font-mono pr-3 font-semibold" style={{ borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.jumlah_terhutang).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Baris Total Retribusi Terhutang */}
                  <tr className="font-bold">
                    <td className="p-1.5 italic" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Total Retribusi Terhutang ...
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalRetribusiTerhutang > 0 ? totalRetribusiTerhutang.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalSanksiDenda > 0 ? totalSanksiDenda.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3 text-[10.5pt]" style={{ borderBottom: '1px solid #000000' }}>
                      {grandTotal > 0 ? grandTotal.toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>

                  {/* Baris Dengan Huruf */}
                  <tr>
                    <td colSpan={4} className="p-2" style={{ borderBottom: '1px solid #000000' }}>
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
              <table className="w-full border-collapse text-[9pt]" style={{ minHeight: '170px' }}>
                <tbody>
                  <tr>
                    
                    {/* Kolom 1 (Kiri): Ruang Teraan Kas Register */}
                    <td 
                      className="p-2.5 align-top text-center"
                      style={{ width: '34%', borderRight: '1px solid #000000' }}
                    >
                      <div className="font-medium leading-snug">
                        Ruang Untuk Teraan<br />
                        Kas Register / Tanda Tangan<br />
                        Petugas Penerima
                      </div>

                      {/* Area cap register teraan kas */}
                      <div className="my-3 mx-auto p-2 border border-dashed border-slate-400 bg-slate-50/60 text-[7.5pt] text-slate-500 font-mono text-left space-y-0.5">
                        <div className="font-bold text-slate-700 text-center uppercase border-b border-slate-300 pb-0.5 mb-1">
                          TERAAN KAS REGISTER BANK
                        </div>
                        <div>BANK : {d.bank_name}</div>
                        <div>TGL  : {tglBayarFormatted}</div>
                        <div>REK  : KAS DAERAH KAB. MIMIKA</div>
                        <div>REG  : {d.register_no || 'REG-MMK-2026/0892'}</div>
                        <div>NTPN : {d.ntpn_no || 'NTPN-8392102938'}</div>
                        <div className="text-center font-bold text-emerald-700 pt-0.5">[ TERVERIFIKASI LUNAS ]</div>
                      </div>
                    </td>

                    {/* Kolom 2 (Tengah): Diterima Oleh Petugas Tempat Pembayaran */}
                    <td 
                      className="p-2.5 align-top"
                      style={{ width: '33%', borderRight: '1px solid #000000' }}
                    >
                      <div className="text-center font-medium leading-snug mb-3">
                        Diterima Oleh,<br />
                        Petugas Tempat Pembayaran
                      </div>

                      <div className="space-y-2 mt-4 text-[9pt]">
                        <div className="flex">
                          <span className="w-24">Tanggal</span>
                          <span className="w-3">:</span>
                          <span className="font-semibold">{tglBayarFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="w-24">Tanda Tangan</span>
                          <span className="w-3">:</span>
                          <span className="border-b border-black w-28 inline-block">&nbsp;</span>
                        </div>
                        <div className="flex pt-4">
                          <span className="w-24">Nama Terang</span>
                          <span className="w-3">:</span>
                          <span className="font-bold underline">{d.petugas_penerima_name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 3 (Kanan): Penyetor */}
                    <td 
                      className="p-2.5 align-top text-center flex flex-col justify-between"
                      style={{ width: '33%' }}
                    >
                      <div>
                        <div className="text-[9pt]">
                          {d.city}, {tglBayarFormatted}
                        </div>
                        <div className="font-medium mt-1">
                          Penyetor
                        </div>
                      </div>

                      <div className="pt-16 pb-2">
                        <div className="border-b border-black w-44 mx-auto font-bold text-[9pt]">
                          {d.penyetor_name}
                        </div>
                        <div className="text-[8pt] text-slate-600 mt-0.5">
                          ({d.tenant_name})
                        </div>
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
