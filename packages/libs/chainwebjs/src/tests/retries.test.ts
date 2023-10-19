import chainweb from '..';
import { parseResponse } from '../internal';
import { chainUrl } from '../request';
import { config } from './config';
/* ************************************************************************** */
/* Retries */

describe('retry', () => {
  it('hould throw after 2 retries when address is invalid', async () => {
    let c = 0;
    const opts = { retries: 1, minTimeout: 20, onFailedAttempt: () => ++c };
    const r = chainweb.cut.current('invalid', config.host, {
      retry404: true,
      ...opts,
    });
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
    expect(c).toBe(2);
  });
  it('should throw when address is invalid', async () => {
    let c = 0;
    const opts = { retries: 1, minTimeout: 20, onFailedAttempt: () => ++c };
    const r = chainweb.cut.current('invalid', config.host, opts);
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
    expect(c).toBe(0);
  });
  it('should throw when not found', async () => {
    const opts = { retries: 1, minTimeout: 20 };
    const r = chainweb.cut.current('invalid', config.host, opts);
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
  });
});

describe('request', () => {
  it('should parse response correctly', async () => {
    const x = await parseResponse({
      status: 200,
      ok: true,
      json: async () => 'done',
    } as unknown as Response);
    expect(x).toMatch('done');
  });
  it('throws when response parsing failed', async () => {
    try {
      await parseResponse({
        text: async () => 'fail',
      } as unknown as Response);
    } catch (err) {
      expect(err.message).toBe('fail');
    }
  });
  it('throws when parse function does not exists', async () => {
    await expect(async () => {
      await parseResponse({} as unknown as Response);
    }).rejects.toThrow('response.text is not a function');
  });
  it('should create a correct URL', async () => {
    const url = chainUrl(1, 'header/payload', config.network, config.host);
    expect(url.href).toMatch(
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/header/payload',
    );
  });
  it('should throw when chain is missing', async () => {
    expect(() => {
      chainUrl(
        null as unknown as string,
        'header/payload',
        config.network,
        config.host,
      );
    }).toThrow('missing chainId parameter');
  });
});
