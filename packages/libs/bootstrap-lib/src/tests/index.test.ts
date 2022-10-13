import { x } from '..';

describe('fetch', () => {
  it('works with typescript', async () => {
    const fn: () => Promise<Response> = x();
    expect(async () => {
      await fn();
    }).not.toThrow();
  });
});
