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
import { useState, type FC } from 'react';
import { AssetForm } from './AssetForm';

export const AssetSwitch: FC = () => {
  const { assets, asset, setAsset } = useAsset();
  const [openSide, setOpenSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  return (
    <>
      {isRightAsideExpanded && openSide && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
            setOpenSide(false);
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
            {asset ? asset.name : 'Select an asset'}
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
            setIsRightAsideExpanded(true);
            setOpenSide(true);
          }}
          endVisual={<MonoSettings />}
          label="Asset Settings"
        />
      </ContextMenu>
    </>
  );
};
