jest.mock('@kadena/chainweb-node-client', () => ({
  __esModule: true,
  ...jest.requireActual('@kadena/chainweb-node-client'),
  poll: jest.fn(),
}));
import { poll } from '@kadena/chainweb-node-client';
import { sleep, withCounter } from '../../utils/utils';
import { pollStatus } from '../status';

describe('pollStatus', () => {
  it('calls the /poll endpoint several times till it gets the status of all request keys', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (poll as jest.Mock).mockImplementation(
      withCounter((counter) => responses[counter - 1] ?? {}),
    );

    const hostUrl = "http://test-blockchain-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys, {
      interval: 10,
    });

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });

    expect(poll).toHaveBeenCalledTimes(4);
  });

  it('throws TIME_OUT_REJECT if the task get longer that in timeout option', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (poll as jest.Mock).mockImplementation(
      withCounter(async (counter) => {
        await sleep(501);
        return responses[counter - 1] ?? {};
      }),
    );

    const hostUrl = "http://test-blockchain-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const promise = pollStatus(hostUrl, requestKeys, {
      interval: 10,
      timeout: 500,
    });

    await expect(promise).rejects.toEqual(new Error('TIME_OUT_REJECT'));
  });

  it('calls onPoll call back before fetching each request key in each try', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (poll as jest.Mock).mockImplementation(
      withCounter((counter) => responses[counter - 1] ?? {}),
    );

    const onPoll = jest.fn();

    const hostUrl = "http://test-blockchain-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    await pollStatus(hostUrl, requestKeys, {
      interval: 10,
      onPoll,
    });

    expect(onPoll).toBeCalledTimes(6);

    // first try
    expect(onPoll.mock.calls[0][0]).toBe('key-1');
    expect(onPoll.mock.calls[1][0]).toBe('key-2');

    //second try that returns key-1 status
    expect(onPoll.mock.calls[2][0]).toBe('key-1');
    expect(onPoll.mock.calls[3][0]).toBe('key-2');

    // third try that
    expect(onPoll.mock.calls[4][0]).toBe('key-2');

    //forth try that returns key-2 status
    expect(onPoll.mock.calls[5][0]).toBe('key-2');
  });

  it("uses default options if they aren't provided", async () => {
    const responses = [
      { 'key-1': { reqKey: 'key-1' }, 'key-2': { reqKey: 'key-2' } },
    ];

    (poll as jest.Mock).mockImplementation(
      withCounter((counter) => responses[counter - 1] ?? {}),
    );

    const hostUrl = "http://test-blockchain-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys);

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });

    expect(poll).toHaveBeenCalledTimes(1);
  });
});
