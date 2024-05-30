import type { IClient, ICommand, IUnsignedCommand } from '@kadena/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { log } from '../../utils/logger.js';

import { isSignedTransaction } from '@kadena/client';
import type { CommandResult } from '../../utils/command.util.js';
import { displayTransactionResponse } from '../utils/txDisplayHelper.js';
import type { INetworkDetails, ISubmitResponse } from '../utils/txHelpers.js';

import { getClient } from '../utils/txHelpers.js';

vi.mock('../utils/txDisplayHelper', () => ({
  displayTransactionResponse: vi.fn(),
}));

vi.mock('@kadena/client', async () => {
  const actual = await vi.importActual('@kadena/client');
  return {
    ...actual,
    isSignedTransaction: vi.fn(),
  };
});

vi.mock('../utils/txHelpers.js', async () => {
  const actual = await vi.importActual('../utils/txHelpers.js');
  return {
    ...actual,
    getClient: vi.fn(),
    logTransactionDetails: vi.fn(),
  };
});

import {
  clientInstances,
  pollRequests,
  sendTransactionAction,
} from '../commands/txSend.js';

describe('pollRequests wtihin txSend', () => {
  const mockClientInstances = new Map<string, IClient>();

  const mockClient: IClient = {
    pollStatus: vi.fn(),
  } as unknown as IClient;

  const originalClientInstances = new Map(clientInstances);

  beforeEach(() => {
    mockClientInstances.clear();
    vi.resetAllMocks();
  });

  afterEach(() => {
    clientInstances.clear();
    originalClientInstances.forEach((value, key) =>
      clientInstances.set(key, value),
    );
  });

  const mockTransaction: IUnsignedCommand = {
    cmd: '{"networkId":"network1","payload":{"exec":{"code":"","data":{}}},"signers":[],"meta":{"chainId":"0","sender":"","gasLimit":0,"gasPrice":0,"ttl":0,"creationTime":0},"nonce":"nonce"}',
    hash: 'hash',
    sigs: [],
  };

  const mockNetworkDetails: INetworkDetails = {
    network: 'network1',
    networkHost: 'http://localhost',
    networkId: 'network1',
    chainId: '0',
    networkExplorerUrl: 'http://localhost/explorer',
  };

  it('should log an error if no client is found for a request', async () => {
    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey1',
        clientKey: 'clientKey1',
        details: mockNetworkDetails,
        transaction: mockTransaction,
      },
    ];

    const logErrorSpy = vi.spyOn(log, 'error');

    await pollRequests(requestKeys);

    expect(logErrorSpy).toHaveBeenCalledWith(
      'No client found for requestKey: fakeRequestKey1 with clientKey: clientKey1. Polling will not be done for this request.',
    );
  });

  it('should handle polling success', async () => {
    mockClient.pollStatus = vi.fn().mockResolvedValue({
      fakeRequestKey2: { status: 'success', data: 'mockData' },
    });

    clientInstances.set('clientKey2', mockClient);

    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey2',
        clientKey: 'clientKey2',
        details: {
          ...mockNetworkDetails,
          networkId: 'network2',
          chainId: '1',
        },
        transaction: mockTransaction,
      },
    ];

    const logInfoSpy = vi.spyOn(log, 'info');

    await pollRequests(requestKeys);

    expect(logInfoSpy).toHaveBeenCalledWith(
      'Polling success for requestKey: fakeRequestKey2',
    );

    expect(displayTransactionResponse).toHaveBeenCalledWith(
      {
        data: 'mockData',
        status: 'success',
      },
      2,
    );
  });

  it('should handle polling error', async () => {
    mockClient.pollStatus = vi
      .fn()
      .mockRejectedValue(new Error('Polling failed'));

    clientInstances.set('clientKey3', mockClient);

    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey3',
        clientKey: 'clientKey3',
        details: {
          ...mockNetworkDetails,
          networkId: 'network3',
          chainId: '2',
        },
        transaction: mockTransaction,
      },
    ];

    const logErrorSpy = vi.spyOn(log, 'error');

    await pollRequests(requestKeys);

    expect(logErrorSpy).toHaveBeenCalledWith(
      'Polling error for requestKey: fakeRequestKey3, error:',
      new Error('Polling failed'),
    );
  });

  it('should log an error if polling fails entirely', async () => {
    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey5',
        clientKey: 'clientKey5',
        details: {
          ...mockNetworkDetails,
          networkId: 'network5',
          chainId: '4',
        },
        transaction: mockTransaction,
      },
    ];

    const logErrorSpy = vi.spyOn(log, 'error');

    await pollRequests(requestKeys);

    expect(logErrorSpy).toHaveBeenCalled();
  });

  it('should handle multiple request keys', async () => {
    mockClient.pollStatus = vi.fn().mockResolvedValue({
      fakeRequestKey1: { status: 'success', data: 'mockData1' },
      fakeRequestKey2: { status: 'success', data: 'mockData2' },
    });

    clientInstances.set('clientKey1', mockClient);

    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey1',
        clientKey: 'clientKey1',
        details: mockNetworkDetails,
        transaction: mockTransaction,
      },
      {
        requestKey: 'fakeRequestKey2',
        clientKey: 'clientKey1',
        details: mockNetworkDetails,
        transaction: mockTransaction,
      },
    ];

    const logInfoSpy = vi.spyOn(log, 'info');

    await pollRequests(requestKeys);

    expect(logInfoSpy).toHaveBeenCalledWith(
      'Polling success for requestKey: fakeRequestKey1',
    );
    expect(logInfoSpy).toHaveBeenCalledWith(
      'Polling success for requestKey: fakeRequestKey2',
    );
    expect(displayTransactionResponse).toHaveBeenCalledWith(
      {
        data: 'mockData1',
        status: 'success',
      },
      2,
    );
    expect(displayTransactionResponse).toHaveBeenCalledWith(
      {
        data: 'mockData2',
        status: 'success',
      },
      2,
    );
  });

  it('should handle partially successful polling', async () => {
    mockClient.pollStatus = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          fakeRequestKey1: { status: 'success', data: 'mockData' },
        }),
      )
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Polling failed')),
      );

    clientInstances.set('clientKey1', mockClient);

    const requestKeys: ISubmitResponse[] = [
      {
        requestKey: 'fakeRequestKey1',
        clientKey: 'clientKey1',
        details: mockNetworkDetails,
        transaction: mockTransaction,
      },
      {
        requestKey: 'fakeRequestKey2',
        clientKey: 'clientKey1',
        details: mockNetworkDetails,
        transaction: mockTransaction,
      },
    ];

    const logInfoSpy = vi.spyOn(log, 'info');
    const logErrorSpy = vi.spyOn(log, 'error');

    await pollRequests(requestKeys);

    expect(logInfoSpy).toHaveBeenCalledWith(
      'Polling success for requestKey: fakeRequestKey1',
    );
    expect(logErrorSpy).toHaveBeenCalledWith(
      'Polling error for requestKey: fakeRequestKey2, error:',
      new Error('Polling failed'),
    );
  });
});

