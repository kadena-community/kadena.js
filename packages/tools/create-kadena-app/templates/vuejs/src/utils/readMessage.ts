import { Pact, createClient } from '@kadena/client';
import { API_HOST, CHAIN_ID, NETWORK_ID } from './consts';

interface ReadMessageParams {
  account: string;
}

export default async function readMessage({
  account,
}: ReadMessageParams): Promise<string> {
  try {
    const transactionBuilder = Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules['free.cka-message-store']['read-message'](account),
      )
      .setMeta({ chainId: CHAIN_ID })
      .setNetworkId(NETWORK_ID as string)
      .createTransaction();

    const staticClient = createClient(API_HOST);
    const res = await staticClient.local(transactionBuilder, {
      preflight: false,
      signatureVerification: false,
    });

    if (res.result.status === 'success') {
      return res.result.data.toString();
    } else {
      throw res.result.error;
    }
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
}
