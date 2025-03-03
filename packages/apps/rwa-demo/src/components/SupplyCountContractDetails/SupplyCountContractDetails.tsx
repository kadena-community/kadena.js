import { INFINITE_COMPLIANCE } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { MonoWarning } from '@kadena/kode-icons';
import { Stack, Text } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
import type { FC } from 'react';

export const SupplyCountContractDetails: FC = () => {
  const { asset } = useAsset();

  if (!asset) return null;

  if (
    asset.compliance.maxSupply.isActive &&
    asset.supply > asset.compliance.maxSupply.value &&
    asset.compliance.maxSupply.value > INFINITE_COMPLIANCE
  )
    return (
      <Stack alignItems="center" gap="xs">
        <MonoWarning
          style={{ color: token('color.icon.semantic.warning.default') }}
          title={`The total supply of tokens is bigger than the max supply (${asset.compliance.maxSupply.value})`}
        />{' '}
        <Text as="span">{asset.supply}</Text>
      </Stack>
    );

  return asset.supply;
};
