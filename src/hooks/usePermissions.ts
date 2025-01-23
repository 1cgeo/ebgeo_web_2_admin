import { useAuth } from '@/context/AuthContext';

interface Permission {
  action: string;
  subject: string;
}

export const usePermissions = () => {
  const { user } = useAuth();
  
  const check = (): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    
    // Implementar lógica específica de permissões aqui
    return false;
  };

  const checkAny = (permissions: Permission[]): boolean => {
    return permissions.some(check);
  };

  const checkAll = (permissions: Permission[]): boolean => {
    return permissions.every(check);
  };

  return {
    check,
    checkAny,
    checkAll
  };
};
