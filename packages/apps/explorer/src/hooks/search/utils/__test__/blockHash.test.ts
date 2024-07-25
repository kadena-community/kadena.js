import { renderHook } from '@testing-library/react-hooks';
import { useBlockHash } from '../blockHash';
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
      useBlockHash('', SearchOptionEnum.ACCOUNT),
    );
    expect(result.current.loading).toEqual(false);
  });

  it('should add a toast when there is an error', () => {
    mocks.useQuery.mockReturnValue({
      error: 'test',
    });
    const { result } = renderHook(() =>
      useBlockHash('123', SearchOptionEnum.BLOCKHASH),
    );

    console.log(result.current);
    expect(mocks.addToast).toBeCalledTimes(1);
    expect(mocks.addToast).toBeCalledWith({
      body: 'Loading of block data failed',
      label: 'Something went wrong',
      type: 'negative',
    });
  });

  it('should call setQueries when there is a searchquery', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: {},
    });
    renderHook(() => useBlockHash('123', SearchOptionEnum.BLOCKHASH));

    expect(mocks.addToast).toBeCalledTimes(0);
    expect(mocks.setQueries).toBeCalledTimes(1);
  });
});
