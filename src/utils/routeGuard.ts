import { UserData } from '@/types/auth';

export const PUBLIC_ROUTES = ['/', '/login', '/register'];

/**
 * Memeriksa apakah rute dapat diakses oleh publik tanpa login.
 */
export const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/cetak')) return true;
  if (pathname.startsWith('/pembayaran-darurat')) return true;
  return false;
};

/**
 * Helper Normalisasi Role
 */
export const normalizeRole = (role?: string | null): string => {
  return (role || '').trim().toLowerCase();
};

export const isPetugasRole = (role?: string | null): boolean => {
  const r = normalizeRole(role);
  return r === 'petugas' || r === 'petugas lapangan' || r === 'warden' || r.includes('petugas') || r.includes('warden');
};

export const isEksekutifRole = (role?: string | null): boolean => {
  const r = normalizeRole(role);
  return r === 'kepala dinas' || r === 'kadis' || r.includes('kepala') || r.includes('kadis');
};

export const isSuperAdminRole = (role?: string | null): boolean => {
  const r = normalizeRole(role);
  return r === 'superadmin' || r === 'super admin';
};

export const isAdminRole = (role?: string | null): boolean => {
  const r = normalizeRole(role);
  return r === 'admin' || r === 'admin_mini_airport' || r === 'superadmin' || r === 'super admin' || r === 'dinas';
};

export const isTenantRole = (role?: string | null): boolean => {
  const r = normalizeRole(role);
  return r === 'tenant';
};

/**
 * Menentukan rute dashboard default berdasarkan role user.
 */
export const getDefaultDashboardRoute = (user: UserData | null): string => {
  if (!user?.role) return '/login';
  const role = user.role;
  if (isSuperAdminRole(role)) {
    return '/superadmin/users';
  }
  if (isTenantRole(role)) {
    return user.status_verifikasi === 'Pending' ? '/tenant/profil' : '/tenant';
  }
  if (isPetugasRole(role)) {
    const r = normalizeRole(role);
    if (r === 'petugas_mini_airport' || r === 'petugas lapangan mini airport' || Boolean(user?.mini_airport_id)) {
      return '/petugas/mini-airport';
    }
    return '/petugas';
  }
  if (isAdminRole(role)) {
    if (normalizeRole(role) === 'dinas') {
      return '/dinas';
    }
    return '/admin';
  }
  if (isEksekutifRole(role)) {
    return '/eksekutif';
  }
  return '/login';
};

export interface RouteAccessCheck {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

const checkAdminArea = (pathname: string, isAdmin: boolean, user: UserData): RouteAccessCheck => {
  const role = normalizeRole(user.role);
  const isEksekutif = isEksekutifRole(user.role);
  if (!isAdmin && !isEksekutif) {
    return {
      allowed: false,
      redirectTo: getDefaultDashboardRoute(user),
      reason: 'Akses ditolak: Anda tidak memiliki hak akses Administrator atau Dinas.',
    };
  }

  // Jika user adalah Dinas dan mengakses rute /admin/*, alihkan ke rute /dinas/* yang selaras
  if (role === 'dinas' && pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/permohonan')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/permohonan', '/dinas/permohonan') };
    }
    if (pathname.startsWith('/admin/verifikasi')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/verifikasi', '/dinas/verifikasi') };
    }
    if (pathname.startsWith('/admin/kontrak')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/kontrak', '/dinas/kontrak') };
    }
    if (pathname.startsWith('/admin/tagihan')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/tagihan', '/dinas/tagihan') };
    }
    if (pathname.startsWith('/admin/peringatan')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/peringatan', '/dinas/peringatan') };
    }
    if (pathname.startsWith('/admin/laporan')) {
      return { allowed: false, redirectTo: pathname.replace('/admin/laporan', '/dinas/laporan') };
    }
    return { allowed: false, redirectTo: '/dinas' };
  }

  return { allowed: true };
};

const checkDinasArea = (pathname: string, isAdmin: boolean, user: UserData): RouteAccessCheck => {
  const role = normalizeRole(user.role);
  const isEksekutif = isEksekutifRole(user.role);
  if (!isAdmin && !isEksekutif) {
    return {
      allowed: false,
      redirectTo: getDefaultDashboardRoute(user),
      reason: 'Akses ditolak: Anda tidak memiliki hak akses Dinas.',
    };
  }

  // Jika user adalah Admin/Superadmin dan mengakses rute /dinas/*, alihkan ke rute /admin/* yang selaras
  if ((role === 'admin' || role === 'superadmin') && pathname.startsWith('/dinas')) {
    if (pathname.startsWith('/dinas/permohonan')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/permohonan', '/admin/permohonan') };
    }
    if (pathname.startsWith('/dinas/verifikasi')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/verifikasi', '/admin/verifikasi') };
    }
    if (pathname.startsWith('/dinas/kontrak')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/kontrak', '/admin/kontrak') };
    }
    if (pathname.startsWith('/dinas/tagihan')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/tagihan', '/admin/tagihan') };
    }
    if (pathname.startsWith('/dinas/peringatan')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/peringatan', '/admin/peringatan') };
    }
    if (pathname.startsWith('/dinas/laporan')) {
      return { allowed: false, redirectTo: pathname.replace('/dinas/laporan', '/admin/laporan') };
    }
    return { allowed: false, redirectTo: '/admin' };
  }

  return { allowed: true };
};

