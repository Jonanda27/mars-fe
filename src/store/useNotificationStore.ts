import { create } from 'zustand';
import { getApiUrl } from '@/services/api';
import { notificationService } from '@/services/notificationService';
import { NotificationItem } from '@/types/notification';
import { UserData } from '@/types/auth';
import { rentalService } from '@/services/rentalService';
import { contractService } from '@/services/contractService';
import dayjs from 'dayjs';

export type Notification = NotificationItem;

interface NotificationState {
  notifications: Notification[];
  rawDbNotifications: Notification[];
  rawTaskNotifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  eventSource: EventSource | null;
  fetchNotifications: (token: string) => Promise<void>;
  fetchTasks: (user: UserData | null) => Promise<void>;
  connectSSE: (token: string) => void;
  disconnectSSE: () => void;
  markAsRead: (id: number | string, token?: string, userId?: number) => Promise<void>;
  markAllAsRead: (token?: string, userId?: number) => Promise<void>;
}

const getStorageKeys = (userId?: number | string): string[] => {
  const keys = ['mars_read_task_ids', 'mars_dismissed_tasks'];
  let effectiveId = userId;
  if (!effectiveId && typeof window !== 'undefined') {
    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        effectiveId = parsed?.id;
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (effectiveId) {
    keys.push(`mars_read_task_ids_${effectiveId}`, `mars_dismissed_tasks_${effectiveId}`);
  }
  return keys;
};

const getReadTaskIds = (userId?: number | string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const keys = getStorageKeys(userId);
    const idSet = new Set<string>();
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => idSet.add(String(id)));
        }
      }
    }
    return Array.from(idSet);
  } catch {
    return [];
  }
};

const saveReadTaskId = (taskId: string, userId?: number | string): void => {
  if (typeof window === 'undefined') return;
  try {
    const keys = getStorageKeys(userId);
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      const existing: string[] = raw ? JSON.parse(raw) : [];
      if (!existing.includes(taskId)) {
        localStorage.setItem(key, JSON.stringify([...existing, taskId]));
      }
    }
  } catch {
    // Quietly ignore storage errors
  }
};

const saveMultipleReadTaskIds = (taskIds: string[], userId?: number | string): void => {
  if (typeof window === 'undefined') return;
  try {
    const keys = getStorageKeys(userId);
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      const existing: string[] = raw ? JSON.parse(raw) : [];
      const updated = Array.from(new Set([...existing, ...taskIds]));
      localStorage.setItem(key, JSON.stringify(updated));
    }
  } catch {
    // Quietly ignore storage errors
  }
};

