import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface UseRoleAccessReturn {
  isAdmin: boolean;
  isUser: boolean;
  role: string | null;
  hasAccess: (requiredRole: string | string[]) => boolean;
  isLoading: boolean;
}

export const useRoleAccess = (): UseRoleAccessReturn => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = Cookies.get('role');
    setRole(userRole || null);
    setIsLoading(false);
  }, []);

  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  const hasAccess = (requiredRole: string | string[]): boolean => {
    if (!role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    
    return role === requiredRole;
  };

  return {
    isAdmin,
    isUser,
    role,
    hasAccess,
    isLoading,
  };
};

// Constants for role-based access
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const ADMIN_ONLY_PAGES = [
  '/',
  '/choice-slip',
  '/slip-rate',
  '/normal-slip',
] as const;

export const isAdminOnlyPage = (pathname: string): boolean => {
  return ADMIN_ONLY_PAGES.includes(pathname as any);
};
