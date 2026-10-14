"use client";

import React from 'react';
import VerifikasiMitraView from '@/components/verification/VerifikasiMitraView';

export default function AdminPenyewaPage() {
  return (
    <VerifikasiMitraView
      portalType="admin"
      portalSubtitle="UPBU Mozes Kilangin Mimika"
      breadcrumbTitle="Verifikasi Mitra"
    />
  );
}
