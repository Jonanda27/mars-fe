import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export interface SuratPemberitahuanData {
  nomor_surat: string;
  sifat: string;
  lampiran: string;
  perihal: string;
  
  // Lokasi & Tanggal
  kota_terbit: string;
  tanggal_surat: string;
  
  // Wajib Retribusi
  tenant_name: string;
  pic_name?: string;
  phone_email: string;
  address: string;
  npwdr: string;
  
  // Data Rujukan SKRD
  skrd_number: string;
  skrd_date: string;
  due_date: string;
  days_remaining: number;
  retribution_type: string;
  uraian_retribusi: string;
  amount: number;
  
  // Bank Kas Daerah
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  
  // Pejabat Pengesahan
  pejabat_jabatan: string;
  pejabat_nama: string;
  pejabat_pangkat?: string;
  pejabat_nip: string;
}

export const defaultPemberitahuanDummy: SuratPemberitahuanData = {
  nomor_surat: '550/PB-H7/082/DISHUB/X/2026',
  sifat: 'Penting / Segera',
  lampiran: '1 (satu) Berkas Salinan SKRD',
  perihal: 'Pemberitahuan Jatuh Tempo Pembayaran Retribusi Daerah (H-7)',
  
  kota_terbit: 'Timika',
  tanggal_surat: dayjs().format('YYYY-MM-DD'),
  
  tenant_name: 'PT SMART CAKRAWALA AVIATION',
  pic_name: 'Pimpinan / Direktur Operasional',
  phone_email: '(0901) 321778 / info@smartaviation.co.id',
  address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
  npwdr: '91.823.412.5-953.000',
  
  skrd_number: 'SKRD/2026/09/019',
  skrd_date: dayjs().subtract(23, 'day').format('YYYY-MM-DD'),
  due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  days_remaining: 7,
  retribution_type: 'Pemanfaatan Barang Milik Daerah',
  uraian_retribusi: 'Sewa Fasilitas Hanggar dan Apron Sisi Timur Bandara Mozes Kilangin Periode Oktober 2026',
  amount: 35000000,
  
  bank_name: 'Bank Papua Cabang Timika',
  bank_account_number: '100-01-02-00045-8',
  bank_account_holder: 'Kas Umum Daerah Kab. Mimika (Penerimaan Retribusi Perhubungan)',
  
  pejabat_jabatan: 'Kepala Dinas Perhubungan Kabupaten Mimika',
  pejabat_nama: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
  pejabat_pangkat: 'Pembina Utama Muda (IV/c)',
  pejabat_nip: '19740510 200212 1 008'
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

interface SuratPemberitahuanProps {
  data?: SuratPemberitahuanData;
}

export const SuratPemberitahuan = forwardRef<HTMLDivElement, SuratPemberitahuanProps>(
  ({ data = defaultPemberitahuanDummy }, ref) => {
    const d = data;
    const tglSuratFormatted = dayjs(d.tanggal_surat).format('DD MMMM YYYY');
    const tglSkrdFormatted = dayjs(d.skrd_date).format('DD MMMM YYYY');
    const tglJatuhTempoFormatted = dayjs(d.due_date).format('DD MMMM YYYY');
    
    // QR Code data untuk verifikasi dokumen resmi naskah dinas
    const qrData = encodeURIComponent(`MARS-PEMBERITAHUAN:${d.nomor_surat}|${d.skrd_number}|${d.tenant_name}|${d.amount}`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${qrData}`;

    return (
      <div
        ref={ref}
        id="surat-pemberitahuan-root"
        className="bg-white text-black print:p-0 mx-auto"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          color: '#000000',
          backgroundColor: '#ffffff',
          width: '794px', // Standar A4 (210mm pada 96 DPI)
          height: '1120px', // Pas tepat 1 halaman A4 (297mm)
          maxHeight: '1120px',
          boxSizing: 'border-box',
          padding: '18px 36px 14px 36px',
          fontSize: '9.5pt',
          lineHeight: 1.3,
          overflow: 'hidden'
        }}
      >
        {/* ======================================================== */}
        {/* KOP SURAT RESMI DINAS PERHUBUNGAN KABUPATEN MIMIKA       */}
        {/* ======================================================== */}
        <div className="flex items-center pb-1.5 mb-0.5 relative border-b-[2.5px] border-black">
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <img 
              src="/images/logo dishub .png" 
              alt="Logo Dishub Mimika" 
              className="w-12 h-auto object-contain"
            />
          </div>
          <div className="flex-1 text-center pr-2">
            <h3 className="font-bold text-[11pt] uppercase tracking-wide leading-tight m-0">
              PEMERINTAH KABUPATEN MIMIKA
            </h3>
            <h2 className="font-bold text-[13pt] uppercase tracking-wide leading-tight my-0.5">
              DINAS PERHUBUNGAN
            </h2>
            <h4 className="font-bold text-[8.5pt] uppercase tracking-wide leading-tight m-0 text-black">
              UNIT PENYELENGGARA BANDAR UDARA (UPBU) KELAS I MOZES KILANGIN
            </h4>
            <p className="text-[7pt] text-black leading-tight mt-0.5 m-0 font-sans">
              Jalan Bandara Mozes Kilangin, Timika, Kabupaten Mimika, Papua Tengah &ndash; 99910<br />
              Telepon: (0901) 321123 &bull; Pos-el: perhubungan@mimikakab.go.id &bull; bandara.mozeskilangin@mimikakab.go.id
            </p>
          </div>
        </div>
        {/* Garis tipis kedua kop dinas */}
        <div className="border-b border-black -mt-0.5 mb-2"></div>

        {/* ======================================================== */}
        {/* KEPALA NASKAH SURAT DINAS (NOMOR, LAMPIRAN, TEMPAT/TGL)  */}
        {/* ======================================================== */}
        <div className="flex justify-between items-start mb-2">
          {/* Kolom Kiri: Nomor, Sifat, Lampiran, Perihal */}
          <div className="w-[60%]">
            <table className="border-collapse text-[9.5pt] w-full">
              <tbody>
                <tr>
                  <td className="w-20 align-top py-0.5">Nomor</td>
                  <td className="w-3 align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-bold font-mono text-[9pt]">{d.nomor_surat}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">Sifat</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-semibold">{d.sifat}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">Lampiran</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">{d.lampiran}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5 font-bold">Perihal</td>
                  <td className="align-top py-0.5 font-bold">:</td>
                  <td className="align-top py-0.5 font-bold leading-tight underline">
                    {d.perihal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kolom Kanan: Tempat, Tanggal & Tujuan Surat */}
          <div className="w-[38%] text-left pl-2">
            <p className="m-0 mb-1 text-[9.5pt]">
              {d.kota_terbit}, {tglSuratFormatted}
            </p>
            <p className="m-0 font-bold text-[9.5pt]">Kepada Yth.</p>
            <p className="m-0 font-bold uppercase text-[9.5pt]">{d.tenant_name}</p>
            {d.pic_name && <p className="m-0 text-[9pt] italic">U.p. {d.pic_name}</p>}
            <p className="m-0 text-[9pt] leading-snug">{d.address}</p>
            <p className="m-0 font-bold mt-0.5 text-[9pt]">di -</p>
            <p className="m-0 font-bold underline pl-4 text-[9pt]">TEMPAT</p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ISI SURAT PEMBERITAHUAN RESMI SESUAI PERBUP 25/2024      */}
        {/* ======================================================== */}
        <div className="space-y-1.5 text-justify text-[9.5pt] leading-snug">
          
          {/* Paragraf Pembuka */}
          <p className="m-0 indent-8">
            Dasar pelaksanaan penerbitan Surat Pemberitahuan ini adalah:
          </p>

          <ol className="list-decimal pl-9 space-y-0 m-0 text-[9pt]">
            <li>
              Undang-Undang Nomor 1 Tahun 2022 tentang Hubungan Keuangan Antara Pemerintah Pusat dan Pemerintahan Daerah;
            </li>
            <li>
              Peraturan Daerah Kabupaten Mimika Nomor 4 Tahun 2023 tentang Pajak Daerah dan Retribusi Daerah;
            </li>
            <li>
              <strong>Peraturan Bupati Mimika Nomor 25 Tahun 2024 tentang Tata Cara Pemungutan Retribusi Daerah</strong>, khususnya <strong>Pasal 21 ayat (2), ayat (3), dan ayat (5)</strong>.
            </li>
          </ol>

          {/* Pernyataan Inti H-7 */}
          <p className="m-0 indent-8">
            Sehubungan dengan kewajiban retribusi daerah yang telah ditetapkan, bersama ini kami beritahukan bahwa <strong>Surat Ketetapan Retribusi Daerah (SKRD)</strong> atas pemanfaatan aset/layanan penerbangan Saudara akan jatuh tempo dalam jangka waktu <strong>{d.days_remaining} (tujuh) hari kalender</strong> mendatang, dengan rincian ketetapan sebagai berikut:
          </p>

          {/* ======================================================== */}
          {/* TABEL RINCIAN SKRD YANG AKAN JATUH TEMPO                 */}
          {/* ======================================================== */}
          <div className="my-1">
            <table 
              className="w-full border-collapse text-[9pt]"
              style={{ border: '1px solid #000000' }}
            >
              <tbody>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #000000' }}>
                  <td className="w-44 py-0.5 px-1.5 font-bold border-r border-black">Nomor SKRD</td>
                  <td className="py-0.5 px-1.5 font-mono font-bold">{d.skrd_number}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td className="py-0.5 px-1.5 font-medium border-r border-black">Tanggal Penerbitan SKRD</td>
                  <td className="py-0.5 px-1.5">{tglSkrdFormatted}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td className="py-0.5 px-1.5 font-medium border-r border-black">Nama Wajib Retribusi</td>
                  <td className="py-0.5 px-1.5 font-bold">{d.tenant_name}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td className="py-0.5 px-1.5 font-medium border-r border-black">NPWDR</td>
                  <td className="py-0.5 px-1.5 font-mono">{d.npwdr}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td className="py-0.5 px-1.5 font-medium border-r border-black">Objek / Jenis Retribusi</td>
                  <td className="py-0.5 px-1.5">
                    <strong>{d.retribution_type}</strong> &ndash; {d.uraian_retribusi}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td className="py-0.5 px-1.5 font-bold border-r border-black">Jumlah Pokok Retribusi</td>
                  <td className="py-0.5 px-1.5">
                    <span className="font-bold font-mono">
                      Rp {d.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[8pt] italic text-neutral-700">
                      ({toTerbilang(d.amount)})
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td className="py-0.5 px-1.5 font-bold border-r border-black">
                    TANGGAL JATUH TEMPO (SKRD)
                  </td>
                  <td className="py-0.5 px-1.5 font-bold">
                    {tglJatuhTempoFormatted} <span className="font-normal text-[8.5pt] italic">({d.days_remaining} hari kalender terhitung sejak surat ini)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instruksi Pembayaran */}
          <p className="m-0 indent-8">
            Pembayaran retribusi daerah dilakukan dengan menyetorkan sejumlah nominal tersebut secara penuh ke Rekening Kas Umum Daerah Pemerintah Kabupaten Mimika menggunakan formulir <strong>Surat Setoran Retribusi Daerah (SSRD)</strong> atau transfer perbankan pada rekening resmi berikut:
          </p>

          <table className="w-full border border-black text-[8.5pt] my-0.5">
            <tbody>
              <tr>
                <td className="py-0.5 px-1.5 font-bold w-28 border-r border-black">Bank Penyetoran</td>
                <td className="py-0.5 px-1.5">{d.bank_name}</td>
                <td className="py-0.5 px-1.5 font-bold w-32 border-r border-l border-black">No. Rekening Kasda</td>
                <td className="py-0.5 px-1.5 font-mono font-bold">{d.bank_account_number}</td>
              </tr>
              <tr className="border-t border-black">
                <td className="py-0.5 px-1.5 font-bold border-r border-black">Atas Nama Rekening</td>
                <td className="py-0.5 px-1.5" colSpan={3}>{d.bank_account_holder}</td>
              </tr>
            </tbody>
          </table>

          {/* Konsekuensi Hukum Berdasarkan Pasal 21 Perbup 25/2024 */}
          <div className="p-1 border border-black bg-white text-[8pt] leading-snug">
            <strong className="block text-black uppercase tracking-wide mb-0.5 font-bold">
              PERINGATAN KETENTUAN HUKUM (PASAL 21 PERBUP NO. 25 TAHUN 2024):
            </strong>
            <ul className="list-disc pl-4 space-y-0 text-black m-0">
              <li>
                Sesuai <strong>Pasal 21 ayat (4)</strong>, apabila dalam waktu 7 (tujuh) hari setelah tanggal jatuh tempo Wajib Retribusi belum melunasi pembayaran, Dinas Perhubungan akan menerbitkan <strong>Surat Teguran</strong> resmi.
              </li>
              <li>
                Sesuai <strong>Pasal 21 ayat (7) dan ayat (8)</strong>, apabila Surat Teguran tidak dipenuhi, akan diterbitkan <strong>Surat Tagihan Retribusi Daerah (STRD)</strong> disertai sanksi bunga administrasi sebesar <strong>1% (satu persen) per bulan</strong>.
              </li>
              <li>
                Apabila Saudara telah menyelesaikan pembayaran retribusi tersebut sebelum menerima surat ini, mohon untuk mengabaikan pemberitahuan ini dan menyampaikan bukti validasi SSRD ke loket Dinas Perhubungan / UPBU Mozes Kilangin.
              </li>
            </ul>
          </div>

          {/* Paragraf Penutup */}
          <p className="m-0 indent-8">
            Demikian Surat Pemberitahuan ini kami sampaikan untuk menjadi perhatian dan segera diselesaikan sebelum batas jatuh tempo. Atas kerja sama dan kepatuhan Saudara, kami ucapkan terima kasih.
          </p>
        </div>

        {/* ======================================================== */}
        {/* TANDA TANGAN PEJABAT & QR CODE DOKUMEN                   */}
        {/* ======================================================== */}
        <div className="mt-1.5 flex justify-between items-end">
          {/* Kiri: QR Code Otentikasi & Nomor Seri Dokumen */}
          <div className="w-[45%] flex items-center gap-2">
            <div className="p-0.5 border border-black bg-white">
              <img 
                src={qrCodeUrl} 
                alt="QR Validasi Naskah Dinas" 
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="text-[7pt] text-black leading-tight font-sans">
              <span className="font-bold block uppercase">VERIFIKASI DOKUMEN:</span>
              <span className="block font-mono text-[6.5pt]">SISTEM MARS KAB. MIMIKA</span>
              <span className="block">Dokumen Sah Naskah Dinas Elektronik</span>
              <span className="block italic mt-0.5">Ref: PERBUP MMK 25/2024 PS.21</span>
            </div>
          </div>

          {/* Kanan: Tanda Tangan Kepala Dinas */}
          <div className="w-[50%] text-center">
            <p className="m-0 text-[9pt] font-bold leading-tight">
              KEPALA DINAS PERHUBUNGAN<br />KABUPATEN MIMIKA
            </p>
            {/* Ruang TTD */}
            <div className="h-8 flex items-center justify-center">
              <span className="text-[7.5pt] italic text-neutral-400 font-sans">[ Tanda Tangan &amp; Cap Dinas ]</span>
            </div>
            <p className="m-0 font-bold underline text-[9.5pt] uppercase">
              {d.pejabat_nama}
            </p>
            {d.pejabat_pangkat && (
              <p className="m-0 text-[8pt] text-black">{d.pejabat_pangkat}</p>
            )}
            <p className="m-0 font-mono text-[8.5pt]">
              NIP. {d.pejabat_nip}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TEMBUSAN / DISTRIBUSI SALINAN (PASAL 21 AYAT 5)          */}
        {/* ======================================================== */}
        <div className="mt-1.5 pt-1 border-t border-black text-[7.5pt] leading-tight">
          <span className="font-bold uppercase tracking-wider">
            Distribusi Salinan Naskah Dinas (Pasal 21 ayat 5 Perbup Mimika 25/2024):
          </span>
          <span className="ml-1 text-black">
            1. Wajib Retribusi ({d.tenant_name}) &bull; 2. PD Pengelola Retribusi (Dishub Kab. Mimika) &bull; 3. Badan Pendapatan Daerah (Bapenda)
          </span>
        </div>

      </div>
    );
  }
);

SuratPemberitahuan.displayName = 'SuratPemberitahuan';
