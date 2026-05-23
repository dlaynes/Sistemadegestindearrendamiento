import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

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
      // Redirigir según el rol del usuario

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
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-card p-3 rounded-full">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RentManager</h1>
          <p className="text-primary-foreground">Sistema de Gestión de Arrendamiento</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-destructive-muted border border-destructive-muted rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-destructive-muted-foreground text-sm font-medium">Error</p>
                <p className="text-destructive-muted-foreground text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-primary-hover hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-3">Usuarios de Prueba:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                <span className="font-medium text-foreground">Administrador:</span>
                <code className="text-muted-foreground">admin@example.com / admin123</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                <span className="font-medium text-foreground">Arrendador:</span>
                <code className="text-muted-foreground">arrendador@example.com / landlord123</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-card rounded border border-border">
                <span className="font-medium text-foreground">Inquilino:</span>
                <code className="text-muted-foreground">inquilino@example.com / tenant123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}