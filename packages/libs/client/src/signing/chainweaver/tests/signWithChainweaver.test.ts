import type { ICoin } from '../../../composePactCommand/test/coin-contract';
import type { IQuicksignResponseOutcomes } from '../../../index';
import { Pact } from '../../../index';
import { getModule } from '../../../pact';
import { signWithChainweaver } from '../signWithChainweaver';

const coin: ICoin = getModule('coin');

import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const post = (
  path: string,
  response: string | IQuicksignResponseOutcomes,
  status = 200,
  delay?: number,
): ReturnType<typeof rest.post> =>
  rest.post(path, (req, res, ctx) =>
    res.once(
      ctx.status(status),
      ctx.delay(delay ?? 0),
      typeof response === 'string' ? ctx.text(response) : ctx.json(response),
    ),
  );

describe('signWithChainweaver', () => {
  it('throws an error when nothing is to be signed', async () => {
    try {
      await (signWithChainweaver as (arg: unknown) => {})(undefined);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('throws when an error is returned', async () => {
    server.resetHandlers(
      post('http://127.0.0.1:9467/v1/quicksign', { responses: [] }),
    );

    try {
      await (signWithChainweaver as (arg: unknown) => {})([]);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('makes a call on 127.0.0.1:9467/v1/quicksign with transaction', async () => {
    const builder = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('signer-key', (withCap) => [withCap('coin.GAS')]);

    const command = builder.getCommand();
    const unsignedTransaction = builder.createTransaction();

    const sigs = command.signers!.map((sig, i) => {
      return {
        pubKey: command.signers![i].pubKey,
        sig: null,
      };
    });

    server.resetHandlers(
      rest.post('http://127.0.0.1:9467/v1/quicksign', async (req, res, ctx) => {
        const body = await req.json();

        expect(req.headers.get('content-type')).toEqual(
          'application/json;charset=utf-8',
        );

        expect(body).toStrictEqual({
          cmdSigDatas: [{ cmd: unsignedTransaction.cmd, sigs }],
        });

        return res.once(ctx.status(200), ctx.json({ responses: [] }));
      }),
    );

    await signWithChainweaver(unsignedTransaction);
  });

  it('throws when call fails', async () => {
    server.resetHandlers(
      post('http://127.0.0.1:9467/v1/quicksign', 'A system error occured', 500),
    );

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('', (withCap) => [withCap('coin.GAS')])
      .setMeta({
        senderAccount: '',
        chainId: '0',
      })
      .createTransaction();

    // expected: throws an error
    await expect(signWithChainweaver(unsignedTransaction)).rejects.toThrow();
  });

  it('adds signatures in multisig fashion to the transactions', async () => {
    const mockedResponse: IQuicksignResponseOutcomes = {
      responses: [
        {
          commandSigData: {
            cmd: '',
            sigs: [{ pubKey: 'gas-signer-pubkey', sig: 'gas-key-sig' }],
          },
          outcome: {
            hash: '',
            result: 'success',
          },
        },
      ],
    };

    // set a new mock response for the second signature
    const mockedResponse2: IQuicksignResponseOutcomes = {
      responses: [
        {
          commandSigData: {
            cmd: '',
            sigs: [
              { pubKey: 'transfer-signer-pubkey', sig: 'transfer-key-sig' },
            ],
          },
          outcome: {
            hash: '',
            result: 'success',
          },
        },
      ],
    };

    server.resetHandlers(
      post('http://127.0.0.1:9467/v1/quicksign', mockedResponse),
      post('http://127.0.0.1:9467/v1/quicksign', mockedResponse2),
    );

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('gas-signer-pubkey', (withCap) => [withCap('coin.GAS')])
      .addSigner('transfer-signer-pubkey', (withCap) => [
        withCap('coin.TRANSFER', 'k:from', 'k:to', { decimal: '1.234' }),
      ])
      .setMeta({
        senderAccount: '',
        chainId: '0',
      })
      .createTransaction();

    const txWithOneSig = await signWithChainweaver(unsignedTransaction);

    expect(txWithOneSig.sigs).toStrictEqual([
      { sig: 'gas-key-sig' },
      undefined,
    ]);

    const signedTx = await signWithChainweaver(txWithOneSig);
    expect(signedTx.sigs).toEqual([
      { sig: 'gas-key-sig' },
      { sig: 'transfer-key-sig' },
    ]);
  });

  it('signs but does not have the signer key and returns sig null', async () => {
    const mockedResponse: IQuicksignResponseOutcomes = {
      responses: [
        {
          commandSigData: {
            cmd: '',
            sigs: [{ pubKey: 'gas-signer-pubkey', sig: null }],
          },
          outcome: { result: 'noSig' },
        },
      ],
    };

    server.resetHandlers(
      post('http://127.0.0.1:9467/v1/quicksign', mockedResponse),
    );

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('gas-signer-pubkey', (withCap) => [withCap('coin.GAS')])
      .createTransaction();

    const signedTransaction = await signWithChainweaver(unsignedTransaction);

    expect(signedTransaction.sigs).toEqual([undefined]);
  });
});
