import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Logo from '@/components/ui/logo';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import { useDrawer } from '@/components/drawer-views/context';
import { Close } from '@/components/icons/close';
import { useMenuItems } from '@/layouts/sidebar/_menu-items';
import { useAuth } from '@/components/auth/AuthContext';
//images
import AuthorImage from '@/assets/images/author.jpg';

export default function Sidebar({ className }: { className?: string }) {
  const { closeDrawer } = useDrawer();
  const { menuItems, isLoading } = useMenuItems();
  const { user, role, isAuthenticated } = useAuth();

  // IMMEDIATE LOGOUT CHECK: If not authenticated, show nothing to prevent flash of old content
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state ONLY when we have no role and are not authenticated
  // If we have a role, NEVER show loading - render immediately
  if (!role && !isAuthenticated) {
    return (
      <aside
        className={cn(
          'top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80',
          className
        )}
      >
        <div className="relative flex h-24 items-center justify-between overflow-hidden px-6 py-4 2xl:px-8">
          <Logo />
          <div className="md:hidden">
            <Button
              title="Close"
              color="white"
              shape="circle"
              variant="transparent"
              size="small"
              onClick={closeDrawer}
            >
              <Close className="h-auto w-2.5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </aside>
    );
  }

  // If we have a role, render immediately (even if data is still loading)
  if (role && isAuthenticated) {
    // Role and auth confirmed, rendering sidebar immediately
  }

  return (
    <aside
      className={cn(
        'top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80',
        className
      )}
    >
      <div className="relative flex h-24 items-center justify-between overflow-hidden px-6 py-4 2xl:px-8">
        <Logo />
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="px-6 pb-5 2xl:px-8">
          <AuthorCard
            image={AuthorImage}
            name={user?.name || 'User'}
            email={user?.email || 'user@example.com'}
            role={role === 'user' ? "User" : "Admin"}
          />

          <div className="mt-12">
            {menuItems.map((item, index) => (
              <MenuItem
                key={'default' + item.name + index}
                name={item.name}
                href={item.href}
                icon={item.icon}
                // dropdownItems={item.dropdownItems}
              />
            ))}
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
