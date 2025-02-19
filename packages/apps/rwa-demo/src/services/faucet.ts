import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { env } from '@/utils/env';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export const faucet = async (account: IWalletAccount) => {
  return Pact.builder
    .execution(
      `(${env.FAUCETNAMESPACE}.coin-faucet.create-and-request-coin (read-string 'owner) (read-keyset 'keyset) ${new PactNumber(env.FAUCETAMOUNT).toDecimal()})`,
    )
    .setMeta({
      senderAccount: env.FAUCETADDRESS,
      chainId: getNetwork().chainId,
    })
    .addData('owner', account.address)
    .addData('roles', [])
    .addData('keyset', {
      keys: [getPubkeyFromAccount(account)],
      pred: 'keys-all',
    })

    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(
        `${env.FAUCETNAMESPACE}.coin-faucet.GAS_PAYER`,
        '',
        { int: 0 },
        0.0,
      ),
      withCap(
        `coin.TRANSFER`,
        env.FAUCETADDRESS,
        account.address,
        env.FAUCETAMOUNT,
      ),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
