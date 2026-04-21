import { Outlet, Link, useLocation } from 'react-router';
import { Home, Building2, FileText, MessageSquare, LogOut, Users, FileArchive, DollarSign, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useState, useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar cambio de tamaño de pantalla para cerrar menú móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Filtrar navegación según el rol del usuario
  const filteredNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'bg-purple-100 text-purple-700';
      case 'arrendador':
        return 'bg-blue-100 text-blue-700';
      case 'inquilino':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ======================= MÓVIL ======================= */}
      {/* Botón hamburguesa solo en móvil */}
      <div className={`fixed top-4 right-4 z-50 md:hidden`}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay oscuro solo en móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menú MÓVIL: aparece/desaparece según isMobileMenuOpen */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="font-semibold text-gray-900">RentManager</h1>
              <p className="text-xs text-gray-500">Gestión de propiedades</p>
            </div>
          </div>

          {/* Navigation móvil */}
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
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info móvil */}
          <div className="px-4 py-4 border-t border-gray-200">
            {user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================= DESKTOP ======================= */}
      {/* Menú DESKTOP: siempre visible en pantallas grandes */}
      <div className="hidden md:block md:w-64 md:bg-white md:border-r md:border-gray-200 md:z-40 flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo desktop */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="font-semibold text-gray-900">RentManager</h1>
              <p className="text-xs text-gray-500">Gestión de propiedades</p>
            </div>
          </div>

          {/* Navigation desktop */}
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
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info desktop */}
          <div className="px-4 py-4 border-t border-gray-200">
            {user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================= CONTENIDO PRINCIPAL ======================= */}
      <div className="flex-1 min-w-0">
        {/* Contenido principal */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}