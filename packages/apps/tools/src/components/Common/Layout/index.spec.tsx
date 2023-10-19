import { render } from '@testing-library/react';
import React from 'react';
import Layout from './index';

vi.mock('@/components/Common/WalletConnectButton', () => ({
  default: vi.fn(() => <button>connect wallet</button>),
}));

vi.mock('@/context/connect-wallet-context', () => ({
  useWalletConnectClient: vi.fn(() => ({
    client: vi.fn(),
    session: undefined,
    connect: vi.fn(),
    disconnect: vi.fn(),
    isInitializing: false,
    pairings: undefined,
    accounts: undefined,
    selectedNetwork: '',
    setSelectedNetwork: vi.fn(),
    selectedChain: '',
    setSelectedChain: vi.fn(),
    selectedAccount: '',
    setSelectedAccount: vi.fn(),
    networksData: [],
    setNetworksData: vi.fn(),
  })),
}));

describe('Layout', () => {
  it.skip('renders correctly', () => {
    const { getByTestId, getByRole } = render(<Layout>Hello, World!</Layout>);

    // Assert that the layout container element is rendered
    const layoutContainer = getByTestId('layout-container');
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveClass('layout');

    // Assert that the main content element is rendered
    const mainContent = getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveTextContent('Hello, World!');
  });
});
