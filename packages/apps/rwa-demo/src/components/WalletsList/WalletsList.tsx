import { Confirmation } from '@/components/Confirmation/Confirmation';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import { useAccount } from '@/hooks/account';
import { MonoAccountBox, MonoLinkOff } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const WalletsList: FC = () => {
  const { accounts, removeAccount, selectAccount } = useAccount();
  const handleRemove = (address: any) => {
    removeAccount(address);
  };

  const handleSelect = (address: any) => {
    selectAccount(address);
  };

  return (
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
                label: '',
                width: '15%',
                render: CompactTableFormatters.FormatActions({
                  trigger: (
                    <Button
                      onPress={handleSelect}
                      isCompact
                      variant="outlined"
                      startVisual={<MonoAccountBox />}
                    />
                  ),
                }),
              },
              {
                key: 'address',
                label: '',
                width: '15%',
                align: 'end',
                render: CompactTableFormatters.FormatActions({
                  trigger: (
                    <Confirmation
                      onPress={handleRemove}
                      trigger={
                        <Button
                          isCompact
                          variant="outlined"
                          startVisual={<MonoLinkOff />}
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
  );
};
