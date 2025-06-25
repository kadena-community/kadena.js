'use client';
import { AdminButtonBar } from '@/components/AdminButtonBar/AdminButtonBar';
import { AssetsList } from '@/components/AssetsList/AssetsList';
import { ChangePasswordForm } from '@/components/Forms/ChangePasswordForm/ChangePasswordForm';
import { Profile } from '@/components/Profile/Profile';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletsList } from '@/components/WalletsList/WalletsList';
import { Stack, Link as UILink } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Home = () => {
  const params = useSearchParams();
  const p = params.get('p') || 'profile';

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/settings">
          Settings
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%" gap="md">
        <AdminButtonBar>
          <UILink
            isCompact
            component={Link}
            href="/settings?p=profile"
            variant={p === 'profile' ? 'primary' : 'outlined'}
          >
            Profile
          </UILink>

          <UILink
            isCompact
            component={Link}
            href="/settings?p=password"
            variant={p === 'password' ? 'primary' : 'outlined'}
          >
            Change password
          </UILink>
          <UILink
            isCompact
            component={Link}
            href="/settings?p=wallets"
            variant={p === 'wallets' ? 'primary' : 'outlined'}
          >
            Wallets
          </UILink>

          <UILink
            isCompact
            component={Link}
            href="/settings?p=assets"
            variant={p === 'assets' ? 'primary' : 'outlined'}
          >
            Assets
          </UILink>
        </AdminButtonBar>
        {p === 'profile' && <Profile />}
        {p === 'password' && (
          <SectionCard stack="vertical">
            <SectionCardContentBlock>
              <SectionCardHeader title="Change password" />
              <SectionCardBody>
                <ChangePasswordForm />
              </SectionCardBody>
            </SectionCardContentBlock>
          </SectionCard>
        )}
        {p === 'wallets' && <WalletsList />}
        {p === 'assets' && <AssetsList />}
      </Stack>
    </>
  );
};

export default Home;
