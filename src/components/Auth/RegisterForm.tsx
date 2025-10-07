import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AuthInput from './AuthInput';

interface RegisterFormProps {
  darkMode: boolean;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ darkMode, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      toast.success('¡Cuenta creada exitosamente!');
      onClose();
    } catch (error: any) {
      toast.error('Error al crear la cuenta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AuthInput
        icon={User}
        type="text"
        placeholder="Nombre completo"
        value={name}
        onChange={setName}
        darkMode={darkMode}
        required
      />

      <AuthInput
        icon={Mail}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={setEmail}
        darkMode={darkMode}
        required
      />

      <AuthInput
        icon={Lock}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={setPassword}
        darkMode={darkMode}
        required
      />

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="terms"
          className={`text-sm cursor-pointer select-none ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Acepto los{' '}
          <Link
            to="/terms"
            onClick={onClose}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Términos y Condiciones
          </Link>
          {' '}y la{' '}
          <Link
            to="/privacy"
            onClick={onClose}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Política de Privacidad
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !acceptedTerms}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          loading || !acceptedTerms
            ? 'bg-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <UserPlus size={18} />
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </motion.form>
  );
};

export default RegisterForm;