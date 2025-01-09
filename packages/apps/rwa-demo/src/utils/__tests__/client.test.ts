import { getClient, getNetwork } from '../client';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
    CHAINWEBAPIURL: 'https://kadena.io',
    CHAINID: '1',
    NETWORKNAME: 'he-man',
    GRAPHURL: 'https://graph.kadena.io',
    NETWORKHOST: 'https://kadena.io',
    NETWORKID: 'development',
  };
});

vi.mock('./../env');

describe('client utils', () => {
  beforeEach(() => {
    global.fetch = mocks.fetch;
    vi.mock('./../env', async (importOriginal) => {
      const actual = (await importOriginal()) as {};

      return {
        ...actual,
        env: {
          CHAINWEBAPIURL: mocks.CHAINWEBAPIURL,
          CHAINID: mocks.CHAINID,
          NETWORKNAME: mocks.NETWORKNAME,
          NETWORKID: mocks.NETWORKID,
          GRAPHURL: mocks.GRAPHURL,
          NETWORKHOST: mocks.NETWORKHOST,
        },
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  describe('getNetwork', () => {
    it('should return the network with the correct env variables', () => {
      const result = getNetwork();
      expect(result).toEqual({
        name: 'he-man',
        networkId: 'development',
        host: 'https://kadena.io',
        chainId: '1',
        graphUrl: 'https://graph.kadena.io',
      });
    });
  });
  describe('getClient', () => {
    it('should return the client with the given url, when url is given as prop', async () => {
      mocks.fetch.mockResolvedValue('123');
      const client = getClient('https://kadena.io');

      await client.getStatus([
        { requestKey: '1234', chainId: '1', networkId: 'development' },
      ]);
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.fetch).toBeCalledWith('https://kadena.io/api/v1/poll', {
        body: '{"requestKeys":["1234"]}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    });
    it('should return the client with the env variable CHAINWEBAPIURL, when NO url is given as prop', async () => {
      mocks.fetch.mockResolvedValue('123');
      const client = getClient();

      await client.getStatus([
        { requestKey: '1234', chainId: '1', networkId: 'development' },
      ]);
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.fetch).toBeCalledWith('https://kadena.io/api/v1/poll', {
        body: '{"requestKeys":["1234"]}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    });
  });
});
