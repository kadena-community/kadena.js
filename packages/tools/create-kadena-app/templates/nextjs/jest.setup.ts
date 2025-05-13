import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

const MOCKED_ACCOUNT = 'k:account';

jest.mock('@kadena/wallet-adapter-react', () => ({
  useKadenaWallet: () => ({
    client: {
      connect: jest.fn().mockResolvedValue({ accountName: MOCKED_ACCOUNT }),
    },
    providerData: [{ name: 'Ecko Wallet', detected: true }],
  }),
}));
