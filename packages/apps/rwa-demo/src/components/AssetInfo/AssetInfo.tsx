import { useAsset } from '@/hooks/asset';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { SupplyCount } from '../SupplyCount/SupplyCount';

export const AssetInfo: FC = () => {
  const { paused, asset } = useAsset();
  if (!asset) return;
  return (
    <Stack width="100%" flexDirection="column">
      <Heading as="h3">{asset.contractName}</Heading>
      <Stack width="100%" alignItems="center" gap="md">
        <Button isDisabled>
          {paused ? (
            <Stack gap="sm" alignItems="center">
              <MonoPause />
              paused
            </Stack>
          ) : (
            <Stack gap="sm" alignItems="center">
              <MonoPlayArrow />
              active
            </Stack>
          )}
        </Button>
        <div>maxSupply: {asset.maxSupply}</div>
        <div>maxBalance: {asset.maxBalance}</div>
        <SupplyCount />
      </Stack>
    </Stack>
  );
};
