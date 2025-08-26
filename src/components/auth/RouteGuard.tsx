import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRoleAccess } from '@/hook/useRoleAccess';
import { isAdminOnlyPage } from '@/hook/useRoleAccess';
import AccessDenied from '@/components/ui/access-denied';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, fallback }) => {
  const router = useRouter();
  const { isAdmin, isLoading } = useRoleAccess();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      const currentPath = router.pathname;
      
      // Check if current page requires admin access
      if (isAdminOnlyPage(currentPath) && !isAdmin) {
        // Redirect non-admin users to dashboard
        router.replace('/');
        return;
      }
    }
  }, [isAdmin, isLoading, isClient, router]);

  // Show loading state while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if current page requires admin access
  const currentPath = router.pathname;
  if (isAdminOnlyPage(currentPath) && !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <AccessDenied
        title="Access Restricted"
        message="This page is only accessible to administrators. You have been redirected to the dashboard."
        showBackButton={false}
      />
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
