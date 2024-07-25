import { renderHook } from '@testing-library/react-hooks';
import { useAccount } from '../account';
import { SearchOptionEnum } from '../utils';

const mocks = vi.hoisted(() => {
  return {
    useQuery: vi.fn(),
    addToast: vi.fn(),
    setQueries: vi.fn(),
  };
});

describe('useEvent', () => {
  beforeEach(async () => {
    vi.mock('@apollo/client', async (importOriginal) => {
      const actual = (await importOriginal()) as {};
      return {
        ...actual,
        useQuery: mocks.useQuery,
      };
    });

    vi.mock('@/components/Toast/ToastContext/ToastContext', async () => {
      return {
        useToast: () => {
          return {
            addToast: mocks.addToast,
          };
        },
      };
    });

    vi.mock('@/context/queryContext', async () => {
      return {
        useQueryContext: () => {
          return {
            setQueries: mocks.setQueries,
          };
        },
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty data when there is no searchquery', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() =>
      useAccount('', SearchOptionEnum.ACCOUNT),
    );
    expect(result.current.loading).toEqual(false);
  });

  it('should add a toast when there is an error', () => {
    mocks.useQuery.mockReturnValue({
      error: 'test',
    });
    const { result } = renderHook(() =>
      useAccount('123', SearchOptionEnum.ACCOUNT),
    );

    console.log(result.current);
    expect(mocks.addToast).toBeCalledTimes(1);
    expect(mocks.addToast).toBeCalledWith({
      body: 'Loading of account data failed',
      label: 'Something went wrong',
      type: 'negative',
    });
  });

  it('should call setQueries when there is a searchquery', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: {},
    });
    renderHook(() => useAccount('123', SearchOptionEnum.ACCOUNT));

    expect(mocks.addToast).toBeCalledTimes(0);
    expect(mocks.setQueries).toBeCalledTimes(1);
  });

  it('should return cleanedData', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: {
        fungibleAccount: {
          accountName: 'heman',
          totalBalance: 0,
          chainAccounts: [
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: '0',
              },
            },
            {
              chainId: 'keys-all',
              balance: 10,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 12,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 1,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
          ],
        },
      },
    });
    const { result } = renderHook(() =>
      useAccount('123', SearchOptionEnum.ACCOUNT),
    );

    expect(result.current.data).toEqual([
      {
        predicate: '0',
        key: '0',
        chains: 1,
        balance: 0,
        accountName: 'heman',
      },
      {
        predicate: 'keys-any',
        key: '0',
        chains: 4,
        balance: 23,
        accountName: 'heman',
      },
    ]);
  });

  it('should return empty data when loading', () => {
    mocks.useQuery.mockReturnValue({
      loading: true,
      data: {
        fungibleAccount: {
          accountName: 'heman',
          totalBalance: 0,
          chainAccounts: [
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: '0',
              },
            },
            {
              chainId: 'keys-all',
              balance: 10,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 12,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 1,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
          ],
        },
      },
    });
    const { result } = renderHook(() =>
      useAccount('123', SearchOptionEnum.ACCOUNT),
    );

    expect(result.current.data).toEqual([]);
  });

  it('should return empty data when searchoption is not ACCOUNT', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: {
        fungibleAccount: {
          accountName: 'heman',
          totalBalance: 0,
          chainAccounts: [
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: '0',
              },
            },
            {
              chainId: 'keys-all',
              balance: 10,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 12,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 0,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
            {
              chainId: '0',
              balance: 1,
              guard: {
                keys: ['0'],
                predicate: 'keys-any',
              },
            },
          ],
        },
      },
    });
    const { result } = renderHook(() =>
      useAccount('123', SearchOptionEnum.BLOCKHASH),
    );

    expect(result.current.data).toEqual([]);
  });
});
