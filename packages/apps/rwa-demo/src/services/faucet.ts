import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { env } from '@/utils/env';
import { getGuard } from '@/utils/getPubKey';
import { setSigner } from '@/utils/setSigner';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export const faucet = async (account: IWalletAccount) => {
  return Pact.builder
    .execution(
      `(${env.FAUCETNAMESPACE}.coin-faucet.create-and-request-coin (read-string 'owner) (read-msg 'keyset) ${new PactNumber(env.FAUCETAMOUNT).toDecimal()})`,
    )
    .setMeta({
      senderAccount: env.FAUCETADDRESS,
      chainId: getNetwork().chainId,
    })
    .addData('owner', account.address)
    .addData('keyset', getGuard(account))

    .addSigner(setSigner(account), (withCap) => [
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
