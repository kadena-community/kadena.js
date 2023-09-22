import type { ICommandResult } from '@kadena/chainweb-node-client';
import type { IContinuationPayloadObject } from '@kadena/client';
import {
  createClient,
  isSignedTransaction,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import { apiHostGenerator as theApiHostGenerator } from '../utils/apiHostGenerator';
import { inspect } from '../utils/fp';
import { IUtilityFunction } from '../utils/IBaseUtilityFunction';

interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}

function startInTheFirstChain(
  networkId: string,
  chainId: ChainId,
  senderAccount: string,
  from: IAccount,
  to: IAccount,
  amount: string,
): IUnsignedCommand {
  return Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        readKeyset('receiver-guard'),
        to.chainId,
        {
          decimal: amount.toString(),
        },
      ),
    )
    .addSigner(from.publicKey, (withCapability) => [
      // in typescript this function suggests you only relevant capabilities
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER_XCHAIN',
        from.account,
        to.account,
        {
          decimal: amount,
        },
        to.chainId,
      ),
    ])
    .addKeyset('receiver-guard', 'keys-all', to.publicKey)
    .setMeta({ chainId, senderAccount })
    .setNetworkId(networkId)
    .createTransaction();
}

function finishInTheTargetChain(
  networkId: string,
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: string = 'kadena-xchain-gas',
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(networkId)
    // uncomment this if you want to pay gas yourself
    // .addSigner(gasPayer.publicKey, (withCapability) => [
    //   withCapability('coin.GAS'),
    // ])
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

const createDoCrossChainTransfer: IUtilityFunction<
  typeof doCrossChainTransfer
> = (
  { chainId, networkId, senderAccount },
  apiHostGenerator = theApiHostGenerator,
) => {
  const { listen, pollCreateSpv, pollStatus, submit } =
    createClient(apiHostGenerator);
  return doCrossChainTransfer;
};

async function doCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  return (
    Promise.resolve(
      startInTheFirstChain(
        networkId,
        chainId as ChainId,
        senderAccount,
        from,
        to,
        amount,
      ),
    )
      .then((command) => signWithChainweaver(command))
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      // inspect is only for development you can remove them
      .then(inspect('EXEC_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('SUBMIT_RESULT'))
      .then(listen)
      .then(inspect('LISTEN_RESULT'))
      .then((status) =>
        status.result.status === 'failure'
          ? Promise.reject(new Error('DEBIT REJECTED'))
          : status,
      )
      .then((status) =>
        Promise.all([
          status,
          pollCreateSpv(
            {
              requestKey: status.reqKey,
              networkId: NETWORK_ID,
              chainId: from.chainId,
            },
            to.chainId,
          ),
        ]),
      )
      .then(inspect('POLL_SPV_RESULT'))
      .then(
        ([status, proof]) =>
          finishInTheTargetChain(
            networkId,
            {
              pactId: status.continuation?.pactId,
              proof,
              rollback: false,
              step: 1,
            },
            to.chainId,
          ) as ICommand,
      )
      .then(inspect('CONT_TR'))
      // // uncomment the following lines if you want to pay gas from your account not the gas-station
      // .then((command) => signWithChainweaver(command))
      // .then((command) =>
      //   isSignedTransaction(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
      // )
      // .then(inspect('CONT_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('SUBMIT_RESULT'))
      .then(pollStatus)
      .then(inspect('FINAL_RESULT'))
  );
}
createDoCrossChainTransfer({
  chainId: '0',
  networkId: '0',
  senderAccount: '0',
});
