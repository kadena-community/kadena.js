import { env } from '@/utils/env';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { genKeyPair, sign } from '@kadena/cryptography-utils';

export const fundAccount = (accountName: string) => {
  const keyPair = genKeyPair();
  const amountToFund = 20;
  const chainId = '8';
  const transaction = Pact.builder
    .execution(
      // @ts-ignore
      Pact.modules[env.FAUCET_CONTRACT]['request-coin'](
        accountName,
        new PactNumber(amountToFund).toPactDecimal(),
      ),
    )
    .addSigner(keyPair.publicKey, (withCapability) => [
      withCapability(
        `${env.FAUCET_CONTRACT}.GAS_PAYER`,
        accountName,
        { int: 1 },
        { decimal: '1.0' },
      ),
      withCapability(
        'coin.TRANSFER',
        env.FAUCET_ACCOUNT,
        accountName,
        new PactNumber(amountToFund).toPactDecimal(),
      ),
    ])
    .setMeta({ senderAccount: env.FAUCET_ACCOUNT, chainId })
    .setNetworkId(env.NETWORKID)
    .createTransaction();

    const signature = sign(transaction.cmd, keyPair);
    transaction.sigs = [{ sig: signature.sig || '' }];

    return transaction;
};