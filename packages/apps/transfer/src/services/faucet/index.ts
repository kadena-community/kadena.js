import {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { Pact, PactCommand } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { generateApiHost } from '../utils/utils';

const FAUCET_KEY = {
  PUBLIC: 'dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e',
  SECRET: '49a1e8f8ef0a8ca6bd1d5f3a3e45f10aa1dd987f2cfb94e248a457c178f347b4',
};

const networkId: ChainwebNetworkId = 'testnet04';

export const fundExistingAccount = async (
  account: string,
  amount: number,
  chainId: ChainwebChainId,
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['request-coin'](account, new PactNumber(amount).toPactDecimal())
    .addCap('coin.GAS', FAUCET_KEY.PUBLIC)
    .addCap(
      'coin.TRANSFER',
      keyPair.publicKey,
      'coin-faucet',
      account,
      new PactNumber(amount).toPactDecimal(),
    )
    .setMeta({ sender: 'faucet-operation' }, networkId);

  const command = transactionBuilder.createCommand();

  const signature1 = sign(command.cmd, {
    publicKey: FAUCET_KEY.PUBLIC,
    secretKey: FAUCET_KEY.SECRET,
  });

  if (signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const signature2 = sign(command.cmd, keyPair);

  if (signature2.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transactionBuilder.addSignatures(
    {
      pubKey: FAUCET_KEY.PUBLIC,
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const response = await transactionBuilder.send(
    generateApiHost(networkId, chainId),
    // , {
    //   preflight: false,
    // }
  );

  console.log('fundExistingAccount', { response });
};
