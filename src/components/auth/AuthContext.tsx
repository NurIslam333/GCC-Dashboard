import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuthData, logout } from '@/utls/auth';
import { useRouter } from 'next/router';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  role: string | null;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = () => {
    const authData = getAuthData();
    
    // Only update if we have valid data
    if (authData.token && authData.user && authData.role) {
      setIsAuthenticated(true);
      setUser(authData.user);
      setRole(authData.role);
      setIsLoading(false);
      
      // EXTREMELY AGGRESSIVE: Additional immediate state update to ensure no loading delays
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
      
      // Force another immediate update to ensure no delays
      setTimeout(() => {
        setIsLoading(false);
        setRole(authData.role);
        setUser(authData.user);
        setIsAuthenticated(true);
      }, 10);
      
      // EXTRA AGGRESSIVE: Force one more update
      setTimeout(() => {
        setIsLoading(false);
        setRole(authData.role);
        setUser(authData.user);
        setIsAuthenticated(true);
      }, 20);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear state immediately to prevent flash of old content
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    
    // Clear storage and trigger logout event
    logout();
    
    // Redirect to login page after a brief delay to ensure state is cleared
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }, 100);
  };

  useEffect(() => {
    refreshAuth();
    
    // EXTREMELY AGGRESSIVE: Force immediate state update to prevent loading delays
    setTimeout(() => {
      const authData = getAuthData();
      if (authData.token && authData.user && authData.role) {
        setIsAuthenticated(true);
        setUser(authData.user);
        setRole(authData.role);
        setIsLoading(false);
      }
    }, 50);
    
    // EXTRA AGGRESSIVE: Force another state update
    setTimeout(() => {
      const authData = getAuthData();
      if (authData.token && authData.user && authData.role) {
        setIsAuthenticated(true);
        setUser(authData.user);
        setRole(authData.role);
        setIsLoading(false);
      }
    }, 100);
    
    // FINAL AGGRESSIVE: Force one more state update
    setTimeout(() => {
      const authData = getAuthData();
      if (authData.token && authData.user && authData.role) {
        setIsAuthenticated(true);
        setUser(authData.user);
        setRole(authData.role);
        setIsLoading(false);
      }
    }, 200);
  }, []);

  // Listen for custom auth events
  useEffect(() => {
          const handleLogin = (event: CustomEvent) => {
        const { token, user: userData, role: userRole } = event.detail;
        
        // EXTREMELY AGGRESSIVE: Immediately update state without any delay
        setIsAuthenticated(!!token);
        setUser(userData);
        setRole(userRole);
        setIsLoading(false);
        
        // FORCE MULTIPLE RE-RENDERS: Ensure components update immediately
        setTimeout(() => {
          setIsAuthenticated(!!token);
          setUser(userData);
          setRole(userRole);
          setIsLoading(false);
        }, 0);
        
        // Additional immediate state update to ensure no loading delays
        setIsLoading(false);
        
        // Force another immediate update to ensure no delays
        setTimeout(() => {
          setIsLoading(false);
          setRole(userRole);
          setUser(userData);
          setIsAuthenticated(!!token);
        }, 10);
        
        // EXTRA AGGRESSIVE: Force one more update
        setTimeout(() => {
          setIsLoading(false);
          setRole(userRole);
          setUser(userData);
          setIsAuthenticated(!!token);
        }, 20);
        
        // INSTANT API TRIGGER: Dispatch custom event to trigger immediate API call
        if (typeof window !== 'undefined') {
          const apiTriggerEvent = new CustomEvent('api:fetch-stats', {
            detail: { role: userRole, user: userData }
          });
          window.dispatchEvent(apiTriggerEvent);
        }
      };

          const handleLogout = () => {
        // Clear state immediately
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }, 100);
      };

          // Listen for storage changes (when user logs in/out in another tab)
      const handleStorageChange = (e: StorageEvent) => {
        if (['token', 'user', 'role'].includes(e.key || '')) {
          refreshAuth();
        }
      };

          if (typeof window !== 'undefined') {
        // Listen for custom auth events
        window.addEventListener('auth:login', handleLogin as EventListener);
        window.addEventListener('auth:login', handleLogout);
        
        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
          window.removeEventListener('auth:login', handleLogin as EventListener);
          window.removeEventListener('auth:logout', handleLogout);
          window.removeEventListener('storage', handleStorageChange);
        };
      }
  }, []);



  const value: AuthContextType = {
    isAuthenticated,
    user,
    role,
    isLoading,
    logout: handleLogout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
