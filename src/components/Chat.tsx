import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirebaseChat } from '../hooks/useFirebaseChat';
import ChatMessages from './Chat/ChatMessages';
import ChatInput from './Chat/ChatInput';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCurrentUserAdminStatus } from '../services/adminService';

interface ChatProps {
  darkMode?: boolean;
  onAuthRequired?: () => void;
}

const Chat: React.FC<ChatProps> = ({ darkMode = false, onAuthRequired }) => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const {
    messages,
    loading,
    unreadCount,
    sendMessage,
    loadMoreMessages,
    deleteMessage
  } = useFirebaseChat(isChatOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || user.email?.split('@')[0] || 'Usuario');
        setUserPhotoURL(user.photoURL);
        const adminStatus = await getCurrentUserAdminStatus();
        setIsAdmin(adminStatus);
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setUserPhotoURL(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (text: string) => {
    const success = await sendMessage(text, username, isAdmin, userPhotoURL);
    if (!success) {
      alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  const handleJoinChat = () => {
    setHasAcceptedRules(true);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (isAdmin) {
      const success = await deleteMessage(messageId);
      if (!success) {
        alert('Error al eliminar el mensaje. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-[60] flex items-center md:p-3 p-2"
      >
        <MessageCircle className="md:w-6 md:h-6 w-5 h-5" />
        {!isChatOpen && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full md:w-6 md:h-6 w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isChatOpen && (
        <div className={`fixed inset-x-4 bottom-20 md:bottom-20 md:right-4 md:left-auto md:w-96 shadow-lg rounded-lg z-[60] ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className={`flex justify-between items-center p-3 md:p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : ''}`}>
              Chat en tiempo real
            </h2>
            <button 
              onClick={() => setIsChatOpen(false)}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X className="w-5 h-5 md:w-5 md:h-5" />
            </button>
          </div>

          <div className="p-3 md:p-4">
            {!isAuthenticated ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Inicia sesión para usar el chat</p>
                <button
                  onClick={() => {
                    setIsChatOpen(false);
                    onAuthRequired?.();
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            ) : !hasAcceptedRules ? (
              <div className={`text-center py-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ¡Bienvenido al Chat!
                </h3>
                <p className="mb-6 text-sm">
                  Conéctate con otros estudiantes en tiempo real
                </p>
                <button
                  onClick={handleJoinChat}
                  className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Ingresar al Chat
                </button>
                <p className={`text-xs mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Al unirte, aceptas nuestras{' '}
                  <Link
                    to="/normas-comunidad"
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setIsChatOpen(false)}
                  >
                    normas de comunidad
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <ChatMessages
                  messages={messages}
                  darkMode={darkMode}
                  currentUsername={username}
                  onLoadMore={loadMoreMessages}
                  loading={loading}
                  isAdmin={isAdmin}
                  onDeleteMessage={handleDeleteMessage}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  darkMode={darkMode}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;