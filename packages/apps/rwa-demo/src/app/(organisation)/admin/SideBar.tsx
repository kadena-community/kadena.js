import { KLogo } from '@/app/(app)/KLogo';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { SideBar as SideBarLayout } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  return (
    <SideBarLayout
      topbannerHeight={topbannerHeight}
      logo={
        <>
          <Link href="/">
            <KLogo />
          </Link>
        </>
      }
      navigation={<></>}
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
