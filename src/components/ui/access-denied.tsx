import React from 'react';
// Simple lock icon component to avoid import issues
const LockIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2zm10-10V7a4 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
import Button from '@/components/ui/button';
import { useRouter } from 'next/router';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = 'Access Denied',
  message = 'You do not have permission to access this page. This area is restricted to administrators only.',
  showBackButton = true,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <LockIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
          {message}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {showBackButton && (
            <Button
              onClick={handleGoBack}
              variant="ghost"
              className="min-w-[120px] border border-gray-300"
            >
              Go Back
            </Button>
          )}
          
          <Button
            onClick={handleGoHome}
            className="min-w-[120px] bg-brand"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
