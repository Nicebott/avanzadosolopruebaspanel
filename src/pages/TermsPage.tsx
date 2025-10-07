import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsPageProps {
  darkMode: boolean;
}

const TermsPage: React.FC<TermsPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();

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
              <FileText className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={32} />
              <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
            </div>

            <section>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Bienvenido a la plataforma de Programación Docente UASD. Al utilizar nuestros servicios,
                aceptas los siguientes términos y condiciones.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Uso del Servicio</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Esta plataforma proporciona información sobre la programación docente de la Universidad
                Autónoma de Santo Domingo (UASD). El servicio está diseñado para uso académico y educativo.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Registro de Cuenta</h3>
              <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Debes proporcionar información precisa y actualizada al registrarte.</li>
                <li>Eres responsable de mantener la confidencialidad de tu cuenta.</li>
                <li>Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</li>
                <li>No puedes compartir tu cuenta con terceros.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Contenido de Usuario</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Al publicar reseñas, comentarios o participar en el foro, garantizas que:
              </p>
              <ul className={`list-disc list-inside space-y-2 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>El contenido es original y no infringe derechos de terceros.</li>
                <li>No contiene material ofensivo, difamatorio o ilegal.</li>
                <li>Respeta las normas de convivencia y respeto mutuo.</li>
                <li>Es veraz y basado en tu experiencia personal.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Propiedad Intelectual</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Todo el contenido de la plataforma, incluyendo diseño, código, textos y gráficos,
                está protegido por derechos de autor y es propiedad de Nicebott o sus licenciantes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Conducta Prohibida</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Está estrictamente prohibido:
              </p>
              <ul className={`list-disc list-inside space-y-2 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Publicar contenido falso, engañoso o difamatorio.</li>
                <li>Acosar, intimidar o amenazar a otros usuarios.</li>
                <li>Intentar acceder sin autorización a cuentas de otros usuarios.</li>
                <li>Utilizar la plataforma para actividades ilegales.</li>
                <li>Realizar scraping o recopilación automatizada de datos.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Moderación de Contenido</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Nos reservamos el derecho de revisar, moderar o eliminar cualquier contenido que
                viole estos términos o que consideremos inapropiado. También podemos suspender o
                terminar cuentas que incumplan estas normas.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Disponibilidad del Servicio</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                No garantizamos que el servicio esté disponible de forma ininterrumpida. Podemos
                realizar mantenimiento, actualizaciones o modificaciones sin previo aviso.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Limitación de Responsabilidad</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                La información proporcionada en la plataforma es con fines informativos. No nos
                hacemos responsables de decisiones tomadas basándose en esta información. La
                programación docente oficial debe ser consultada directamente con la UASD.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Modificaciones</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Podemos actualizar estos términos en cualquier momento. Los cambios significativos
                serán notificados a través de la plataforma. El uso continuo del servicio después
                de las modificaciones constituye la aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">10. Ley Aplicable</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa
                será resuelta en los tribunales competentes del país.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">11. Contacto</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Si tienes preguntas sobre estos términos, puedes contactarnos a través del chat
                de soporte en la plataforma.
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

export default TermsPage;
