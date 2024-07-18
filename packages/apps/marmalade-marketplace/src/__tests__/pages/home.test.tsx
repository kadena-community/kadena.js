import { expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/index'
import { Sale, getSales } from '@/hooks/getSales';

// Mocking the custom hooks and functions
vi.mock('@/hooks/getSales');

const mockGetSales = vi.mocked(getSales);

// Mocking the Token component
vi.mock('@/components/Token', () => ({
  Token: ({ tokenId }: { tokenId: string }) => <div>{tokenId}</div>,
}));

describe('Home component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders the component and fetches sales', async () => {
    const mockSales = [
      {
        tokenId: "t:E9e-YioI69qxedpzNgJfNv7H1dOcLY3ydKOeRPB96sE",
        chainId: "0",
        saleId: "8ORpk9kKkKwotwOzzS-370Yl0h9UY7lv7tLduou376I"
      }
    ];

    mockGetSales.mockReturnValue({
      data: mockSales as Sale[],
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    });

    render(<Home />);

    // Check if texts are rendered correctly
    expect(screen.getByText('Active sales')).toBeInTheDocument();
    expect(screen.getByText('Past sales')).toBeInTheDocument();

    // Check if tokens are fetched and displayed
    await waitFor(() => {
      mockSales.forEach(sale => {
        expect(screen.getByText(sale.tokenId)).toBeInTheDocument();
      });
    });
  });

  test('displays "No sales found" when there are no sales indexed', async () => {

    mockGetSales.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: () => Promise.resolve()
    });

    render(<Home />);

    // Check if "No sales found" is displayed
    await waitFor(() => {
      expect(screen.getByText('No sales found')).toBeInTheDocument();
    });
  });
});
