import { api } from './client';
import {
  Notification,
  NotificationsListResponse,
  UnreadCountResponse,
  MarkReadResponse,
} from '@/types';

export interface NotificationListParams {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
  [key: string]: unknown;
}

export const notificationsService = {
  /**
   * Get paginated list of notifications
   */
  async getAll(params?: NotificationListParams): Promise<NotificationsListResponse> {
    return api.get<NotificationsListResponse>('/notifications', params);
  },

  /**
   * Get a single notification by ID
   */
  async getById(notificationId: number): Promise<Notification> {
    const response = await api.get<{ notification: Notification }>(
      `/notifications/${notificationId}`
    );
    return response.notification;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return response.unread_count;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<Notification> {
    const response = await api.put<MarkReadResponse>(
      `/notifications/${notificationId}/read`
    );
    return response.notification;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.put<{ message: string }>('/notifications/read-all');
  },

  /**
   * Delete a notification
   */
  async delete(notificationId: number): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};
