import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Building2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { ForceLightTheme } from '../contexts/theme-context';
import { Spinner } from './shared/ui/spinner';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        navigate(`/${user.role.toLowerCase()}/dashboard`);
      }
    } catch {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForceLightTheme>
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <aside
          aria-hidden="true"
          className="relative hidden overflow-hidden bg-primary-muted lg:flex"
        >
          <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_20%,theme(colors.primary.DEFAULT/.25),transparent_60%),radial-gradient(60%_60%_at_80%_80%,theme(colors.primary.muted.foreground/.35),transparent_60%)]" />
          <div className="relative z-10 flex flex-col justify-between p-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">RentManager</p>
                <p className="text-xs text-muted-foreground">Sistema de Gestión de Arrendamiento</p>
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="text-display font-bold tracking-tight text-foreground">
                Una sola plataforma para todo tu portafolio.
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Propiedades, contratos, pagos y mensajes en un mismo lugar, con
                visibilidad y permisos por rol.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RentManager. Todos los derechos reservados.
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-6 py-12 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-sm">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-foreground">RentManager</p>
            </div>

            <h1 className="text-h1 font-semibold tracking-tight text-foreground">
              Iniciar Sesión
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu panel.
            </p>

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-6 flex items-start gap-3 rounded-lg border border-destructive-muted bg-destructive-muted/60 p-4"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={(f) => { handleSubmit(f); return false; } } className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!!error}
                    aria-describedby={error ? 'login-error' : undefined}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-invalid={!!error}
                    aria-describedby={error ? 'login-error' : undefined}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" label="Iniciando sesión" />
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 rounded-lg border border-border-subtle bg-surface p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Usuarios de Prueba:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded border border-border-subtle bg-card p-2">
                  <span className="font-medium text-foreground">Administrador:</span>
                  <code className="text-muted-foreground">admin@example.com / admin123</code>
                </div>
                <div className="flex items-center justify-between rounded border border-border-subtle bg-card p-2">
                  <span className="font-medium text-foreground">Arrendador:</span>
                  <code className="text-muted-foreground">arrendador@example.com / landlord123</code>
                </div>
                <div className="flex items-center justify-between rounded border border-border-subtle bg-card p-2">
                  <span className="font-medium text-foreground">Inquilino:</span>
                  <code className="text-muted-foreground">inquilino@example.com / tenant123</code>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ForceLightTheme>
  );
}
