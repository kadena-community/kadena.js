import { ExportFromChainweaver } from '../chainweaver';
import { deepfreeze } from './deepfreeze';

export const exampleExport: ExportFromChainweaver = deepfreeze({
  StoreFrontend_Version: 1,
  StoreFrontend_Data: [
    [
      ['StoreFrontend_Wallet_Keys', []],
      [
        [
          0,
          {
            pair: {
              private: 'someprivatekey',
              public: '55',
            },
          },
        ],
        [
          1,
          {
            pair: {
              private: 'someprivatekey',
              public: 'e3',
            },
          },
        ],
        [
          2,
          {
            pair: {
              private: 'someprivatekey',
              public: '89',
            },
          },
        ],
        [
          3,
          {
            pair: {
              private: 'someprivatekey',
              public: '6e',
            },
          },
        ],
        [
          4,
          {
            pair: {
              private: 'someprivatekey',
              public: 'c8',
            },
          },
        ],
        [
          5,
          {
            pair: {
              private: 'someprivatekey',
              public: 'f6',
            },
          },
        ],
        [
          6,
          {
            pair: {
              private: 'someprivatekey',
              public: '00',
            },
          },
        ],
        [
          7,
          {
            pair: {
              private: 'someprivatekey',
              public: 'f3',
            },
          },
        ],
        [
          8,
          {
            pair: {
              private: 'someprivatekey',
              public: 'bf',
            },
          },
        ],
        [
          9,
          {
            pair: {
              private: 'someprivatekey',
              public: '2c',
            },
          },
        ],
        [
          10,
          {
            pair: {
              private: 'someprivatekey',
              public: '6f',
            },
          },
        ],
        [
          11,
          {
            pair: {
              private: 'someprivatekey',
              public: 'dc',
            },
          },
        ],
        [
          12,
          {
            pair: {
              private: 'someprivatekey',
              public: '55',
            },
          },
        ],
        [
          13,
          {
            pair: {
              private: 'someprivatekey',
              public: '1e',
            },
          },
        ],
        [
          14,
          {
            pair: {
              private: 'someprivatekey',
              public: '55',
            },
          },
        ],
        [
          15,
          {
            pair: {
              private: 'someprivatekey',
              public: 'bf',
            },
          },
        ],
        [
          16,
          {
            pair: {
              private: 'someprivatekey',
              public: 'c8',
            },
          },
        ],
        [
          17,
          {
            pair: {
              private: 'someprivatekey',
              public: '40',
            },
          },
        ],
        [
          18,
          {
            pair: {
              private: 'someprivatekey',
              public: '13',
            },
          },
        ],
        [
          19,
          {
            pair: {
              private: 'someprivatekey',
              public: '74',
            },
          },
        ],
        [
          20,
          {
            pair: {
              private: 'someprivatekey',
              public: '4a',
            },
          },
        ],
        [
          21,
          {
            pair: {
              private: 'someprivatekey',
              public: 'da',
            },
          },
        ],
        [
          22,
          {
            pair: {
              private: 'someprivatekey',
              public: '83',
            },
          },
        ],
        [
          23,
          {
            pair: {
              private: 'someprivatekey',
              public: '63',
            },
          },
        ],
        [
          24,
          {
            pair: {
              private: 'someprivatekey',
              public: 'd0',
            },
          },
        ],
        [
          25,
          {
            pair: {
              private: 'someprivatekey',
              public: '0b',
            },
          },
        ],
        [
          26,
          {
            pair: {
              private: 'someprivatekey',
              public: 'ac',
            },
          },
        ],
        [
          27,
          {
            pair: {
              private: 'someprivatekey',
              public: '46',
            },
          },
        ],
        [
          28,
          {
            pair: {
              private: 'someprivatekey',
              public: 'd6',
            },
          },
        ],
        [
          29,
          {
            pair: {
              private: 'someprivatekey',
              public: '62',
            },
          },
        ],
        [
          30,
          {
            pair: {
              private: 'someprivatekey',
              public: 'ce',
            },
          },
        ],
        [
          31,
          {
            pair: {
              private: 'someprivatekey',
              public: '57',
            },
          },
        ],
        [
          32,
          {
            pair: {
              private: 'someprivatekey',
              public: '86',
            },
          },
        ],
        [
          33,
          {
            pair: {
              private: 'someprivatekey',
              public: '09',
            },
          },
        ],
      ],
    ],
    [
      ['StoreFrontend_Wallet_Tokens', []],
      {
        Testnet: [
          {
            namespace: null,
            name: 'coin',
          },
          {
            namespace: 'kdlaunch',
            name: 'kdswap-token',
          },
        ],
      },
    ],
    [
      ['StoreFrontend_Wallet_Accounts', []],
      {
        Testnet05: {
          'k:55': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
        },
        devnet: {
          'k:f6': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
        },
        Mainnet: {
          'k:55': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
          'k:e3': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
        },
        Testn: {
          Abbe: {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
          'k:18': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A',
          },
          'k:6f': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'S (chat)',
          },
          'k:1a': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A (via commandline)',
          },
          'k:55': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A',
          },
          'k:32': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'L',
          },
          'w:4t': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A',
          },
          Fa: {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
          al: {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
          },
          'w:lw': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A + Albert',
          },
          'k:78': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'R',
          },
          'k:e3': {
            chains: {
              '15': {},
              '7': {},
              '13': {},
              '14': {},
              '0': {},
              '19': {},
              '12': {},
              '17': {},
              '1': {},
              '18': {},
              '4': {},
              '16': {},
              '2': {},
              '5': {},
              '8': {},
              '11': {},
              '3': {},
              '6': {},
              '9': {},
              '10': {},
            },
            notes: 'A',
          },
        },
      },
    ],
    [
      ['StoreFrontend_Network_PublicMeta', []],
      {
        creationTime: 1661783201,
        ttl: 26266,
        gasLimit: 10000,
        chainId: '1',
        gasPrice: 1e-8,
        sender: 'k:55',
      },
    ],
    [
      ['StoreFrontend_Network_Networks', []],
      {
        Testnet05: ['api.testnet05.chainweb.com'],
        Devnet: ['localhost:8080'],
        Mainnet: ['api.chainweb.com'],
        Testnet: ['api.testnet.chainweb.com'],
      },
    ],
    [['StoreFrontend_Network_SelectedNetwork', []], 'Testnet05'],
    [['StoreFrontend_ModuleExplorer_SessionFile', []], ''],
  ],
  BIPStorage_Version: 0,
  BIPStorage_Data: [[['BIPStorage_RootKey', []], 'Somerootkey']],
});
