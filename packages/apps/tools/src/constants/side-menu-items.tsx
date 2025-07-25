import {
  MonoAnimation,
  MonoQrCodeScanner,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import React from 'react';
import type { ISidebarToolbarItem } from '../types/Layout';
import Routes from './routes';

const menuData: ISidebarToolbarItem[] = [
  {
    title: 'Faucet',
    icon: <MonoQrCodeScanner style={{ maxWidth: '100%' }} />,
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
      {
        title: 'Fund EVM Address',
        href: Routes.FAUCET_EVM,
      },
    ],
  },
  {
    title: 'Transactions',
    icon: <MonoAnimation style={{ maxWidth: '100%' }} />,
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
  {
    title: 'Modules',
    icon: <MonoViewInAr style={{ maxWidth: '100%' }} />,
    href: 'modules',
    items: [{ title: 'Explorer', href: Routes.MODULE_EXPLORER }],
  },
];

export { menuData };
