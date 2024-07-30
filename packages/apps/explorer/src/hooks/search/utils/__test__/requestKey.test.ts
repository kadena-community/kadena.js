import { renderHook } from '@testing-library/react-hooks';
import { useRequestKey } from '../requestKey';
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
      useRequestKey('', SearchOptionEnum.ACCOUNT),
    );
    expect(result.current.loading).toEqual(false);
  });

  it('should add a toast when there is an error', () => {
    mocks.useQuery.mockReturnValue({
      error: 'test',
    });
    renderHook(() => useRequestKey('123', SearchOptionEnum.REQUESTKEY));

    expect(mocks.addToast).toBeCalledTimes(1);
    expect(mocks.addToast).toBeCalledWith({
      body: 'Loading of requestKey data failed',
      label: 'Something went wrong',
      type: 'negative',
    });
  });

  it('should call setQueries when there is a searchquery', () => {
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: {},
    });
    renderHook(() => useRequestKey('123', SearchOptionEnum.REQUESTKEY));

    expect(mocks.addToast).toBeCalledTimes(0);
    expect(mocks.setQueries).toBeCalledTimes(1);
  });
});
