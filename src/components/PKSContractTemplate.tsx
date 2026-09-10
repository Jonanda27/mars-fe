"use client";

import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';

dayjs.locale('id');

interface PKSContractTemplateProps {
  contractNumber: string;
  tenantName: string;
  tenantAddress?: string;
  tenantPic?: string;
  tenantNib?: string;
  tenantNpwp?: string;
  assetName: string;
  assetCode: string;
  assetArea: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  purpose?: string;
}

const PKSContractTemplate = forwardRef<HTMLDivElement, PKSContractTemplateProps>(
  ({ contractNumber, tenantName, tenantAddress, tenantPic, tenantNib, tenantNpwp, assetName, assetCode, assetArea, startDate, endDate, totalAmount, purpose }, ref) => {
    
    const today = dayjs();
    
    return (
      <div 
        ref={ref} 
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '20mm',
          backgroundColor: 'white',
          fontFamily: '"Times New Roman", Times, serif',
          color: 'black',
          fontSize: '12pt',
          lineHeight: '1.5',
          boxSizing: 'border-box',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '20mm', left: '20mm' }}>
          <img src="/images/logo dishub .png" alt="Logo" style={{ width: '80px', height: 'auto' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', textDecoration: 'underline' }}>
            SURAT PERJANJIAN KERJASAMA
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: '12pt' }}>
            Nomor: {contractNumber}
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
          <p style={{ marginBottom: '10px' }}>Saya yang bertanda tangan di bawah ini :</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', paddingLeft: '20px', marginBottom: '5px' }}>
            <tbody>
              <tr>
                <td style={{ width: '200px', verticalAlign: 'top', paddingLeft: '20px' }}>Nama</td>
                <td style={{ width: '20px', verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>..........................................</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Jabatan</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>Kepala UPBU</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Alamat Instansi</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>Kantor UPBU</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '5px 0 15px' }}>Dalam hal ini bertindak untuk dan atas nama UPBU, yang mana selanjutnya disebut sebagai Pihak Pertama.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', paddingLeft: '20px', marginBottom: '5px' }}>
            <tbody>
              <tr>
                <td style={{ width: '200px', verticalAlign: 'top', paddingLeft: '20px' }}>Nama Perusahaan</td>
                <td style={{ width: '20px', verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}><strong>{tenantName}</strong></td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Diwakili Oleh (PIC)</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{tenantPic || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>NIB</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{tenantNib || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>NPWP</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{tenantNpwp || '..........................................'}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', paddingLeft: '20px' }}>Alamat Perusahaan</td>
                <td style={{ verticalAlign: 'top' }}>:</td>
                <td style={{ verticalAlign: 'top' }}>{tenantAddress || '..........................................'}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '5px 0 15px' }}>Dalam hal ini bertindak untuk dan atas nama perusahaan tersebut, selanjutnya disebut sebagai Pihak Kedua.</p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
          <p>
            Kedua belah pihak telah sepakat untuk mengadakan kerjasama penyewaan aset dengan ketentuan-ketentuan yang diatur sebagai berikut ini :
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '20px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 1</h4>
          <p>
            Dalam kerjasama ini Pihak Pertama akan menyewakan aset berupa <strong>{assetName} (Kode: {assetCode})</strong> seluas <strong>{assetArea} m²</strong> kepada Pihak Kedua dengan tujuan untuk {purpose || 'operasional penerbangan/bandara'}. Masa sewa berlaku selama periode yang dihitung mulai tanggal <strong>{dayjs(startDate).format('DD MMMM YYYY')}</strong> sampai dengan tanggal <strong>{dayjs(endDate).format('DD MMMM YYYY')}</strong>.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 2</h4>
          <p>
            Pihak Kedua wajib membayar biaya sewa sebesar <strong>{formatRupiah(totalAmount)}</strong> kepada Pihak Pertama. Pembayaran tersebut akan ditagihkan sesuai dengan ketentuan tagihan (invoice) yang akan diterbitkan oleh Pihak Pertama selama masa sewa berlangsung.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>PASAL 3</h4>
          <p>
            Apabila terjadi perselisihan antar kedua belah pihak akan diselesaikan secara kekeluargaan terlebih dahulu. Dan apabila tidak ditemui jalan keluar baru akan diselesaikan secara hukum.
          </p>
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '40px' }}>
          <p>
            Demikian surat perjanjian ini kami buat sebenar-benarnya dalam rangkap dua yang mana masing-masing rangkap mempunyai kekuatan hukum yang sama. Dan dalam pembuatan perjanjian kerjasama ini tidak ada paksaan dari pihak manapun.
          </p>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px', paddingRight: '20px' }}>
          <p>................., {today.format('DD MMMM YYYY')}</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <table style={{ width: '100%', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <p style={{ marginBottom: '60px' }}>Pihak Pertama,</p>
                  <p>(..........................................)<br/>Kepala UPBU</p>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <p style={{ marginBottom: '10px' }}>Pihak Kedua,</p>
                  <p style={{ fontSize: '10pt', color: '#666', marginBottom: '30px' }}>(Materai 10000)</p>
                  <p>({tenantPic || tenantName})</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

PKSContractTemplate.displayName = 'PKSContractTemplate';

export default PKSContractTemplate;
