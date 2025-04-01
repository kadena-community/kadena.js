import { useRightAside } from '@/App/Layout/useRightAside';
import { Fungible, IOwnedAccount } from '@/modules/account/account.repository';
import { MonoMoreHoriz } from '@kadena/kode-icons/system';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { useMemo, useState } from 'react';
import { AssetAction } from './ AssetAction';
import { AddTokenForm } from './AddTokenForm';
import { actionsWrapperClass } from './style.css';

const MAXASSETCOUNT = 4;
export function Assets({
  selectedContract,
  setSelectedContract,
  accounts,
  fungibles,
  showAddToken = false,
}: {
  selectedContract: string;
  setSelectedContract: (contract: string) => void;
  accounts: IOwnedAccount[];
  fungibles: Fungible[];
  showAddToken?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const [isAssetFormExpanded, expandAssetForm, closeAssetForm] =
    useRightAside();
  const assets = useMemo(() => {
    return fungibles.map((item) => {
      const acs = accounts.filter((a) => a.contract === item.contract);
      return {
        ...item,
        accounts: acs,
        balance: acs
          .reduce((acc, a) => acc.plus(a.overallBalance), new PactNumber(0))
          .toDecimal(),
      };
    });
  }, [accounts, fungibles]);

  const { filteredAssets, hasShowAllButton } = useMemo(() => {
    if (showAll || assets.length <= MAXASSETCOUNT) {
      return { filteredAssets: assets, hasShowAllButton: false };
    }

    return {
      filteredAssets: assets.slice(0, MAXASSETCOUNT - 1),
      hasShowAllButton: true,
    };
  }, [showAll, assets]);

  return (
    <>
      <AddTokenForm isOpen={isAssetFormExpanded} onClose={closeAssetForm} />
      <SectionCard stack="horizontal">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Your Assets"
            description={<></>}
            actions={
              showAddToken ? (
                <Button
                  variant="outlined"
                  isCompact
                  onPress={() => {
                    expandAssetForm();
                  }}
                >
                  Add new asset
                </Button>
              ) : (
                <></>
              )
            }
          />
          <SectionCardBody>
            <Heading as="h5">Available Assets</Heading>
            <Stack className={actionsWrapperClass}>
              {filteredAssets.map((asset) => (
                <AssetAction
                  label={asset.symbol}
                  body={asset.balance}
                  isSelected={asset.contract === selectedContract}
                  handleClick={() => setSelectedContract(asset.contract)}
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
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
}
