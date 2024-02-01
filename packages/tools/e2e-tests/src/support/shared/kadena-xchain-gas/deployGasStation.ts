import { createClient, createTransaction, Pact } from '@kadena/client';
import { createPactCommandFromStringTemplate } from '@kadena/client-utils/nodejs';
import type { ChainId } from '@kadena/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  sender00Account,
  xChainGasStation,
} from '../../constants/accounts.constants';
import { fundAmount } from '../../constants/amounts.constants';
import { devnetUrl, networkId } from '../../constants/network.constants';
import { signTransaction } from '../faucet/deploy/utils';

export const deployGasStation = async (chainId: ChainId) => {
  // const pactCommand = await createPactCommandFromStringTemplate(
  //   readFileSync(join(__dirname, 'template.yaml'), 'utf8'),
  //   {
  //     'funding-acct': sender00Account.account,
  //     'gas-station-name': xChainGasStation,
  //     amount: fundAmount,
  //     chain: chainId,
  //     network: networkId,

  //     'funding-key': sender00Account.keys[0].publicKey,
  //     'owner-key': sender00Account.keys[0].publicKey,
  //   },
  // );
  // console.log(pactCommand);
  // const tx = createTransaction(pactCommand);
  // const signedTx = signTransaction(tx, sender00Account.keys[0]);
  // const { submit, listen } = createClient(devnetUrl(chainId));
  // const requestKeys = await submit(signedTx);
  // console.log(requestKeys);
  // const response = await listen(requestKeys);
  // console.log(response);

  const pactCommand = `
  (let
    ((mk-guard (lambda (max-gas-price:decimal)
                (util.guards.guard-or
                  (keyset-ref-guard "ns-admin-keyset")
                  (util.guards1.guard-all
                    [ (create-user-guard (coin.gas-only))
                      (util.guards1.max-gas-price max-gas-price)
                      (util.guards1.max-gas-limit 500)
                    ]))
               )
     )
    )

    (coin.transfer-create
      "${sender00Account.account}"
      "${xChainGasStation}"
      (mk-guard 0.0000000001)
      ${fundAmount})
    (coin.rotate
      "${xChainGasStation}"
      (mk-guard 0.00000001))
  )
`;

  const transaction = Pact.builder
    .execution(pactCommand)
    .setMeta({
      chainId,
      senderAccount: sender00Account.account,
      gasLimit: 2000,
      gasPrice: 0.00000001,
      ttl: 7200,
    })
    .setNetworkId(networkId)
    .addSigner(sender00Account.keys[0].publicKey)
    .createTransaction();

  const signedTx = signTransaction(transaction, sender00Account.keys[0]);

  const { submit, listen } = createClient(devnetUrl(chainId));

  const requestKeys = await submit(signedTx);

  // const transactionDescriptor = await client.submit(signedTx);
  const response = await listen(requestKeys);
  // if (response.result.status === 'failure') {
  //   throw response.result.error;
  // } else {
  //   return response.result;
  // }
  return response;
};
