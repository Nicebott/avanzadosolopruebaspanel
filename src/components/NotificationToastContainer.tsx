import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Notification } from '../types/notification';
import { subscribeToNotifications } from '../services/notificationService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import NotificationToast from './NotificationToast';

const NotificationToastContainer: React.FC = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const seenNotificationsRef = useRef<Set<string>>(new Set());

  // Escuchar cambios de autenticación
  useEffect(() => {
    console.log('[Toast] Configurando listener de autenticación');
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('[Toast] Usuario autenticado:', user.uid);
        setCurrentUserId(user.uid);
      } else {
        console.log('[Toast] Usuario no autenticado');
        setCurrentUserId(null);
        setVisibleNotifications([]);
        seenNotificationsRef.current.clear();
      }
    });

    return () => {
      console.log('[Toast] Limpiando listener de autenticación');
      unsubscribeAuth();
    };
  }, []);

  // Suscribirse a notificaciones cuando hay usuario
  useEffect(() => {
    if (!currentUserId) {
      console.log('[Toast] No hay usuario, no se suscribe a notificaciones');
      return;
    }

    console.log('[Toast] Suscribiendo a notificaciones para usuario:', currentUserId);

    const unsubscribe = subscribeToNotifications((notifs) => {
      console.log('[Toast] Notificaciones recibidas:', notifs.length);

      if (notifs.length === 0) return;

      const latestNotification = notifs[0];
      console.log('[Toast] Última notificación:', latestNotification);

      if (!seenNotificationsRef.current.has(latestNotification.id)) {
        console.log('[Toast] Nueva notificación detectada, mostrando toast');
        seenNotificationsRef.current.add(latestNotification.id);

        setVisibleNotifications(prev => {
          const exists = prev.some(n => n.id === latestNotification.id);
          if (!exists) {
            console.log('[Toast] Agregando notificación a visibles');
            return [...prev, latestNotification];
          }
          console.log('[Toast] Notificación ya existe en visibles');
          return prev;
        });
      } else {
        console.log('[Toast] Notificación ya fue vista anteriormente');
      }
    });

    return () => {
      console.log('[Toast] Desuscribiendo de notificaciones');
      unsubscribe();
    };
  }, [currentUserId]);

  const handleCloseNotification = (notificationId: string) => {
    console.log('[Toast] Cerrando notificación:', notificationId);
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (!currentUserId) {
    console.log('[Toast] No hay usuario autenticado, no renderizando contenedor');
    return null;
  }

  console.log('[Toast] Renderizando contenedor con', visibleNotifications.length, 'notificaciones');

  return (
    <div 
      className="fixed top-20 right-4 z-[9999] flex flex-col gap-3"
      style={{ pointerEvents: 'none' }}
    >
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <div 
            key={notification.id} 
            style={{ pointerEvents: 'auto' }}
          >
            <NotificationToast
              notification={notification}
              onClose={() => handleCloseNotification(notification.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToastContainer;