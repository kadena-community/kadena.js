import type { ChainId, IUnsignedCommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { addMinutes } from 'date-fns';
import { proofOfUsData } from './data';
import { env } from './env';

const client = createClient();

const createEventId = async (proofOfUs: IProofOfUsData) => {
  const startTime = addMinutes(new Date(proofOfUs.date), 1);
  const endTime = addMinutes(new Date(proofOfUs.date), 2);

  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.create-event-id "${
        proofOfUs.title
      }" ${startTime.getTime()} ${endTime.getTime()}
       
        )`,
    )
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
    })
    .createTransaction();

  const result = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.result.status === 'success'
    ? (result.result.data as string)
    : null;
};

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
  const eventId = await createEventId(proofOfUs);

  if (!eventId) {
    throw new Error('eventId not found');
  }

  if (!credential) {
    throw new Error('credential of account not found');
  }

  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.create-and-mint-connection-token
        "${eventId}"
      "${manifestUri}"
      (read-msg 'connection-guards)
      )`,
    )
    .addData('connection-guards', [
      'WEBAUTHN-a50102032620012158200ad0e59b1905c813ae05d03ab5d014d9a2faea845a5f6721b64b9d31f37349f122582069579aa8491b620ca13f2365688b4b889ca4d92076162ba355bf2b8a72ee18de',
      credential.publicKey,
    ])
    .addData('event_id', eventId)
    .addData('uri', manifestUri)
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
        withCap('CONNECT', eventId, manifestUri),
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
          'WEBAUTHN-a50102032620012158200ad0e59b1905c813ae05d03ab5d014d9a2faea845a5f6721b64b9d31f37349f122582069579aa8491b620ca13f2365688b4b889ca4d92076162ba355bf2b8a72ee18de',
        scheme: 'WebAuthn',
      },
      (withCap) => [withCap('CONNECT', eventId, manifestUri)],
    )
    .createTransaction();

  return transaction;
};
