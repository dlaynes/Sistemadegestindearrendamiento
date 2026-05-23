import { Outlet, Link, useLocation } from 'react-router';
import { Home, Building2, FileText, MessageSquare, LogOut, Users, FileArchive, DollarSign, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';
import { useState, useEffect } from 'react';

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
    { name: 'Reportes', href: `/${user?.role}/reportes`, icon: FileText, roles: ['administrador'] },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const filteredNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'bg-info-muted text-info-muted-foreground';
      case 'arrendador':
        return 'bg-primary-muted text-primary-muted-foreground';
      case 'inquilino':
        return 'bg-success-muted text-success-muted-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'arrendador':
        return 'Arrendador';
      case 'inquilino':
        return 'Inquilino';
      default:
        return role;
    }
  };

  const ThemeIcon = resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:hidden z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <span className="font-semibold text-foreground">RentManager</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Cambiar tema"
        >
          <ThemeIcon className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-semibold text-foreground">RentManager</h1>
              <p className="text-xs text-muted-foreground">Gestión de propiedades</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-muted text-primary-muted-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-border">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors mb-2"
            >
              <ThemeIcon className="w-5 h-5" />
              <span className="font-medium">{resolvedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            {user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block md:w-64 md:bg-card md:border-r md:border-border md:z-40 flex-shrink-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-semibold text-foreground">RentManager</h1>
              <p className="text-xs text-muted-foreground">Gestión de propiedades</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-muted text-primary-muted-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-border">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors mb-2"
            >
              <ThemeIcon className="w-5 h-5" />
              <span className="font-medium">{resolvedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            {user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 pt-16 md:pt-0">
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
