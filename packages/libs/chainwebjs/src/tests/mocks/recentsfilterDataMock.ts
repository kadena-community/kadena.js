/* eslint-disable @rushstack/typedef-var */
/* eslint-disable @typescript-eslint/naming-convention */
export const filterData = [
  {
    header: {
      nonce: '8329399179007546730',
      creationTime: 1671626380758521,
      parent: '69dOmqR2fX8nzuoU7W2cpVqnnV-rQgcLdmHoYOXWO4s',
      adjacents: {
        '5': 'MnvY7Khdi8FIHJzgWej0Jlyhjqne9xXa7_3KWY_XHvU',
        '10': 'c4fcPEWMz8sutSsm12tMbMFLb28rV0YcU6-vXrOJkug',
        '15': 'sfYGC_piT0_d6VEb1iA86-lW2jHqaPzPBD5eZUDjHrg',
      },
      target: 'pmOTtiT-J6ERdohV-JWFWjaHXuAfn5hPPwAAAAAAAAA',
      payloadHash: '7pNTSKkmhAwfoQHq1j3lNAeZM98WKPrScmI8Sooeu30',
      chainId: 0,
      weight: 'PgROEW5XDqEzLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      height: 3306537,
      chainwebVersion: 'mainnet01',
      epochStart: 1671624677862394,
      featureFlags: 0,
      hash: '53af2-xJVXBaHn397ZaSMS-g-uU0F2OXJBOJ_dUUGZo',
    },
    payload: {
      transactions: [
        {
          transaction: {
            hash: 'ofiguZmbR_11xbElqo4Iw0D9yFxMnuWGD4NMewhMQXE',
            sigs: [
              {
                sig: '58eab14c3b03fe7dfd5d1cd3c7cb7588e18fc1174f09568bb8431c82df0e1f9f67a99766f90aa47f22752568d0a2570c5d1c5e7aebd2b02c511e9aac9b829d08',
              },
            ],
            cmd: {
              networkId: 'mainnet01',
              payload: {
                exec: {
                  data: {},
                  code: '(coin.transfer "k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987" "k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a" 2.82633000)',
                },
              },
              signers: [
                {
                  clist: [
                    {
                      name: 'coin.TRANSFER',
                      args: [
                        'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
                        'k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a',
                        2.82633,
                      ],
                    },
                    {
                      name: 'coin.GAS',
                      args: [],
                    },
                  ],
                  pubKey:
                    '5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
                },
              ],
              meta: {
                creationTime: 1671626338,
                ttl: 600,
                gasLimit: 3000,
                chainId: '0',
                gasPrice: 0.00001,
                sender:
                  'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
              },
              nonce: '"2022-12-21 12:38:58.963823"',
            },
          },
          output: {
            gas: 741,
            result: {
              status: 'success',
              data: 'Write succeeded',
            },
            reqKey: 'ofiguZmbR_11xbElqo4Iw0D9yFxMnuWGD4NMewhMQXE',
            logs: 'eGA9zAZEhYCwhSRhb75AezHz2gSWMe5sHAM8KWXI-aU',
            events: [
              {
                params: [
                  'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
                  '99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a',
                  0.00741,
                ],
                name: 'TRANSFER',
                module: {
                  namespace: null,
                  name: 'coin',
                },
                moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
              },
              {
                params: [
                  'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
                  'k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a',
                  2.82633,
                ],
                name: 'TRANSFER',
                module: {
                  namespace: null,
                  name: 'coin',
                },
                moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
              },
            ],
            metaData: null,
            continuation: null,
            txId: 20774405,
          },
        },
      ],
      minerData: {
        account:
          '99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a',
        predicate: 'keys-all',
        'public-keys': [
          '99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a',
        ],
      },
      coinbase: {
        gas: 0,
        result: {
          status: 'success',
          data: 'Write succeeded',
        },
        reqKey: 'IlR2X205RkFyeUx3WnRBOXhlUFBNUFpiOHJ0bXVCOGdiZDNoNmptcjRUd1Ei',
        logs: 'VXHKWMqDUcEx0cMF7Lbq56y1zTEUc0IeGrDFThPln0E',
        events: [
          {
            params: [
              '',
              '99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a',
              1.0354825,
            ],
            name: 'TRANSFER',
            module: {
              namespace: null,
              name: 'coin',
            },
            moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
          },
        ],
        metaData: null,
        continuation: null,
        txId: 20777289,
      },
      payloadHash: 'iZV6IQpHflD0GvtrJta44IzdwAJp9rlu6tGfH7nCdvI',
      transactionsHash: '1EMGlkhqT5lBwAhci90hmnrWhsUM3rg7J0PdfSSpFqg',
      outputsHash: '3Wy65AQCwSqDiQw6TvPpKibRZa6bkF5Z82_LAlB-yWQ',
    },
  },
];

export const filterDataNoTx = [
  {
    ...filterData[0],
    payload: {
      ...filterData[0].payload,
      transactions: [],
    },
  },
];

export const filterDataFormatted = [
  {
    height: 3306537,
    output: {
      continuation: null,
      events: [
        {
          module: { name: 'coin', namespace: null },
          moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
          name: 'TRANSFER',
          params: [
            'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
            '99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a',
            0.00741,
          ],
        },
        {
          module: { name: 'coin', namespace: null },
          moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
          name: 'TRANSFER',
          params: [
            'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
            'k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a',
            2.82633,
          ],
        },
      ],
      gas: 741,
      logs: 'eGA9zAZEhYCwhSRhb75AezHz2gSWMe5sHAM8KWXI-aU',
      metaData: null,
      reqKey: 'ofiguZmbR_11xbElqo4Iw0D9yFxMnuWGD4NMewhMQXE',
      result: { data: 'Write succeeded', status: 'success' },
      txId: 20774405,
    },
    transaction: {
      cmd: {
        meta: {
          chainId: '0',
          creationTime: 1671626338,
          gasLimit: 3000,
          gasPrice: 0.00001,
          sender:
            'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
          ttl: 600,
        },
        networkId: 'mainnet01',
        nonce: '"2022-12-21 12:38:58.963823"',
        payload: {
          exec: {
            code: '(coin.transfer "k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987" "k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a" 2.82633000)',
            data: {},
          },
        },
        signers: [
          {
            clist: [
              {
                args: [
                  'k:5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
                  'k:d250a56932b4407c0630e03feb4a126ad5d3bd2f754b424847b32c665f69fb1a',
                  2.82633,
                ],
                name: 'coin.TRANSFER',
              },
              { args: [], name: 'coin.GAS' },
            ],
            pubKey:
              '5cac5e5fa9aec2e1672b51af8b90319567ea9e2bcbf6d32a9ca4f970e6984987',
          },
        ],
      },
      hash: 'ofiguZmbR_11xbElqo4Iw0D9yFxMnuWGD4NMewhMQXE',
      sigs: [
        {
          sig: '58eab14c3b03fe7dfd5d1cd3c7cb7588e18fc1174f09568bb8431c82df0e1f9f67a99766f90aa47f22752568d0a2570c5d1c5e7aebd2b02c511e9aac9b829d08',
        },
      ],
    },
  },
];
