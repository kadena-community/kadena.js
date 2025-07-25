import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAsset } from '@/hooks/asset';
import { useUser } from '@/hooks/user';
import { shortenString } from '@/utils/shortenString';
import { MonoApps, MonoMoreVert } from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import { assetsSwitchWrapperClass } from './style.css';

export const AssetSwitch: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const { assets, asset, setAsset } = useAsset();
  const { isOrgAdmin } = useUser();

  const handleSwitch = async (asset: IAsset) => {
    await setAsset(asset);
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <Stack width="100%" className={assetsSwitchWrapperClass}>
      <ButtonGroup fullWidth>
        {showLabel && (
          <>
            <Button
              aria-label="Select asset"
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
              onClick={() => handleSwitch(ass)}
              key={ass.uuid}
              label={ass.contractName}
            />
          ))}

          {assets.length === 0 && (
            <ContextMenuItem onClick={() => {}} label="No assets yet" />
          )}

          {isOrgAdmin && (
            <>
              <ContextMenuDivider />

              <ContextMenuItem
                label="Add a new asset"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  window.location.href = '/admin/assets';
                }}
              />
            </>
          )}
        </ContextMenu>
      </ButtonGroup>
    </Stack>
  );
};
