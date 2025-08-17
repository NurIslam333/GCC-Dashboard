import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Logo from '@/components/ui/logo';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import { useDrawer } from '@/components/drawer-views/context';
import { Close } from '@/components/icons/close';
import { menuItems } from '@/layouts/sidebar/_menu-items';
//images
import AuthorImage from '@/assets/images/author.jpg';
import Cookies from 'js-cookie';
const getRole = Cookies.get('role');

export default function Sidebar({ className }: { className?: string }) {
  const { closeDrawer } = useDrawer();

  const getUser :any =Cookies.get('user');
  let user = "";

  if (getUser) {
    try {
      user = JSON?.parse(getUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Handle the parsing error, if needed
    }
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
            name={user?.name}
            email={user?.email}
            role= {getRole == 'user' ? "user": "admin"}
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
