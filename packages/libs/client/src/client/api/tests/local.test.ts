jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { local } from '../local';

import fetch from 'cross-fetch';

describe('local', () => {
  it('calls /local with the correct local url, then returns ICommandResult object ', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () =>
        JSON.stringify({
          reqKey: 'test-key',
        }),
      json: () => ({
        reqKey: 'test-key',
      }),
    });
    const hostUrl = "http://test-blockchian-host.com'";

    const body = {
      cmd: 'test',
      hash: 'test',
      sigs: ['test'],
    };

    const result = await local(hostUrl, body);

    expect(result.reqKey).toBe('test-key');

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/local`, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('calls /local with preflight query sting if its set, then returns IPreflightResult', async () => {
    const response = {
      preflightResult: { reqKey: 'test-key' },
    };
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });
    const hostUrl = "http://test-blockchian-host.com'";

    const body = {
      cmd: 'test',
      hash: 'test',
      sigs: ['test'],
    };

    const result = await local(hostUrl, body, { preflight: true });

    expect(result.preflightResult.reqKey).toBe(response.preflightResult.reqKey);

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/local?preflight=true`, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('calls /local with signatureValidation query sting if its set, then returns ICommandResult', async () => {
    const response = { reqKey: 'test-key' };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });
    const hostUrl = "http://test-blockchian-host.com'";

    const body = {
      cmd: 'test',
      hash: 'test',
      sigs: ['test'],
    };

    const result = await local(hostUrl, body, {
      signatureValidation: true,
    });

    expect(result.reqKey).toBe(response.reqKey);

    expect(fetch).toBeCalledWith(
      `${hostUrl}/api/v1/local?signatureValidation=true`,
      {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    );
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
      sigs: ['test'],
    };

    await expect(local(hostUrl, body)).rejects.toThrowError(
      new Error('Internal Server Error'),
    );
  });
});
