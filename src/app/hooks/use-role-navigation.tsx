import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';

export function useRoleNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateWithRole = (path: string) => {
    if (!user) return;
    
    // Si la ruta ya empieza con el rol, navegar directamente
    if (path.startsWith(`/${user.role}`)) {
      navigate(path);
      return;
    }
    
    // Si la ruta empieza con /, agregar el prefijo del rol
    if (path.startsWith('/')) {
      navigate(`/${user.role}${path}`);
      return;
    }
    
    // Si no empieza con /, agregar tanto el rol como la barra
    navigate(`/${user.role}/${path}`);
  };

  return navigateWithRole;
}
