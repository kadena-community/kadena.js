import { config } from "@/config";
import { Account } from "@/hooks/accounts.hook";
import { convertToNumber, nameToChianId } from "@/utils/name-helpers";
import { ChainId, Pact, readKeyset } from "@kadena/client";

export interface Signer {
  account: string;
  publicKey: string;
}

export const createRegisterNameTx = (
  name: string,
  guard: { pred: "keys-all" | "keys-two" | "keys-one"; keys: string[] },
  sender: Account
) => {
  const chainId = nameToChianId(name).toString() as ChainId;
  const builder = Pact.builder
    .execution(
      Pact.modules["user.registry"].register(
        {
          int: convertToNumber(name).toString(),
        },
        readKeyset("owner-guard")
      )
    )
    .addKeyset("owner-guard", guard.pred, ...guard.keys)
    .setMeta({ chainId, senderAccount: sender.account })
    .setNetworkId(config.networkId);

  sender.keys.forEach((key) =>
    builder.addSigner(key, (withCapability) => [withCapability("coin.GAS")])
  );

  return builder.createTransaction();
};
