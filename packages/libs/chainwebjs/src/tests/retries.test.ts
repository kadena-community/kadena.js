import chainweb from '..';

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
});
