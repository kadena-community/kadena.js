'use client';

import { UsersList } from '@/components/admin/UsersList/UsersList';
import { AssetFormScreen } from '@/components/AssetForm/AssetFormScreen';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useOrganisation } from '@/hooks/organisation';
import { MonoAdd, MonoDelete, MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';

const Home = () => {
  const { account } = useAccount();
  const { addNotification } = useNotifications();
  const { isAllowed } = useCreateContract();
  const { organisation } = useOrganisation();

  // const handleDelete = (value: any) => {
  //   removeAsset(value as IAsset);
  // };

  // const handleLink = async (assetProp: any) => {
  //   const asset = await getAsset(assetProp.uuid, account!);
  //   if (!asset) {
  //     addNotification({
  //       intent: 'negative',
  //       label: 'asset is not found',
  //     });
  //     return;
  //   }
  //   setAsset(asset);
  // };

  console.log({ organisation }, 232323424);
  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/users">
          Users
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <UsersList organisationId={organisation.id} />
    </>
  );
};

export default Home;
