import { offerToken } from '@kadena/client-utils/marmalade'
import { useCallback, useEffect, useState } from "react";
import { env } from '@/utils/env';
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { useRouter } from "next/navigation";
import { PactNumber } from '@kadena/pactjs';

export interface CreateSaleInput {
  tokenId?: string;
  chainId?: string;
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

  try {
    await offerToken({
      chainId: input.chainId,
      tokenId: input.tokenId,
      timeout: input.timeout,
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
