"use client";

import React from 'react';
import VerifikasiMitraView from '@/components/verification/VerifikasiMitraView';

export default function DinasVerifikasiPage() {
  return (
    <VerifikasiMitraView
      portalType="dinas"
      portalSubtitle="Dinas Perhubungan Kab. Mimika"
      breadcrumbTitle="Verifikasi Mitra"
    />
  );
}
