import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Notification } from '../types/notification';
import { subscribeToNotifications } from '../services/notificationService';
import { auth } from '../firebase';
import NotificationToast from './NotificationToast';

const NotificationToastContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToNotifications((notifs) => {
      setNotifications(notifs);

      if (notifs.length > 0) {
        const latestNotification = notifs[0];

        if (lastNotificationId !== latestNotification.id) {
          setLastNotificationId(latestNotification.id);

          setVisibleNotifications(prev => {
            const exists = prev.some(n => n.id === latestNotification.id);
            if (!exists) {
              return [...prev, latestNotification];
            }
            return prev;
          });
        }
      }
    });

    return () => unsubscribe();
  }, [lastNotificationId]);

  const handleCloseNotification = (notificationId: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (!auth.currentUser) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification) => (
            <div key={notification.id} className="mb-3">
              <NotificationToast
                notification={notification}
                onClose={() => handleCloseNotification(notification.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationToastContainer;
