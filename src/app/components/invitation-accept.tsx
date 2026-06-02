import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Building2, KeyRound, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useServices } from '../services';
import { Button } from './ui/button';
import { ForceLightTheme } from '../contexts/theme-context';
import { Spinner } from './shared/ui/spinner';

export function InvitationAccept() {
  const { auth: authService } = useServices();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Enlace de invitación inválido o incompleto.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Enlace de invitación inválido o incompleto.');
      return;
    }
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.acceptInvitation(token, name.trim(), password);
      toast.success('Cuenta creada correctamente');
      navigate('/login');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la cuenta. Intenta de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForceLightTheme>
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside
          aria-hidden="true"
          className="relative hidden overflow-hidden bg-primary-muted lg:flex"
        >
          <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_20%,theme(colors.primary.DEFAULT/.25),transparent_60%),radial-gradient(60%_60%_at_80%_80%,theme(colors.primary.muted.foreground/.35),transparent_60%)]" />
          <div className="relative z-10 flex flex-col justify-between p-12">
            <div className="flex items-center gap-3">
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
                Acepta tu invitación y crea tu cuenta.
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Completa tus datos para empezar a gestionar tus contratos y pagos.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RentManager. Todos los derechos reservados.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-12 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-sm">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-foreground">RentManager</p>
            </div>

            <h1 className="text-h1 font-semibold tracking-tight text-foreground">
              Aceptar Invitación
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Completa tus datos para crear tu cuenta de inquilino.
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="token"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Código de Invitación
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="token"
                    type="text"
                    value={token}
                    readOnly
                    className="h-11 w-full rounded-lg border border-input bg-muted pl-10 pr-4 text-sm text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    aria-invalid={!!error}
                    aria-describedby={error ? 'invitation-error' : undefined}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    placeholder="Tu nombre completo"
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
                    aria-describedby={error ? 'invitation-error' : undefined}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-invalid={!!error}
                    aria-describedby={error ? 'invitation-error' : undefined}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    placeholder="Repite la contraseña"
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
                    <Spinner size="sm" label="Creando cuenta" />
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Aceptar y Crear Cuenta
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
    </ForceLightTheme>
  );
}
