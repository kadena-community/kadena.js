import type { ChainId } from '@kadena/client';
import { createTransaction, Pact, signWithChainweaver } from '@kadena/client';
import {
  addSigner,
  asyncPipe,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

import { checkSuccess } from '../../utils/client-utils/helpers';
import { pollStatus, preflight, submitOne } from '../util/client';
import { inspect, safeSign } from '../util/fp-helpers';

const getTransferCommand = ({
  sender,
  receiver,
  amount,
  signerPublicKey,
  chainId,
  networkId,
}: {
  sender: string;
  receiver: string;
  amount: string;
  signerPublicKey: string;
  chainId: ChainId;
  networkId: string;
}) =>
  composePactCommand(
    execution(
      Pact.modules.coin.transfer(sender, receiver, { decimal: amount }),
    ),
    addSigner(signerPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, {
        decimal: amount,
      }),
    ]),
    setMeta({ senderAccount: sender, chainId }),
    setNetworkId(networkId),
  );

const doTransfer = asyncPipe(
  // you can edit the command form the input or complete it if it needs more information
  // for example hear we add gasLimit and gasPrice
  composePactCommand(
    setMeta({
      gasLimit: 2400,
      gasPrice: 0.00000001,
    }),
  ),
  inspect('command'),
  createTransaction,
  safeSign(signWithChainweaver),
  checkSuccess(preflight),
  submitOne,
  pollStatus,
);

doTransfer(
  getTransferCommand({
    sender:
      'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
    receiver:
      'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
    amount: '0.1337',
    signerPublicKey:
      'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
    chainId: '0',
    networkId: 'fast-development',
  }),
)
  .then(console.log)
  .catch(console.error);
