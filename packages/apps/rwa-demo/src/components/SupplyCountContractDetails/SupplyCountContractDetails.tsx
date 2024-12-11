import { useAsset } from '@/hooks/asset';
import { MonoWarning } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
import type { FC } from 'react';

export const SupplyCountContractDetails: FC = () => {
  const { asset } = useAsset();

  if (!asset) return null;

  if (asset.supply > asset.maxSupply)
    return (
      <Stack alignItems="center" gap="xs">
        <MonoWarning
          style={{ color: token('color.icon.semantic.warning.default') }}
          title={`The total supply of tokens is bigger than the max supply (${asset.maxSupply})`}
        />{' '}
        {asset.supply}
      </Stack>
    );

  return asset.supply;
};
