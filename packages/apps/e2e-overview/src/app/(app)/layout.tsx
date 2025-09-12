'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';

import { Link, Stack } from '@kadena/kode-ui';
import { SideBarLayout, SideBarTopBanner } from '@kadena/kode-ui/patterns';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <SideBarTopBanner>
        <CookieConsent />
      </SideBarTopBanner>

      <SideBarLayout
        logo={
          <Link href="/">
            <KLogo />
          </Link>
        }
        sidebar={<SideBar />}
      >
        <Stack width="100%" flexDirection="column" gap="sm">
          {children}
        </Stack>
      </SideBarLayout>
    </>
  );
};

export default RootLayout;
