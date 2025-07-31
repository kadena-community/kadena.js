import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

const MOCKED_ACCOUNT = 'k:account';

// Mock canvas before anything else loads
jest.mock('canvas', () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({})),
    width: 0,
    height: 0,
    toDataURL: jest.fn(() => ''),
    toBuffer: jest.fn(() => Buffer.alloc(0)),
  })),
  loadImage: jest.fn(() => Promise.resolve({})),
  registerFont: jest.fn(),
}));

jest.mock('@kadena/wallet-adapter-react', () => ({
  useKadenaWallet: () => ({
    client: {
      connect: jest.fn(async () => ({ 
        accountName: MOCKED_ACCOUNT,
        keyset: { keys: [], pred: 'keys-all' },
        existsOnChains: []
      })) as any,
      isDetected: jest.fn(() => true),
      onAccountChange: jest.fn(),
      onNetworkChange: jest.fn(),
      getActiveNetwork: jest.fn(async () => ({ network: 'testnet04', chainId: '1' })),
    },
    providerData: [{ name: 'Ecko Wallet', detected: true }],
  }),
}));
