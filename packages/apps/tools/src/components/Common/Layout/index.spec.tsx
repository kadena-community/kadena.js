jest.mock('@/components/Common/WalletConnectButton', () =>
  jest.fn(() => <button>connect wallet</button>),
);
jest.mock('@/context/connect-wallet-context', () =>
  jest.fn(() => ({
    client: jest.fn(),
    session: undefined,
    connect: jest.fn(),
    disconnect: jest.fn(),
    isInitializing: false,
    pairings: undefined,
    accounts: undefined,
    selectedNetwork: '',
    setSelectedNetwork: jest.fn(),
    selectedChain: '',
    setSelectedChain: jest.fn(),
    selectedAccount: '',
    setSelectedAccount: jest.fn(),
  })),
);
import { render } from '@testing-library/react';
import React from 'react';
import Layout from './index';

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
