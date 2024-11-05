import { createClient, addSignatures, createTransaction } from "@kadena/client";
import { transferCreateCommand } from "@kadena/client-utils/coin";
import {
  kadenaGenKeypairFromSeed,
  kadenaMnemonicToSeed,
  kadenaSignWithKeyPair,
} from "@kadena/hd-wallet";

const phrase =
  "hunt barrel sea feature before wood canoe stem govern vacuum rival sadness";
const password = "password";

export async function main() {
  const seed = await kadenaMnemonicToSeed(password, phrase);
  const [key1, key1Secret] = await kadenaGenKeypairFromSeed(password, seed, 0);
  const [key2] = await kadenaGenKeypairFromSeed(password, seed, 1);
  const transaction = createTransaction({
    ...transferCreateCommand({
      amount: "0.1",
      chainId: "0",
      receiver: {
        account: `k:${key2}`,
        keyset: {
          pred: "keys-all",
          keys: [key2],
        },
      },
      sender: {
        account: `k:${key1}`,
        publicKeys: [key1],
      },
    })(),
    networkId: "testnet04",
  });

  const sig = await kadenaSignWithKeyPair(
    password,
    key1,
    key1Secret
  )(transaction.hash);
  const signed = addSignatures(transaction, sig);
  console.log(JSON.stringify(signed, null, 2));

  const client = createClient();
  const result = await client.local(signed);
  console.log(result);
}
