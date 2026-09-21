"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { 
  Building2, 
  Users, 
  FileText, 
  Activity, 
  BarChart3,
  Circle, 
  User, 
  Database, 
  Map as MapIcon 
} from 'lucide-react';

export default function Sidebar({ isOpen }: Readonly<{ isOpen: boolean }>) {
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Operasional", icon: <BarChart3 /> },
    { href: "/admin/dashboard", label: "Peta Spasial GIS", icon: <MapIcon /> },
    { href: "/admin/aset", label: "Aset & Fasilitas", icon: <Building2 /> },
    { href: "/admin/tarif", label: "Master Tarif Perda", icon: <Database /> },
    { href: "/admin/penyewa", label: "Direktori Mitra (Tenant)", icon: <Users /> },
    { href: "/admin/kontrak", label: "Kontrak & Dokumen", icon: <FileText /> },
    { href: "/admin/pemakaian", label: "Log Operasional Lapangan", icon: <Activity /> },
  ];

  return (
    <BaseSidebar
      isOpen={isOpen}
      userName={user?.username || 'Administrator'}
      userAvatar={user?.username?.charAt(0) || <User className="w-5 h-5" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> Admin Online
        </>
      }
      headerTitle="Main Navigation"
      navItems={navItems}
    />
  );
}
