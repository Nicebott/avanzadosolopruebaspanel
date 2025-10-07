import React, { useState } from 'react';
import { Bell, Send, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createNotification, deleteNotification } from '../services/notificationService';
import { Notification } from '../types/notification';
import toast from 'react-hot-toast';

interface NotificationPanelProps {
  darkMode: boolean;
  notifications: Notification[];
  onRefresh: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ darkMode, notifications, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success' | 'error'>('info');
  const [sending, setSending] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setSending(true);
    const success = await createNotification(title, message, type);

    if (success) {
      toast.success('Notificación enviada exitosamente');
      setTitle('');
      setMessage('');
      setType('info');
      onRefresh();
    } else {
      toast.error('Error al enviar la notificación');
    }

    setSending(false);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      return;
    }

    const success = await deleteNotification(notificationId);
    if (success) {
      toast.success('Notificación eliminada');
      onRefresh();
    } else {
      toast.error('Error al eliminar la notificación');
    }
  };

  const getTypeIcon = (notificationType: string) => {
    switch (notificationType) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (notificationType: string) => {
    switch (notificationType) {
      case 'info':
        return darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300';
      case 'warning':
        return darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-300';
      case 'success':
        return darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-300';
      case 'error':
        return darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300';
      default:
        return darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sistema de Notificaciones
          </h2>
        </div>
        <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Envía notificaciones a todos los usuarios de la plataforma
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Send className="w-5 h-5" />
            Crear Nueva Notificación
          </h3>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Título de la notificación"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder="Escribe el mensaje de la notificación"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Notificación
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'info', label: 'Información', icon: Info, color: 'blue' },
                  { value: 'warning', label: 'Advertencia', icon: AlertTriangle, color: 'yellow' },
                  { value: 'success', label: 'Éxito', icon: CheckCircle, color: 'green' },
                  { value: 'error', label: 'Error', icon: XCircle, color: 'red' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        type === option.value
                          ? `border-${option.color}-500 bg-${option.color}-500/10`
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 text-${option.color}-500`} />
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                sending
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white flex items-center justify-center gap-2`}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Notificación
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Historial de Notificaciones ({notifications.length})
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay notificaciones enviadas
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className={`flex items-center gap-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span>
                            {new Date(notification.createdAt).toLocaleString('es-DO', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {notification.createdByEmail && (
                            <>
                              <span>•</span>
                              <span>Por: {notification.createdByEmail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-500 hover:bg-red-50'
                      } transition-colors`}
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPanel;
