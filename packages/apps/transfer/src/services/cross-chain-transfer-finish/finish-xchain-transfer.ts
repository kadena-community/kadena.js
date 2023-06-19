import {
  ChainwebNetworkId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { ContCommand, getContCommand, PactCommand } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { validateRequestKey } from '../utils/utils';

import { Translate } from 'next-translate';
interface ITransactionData {
  sender: { chain: ChainId; account: string };
  receiver: { chain: ChainId; account: string };
  amount: number;
  receiverGuard: {
    pred: string;
    keys: [string];
  };
}
export interface ITransferDataResult {
  tx?: ITransactionData | undefined;
  error?: string;
}

export interface ISpvProofResult {
  proof?: string;
  error?: string;
}

export async function finishXChainTransfer(
  requestKey: string,
  proof: string,
  step: number,
  pactID: string,
  rollback: boolean,
  server: string,
  network: ChainwebNetworkId,
  chain: ChainId,
): Promise<ContCommand> {
  const host = `https://${server}/chainweb/0.0/${network}/chain/${chain}/pact/`;

  console.log(host, 'host');

  // const contCommand = new ContCommand(proof, step, pactID, rollback);
  // contCommand.requestKey = requestKey;
  //
  // contCommand.setMeta({
  //   chainId: chain,
  //   sender: 'kadena-xchain-gas'
  // }, network)
  // const contCommand = await getContCommand(reqKey, chain, host, 0, false );

  // contCommand.createCommand();

  try {
    const contCommand = await getContCommand(
      requestKey,
      chain,
      host,
      step,
      rollback,
    );

    console.log('contCommand', contCommand);

    const localResult = await contCommand.local(host);
    console.log('localResult', localResult);
  } catch (e) {
    console.log(e);
  }

  // console.log('CRETAE', contCommand);

  // const fromPublicKey = await getPublicKey(networkId, chainId, fromAccount);
  // const toPublicKey = await getPublicKey(networkId, chainId, toAccount);

  // const pactCommand = new PactCommand();
  //
  // pactCommand.code = `(coin.transfer-create "${fromAccount}" "${toAccount}" (read-keyset "ks") ${convertDecimal(
  //   amount,
  // )})`;
  //
  // pactCommand
  //   .addCap('coin.GAS', onlyKey(fromAccount))
  //   .addCap('coin.GAS', fromPublicKey)
  //   .addCap(
  //     'coin.TRANSFER',
  //     onlyKey(fromAccount),
  //     fromPublicKey,
  //     fromAccount,
  //     toAccount,
  //     Number(amount),
  //   )
  //   .addData({ ks: { pred: 'keys-all', keys: [onlyKey(toAccount)] } })
  //   .addData({ ks: { pred: 'keys-all', keys: [toPublicKey] } })
  //   .setMeta(
  //     {
  //       gasLimit: gasLimit,
  //       gasPrice: gasPrice,
  //       ttl: ttl,
  //       chainId: chainId,
  //       sender: fromAccount,
  //     },
  //     networkId,
  //   );
  // pactCommand.createCommand();
  // if (pactCommand.cmd === undefined) {
  //   throw new Error('Failed to create transaction');
  // }
  //
  // const signature = sign(pactCommand.cmd, {
  //   secretKey: fromPrivateKey,
  //   publicKey: onlyKey(fromAccount),
  //   publicKey: fromPublicKey,
  // });
  //
  // if (signature.sig === undefined) {
  //   throw new Error('Failed to sign transaction');
  // }
  //
  // pactCommand.addSignatures({
  //   pubKey: onlyKey(fromAccount),
  //   pubKey: fromPublicKey,
  //   sig: signature.sig,
  // });
  //
  // console.log(`Sending transaction: ${pactCommand.code}`);
  // await pactCommand.send(generateApiHost(networkId, chainId));
  return contCommand;
}
