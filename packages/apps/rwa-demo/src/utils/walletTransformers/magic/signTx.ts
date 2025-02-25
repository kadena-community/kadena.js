import { env } from '@/utils/env';
import { getWalletConnection } from '@/utils/getWalletConnection/getWalletConnection';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { KadenaExtension } from '@magic-ext/kadena';
import { Magic } from 'magic-sdk';

export const magicSignTx = async (tx: IUnsignedCommand) => {
  const magic = new Magic(env.MAGIC_APIKEY, {
    extensions: [
      new KadenaExtension({
        rpcUrl: env.CHAINWEBAPIURL,
        chainId: env.CHAINID,
        networkId: env.NETWORKID,
        createAccountsOnChain: true,
      }),
    ],
  });

  console.log(tx);

  const { transactions } = await magic.kadena.signTransactionWithSpireKey(tx);

  if (transactions.length === 0) return;

  const transaction = transactions[0];
  const cmd = JSON.parse(transaction.cmd);

  const signatures = transaction.sigs.map((sig, idx) => {
    const signature = JSON.parse(sig.sig);
    const signer = cmd.signers[idx];
    return { pubkey: signer.pubKey, sig: sig };
  });

  console.log({ transaction });
  console.log({ ...transaction, sigs: signatures });
  return transaction;
};
