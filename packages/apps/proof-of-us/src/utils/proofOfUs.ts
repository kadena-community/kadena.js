import type { IUnsignedCommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { getClient } from './client';
import { proofOfUsData } from './data';
import { env } from './env';

export const getAllProofOfUs = async (): Promise<IProofOfUsToken[]> => {
  const data = proofOfUsData.filter((d) => d && d['token-id']);
  return data as IProofOfUsToken[];
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
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.retrieve-connection-token-id "${eventId}" "${uri}"
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
  const credential = account.credentials[0];

  if (!credential) {
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
        pubKey: `${credential.publicKey}`,
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
  proofOfUs: IProofOfUsData,
  account: IAccount,
): Promise<IUnsignedCommand | undefined> => {
  const credential = account.credentials[0];
  const eventId = process.env.NEXT_PUBLIC_CONNECTION_EVENTID ?? '';
  const collectionId = process.env.NEXT_PUBLIC_CONNECTION_COLLECTIONID ?? '';

  if (!eventId) {
    throw new Error('eventId not found');
  }

  if (!collectionId) {
    throw new Error('collectionId not found');
  }

  if (!credential) {
    throw new Error('credential of account not found');
  }

  if (proofOfUs.signees.length < 2) {
    throw new Error('You need at least 2 signers');
  }

  const guardString = proofOfUs.signees.reduce((acc: string, val) => {
    return `${acc} "${val.accountName}"`;
  }, '');

  const transactionBuilder = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.create-and-mint-connection-token
      "${manifestUri}"
      (map (${process.env.NEXT_PUBLIC_WEBAUTHN_NAMESPACE}.webauthn-wallet.get-wallet-guard) [${guardString}])
      )`,
    )
    .addData('event_id', eventId)
    .addData('collection_id', collectionId)
    .addData('uri', manifestUri)
    .setNetworkId(env.NETWORKID)
    .setMeta({
      chainId: `${env.CHAINID}`,
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
      gasLimit: 10000,
      ttl: 30000,
    });

  proofOfUs.signees.forEach((signee, idx) => {
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
            `${eventId}`,
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
            `${eventId}`,
            `${manifestUri}`,
          ),
        ],
      );
    }
  });

  const transaction = transactionBuilder.createTransaction();

  return transaction;
};
