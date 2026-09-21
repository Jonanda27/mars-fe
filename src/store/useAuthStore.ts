import { create } from 'zustand';
import { authService } from '../services/authService';
import { RegisterTenantPayload, LoginPayload, UserData } from '../types/auth';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  registerSuccess: boolean;
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  loginUser: (data: LoginPayload) => Promise<boolean>;
  logout: () => void;
  registerTenant: (data: RegisterTenantPayload) => Promise<void>;
  syncUser: () => Promise<void>;
  resetState: () => void;
}

const getInitialUser = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  registerSuccess: false,
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isAuthReady: typeof window !== 'undefined' ? !localStorage.getItem('token') || !!getInitialUser() : false,

  loginUser: async (data: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      set({ 
        isLoading: false, 
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isAuthReady: true
      });
      return true;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message || 'Terjadi kesalahan saat masuk';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      registerSuccess: false,
      isAuthReady: true
    });
  },

  registerTenant: async (data: RegisterTenantPayload) => {
    set({ isLoading: true, error: null, registerSuccess: false });
    try {
      await authService.registerTenant(data);
      set({ isLoading: false, registerSuccess: true });
    } catch (err: unknown) {
      const axiosError = err as { message?: string };
      set({ isLoading: false, error: axiosError.message || 'Pendaftaran gagal' });
    }
  },

  syncUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      set({ isAuthReady: true });
      return;
    }

    try {
      const user = await authService.getMe();
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user, token, isAuthenticated: true, isAuthReady: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        // Token invalid or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ isAuthenticated: false, user: null, token: null, isAuthReady: true });
      } else {
        set({ isAuthReady: true });
      }
    }
  },

  resetState: () => set({ isLoading: false, error: null, registerSuccess: false }),
}));
