export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: number;
  createdBy: string;
  createdByEmail?: string;
  read?: boolean;
}

export interface UserNotificationStatus {
  userId: string;
  notificationId: string;
  read: boolean;
  readAt?: number;
}
