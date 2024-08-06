import { act, renderHook } from '@testing-library/react-hooks';
import { useSearch } from '..';
import { SearchOptionEnum } from '../utils/utils';

const mocks = vi.hoisted(() => {
  return {
    useQuery: vi.fn(),
    routerPush: vi.fn(),
    addToast: vi.fn(),
    query: {},
  };
});

describe('useSearch', () => {
  beforeEach(async () => {
    vi.mock('./../../router', async (importOriginal) => {
      const actual = (await importOriginal()) as any;
      return {
        ...actual,
        useRouter: () => ({
          ...actual.useRouter,
          query: mocks.query,
          push: mocks.routerPush,
        }),
      };
    });
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
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should router.push the new query when there is a searchQuery and a SearchOption', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
    });

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('coin.TRANSFER');
      result.current.setSearchOption(SearchOptionEnum.EVENT);
    });

    expect(mocks.routerPush).toBeCalledTimes(1);
    expect(mocks.routerPush).toBeCalledWith('/?q=coin.TRANSFER&so=4');
  });

  it('should search when there is a searchquery and searchoption in the url', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: [{ id: 1 }],
    });
    mocks.query = {
      q: 'he-man',
      so: 0,
    };

    const { result } = renderHook(() => useSearch());
    expect(result.current.searchOption).toBe(0);
    expect(result.current.searchQuery).toBe('he-man');
  });
});
