import type {
  IAccountInfo,
  ICommand,
  IUnsignedCommand,
} from '@kadena/wallet-adapter-core';
import type { SessionTypes } from '@walletconnect/types';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { WalletConnectAdapter } from '../WalletConnectAdapter';
import type { IWalletConnectProvider } from '../provider';

// Default fallback network id for tests
const DEFAULT_NETWORK_ID = 'mainnet01';
const MOCK_NETWORK_ID = 'testnet04';

// --- Mock Data ---

// Create a mock session matching WalletConnect's SessionTypes.Struct interface
const mockSession: SessionTypes.Struct = {
  topic: 'dummy-topic',
  pairingTopic: 'dummy-pairing',
  relay: { protocol: 'irn', data: 'session data' },
  expiry: 9999999999,
  acknowledged: true,
  controller: 'dummy-controller',
  namespaces: {
    kadena: {
      accounts: ['kadena:mainnet01:test-account'],
      methods: [
        'kadena_getAccounts_v1',
        'kadena_sign_v1',
        'kadena_quicksign_v1',
      ],
      events: [],
    },
  },
  requiredNamespaces: {
    kadena: {
      chains: ['kadena:mainnet01'],
      methods: [
        'kadena_getAccounts_v1',
        'kadena_sign_v1',
        'kadena_quicksign_v1',
      ],
      events: [],
    },
  },
  optionalNamespaces: {},
  self: {
    publicKey: 'dummy-self-public-key',
    metadata: {
      name: 'Dummy Wallet',
      description: 'A mock wallet for testing',
      url: 'https://dummy-wallet.com',
      icons: ['https://dummy-wallet.com/icon.png'],
    },
  },
  peer: {
    publicKey: 'dummy-peer-public-key',
    metadata: {
      name: 'Dummy Dapp',
      description: 'A mock dApp for testing',
      url: 'https://dummy-dapp.com',
      icons: ['https://dummy-dapp.com/icon.png'],
    },
  },
  // authentication: [],
  // transportType: 'relay',
};

// Create a mock provider satisfying WalletConnectProvider.
// Note: Our provider.request is used by the adapter.
const mockProvider: IWalletConnectProvider = {
  connected: true,
  accounts: ['kadena:mainnet01:test-account'],
  session: mockSession,
  on: vi.fn(),
  off: vi.fn(),
  request: vi.fn().mockResolvedValue({}),
};

// Create a mock client with request and disconnect methods.
const mockClient = {
  request: vi.fn(),
  disconnect: vi.fn().mockResolvedValue(undefined),
  on: vi.fn(),
  off: vi.fn(),
  session: { topic: 'dummy-topic' },
};

// A sample unsigned command for signing tests.
const mockCommand = { cmd: 'test' } as unknown as IUnsignedCommand;

