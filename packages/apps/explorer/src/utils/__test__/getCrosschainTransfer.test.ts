import type { Transfer } from '@/__generated__/sdk';
import { getCrosschainTransfer } from '../getCrosschainTransfer';

describe('getCrosschainTransfer', () => {
  const data = {
    __typename: 'Query',
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
        {
          __typename: 'TransactionResultTransfersConnectionEdge',
          node: {
            __typename: 'Transfer',
            crossChainTransfer: null,
          },
        },
        {
          __typename: 'TransactionResultTransfersConnectionEdge',
          node: {
            __typename: 'Transfer',
            crossChainTransfer: null,
          },
        },
      ],
    },
  } as any;

  it('should return the cross chain transfer and return it', () => {
    const crossChainTransfer = {
      requestKey: '111',
      senderAccount: 'k:heman',
      receiverAccount: 'w:skeletor',
    } as Transfer;

    const innerData = JSON.parse(JSON.stringify(data));
    innerData.transfers.edges[1].node.crossChainTransfer = crossChainTransfer;

    const result = getCrosschainTransfer(innerData);
    expect(result).toEqual(crossChainTransfer);
  });

  it('should return undefined if data does not hold cross chain transfer', () => {
    const innerData = JSON.parse(JSON.stringify(data));

    const result = getCrosschainTransfer(innerData);
    expect(result).toEqual(undefined);
  });
});
