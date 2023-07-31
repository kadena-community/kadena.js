import { getHostUrl } from '../getHostUrl';

describe('getHostUrl', () => {
  it('returns hostUrl for mainnet', () => {
    const getUrl = getHostUrl();
    expect(getUrl({ networkId: 'mainnet01', chainId: '0' })).toBe(
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/pact',
    );
  });

  it('returns hostUrl for testnet', () => {
    const getUrl = getHostUrl();
    expect(getUrl({ networkId: 'testnet04', chainId: '0' })).toBe(
      'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact',
    );
  });

  it('returns hostUrl for custom host from the input', () => {
    const getUrl = getHostUrl({ 'a-custom-host': 'http://a-custom-host' });
    expect(getUrl({ networkId: 'a-custom-host', chainId: '0' })).toBe(
      'http://a-custom-host/chainweb/0.0/a-custom-host/chain/0/pact',
    );
  });
});
