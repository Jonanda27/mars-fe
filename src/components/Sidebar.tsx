"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { normalizeRole } from '@/utils/routeGuard';
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
  Map as MapIcon,
  ClipboardCheck,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onToggle,
  isMobileOpen,
  onCloseMobile
}: Readonly<{ 
  isOpen: boolean; 
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}>) {
  const { user } = useAuthStore();

  const userRole = normalizeRole(user?.role);
  const isMiniAdmin = userRole === 'admin_mini_airport' || Boolean(user?.mini_airport_id);

  const miniAdminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Operasional", icon: <BarChart3 /> },
    { href: "/admin/permohonan", label: `Izin Pendaratan ${user?.airport_code ? `(${user.airport_code})` : 'Mini Airport'}`, icon: <ClipboardCheck /> },
    { href: "/admin/pemakaian", label: "Log Realisasi Lapangan", icon: <Activity /> },
    { href: "/admin/kontrak", label: "PKS Payung Mini Airport", icon: <FileText /> },
    { href: "/admin/tagihan", label: "Monitoring e-SKRD Dinas", icon: <Receipt /> },
    { href: "/admin/laporan", label: "Laporan Realisasi PAD", icon: <FileSpreadsheet /> },
    { href: "/admin/tarif", label: "Master Tax Retribusi Daerah", icon: <Database /> },
    { href: "/admin/verifikasi", label: "Verifikasi Mitra", icon: <Users /> },
  ];

  const mozesAdminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Operasional", icon: <BarChart3 /> },
    { href: "/admin/permohonan", label: "Permohonan Sewa Mozes", icon: <ClipboardCheck /> },
    { href: "/admin/kontrak", label: "Kontrak & Dokumen PKS", icon: <FileText /> },
    { href: "/admin/tagihan", label: "Monitoring e-SKRD", icon: <Receipt /> },
    { href: "/admin/laporan", label: "Laporan Realisasi PAD", icon: <FileSpreadsheet /> },
    { href: "/admin/dashboard", label: "Peta Spasial GIS", icon: <MapIcon /> },
    { href: "/admin/aset", label: "Aset & Fasilitas (m²)", icon: <Building2 /> },
    { href: "/admin/tarif", label: "Master Tarif Sewa", icon: <Database /> },
    { href: "/admin/verifikasi", label: "Verifikasi Mitra", icon: <Users /> },
    { href: "/admin/pemakaian", label: "Log Operasional Lapangan", icon: <Activity /> },
  ];

  const navItems: NavItem[] = isMiniAdmin ? miniAdminNavItems : mozesAdminNavItems;

  const getAdminTitle = () => {
    if (isMiniAdmin) return 'Admin Mini Airport';
    if (userRole === 'admin_hanggar') return 'Admin Hanggar Mozes';
    if (userRole === 'admin_apron') return 'Admin Apron Mozes';
    if (userRole === 'admin_ruangan') return 'Admin Ruangan Mozes';
    return 'Admin Mozes Kilangin';
  };

  const getStatusText = () => {
    if (isMiniAdmin) return 'Admin Mini Airport Online';
    if (userRole === 'admin_hanggar') return 'Admin Hanggar Online';
    if (userRole === 'admin_apron') return 'Admin Apron Online';
    if (userRole === 'admin_ruangan') return 'Admin Ruangan Online';
    return 'Admin Mozes Online';
  };

  return (
    <BaseSidebar
      isOpen={isOpen}
      onToggle={onToggle}
      isMobileOpen={isMobileOpen}
      onCloseMobile={onCloseMobile}
      userName={user?.username || getAdminTitle()}
      userAvatar={user?.username?.charAt(0) || <User className="w-5 h-5" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> {getStatusText()}
        </>
      }
      headerTitle="Main Navigation"
      navItems={navItems}
    />
  );
}
