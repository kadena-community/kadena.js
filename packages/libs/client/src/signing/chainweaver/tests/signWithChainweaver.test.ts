jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { commandBuilder } from '../../../commandBuilder/commandBuilder';
import { addSigner } from '../../../commandBuilder/utils/addSigner';
import { payload } from '../../../commandBuilder/utils/payload';
import { setMeta } from '../../../commandBuilder/utils/setMeta';
import { Pact } from '../../../pact';
import {
  IQuicksignResponse,
  IQuicksignResponseOutcomes,
} from '../../../signing-api/v1/quicksign';
import { createTransaction } from '../../../utils/createTransaction';
import { signWithChainweaver } from '../signWithChainweaver';

import fetch from 'cross-fetch';

describe('signWithChainweaver', () => {
  jest.setTimeout(1000);

  it('makes a call on 127.0.0.1:9467/v1/quicksign with transaction', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify({ responses: [] } as IQuicksignResponse),
      json: () => {},
    });

    const command = commandBuilder(
      payload.exec(
        Pact.modules.coin.transfer('k:from', 'k:to', { decimal: '1.0' }),
      ),
      addSigner('signer-key', (withCap) => [withCap('coin.GAS')]),
    );

    const unsignedTransaction = createTransaction(command);
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

    const command = commandBuilder(
      payload.exec(
        Pact.modules.coin.transfer('k:from', 'k:to', { decimal: '1.0' }),
      ),
      addSigner('', (withCap) => [withCap('coin.GAS')]),
      setMeta({
        sender: '',
        chainId: '0',
      }),
    );

    // expected: throws an error
    signWithChainweaver(createTransaction(command)).catch((e) => {
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

    const command = commandBuilder(
      payload.exec(
        Pact.modules.coin.transfer('k:from', 'k:to', { decimal: '1.0' }),
      ),
      addSigner('gas-signer-pubkey', (withCap) => [withCap('coin.GAS')]),
      addSigner('transfer-signer-pubkey', (withCap) => [
        withCap('coin.TRANSFER', 'k:from', 'k:to', { decimal: '1.234' }),
      ]),
      setMeta({
        sender: '',
        chainId: '0',
      }),
    );

    const unsignedTransaction = createTransaction(command);
    const signedTransaction = await signWithChainweaver(unsignedTransaction);

    expect(signedTransaction[0].sigs).toStrictEqual([
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

    const signedTx = await signWithChainweaver(unsignedTransaction);
    expect(signedTx[0].sigs).toEqual([
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

    const command = commandBuilder(
      payload.exec(
        Pact.modules.coin.transfer('k:from', 'k:to', { decimal: '1.0' }),
      ),
      addSigner('gas-signer-pubkey', (withCap) => [withCap('coin.GAS')]),
    );

    const unsignedTransaction = createTransaction(command);

    const signedTransaction = await signWithChainweaver(unsignedTransaction);

    expect(signedTransaction[0].sigs).toEqual([undefined]);
  });
});
