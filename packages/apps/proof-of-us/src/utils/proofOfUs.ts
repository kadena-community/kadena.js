import type { IUnsignedCommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { proofOfUsData } from './data';

//TODO: get data from the chain

export const getAllProofOfUs = async (): Promise<IProofOfUsToken[]> => {
  const tokens = proofOfUsData.map((d) => d.token);
  const data = tokens.filter((d) => d?.tokenId);
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
  eventId: string,
  account: IAccount,
): Promise<IUnsignedCommand | undefined> => {
  const transaction = Pact.builder
    .execution(
      `(${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us.mint-attendance-token 
      "proof-of-us:v2z0VWCNa6OAN9eeGkQ8YoJ2yZNj97Y1-sZyv6sbcEQ" 
      "${account.accountName}" 
      (read-keyset 'attendant_guard)
      )`,
    )
    .addData('attendant_guard', {
      pred: 'keys-any',
      keys: [
        'WEBAUTHN-a50102032620012158200ad0e59b1905c813ae05d03ab5d014d9a2faea845a5f6721b64b9d31f37349f122582069579aa8491b620ca13f2365688b4b889ca4d92076162ba355bf2b8a72ee18de',
      ],
    })
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: 'proof-of-us-gas-station',
      gasPrice: 0.000001,
    })
    .addSigner(
      // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
      {
        pubKey:
          'WEBAUTHN-a50102032620012158200ad0e59b1905c813ae05d03ab5d014d9a2faea845a5f6721b64b9d31f37349f122582069579aa8491b620ca13f2365688b4b889ca4d92076162ba355bf2b8a72ee18de',
        scheme: 'WebAuthn',
      },
      (withCap) => [
        withCap(
          `${process.env.NEXT_PUBLIC_NAMESPACE}.proof-of-us-gas-station.GAS_PAYER`,
          'k:1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f',
          new PactNumber(0).toPactInteger(),
          new PactNumber(0).toPactDecimal(),
        ),
        withCap(
          `${[process.env.NEXT_PUBLIC_NAMESPACE]}.proof-of-us.ATTEND`,
          `proof-of-us:v2z0VWCNa6OAN9eeGkQ8YoJ2yZNj97Y1-sZyv6sbcEQ`,
          "(read-keyset 'attendant_guard)",
        ),
      ],
    )
    .createTransaction();

  console.log(transaction);

  return transaction;
};
