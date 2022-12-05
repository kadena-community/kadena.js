jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import { IPactCommand } from '../../interfaces/IPactCommand';
import { ICommandBuilder, Pact } from '../../pact';
import {
  IChainweaverSignedCommand,
  signWithChainweaver,
} from '../signWithChainweaver';

import fetch from 'cross-fetch';

describe('signWithChainweaver', () => {
  jest.setTimeout(1000);

  it('makes a call on 127.0.0.1:9467/v1/quickSign with transaction', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      text: () => JSON.stringify({ results: [] }),
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

    const { cmd, hash } = unsignedCommand.createCommand();
    const sigs = unsignedCommand.sigs.reduce((sigs, sig, i) => {
      const pubkey = unsignedCommand.signers[i].pubKey;
      sigs[pubkey] =
        sig === undefined ? null : sig.sig === undefined ? null : sig.sig;
      return sigs;
      // eslint-disable-next-line @rushstack/no-new-null
    }, {} as { [pubkey: string]: string | null });

    const body = JSON.stringify({ reqs: [{ cmd, hash, sigs }] });
    await signWithChainweaver(unsignedCommand);

    expect(fetch).toBeCalledWith('http://127.0.0.1:9467/v1/quickSign', {
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
    const mockedResponse: { results: IChainweaverSignedCommand[] } = {
      results: [{ cmd: '', sigs: { 'gas-signer-pubkey': 'gas-key-sig' } }],
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
    const mockedResponse2: { results: IChainweaverSignedCommand[] } = {
      results: [
        { cmd: '', sigs: { 'transfer-signer-pubkey': 'transfer-key-sig' } },
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
});
