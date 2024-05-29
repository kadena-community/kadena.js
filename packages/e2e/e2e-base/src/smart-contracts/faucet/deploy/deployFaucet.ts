import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import type { ICommand } from '@kadena/client';
import { Pact, createClient, createSignWithKeypair } from '@kadena/client';

import fs from 'fs';
import path from 'path';
import { sender00Account } from '../../../constants/accounts.constants';
import { devnetUrl, networkId } from '../../../constants/network.constants';

export const deployFaucet = async ({
  chainId,
  upgrade,
  namespace,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
  namespace: string;
}): Promise<Record<string, ICommandResult>> => {
  const faucetContract = fs.readFileSync(
    path.resolve(__dirname, './../testnet-faucet.pact'),
    'utf-8',
  );

  const transaction = Pact.builder
    .execution(faucetContract)
    .addData('init', !upgrade)
    .addData('coin-faucet-namespace', namespace)
    .addData('coin-faucet-admin-keyset-name', `${namespace}.admin-keyset`)
    .addSigner(sender00Account.keys[0].publicKey)
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 70000,
      ttl: 28800,
      senderAccount: sender00Account.account,
    })
    .setNetworkId(networkId)
    .createTransaction();

  const signWithKeypair = createSignWithKeypair([sender00Account.keys[0]]);
  const signedTx = await signWithKeypair(transaction);

  const { submit, pollStatus } = createClient(devnetUrl(chainId));
  const requestKeys = await submit(signedTx as ICommand);
  return await pollStatus(requestKeys);
};
