export const options: Record<string, any>[] = [
  {
    label: '',
    options: [
      { value: 'event', label: 'Events', width: '103px', minWidth: '82px' },
      {
        value: 'transaction',
        label: 'Transactions',
        width: '151px',
        minWidth: '124px',
      },
      {
        value: 'requestKey',
        label: 'Request Keys',
        width: '157px',
        minWidth: '128px',
      },
    ],
  },
  {
    label: 'Account History',
    options: [
      {
        value: 'accountHistory',
        label: 'All',
        labelInput: 'Account History',
        width: '178px',
        minWidth: '146px',
      },
      { value: 'xYield', label: 'X_YIELD', width: '118px', minWidth: '95px' },
      { value: 'swap', label: 'SWAP', width: '100px', minWidth: '80px' },
    ],
  },
];
