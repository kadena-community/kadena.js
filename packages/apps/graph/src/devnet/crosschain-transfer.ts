import type {
  ICommandResult,
  IContinuationPayloadObject,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId, IPactDecimal, IUnsignedCommand } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
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
  sender: IAccount,
  receiver: IAccount,
  pactDecimal: IPactDecimal,
): IUnsignedCommand {
  return Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        sender.account,
        receiver.account,
        readKeyset('receiver-guard'),
        receiver.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
        pactDecimal,
      ),
    )
    .addSigner(
      sender.keys.map((key) => key.publicKey),
      (withCapability) => [
        withCapability('coin.GAS'),
        withCapability(
          'coin.TRANSFER_XCHAIN',
          sender.account,
          receiver.account,
          pactDecimal,
          receiver.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
        ),
      ],
    )
    .addKeyset(
      'receiver-guard',
      'keys-all',
      ...receiver.keys.map((key) => key.publicKey),
    )
    .setMeta({ chainId: sender.chainId, senderAccount: sender.account })
    .setNetworkId(dotenv.NETWORK_ID)
    .createTransaction();
}

function finishInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: IAccount = sender00,
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(dotenv.NETWORK_ID)
    // uncomment this if you want to pay gas yourself
    .addSigner(
      gasPayer.keys.map((key) => key.publicKey),
      (withCapability) => [withCapability('coin.GAS')],
    )
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer.account,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

export async function crossChainTransfer({
  sender,
  receiver,
  amount,
  gasPayer = sender00,
}: {
  sender: IAccount;
  receiver: IAccount;
  amount: number;
  gasPayer?: IAccount;
}): Promise<ICommandResult> {
  // Gas Payer validations
  if (gasPayer.chainId !== receiver.chainId && gasPayer !== sender00) {
    logger.info(
      `Gas payer ${gasPayer.account} does not for sure have an account on the receiver chain; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  if (!gasPayer.keys.map((key) => key.secretKey)) {
    logger.info(
      `Gas payer ${gasPayer.account} does not have a secret key; using sender00 as gas payer`,
    );
    gasPayer = sender00;
  }

  logger.info(
    `Crosschain Transfer from ${sender.account}, chain ${sender.chainId}\nTo ${receiver.account}, chain ${receiver.chainId}\nAmount: ${amount}\nGas Payer: ${gasPayer.account}`,
  );

  const pactAmount = new PactNumber(amount).toPactDecimal();

  const unsignedTx = startInTheFirstChain(sender, receiver, pactAmount);
  const signedTx = signAndAssertTransaction(sender.keys)(unsignedTx);
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
      networkId: dotenv.NETWORK_ID,
      chainId: sender.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
    },
    receiver.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
  );

  const continuation = {
    pactId: status.continuation?.pactId || '',
    proof,
    rollback: false,
    step: 1,
  };
  const unsignedTx2 = finishInTheTargetChain(
    continuation,
    receiver.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
    gasPayer,
  );

  const signedTx2 = signAndAssertTransaction(gasPayer.keys)(unsignedTx2);
  const submittedTx2 = await submit(signedTx2);
  inspect('Transfer Submited')(submittedTx2);
  const status2 = await listen(submittedTx2);
  inspect('Transfer Result')(status2);
  return status2;
}
