"use client";

import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface SuratPermohonanMiniAirportTemplateProps {
  tenantName: string;
  tenantAddress?: string;
  purpose?: string;
  airportName?: string;
  airportCode?: string;
}

export const SuratPermohonanMiniAirportTemplate = forwardRef<HTMLDivElement, SuratPermohonanMiniAirportTemplateProps>(
  ({ tenantName, tenantAddress, purpose, airportName, airportCode }, ref) => {
    const formattedAirport = airportName ? `${airportName}${airportCode ? ` (${airportCode})` : ''}` : 'Lapangan Terbang Perintis (Mini Airport)';
    return (
      <div 
        ref={ref} 
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '22mm 20mm',
          backgroundColor: '#ffffff',
          fontFamily: '"Times New Roman", Times, serif',
          color: '#111111',
          fontSize: '12pt',
          lineHeight: '1.6',
          boxSizing: 'border-box'
        }}
      >
        {/* Kop Surat Perusahaan (Mitra Maskapai / Operator) */}
        <div style={{ borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '22px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {tenantName || 'NAMA PERUSAHAAN OPERATOR PENERBANGAN'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '10.5pt', color: '#333333' }}>
            {tenantAddress || 'Alamat Kantor / Operasional Perusahaan Penerbangan'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '9.5pt', color: '#555555' }}>
            Surat Izin Usaha Angkutan Udara (SIUAU) / Air Operator Certificate (AOC)
          </p>
        </div>

        {/* Nomor Surat & Tanggal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <table style={{ width: '100%', fontSize: '11.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '85px', verticalAlign: 'top', fontWeight: 'normal' }}>Nomor</td>
                  <td style={{ width: '10px', verticalAlign: 'top' }}>:</td>
                  <td>...../EXT-OPS/...../20.....</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top', fontWeight: 'normal' }}>Lampiran</td>
                  <td style={{ verticalAlign: 'top' }}>:</td>
                  <td>1 (Satu) Berkas Manifes &amp; Data Armada</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top', fontWeight: 'normal' }}>Perihal</td>
                  <td style={{ verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>
                    Permohonan Izin Operasional Penerbangan Perintis di {formattedAirport}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11.5pt', minWidth: '150px' }}>
            <p style={{ margin: 0 }}>Nabire, {dayjs().format('DD MMMM YYYY')}</p>
          </div>
        </div>

        {/* Tujuan Surat */}
        <div style={{ marginBottom: '24px', fontSize: '11.5pt' }}>
          <p style={{ margin: 0 }}>Kepada Yth,</p>
          <p style={{ margin: '2px 0 0', fontWeight: 'bold' }}>Kepala Dinas Perhubungan Provinsi Papua Tengah</p>
          <p style={{ margin: '2px 0 0' }}>Cq. Pengelola Layanan Lapangan Terbang Perintis ({formattedAirport})</p>
          <p style={{ margin: '2px 0 0' }}>di -</p>
          <p style={{ margin: '0 0 0 20px' }}>Tempat</p>
        </div>

        {/* Isi Surat */}
        <div style={{ textAlign: 'justify', marginBottom: '28px', fontSize: '11.5pt' }}>
          <p style={{ textIndent: '30px', marginBottom: '12px' }}>
            Dengan hormat,
          </p>
          <p style={{ textIndent: '30px', marginBottom: '12px' }}>
            Yang bertanda tangan di bawah ini, mewakili manajemen maskapai / operator <strong>{tenantName || '...........................................'}</strong>, dengan ini secara resmi mengajukan permohonan izin operasional penerbangan dan pendaratan pada <strong>{formattedAirport}</strong> di bawah naungan pengelolaan Dinas Perhubungan Provinsi Papua Tengah.
          </p>
          <p style={{ textIndent: '30px', marginBottom: '12px' }}>
            Adapun permohonan ini diajukan untuk mendukung kegiatan: <strong>{purpose || 'Penerbangan Perintis, Distribusi Logistik dan Pelayanan Masyarakat Pedalaman Papua Tengah'}</strong>.
          </p>
          <p style={{ textIndent: '30px', marginBottom: '12px' }}>
            Sehubungan dengan permohonan tersebut, pihak operator berkomitmen untuk:
          </p>
          <ol style={{ margin: '0 0 14px 20px', paddingLeft: '15px' }}>
            <li style={{ marginBottom: '6px' }}>
              Mematuhi seluruh standar keselamatan penerbangan perintis (Aviation Safety &amp; Security Standards) serta panduan kondisi cuaca visual (VFR/VMC) lapangan terbang setempat.
            </li>
            <li style={{ marginBottom: '6px' }}>
              Mengikatkan diri dalam Perjanjian Kerja Sama Induk (PKS Payung) dan mematuhi seluruh ketentuan pembayaran retribusi daerah sesuai Surat Ketetapan Retribusi Daerah (SKRD).
            </li>
            <li style={{ marginBottom: '6px' }}>
              Berkoordinasi secara aktif dengan petugas Dishub pengelola lapangan terbang perintis terkait jadwal tiba, kesiapan runway, dan alokasi stand apron pendaratan.
            </li>
            <li style={{ marginBottom: '6px' }}>
              Memastikan seluruh manifes penumpang dan muatan kargo mematuhi batasan Maximum Take-Off Weight (MTOW) dan kapasitas kursi armada.
            </li>
          </ol>
          <p style={{ textIndent: '30px', marginBottom: '12px' }}>
            Demikian surat permohonan resmi ini kami sampaikan. Besar harapan kami atas perhatian, pertimbangan, dan persetujuan dari Bapak Kepala Dinas Perhubungan. Atas kerja sama yang baik, kami ucapkan terima kasih.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center', minWidth: '220px', fontSize: '11.5pt' }}>
            <p style={{ margin: '0 0 70px 0' }}>
              Hormat kami,<br />
              <strong>{tenantName || 'Manajemen Operator'}</strong>
            </p>
            <p style={{ margin: 0, textDecoration: 'underline', fontWeight: 'bold' }}>
              ( .................................................... )
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '10.5pt', color: '#444444' }}>
              Direktur / Penanggung Jawab Operasional
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SuratPermohonanMiniAirportTemplate.displayName = 'SuratPermohonanMiniAirportTemplate';

export default SuratPermohonanMiniAirportTemplate;
