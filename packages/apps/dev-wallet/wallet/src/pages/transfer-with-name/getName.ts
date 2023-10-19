import { config } from "@/config";
import { convertToNumber, nameToChianId } from "@/utils/name-helpers";
import { ChainId, Pact } from "@kadena/client";

export const getNameGuardTx = (name: string) => {
  const chainId = nameToChianId(name).toString() as ChainId;
  const number = convertToNumber(name);

  const dataTx = Pact.builder
    .execution(Pact.modules["user.registry"].getData(number))
    .setMeta({ chainId })
    .setNetworkId(config.networkId)
    .createTransaction();

  return dataTx;
};

export const getAccountTx = (name: string) => {
  const chainId = nameToChianId(name).toString() as ChainId;
  const number = convertToNumber(name);

  const tx = Pact.builder
    .execution(Pact.modules["user.registry"]["get-account"](number))
    .setMeta({ chainId })
    .setNetworkId(config.networkId)
    .createTransaction();

  return tx;
};
