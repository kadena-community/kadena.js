import { networkConstants as mockedNetworkConstants } from '../../__mocks__/network.mock';
import { isDefaultNetwork } from '../isDefaultNetwork';

describe('isDefaultNetwork', () => {
  beforeEach(() => {
    vi.mock('./../../constants/network', async (importOriginal) => {
      const actual = (await importOriginal()) as {};
      const mocks = await import('./../../__mocks__/network.mock');
      return {
        ...actual,
        networkConstants: mocks.networkConstants,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if the network is a default network', () => {
    const result = isDefaultNetwork(mockedNetworkConstants[0]);
    expect(result).toBe(true);
  });

  it('should return true if the network is a default network', () => {
    const network = { ...mockedNetworkConstants[0], slug: 'he-man' };
    const result = isDefaultNetwork(network);
    expect(result).toBe(false);
  });
});
