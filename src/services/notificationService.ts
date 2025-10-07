import { ref, push, get, update, remove, onValue, off } from 'firebase/database';
import { db, auth } from '../firebase';
import { Notification } from '../types/notification';

export const createNotification = async (
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error'
): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return false;
    }

    const notificationsRef = ref(db, 'notifications');
    const newNotification = {
      title,
      message,
      type,
      createdAt: Date.now(),
      createdBy: user.uid,
      createdByEmail: user.email || 'Admin'
    };

    console.log('Intentando crear notificación:', newNotification);
    await push(notificationsRef, newNotification);
    console.log('Notificación creada exitosamente');
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    return false;
  }
};

export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    const notificationsRef = ref(db, 'notifications');
    const snapshot = await get(notificationsRef);

    if (!snapshot.exists()) return [];

    const notifications: Notification[] = [];
    snapshot.forEach((child) => {
      notifications.push({
        id: child.key!,
        ...child.val()
      });
    });

    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const notificationsRef = ref(db, 'notifications');
    const snapshot = await get(notificationsRef);

    if (!snapshot.exists()) return [];

    const userReadStatusRef = ref(db, `userNotificationStatus/${user.uid}`);
    const readStatusSnapshot = await get(userReadStatusRef);

    const readStatus: { [key: string]: boolean } = {};
    if (readStatusSnapshot.exists()) {
      readStatusSnapshot.forEach((child) => {
        readStatus[child.key!] = child.val().read;
      });
    }

    const notifications: Notification[] = [];
    snapshot.forEach((child) => {
      notifications.push({
        id: child.key!,
        ...child.val(),
        read: readStatus[child.key!] || false
      });
    });

    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const userNotificationRef = ref(db, `userNotificationStatus/${user.uid}/${notificationId}`);
    await update(userNotificationRef, {
      read: true,
      readAt: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const notifications = await getUserNotifications();
    const updates: { [key: string]: any } = {};

    notifications.forEach((notification) => {
      if (!notification.read) {
        updates[`userNotificationStatus/${user.uid}/${notification.id}`] = {
          read: true,
          readAt: Date.now()
        };
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
    }

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const notificationRef = ref(db, `notifications/${notificationId}`);
    await remove(notificationRef);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

export const subscribeToNotifications = (callback: (notifications: Notification[]) => void) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const notificationsRef = ref(db, 'notifications');
  const userReadStatusRef = ref(db, `userNotificationStatus/${user.uid}`);

  const handleNotifications = async () => {
    const notificationsSnapshot = await get(notificationsRef);
    const readStatusSnapshot = await get(userReadStatusRef);

    const readStatus: { [key: string]: boolean } = {};
    if (readStatusSnapshot.exists()) {
      readStatusSnapshot.forEach((child) => {
        readStatus[child.key!] = child.val().read;
      });
    }

    const notifications: Notification[] = [];
    if (notificationsSnapshot.exists()) {
      notificationsSnapshot.forEach((child) => {
        notifications.push({
          id: child.key!,
          ...child.val(),
          read: readStatus[child.key!] || false
        });
      });
    }

    callback(notifications.sort((a, b) => b.createdAt - a.createdAt));
  };

  onValue(notificationsRef, handleNotifications);
  onValue(userReadStatusRef, handleNotifications);

  return () => {
    off(notificationsRef);
    off(userReadStatusRef);
  };
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const notifications = await getUserNotifications();
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
