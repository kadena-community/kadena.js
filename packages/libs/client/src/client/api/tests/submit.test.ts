jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { submit } from '../submit';

import fetch from 'cross-fetch';

describe('submit', () => {
  it('calls /send with the correct send url, then returns request keys ', async () => {
    const response = { requestKeys: ['first-key', 'second-key'] };
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });
    const hostUrl = "http://test-blockchian-host.com'";

    const firstCommand = {
      cmd: 'first',
      hash: 'test',
      sigs: [{ sig: 'test' }],
    };
    const secondCommand = {
      cmd: 'second',
      hash: 'test',
      sigs: [{ sig: 'test' }],
    };

    const result = await submit(hostUrl, [firstCommand, secondCommand]);

    expect(result).toEqual(response.requestKeys);

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/send`, {
      body: JSON.stringify({ cmds: [firstCommand, secondCommand] }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('throws an error if the response.ok is false', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 500,
      ok: false,
      text: () => 'Internal Server Error',
      json: () => {
        throw new Error('Internal Server Error');
      },
    });

    const hostUrl = "http://test-blockchian-host.com'";

    const body = {
      cmd: 'test',
      hash: 'test',
      sigs: [{ sig: 'test' }],
    };

    await expect(submit(hostUrl, [body])).rejects.toThrowError(
      new Error('Internal Server Error'),
    );
  });
});
