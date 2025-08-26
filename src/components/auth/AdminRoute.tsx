import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import AccessDenied from '@/components/ui/access-denied';
import { useRoleAccess } from '@/hook/useRoleAccess';

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  fallback,
  redirectTo = '/',
}) => {
  const router = useRouter();
  const { isAdmin, isLoading } = useRoleAccess();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      if (redirectTo) {
        router.replace(redirectTo);
      }
    }
  }, [isAdmin, isLoading, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <AccessDenied
        title="Admin Access Required"
        message="This page is restricted to administrators only. Please contact your system administrator if you believe you should have access to this area."
        showBackButton={true}
      />
    );
  }

  // Render children if user is admin
  return <>{children}</>;
};

export default AdminRoute;
