// test-setup.ts - Angular test setup with wallet adapter mocks (jasmine-dependent)

// Mock wallet adapter core
const mockWalletClient = {
  connect: jasmine.createSpy('connect').and.returnValue(
    Promise.resolve({
      accountName: 'k:test-account',
      keyset: { keys: [], pred: 'keys-all' },
      existsOnChains: [],
    }),
  ),
  isDetected: jasmine.createSpy('isDetected').and.returnValue(true),
  onAccountChange: jasmine.createSpy('onAccountChange'),
  onNetworkChange: jasmine.createSpy('onNetworkChange'),
  getActiveNetwork: jasmine.createSpy('getActiveNetwork').and.returnValue(
    Promise.resolve({
      network: 'testnet04',
      chainId: '1',
    }),
  ),
  signTransaction: jasmine
    .createSpy('signTransaction')
    .and.returnValue(Promise.resolve({})),
  getAccount: jasmine.createSpy('getAccount').and.returnValue(
    Promise.resolve({
      accountName: 'k:test-account',
      keyset: { keys: [], pred: 'keys-all' },
      existsOnChains: [],
    }),
  ),
};

// Global mock for wallet adapter
(window as any).mockWalletClient = mockWalletClient;