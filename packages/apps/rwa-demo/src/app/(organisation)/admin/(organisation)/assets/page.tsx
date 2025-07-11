'use client';

import { AssetFormScreen } from '@/components/AssetForm/AssetFormScreen';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { FormatSelectAsset } from '@/components/TableFormatters/FormatSelectAsset';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useOrganisation } from '@/hooks/organisation';
import {
  MonoAdd,
  MonoAddLink,
  MonoDelete,
  MonoKeyboardArrowDown,
} from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { AdminBar } from '../AdminBar';

const Home = () => {
  const { account } = useAccount();
  const { isAllowed } = useCreateContract();
  const { organisation } = useOrganisation();
  const { assets, removeAsset } = useAsset();

  const handleDelete = (value: any) => {
    removeAsset(value as IAsset);
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

      <AdminBar />

      {!account && (
        <Notification intent="warning" role="alert">
          <NotificationHeading>No account selected</NotificationHeading>
          You do not have an account selected yet.
          <NotificationFooter>
            <WalletSelector
              trigger={
                <Button
                  isCompact
                  variant="outlined"
                  startVisual={<MonoAddLink />}
                  endVisual={<MonoKeyboardArrowDown />}
                >
                  Select a wallet
                </Button>
              }
            />
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
                    aria-label="Add asset"
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
                  width: '30%',
                },
                {
                  key: 'namespace',
                  label: 'ns',
                  width: '50%',
                },
                {
                  label: '',
                  key: '',
                  width: '10%',
                  render: FormatSelectAsset(),
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
                            aria-label="Remove asset"
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
