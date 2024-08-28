import { expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount } from '@/hooks/account';
import { getTokens } from '@/graphql/queries/client';
import MyTokens from '@/pages/mytokens'

// Mocking the custom hooks and functions
vi.mock('@/hooks/account');
vi.mock('@/graphql/queries/client');
vi.mock("@kadena/client-utils/webauthn");

const mockUseAccount = vi.mocked(useAccount);
const mockGetTokens = vi.mocked(getTokens);

// Mocking the Token component
vi.mock('@/components/Token', () => ({
  Token: ({ tokenId }: { tokenId: string }) => <div>{tokenId}</div>,
}));

const dummyAccountContext = {
  account: null,
  isMounted: false,
  login: () => {},
  logout: () => {},
};

describe('MyTokens component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders the component and fetches tokens', async () => {
    const mockAccount = {
      accountName: 'r:test-account',
      alias: 'test-alias',
      pendingTxIds: [],
      credentials: [],
      minApprovals: 1,
      minRegistrationApprovals: 1,
      balance: '0',
      devices: [],
      networkId: 'testnet04',
      chainIds: [],
      txQueue: [],
    };

    const mockAccountContext = { ...dummyAccountContext, account: mockAccount };

    const mockTokens = [
      { accountName: 'r:test-account', balance: 15, tokenId: '1', chainId: '1' },
      { accountName: 'r:test-account', balance: 1, tokenId: '2', chainId: '1' },
    ];

    mockUseAccount.mockReturnValue(mockAccountContext);
    mockGetTokens.mockResolvedValue(mockTokens);

    render(<MyTokens />);

    // Check if the title is rendered
    expect(screen.getByText('My Tokens')).toBeInTheDocument();

    // Check if tokens are fetched and displayed
    await waitFor(() => {
      mockTokens.forEach(token => {
        expect(screen.getByText(token.tokenId)).toBeInTheDocument();
      });
    });
  });

  test('displays "No tokens found" when there are no tokens', async () => {
    const mockAccount = {
      accountName: 'test-account',
      alias: 'test-alias',
      pendingTxIds: [],
      credentials: [],
      minApprovals: 1,
      minRegistrationApprovals: 1,
      balance: '0',
      devices: [],
      networkId: 'testnet04',
      chainIds: [],
      txQueue: [],
    };
    const mockTokens: any[] = [];
    const mockAccountContext = { ...dummyAccountContext, account: mockAccount };

    mockUseAccount.mockReturnValue(mockAccountContext);
    mockGetTokens.mockResolvedValue(mockTokens);

    render(<MyTokens />);

    // Check if the title is rendered
    expect(screen.getByText('My Tokens')).toBeInTheDocument();

    // Check if "No tokens found" is displayed
    await waitFor(() => {
      expect(screen.getByText('No tokens found')).toBeInTheDocument();
    });
  });

  test('does not fetch tokens if account name is not provided', async () => {
    const mockAccountContext = { ...dummyAccountContext, account: undefined };
    mockUseAccount.mockReturnValue(mockAccountContext);
    render(<MyTokens />);

    // Check if the title is rendered
    expect(screen.getByText('My Tokens')).toBeInTheDocument();

    // Ensure getTokens is not called
    await waitFor(() => {
      expect(mockGetTokens).not.toHaveBeenCalled();
    });

    // Check if "No tokens found" is displayed
    expect(screen.getByText('No tokens found')).toBeInTheDocument();
  });
});