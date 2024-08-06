import type { NetworkInfoQuery } from '@/__generated__/sdk';
import type { IEditNetwork, INetwork } from '@/constants/network';

// create the type with label.
// if the value already exists in 1 of the other networks,add a number behind it.
// example label: "VALUE" becomes label: "VALUE-1"
const createTypeName = (
  type: keyof INetwork,
  label: string,
  networks: INetwork[],
): string => {
  const foundResult = networks.filter((network) =>
    network[type]?.toLowerCase().startsWith(label.toLowerCase()),
  );

  return foundResult.length > 0 ? `${label}-${foundResult.length}` : label;
};

export const defaultNamingOfNetwork = (
  network: IEditNetwork,
  body: NetworkInfoQuery,
  networks: INetwork[],
): IEditNetwork => {
  return {
    ...network,
    networkId: body.networkInfo?.networkId ?? '',
    label: createTypeName('label', body.networkInfo?.networkId ?? '', networks),
    slug: createTypeName(
      'slug',
      body.networkInfo?.networkId ?? '',
      networks,
    ).toLowerCase(),
  };
};
