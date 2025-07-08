import { useAsset } from '@/hooks/asset';
import { shortenString } from '@/utils/shortenString';
import { MonoApps, MonoMoreVert } from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import { assetsSwitchWrapperClass } from './style.css';

export const AssetSwitch: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const { assets, asset, setAsset } = useAsset();

  return (
    <Stack width="100%" className={assetsSwitchWrapperClass}>
      <ButtonGroup fullWidth>
        {showLabel && (
          <>
            <Button
              textAlign="start"
              startVisual={<MonoApps />}
              isCompact
              variant="outlined"
              style={{ flex: 1 }}
            >
              {asset ? shortenString(asset.contractName) : 'Select an asset'}
            </Button>
          </>
        )}

        <ContextMenu
          trigger={
            <Button
              isCompact
              variant="outlined"
              startVisual={showLabel ? <MonoMoreVert /> : <MonoApps />}
            />
          }
        >
          {assets.map((ass) => (
            <ContextMenuItem
              onClick={() => setAsset(ass)}
              key={ass.uuid}
              label={ass.contractName}
            />
          ))}

          {assets.length === 0 && (
            <ContextMenuItem onClick={() => {}} label="No assets yet" />
          )}
        </ContextMenu>
      </ButtonGroup>
    </Stack>
  );
};
