import type { IPollResponse, IUnsignedCommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { getClient } from './client';
import { env } from './env';
import { getAllowedSigners } from './isAlreadySigning';

export const getTransaction = async (
  requestKey?: string,
): Promise<IPollResponse | undefined> => {
  if (!requestKey) return;

  const txRes = {
    chainId: env.CHAINID,
    networkId: env.NETWORKID,
    requestKey,
  };

  let transaction;
  try {
    transaction = await getClient().getStatus(txRes);
  } catch (e) {}

  return transaction;
};

export const getProofOfUs = async (
  id: string,
): Promise<IProofOfUsToken | undefined> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(${
        process.env.NEXT_PUBLIC_NAMESPACE
      }.proof-of-us.get-event "${decodeURIComponent(id)}"
      )`,
    )
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
    })
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success'
    ? (result.data as IProofOfUsToken)
    : undefined;
};
export const getTokenId = async (
  eventId: string,
  uri: string,
): Promise<string | undefined> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.retrieve-connection-token-id "" "${uri}"
      )`,
    )
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
    })
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? (result.data as string) : undefined;
};

export const getTokenInfo = async (id: string): Promise<string | undefined> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.get-token-info "${decodeURIComponent(id)}"
      )`,
    )
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
    })
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? (result.data as string) : undefined;
};

export const getTokenUri = async (id: string): Promise<string | undefined> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.get-uri "${decodeURIComponent(id)}"
      )`,
    )
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
    })
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? (result.data as string) : undefined;
};

export const claimAttendanceToken = async (
  id: string,
  account: IAccount,
): Promise<IUnsignedCommand | undefined> => {
  const eventId = decodeURIComponent(id);
  const pubKey = account.devices[0].guard.keys[0];

  if (!pubKey) {
    throw new Error('credential of account not found');
  }

  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.mint-attendance-token
      "${eventId}"
      "${account.accountName}"
      (${process.env.NEXT_PUBLIC_WEBAUTHN_NAMESPACE}.webauthn-wallet.get-wallet-guard "${account.accountName}")
      )`,
    )
    .addData('event_id', `${eventId}`)
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
    })
    .addSigner(
      {
        pubKey,
        scheme: 'WebAuthn',
      },
      (withCap) => [
        withCap(
          `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us-gas-station.GAS_PAYER`,
          `${process.env.NEXT_PUBLIC_ATTENDANCE_GASPAYER}`,
          new PactNumber(0).toPactInteger(),
          new PactNumber(0).toPactDecimal(),
        ),
        withCap(
          `${[process.env.NEXT_PUBLIC_NAMESPACE]}.proof-of-us.ATTEND`,
          `${eventId}`,
        ),
      ],
    )
    .createTransaction();

  return transaction;
};

export const hasMintedAttendaceToken = async (
  eventId: string,
  accountName: string,
): Promise<boolean> => {
  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.has-minted-attendance-token
      "${eventId}"
      "${accountName}"
      )`,
    )
    .addData('event-id', `${eventId}`)
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
    })
    .createTransaction();

  const client = getClient();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success';
};

export const createConnectTokenTransaction = async (
  manifestUri: string,
  signees: IProofOfUsSignee[],
  account: IAccount,
): Promise<IUnsignedCommand | undefined> => {
  const pubKey = account.devices[0].guard.keys[0];
  const collectionId = process.env.NEXT_PUBLIC_CONNECTION_COLLECTIONID ?? '';

  if (!collectionId) {
    throw new Error('collectionId not found');
  }

  if (!pubKey) {
    throw new Error('credential of account not found');
  }

  if (signees.length < 2) {
    throw new Error('You need at least 2 signers');
  }

  const guardString = signees.reduce((acc: string, val) => {
    return `${acc} "${val.accountName}"`;
  }, '');

  const transactionBuilder = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.create-and-mint-connection-token
      "${manifestUri}"
      (map (${process.env.NEXT_PUBLIC_WEBAUTHN_NAMESPACE}.webauthn-wallet.get-wallet-guard) [${guardString}])
      )`,
    )
    .addData('collection_id', collectionId)
    .addData('uri', manifestUri)
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
      gasLimit: 100000,
      ttl: 30000,
    });

  getAllowedSigners(signees).forEach((signee, idx) => {
    if (idx === 0) {
      transactionBuilder.addSigner(
        {
          pubKey: signee.publicKey,
          scheme: 'WebAuthn',
        },
        (withCap) => [
          withCap(
            `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us-gas-station.GAS_PAYER`,
            `${process.env.NEXT_PUBLIC_ATTENDANCE_GASPAYER}`,
            new PactNumber(0).toPactInteger(),
            new PactNumber(0).toPactDecimal(),
          ),
          withCap(
            `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.CONNECT`,
            ``,
            `${manifestUri}`,
          ),
        ],
      );
    } else {
      transactionBuilder.addSigner(
        {
          pubKey: signee.publicKey,
          scheme: 'WebAuthn',
        },
        (withCap) => [
          withCap(
            `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.CONNECT`,
            ``,
            `${manifestUri}`,
          ),
        ],
      );
    }
  });

  const transaction = transactionBuilder.createTransaction();

  return transaction;
};
