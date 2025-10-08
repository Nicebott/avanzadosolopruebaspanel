import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

interface ProfileDropdownProps {
  darkMode: boolean;
  onClose: () => void;
  onProfileClick: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ darkMode, onClose, onProfileClick }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada exitosamente');
      onClose();
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  return (
    <div
      className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl py-2 z-50 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {auth.currentUser?.displayName || 'Usuario'}
            </p>
            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {auth.currentUser?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="py-1">
        <button
          onClick={handleProfileClick}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            darkMode
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings size={18} />
          <span>Mi Perfil</span>
        </button>

        <div className={`my-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

        <button
          onClick={handleSignOut}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            darkMode
              ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
