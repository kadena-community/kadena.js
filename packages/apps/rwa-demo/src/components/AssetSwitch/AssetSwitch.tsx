import { useAsset } from '@/hooks/asset';
import { MonoSettings, MonoWorkspaces } from '@kadena/kode-icons';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
} from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

export const AssetSwitch: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const router = useRouter();
  const { assets, asset, setAsset } = useAsset();

  return (
    <>
      <ContextMenu
        trigger={
          <Button isCompact variant="outlined">
            {showLabel ? (
              asset ? (
                asset.name
              ) : (
                'Select an asset'
              )
            ) : (
              <MonoWorkspaces />
            )}
          </Button>
        }
      >
        {assets.map((ass) => (
          <ContextMenuItem
            onClick={() => setAsset(ass)}
            key={ass.uuid}
            label={ass.name}
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
    </>
  );
};
