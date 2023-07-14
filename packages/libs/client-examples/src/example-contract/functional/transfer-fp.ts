import {
  ChainId,
  createTransaction,
  isSignedCommand,
  Pact,
  signWithChainweaver,
} from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  payload,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

import { pollStatus, preflight, submit } from '../util/client';
import { asyncPipe } from '../util/fp-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
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
    payload.exec(
      Pact.modules.coin.transfer(sender, receiver, { decimal: amount }),
    ),
    addSigner(signerPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, {
        decimal: amount,
      }),
    ]),
    setMeta({ sender, chainId }),
    setNetworkId(networkId),
  );

// eslint-disable-next-line @rushstack/typedef-var
const doTransfer = asyncPipe(
  // you can edit the command form the input or complete it if it needs more information
  // for example hear we add gasLimit and gasPrice
  composePactCommand(
    // read meta from the input command
    ({ meta }) =>
      setMeta({
        chainId: meta?.chainId!,
        gasLimit: 2400,
        gasPrice: 0.00000001,
      }),
  ),
  createTransaction,
  signWithChainweaver,
  (tr) => (isSignedCommand(tr) ? tr : Promise.reject('TR_NOT_SIGNED')),
  // do preflight first to check if everything is ok without paying gas
  (tr) => preflight(tr).then((res) => [tr, res]),
  ([tr, res]) => (res.result.status === 'success' ? tr : Promise.reject(res)),
  // submit the tr if the preflight is ok
  submit,
  pollStatus,
);

doTransfer(
  getTransferCommand({
    sender:
      'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
    receiver:
      'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8',
    amount: '0.1337',
    signerPublicKey:
      '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
    chainId: '0',
    networkId: 'mainnet01',
  }),
)
  .then(console.log)
  .catch(console.error);
