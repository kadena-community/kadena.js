import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';

export const loadingTransactionData: TransactionRequestKeyQuery = {
  transaction: {
    hash: '_0dc5GTJ8BNsVCAgIurgCMNYQTtwNKK0eSu6GomNf-4',
    __typename: 'Transaction',
    id: 'VHJhbnNhY3Rpb246WyJTUVE3azlJQ29FaVg0UXREN29aVHgtT1p2d1F3M3hyOGI3djFpNFBZVlhjIiwiXzBkYzVHVEo4Qk5zVkNBZ0l1cmdDTU5ZUVR0d05LSzBlU3U2R29tTmYtNCJd',
    sigs: [
      {
        sig: 'aada0e7c00c14853d6c2f14ba7501244d60c175dba3aa60d2b304d8de58d64d49ce2d4662145603823dfd6a05c2c70f192e04078cbc674015a2128b87f21560e',
        __typename: 'TransactionSignature',
      },
    ],
    cmd: {
      payload: {
        __typename: 'ExecutionPayload',
        data: '{"keyset":{"keys":["37fffd558fd811722e377c8c1f8e7a46dbcdb9732ef428361699bf7af0ec0f9a"],"pred":"keys-all"}}',
        code: '"(free.radio02.direct-to-send \\"k:a782f0b9d04e6c4f14182b955a721e5759875549fcec5a82391ad03e0f804785\\" )"',
      },
      meta: {
        chainId: 0,
        gasLimit: 1000,
        gasPrice: 0.000001,
        sender:
          'k:37fffd558fd811722e377c8c1f8e7a46dbcdb9732ef428361699bf7af0ec0f9a',
        ttl: 28800,
        creationTime: '2024-07-29T18:52:14.000Z',
        __typename: 'TransactionMeta',
      },
      networkId: 'mainnet01',
      nonce: '"2024-07-29T18:52:28.989Z"',
      signers: [
        {
          pubkey:
            '37fffd558fd811722e377c8c1f8e7a46dbcdb9732ef428361699bf7af0ec0f9a',
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
      transactionId: 356514081,
      logs: 'MkRh6gVjJ0GeNkgr0vJDxlpbRft8as7mkHokO18DFqE',
      gas: 262,
      metadata: null,
      continuation: null,
      __typename: 'TransactionResult',
      events: {
        edges: [
          {
            node: {
              qualifiedName: 'coin.TRANSFER',
              parameters:
                '["k:37fffd558fd811722e377c8c1f8e7a46dbcdb9732ef428361699bf7af0ec0f9a","k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa",0.000262]',
              __typename: 'Event',
            },
            __typename: 'TransactionResultEventsConnectionEdge',
          },
        ],
        __typename: 'TransactionResultEventsConnection',
      },
      block: {
        height: 4994075,
        hash: 'SQQ7k9ICoEiX4QtD7oZTx-OZvwQw3xr8b7v1i4PYVXc',
        creationTime: '2024-07-29T18:54:36.099Z',
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
