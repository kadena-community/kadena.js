'use client';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { accounts } = useAccount();
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
              {JSON.stringify(accounts, null, 2)}
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default Home;
