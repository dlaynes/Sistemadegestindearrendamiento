import { useNavigate } from 'react-router';
import {
  Building2,
  Users,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { ForceLightTheme } from '../contexts/theme-context';

const features = [
  {
    icon: Building2,
    title: 'Panel Unificado',
    description:
      'Acceda a todas las funcionalidades desde una sola plataforma segura.',
  },
  {
    icon: Users,
    title: 'Múltiples Roles',
    description:
      'Funcionalidades personalizadas para administradores, propietarios e inquilinos.',
  },
  {
    icon: FileText,
    title: 'Gestión de Propiedades',
    description:
      'Administrar inventario, contratos y pagos de manera centralizada.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguro y Confiable',
    description:
      'Autenticación robusta y aislamiento de datos por rol y por propietario.',
  },
];

function Welcome() {
  const navigate = useNavigate();

  return (
    <ForceLightTheme>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Brand-tinted radial background using only design tokens. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.primary.muted.DEFAULT)_0%,theme(colors.background)_70%)]"
        />

        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">RentManager</p>
                <p className="text-xs text-muted-foreground">Gestión de Arrendamientos</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elev-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Plataforma integral
            </span>
            <h1 className="text-display font-bold tracking-tight text-foreground sm:text-[2.75rem]">
              Sistema de Gestión de Arrendamientos
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Una plataforma integral para gestionar el ciclo completo de alquileres,
              desde la publicación de propiedades hasta el cobro mensual.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                Comenzar
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Ya tengo cuenta
              </Button>
            </div>

            <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border-subtle bg-card p-6 text-left shadow-elev-xs transition-all hover:-translate-y-0.5 hover:shadow-elev-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-primary ring-1 ring-inset ring-border-subtle">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </main>

          <footer className="border-t border-border-subtle pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} RentManager. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    </ForceLightTheme>
  );
}

export default Welcome;
