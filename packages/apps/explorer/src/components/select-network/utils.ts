import type { INetwork } from '@/constants/network';

export const validateNewNetwork = (
  networks: INetwork[],
  newNetwork: INetwork,
): string[] => {
  const errors = [];

  if (
    networks.some(
      (network) =>
        network.networkId === newNetwork.networkId &&
        network.slug === newNetwork.slug,
    )
  ) {
    errors.push('network already exists');
  }

  errors.push(
    ...(Object.entries(newNetwork)
      .map(([key, value]) => {
        switch (key) {
          case 'networkId':
          case 'slug':
          case 'label':
          case 'graphUrl':
            return value === undefined || value.length <= 0
              ? `'${key}' is required`
              : undefined;
          case 'chainwebUrl':
          default:
            return undefined;
        }
      })
      .filter(Boolean) as string[]),
  );

  return errors;
};

export const getFormValues = <T extends Record<string, unknown>>(
  data: FormData,
): T => {
  const values: Record<string, unknown> = {};
  data.forEach((value, key) => {
    values[key] = value;
  });
  return values as T;
};
