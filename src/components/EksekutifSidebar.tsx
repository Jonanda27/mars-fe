"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { FileText, Briefcase, User, Circle, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function EksekutifSidebar({ 
  isOpen, 
  onToggle,
  isMobileOpen,
  onCloseMobile
}: { 
  readonly isOpen: boolean; 
  readonly onToggle?: () => void;
  readonly isMobileOpen?: boolean;
  readonly onCloseMobile?: () => void;
}) {
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/eksekutif", label: "Dashboard Eksekutif", icon: <Briefcase /> },
    { href: "/eksekutif/permohonan", label: "Persetujuan Surat", icon: <FileText /> },
    { href: "/eksekutif/kontrak", label: "Persetujuan Kontrak", icon: <ShieldCheck /> },
    { href: "/admin/laporan", label: "Laporan Realisasi PAD", icon: <FileSpreadsheet /> },
  ];

  return (
    <BaseSidebar
      isOpen={isOpen}
      onToggle={onToggle}
      isMobileOpen={isMobileOpen}
      onCloseMobile={onCloseMobile}
      userName={user?.username || 'Kepala Dinas'}
      userAvatar={<User className="w-5 h-5" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> Online
        </>
      }
      headerTitle="Eksekutif Portal"
      navItems={navItems}
    />
  );
}
