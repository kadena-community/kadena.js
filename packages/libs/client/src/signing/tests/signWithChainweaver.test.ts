jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import { IPactCommand } from '../../interfaces/IPactCommand';
import { ICommandBuilder, Pact } from '../../pact';
import { signWithChainweaver } from '../signWithChainweaver';

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
    )
      .addCap('GAS', 'signer-key')
      .setMeta({
        sender: '',
      });

    const body = JSON.stringify({ reqs: [unsignedCommand] });

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
});
