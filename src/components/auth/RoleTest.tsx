import React from 'react';
import { useRoleAccess } from '@/hook/useRoleAccess';
import Button from '@/components/ui/button';

const RoleTest: React.FC = () => {
  const { isAdmin, isUser, role, hasAccess, isLoading } = useRoleAccess();

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand"></div>
        <p>Loading role information...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-light-dark">
      <h3 className="mb-4 text-lg font-semibold">Role Access Test</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Current Role:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {role || 'None'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Is Admin:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAdmin ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Is User:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            isUser ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isUser ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Can Access Admin:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            hasAccess('admin') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {hasAccess('admin') ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Can Access User:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            hasAccess('user') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {hasAccess('user') ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <h4 className="mb-3 font-medium">Test Actions:</h4>
        <div className="space-y-2">
          <Button
            onClick={() => {}}
            variant="ghost"
            size="small"
            className="w-full"
          >
            Log Role Info to Console
          </Button>
          
          <Button
            onClick={() => {
              const testPages = ['/', '/choice-slip', '/slip-rate', '/normal-slip'];
              testPages.forEach(page => {
                // Log role access info
              });
            }}
            variant="ghost"
            size="small"
            className="w-full"
          >
            Test Page Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleTest;
