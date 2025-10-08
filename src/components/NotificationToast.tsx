import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Notification } from '../types/notification';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'info':
        return {
          icon: Info,
          bg: 'bg-blue-500',
          border: 'border-blue-600',
          text: 'text-blue-50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-500',
          border: 'border-yellow-600',
          text: 'text-yellow-50'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bg: 'bg-green-500',
          border: 'border-green-600',
          text: 'text-green-50'
        };
      case 'error':
        return {
          icon: XCircle,
          bg: 'bg-red-500',
          border: 'border-red-600',
          text: 'text-red-50'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-gray-500',
          border: 'border-gray-600',
          text: 'text-gray-50'
        };
    }
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.4
          }}
          className={`${config.bg} ${config.text} rounded-xl shadow-2xl border-2 ${config.border} p-3 sm:p-4 w-[calc(100vw-2rem)] sm:w-96 max-w-md overflow-hidden relative backdrop-blur-sm`}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
          }}
        >
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>

          <div className="flex items-start gap-2 sm:gap-3 pr-5 sm:pr-6">
            <motion.div
              className="flex-shrink-0 mt-0.5"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
              <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1 leading-tight">
                {notification.title}
              </h4>
              <p className="text-xs sm:text-sm opacity-95 break-words leading-snug">
                {notification.message}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-white/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
