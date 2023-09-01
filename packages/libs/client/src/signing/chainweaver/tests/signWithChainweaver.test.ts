jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { type ICoin } from '../../../composePactCommand/test/coin-contract';
import {
  type IQuicksignResponse,
  type IQuicksignResponseOutcomes,
  Pact,
} from '../../../index';
import { getModule } from '../../../pact';
import { signWithChainweaver } from '../signWithChainweaver';

const coin: ICoin = getModule('coin');

import fetch from 'cross-fetch';

describe('signWithChainweaver', () => {
  jest.setTimeout(1000);

  it('throws an error when nothing is to be signed', async () => {
    try {
      await (signWithChainweaver as (arg: unknown) => {})(undefined);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('throws when an error is returned', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify({ responses: [] } as IQuicksignResponse),
      json: () => {},
    });

    try {
      await (signWithChainweaver as (arg: unknown) => {})(undefined);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('makes a call on 127.0.0.1:9467/v1/quicksign with transaction', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify({ responses: [] } as IQuicksignResponse),
      json: () => {},
    });

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

    const body = JSON.stringify({
      cmdSigDatas: [{ cmd: unsignedTransaction.cmd, sigs }],
    });
    await signWithChainweaver(unsignedTransaction);

    expect(fetch).toBeCalledWith('http://127.0.0.1:9467/v1/quicksign', {
      body,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      method: 'POST',
    });
  });

  it('throws when call fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 500,
      statusText: 'A system error occurred',
      text: () => {},
      json: () => {},
    });

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('', (withCap) => [withCap('coin.GAS')])
      .setMeta({
        senderAccount: '',
        chainId: '0',
      })
      .createTransaction();

    // expected: throws an error
    signWithChainweaver(unsignedTransaction).catch((e) => {
      expect(e).toBeDefined();
    });
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
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify(mockedResponse),
    });

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
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify(mockedResponse2),
    });

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

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify(mockedResponse),
    });

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner('gas-signer-pubkey', (withCap) => [withCap('coin.GAS')])
      .createTransaction();

    const signedTransaction = await signWithChainweaver(unsignedTransaction);

    expect(signedTransaction.sigs).toEqual([undefined]);
  });
});
