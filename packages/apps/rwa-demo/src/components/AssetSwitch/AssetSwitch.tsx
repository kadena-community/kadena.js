import { useAsset } from '@/hooks/asset';
import { MonoMoreVert, MonoSettings } from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { assetsSwitchWrapperClass } from './style.css';

export const AssetSwitch: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const router = useRouter();
  const { assets, asset, setAsset } = useAsset();

  return (
    <Stack width="100%" className={assetsSwitchWrapperClass}>
      <ButtonGroup>
        {showLabel && (
          <Button isCompact variant="outlined" style={{ flex: 1 }}>
            {asset ? asset.contractName : 'Select an asset'}
          </Button>
        )}

        <ContextMenu
          trigger={
            <Button
              isCompact
              variant="outlined"
              startVisual={<MonoMoreVert />}
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
          <ContextMenuDivider />

          <ContextMenuItem
            onClick={() => {
              router.push('/assets');
            }}
            endVisual={<MonoSettings />}
            label="Asset Settings"
          />
        </ContextMenu>
      </ButtonGroup>
    </Stack>
  );
};
