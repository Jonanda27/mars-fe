"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  FileSpreadsheet, 
  Users, 
  ShieldCheck, 
  Circle, 
  ReceiptText,
  User,
  FileCheck2,
  BellRing,
  ShieldAlert
} from 'lucide-react';
import RupiahIcon from './icons/RupiahIcon';

export default function DinasSidebar({ isOpen, onToggle }: Readonly<{ isOpen: boolean; onToggle?: () => void }>) {
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/dinas", label: "Dashboard Kinerja", icon: <BarChart3 /> },
    { href: "/dinas/permohonan", label: "Permohonan Masuk", icon: <FileText /> },
    { href: "/dinas/verifikasi", label: "Verifikasi Mitra", icon: <Users /> },
    { href: "/dinas/kontrak", label: "Kontrak & PKS", icon: <ShieldCheck /> },
    { href: "/dinas/tagihan", label: "SKRD & Penetapan", icon: <RupiahIcon /> },
    { href: "/dinas/peringatan", label: "Penagihan Piutang", icon: <AlertTriangle /> },
    { href: "/dinas/template-surat-pemberitahuan", label: "Pemberitahuan (H-7)", icon: <BellRing /> },
    { href: "/dinas/template-surat-teguran", label: "Surat Teguran (H+7)", icon: <ShieldAlert /> },
    { href: "/dinas/template-strd", label: "Template STRD", icon: <ReceiptText /> },
    { href: "/dinas/template-ssrd", label: "Template SSRD", icon: <FileCheck2 /> },
    { href: "/dinas/laporan", label: "Laporan Realisasi PAD", icon: <FileSpreadsheet /> },
  ];

  return (
    <BaseSidebar
      isOpen={isOpen}
      onToggle={onToggle}
      userName={user?.username || 'Dinas Perhubungan'}
      userAvatar={user?.username?.charAt(0) || <User className="w-5 h-5" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> Dinas Online
        </>
      }
      headerTitle="Dinas Portal"
      navItems={navItems}
    />
  );
}
