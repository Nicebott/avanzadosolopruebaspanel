import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPageProps {
  darkMode: boolean;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </button>

          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl p-8 space-y-6`}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={32} />
              <h1 className="text-3xl font-bold">Política de Privacidad</h1>
            </div>

            <section>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                En Nicebott, respetamos tu privacidad y estamos comprometidos con la protección de
                tus datos personales. Esta política explica qué información recopilamos y cómo la utilizamos.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Información de Registro</h4>
                  <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Correo electrónico</li>
                    <li>Nombre de usuario</li>
                    <li>Contraseña (encriptada)</li>
                    <li>Fecha de registro</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información de Uso</h4>
                  <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Reseñas y calificaciones de profesores</li>
                    <li>Publicaciones y comentarios en el foro</li>
                    <li>Mensajes en el chat</li>
                    <li>Historial de búsquedas y navegación</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información Técnica</h4>
                  <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Dirección IP</li>
                    <li>Tipo de navegador y dispositivo</li>
                    <li>Sistema operativo</li>
                    <li>Cookies y tecnologías similares</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Cómo Usamos tu Información</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Utilizamos la información recopilada para:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Autenticar tu identidad y proteger tu cuenta</li>
                <li>Personalizar tu experiencia en la plataforma</li>
                <li>Moderar contenido y prevenir abusos</li>
                <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                <li>Comunicarnos contigo sobre actualizaciones o cambios importantes</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Base Legal para el Procesamiento</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Procesamos tus datos personales bajo las siguientes bases legales:
              </p>
              <ul className={`list-disc list-inside space-y-2 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><strong>Consentimiento:</strong> Al registrarte y usar nuestros servicios</li>
                <li><strong>Ejecución de contrato:</strong> Para proporcionar los servicios solicitados</li>
                <li><strong>Interés legítimo:</strong> Para mejorar y proteger nuestros servicios</li>
                <li><strong>Obligación legal:</strong> Cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Compartir Información</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                No vendemos tu información personal. Podemos compartir información limitada con:
              </p>
              <ul className={`list-disc list-inside space-y-2 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><strong>Proveedores de servicios:</strong> Firebase/Google para autenticación y almacenamiento</li>
                <li><strong>Usuarios públicos:</strong> Tu nombre de usuario y contenido público (reseñas, foro)</li>
                <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger derechos</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Seguridad de los Datos</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Implementamos medidas de seguridad para proteger tus datos:
              </p>
              <ul className={`list-disc list-inside space-y-2 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Encriptación de contraseñas mediante Firebase Authentication</li>
                <li>Conexiones seguras HTTPS</li>
                <li>Acceso restringido a datos personales</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Copias de seguridad regulares</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Retención de Datos</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Conservamos tu información mientras tu cuenta esté activa o según sea necesario
                para proporcionar servicios. Puedes solicitar la eliminación de tu cuenta y datos
                asociados en cualquier momento.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Tus Derechos</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Tienes derecho a:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><strong>Acceder</strong> a tus datos personales</li>
                <li><strong>Rectificar</strong> información incorrecta</li>
                <li><strong>Eliminar</strong> tu cuenta y datos asociados</li>
                <li><strong>Exportar</strong> tus datos en formato portable</li>
                <li><strong>Oponerte</strong> al procesamiento de tus datos</li>
                <li><strong>Limitar</strong> el procesamiento en ciertas circunstancias</li>
                <li><strong>Retirar</strong> tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Cookies</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Las cookies
                nos ayudan a recordar tus preferencias (como el modo oscuro) y proporcionar funciones
                esenciales del servicio. Puedes configurar tu navegador para rechazar cookies, aunque
                esto puede afectar la funcionalidad.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Privacidad de Menores</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Nuestros servicios están dirigidos a estudiantes universitarios mayores de 18 años.
                No recopilamos intencionalmente información de menores de edad.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">10. Cambios a esta Política</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios
                significativos mediante un aviso en la plataforma o por correo electrónico.
                Te recomendamos revisar esta política regularmente.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">11. Transferencia Internacional</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Tus datos pueden ser transferidos y almacenados en servidores ubicados fuera de
                República Dominicana. Utilizamos proveedores que cumplen con estándares internacionales
                de protección de datos.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">12. Contacto</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos,
                puedes contactarnos a través del chat de soporte en la plataforma.
              </p>
            </section>
          </div>

          <button
            onClick={() => navigate('/')}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
