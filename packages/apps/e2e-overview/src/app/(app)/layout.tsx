'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';

import { useUser } from '@/hooks/user';
import { Link, Stack } from '@kadena/kode-ui';
import { SideBarLayout, SideBarTopBanner } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isMounted } = useUser();

  useEffect(() => {
    if (isMounted && !user) {
      window.location.href = '/login';
    }
  }, [user, isMounted]);

  if (!isMounted || !user) {
    return 'loading...';
  }

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
