import type {
  ICommandResult,
  IContinuationPayloadObject,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId, IPactDecimal, IUnsignedCommand } from '@kadena/types';
import { devnetConfig } from './config';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  logger,
  pollCreateSpv,
  sender00,
  signAndAssertTransaction,
  submit,
} from './helper';

function startInTheFirstChain(
  from: IAccount,
  to: IAccount,
  pactDecimal: IPactDecimal,
): IUnsignedCommand {
  return Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        readKeyset('receiver-guard'),
        to.chainId || devnetConfig.CHAIN_ID,
        pactDecimal,
      ),
    )
    .addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER_XCHAIN',
        from.account,
        to.account,
        pactDecimal,
        to.chainId || devnetConfig.CHAIN_ID,
      ),
    ])
    .addKeyset('receiver-guard', 'keys-all', to.publicKey)
    .setMeta({ chainId: from.chainId, senderAccount: from.account })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .createTransaction();
}

function finishInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: IAccount = sender00,
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(devnetConfig.NETWORK_ID)
    // uncomment this if you want to pay gas yourself
    .addSigner(gasPayer.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
    ])
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer.account,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

export async function crossChainTransfer({
  from,
  to,
  amount,
  gasPayer = sender00,
}: {
  from: IAccount;
  to: IAccount;
  amount: number;
  gasPayer?: IAccount;
}): Promise<ICommandResult> {
  // Gas Payer validations
  if (gasPayer.chainId !== to.chainId) {
    logger.info(
      `Gas payer ${gasPayer.account} does not for sure have an account on the receiver chain; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  if (!gasPayer.secretKey) {
    logger.info(
      `Gas payer ${gasPayer.account} does not have a secret key; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  logger.info(
    `Crosschain Transfer from ${from.account}, chain ${from.chainId}\nTo ${to.account}, chain ${to.chainId}\nAmount: ${amount}\nGas Payer: ${gasPayer.account}`,
  );

  const pactAmount = new PactNumber(amount).toPactDecimal();

  const unsignedTx = startInTheFirstChain(from, to, pactAmount);
  const signedTx = signAndAssertTransaction([from])(unsignedTx);
  const submittedTx = await submit(signedTx);
  inspect('Transfer Submited')(submittedTx);
  const status = await listen(submittedTx);
  inspect('Transfer Result')(status);
  if (status.result.status === 'failure') {
    throw new Error('Transfer failed');
  }

  const proof = await pollCreateSpv(
    {
      requestKey: status.reqKey,
      networkId: devnetConfig.NETWORK_ID,
      chainId: from.chainId || devnetConfig.CHAIN_ID,
    },
    to.chainId || devnetConfig.CHAIN_ID,
  );

  const continuation = {
    pactId: status.continuation?.pactId,
    proof,
    rollback: false,
    step: 1,
  };
  const unsignedTx2 = finishInTheTargetChain(
    continuation,
    to.chainId || devnetConfig.CHAIN_ID,
    gasPayer,
  );

  const signedTx2 = signAndAssertTransaction([gasPayer])(unsignedTx2);
  const submittedTx2 = await submit(signedTx2);
  inspect('Transfer Submited')(submittedTx2);
  const status2 = await listen(submittedTx2);
  inspect('Transfer Result')(status2);
  return status2;
}