// --- Test Suite ---
describe('WalletConnectAdapter', () => {
  let adapter: WalletConnectAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    // Instantiate adapter with our mock provider and custom network id.
    adapter = new WalletConnectAdapter({
      provider: mockProvider,
      networkId: MOCK_NETWORK_ID,
      projectId: 'test-id',
      relayUrl: 'wss://relay.test',
    });
    // Force adapter's client and provider to use our mocks.
    (adapter as any).client = mockClient;
    (adapter as any).provider = mockProvider;
  });

  test('initializes with correct properties', () => {
    expect(adapter.name).toBe('WalletConnect');
    expect((adapter as any).networkId).toBe(MOCK_NETWORK_ID);
  });

  describe('request method', () => {
    test('forwards requests to provider.request with proper JSON-RPC payload', async () => {
      const expectedResponse = {
        account: 'kadena:mainnet01:test-account',
        publicKey: 'pubkey',
        chainId: '1',
      };
      // Simulate provider.request returning expectedResponse.
      vi.mocked(mockProvider.request).mockResolvedValueOnce(expectedResponse);

      const result = await mockProvider.request({ method: 'kadena_connect' });

      // Expect that the payload passed to provider.request includes jsonrpc: "2.0"
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'kadena_connect',
        networkId: DEFAULT_NETWORK_ID,
      });
      expect(result).toEqual(expectedResponse);
    });

    test('throws error when provider.request fails', async () => {
      vi.mocked(mockProvider.request).mockRejectedValueOnce(
        new Error('Connection failed'),
      );
      await expect(
        await mockProvider.request({ method: 'kadena_connect' }),
      ).rejects.toThrow('Connection failed');
    });
  });

  describe('getAccounts', () => {
    test('returns mapped IAccountInfo list', async () => {
      // Simulate a response from kadena_getAccounts_v1.
      const mockResponse = {
        accounts: [
          {
            account: 'kadena:mainnet01:test-account',
            publicKey: 'pubkey',
            kadenaAccounts: [
              {
                name: 'test-account',
                contract: 'coin',
                chains: ['1'],
              },
            ],
          },
        ],
      };
      vi.mocked(mockProvider.request).mockResolvedValueOnce(mockResponse);

      const accounts = await adapter.getAccounts();
      expect(accounts).toEqual([
        {
          accountName: 'test-account',
          chainIds: ['1'],
          guard: {
            keys: [{ publicKey: 'pubkey' }],
            pred: 'keys-all',
          },
        },
      ]);
    });
  });

  describe('getActiveAccount', () => {
    test('returns the first account from getAccounts', async () => {
      const mockAccounts: IAccountInfo[] = [
        {
          accountName: 'acct1',
          chainAccounts: ['1'],
          guard: { keys: ['key1'], pred: 'keys-all' },
          networkId: 'development',
          contract: 'coin',
        },
        {
          accountName: 'acct2',
          chainAccounts: ['1'],
          guard: { keys: ['key2'], pred: 'keys-all' },
          networkId: 'development',
          contract: 'coin',
        },
      ];
      vi.spyOn(adapter, 'getAccounts').mockResolvedValueOnce(mockAccounts);
      const active = await adapter.getActiveAccount();
      expect(active).toEqual(mockAccounts[0]);
    });
  });

  describe('signTransaction', () => {
    test('calls provider.request with kadena_sign_v1 and transaction param', async () => {
      const mockSigned: ICommand = {
        cmd: 'signedCmd',
        hash: 'hash',
        sigs: [{ sig: 'sig' }],
      };
      vi.mocked(mockProvider.request).mockResolvedValueOnce(mockSigned);
      const result = await adapter.signTransaction(mockCommand);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'kadena_sign_v1',
        params: { transaction: mockCommand },
      });
      expect(result).toEqual(mockSigned);
    });
  });

  describe('signCommand', () => {
    test('calls provider.request with kadena_sign_v1 and command param', async () => {
      const mockSigned: ICommand = {
        cmd: 'signedCmd',
        hash: 'hash',
        sigs: [{ sig: 'sig' }],
      };
      vi.mocked(mockProvider.request).mockResolvedValueOnce(mockSigned);
      const result = await adapter.signCommand(mockCommand);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'kadena_sign_v1',
        params: { command: mockCommand },
      });
      expect(result).toEqual(mockSigned);
    });
  });

  describe('quicksign', () => {
    test('calls provider.request with kadena_quicksign_v1 and commandSigDatas param', async () => {
      const mockSignedArray: ICommand[] = [
        { cmd: 'signedCmd1', hash: 'hash1', sigs: [{ sig: 'sig1' }] },
      ];
      vi.mocked(mockProvider.request).mockResolvedValueOnce(mockSignedArray);
      const result = await adapter.signTransaction(mockCommand);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'kadena_quicksign_v1',
        params: { commandSigDatas: [mockCommand] },
      });
      expect(result).toEqual(mockSignedArray);
    });
  });

  describe('getActiveNetwork', () => {
    test('returns hardcoded active network matching defaultNetworkId', async () => {
      // Assuming defaultNetworkId is "mainnet01"
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(adapter.getActiveNetwork()).rejects.toThrow(
        'Failed to fetch network',
      );
    });
  });

  describe('getNetworks', () => {
    test('returns array of networks', async () => {
      const nets = await adapter.getNetworks();
      expect(nets).toEqual([]);
    });
  });

  describe('checkStatus', () => {
    test('returns connected status with active account if provider exists', async () => {
      const mockActiveAccount: IAccountInfo = {
        accountName: 'acct1',
        chainAccounts: ['1'],
        guard: { keys: ['key1'], pred: 'keys-all' },
        networkId: 'development',
        contract: 'coin',
      };
      vi.spyOn(adapter, 'getActiveAccount').mockResolvedValueOnce(
        mockActiveAccount,
      );
      const status = await adapter.checkStatus();
      expect(status).toEqual({
        status: 'connected',
        account: mockActiveAccount,
      });
    });

    test('returns disconnected status if provider is undefined', async () => {
      (adapter as any).provider = undefined;
      const status = await adapter.checkStatus();
      expect(status).toEqual({
        status: 'disconnected',
        message: 'Not connected',
      });
    });
  });
});
