import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';

export const loadingTransactionData: TransactionRequestKeyQuery = {
  transaction: {
    hash: '1',
    __typename: 'Transaction',
    id: '0',
    sigs: [
      {
        sig: '0',
        __typename: 'TransactionSignature',
      },
    ],
    cmd: {
      payload: {
        __typename: 'ExecutionPayload',
        data: '{"keyset":{"keys":["0"],"pred":"keys-all"}}',
        code: '"(free.radio02.direct-to-send \\"k:0\\" )"',
      },
      meta: {
        chainId: 0,
        gasLimit: 1000,
        gasPrice: 0.000001,
        sender: 'k:0',
        ttl: 28800,
        creationTime: new Date().toLocaleString(),
        __typename: 'TransactionMeta',
      },
      networkId: 'mainnet01',
      nonce: '"1977-10-13"',
      signers: [
        {
          pubkey: '0',
          clist: [],
          scheme: null,
          __typename: 'Signer',
        },
      ],
      __typename: 'TransactionCommand',
    },
    result: {
      goodResult: '"Already directed...."',
      badResult: null,
      transactionId: 1,
      logs: '1',
      gas: 262,
      metadata: null,
      continuation: null,
      __typename: 'TransactionResult',
      events: {
        edges: [
          {
            node: {
              qualifiedName: 'coin.TRANSFER',
              parameters: '["k:0","k:1",2.0]',
              __typename: 'Event',
            },
            __typename: 'TransactionResultEventsConnectionEdge',
          },
        ],
        __typename: 'TransactionResultEventsConnection',
      },
      block: {
        height: 1,
        hash: '0',
        creationTime: new Date().toLocaleString(),
        __typename: 'Block',
      },
      transfers: {
        __typename: 'TransactionResultTransfersConnection',
        edges: [
          {
            __typename: 'TransactionResultTransfersConnectionEdge',
            node: {
              __typename: 'Transfer',
              crossChainTransfer: null,
            },
          },
        ],
      },
    },
  },
};
