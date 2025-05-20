'use client';

import { ChainweaverWalletConnect } from '@/components/ChainweaverWalletConnect/ChainweaverWalletConnect';
import { EckoWalletConnect } from '@/components/EckoWalletConnect/EckoWalletConnect';
import { MagicConnect } from '@/components/MagicConnect/MagicConnect';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import { useAccount } from '@/hooks/account';
import { useUser } from '@/hooks/user';
import { MonoKeyboardArrowDown } from '@kadena/kode-icons';
import { Button, Card, ContextMenu, Stack } from '@kadena/kode-ui';
import {
  CardContentBlock,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { wallets } = useAccount();
  return (
    <>
      <SideBarBreadcrumbs />

      <Stack flexDirection="column" width="100%">
        <SectionCard stack="vertical">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="wallets"
              actions={
                <>
                  <WalletSelector />
                </>
              }
            />
            <SectionCardBody>
              {JSON.stringify(wallets, null, 2)}
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default Home;
