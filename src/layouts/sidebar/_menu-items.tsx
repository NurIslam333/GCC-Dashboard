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

const getRole = Cookies.get('role');

export const menuItems = [
  {
    name: 'Dashboard',
    icon: <HomeIcon />,
    href: routes.home,
  },

  // user
  // getRole !== ' user' && {
  //   name: 'User Normal Slip',
  //   icon: <ExchangeIcon />,
  //   href: routes.userNormalSlip,
  // },

  // getRole !== ' user' && {
  //   name: 'User Choice Slip',
  //   icon: <ExchangeIcon />,
  //   href: routes.userChoiceSlip,
  // },
];

if (getRole === 'user') {
  menuItems.push(
    // {
    //   name: 'Normal Slip',
    //   icon: <ExchangeIcon />,
    //   href: routes.userNormalSlip,
    // },
    // {
    //   name: 'Night Slip',
    //   icon: <ExchangeIcon />,
    //   href: routes.nightSlip,
    // },

    // {
    //   name: 'Slip Pay',
    //   icon: <ExchangeIcon />,
    //   href: routes.userChoiceSlip,
    // },
    // {
    //   name: 'Slip Pay',
    //   icon: <ExchangeIcon />,
    //   href: routes.userChoiceSlip,
    // },
    {
      name: 'Choice Slip',
      icon: <ExchangeIcon />,
      href: routes.userChoiceSlip,
    },
    // {
    //   name: 'Link Payment',
    //   icon: <ExchangeIcon />,
    //   href: routes.linkPayment,
    // },
    // {
    //   name: 'Link Payment Complete',
    //   icon: <ExchangeIcon />,
    //   href: routes.linkPaymentComplete,
    // },
    {
      name: 'Slip Rate',
      icon: <ExchangeIcon />,
      href: routes.slipRate,
    },
  
  );
} else {
  menuItems.push(
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
      name: 'False Slip ',
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
    // {
    //   name: 'Payment Page',
    //   icon: <VoteIcon />,
    //   href: routes.payment,
    // },
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
      name: 'Choice Slip Complete',
      icon: <DiskIcon />,
      href: routes.choiceSlipComplete,
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
  );
}
