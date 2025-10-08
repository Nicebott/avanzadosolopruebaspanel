import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit2, Save, X, Camera } from 'lucide-react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { Card } from './ui/Card';
import Button from './ui/Button';
import { getCurrentUserAdminStatus } from '../services/adminService';
import { updateUserNameInReviewsAndForums } from '../services/userStatsService';

interface UserProfileProps {
  darkMode: boolean;
}

interface ButtonPropsExtended extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await getCurrentUserAdminStatus();
      setIsAdmin(adminStatus);
    };
    checkAdminStatus();
  }, []);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    setIsLoading(true);
    try {
      if (auth.currentUser) {
        const oldName = auth.currentUser.displayName;
        const newName = displayName.trim();

        await updateProfile(auth.currentUser, {
          displayName: newName,
        });

        await auth.currentUser.reload();

        if (oldName !== newName) {
          await updateUserNameInReviewsAndForums(auth.currentUser.uid, newName);
        }

        toast.success('Perfil actualizado exitosamente');
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(auth.currentUser?.displayName || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Mi Perfil
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold ${
                    darkMode
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  } shadow-lg`}
                >
                  {auth.currentUser?.displayName
                    ? getInitials(auth.currentUser.displayName)
                    : <User size={48} />
                  }
                </div>
                <button
                  className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  } shadow-lg border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  title="Cambiar foto (próximamente)"
                >
                  <Camera size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
              </div>

              <h2 className={`mt-4 text-xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {auth.currentUser?.displayName || 'Usuario'}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {auth.currentUser?.email}
              </p>

              {isAdmin && (
                <div className="mt-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-2">
                  <Shield size={14} className="text-white" />
                  <span className="text-xs font-semibold text-white">Administrador</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Información Personal
              </h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  <span className="ml-2">Editar</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                    >
                    <X size={16} />
                    <span className="ml-2">Cancelar</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    >
                    <Save size={16} />
                    <span className="ml-2">Guardar</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User size={16} />
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Ingresa tu nombre"
                    disabled={isLoading}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  }`}>
                    {auth.currentUser?.displayName || 'No especificado'}
                  </div>
                )}
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Mail size={16} />
                  Correo Electrónico
                </label>
                <div className={`px-4 py-2.5 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'
                }`}>
                  {auth.currentUser?.email}
                  <span className={`ml-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    (no editable)
                  </span>
                </div>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Calendar size={16} />
                  Fecha de Registro
                </label>
                <div className={`px-4 py-2.5 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                }`}>
                  {formatDate(auth.currentUser?.metadata.creationTime || null)}
                </div>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Calendar size={16} />
                  Último Acceso
                </label>
                <div className={`px-4 py-2.5 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                }`}>
                  {formatDate(auth.currentUser?.metadata.lastSignInTime || null)}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
