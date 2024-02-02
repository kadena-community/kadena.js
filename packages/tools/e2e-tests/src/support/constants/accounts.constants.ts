import type { IAccount } from '../types/account.types';

export const sender00Account: IAccount = {
  account: 'sender00',
  keys: [
    {
      publicKey:
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      secretKey:
        '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    },
  ],
  chains: [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ],
};

export const devnetMiner: IAccount = {
  account: 'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  keys: [
    {
      publicKey:
        'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
      secretKey: 'dummyValue',
    },
  ],
  chains: [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ],
};
export const faucetGasStation: IAccount = {
  account: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
  keys: [
    {
      publicKey: 'dummyValue',
      secretKey: 'dummyValue',
    },
  ],
  chains: ['0', '1'],
};
export const xChainGasStation = 'kadena-xchain-gas';
