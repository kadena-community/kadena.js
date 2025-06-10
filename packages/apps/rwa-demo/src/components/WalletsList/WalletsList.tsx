import { Confirmation } from '@/components/Confirmation/Confirmation';
import { WalletSelector } from '@/components/WalletSelector/WalletSelector';
import { useAccount } from '@/hooks/account';
import {
  MonoAccountBox,
  MonoAdd,
  MonoAddLink,
  MonoKeyboardArrowDown,
  MonoLinkOff,
} from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const WalletsList: FC<{ init?: boolean }> = ({ init }) => {
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
          description={
            <>
              {init
                ? 'You have no wallet selected. Which wallet do you want to work with?'
                : ''}
            </>
          }
          actions={
            <>
              <WalletSelector
                trigger={
                  <Button
                    isCompact
                    variant="outlined"
                    startVisual={<MonoAddLink />}
                    endVisual={<MonoKeyboardArrowDown />}
                  >
                    Select a wallet
                  </Button>
                }
              />
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
          {accounts?.length === 0 && (
            <Notification role="alert">
              <NotificationHeading>No accounts linked yet</NotificationHeading>
              You have no accounts linked to your wallet. Please select a wallet
              to connect an account.
              <NotificationFooter>
                <WalletSelector
                  trigger={
                    <NotificationButton icon={<MonoAdd />}>
                      Select an account
                    </NotificationButton>
                  }
                />
              </NotificationFooter>
            </Notification>
          )}
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
