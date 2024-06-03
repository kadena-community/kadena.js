import { Pact, createClient, createSignWithKeypair } from '@kadena/client';
import type { ChainId, ICommand } from '@kadena/types';
import {
  sender00Account,
  xChainGasStation,
} from '../../constants/accounts.constants';
import { fundAmount } from '../../constants/amounts.constants';
import { devnetUrl, networkId } from '../../constants/network.constants';

export const deployGasStation = async (chainId: ChainId) => {
  const pactCommand = `
  (let
    ((mk-guard (lambda (max-gas-price:decimal)
                (util.guards.guard-or
                  (keyset-ref-guard "ns-admin-keyset")
                  (util.guards1.guard-all
                    [ (create-user-guard (coin.gas-only))
                      (util.guards1.max-gas-price max-gas-price)
                      (util.guards1.max-gas-limit 850)
                    ]))
               )
     )
    )

    (coin.transfer-create
      "${sender00Account.account}"
      "${xChainGasStation}"
      (mk-guard 0.0000000001)
      ${fundAmount}.0)
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
    .addSigner(sender00Account.keys[0].publicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER',
        sender00Account.account,
        xChainGasStation,
        100.0,
      ),
      withCapability('coin.ROTATE', xChainGasStation),
    ])
    .createTransaction();

  const signWithKeypair = createSignWithKeypair([sender00Account.keys[0]]);
  const signedTx = await signWithKeypair(transaction);

  const { submit, listen } = createClient(devnetUrl(chainId));

  const requestKeys = await submit(signedTx as ICommand);

  // const transactionDescriptor = await client.submit(signedTx);
  const response = await listen(requestKeys);
  // if (response.result.status === 'failure') {
  //   throw response.result.error;
  // } else {
  //   return response.result;
  // }
  return response;
};
