'use client';

import { AssetFormScreen } from '@/components/AssetForm/AssetFormScreen';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { MonoAdd, MonoDelete, MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
  useLayout,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';

const Assets = () => {
  const { account } = useAccount();
  const { assets, removeAsset, setAsset, getAsset } = useAsset();
  const { isAllowed } = useCreateContract();
  const { addNotification } = useNotifications();
  const [openSide, setOpenSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const handleDelete = (value: any) => {
    removeAsset(value);
  };

  const handleLink = async (assetProp: any) => {
    const asset = await getAsset(assetProp.uuid, account!);
    if (!asset) {
      addNotification({
        intent: 'negative',
        label: 'asset is not found',
      });
      return;
    }
    setAsset(asset);
    window.location.href = '/';
  };

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/assets">Assets</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      {isRightAsideExpanded && openSide && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
            setOpenSide(false);
          }}
        >
          <RightAsideHeader label="Assets" />
          <RightAsideContent></RightAsideContent>
        </RightAside>
      )}
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Assets"
            description={<>List of all your selected contracts</>}
            actions={
              <AssetFormScreen
                trigger={
                  <Button
                    isDisabled={!isAllowed}
                    variant="outlined"
                    isCompact
                    endVisual={<MonoAdd />}
                  >
                    Add Asset
                  </Button>
                }
              />
            }
          />
          <SectionCardBody>
            <CompactTable
              fields={[
                {
                  key: 'contractName',
                  label: 'name',
                  width: '80%',
                },
                {
                  label: '',
                  key: '',
                  width: '10%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Button
                        isCompact
                        variant="outlined"
                        startVisual={<MonoFindInPage />}
                        onPress={handleLink}
                      />
                    ),
                  }),
                },
                {
                  label: '',
                  key: 'uuid',
                  width: '10%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Confirmation
                        onPress={handleDelete}
                        trigger={
                          <Button
                            isCompact
                            variant="outlined"
                            startVisual={<MonoDelete />}
                          />
                        }
                      >
                        Are you sure you want to remove this asset?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={assets}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};

export default Assets;
