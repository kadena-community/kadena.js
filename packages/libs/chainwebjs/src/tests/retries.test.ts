import chainweb from '..';
import { parseResponse } from '../internal';
import { chainUrl } from '../request';

/* ************************************************************************** */
/* Retries */

describe('retry', () => {
  test('retry 404', async () => {
    let c = 0;
    const opts = { retries: 1, minTimeout: 20, onFailedAttempt: () => ++c };
    const r = chainweb.cut.current('invalid', undefined, {
      retry404: true,
      ...opts,
    });
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
    expect(c).toBe(2);
  });
  test('abort 404', async () => {
    let c = 0;
    const opts = { retries: 1, minTimeout: 20, onFailedAttempt: () => ++c };
    const r = chainweb.cut.current('invalid', undefined, opts);
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
    expect(c).toBe(0);
  });
  test('abort 404 log error', async () => {
    const opts = { retries: 1, minTimeout: 20 };
    const r = chainweb.cut.current('invalid', undefined, opts);
    await expect(r).rejects.toThrow(chainweb.ResponseError);
    await expect(r).rejects.toThrow(
      'Request https://api.chainweb.com/chainweb/0.0/invalid/cut failed with 404, Not Found',
    );
  });
  test('response success', async () => {
    const x = await parseResponse({
      status: 200,
      ok: true,
      json: async () => 'done',
    } as unknown as Response);
    expect(x).toMatch('done');
  });
  test('response error', async () => {
    try {
      await parseResponse({
        text: async () => 'fail',
      } as unknown as Response);
    } catch (err) {
      expect(err.message).toBe('fail');
    }
  });
  test('response error no text', async () => {
    await expect(async () => {
      await parseResponse({} as unknown as Response);
    }).rejects.toThrow('response.text is not a function');
  });
});

describe('request', () => {
  test('URL', async () => {
    const url = chainUrl(1, 'header/payload');
    expect(url.href).toMatch(
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/header/payload',
    );
  });

  test('response error no chain', async () => {
    expect(() => {
      chainUrl(null as unknown as string, 'header/payload');
    }).toThrow('missing chainId parameter');
  });
});
