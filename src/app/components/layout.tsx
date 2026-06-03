import { Outlet, Link, useLocation } from 'react-router';
import {
  Home,
  Building2,
  MessageSquare,
  LogOut,
  Users,
  FileArchive,
  DollarSign,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';
import { useState, useEffect } from 'react';
import { Avatar } from './shared';
import { RoleBadge } from './shared/ui/role-badge';
import { AlertBell } from './shared/alerts/alert-bell';
import { cn } from './ui/utils';

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  const navigation = [
    { name: 'Dashboard', href: `/${user?.role}/dashboard`, icon: Home, roles: ['administrador', 'arrendador', 'inquilino'] },
    { name: 'Usuarios', href: `/${user?.role}/usuarios`, icon: Users, roles: ['administrador'] },
    { name: 'Propiedades', href: `/${user?.role}/propiedades`, icon: Building2, roles: ['arrendador', 'inquilino'] },
    { name: 'Contratos', href: `/${user?.role}/contratos`, icon: FileArchive, roles: ['arrendador', 'inquilino'] },
    { name: 'Pagos', href: `/${user?.role}/pagos`, icon: DollarSign, roles: ['arrendador', 'inquilino'] },
    { name: 'Mensajes', href: `/${user?.role}/mensajes`, icon: MessageSquare, roles: ['arrendador', 'inquilino'] },
    { name: 'Reportes', href: `/${user?.role}/reportes`, icon: MessageSquare, roles: ['administrador'] },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const filteredNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  const ThemeIcon = resolvedTheme === 'dark' ? Sun : Moon;

  const renderNavLink = (
    item: (typeof navigation)[number],
    onClick?: () => void,
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          active
            ? 'bg-primary-muted/40 text-primary'
            : 'text-muted-foreground hover:bg-surface hover:text-foreground',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary transition-opacity',
            active ? 'opacity-100' : 'opacity-0',
          )}
        />
        <Icon
          className={cn(
            'h-5 w-5 transition-colors',
            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
        <span>{item.name}</span>
      </Link>
    );
  };

  const renderSidebarBody = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elev-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-foreground">RentManager</h1>
          <p className="text-xs text-muted-foreground">Gestión de propiedades</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navegación
        </p>
        {filteredNavigation.map((item) => renderNavLink(item, onNavigate))}
      </nav>

      <div className="space-y-1 border-t border-border-subtle px-3 py-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <ThemeIcon className="h-5 w-5" />
          <span>{resolvedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>
        <div className="px-1 pt-1">
          <AlertBell />
        </div>

        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-md bg-surface px-3 py-2">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <RoleBadge role={user.role} size="sm" className="mt-0.5" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive-muted hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-card/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="rounded-md p-2 text-foreground transition-colors hover:bg-surface"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">RentManager</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertBell />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Cambiar tema"
          >
            <ThemeIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border-subtle bg-card shadow-elev-lg transition-transform duration-200 ease-out lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {renderSidebarBody(() => setIsMobileMenuOpen(false))}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border-subtle lg:bg-card">
        {renderSidebarBody()}
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
