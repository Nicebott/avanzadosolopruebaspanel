import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types/notification';
import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notificationService';
import { auth } from '../firebase';

interface NotificationBellProps {
  darkMode: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ darkMode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToNotifications((notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const getTypeIcon = (type: string) => {
    const baseClasses = "w-2 h-2 rounded-full";
    switch (type) {
      case 'info':
        return <div className={`${baseClasses} bg-blue-500`} />;
      case 'warning':
        return <div className={`${baseClasses} bg-yellow-500`} />;
      case 'success':
        return <div className={`${baseClasses} bg-green-500`} />;
      case 'error':
        return <div className={`${baseClasses} bg-red-500`} />;
      default:
        return <div className={`${baseClasses} bg-gray-500`} />;
    }
  };

  if (!auth.currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          darkMode
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl border z-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className={`px-4 py-3 border-b flex items-center justify-between ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notificaciones {unreadCount > 0 && `(${unreadCount})`}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        darkMode
                          ? 'text-blue-400 hover:bg-blue-900/30'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Marcar todas como leídas"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-1 rounded transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:bg-gray-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className={`px-4 py-8 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`px-4 py-3 transition-colors ${
                          !notification.read
                            ? darkMode
                              ? 'bg-blue-900/20'
                              : 'bg-blue-50'
                            : ''
                        } ${
                          darkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold text-sm ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className={`p-1 rounded flex-shrink-0 ${
                                    darkMode
                                      ? 'text-blue-400 hover:bg-blue-900/30'
                                      : 'text-blue-600 hover:bg-blue-50'
                                  }`}
                                  title="Marcar como leída"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-1 ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {new Date(notification.createdAt).toLocaleDateString('es-DO', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
