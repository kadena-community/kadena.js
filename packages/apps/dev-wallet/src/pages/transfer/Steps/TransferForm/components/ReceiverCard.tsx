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
import { IReceiver } from '@/pages/transfer/utils';
import { formatList } from '@/utils/helpers';
import { useShow } from '@/utils/useShow';
import { ChainId } from '@kadena/client';
import {
  MonoAdd,
  MonoCopyAll,
  MonoDelete,
  MonoSaveAlt,
} from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Heading,
  Select,
  SelectItem,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { FC, Fragment, useCallback, useEffect } from 'react';
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
} from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  control: Control<ITransfer, any>;
  withEvaluate: any;
  forceRender: React.Dispatch<React.SetStateAction<number>>;
  chains: {
    chainId: ChainId;
    balance: string;
  }[];
  getValues: UseFormGetValues<ITransfer>;
  getAvailableChains(account: IRetrievedAccount | undefined): ChainId[];
  senderAccount: IRetrievedAccount;
  senderChain: '' | ChainId;
  validateAccount: any;
  resetField: UseFormResetField<ITransfer>;
  reset: UseFormReset<ITransfer>;
  setValue: UseFormSetValue<ITransfer>;
  evaluateTransactions: () => void;
  filteredAccounts: IOwnedAccount[];
  isSafeTransfer: boolean;
  filteredWatchedAccounts: IWatchedAccount[];
  contacts: IContact[];
  activeNetwork:
    | (INetwork & {
        isHealthy?: boolean;
      })
    | undefined;
  watchFungibleType: string;
  redistribution: {
    source: ChainId;
    target: ChainId;
    amount: string;
  }[];
  crossChainText:
    | 'This will trigger cross-chain transfer'
    | 'This will trigger redistribution first';

  error:
    | {
        target: 'from' | `receivers.${number}` | 'gas' | 'meta' | 'general';
        message: string;
      }
    | undefined;
}

