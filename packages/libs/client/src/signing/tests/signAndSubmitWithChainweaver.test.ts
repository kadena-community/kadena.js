jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import { IPactCommand } from '../../interfaces/IPactCommand';
import { ICommandBuilder, Pact } from '../../pact';
import { signAndSubmitWithChainweaver } from '../signAndSubmitWithChainweaver';

import fetch from 'cross-fetch';

describe('signAndSubmitWithChainweaver', () => {
  jest.setTimeout(1000);

  it('makes a call on 127.0.0.1:9467/v1/sign with transaction', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
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
      .addMeta({
        sender: '',
      });

    await signAndSubmitWithChainweaver(unsignedCommand);

    expect(fetch).toBeCalledWith('http://127.0.0.1:9467/v1/sign', {
      body: '{"code":"(coin.transfer \\"k:from\\")","data":{},"networkId":"testnet04","caps":[{"role":"GAS","description":"cap for GAS","cap":{"name":"GAS","args":[]}}],"sender":"","chainId":"1 ","gasLimit":2500,"gasPrice":1e-8,"signingPubKey":"","ttl":300}',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      method: 'POST',
    });
  });
});
