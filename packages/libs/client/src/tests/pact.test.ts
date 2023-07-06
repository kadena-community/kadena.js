jest.mock('@kadena/chainweb-node-client', () => ({
  ...jest.requireActual('@kadena/chainweb-node-client'),
  local: jest.fn(),
  poll: jest.fn(),
  send: jest.fn(),
}));

import { local, poll, send } from '@kadena/chainweb-node-client';
import { PactNumber } from '@kadena/pactjs';
import { IUnsignedCommand } from '@kadena/types';

import { PactCommand } from '../pact';
import { Pact } from '../pactCreator';

const testURL: string = 'http://fake-api-host.local.co';

jest.useFakeTimers().setSystemTime(new Date('2023-03-22'));

function getCode(transaction: IUnsignedCommand): string {
  return JSON.parse(transaction.cmd).payload.exec.code;
}

function flushPromises(): Promise<void> {
  return new Promise(jest.requireActual('timers').setImmediate);
}

async function advanceTimersAndFlushPromises(
  time: number = 1000,
): Promise<void> {
  jest.advanceTimersByTime(time);
  await flushPromises();
}

describe('Pact proxy', () => {
  it('throws when using type `number`', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;
    expect(() => {
      pact.modules.coin.transfer('alice', 'bob', 100.0).createCommand();
    }).toThrow(
      'Type `number` is not allowed in the command. Use `{ decimal: 10 }` or `{ int: 10 }` instead',
    );
  });

  it('generates two different commands when executed after each other', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;

    const tx = pact.modules.coin
      .transfer('alice', 'bob', new PactNumber(100).toPactDecimal())
      .createCommand();

    const tx2 = pact.modules.coin
      .transfer('bob', 'alice', { decimal: '100' })
      .createCommand();

    expect(getCode(tx)).toBe('(coin.transfer "alice" "bob" 100.0)');
    expect(getCode(tx2)).toBe('(coin.transfer "bob" "alice" 100.0)');
  });

  it('generates two different commands when generated asynchronously', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;
    const tx = pact.modules.coin
      .transfer('alice', 'bob', { decimal: '100' })
      .createCommand();
    const tx2 = pact.modules.coin['transfer-xchain'](
      'k:1',
      'k:1',
      'chain1',
      'chain2',
      { int: '100' },
    ).createCommand();

    expect(getCode(tx2)).toBe(
      '(coin.transfer-xchain "k:1" "k:1" "chain1" "chain2" 100)',
    );
    expect(getCode(tx)).toBe('(coin.transfer "alice" "bob" 100.0)');
  });

  it('generates a command with data', () => {
    const sender =
      'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
    const receiver =
      'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
    const amount = { decimal: '10' };
    const signerPubKey = sender.split('k:')[1];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;

    const transaction = pact.modules.coin['transfer-create'](
      sender,
      receiver,
      () => "(read-keyset 'ks)",
      amount,
    )
      .addCap('coin.GAS', signerPubKey)
      .addCap('coin.TRANSFER', signerPubKey, sender, receiver, amount)
      .addData({
        ks: {
          keys: [
            '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          ],
          pred: 'keys-all',
        },
      })
      .setMeta(
        {
          gasLimit: 1000,
          gasPrice: 1.0e-6,
          sender: signerPubKey,
          ttl: 10 * 60, // 10 minutes
        },
        'testnet04',
      )
      .createCommand();

    expect(JSON.parse(transaction.cmd).payload.exec.data.ks.keys).toEqual([
      '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
    ]);
    expect(JSON.parse(transaction.cmd).signers[0].clist[1].args).toEqual([
      'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
      'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8',
      { decimal: '10' },
    ]);
  });

  it('makes a well formatted /local call', async () => {
    (local as jest.Mock).mockResolvedValue({});

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';
    builder
      .addCap('coin.GAS', 'senderPubKey')
      .addSignatures({ pubKey: 'senderPubKey', sig: 'sender-sig' });

    const body = builder.createCommand();

    await builder.local(testURL);

    expect(local).toBeCalledWith(body, testURL);
  });

  it('makes a well formatted /local call with signatureVerification=false', async () => {
    (local as jest.Mock).mockResolvedValue({});

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';
    builder.addCap('coin.GAS', 'senderPubKey');

    await builder.local(testURL, {
      preflight: true,
      signatureVerification: false,
    });

    expect(local).toBeCalledWith(expect.anything(), testURL, {
      preflight: true,
      signatureVerification: false,
    });
  });

  it('makes a well formatted /send call', async () => {
    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';
    await builder.send(testURL);

    const body = { cmds: [builder.createCommand()] };

    expect(send).toBeCalledWith(body, testURL);
  });

  it('makes a well formatted /poll call', async () => {
    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    const body = { cmds: [builder.createCommand()] };

    const { requestKeys } = await builder.send(testURL);

    expect(send).toBeCalledWith(body, `${testURL}`);

    await builder.poll(testURL);
    expect(poll).toBeCalledWith({ requestKeys: requestKeys }, testURL);
  });

  it('throws when trying a .poll() when no requestkey is present', async () => {
    (poll as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    expect(() => builder.poll(testURL)).toThrow();
  });

  it('throws when trying to call .pollUntil() when no requestkey is present', async () => {
    (poll as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    let expectingError;

    try {
      await builder.pollUntil(testURL);
    } catch (error) {
      expectingError = error;
    }

    expect(expectingError.message).toContain('`requestKey` not found');
  });

  it('returns a response after polling a succeeding transaction', async () => {
    jest.useFakeTimers();

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    await builder.send(testURL);

    // clear the mocked fetch to make counting the /poll calls easier
    (send as jest.Mock).mockClear();
    (poll as jest.Mock).mockClear();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    builder
      .pollUntil(testURL, {
        interval: 1000,
        timeout: 5000,
      })
      .then((t) => {
        expect(builder.status).toBe('success');
        expect(t.result.status).toBe('success');
      });

    await advanceTimersAndFlushPromises(1000);

    expect((poll as jest.Mock).mock.calls).toHaveLength(1);

    await advanceTimersAndFlushPromises(1000);

    expect((poll as jest.Mock).mock.calls).toHaveLength(2);

    // update the response to a succeeding one
    (poll as jest.Mock).mockResolvedValue({
      key1: {
        result: {
          status: 'success',
        },
      },
    });

    await advanceTimersAndFlushPromises(1000);

    expect((poll as jest.Mock).mock.calls).toHaveLength(3);
  });

  it('rejects the promise for pollUntil if the transaction failed', async () => {
    jest.useFakeTimers();

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    await builder.send(testURL);

    // make fetch return failed
    (poll as jest.Mock).mockResolvedValue({
      key1: {
        result: {
          status: 'failure',
        },
      },
    });

    // clear the mocked fetch to make counting the /poll calls easier
    (send as jest.Mock).mockClear();
    (poll as jest.Mock).mockClear();

    let expectingError;

    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await builder.pollUntil(testURL);
    } catch (error) {
      expectingError = error;
    }

    await advanceTimersAndFlushPromises(5000);

    expect(builder.status).toBe('failure');
    expect(expectingError.result.status).toBe('failure');

    expect((poll as jest.Mock).mock.calls).toHaveLength(1);
  });

  it('calls the onPoll function for each poll', async () => {
    jest.useFakeTimers();

    const onPoll = jest.fn();

    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    await builder.send(testURL);

    (poll as jest.Mock).mockResolvedValue({});

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    builder.pollUntil(testURL, {
      interval: 1000,
      onPoll,
    });

    // We need to flush the promises twice because one Promise gets created for each `interval`
    await advanceTimersAndFlushPromises(1000);
    await advanceTimersAndFlushPromises(1000);

    (poll as jest.Mock).mockResolvedValue({
      key1: {
        result: {
          status: 'success',
        },
      },
    });

    await advanceTimersAndFlushPromises(1000);

    expect(onPoll.mock.calls).toHaveLength(3);

    // expect two arguments on poll
    expect(onPoll.mock.lastCall).toHaveLength(2);
    // expect the first argument to be a transaction with property cmd
    expect(onPoll.mock.lastCall[0].cmd).toBeDefined();
  });

  it('rejects when the timeout of polling has been exceeded', async () => {
    jest.useFakeTimers();

    const builder = new PactCommand();
    builder.code = '(coin.transfer "from" "to" 1.234)';

    (send as jest.Mock).mockResolvedValue({
      requestKeys: ['key1'],
    });

    await builder.send(testURL);

    (poll as jest.Mock).mockResolvedValue({});

    const interval = 1000;

    builder.pollUntil(testURL, { timeout: 2500, interval }).catch((error) => {
      expect(error).toBe('timeout');

      expect(builder.status).toBe('timeout');
    });

    await advanceTimersAndFlushPromises(interval);

    expect((poll as jest.Mock).mock.calls).toHaveLength(1);

    await advanceTimersAndFlushPromises(interval);

    expect((poll as jest.Mock).mock.calls).toHaveLength(2);

    await advanceTimersAndFlushPromises(interval);
  });
});

