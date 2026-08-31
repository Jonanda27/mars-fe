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
  loginUser: (data: LoginPayload) => Promise<boolean>;
  logout: () => void;
  registerTenant: (data: RegisterTenantPayload) => Promise<void>;
  syncUser: () => Promise<void>;
  resetState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  registerSuccess: false,
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,

  loginUser: async (data: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      set({ 
        isLoading: false, 
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true 
      });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
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
    }
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      registerSuccess: false
    });
  },

  registerTenant: async (data: RegisterTenantPayload) => {
    set({ isLoading: true, error: null, registerSuccess: false });
    try {
      await authService.registerTenant(data);
      set({ isLoading: false, registerSuccess: true });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  syncUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token invalid or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ isAuthenticated: false, user: null, token: null });
      }
    }
  },

  resetState: () => set({ isLoading: false, error: null, registerSuccess: false }),
}));
