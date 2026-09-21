import api from './api';
import { NotificationItem } from '../types/notification';

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await api.get('/notifications');
    return response.data.data;
  },

  markAsRead: async (id: number): Promise<NotificationItem> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await api.put('/notifications/read-all');
    return response.data.data;
  }
};
