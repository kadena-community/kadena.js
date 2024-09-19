import { sign } from '@kadena/cryptography-utils';
import {
  ResourceNotFoundError,
  UserRejectedRequestError,
  ParseError,
  InvalidRequestError,
  InternalError,
} from '@metamask/snaps-sdk';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import { derive } from './addAccount';
import { ApiParams, SignTransactionRequestParams } from '../types';
import { ISigner, ICommandPayload } from '@kadena/types';
import { makeValidator } from '../utils/validate';
import { renderTransactionRequest } from '../utils/renderSignatureRequest';

const validateParams = makeValidator({
  id: 'string',
  transaction: 'string',
});

function getSignerEntries(
  txnRequest: ICommandPayload,
  publicKey: string,
): ISigner[] {
  return txnRequest.signers.filter(({ pubKey }) => pubKey === publicKey);
}

/**
 * Sign a message from the Kadena snap.
 * @returns The signature in hex format.
 */
export async function signTransaction(
  snapApi: ApiParams,
): Promise<string | null> {
  validateParams(snapApi.requestParams);

  const { id, transaction } =
    snapApi.requestParams as SignTransactionRequestParams;

  const account = snapApi.state.accounts.find((account) => account.id === id);
  if (!account) {
    throw new ResourceNotFoundError('Account not found');
  }

  const { privateKey } = await derive(account.index);

  if (!privateKey) {
    throw new ResourceNotFoundError('No private key found');
  }

  let txn;
  try {
    txn = JSON.parse(transaction);
  } catch (e) {
    throw new ParseError('Transaction did not contain valid JSON');
  }

  // Validate network matches
  const { networks, activeNetwork: activeNetworkIdx } = snapApi.state;
  const activeNetwork = networks.find(
    (network) => network.id === activeNetworkIdx,
  );

  if (!activeNetwork) {
    throw new InvalidRequestError('Active network not found');
  }

  if (activeNetwork.networkId !== txn.networkId) {
    throw new InvalidRequestError(
      `Network ID mismatch. Found ${txn.networkId} expected ${activeNetwork.networkId}`,
    );
  }

  const publicKey = account.publicKey.replace(/^0x00/, '');
  const signerEntries = getSignerEntries(txn, publicKey);

  if (signerEntries.length === 0) {
    throw new InvalidRequestError(
      `Expected signer not found in transaction (k:${publicKey})`,
    );
  }

  if (signerEntries.length > 1) {
    throw new InvalidRequestError(
      `Multiple signer entries found for (k:${publicKey})`,
    );
  }

  const [signer] = signerEntries;

  let result;

  if (!!txn.payload.exec) {
    result = await transactionConfirmationDialog(signer, txn, snapApi);
  } else if (!!txn.payload.cont) {
    result = await continuationConfirmationDialog(txn.payload.cont, txn.meta);
  } else {
    throw new InvalidRequestError('Invalid transaction payload');
  }

  if (result !== true) {
    throw new UserRejectedRequestError('User denied transaction');
  }

  const signResponse = sign(transaction, {
    publicKey,
    secretKey: privateKey.replace('0x', ''),
  });

  if (!signResponse?.sig) {
    throw new InternalError('Failed to obtain signature');
  }

  return signResponse.sig;
}

async function transactionConfirmationDialog(
  signer: ISigner,
  txn: any,
  snapApi: ApiParams,
) {
  const renderedTxnRequest = renderTransactionRequest(signer, txn, snapApi);

  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text('Transaction signature request'),
        divider(),
        ...renderedTxnRequest,
      ]),
    },
  });

  return result;
}

async function continuationConfirmationDialog(cont: any, meta: any) {
  const gasFee = meta.gasLimit * meta.gasPrice;
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(
          'Finish cross-chain transaction',
        ),
        text(`Complete the cross-chain transaction by approving this gas fee payment of up to ${gasFee} KDA`),
        divider(),
        heading(
          'Transaction Details',
        ),
        text(`From chain ${cont.data.fromChain} to chain ${cont.data.toChain}`),
        divider(),
        text('**Request Key:**'),
        copyable(cont.pactId),
        text('**From:**'),
        copyable(cont.data.from),
        divider(),
        text('**To:**'),
        copyable(cont.data.to),
        divider(),
        text('**Amount:**'),
        text(`${cont.data.amount} KDA`),
        divider(),
        text('**Gas Fee:**'),
        text(`Up to ${gasFee} KDA`),
      ]),
    },
  });

  return result;
}
