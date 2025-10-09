import { checkNetwork } from '../checkNetwork';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

describe('checkNetwork', () => {
  beforeEach(async () => {
    vi.stubGlobal('fetch', mocks.fetch);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call fetch with the correct params', async () => {
    await checkNetwork('https://kadena.io');
    expect(mocks.fetch).toBeCalledTimes(1);
    expect(mocks.fetch).toBeCalledWith('https://kadena.io', {
      body: '{"query":"query networkInfo {\\n                  networkInfo {\\n                    totalDifficulty\\n                    networkId\\n                  }\\n                }","variables":{},"operationName":"networkInfo","extensions":{}}',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
      method: 'POST',
      credentials: 'omit',
      mode: 'cors',
    });
  });
});
