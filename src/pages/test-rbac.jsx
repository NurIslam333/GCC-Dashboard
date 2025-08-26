import React from 'react';
import withAuth from '@/hook/PrivateRoute';
import { useRoleAccess } from '@/hook/useRoleAccess';
import AccessDenied from '@/components/ui/access-denied';
import AdminRoute from '@/components/auth/AdminRoute';

const TestRBAC = () => {
  const { isAdmin, isUser, role, hasAccess, isLoading } = useRoleAccess();

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand"></div>
        <p>Loading role information...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RBAC Test Page</h1>
      
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-light-dark">
        <h2 className="mb-4 text-xl font-semibold">Current User Status</h2>
        <div className="space-y-2">
          <p><strong>Role:</strong> {role || 'None'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Is User:</strong> {isUser ? 'Yes' : 'No'}</p>
          <p><strong>Can Access Admin:</strong> {hasAccess('admin') ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-light-dark">
        <h2 className="mb-4 text-xl font-semibold">Admin Route Test</h2>
        <AdminRoute>
          <div className="rounded-lg bg-green-100 p-4 text-green-800">
            ✅ This content is only visible to admins!
          </div>
        </AdminRoute>
      </div>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-light-dark">
        <h2 className="mb-4 text-xl font-semibold">Access Denied Test</h2>
        {!isAdmin && (
          <AccessDenied
            title="Test Access Denied"
            message="This is a test of the access denied component."
            showBackButton={true}
          />
        )}
        {isAdmin && (
          <div className="rounded-lg bg-blue-100 p-4 text-blue-800">
            ✅ You are an admin, so you can see this content!
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-light-dark">
        <h2 className="mb-4 text-xl font-semibold">Role-Based Content</h2>
        {isAdmin ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-100 p-4 text-green-800">
              <h3 className="font-semibold">Admin Features</h3>
              <ul className="mt-2 list-disc pl-5">
                <li>Access to all pages</li>
                <li>Manage users</li>
                <li>View statistics</li>
                <li>System configuration</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-100 p-4 text-blue-800">
              <h3 className="font-semibold">User Features</h3>
              <ul className="mt-2 list-disc pl-5">
                <li>View own slips</li>
                <li>Basic navigation</li>
                <li>Limited access</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(TestRBAC, {
  isProtectedRoute: true,
  show: false,
});
