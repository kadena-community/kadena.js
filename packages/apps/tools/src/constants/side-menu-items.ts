import Routes from './routes';

export const menuData = [
  {
    title: 'Faucet',
    icon: 'QrcodeScan',
    href: Routes.FAUCET_NEW,
    items: [
      {
        title: 'Fund New Account',
        href: '/faucet/new',
      },
      {
        title: 'Fund Existing Account',
        href: '/faucet/existing',
      },
    ],
  },
  // {
  //   title: 'Transactions',
  //   icon: 'Transition',
  //   href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
  // },
  // {
  //   title: 'Account',
  //   icon: 'Account',
  //   href: Routes.ACCOUNT_TRANSACTIONS,
  // },
];
