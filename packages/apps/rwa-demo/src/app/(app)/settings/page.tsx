'use client';
import { AssetsList } from '@/components/AssetsList/AssetsList';
import { ChangePasswordForm } from '@/components/Forms/ChangePasswordForm/ChangePasswordForm';
import { Profile } from '@/components/Profile/Profile';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletsList } from '@/components/WalletsList/WalletsList';
import { Link, Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/settings">
          settings
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%" gap="md">
        <Profile />
        <SectionCard stack="vertical">
          <SectionCardContentBlock>
            <SectionCardHeader title="Change password" />
            <SectionCardBody>
              <ChangePasswordForm />
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
        <WalletsList />

        <AssetsList />
      </Stack>
    </>
  );
};

export default Home;
