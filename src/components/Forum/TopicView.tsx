import React, { useState, useRef, useEffect } from 'react';
import { Topic, Message } from '../../types/forum';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, ArrowLeft, User, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebase';
import { deleteTopic, deleteMessage } from '../../services/forumService';
import { getCurrentUserAdminStatus } from '../../services/adminService';
import toast from 'react-hot-toast';
import { getInitials, getAvatarColor } from '../../utils/avatarUtils';

interface TopicViewProps {
  topic: Topic;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  darkMode: boolean;
}

const TopicView: React.FC<TopicViewProps> = ({
  topic,
  messages,
  onBack,
  onSendMessage,
  darkMode
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await getCurrentUserAdminStatus();
      setIsAdmin(adminStatus);
    };
    
    if (auth.currentUser) {
      checkAdminStatus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tema? Esta acción no se puede deshacer.')) {
      const result = await deleteTopic(topic.id);
      
      if (result.success) {
        toast.success('Tema eliminado exitosamente');
        onBack();
      } else {
        toast.error(result.error || 'Error al eliminar el tema');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      const result = await deleteMessage(topic.id, messageId);
      
      if (result.success) {
        toast.success('Mensaje eliminado exitosamente');
        // Refresh messages by calling onBack and then navigating back
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al eliminar el mensaje');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-3 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base ${
            darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          } transition-all duration-200`}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Volver a los temas</span>
        </button>

        {auth.currentUser?.uid === topic.creador && (
          <button
            onClick={handleDelete}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base ${
              darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            } transition-colors duration-200`}
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">Eliminar tema</span>
            <span className="xs:hidden">Eliminar</span>
          </button>
        )}

        {isAdmin && auth.currentUser?.uid !== topic.creador && (
          <button
            onClick={handleDelete}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base ${
              darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            } transition-colors duration-200`}
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">Eliminar (Admin)</span>
            <span className="xs:hidden">Eliminar</span>
          </button>
        )}
      </div>

      <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-lg`}>
        <h2 className={`text-base sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} break-words`}>
          {topic.titulo}
        </h2>
        <p className={`mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} break-words`}>
          {topic.descripcion}
        </p>
        <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold ${
              getAvatarColor(topic.creadorNombre)
            }`}>
              {getInitials(topic.creadorNombre)}
            </div>
            <span className="font-medium truncate max-w-[100px] sm:max-w-none">{topic.creadorNombre}</span>
            {topic.isAdmin && (
              <span className={`inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold ${
                darkMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
              }`}>
                <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                ADMIN
              </span>
            )}
          </div>
          <span className="hidden sm:inline">·</span>
          <span className="truncate">
            {formatDistanceToNow(topic.creadoEn.toDate(), { addSuffix: true, locale: es })}
          </span>
        </div>
      </div>

      <div className={`rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-lg overflow-hidden`}>
        <div className="h-[350px] sm:h-[400px] md:h-[500px] overflow-y-auto p-2 sm:p-3 md:p-6">
          {messages.length === 0 ? (
            <div className={`text-center py-6 sm:py-8 text-xs sm:text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No hay respuestas aún. ¡Sé el primero en responder!
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 md:space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    } rounded-lg p-2 sm:p-3 md:p-4`}
                  >
                    <div className="flex items-start gap-1.5 sm:gap-2 md:gap-4 group">
                      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-sm shadow-md ${
                        getAvatarColor(message.autorNombre)
                      }`}>
                        {getInitials(message.autorNombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start sm:items-center justify-between mb-0.5 sm:mb-1 gap-1 sm:gap-2">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <span className={`font-medium text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-none ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {message.autorNombre}
                            </span>
                            {message.isAdmin && (
                              <span className={`inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] md:text-xs font-bold ${
                                darkMode
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/50'
                                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                              }`}>
                                <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                                ADMIN
                              </span>
                            )}
                            {(isAdmin || message.autor === auth.currentUser?.uid) && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className={`opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-0.5 sm:p-1 rounded ${
                                  darkMode
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600'
                                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-200'
                                }`}
                                title={isAdmin && message.autor !== auth.currentUser?.uid ? "Eliminar mensaje (Admin)" : "Eliminar mensaje"}
                              >
                                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                              </button>
                            )}
                          </div>
                          <span className={`text-[10px] sm:text-xs md:text-sm flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDistanceToNow(message.creadoEn.toDate(), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {message.contenido}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`p-2 sm:p-3 md:p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="flex gap-1.5 sm:gap-2 md:gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className={`flex-grow px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`flex-shrink-0 px-2.5 sm:px-3 md:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 ${
                newMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-400'
              } transition-all duration-200 disabled:cursor-not-allowed`}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline font-medium text-xs md:text-sm">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopicView;
