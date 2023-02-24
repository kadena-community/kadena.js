jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import { IPactCommand } from '../../interfaces/IPactCommand';
import { ICommandBuilder, Pact } from '../../pact';
import {
  IQuicksignResponse,
  IQuicksignResponseBody,
} from '../../signing-api/v1/quicksign';
import { signWithChainweaver } from '../signWithChainweaver';

import fetch from 'cross-fetch';

describe('signWithChainweaver', () => {
  jest.setTimeout(1000);

  it('makes a call on 127.0.0.1:9467/v1/quicksign with transaction', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify({ responses: [] } as IQuicksignResponseBody),
      json: () => {},
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pactModule = Pact.modules as any;

    const unsignedCommand = (
      pactModule.coin.transfer('k:from') as ICommandBuilder<{
        GAS: [];
      }> &
        IPactCommand
    ).addCap('GAS', 'signer-key');

    const { cmd } = unsignedCommand.createCommand();
    const sigs = unsignedCommand.sigs.map((sig, i) => {
      return {
        pubKey: unsignedCommand.signers[i].pubKey,
        sig: sig || null,
      };
    });

    const body = JSON.stringify({ cmdSigDatas: [{ cmd, sigs }] });
    await signWithChainweaver(unsignedCommand);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pactModule = Pact.modules as any;
    const unsignedCommand = (
      pactModule.coin.transfer('k:from') as ICommandBuilder<{
        GAS: [];
      }> &
        IPactCommand
    )
      .addCap('GAS', 'signer-key')
      .setMeta({
        sender: '',
      });

    // expected: throws an error
    signWithChainweaver(unsignedCommand).catch((e) => {
      expect(e).toBeDefined();
    });
  });

  it('adds signatures in multisig fashion to the transactions', async () => {
    const mockedResponse: { responses: IQuicksignResponse[] } = {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pactModule = Pact.modules as any;

    const unsignedCommand = (
      pactModule.coin.transfer('k:from') as ICommandBuilder<{
        GAS: [];
        TRANSFER: [sender: string, receiver: string, amount: number];
      }> &
        IPactCommand
    )
      .addCap('GAS', 'gas-signer-pubkey')
      .addCap('TRANSFER', 'transfer-signer-pubkey', 'k:from', 'k:to', 1.234);

    await signWithChainweaver(unsignedCommand);

    expect(unsignedCommand.sigs).toEqual([{ sig: 'gas-key-sig' }, undefined]);

    // set a new mock response for the second signature
    const mockedResponse2: { responses: IQuicksignResponse[] } = {
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

    await signWithChainweaver(unsignedCommand);
    expect(unsignedCommand.sigs).toEqual([
      { sig: 'gas-key-sig' },
      { sig: 'transfer-key-sig' },
    ]);
  });

  it('signs but does not have the signer key and returns sig null', async () => {
    const mockedResponse: { responses: IQuicksignResponse[] } = {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pactModule = Pact.modules as any;

    const unsignedCommand = (
      pactModule.coin.transfer('k:from') as ICommandBuilder<{
        GAS: [];
      }> &
        IPactCommand
    ).addCap('GAS', 'gas-signer-pubkey');

    await signWithChainweaver(unsignedCommand);

    expect(unsignedCommand.sigs).toEqual([undefined]);
  });
});
