"use client";

import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface SuratPermohonanTemplateProps {
  tenantName: string;
  tenantAddress: string;
  applicationType: string; // e.g. Hanggar, Apron, Ruangan
  purpose: string;
}

const SuratPermohonanTemplate = forwardRef<HTMLDivElement, SuratPermohonanTemplateProps>(
  ({ tenantName, tenantAddress, applicationType, purpose }, ref) => {
    return (
      <div 
        ref={ref} 
        style={{ 
          width: '210mm', 
          padding: '20mm',
          backgroundColor: 'white',
          fontFamily: '"Times New Roman", Times, serif',
          color: 'black',
          fontSize: '12pt',
          lineHeight: '1.5',
          boxSizing: 'border-box'
        }}
      >
        {/* Kop Surat Perusahaan (Tenant) */}
        <div style={{ borderBottom: '3px solid black', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{tenantName}</h1>
          <p style={{ margin: '5px 0 0', fontSize: '11pt' }}>{tenantAddress || 'Alamat Perusahaan: _________________________________'}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th scope="row" style={{ width: '80px', verticalAlign: 'top', textAlign: 'left', fontWeight: 'normal' }}>Nomor</th>
                  <td style={{ width: '10px', verticalAlign: 'top' }}>:</td>
                  <td>...../...../...../20.....</td>
                </tr>
                <tr>
                  <th scope="row" style={{ verticalAlign: 'top', textAlign: 'left', fontWeight: 'normal' }}>Lampiran</th>
                  <td style={{ verticalAlign: 'top' }}>:</td>
                  <td>1 (satu) Berkas</td>
                </tr>
                <tr>
                  <th scope="row" style={{ verticalAlign: 'top', textAlign: 'left', fontWeight: 'normal' }}>Perihal</th>
                  <td style={{ verticalAlign: 'top' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {applicationType?.toLowerCase().startsWith('sewa') || applicationType?.toLowerCase().startsWith('perpanjangan')
                      ? `Permohonan ${applicationType}`
                      : `Permohonan Sewa ${applicationType}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <p style={{ margin: 0 }}>Timika, {dayjs().format('DD MMMM YYYY')}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <p style={{ margin: 0 }}>Kepada Yth,</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Kepala Unit Penyelenggara Bandar Udara Mozes Kilangin</p>
          <p style={{ margin: 0 }}>di -</p>
          <p style={{ margin: '0 0 0 20px' }}>Tempat</p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          <p style={{ textIndent: '30px', marginBottom: '10px' }}>
            Dengan hormat,
          </p>
          <p style={{ textIndent: '30px', marginBottom: '10px' }}>
            Yang bertanda tangan di bawah ini, mewakili manajemen <strong>{tenantName}</strong>, dengan ini mengajukan permohonan {applicationType?.toLowerCase().startsWith('perpanjangan') ? applicationType.toLowerCase() : `penyewaan fasilitas ${applicationType?.toLowerCase().replace('sewa ', '') || applicationType}`} di area Bandar Udara Mozes Kilangin.
          </p>
          <p style={{ textIndent: '30px', marginBottom: '10px' }}>
            Adapun tujuan penyewaan fasilitas tersebut adalah untuk: <strong>{purpose || '...................................................'}</strong>. Kami berkomitmen untuk mematuhi seluruh peraturan, ketentuan keselamatan penerbangan, serta standar operasional yang berlaku di lingkungan Bandar Udara Mozes Kilangin.
          </p>
          <p style={{ textIndent: '30px', marginBottom: '10px' }}>
            Bersama surat permohonan ini, kami juga melampirkan dokumen legalitas perusahaan yang dibutuhkan sebagai kelengkapan administrasi. Kami siap memberikan penjelasan lebih detail dan menunggu arahan lebih lanjut dari pihak pengelola bandar udara.
          </p>
          <p style={{ textIndent: '30px', marginBottom: '10px' }}>
            Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.
          </p>
        </div>

        <div style={{ marginTop: '50px', textAlign: 'right' }}>
          <div style={{ display: 'inline-block', textAlign: 'center', minWidth: '200px' }}>
            <p style={{ margin: '0 0 80px 0' }}>Hormat Kami,<br/><strong>{tenantName}</strong></p>
            
            {/* Signature space */}
            <p style={{ margin: 0, textDecoration: 'underline', fontWeight: 'bold' }}>..........................................</p>
            <p style={{ margin: 0 }}>Direktur / Pimpinan</p>
          </div>
        </div>
        
        {/* Placeholder for stamp */}
        <div style={{ marginTop: '-70px', marginLeft: '65%', opacity: 0.3, border: '2px dashed #999', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', transform: 'rotate(-15deg)' }}>
          CAP / STEMPEL
        </div>

      </div>
    );
  }
);

SuratPermohonanTemplate.displayName = 'SuratPermohonanTemplate';

export default SuratPermohonanTemplate;
