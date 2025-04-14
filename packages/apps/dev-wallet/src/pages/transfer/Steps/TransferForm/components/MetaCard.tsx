import {
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { AccountSearchBox } from '@/pages/transfer/Components/AccountSearchBox';
import { CreationTime } from '@/pages/transfer/Components/CreationTime';
import { TTLSelect } from '@/pages/transfer/Components/TTLSelect';
import { useShow } from '@/utils/useShow';
import { ChainId } from '@kadena/client';
import { MonoLocalGasStation } from '@kadena/kode-icons/system';
import { Card, Stack, TextField } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { FC } from 'react';
import { Control, Controller, UseFormGetValues } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  control: Control<ITransfer, any>;
  withEvaluate: any;
  forceRender: React.Dispatch<React.SetStateAction<number>>;
  chains: {
    chainId: ChainId;
    balance: string;
  }[];
  hasXChain: boolean;
  evaluateTransactions: () => void;
  filteredAccounts: IOwnedAccount[];
  validateAccount: any;
  getValues: UseFormGetValues<ITransfer>;
  filteredWatchedAccounts: IWatchedAccount[];
  contacts: IContact[];
  activeNetwork:
    | (INetwork & {
        isHealthy?: boolean;
      })
    | undefined;
  watchFungibleType: string;
}

export const MetaCard: FC<IProps> = ({
  control,
  withEvaluate,
  forceRender,
  hasXChain,
  evaluateTransactions,
  filteredAccounts,
  validateAccount,
  filteredWatchedAccounts,
  getValues,
  contacts,
  activeNetwork,
  watchFungibleType,
}) => {
  const [, , AdvancedMode] = useShow(true);
  return (
    <>
      <Card fullWidth>
        <CardContentBlock
          title="Fees"
          level={2}
          visual={<MonoLocalGasStation width={24} height={24} />}
        >
          <Stack flexDirection="column" gap="xxl" marginBlockEnd="xxxl">
            <AdvancedMode>
              <Stack flexDirection="column" gap="sm">
                <Controller
                  name={`gasPayer`}
                  control={control}
                  rules={{
                    validate: (value) =>
                      validateAccount()(
                        value === undefined
                          ? getValues('senderAccount')
                          : value,
                      ),
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <Stack flexDirection={'column'}>
                        <AccountSearchBox
                          label="Address:"
                          isSenderAccount
                          accounts={filteredAccounts}
                          watchedAccounts={filteredWatchedAccounts}
                          contacts={contacts}
                          network={activeNetwork!}
                          contract={watchFungibleType}
                          selectedAccount={
                            field.value === undefined
                              ? getValues('senderAccount')
                              : field.value
                          }
                          onSelect={withEvaluate((account: any) => {
                            console.log('gasPayer', account);
                            field.onChange(account ? { ...account } : null);
                            forceRender((prev) => prev + 1);
                          })}
                          errorMessage={
                            error?.message || 'Please check the account'
                          }
                          isInvalid={!!error}
                        />
                      </Stack>
                    );
                  }}
                />
                <Controller
                  name="gasPrice"
                  control={control}
                  rules={{ required: true, min: 0 }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      aria-label="Gas Price"
                      startVisual={<Label>Gas Price:</Label>}
                      placeholder="Enter gas price"
                      value={field.value}
                      onChange={(e) => {
                        if (!e.target.value) {
                          field.onChange('');
                          return;
                        }
                        try {
                          const val = new PactNumber(e.target.value);
                          if (val.lt(0)) {
                            throw new Error('negative value');
                          }
                          const newValue =
                            val.toString() +
                            (e.target.value.endsWith('.') ? '.' : '');
                          field.onChange(newValue);
                        } catch (e) {
                          // console.log('error', e);
                        }
                        // evaluateTransactions();
                      }}
                      onBlur={evaluateTransactions}
                      size="sm"
                      defaultValue="0.00000001"
                      isInvalid={!!error}
                      errorMessage={'Please enter a valid gas price'}
                    />
                  )}
                />
                <Controller
                  name="gasLimit"
                  control={control}
                  rules={{ required: true, min: 0 }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      aria-label="Enter gas limit"
                      placeholder="Enter gas limit"
                      startVisual={<Label>Gas Limit:</Label>}
                      value={field.value}
                      onChange={(e) => {
                        if (!e.target.value) {
                          field.onChange('');
                          return;
                        }
                        try {
                          const val = new PactNumber(e.target.value);
                          if (val.lt(0)) {
                            throw new Error('negative value');
                          }
                          field.onChange(val.toInteger());
                        } catch (e) {
                          // console.log('error', e);
                        }
                      }}
                      onBlur={evaluateTransactions}
                      size="sm"
                      defaultValue="2500"
                      isInvalid={!!error}
                      errorMessage={'Please enter a valid gas limit'}
                    />
                  )}
                />
              </Stack>
            </AdvancedMode>

            <Stack
              gap="sm"
              flexDirection={'column'}
              paddingBlockEnd={'xxl'}
              width="100%"
              style={{ display: hasXChain ? 'flex' : 'none' }}
            ></Stack>
          </Stack>
        </CardContentBlock>
      </Card>
      <Card fullWidth>
        <CardContentBlock title="Meta Data" level={2}>
          <Stack flexDirection="column" gap="xxl" marginBlockEnd="xxxl">
            <Controller
              name="creationTime"
              control={control}
              render={({ field }) => (
                <CreationTime
                  value={field.value}
                  onChange={(sec) => {
                    field.onChange(sec);
                  }}
                />
              )}
            />
            <Controller
              name="ttl"
              control={control}
              render={({ field }) => (
                <TTLSelect
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Stack>
        </CardContentBlock>
      </Card>
    </>
  );
};
