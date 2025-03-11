import type { ChainId } from '@kadena/types';
import { describe, expect, test } from 'vitest';
import { isSameTransfer } from '../../services/graphql/transfer.util.js';

const EXAMPLE_TRANSFER = {
  requestKey: '123',
  chainId: '1',
  senderAccount: 'sender',
  receiverAccount: 'receiver',
  amount: 100,
  isCrossChainTransfer: false,
  success: true,
  transactionFee: {
    isBulkTransfer: false,
    amount: 100,
    receiverAccount: 'receiver',
    senderAccount: 'sender',
  },
  block: {
    creationTime: new Date(),
    blockDepthEstimate: BigInt(1),
    hash: 'hash',
    height: BigInt(1),
  },
  networkId: 'testnet04',
  token: 'coin',
} as const;

describe('transfer.utils', () => {
  test('isSameTransfer', async () => {
    const SAME_TRANSFER = { ...EXAMPLE_TRANSFER };
    expect(isSameTransfer(EXAMPLE_TRANSFER, SAME_TRANSFER)).toBe(true);

    const DIFFERENT_REQUEST_KEY = { ...EXAMPLE_TRANSFER, requestKey: '456' };
    expect(isSameTransfer(EXAMPLE_TRANSFER, DIFFERENT_REQUEST_KEY)).toBe(false);

    const DIFFERENT_CHAIN_ID = { ...EXAMPLE_TRANSFER, chainId: '2' as ChainId };
    expect(isSameTransfer(EXAMPLE_TRANSFER, DIFFERENT_CHAIN_ID)).toBe(false);

    const DIFFERENT_SENDER_ACCOUNT = {
      ...EXAMPLE_TRANSFER,
      senderAccount: 'sender2',
    };
    expect(isSameTransfer(EXAMPLE_TRANSFER, DIFFERENT_SENDER_ACCOUNT)).toBe(
      false,
    );

    const DIFFERENT_RECEIVER_ACCOUNT = {
      ...EXAMPLE_TRANSFER,
      receiverAccount: 'receiver2',
    };
    expect(isSameTransfer(EXAMPLE_TRANSFER, DIFFERENT_RECEIVER_ACCOUNT)).toBe(
      false,
    );

    const DIFFERENT_AMOUNT = { ...EXAMPLE_TRANSFER, amount: 200 };
    expect(isSameTransfer(EXAMPLE_TRANSFER, DIFFERENT_AMOUNT)).toBe(false);
  });
});
