import type { ChainId, IUnsignedCommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { proofOfUsData } from './data';
import { env } from './env';

export const getAllProofOfUs = async (): Promise<IProofOfUsToken[]> => {
  const data = proofOfUsData.filter((d) => d && d['token-id']);
  return data as IProofOfUsToken[];
};
export const getProofOfUs = async (
  id: string,
): Promise<IProofOfUsToken | undefined> => {
  const client = createClient();

  const transaction = Pact.builder
    .execution(
      `(${
        process.env.NEXT_PUBLIC_NAMESPACE
      }.proof-of-us.get-event "${decodeURIComponent(id)}"
      )`,
    )
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
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
    .setNetworkId(env.NETWORKID ?? '')
    .setMeta({
      chainId: `${env.CHAINID as ChainId}`,
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
    })
    .addSigner(
      // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
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
  account: IAccount,
): Promise<boolean> => {
  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.has-minted-attendance-token
      "${eventId}" 
      "${account.accountName}"
      )`,
    )
    .addData('event-id', `${eventId}`)
    .setNetworkId(env.NETWORKID ?? '')
    .setMeta({
      chainId: `${env.CHAINID as ChainId}`,
    })
    .createTransaction();

  const client = createClient();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log(transaction, result);

  return result.status === 'success';
};

export const createConnectTokenTransaction = async (
  manifestUri: string,
  proofOfUs: IProofOfUsData,
  account: IAccount,
): Promise<IUnsignedCommand | undefined> => {
  const credential = account.credentials[0];
  const eventId = process.env.NEXT_PUBLIC_CONNECTION_EVENTID;

  if (!eventId) {
    throw new Error('eventId not found');
  }

  if (!credential) {
    throw new Error('credential of account not found');
  }

  const collectionId = 'collection:K85ZSH3LUXS3SB_Aokhseap0U6AHyNbSJKGfUM4kbik';

  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.create-and-mint-connection-token
        "${eventId}"
      "${manifestUri}"
      (map (${process.env.NEXT_PUBLIC_WEBAUTHN_NAMESPACE}.webauthn-wallet.get-wallet-guard) ["c:xwzrJU084XjqkLlYgdno8ZUaKmrPPVsmVbCwPcdjj1g" "c:xyIFb906xRXLy77XrU-AjE7FpxmWij1GLA7oHMxVml4"])
      )`,
    )

    .addData('event_id', eventId)
    .addData('collection_id', collectionId)
    .addData('uri', manifestUri)
    .setNetworkId(env.NETWORKID ?? '')
    .setMeta({
      chainId: `${env.CHAINID as ChainId}`,
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
      gasLimit: 10000,
    })

    .addSigner(
      // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
      {
        pubKey:
          'WEBAUTHN-a5010203262001215820b6239e70171da2cb539a458b82fb4572ed1a6547515279661f2183266f39efa122582095836852aacd83a8655aa38ab8dae2f6dc4f1b3add271b7eada3b3254333d943',
        scheme: 'WebAuthn',
      },
      (withCap) => [
        withCap(
          `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.CONNECT`,
          `${eventId}`,
          `${manifestUri}`,
        ),
        withCap(
          `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us-gas-station.GAS_PAYER`,
          `${process.env.NEXT_PUBLIC_ATTENDANCE_GASPAYER}`,
          new PactNumber(0).toPactInteger(),
          new PactNumber(0).toPactDecimal(),
        ),
      ],
    )
    .addSigner(
      // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
      {
        pubKey:
          'WEBAUTHN-a50102032620012158205599ee57b82bb2414a9689ff80a4b2462d5c2ce081cbeb33cfc3b8e50dbd038a225820fe4a73319de0291d5c1159256a00eef53009c7862dd5e5472adc17cacca9db3a',
        scheme: 'WebAuthn',
      },
      (withCap) => [
        withCap(
          `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.CONNECT`,
          `${eventId}`,
          `${manifestUri}`,
        ),
      ],
    )
    .createTransaction();

  return transaction;
};
