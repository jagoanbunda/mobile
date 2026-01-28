import { DateTimeString, PaginatedResponse } from './common';

/** Notification type enum */
export type NotificationType =
  | 'pmt_reminder'
  | 'screening_reminder'
  | 'measurement_reminder'
  | 'general';

/** Notification data payload */
export interface NotificationData {
  child_id?: number;
  schedule_id?: number;
  screening_id?: number;
  [key: string]: unknown;
}

/** Notification entity */
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  data: NotificationData;
  is_read: boolean;
  read_at: DateTimeString | null;
  created_at: DateTimeString;
}

/** GET /notifications response */
export type NotificationsListResponse = PaginatedResponse<Notification>;

/** GET /notifications/unread-count response */
export interface UnreadCountResponse {
  unread_count: number;
}

/** PUT /notifications/{id}/read response */
export interface MarkReadResponse {
  message: string;
  notification: Notification;
}
