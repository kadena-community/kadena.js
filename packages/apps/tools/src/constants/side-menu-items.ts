import type { ISidebarToolbarItem } from '../types/Layout';
import Routes from './routes';

export const menuData: ISidebarToolbarItem[] = [
  {
    title: 'Faucet',
    icon: 'QrcodeScan',
    href: 'faucet',
    items: [
      {
        title: 'Fund New Account',
        href: Routes.FAUCET_NEW,
      },
      {
        title: 'Fund Existing Account',
        href: Routes.FAUCET_EXISTING,
      },
    ],
  },
  {
    title: 'Transactions',
    icon: 'Transition',
    href: 'transactions',
    items: [
      {
        title: 'Cross Chain Transfer Tracker',
        href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
      },
      {
        title: 'Cross Chain Transfer Finisher',
        href: Routes.CROSS_CHAIN_TRANSFER_FINISHER,
      },
      {
        title: 'Transfer',
        href: Routes.TRANSFER,
      },
    ],
  },
];
