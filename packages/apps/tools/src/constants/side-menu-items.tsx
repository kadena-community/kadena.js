import { isDevEnvironment } from '@/utils/isDevEnvironment';
import { MonoAnimation, MonoQrCodeScanner } from '@kadena/react-icons/system';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';
import type { ISidebarToolbarItem } from '../types/Layout';
import Routes from './routes';

export const menuData: ISidebarToolbarItem[] = [
  {
    title: 'Faucet',
    icon: <MonoQrCodeScanner className={atoms({ fontSize: '4xl' })} />,
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
    icon: <MonoAnimation className={atoms({ fontSize: '4xl' })} />,
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
      ...(isDevEnvironment
        ? [
            {
              title: 'Transfer',
              href: Routes.TRANSFER,
            },
          ]
        : []),
    ],
  },
];