export const ReceiverCard: FC<IProps> = ({
  control,
  withEvaluate,
  forceRender,
  chains,
  getValues,
  getAvailableChains,
  senderAccount,
  senderChain,
  validateAccount,
  reset,
  setValue,
  evaluateTransactions,
  filteredAccounts,
  isSafeTransfer,
  filteredWatchedAccounts,
  contacts,
  activeNetwork,
  watchFungibleType,
  redistribution,
  crossChainText,
  error,
}) => {
  const [, setShowMore, AdvancedMode] = useShow(false);

  useEffect(() => {
    if (!error) return;
    Object.entries(error).map(([, value]) => {
      if (value.startsWith('receivers.')) {
        setShowMore(true);
      }
    });
  }, [error]);

  const resetReceiverFields = useCallback((idx: number) => {
    const receivers = getValues('receivers');
    const newReceivers = [...receivers];
    newReceivers.splice(idx, 1);

    const s = getValues();
    console.log({ s });
    reset({ ...s, receivers: newReceivers });
  }, []);

  return (
    <Card fullWidth>
      <CardContentBlock
        level={2}
        title="Receiver"
        visual={<MonoSaveAlt width={24} height={24} />}
        supportingContent={
          <Stack width="100%" gap="sm">
            <Button
              isCompact
              variant="outlined"
              onPress={() => setShowMore((v) => !v)}
            >
              more Options
            </Button>
            <Button
              isCompact
              variant="outlined"
              startVisual={<MonoAdd />}
              onClick={() => {
                const receivers = getValues('receivers');
                setValue('receivers', [
                  ...receivers,
                  {
                    amount: '',
                    address: '',
                    chain: '',
                    chunks: [],
                    discoveredAccount: undefined,
                  },
                ]);
              }}
            >
              Add receiver
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
            control={control}
            name="receivers"
            render={({ field: { value: watchReceivers } }) => {
              return (
                <>
                  {watchReceivers
                    .map((rec, index) => ({ rec, index }))
                    .filter(({ rec }) => rec)
                    .map(({ index }, renderIndex) => {
                      const rec = getValues(`receivers.${index}`);
                      if (!rec) return null;
                      const chainList = getAvailableChains(
                        rec.discoveredAccount,
                      );
                      const availableChains = ['', ...chainList].filter(
                        (ch) => {
                          // if the receiver is not the sender, then transfer is allowed from any chain
                          if (rec.address !== senderAccount?.address) {
                            return true;
                          }
                          // if the receiver is the sender, then the chains should be selected manually
                          if (!ch) return false;

                          if (!senderChain && chains.length === 1) {
                            return ch !== chains[0].chainId;
                          }

                          // source and target chain should not be the same
                          return ch !== senderChain;
                        },
                      );
                      console.log('availableChains', {
                        chainList,
                        availableChains,
                        senderChain,
                        rec,
                        senderAccount,
                      });
                      return (
                        <Fragment key={index}>
                          <Stack
                            gap="sm"
                            flexDirection={'column'}
                            paddingBlockEnd={'xxl'}
                          >
                            <Stack
                              marginBlockStart={'md'}
                              justifyContent={'space-between'}
                            >
                              <Heading variant="h5">
                                Receiver{' '}
                                {watchReceivers.length > 1
                                  ? `(${renderIndex + 1})`
                                  : ''}
                              </Heading>
                              <Stack>
                                <>
                                  {watchReceivers.length > 1 && (
                                    <Button
                                      isCompact
                                      variant="transparent"
                                      onClick={withEvaluate(() => {
                                        resetReceiverFields(index);
                                      })}
                                    >
                                      <MonoDelete />
                                    </Button>
                                  )}
                                  <Button
                                    isCompact
                                    variant="transparent"
                                    isDisabled={!rec.address || !rec.amount}
                                    onClick={() => {
                                      const list = [...watchReceivers];
                                      const newItem = {
                                        amount: rec.amount,
                                        address: rec.address,
                                        chain: '',
                                        chunks: [],
                                        discoveredAccount:
                                          rec.discoveredAccount,
                                      } as ITransfer['receivers'][number];
                                      list.splice(index + 1, 0, newItem);
                                      setValue('receivers', list);
                                      evaluateTransactions();
                                    }}
                                  >
                                    <MonoCopyAll />
                                  </Button>
                                </>
                              </Stack>
                            </Stack>

                            <Stack flexDirection={'column'} gap={'sm'}>
                              <Stack
                                key={index}
                                flexDirection={'column'}
                                gap="sm"
                                justifyContent={'flex-start'}
                              >
                                <Controller
                                  name={`receivers.${index}.discoveredAccount`}
                                  control={control}
                                  rules={{
                                    validate: validateAccount(false, false),
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => {
                                    return (
                                      <Stack flexDirection={'column'}>
                                        <AccountSearchBox
                                          label="Address:"
                                          accounts={filteredAccounts}
                                          hideKeySelector={!isSafeTransfer}
                                          watchedAccounts={
                                            filteredWatchedAccounts
                                          }
                                          contacts={contacts}
                                          network={activeNetwork!}
                                          contract={watchFungibleType}
                                          selectedAccount={field.value}
                                          errorMessage={
                                            error?.message ||
                                            'Please check the account'
                                          }
                                          isInvalid={!!error}
                                          onSelect={(account) => {
                                            if (account) {
                                              field.onChange(account);
                                              setValue(
                                                `receivers.${index}.address`,
                                                account.address,
                                              );
                                            } else {
                                              setValue(`receivers.${index}`, {
                                                amount: getValues(
                                                  `receivers.${index}.amount`,
                                                ),
                                                address: '',
                                                chain: '',
                                                chunks: getValues(
                                                  `receivers.${index}.chunks`,
                                                ),
                                                discoveredAccount: undefined,
                                              });
                                            }
                                            forceRender((prev) => prev + 1);
                                          }}
                                        />
                                      </Stack>
                                    );
                                  }}
                                />
                                <Controller
                                  control={control}
                                  name={`receivers.${index}.amount`}
                                  rules={{
                                    min: 0,
                                    required: true,
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <TextField
                                      aria-label="Amount"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                      }}
                                      placeholder="Enter the amount"
                                      startVisual={<Label>Amount:</Label>}
                                      onBlur={evaluateTransactions}
                                      value={field.value}
                                      size="sm"
                                      type="number"
                                      step="1"
                                      isInvalid={!!error}
                                      errorMessage={
                                        'Please enter a valid amount'
                                      }
                                    />
                                  )}
                                />

                                <AdvancedMode>
                                  <Stack flex={1} gap="sm">
                                    <Controller
                                      name={`receivers.${index}.chain`}
                                      control={control}
                                      render={({ field }) => (
                                        <Select
                                          aria-label="Chain"
                                          startVisual={<Label>Chain:</Label>}
                                          // label={index === 0 ? 'Chain' : undefined}
                                          placeholder="Select a chain"
                                          description={
                                            rec.xchain ||
                                            rec.chunks.find(({ chainId }) =>
                                              redistribution.find(
                                                (r) => r.target === chainId,
                                              ),
                                            )
                                              ? crossChainText
                                              : ''
                                          }
                                          errorMessage={
                                            error &&
                                            error.target ===
                                              `receivers.${index}` &&
                                            error.message
                                          }
                                          isInvalid={
                                            error &&
                                            error.target ===
                                              `receivers.${index}`
                                          }
                                          size="sm"
                                          selectedKey={field.value}
                                          onSelectionChange={withEvaluate(
                                            field.onChange,
                                          )}
                                        >
                                          {(rec.amount
                                            ? availableChains
                                            : []
                                          ).map((chain) => (
                                            <SelectItem key={chain}>
                                              {chain ? (
                                                <Chain chainId={chain} />
                                              ) : (
                                                <Stack
                                                  gap="sm"
                                                  title={rec.chunks
                                                    .map(
                                                      (c) =>
                                                        `chain ${c.chainId}: ${c.amount}`,
                                                    )
                                                    .join('\n')}
                                                >
                                                  <AutoBadge />
                                                  {rec.chunks.length > 0 && (
                                                    <Chain
                                                      chainId={formatList(
                                                        rec.chunks.map(
                                                          (c) => +c.chainId,
                                                        ),
                                                      )}
                                                    />
                                                  )}
                                                </Stack>
                                              )}
                                            </SelectItem>
                                          ))}
                                        </Select>
                                      )}
                                    />
                                  </Stack>
                                </AdvancedMode>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Fragment>
                      );
                    })}
                </>
              );
            }}
          />
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
