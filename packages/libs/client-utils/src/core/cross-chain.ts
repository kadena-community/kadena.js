import type {
  ChainId,
  IClient,
  ICommandResult,
  IPartialPactCommand,
  ITransactionDescriptor,
} from '@kadena/client';
import { createTransaction } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  continuation,
  setMeta,
} from '@kadena/client/fp';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe';
import type { IAccount, IClientConfig, IEmit } from './utils/helpers';
import {
  checkSuccess,
  composeWithDefaults,
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
  withInput,
} from './utils/helpers';

const requestSpvProof =
  (targetChainId: ChainId, client: IClient, onPoll: (id: string) => void) =>
  ([txDesc, txResult]: [ITransactionDescriptor, ICommandResult]) => {
    return client
      .pollCreateSpv(txDesc, targetChainId, {
        onPoll,
      })
      .then((proof) => ({
        pactId: txResult.continuation!.pactId,
        step: txResult.continuation!.step + 1,
        proof,
        rollback: false,
        data: {},
      }));
  };

const useGasStation = (targetChainGasPayer: IAccount) =>
  targetChainGasPayer.publicKeys === undefined ||
  targetChainGasPayer.publicKeys.length === 0;

const signers = (
  publicKeys?: string[],
): ((cmd: IPartialPactCommand) => IPartialPactCommand) =>
  Array.isArray(publicKeys) && publicKeys.length
    ? addSigner(publicKeys!, (signFor) => [signFor('coin.GAS')])
    : (cmd) => cmd;

const createPactCommand = (
  targetChainId: ChainId,
  targetChainGasPayer: IAccount,
) =>
  composePactCommand(
    setMeta({
      chainId: targetChainId,
      senderAccount: targetChainGasPayer.account,
    }),
    signers(targetChainGasPayer.publicKeys),
  );

export const crossChain = <T = PactValue>(
  { host, defaults, sign }: IClientConfig,
  client = getClient(host),
) => {
  return ({
    emit,
    targetChainGasPayer,
    targetChainId,
  }: {
    emit: IEmit;
    targetChainId: ChainId;
    targetChainGasPayer: { account: string; publicKeys?: string[] };
  }) =>
    asyncPipe(
      composeWithDefaults(defaults),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      checkSuccess(
        asyncPipe(client.preflight, emit('preflight'), throwIfFails),
      ),
      client.submitOne,
      emit('submit'),
      withInput(asyncPipe(client.listen, emit('listen'), throwIfFails)),
      requestSpvProof(targetChainId, client, emit('poll-spv')),
      emit('spv-proof'),
      // there is an issue with spv-proof type inferring here. this workaround fixes it for now, I'll investigate later
      (data) => data,
      continuation,
      createPactCommand(targetChainId, targetChainGasPayer),
      composeWithDefaults(defaults),
      createTransaction,
      safeSign(sign),
      emit(
        useGasStation(targetChainGasPayer)
          ? 'gas-station'
          : 'sign-continuation',
      ),
      client.submitOne,
      emit('submit-continuation'),
      client.listen,
      emit('listen-continuation'),
      throwIfFails,
      extractResult<T>,
    );
};
