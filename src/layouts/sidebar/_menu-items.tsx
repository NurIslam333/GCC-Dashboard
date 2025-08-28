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
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect, useState } from 'react';

export const useMenuItems = () => {
  const { role, isLoading } = useAuth();
  const [menuItems, setMenuItems] = useState([
    {
      name: 'Dashboard',
      icon: <HomeIcon />,
      href: routes.home,
    },
  ]);



  useEffect(() => {
    // Only show loading if we don't have a role yet
    if (isLoading && !role) {
      return;
    }

    // If we have a role, generate menu immediately
    if (role) {
      // Role confirmed, generating menu immediately
    }

    const baseItems = [
      {
        name: 'Dashboard',
        icon: <HomeIcon />,
        href: routes.home,
      },
    ];

    if (role === 'user') {
      setMenuItems([
        ...baseItems,
        {
          name: 'Normal Slip',
          icon: <ExchangeIcon />,
          href: routes.userNormalSlip,
        },
        {
          name: 'Type Normal Slip',
          icon: <PlusCircle />,
          href: routes.typeNormalSlip,
        },
        {
          name: 'Choice Slip',
          icon: <ExchangeIcon />,
          href: routes.userChoiceSlip,
        },
        {
          name: 'Type Choice Slip',
          icon: <PlusCircle />,
          href: routes.typeChoicSlip,
        },
        {
          name: 'Slip Rate',
          icon: <ExchangeIcon />,
          href: routes.slipRate,
        },
      ]);
    } else if (role === 'admin') {
      setMenuItems([
        ...baseItems,
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
          name: 'False Slip',
          icon: <ExchangeIcon />,
          href: routes.falseSlip,
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
          name: 'Choice Slip Complete',
          icon: <DiskIcon />,
          href: routes.choiceSlipComplete,
        },
        {
          name: 'Dhaka Payment Page',
          icon: <VoteIcon />,
          href: routes.dhakaPayment,
        },
        {
          name: 'Comilla Payment Page',
          icon: <VoteIcon />,
          href: routes.comillaPayment,
        },
        {
          name: 'Slip Rate',
          icon: <ProfileIcon />,
          href: routes.medicalSerialList,
        },
        {
          name: 'Setting',
          icon: <ProfileIcon />,
          href: routes.settings,
        }
      ]);
    } else {
      setMenuItems(baseItems);
    }
  }, [role, isLoading]);

  return { menuItems, isLoading };
};

// Legacy export for backward compatibility
export const menuItems = [
  {
    name: 'Dashboard',
    icon: <HomeIcon />,
    href: routes.home,
  },
];
