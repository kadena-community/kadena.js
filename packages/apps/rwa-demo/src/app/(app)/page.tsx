'use client';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import { useAccount } from '@/hooks/account';
import { MonoDelete } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

const Home = () => {
  const { accounts, removeAccount } = useAccount();

  const handleRemove = (address: any) => {
    removeAccount(address);
  };
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
              <CompactTable
                variant="open"
                fields={[
                  {
                    key: 'alias',
                    label: 'Alias',
                    width: '30%',
                  },
                  {
                    key: 'address',
                    label: 'Address',
                    width: '30%',
                    render: CompactTableFormatters.FormatAccount(),
                  },
                  {
                    key: 'address',
                    label: 'Address',
                    width: '30%',
                    render: CompactTableFormatters.FormatActions({
                      trigger: (
                        <Confirmation
                          onPress={handleRemove}
                          trigger={
                            <Button
                              isCompact
                              variant="outlined"
                              startVisual={<MonoDelete />}
                            />
                          }
                        >
                          Are you sure you want to unlink your wallet?
                        </Confirmation>
                      ),
                    }),
                  },
                ]}
                data={accounts ?? []}
              />
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
};

export default Home;