const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const mergeAndSortNotifications = (
  dbNotifs: Notification[], 
  taskNotifs: Notification[]
): Notification[] => {
  const map = new Map<string, Notification>();

  dbNotifs.forEach((d) => {
    if (d && d.id !== undefined && d.id !== null) {
      map.set(String(d.id), d);
    }
  });

  taskNotifs.forEach((t) => {
    if (t && t.id !== undefined && t.id !== null) {
      map.set(String(t.id), t);
    }
  });

  const merged = Array.from(map.values());
  return merged.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0;
    const timeB = new Date(b.created_at).getTime() || 0;
    return timeB - timeA;
  });
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  rawDbNotifications: [],
  rawTaskNotifications: [],
  unreadCount: 0,
  isConnected: false,
  eventSource: null,

  fetchNotifications: async (token) => {
    if (!token || !isTokenValid(token)) return;
    try {
      const data = await notificationService.getNotifications();
      const uniqueDbNotifs = Array.from(
        new Map((data || []).map((item) => [String(item.id), item])).values()
      );
      const currentTasks = get().rawTaskNotifications;
      const merged = mergeAndSortNotifications(uniqueDbNotifs, currentTasks);
      set({ 
        rawDbNotifications: uniqueDbNotifs,
        notifications: merged,
        unreadCount: merged.filter((n) => !n.is_read).length
      });
    } catch {
      // Quietly ignore network failures
    }
  },

  fetchTasks: async (user: UserData | null) => {
    if (!user) {
      const currentDb = get().rawDbNotifications;
      set({ 
        rawTaskNotifications: [], 
        notifications: currentDb,
        unreadCount: currentDb.filter((n) => !n.is_read).length
      });
      return;
    }

    try {
      const readTaskIds = getReadTaskIds(user.id);
      const taskList: Notification[] = [];
      const role = user.role?.toLowerCase() || '';

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (role === 'tenant') {
        const [apps, contracts] = await Promise.all([
          rentalService.getTenantApplications().catch(() => []),
          contractService.getTenantContracts().catch(() => [])
        ]);

        if (Array.isArray(contracts)) {
          contracts.forEach((c) => {
            if (c.status === 'Menunggu TTD Tenant') {
              const taskId = `task-contract-${c.id}`;
              const isRead = readTaskIds.includes(taskId);
              taskList.push({
                id: taskId,
                title: `Kontrak ${c.contract_number} Menunggu TTD`,
                message: `Kontrak sewa (${c.assets?.nama_aset || 'Aset'}) siap ditandatangani.`,
                type: 'TASK',
                is_read: isRead,
                link_url: '/tenant/kontrak',
                created_at: c.created_at || new Date().toISOString(),
                is_task: true
              });
            }

            // Engine Notifikasi Otomatis H-7 (Slide 3 PPTX)
            if (c.end_date && (c.status === 'Aktif' || c.status === 'Active')) {
              const endDate = new Date(c.end_date);
              endDate.setHours(0, 0, 0, 0);
              const diffTime = endDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays >= 0 && diffDays <= 7) {
                const taskId = `task-h7-contract-${c.id}`;
                const isRead = readTaskIds.includes(taskId);
                taskList.push({
                  id: taskId,
                  title: `Masa Berlaku Kontrak Segera Berakhir (H-${diffDays})`,
                  message: `Kontrak No. ${c.contract_number} (${c.assets?.nama_aset || 'Aset'}) akan berakhir pada ${dayjs(c.end_date).format('DD/MM/YYYY')}. Segera ajukan perpanjangan.`,
                  type: 'TASK',
                  is_read: isRead,
                  link_url: (c.contract_type || '').toLowerCase().includes('payung') ? '/tenant/kontrak-payung' : '/tenant/permohonan',
                  created_at: new Date().toISOString(),
                  is_task: true
                });
              }
            }
          });
        }

        if (Array.isArray(apps)) {
          apps.forEach((a) => {
            if (a.status === 'Surat Disetujui') {
              const taskId = `task-app-${a.id}`;
              const isRead = readTaskIds.includes(taskId);
              taskList.push({
                id: taskId,
                title: `Permohonan ${a.application_type} Disetujui`,
                message: `Surat permohonan disetujui Kepala Dinas. Silakan lengkapi detail permohonan.`,
                type: 'TASK',
                is_read: isRead,
                link_url: `/tenant/permohonan/${a.id}`,
                created_at: a.updated_at || a.created_at || new Date().toISOString(),
                is_task: true
              });
            }
          });
        }
      } else if (role === 'admin') {
        const [apps, allContracts] = await Promise.all([
          rentalService.getAllApplications().catch(() => []),
          contractService.getContracts().catch(() => [])
        ]);

        if (Array.isArray(apps)) {
          apps.forEach((a) => {
            if (a.status === 'Menunggu Validasi Admin' || a.status === 'Diajukan') {
              const taskId = `task-admin-app-${a.id}`;
              const isRead = readTaskIds.includes(taskId);
              taskList.push({
                id: taskId,
                title: `Permohonan Baru (${a.application_type})`,
                message: `Permohonan dari ${a.tenants?.nama_perusahaan || 'Tenant'} memerlukan peninjauan.`,
                type: 'TASK',
                is_read: isRead,
                link_url: `/admin/permohonan/review/${a.id}`,
                created_at: a.created_at || new Date().toISOString(),
                is_task: true
              });
            }
          });
        }

        if (Array.isArray(allContracts)) {
          allContracts.forEach((c) => {
            if (c.end_date && (c.status === 'Aktif' || c.status === 'Active')) {
              const endDate = new Date(c.end_date);
              endDate.setHours(0, 0, 0, 0);
              const diffTime = endDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays >= 0 && diffDays <= 7) {
                const taskId = `task-h7-admin-contract-${c.id}`;
                const isRead = readTaskIds.includes(taskId);
                taskList.push({
                  id: taskId,
                  title: `Masa Kontrak Tenant Segera Berakhir (H-${diffDays})`,
                  message: `Kontrak No. ${c.contract_number} milik ${c.tenants?.nama_perusahaan || 'Tenant'} berakhir pada ${dayjs(c.end_date).format('DD/MM/YYYY')}.`,
                  type: 'TASK',
                  is_read: isRead,
                  link_url: '/admin/kontrak',
                  created_at: new Date().toISOString(),
                  is_task: true
                });
              }
            }
          });
        }
      } else if (role.includes('dinas') || role.includes('eksekutif')) {
        const [apps, allContracts] = await Promise.all([
          rentalService.getAllApplications().catch(() => []),
          contractService.getContracts().catch(() => [])
        ]);

        if (Array.isArray(apps)) {
          apps.forEach((a) => {
            if (a.status === 'Menunggu Verifikasi Kadis') {
              const taskId = `task-kadis-app-${a.id}`;
              const isRead = readTaskIds.includes(taskId);
              taskList.push({
                id: taskId,
                title: `Persetujuan Surat (${a.application_type})`,
                message: `Surat permohonan dari ${a.tenants?.nama_perusahaan || 'Tenant'} menunggu tanda tangan Kadis.`,
                type: 'TASK',
                is_read: isRead,
                link_url: `/eksekutif/permohonan/${a.id}`,
                created_at: a.created_at || new Date().toISOString(),
                is_task: true
              });
            }
          });
        }

        if (Array.isArray(allContracts)) {
          allContracts.forEach((c) => {
            if (c.end_date && (c.status === 'Aktif' || c.status === 'Active')) {
              const endDate = new Date(c.end_date);
              endDate.setHours(0, 0, 0, 0);
              const diffTime = endDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays >= 0 && diffDays <= 7) {
                const taskId = `task-h7-dinas-contract-${c.id}`;
                const isRead = readTaskIds.includes(taskId);
                taskList.push({
                  id: taskId,
                  title: `Masa Kontrak Tenant Segera Berakhir (H-${diffDays})`,
                  message: `Kontrak No. ${c.contract_number} milik ${c.tenants?.nama_perusahaan || 'Tenant'} berakhir pada ${dayjs(c.end_date).format('DD/MM/YYYY')}.`,
                  type: 'TASK',
                  is_read: isRead,
                  link_url: '/dinas/kontrak',
                  created_at: new Date().toISOString(),
                  is_task: true
                });
              }
            }
          });
        }
      }


      const currentDb = get().rawDbNotifications;
      const merged = mergeAndSortNotifications(currentDb, taskList);
      set({ 
        rawTaskNotifications: taskList,
        notifications: merged,
        unreadCount: merged.filter((n) => !n.is_read).length
      });
    } catch {
      // Quietly ignore network failures
    }
  },

  connectSSE: (token) => {
    if (!token || !isTokenValid(token)) return;
    if (get().isConnected || get().eventSource) return;

    const apiUrl = getApiUrl();
    try {
      const eventSource = new EventSource(`${apiUrl}/notifications/stream?token=${token}`);

      eventSource.onopen = () => {
        set({ isConnected: true, eventSource });
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CONNECTED') return;

          set((state) => {
            const existingIndex = state.rawDbNotifications.findIndex(
              (n) => String(n.id) === String(data.id)
            );
            let updatedDb: Notification[];
            if (existingIndex >= 0) {
              updatedDb = [...state.rawDbNotifications];
              updatedDb[existingIndex] = { ...updatedDb[existingIndex], ...data };
            } else {
              updatedDb = [data, ...state.rawDbNotifications];
            }
            const merged = mergeAndSortNotifications(updatedDb, state.rawTaskNotifications);
            return {
              rawDbNotifications: updatedDb,
              notifications: merged,
              unreadCount: merged.filter((n) => !n.is_read).length
            };
          });
        } catch {
          // Ignore keep-alive comments or non-JSON pings
        }
      };

      eventSource.onerror = () => {
        eventSource.onopen = null;
        eventSource.onmessage = null;
        eventSource.onerror = null;
        eventSource.close();
        set({ isConnected: false, eventSource: null });

        const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (currentToken && isTokenValid(currentToken)) {
          setTimeout(() => {
            if (!get().isConnected && !get().eventSource) {
              get().connectSSE(currentToken);
            }
          }, 8000);
        }
      };
    } catch {
      set({ isConnected: false, eventSource: null });
    }
  },

  disconnectSSE: () => {
    const { eventSource } = get();
    if (eventSource) {
      eventSource.onopen = null;
      eventSource.onmessage = null;
      eventSource.onerror = null;
      eventSource.close();
    }
    set({ isConnected: false, eventSource: null });
  },

  markAsRead: async (id: number | string, token?: string, userId?: number) => {
    const idStr = String(id);
    const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null) || '';

    if (idStr.startsWith('task-')) {
      saveReadTaskId(idStr, userId);
      const updatedTasks = get().rawTaskNotifications.map((t) =>
        String(t.id) === idStr ? { ...t, is_read: true } : t
      );
      const currentDb = get().rawDbNotifications;
      const merged = mergeAndSortNotifications(currentDb, updatedTasks);
      set({
        rawTaskNotifications: updatedTasks,
        notifications: merged,
        unreadCount: merged.filter((n) => !n.is_read).length
      });
      return;
    }

    try {
      const updatedDb = get().rawDbNotifications.map((n) => 
        String(n.id) === idStr ? { ...n, is_read: true } : n
      );
      const currentTasks = get().rawTaskNotifications;
      const merged = mergeAndSortNotifications(updatedDb, currentTasks);
      set({
        rawDbNotifications: updatedDb,
        notifications: merged,
        unreadCount: merged.filter((n) => !n.is_read).length
      });

      if (effectiveToken) {
        await notificationService.markAsRead(Number(id));
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },

  markAllAsRead: async (token?: string, userId?: number) => {
    const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null) || '';

    const taskIds = get().rawTaskNotifications.map((t) => String(t.id));
    if (taskIds.length > 0) {
      saveMultipleReadTaskIds(taskIds, userId);
    }

    const updatedTasks = get().rawTaskNotifications.map((t) => ({ ...t, is_read: true }));
    const updatedDb = get().rawDbNotifications.map((n) => ({ ...n, is_read: true }));
    const merged = mergeAndSortNotifications(updatedDb, updatedTasks);

    set({
      rawTaskNotifications: updatedTasks,
      rawDbNotifications: updatedDb,
      notifications: merged,
      unreadCount: 0
    });

    if (effectiveToken) {
      try {
        await notificationService.markAllAsRead();
      } catch (error) {
        console.error('Failed to mark all notifications as read', error);
      }
    }
  }
}));
