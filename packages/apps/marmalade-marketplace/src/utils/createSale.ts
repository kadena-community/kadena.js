import { offerToken } from '@kadena/client-utils/marmalade'
import { env } from '@/utils/env';
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { useRouter } from "next/navigation";
import { PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/client';

export interface CreateSaleInput {
  tokenId?: string;
  chainId?: ChainId;
  saleType?: string;
  price?: number;
  timeout?: number;
  account?: string;
  key?: string;
}

export const createSale = async (input: CreateSaleInput) => {
  const router = useRouter();

  const saleConfig = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: input.chainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };

  if (!input.tokenId || !input.chainId || !input.account || !input.key || !input.timeout) return

  try {
    await offerToken({
      chainId: input.chainId,
      tokenId: input.tokenId,
      timeout: new PactNumber(input.timeout).toPactInteger(),
      amount: new PactNumber(1).toPactDecimal(),
      seller: {
        account: input.account,
        keyset: {
          keys: [input.key],
          pred: 'keys-all',
        }
      },
    }, saleConfig).execute();

  } catch (error) {
    alert("Error offering token")
    console.error(error);
  }

};