describe('sendTransactionAction within txSend', () => {
  const mockClient = {
    local: vi.fn(),
    submit: vi.fn(),
  };

  const mockCommand: ICommand = {
    cmd: '{"networkId":"network1","payload":{"exec":{"code":"","data":{}}},"signers":[],"meta":{"chainId":"0","sender":"","gasLimit":0,"gasPrice":0,"ttl":0,"creationTime":0},"nonce":"nonce"}',
    hash: 'hash',
    sigs: [{ sig: 'signature' }],
  };

  const mockUnsignedCommand: IUnsignedCommand = {
    cmd: '{"networkId":"network1","payload":{"exec":{"code":"","data":{}}},"signers":[],"meta":{"chainId":"0","sender":"","gasLimit":0,"gasPrice":0,"ttl":0,"creationTime":0},"nonce":"nonce"}',
    hash: 'hash',
    sigs: [],
  };

  const mockNetworkDetails: INetworkDetails = {
    network: 'network1',
    networkHost: 'http://localhost',
    networkId: 'network1',
    chainId: '0',
    networkExplorerUrl: 'http://localhost/explorer',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient);
  });

  it('should process transactions successfully', async () => {
    (
      isSignedTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(true);
    mockClient.local.mockResolvedValue({ result: { status: 'success' } });
    mockClient.submit.mockResolvedValue({ requestKey: 'requestKey' });

    const transactionsWithDetails = [
      { command: mockCommand, details: mockNetworkDetails },
    ];

    const result: CommandResult<{ transactions: ISubmitResponse[] }> =
      await sendTransactionAction({ transactionsWithDetails });

    if (result.status === 'success') {
      expect(result.data.transactions).toHaveLength(1);
      expect(result.data.transactions[0].requestKey).toBe('requestKey');
    } else {
      throw new Error('Expected result status to be success');
    }
  });

  it('should handle invalid signed transactions', async () => {
    (
      isSignedTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(false);

    const transactionsWithDetails = [
      { command: mockUnsignedCommand, details: mockNetworkDetails },
    ];

    const result: CommandResult<{ transactions: ISubmitResponse[] }> =
      await sendTransactionAction({ transactionsWithDetails });

    if (result.status === 'error') {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Invalid signed transaction');
    } else {
      throw new Error('Expected result status to be error');
    }
  });

  it('should handle errors during local call', async () => {
    (
      isSignedTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(true);
    mockClient.local.mockResolvedValue({
      result: { status: 'failure', error: new Error('Local call failed') },
    });

    const transactionsWithDetails = [
      { command: mockCommand, details: mockNetworkDetails },
    ];

    const result: CommandResult<{ transactions: ISubmitResponse[] }> =
      await sendTransactionAction({ transactionsWithDetails });

    if (result.status === 'error') {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Error in processing transaction');
    } else {
      throw new Error('Expected result status to be error');
    }
  });

  it('should handle errors during submit call', async () => {
    (
      isSignedTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(true);
    mockClient.local.mockResolvedValue({ result: { status: 'success' } });
    mockClient.submit.mockRejectedValue(new Error('Submit call failed'));

    const transactionsWithDetails = [
      { command: mockCommand, details: mockNetworkDetails },
    ];

    const result: CommandResult<{ transactions: ISubmitResponse[] }> =
      await sendTransactionAction({ transactionsWithDetails });

    if (result.status === 'error') {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Error in processing transaction');
    } else {
      throw new Error('Expected result status to be error');
    }
  });

  it('should handle partial success with warnings', async () => {
    (
      isSignedTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(true);
    mockClient.local.mockResolvedValueOnce({ result: { status: 'success' } });
    mockClient.local.mockResolvedValueOnce({
      result: { status: 'failure', error: new Error('Local call failed') },
    });
    mockClient.submit.mockResolvedValue({ requestKey: 'requestKey' });

    const transactionsWithDetails = [
      { command: mockCommand, details: mockNetworkDetails },
      { command: mockCommand, details: mockNetworkDetails },
    ];

    const result: CommandResult<{ transactions: ISubmitResponse[] }> =
      await sendTransactionAction({ transactionsWithDetails });

    if (result.status === 'success') {
      expect(result.data.transactions).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
    } else {
      throw new Error('Expected result status to be success with warnings');
    }
  });
});
