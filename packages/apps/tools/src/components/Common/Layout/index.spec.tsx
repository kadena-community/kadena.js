jest.mock('@/components/Common/WalletConnectButton', () =>
  jest.fn(() => <button>connect wallet</button>),
);

import Layout from './index';

import { render } from '@testing-library/react';
import React from 'react';

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
