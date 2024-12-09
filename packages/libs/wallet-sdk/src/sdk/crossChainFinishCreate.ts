import type { ChainId, ISigner } from '@kadena/client';
import { createClient, Pact } from '@kadena/client';

/**
 * ICreateCrossChainFinishInput represents a subset of Transfer
 * and should not deviate from that interface
 */
export interface ICreateCrossChainFinishInput {
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  host: string;
  requestKey: string;
  networkId: string;
  chainId: ChainId;
  targetChainId: ChainId;
}

/**
 * Accepts a cross-chain Transfer and creates a cross-chain finish transaction
 */
export const crossChainFinishCreateCommand = async (
  {
    senderAccount,
    receiverAccount,
    amount,
    chainId,
    host,
    networkId,
    requestKey,
    targetChainId,
  }: ICreateCrossChainFinishInput,
  gasPayer: { account: string; publicKeys: ISigner[] },
) => {
  const client = createClient(() => host);
  const spv = await client.pollCreateSpv(
    {
      chainId,
      networkId,
      requestKey,
    },
    targetChainId,
  );

  const builder = Pact.builder
    .continuation({
      pactId: requestKey,
      proof: spv,
      rollback: false,
      step: 1,
      data: {
        from: senderAccount,
        to: receiverAccount,
        amount: amount,
        fromChain: chainId,
        toChain: targetChainId,
      },
    })
    .setMeta({
      chainId: chainId,
      senderAccount: gasPayer.account,
      gasLimit: 850,
    })
    .setNetworkId(networkId);

  for (const signer of gasPayer.publicKeys) {
    builder.addSigner(
      typeof signer === 'string' ? signer : signer.pubKey,
      (withCap: any) => [withCap('coin.GAS')],
    );
  }

  return builder.createTransaction();
};
