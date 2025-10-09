import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, Info, AlertTriangle, CheckCircle, XCircle, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createNotification, deleteNotification, createUserNotification, getUserIdByDisplayName, searchUsersByDisplayName } from '../services/notificationService';
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
  const [targetUser, setTargetUser] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [searchResults, setSearchResults] = useState<Array<{id: string, displayName: string, email: string}>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (targetUser.trim().length > 0 && !sendToAll) {
        const results = await searchUsersByDisplayName(targetUser);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [targetUser, sendToAll]);

  const handleSelectUser = (displayName: string) => {
    setTargetUser(displayName);
    setShowDropdown(false);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!sendToAll && !targetUser.trim()) {
      toast.error('Por favor ingresa el nombre del usuario');
      return;
    }

    setSending(true);
    let success = false;

    if (sendToAll) {
      success = await createNotification(title, message, type);
    } else {
      const userId = await getUserIdByDisplayName(targetUser.trim());
      if (!userId) {
        toast.error(`Usuario "${targetUser}" no encontrado`);
        setSending(false);
        return;
      }
      success = await createUserNotification(userId, title, message, type);
    }

    if (success) {
      toast.success(sendToAll ? 'Notificación enviada a todos los usuarios' : `Notificación enviada a ${targetUser}`);
      setTitle('');
      setMessage('');
      setType('info');
      setTargetUser('');
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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Bell className={`w-6 sm:w-8 h-6 sm:h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sistema de Notificaciones
          </h2>
        </div>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Envía notificaciones a todos los usuarios o a un usuario específico
        </p>
        <div className={`mt-3 p-3 rounded-lg text-xs sm:text-sm ${
          darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
            💡 <strong>Tip:</strong> Para enviar una notificación a un usuario específico, selecciona "Usuario Específico" e ingresa el nombre exacto como aparece en su perfil.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 sm:p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Send className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="truncate">Crear Nueva Notificación</span>
          </h3>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Destinatario
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSendToAll(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                    sendToAll
                      ? 'border-blue-500 bg-blue-500/10'
                      : darkMode
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${
                    sendToAll ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Todos
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSendToAll(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                    !sendToAll
                      ? 'border-blue-500 bg-blue-500/10'
                      : darkMode
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <User className={`w-4 h-4 ${
                    !sendToAll ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Usuario Específico
                  </span>
                </button>
              </div>
              {!sendToAll && (
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={targetUser}
                      onChange={(e) => setTargetUser(e.target.value)}
                      onFocus={() => targetUser.length > 0 && setShowDropdown(searchResults.length > 0)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Buscar usuario por nombre..."
                      required={!sendToAll}
                      autoComplete="off"
                    />
                    <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <AnimatePresence>
                    {showDropdown && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                      >
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleSelectUser(user.displayName)}
                            className={`w-full px-3 py-2 text-left hover:bg-opacity-10 transition-colors ${
                              darkMode ? 'hover:bg-white' : 'hover:bg-gray-900'
                            }`}
                          >
                            <div className={`font-medium text-sm ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {user.displayName}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {user.email}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Título de la notificación"
                required
              />
            </div>

            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder="Escribe el mensaje de la notificación"
                required
              />
            </div>

            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Notificación
              </label>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
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
                      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 transition-all ${
                        type === option.value
                          ? `border-${option.color}-500 bg-${option.color}-500/10`
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 text-${option.color}-500 flex-shrink-0`} />
                      <span className={`text-xs sm:text-sm font-medium truncate ${
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
              className={`w-full px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                sending
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white flex items-center justify-center gap-2`}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white"></div>
                  <span className="truncate">Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="truncate">Enviar Notificación</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 sm:p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="hidden sm:inline">Historial de Notificaciones</span>
            <span className="sm:hidden">Historial</span> ({notifications.length})
          </h3>

          <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className={`text-center py-6 sm:py-8 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay notificaciones enviadas
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 rounded-lg border ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-xs sm:text-sm mb-1.5 sm:mb-2 leading-snug ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[10px] sm:text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span className="truncate">
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
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate">Por: {notification.createdByEmail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-500 hover:bg-red-50'
                      } transition-colors`}
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
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
