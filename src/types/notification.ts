export interface NotificationItem {
  id: number | string;
  user_id?: number;
  title: string;
  message: string;
  type: string;
  link_url?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  is_task?: boolean;
}

export interface NotificationStreamMessage {
  type: string;
  data: NotificationItem;
}
