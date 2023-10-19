import { config } from "@/config";
import { getClient } from "@/utils/helpers";
import { Pact } from "@kadena/client";

export async function createPrincipal(
  keys: string[],
  preb: "keys-all" | "keys-one" | "keys-two"
): Promise<string> {
  const tx = Pact.builder
    .execution("(create-principal (read-keyset 'account-key-set))")
    .addKeyset("account-key-set", preb, ...keys)
    .setMeta({ chainId: "0" })
    .setNetworkId(config.networkId)
    .createTransaction();

  const { dirtyRead } = getClient("l1");

  const response = await dirtyRead(tx);
  if (response.result.status === "success") {
    return response.result.data as string;
  }

  throw new Error((response.result.error as any)?.message || "Unknown error");
}
