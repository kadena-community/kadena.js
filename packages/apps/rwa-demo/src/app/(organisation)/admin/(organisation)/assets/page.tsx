'use client';

import { AssetFormScreen } from '@/components/AssetForm/AssetFormScreen';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useOrganisation } from '@/hooks/organisation';
import {
  MonoAdd,
  MonoDelete,
  MonoFindInPage,
  MonoSettings,
} from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
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
  useNotifications,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

const Home = () => {
  const { account } = useAccount();
  const { addNotification } = useNotifications();
  const { isAllowed } = useCreateContract();
  const { organisation } = useOrganisation();
  const { assets, removeAsset, setAsset, getAsset } = useAsset();
  const [openSide, setOpenSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const router = useRouter();

  const handleDelete = (value: any) => {
    removeAsset(value as IAsset);
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
  };

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/assets">
          Assets
        </SideBarBreadcrumbsItem>
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
      {!account && (
        <Notification intent="warning" role="alert">
          <NotificationHeading>No account selected</NotificationHeading>
          You do not have an account selected yet.
          <NotificationFooter>
            <NotificationButton
              onClick={() => router.push('/settings')}
              icon={<MonoSettings />}
            >
              Go to wallet selection
            </NotificationButton>
          </NotificationFooter>
        </Notification>
      )}
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Assets"
            description={<>List the organisation contracts</>}
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
              variant="open"
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
                  key: '',
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

export default Home;
