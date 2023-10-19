jest.mock('@kadena/chainweb-node-client', () => ({
  __esModule: true,
  ...jest.requireActual('@kadena/chainweb-node-client'),
  spv: jest.fn(),
}));
import { spv } from '@kadena/chainweb-node-client';
import { withCounter } from '../../utils/utils';
import { getSpv, pollSpv } from '../spv';

describe('getSpv', () => {
  it('calls /spv endpoint to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    (spv as jest.Mock).mockResolvedValue(response);

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await getSpv(hostUrl, requestKey, targetChainId);

    expect(result).toBe(response);

    expect(spv).toBeCalledWith({ requestKey, targetChainId }, hostUrl);
  });

  it('throws exception if spv function does not return string', async () => {
    const response = { key: 'any' };

    (spv as jest.Mock).mockResolvedValue(response);

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    await expect(() =>
      getSpv(hostUrl, requestKey, targetChainId),
    ).rejects.toThrowError(new Error('PROOF_IS_NOT_AVAILABLE'));

    expect(spv).toBeCalledWith({ requestKey, targetChainId }, hostUrl);
  });
});

describe('pollSpv', () => {
  it('calls /spv endpoint several times to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    (spv as jest.Mock).mockImplementation(
      withCounter(async (counter) => {
        if (counter < 5) {
          return Promise.reject('not found');
        }
        return Promise.resolve(response);
      }),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await pollSpv(hostUrl, requestKey, targetChainId, {
      interval: 10,
    });

    expect(spv).toBeCalledTimes(5);

    expect(result).toBe(response);
  });
});