describe('TransactionCommand', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pact = Pact as any;
  const sender =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94' as const;
  const receiver =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const amount = { decimal: '10' };
  const senderPubKey = sender.split('k:')[1];
  const receiverPubKey = receiver.split('k:')[1];

  let transactionCommand: PactCommand;

  beforeEach(() => {
    transactionCommand = pact.modules.coin['transfer-create'](
      sender,
      receiver,
      () => "(read-keyset 'ks)",
      amount,
    )
      .addCap('coin.GAS', senderPubKey)
      .addCap('coin.TRANSFER', senderPubKey, sender, receiver, amount)
      .addData({
        ks: {
          keys: [
            '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          ],
          pred: 'keys-all',
        },
      })
      .setMeta(
        {
          sender: senderPubKey,
        },
        'testnet04',
      );
  });

  it('resets `cmd` `hash` and `signatures` when `setMeta` is called', async () => {
    const transaction = transactionCommand.createCommand();

    const updatedTransactionCommand = transactionCommand.setMeta(
      {
        sender: receiverPubKey,
      },
      'testnet04',
    );

    expect(updatedTransactionCommand.sigs).toEqual([undefined]);

    const updatedTransaction = updatedTransactionCommand.createCommand();

    expect(transaction.cmd).not.toEqual(updatedTransaction.cmd);
    expect(transaction.hash).not.toEqual(updatedTransaction.hash);
  });

  it('resets `cmd` `hash` and `signatures` when `addData` is called', async () => {
    const transaction = transactionCommand.createCommand();

    const updatedTransactionCommand = transactionCommand.addData({
      ks: {
        keys: [
          '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
          '1c131be8d83f1d712b33ae0c7afd60bca0db80f362f5de9ba8792c6f4e7df488',
        ],
        pred: 'keys-all',
      },
    });

    expect(updatedTransactionCommand.sigs).toEqual([undefined]);

    const updatedTransaction = updatedTransactionCommand.createCommand();

    expect(transaction.cmd).not.toEqual(updatedTransaction.cmd);
    expect(transaction.hash).not.toEqual(updatedTransaction.hash);
  });

  it('resets `cmd` `hash` and `signatures` when `addCap` is called', async () => {
    const transaction = transactionCommand.createCommand();

    const updatedTransactionCommand = transactionCommand.addCap(
      'coin.GAS',
      senderPubKey,
    );

    expect(updatedTransactionCommand.sigs).toEqual([undefined]);

    const updatedTransaction = updatedTransactionCommand.createCommand();

    expect(transaction.cmd).not.toEqual(updatedTransaction.cmd);
    expect(transaction.hash).not.toEqual(updatedTransaction.hash);
  });

  it('adds formatted signatures to `sigs` when `addSignatures` is called', async () => {
    const transaction = transactionCommand
      .addCap('coin.GAS', senderPubKey)
      .createCommand();

    const updatedTransaction = transactionCommand
      .addCap('coin.GAS', senderPubKey)
      .addSignatures({
        pubKey: senderPubKey,
        sig: 'sender-sig',
      })
      .createCommand();

    expect(transaction.sigs).toEqual([undefined]);
    expect(updatedTransaction.sigs).toEqual([{ sig: 'sender-sig' }]);
  });

  it('throws an error when `addSignatures` is called without signer', async () => {
    expect(() => {
      transactionCommand = pact.modules.coin['transfer-create'](
        sender,
        receiver,
        () => "(read-keyset 'ks)",
        amount,
      ).addSignatures({
        pubKey: senderPubKey,
        sig: 'sender-sig',
      });
    }).toThrow();
  });

  it('allows setting a custom nonceCreator', async () => {
    let receivedMs = 0;
    const transaction = transactionCommand
      .setNonceCreator((t, dateInMs) => {
        receivedMs = dateInMs;
        return `${t.type} ${dateInMs} custom-nonce`;
      })

      .createCommand();

    const parsedCmd = JSON.parse(transaction.cmd);
    expect(parsedCmd.nonce).toEqual(`exec ${receivedMs} custom-nonce`);
  });
});