const checkTenantArea = (pathname: string, user: UserData): RouteAccessCheck => {
  const isTenant = isTenantRole(user.role);
  const isAdmin = isAdminRole(user.role);
  if (isTenant || isAdmin) {
    if (isTenant && user.status_verifikasi === 'Pending' && pathname !== '/tenant/profil') {
      return {
        allowed: false,
        redirectTo: '/tenant/profil',
        reason: 'Akun Anda sedang menunggu verifikasi. Silakan lengkapi profil & legalitas.',
      };
    }
    return { allowed: true };
  }
  return {
    allowed: false,
    redirectTo: getDefaultDashboardRoute(user),
    reason: 'Akses ditolak: Halaman ini khusus untuk Tenant.',
  };
};

const checkPetugasArea = (pathname: string, user: UserData): RouteAccessCheck => {
  const isPetugas = isPetugasRole(user.role);
  const isAdmin = isAdminRole(user.role);
  if (!isPetugas && !isAdmin) {
    return {
      allowed: false,
      redirectTo: getDefaultDashboardRoute(user),
      reason: 'Akses ditolak: Halaman ini khusus untuk Petugas.',
    };
  }

  const role = normalizeRole(user.role);
  const isMiniPetugas = role === 'petugas_mini_airport' || role === 'petugas lapangan mini airport' || Boolean(user.mini_airport_id);

  // Jika petugas mini airport mengakses rute root /petugas atau rute Mozes-only (termasuk pendaratan-darurat), arahkan ke /petugas/mini-airport
  if (isMiniPetugas && (pathname === '/petugas' || pathname === '/petugas/verifikasi-jadwal' || pathname === '/petugas/tutup-hari' || pathname === '/petugas/riwayat' || pathname === '/petugas/pendaratan-darurat')) {
    return {
      allowed: false,
      redirectTo: '/petugas/mini-airport',
    };
  }

  return { allowed: true };
};

const checkEksekutifArea = (user: UserData): RouteAccessCheck => {
  const isEksekutif = isEksekutifRole(user.role);
  const isAdmin = isAdminRole(user.role);
  if (isEksekutif || isAdmin) return { allowed: true };
  return {
    allowed: false,
    redirectTo: getDefaultDashboardRoute(user),
    reason: 'Akses ditolak: Halaman ini khusus untuk Eksekutif / Kepala Dinas.',
  };
};

const checkSuperAdminArea = (user: UserData): RouteAccessCheck => {
  const isSuperAdmin = isSuperAdminRole(user.role);
  if (isSuperAdmin) return { allowed: true };
  return {
    allowed: false,
    redirectTo: getDefaultDashboardRoute(user),
    reason: 'Akses ditolak: Halaman ini khusus untuk Super Administrator.',
  };
};

/**
 * Memeriksa hak akses user terhadap URL pathname saat ini.
 */
export const checkRouteAccess = (
  pathname: string,
  isAuthenticated: boolean,
  user: UserData | null
): RouteAccessCheck => {
  // 1. Rute Publik
  if (isPublicRoute(pathname)) {
    if (isAuthenticated && user && (pathname === '/login' || pathname === '/register')) {
      return {
        allowed: false,
        redirectTo: getDefaultDashboardRoute(user),
      };
    }
    return { allowed: true };
  }

  // 2. Rute Terproteksi tapi belum login
  if (!isAuthenticated || !user) {
    return {
      allowed: false,
      redirectTo: '/login',
    };
  }

  const isAdmin = isAdminRole(user.role);

  // 3. Pengecekan per area rute
  if (pathname.startsWith('/superadmin')) {
    return checkSuperAdminArea(user);
  }
  if (pathname.startsWith('/admin')) {
    return checkAdminArea(pathname, isAdmin, user);
  }
  if (pathname.startsWith('/dinas')) {
    return checkDinasArea(pathname, isAdmin, user);
  }
  if (pathname.startsWith('/tenant')) {
    return checkTenantArea(pathname, user);
  }
  if (pathname.startsWith('/petugas')) {
    return checkPetugasArea(pathname, user);
  }
  if (pathname.startsWith('/eksekutif')) {
    return checkEksekutifArea(user);
  }

  return { allowed: true };
};
