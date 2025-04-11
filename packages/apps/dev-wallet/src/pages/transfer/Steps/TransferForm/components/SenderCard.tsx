import { AutoBadge, Chain } from '@/Components/Badge/Badge';
import {
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { wrapperClass } from '@/pages/errors/styles.css';
import { Label } from '@/pages/transaction/components/helpers';
import { AccountSearchBox } from '@/pages/transfer/Components/AccountSearchBox';
import { formatList } from '@/utils/helpers';
import { useShow } from '@/utils/useShow';
import { ChainId } from '@kadena/client';
import { MonoSwipeRightAlt } from '@kadena/kode-icons/system';
import { Button, Card, Select, SelectItem, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  withEvaluate: any;
  forceRender: React.Dispatch<React.SetStateAction<number>>;
  chains: {
    chainId: ChainId;
    balance: string;
  }[];
  control: Control<ITransfer, any>;
  validateAccount: any;
  filteredAccounts: IOwnedAccount[];
  filteredWatchedAccounts: IWatchedAccount[];
  contacts: IContact[];
  watchFungibleType: string;
  overallBalance: string;
  senderAccount: IRetrievedAccount;
  activeNetwork:
    | (INetwork & {
        isHealthy?: boolean;
      })
    | undefined;
}

export const SenderCard: FC<IProps> = ({
  withEvaluate,
  control,
  validateAccount,
  filteredAccounts,
  filteredWatchedAccounts,
  contacts,
  activeNetwork,
  watchFungibleType,
  overallBalance,
  senderAccount,
  forceRender,
  chains,
}) => {
  const [, setShowMore, AdvancedMode] = useShow(false);

  return (
    <Card fullWidth>
      <CardContentBlock
        level={2}
        title="Sender"
        visual={<MonoSwipeRightAlt width={24} height={24} />}
        supportingContent={
          <Stack width="100%" gap="sm">
            <Button
              isCompact
              variant="outlined"
              onPress={() => setShowMore((v) => !v)}
            >
              more Options
            </Button>
          </Stack>
        }
      >
        <Stack
          flexDirection="column"
          gap="xxl"
          marginBlockEnd="xxxl"
          className={wrapperClass}
        >
          <Controller
            name={`senderAccount`}
            control={control}
            rules={{
              validate: validateAccount(),
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <Stack flexDirection={'column'}>
                  <AccountSearchBox
                    label="Sender address"
                    isSenderAccount
                    accounts={filteredAccounts}
                    watchedAccounts={filteredWatchedAccounts}
                    contacts={contacts}
                    network={activeNetwork!}
                    contract={watchFungibleType}
                    selectedAccount={field.value}
                    onSelect={withEvaluate((account: any) => {
                      field.onChange(account);
                      forceRender((prev) => prev + 1);
                    })}
                    errorMessage={error?.message || 'Please check the account'}
                    isInvalid={!!error}
                  />
                </Stack>
              );
            }}
          />
          <AdvancedMode>
            <Stack flex={1}>
              <Controller
                name="chain"
                control={control}
                render={({ field }) => (
                  <Select
                    aria-label="Chain"
                    startVisual={<Label>Chain:</Label>}
                    // label="Chain"
                    size="sm"
                    placeholder="Select a chain"
                    selectedKey={field.value}
                    onSelectionChange={withEvaluate(field.onChange)}
                  >
                    {senderAccount
                      ? [
                          <SelectItem key={''}>
                            <Stack
                              flexDirection="row"
                              alignItems="center"
                              gap="sm"
                            >
                              <AutoBadge />
                              {chains.length ? (
                                <Chain
                                  chainId={formatList(
                                    chains.map((c) => +c.chainId),
                                  )}
                                />
                              ) : null}
                              (balance: {overallBalance})
                            </Stack>
                          </SelectItem>,
                          ...chains.map((chain) => (
                            <SelectItem key={chain.chainId}>
                              <Stack
                                flexDirection="row"
                                alignItems="center"
                                gap="sm"
                              >
                                <Chain chainId={chain.chainId} />
                                (balance: {chain.balance})
                              </Stack>
                            </SelectItem>
                          )),
                        ]
                      : []}
                  </Select>
                )}
              />
            </Stack>
          </AdvancedMode>
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
