import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, MessageSquare, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Users, Eye, Flag, Lock } from 'lucide-react';

interface CommunityGuidelinesPageProps {
  darkMode: boolean;
}

const CommunityGuidelinesPage: React.FC<CommunityGuidelinesPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();

  const guidelines = [
    {
      icon: Heart,
      title: 'Respeto y Cortesía',
      description: 'Trata a todos los miembros con respeto y consideración. No se tolerarán insultos, acoso o discriminación de ningún tipo.',
      examples: {
        good: ['Usar lenguaje respetuoso', 'Ser amable incluso en desacuerdos', 'Valorar las opiniones diferentes'],
        bad: ['Insultos personales', 'Lenguaje ofensivo', 'Ataques personales']
      }
    },
    {
      icon: MessageSquare,
      title: 'Contenido Relevante',
      description: 'Mantén las conversaciones relacionadas con temas académicos y experiencias universitarias relevantes.',
      examples: {
        good: ['Discusiones sobre cursos', 'Experiencias con profesores', 'Consejos académicos'],
        bad: ['Spam o publicidad', 'Contenido fuera de tema', 'Promoción comercial']
      }
    },
    {
      icon: Shield,
      title: 'Información Veraz',
      description: 'Comparte información precisa y honesta. No difundas rumores o información falsa sobre profesores o cursos.',
      examples: {
        good: ['Opiniones basadas en experiencias reales', 'Información verificable', 'Críticas constructivas'],
        bad: ['Rumores sin fundamento', 'Información falsa', 'Acusaciones sin evidencia']
      }
    },
    {
      icon: Lock,
      title: 'Privacidad',
      description: 'No compartas información personal de otros sin su consentimiento. Respeta la privacidad de todos.',
      examples: {
        good: ['Proteger datos personales', 'Respetar la confidencialidad', 'Pedir permiso antes de compartir'],
        bad: ['Compartir datos personales', 'Doxing', 'Revelar información privada']
      }
    },
    {
      icon: Eye,
      title: 'Contenido Apropiado',
      description: 'Mantén el contenido apropiado para un ambiente académico. No publiques material explícito u ofensivo.',
      examples: {
        good: ['Lenguaje profesional', 'Contenido académico', 'Discusiones constructivas'],
        bad: ['Contenido explícito', 'Material ofensivo', 'Lenguaje vulgar excesivo']
      }
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Fomenta un ambiente de ayuda mutua y colaboración entre estudiantes.',
      examples: {
        good: ['Ayudar a otros estudiantes', 'Compartir recursos útiles', 'Responder preguntas'],
        bad: ['Negarse a ayudar', 'Gatekeeping de información', 'Competencia tóxica']
      }
    }
  ];

  const consequences = [
    {
      severity: 'Advertencia',
      color: 'yellow',
      description: 'Primera infracción menor. Se te notificará y se te pedirá que corrijas tu comportamiento.',
      icon: AlertTriangle
    },
    {
      severity: 'Suspensión Temporal',
      color: 'orange',
      description: 'Infracciones repetidas o moderadas. Tu cuenta será suspendida por un período determinado.',
      icon: XCircle
    },
    {
      severity: 'Suspensión Permanente',
      color: 'red',
      description: 'Infracciones graves o repetidas después de advertencias. Tu cuenta será eliminada permanentemente.',
      icon: XCircle
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 mb-6 rounded-lg ${
            darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          } transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg p-8 mb-8`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Normas de la Comunidad
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Guías para mantener un ambiente positivo y respetuoso
              </p>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border-l-4 p-4 rounded-r-lg mb-8`}>
            <p className={`${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              <strong>Importante:</strong> Estas normas aplican a todos los espacios de la plataforma, incluyendo el chat en tiempo real, foros de discusión y reseñas de profesores.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            return (
              <div
                key={index}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-md p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                  } flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {guideline.title}
                    </h2>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {guideline.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${darkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                            Comportamiento Aceptable
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {guideline.examples.good.map((example, i) => (
                            <li key={i} className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={`${darkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                            Comportamiento Inaceptable
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {guideline.examples.bad.map((example, i) => (
                            <li key={i} className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-lg p-8 mb-8`}>
          <div className="flex items-center gap-3 mb-6">
            <Flag className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Consecuencias por Infracciones
            </h2>
          </div>

          <div className="space-y-4">
            {consequences.map((consequence, index) => {
              const Icon = consequence.icon;
              const colorClasses = {
                yellow: {
                  bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
                  border: darkMode ? 'border-yellow-700' : 'border-yellow-300',
                  text: darkMode ? 'text-yellow-400' : 'text-yellow-700',
                  icon: 'text-yellow-500'
                },
                orange: {
                  bg: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
                  border: darkMode ? 'border-orange-700' : 'border-orange-300',
                  text: darkMode ? 'text-orange-400' : 'text-orange-700',
                  icon: 'text-orange-500'
                },
                red: {
                  bg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
                  border: darkMode ? 'border-red-700' : 'border-red-300',
                  text: darkMode ? 'text-red-400' : 'text-red-700',
                  icon: 'text-red-500'
                }
              }[consequence.color];

              return (
                <div
                  key={index}
                  className={`${colorClasses.bg} ${colorClasses.border} border-l-4 rounded-r-lg p-4 flex items-start gap-4`}
                >
                  <Icon className={`w-6 h-6 ${colorClasses.icon} flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${colorClasses.text}`}>
                      {consequence.severity}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {consequence.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} rounded-xl border shadow-lg p-8`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ¿Cómo Reportar una Infracción?
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Si observas comportamiento que viola estas normas, puedes reportarlo de las siguientes maneras:
          </p>
          <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5`}>1</span>
              <span>Usa el botón de reporte disponible en cada mensaje o publicación</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5`}>2</span>
              <span>Contacta directamente a los administradores a través del sistema de mensajes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5`}>3</span>
              <span>Envía un correo a support@ratemyprofessor.com con detalles de la infracción</span>
            </li>
          </ul>
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4 mt-6`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Nota:</strong> Todos los reportes se revisan de manera confidencial. No se tomará ninguna represalia contra usuarios que reporten infracciones de buena fe.
            </p>
          </div>
        </div>

        <div className={`mt-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelinesPage;
