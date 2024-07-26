import { networkConstants as mockedNetworkConstants } from '../../__mocks__/network.mock';
import { getDefaultNetworks } from '../getDefaultNetworks';

describe('getDefaultNetworks', () => {
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

  it('should return the default networks', () => {
    const result = getDefaultNetworks();
    expect(result).toEqual(mockedNetworkConstants);
  });
});
