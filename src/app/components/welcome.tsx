import { useNavigate } from 'react-router';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Sistema de Gestión de Arrendamientos
          </h1>
          <p className="welcome-subtitle">
            Una plataforma integral para gestionar el ciclo completo de alquileres
          </p>
          
          <div className="welcome-features">
            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Panel Unificado</h3>
              <p className="welcome-feature-desc">
                Acceda a todas las funcionalidades desde una sola plataforma segura
              </p>
            </div>

            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Múltiples Roles</h3>
              <p className="welcome-feature-desc">
                Funcionalidades personalizadas para administradores, propietarios e inquilinos
              </p>
            </div>

            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Gestión de Propiedades</h3>
              <p className="welcome-feature-desc">
                Administrar inventario, contratos y pagos de manera centralizada
              </p>
            </div>

            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Seguridad Avanzada</h3>
              <p className="welcome-feature-desc">
                Autenticación segura y protección de datos
              </p>
            </div>

            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Monitoreo en Tiempo Real</h3>
              <p className="welcome-feature-desc">
                Seguimiento instantáneo de contratos y estados de pago
              </p>
            </div>

            <div className="welcome-feature-card">
              <div className="welcome-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 className="welcome-feature-title">Informes y Reportes</h3>
              <p className="welcome-feature-desc">
                Obtenga estadísticas y reportes para tomar decisiones informadas
              </p>
            </div>
          </div>

          <button
            className="welcome-btn primary"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>

          <div className="welcome-footer">
            <p>
              ¿Tiene preguntas o necesita asistencia? Contáctanos:
            </p>
            <form className="welcome-contact-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Su correo electrónico"
                className="contact-input"
              />
              <button
                type="submit"
                className="welcome-btn secondary"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Welcome };
