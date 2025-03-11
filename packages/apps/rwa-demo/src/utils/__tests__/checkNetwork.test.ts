import { checkNetwork } from '../checkNetwork';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

describe('checkNetwork', () => {
  beforeEach(() => {
    global.fetch = mocks.fetch;
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should do a fetch with the correct props and return response', async () => {
    mocks.fetch.mockResolvedValue('called');
    const result = await checkNetwork('https://kadena.io');
    expect(mocks.fetch).toBeCalledTimes(1);
    expect(result).toEqual('called');
  });
});
