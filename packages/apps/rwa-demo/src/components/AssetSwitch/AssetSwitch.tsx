import { useAsset } from '@/hooks/asset';
import { MonoSettings } from '@kadena/kode-icons';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { AssetForm } from './AssetForm';

export const AssetSwitch: FC = () => {
  const { assets } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  return (
    <>
      {isRightAsideExpanded && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
          }}
        >
          <RightAsideHeader label="Assets" />
          <RightAsideContent>
            {assets.map((ass) => (
              <AssetForm key={ass.uuid} asset={ass} />
            ))}
            <AssetForm />
          </RightAsideContent>
        </RightAside>
      )}
      <ContextMenu
        trigger={
          <Button isCompact variant="outlined">
            Select asset
          </Button>
        }
      >
        {assets.map((ass) => (
          <ContextMenuItem key={ass.uuid} label={ass.name} />
        ))}
        <ContextMenuDivider />

        <ContextMenuItem
          onClick={() => {
            setIsRightAsideExpanded(true);
          }}
          endVisual={<MonoSettings />}
          label="Asset Settings"
        />
      </ContextMenu>
    </>
  );
};
