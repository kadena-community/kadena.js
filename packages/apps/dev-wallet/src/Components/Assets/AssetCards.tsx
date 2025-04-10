import { Fungible } from '@/modules/account/account.repository';
import { MonoMoreHoriz } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import { FC, useMemo, useState } from 'react';
import { AssetAction } from './ AssetAction';
import { actionsWrapperClass } from './style.css';

interface IProps {
  assets: (Fungible & {
    balance: number;
  })[];
  onClick: (args: any) => void;
  selectedContract?: string;
}

const MAXASSETCOUNT = 4;

export const AssetCards: FC<IProps> = ({
  assets,
  onClick,
  selectedContract,
}) => {
  const [showAll, setShowAll] = useState(false);

  const { filteredAssets, hasShowAllButton } = useMemo(() => {
    if (showAll || assets.length <= MAXASSETCOUNT) {
      return { filteredAssets: assets, hasShowAllButton: false };
    }

    return {
      filteredAssets: assets.slice(0, MAXASSETCOUNT - 1),
      hasShowAllButton: true,
    };
  }, [showAll, assets]);

  const handleClick = (contract: string) => {
    onClick(contract);
  };

  return (
    <Stack className={actionsWrapperClass}>
      {filteredAssets.map((asset) => (
        <AssetAction
          key={asset.contract}
          label={asset.symbol}
          body={`${asset.balance}`}
          isSelected={asset.contract === selectedContract}
          handleClick={() => handleClick(asset.contract)}
        />
      ))}
      {hasShowAllButton && (
        <AssetAction
          label=""
          body={<MonoMoreHoriz />}
          isSelected={false}
          handleClick={() => setShowAll(true)}
        />
      )}
    </Stack>
  );
};
