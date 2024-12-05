import { ConventionalAuction } from '@/components/Sale/ConventionalAuction';
import { useAccount } from '@/hooks/account';
import { Bid, useGetBids } from '@/hooks/getBids';
import { Sale } from '@/hooks/getSales';
import { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { getAuctionDetails } from '@kadena/client-utils/marmalade';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';

// Mocking the custom hooks and functions
vi.mock('@/hooks/account');
vi.mock('next/navigation');
vi.mock('@/hooks/getBids');
vi.mock('@kadena/client-utils/marmalade');

const mockUseAccount = vi.mocked(useAccount);
const mockGetAuctionDetails = vi.mocked(getAuctionDetails);
const mockGetBids = vi.mocked(useGetBids);

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

describe('ConventionalAuction component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders the component and fetches tokens', async () => {
    const mockAccount = {
      accountName: 'test-account',
      alias: 'test-alias',
      pendingTxIds: [],
      credentials: [],
    };
    const mockAccountContext = { ...dummyAccountContext, account: mockAccount };

    const mockAuctionDetails = {
      'reserve-price': 1.5,
      'token-id': 't:oW7xOwPkIdJ84Y8eQnrST9c_lR4CNbuOr839iZkaiAI',
      'highest-bid': 2,
      'end-date': {
        int: 1800328561,
      },
      'highest-bid-id': '--uZUZWmb_pl6eVXJb1n-d1aszQRXEiihULzghChrBA',
      'start-date': {
        int: 1719327971,
      },
    };

    const mockBids = [
      {
        bid: 800,
        bidder: {
          account:
            'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
        },
      },
    ];

    mockUseAccount.mockReturnValue(
      mockAccountContext as unknown as IAccountContext,
    );
    mockGetAuctionDetails.mockReturnValue(Promise.resolve(mockAuctionDetails));

    mockGetBids?.mockReturnValue({
      data: mockBids as Bid[],
      loading: false,
      error: null,
      refetch: () => Promise.resolve(),
    });

    const mockSale = {
      tokenId: 't:E9e-YioI69qxedpzNgJfNv7H1dOcLY3ydKOeRPB96sE',
      chainId: '0',
      saleId: '8ORpk9kKkKwotwOzzS-370Yl0h9UY7lv7tLduou376I',
      status: 'CREATED',
      amount: 800,
      timeoutAt: 1800361527343,
      seller: {
        account:
          'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
        keyset: {
          pred: 'keys-all',
          keys: [
            '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
          ],
        },
      },
    };

    render(
      <ConventionalAuction
        sale={mockSale as unknown as Sale}
        tokenImageUrl=""
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Reserve Price: 1.5/)).toBeInTheDocument();
      expect(screen.getByText(/Start Date:/)).toBeInTheDocument();
      expect(screen.getByText(/End Date:/)).toBeInTheDocument();
      expect(screen.getByText(/800/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937/,
        ),
      ).toBeInTheDocument();
    });
  });
});
