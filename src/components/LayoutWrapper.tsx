"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import SuperAdminSidebar from './SuperAdminSidebar';
import DinasSidebar from './DinasSidebar';
import TenantSidebar from './TenantSidebar';
import PetugasSidebar from './PetugasSidebar';
import EksekutifSidebar from './EksekutifSidebar';
import TopNavbar from './TopNavbar';
import { checkRouteAccess, isPublicRoute, isTenantRole, isPetugasRole, isEksekutifRole, isSuperAdminRole } from '@/utils/routeGuard';

const emptySubscribe = () => () => {};

export default function LayoutWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAuthReady, syncUser } = useAuthStore();

  useEffect(() => {
    // Sync profil user ke backend setiap kali app di-mount atau dimuat ulang
    syncUser();
  }, [syncUser]);

  const access = checkRouteAccess(pathname, isAuthenticated, user);

  useEffect(() => {
    if (!isMounted || !isAuthReady) return;

    if (!access.allowed && access.redirectTo) {
      if (access.reason) {
        toast.error(access.reason, { id: 'route-guard-denied' });
      }
      router.replace(access.redirectTo);
    }
  }, [access, isAuthReady, isMounted, router]);

  // Jika belum mounted di client atau auth belum siap atau akses rute privat tidak diizinkan, cegah render dan tampilkan loader konsisten
  if (!isPublicRoute(pathname) && (!isMounted || !isAuthReady || !access.allowed)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#ecf0f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3c8dbc] border-t-transparent"></div>
          <span className="text-sm font-medium text-gray-500">Memeriksa hak akses...</span>
        </div>
      </div>
    );
  }

  // Jika di halaman awal (Login), register, atau khusus layar penuh lainnya
  if (isPublicRoute(pathname) || pathname === '/admin/dashboard') {
    return <>{children}</>;
  }

  const userRole = (user?.role || '').toLowerCase();
  const isSuperAdmin = isSuperAdminRole(userRole) || (pathname.startsWith('/superadmin') && !isTenantRole(userRole));
  const isDinas = userRole === 'dinas' || pathname.startsWith('/dinas');
  const isAdmin = (userRole === 'admin' || userRole === 'admin_mini_airport') && !pathname.startsWith('/dinas');
  const isEksekutif = isEksekutifRole(userRole) || (pathname.startsWith('/eksekutif') && !isAdmin && !isDinas && !isSuperAdmin);
  const isPetugas = isPetugasRole(userRole) || (pathname.startsWith('/petugas') && !isAdmin && !isDinas && !isSuperAdmin);
  const isTenant = isTenantRole(userRole) || (pathname.startsWith('/tenant') && !isAdmin && !isDinas && !isSuperAdmin);

  const renderSidebar = () => {
    const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
    if (isSuperAdmin) {
      return <SuperAdminSidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    if (isDinas) {
      return <DinasSidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    if (isAdmin) {
      return <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    if (isTenant) {
      return <TenantSidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    if (isPetugas) {
      return <PetugasSidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    if (isEksekutif) {
      return <EksekutifSidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
    }
    return <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#ecf0f5]">
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
