import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { VoteIcon } from '@/components/icons/vote-icon';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';
import Cookies from 'js-cookie';

export const menuItems = [
  {
    name: 'Dashbord',
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: 'Total User',
    icon: <FarmIcon />,
    href: routes.totalUser,
  },
  {
    name: 'Normal Slip Pending',
    icon: <ExchangeIcon />,
    href: routes.normalSlipPending,
  },
  {
    name: 'Normal Slip Complete',
    icon: <PoolIcon />,
    href: routes.normalSlipCompelete,
  },
  {
    name: 'Choice Slip Pending',
    icon: <CompassIcon />,
    href: routes.choiceSlipPending,
  },
  {
    name: 'Choice Slip Processing',
    icon: <PlusCircle />,
    href: routes.choiceSlipProcessing,
  },
  {
    name: 'Payment Page',
    icon: <VoteIcon />,
    href: routes.payment,
  },
  {
    name: 'Choice Slip Complete',
    icon: <DiskIcon />,
    href: routes.choiceSlipComplete,
  },
  {
    name: 'Medical Serial List',
    icon: <ProfileIcon />,
    href: routes.medicalSerialList,
  },
  {
    name: 'Setting',
    icon: <ProfileIcon />,
    href: routes.settings,
  },

  // user
  {
    name: 'User Normal Slip',
    icon: <ExchangeIcon />,
    href: routes.userNormalSlip,
  },

  {
    name: 'User Choice Slip',
    icon: <ExchangeIcon />,
    href: routes.userChoiceSlip,
  },
];



export const filterMenuItems = (role) => {
  if (role === 'user') {
    // Filter the menuItems array for items related to Normal Slips and Choice Slips
    const userMenuItems = menuItems.filter(item => 
      item.name.includes('Normal Slip') || item.name.includes('Choice Slip')
    );
    return userMenuItems;
  } else {
    // For other roles or default case, return an empty array
    return [];
  }
};