import type { ChainId } from "@kadena/types";
import type { IAccountWithSecretKey } from "../testdata/constants/accounts";
import { transfer } from "@kadena/client-utils/coin";
import { devnetHost, networkId } from "../testdata/constants/network";
import { createSignWithKeypair } from '@kadena/client';
import { expect } from "vitest";

export async function transferFunds(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
) {
  const result = await transfer(
    {
      sender: { account: source.account, publicKeys: [source.publicKey] },
      receiver: target.account,
      amount: amount,
      gasPayer: { account: source.account, publicKeys: [source.publicKey] },
      chainId: chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source]),
    },
  ).execute();
  expect(result).toBe('Write succeeded');
}
