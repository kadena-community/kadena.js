import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { MonoPause, MonoPlayArrow, MonoVpnLock } from '@kadena/kode-icons';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export const AssetInfo: FC = () => {
  const { paused, asset } = useAsset();

  if (!asset) return;
  return (
    <Stack width="100%" flexDirection="column">
      <Stack width="100%" gap="sm" alignItems="center" marginBlockEnd="md">
        <Text>
          <MonoVpnLock />
        </Text>
        <Heading as="h3">{asset.contractName}</Heading>
        <Button
          aria-label="toggle pause state"
          isCompact
          variant="transparent"
          isDisabled
        >
          <TransactionTypeSpinner
            type={TXTYPES.PAUSECONTRACT}
            fallbackIcon={
              paused ? (
                <Stack gap="sm" alignItems="center">
                  <MonoPause />
                  paused
                </Stack>
              ) : (
                <Stack gap="sm" alignItems="center">
                  <MonoPlayArrow />
                  active
                </Stack>
              )
            }
          />
        </Button>
      </Stack>
    </Stack>
  );
};
