import { DiscoverdAccounts } from '@/Components/AccountInput/DiscoverdAccounts';
import { AutoBadge, Chain } from '@/Components/Badge/Badge';
import { KeySetDialog } from '@/Components/KeysetDialog/KeySetDialog';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { IKeysetGuard } from '@/modules/account/account.repository';
import { activityRepository } from '@/modules/activity/activity.repository';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { linkClass, panelClass } from '@/pages/home/style.css';
import { formatList, shorten } from '@/utils/helpers';
import { useShow } from '@/utils/useShow';
import { ChainId } from '@kadena/client';
import { MonoCopyAll, MonoDelete } from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IRetrievedAccount } from '../../../modules/account/IRetrievedAccount';
import { CHAINS, IReceiver, getTransfers } from '../utils';

import { AccountSearchBox } from '../Components/AccountSearchBox';
import { CreationTime } from '../Components/CreationTime';
import { Label } from '../Components/Label';
import { TTLSelect } from '../Components/TTLSelect';

export interface Transfer {
  fungible: string;
  accountId: string;
  senderAccount: IRetrievedAccount;
  chain: ChainId | '';
  receivers: IReceiver[];
  gasPayer: string;
  gasPrice: string;
  gasLimit: string;
  type: 'safeTransfer' | 'normalTransfer';
  ttl: number;
  totalAmount: number;
  creationTime?: number;
}

export type Redistribution = {
  source: ChainId;
  target: ChainId;
  amount: string;
};

interface TransferFormProps {
  accountId?: string | null;
  activityId?: string | null;
  onSubmit: (formData: Transfer, redistribution: Redistribution[]) => void;
}

export interface TrG {
  groupId: string;
  txs: ITransaction[];
}

export function TransferForm({
  accountId,
  onSubmit,
  activityId,
}: TransferFormProps) {
  const timer = useRef<NodeJS.Timeout>();
  // somehow react-hook-form does not trigger re-render when the value of the form is changed
  // also for performance reason I don't want to re-render the whole form on every change
  // so I use this state to force re-render on specific changes
  // TODO: find a better way to handle this
  const [, forceRender] = useState(0);
  const {
    accounts: allAccounts,
    fungibles,
    activeNetwork,
    profile,
    watchAccounts,
    contacts,
  } = useWallet();
  const prompt = usePrompt();
  const [, , AdvancedMode] = useShow(true);
  const [accountToResolve, setAccountToResolve] = useState<{
    account: Transfer['receivers'][number];
    index: number;
  }>();
  const urlAccount = allAccounts.find((account) => account.uuid === accountId);
  const {
    control,
    watch,
    setValue,
    reset,
    getValues,
    handleSubmit,
    formState,
  } = useForm<Transfer>({
    defaultValues: {
      fungible: urlAccount?.contract ?? fungibles[0].contract,
      accountId: accountId ?? '',
      senderAccount: accountId ? urlAccount : undefined,
      chain: '',
      receivers: [
        {
          amount: '',
          address: '',
          chain: '',
          chunks: [],
          discoveredAccounts: [],
          discoveryStatus: 'not-started',
        },
      ],
      gasPayer: '',
      gasPrice: '1e-8',
      gasLimit: '2500',
      type: 'normalTransfer',
      ttl: 2 * 60 * 60,
      totalAmount: 0,
    },
  });

  console.log('formState.errors', formState.errors);
  const [redistribution, setRedistribution] = useState(
    [] as {
      source: ChainId;
      target: ChainId;
      amount: string;
    }[],
  );
  const [error, setError] = useState<string | null>(null);
  const watchFungibleType = watch('fungible');

  const filteredAccounts = useMemo(
    () =>
      allAccounts.filter((account) => account.contract === watchFungibleType),
    [allAccounts, watchFungibleType],
  );

  const filteredWatchedAccounts = useMemo(
    () =>
      watchAccounts.filter((account) => account.contract === watchFungibleType),
    [watchAccounts, watchFungibleType],
  );

  useEffect(() => {
    const run = async () => {
      if (activityId) {
        const activity = await activityRepository.getActivity(activityId);
        if (accountId) {
          throw new Error('activityId and accountId can not be used together');
        }
        const account = allAccounts.find(
          (a) => a.uuid === activity.data.transferData.accountId,
        );
        if (activity && account) {
          const receivers = activity.data.transferData.receivers.map(
            (receiver) => ({
              ...receiver,
              chunks: [],
            }),
          );
          const transferData = activity.data.transferData;
          reset({
            fungible: account.contract,
            accountId: transferData.accountId,
            senderAccount: transferData.senderAccount,
            chain: transferData.chain,
            receivers,
            gasPayer: transferData.gasPayer,
            gasPrice: transferData.gasPrice,
            gasLimit: transferData.gasLimit,
            type: transferData.type,
            ttl: transferData.ttl,
            creationTime: transferData.creationTime,
            totalAmount: 0,
          });
          evaluateTransactions();
        }
      }
    };
    run();
  }, [activityId, reset, allAccounts, accountId]);

  const senderAccount = watch('senderAccount');

  const chains = useMemo(
    () => senderAccount?.chains ?? [],
    [senderAccount?.chains],
  );

  // console.log(watchReceivers);
  // const watchReceivers = watch('receivers');

  // const totalAmount = watchReceivers.reduce((acc, receiver) => {
  //   return acc + +receiver.amount;
  // }, 0);

  const totalAmount = watch('totalAmount');

  const evaluateTransactions = useCallback(() => {
    const receivers = getValues('receivers');
    const gasPrice = getValues('gasPrice');
    const gasLimit = getValues('gasLimit');
    const gasPayer = getValues('gasPayer');
    const selectedChain = getValues('chain');
    const totalAmount = receivers.reduce(
      (acc, receiver) => acc + +receiver.amount,
      0,
    );
    setValue('totalAmount', totalAmount);
    setRedistribution([]);
    setError(null);
    try {
      const [transfers, redistributionRequest] = getTransfers(
        chains.filter(
          (chain) => !selectedChain || chain.chainId === selectedChain,
        ),
        !gasPayer || gasPayer === senderAccount?.address
          ? new PactNumber(gasPrice).times(gasLimit).toDecimal()
          : '0',
        receivers.map((receiver) => ({
          amount: receiver.amount,
          chainId: receiver.chain,
        })),
      );
      setValue(
        'receivers',
        receivers.map((receiver, index) => ({
          ...receiver,
          chunks: transfers[index].chunks,
        })),
      );
      setRedistribution(redistributionRequest);
    } catch (e) {
      setError(
        'message' in (e as Error) ? (e as Error).message : JSON.stringify(e),
      );
    }
  }, [chains, getValues, senderAccount, setValue]);

  const withEvaluate = useCallback(
    <T, R>(cb: (...args: T[]) => R) => {
      return (...args: T[]) => {
        const result = cb(...args);
        clearTimeout(timer.current);
        timer.current = setTimeout(evaluateTransactions, 100);
        return result;
      };
    },
    [evaluateTransactions],
  );

  async function onSubmitForm(data: Transfer) {
    console.log('data', data);
    if (!senderAccount || !profile) return;
    onSubmit(data, redistribution);
  }

  const senderChain = watch('chain');

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {accountToResolve && (
        <DiscoverdAccounts
          accounts={accountToResolve.account.discoveredAccounts}
          onSelect={(account: IRetrievedAccount) => {
            setValue(`receivers.${accountToResolve.index}.discoveredAccounts`, [
              account,
            ]);
            setAccountToResolve(undefined);
          }}
          onClosed={() => setAccountToResolve(undefined)}
        />
      )}

      <Stack flexDirection="column" gap="md" flex={1} width="100%">
        <Stack gap="sm" flexDirection={'column'}>
          <Heading variant="h2">Transfer</Heading>
        </Stack>
        <Stack
          gap="sm"
          flexDirection={'column'}
          className={panelClass}
          paddingBlockEnd={'xxl'}
        >
          <Stack>
            <Heading variant="h5">From</Heading>
          </Stack>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Controller
              name="fungible"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  // label="Token"
                  aria-label="Asset"
                  placeholder="Asset"
                  startVisual={<Label>Asset:</Label>}
                  size="sm"
                  selectedKey={field.value}
                  onSelectionChange={withEvaluate(field.onChange)}
                >
                  {fungibles.map((f) => (
                    <SelectItem key={f.contract}>{f.symbol}</SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name={`senderAccount`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Stack flexDirection={'column'}>
                    <AccountSearchBox
                      accounts={filteredAccounts.filter(
                        (account) => account.address,
                      )}
                      watchedAccounts={filteredWatchedAccounts}
                      contacts={contacts}
                      network={activeNetwork!}
                      contract={watchFungibleType}
                      selectedAccount={field.value}
                      onSelect={withEvaluate((account) => {
                        field.onChange(account);
                        forceRender((prev) => prev + 1);
                      })}
                    />
                  </Stack>
                );
              }}
            />
            {/* <Controller
              name="accountId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Stack flex={1} flexDirection={'column'}>
                  <Select
                    aria-label="Address"
                    startVisual={<Label>Address:</Label>}
                    // label="Account"
                    placeholder="Select and address"
                    size="sm"
                    selectedKey={field.value}
                    onSelectionChange={withEvaluate(field.onChange)}
                  >
                    {filteredAccounts
                      .filter(({ overallBalance }) => +overallBalance > 0)
                      .map((account) => (
                        <SelectItem key={account.uuid}>
                          <AccountItem account={account} />
                        </SelectItem>
                      ))}
                  </Select>
                  {senderAccount?.guard && (
                    <Guard guard={senderAccount.guard} />
                  )}
                </Stack>
              )}
            /> */}
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
                                (balance: {senderAccount?.overallBalance})
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

            {/* <Stack flex={1}>
          {senderAccount && (
            <Text>Available Balance: {senderAccount?.overallBalance}</Text>
          )}
        </Stack> */}
          </Stack>
        </Stack>

        <Controller
          control={control}
          name="receivers"
          render={({ field: { value: watchReceivers } }) => {
            return (
              <>
                {watchReceivers.map((__, index) => {
                  const rec = getValues(`receivers.${index}`);
                  const availableChains = ['', ...CHAINS].filter((ch) => {
                    // if the receiver is not the sender, then transfer is allowed from any chain
                    if (rec.address !== senderAccount?.address) {
                      return true;
                    }
                    // if the receiver is the sender, then the chains should be selected manually
                    if (!ch || !senderChain) return false;

                    // source and target chain should not be the same
                    return ch !== senderChain;
                  });
                  return (
                    <Fragment key={index}>
                      <Stack
                        gap="sm"
                        flexDirection={'column'}
                        className={panelClass}
                        paddingBlockEnd={'xxl'}
                      >
                        <Stack
                          marginBlockStart={'md'}
                          justifyContent={'space-between'}
                        >
                          <Heading variant="h5">
                            Receiver{' '}
                            {watchReceivers.length > 1 ? `(${index + 1})` : ''}
                          </Heading>
                          <Stack>
                            <>
                              {watchReceivers.length > 1 && (
                                <Button
                                  isCompact
                                  variant="transparent"
                                  onClick={withEvaluate(() => {
                                    console.log('deleting', index);
                                    const receivers = getValues('receivers');
                                    receivers.splice(index, 1);
                                    setValue('receivers', [...receivers]);
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
                                    discoveredAccounts:
                                      rec.discoveryStatus === 'done'
                                        ? rec.discoveredAccounts
                                        : [],
                                    discoveryStatus:
                                      rec.discoveryStatus === 'done'
                                        ? 'done'
                                        : 'not-started',
                                  } as Transfer['receivers'][number];
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
                              name={`receivers.${index}.address`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => {
                                return (
                                  <Stack flexDirection={'column'}>
                                    <AccountSearchBox
                                      accounts={filteredAccounts.filter(
                                        (account) =>
                                          account.address !==
                                          senderAccount?.address,
                                      )}
                                      watchedAccounts={filteredWatchedAccounts}
                                      contacts={contacts}
                                      network={activeNetwork!}
                                      contract={watchFungibleType}
                                      selectedAccount={
                                        getValues(
                                          `receivers.${index}.discoveredAccounts`,
                                        )[0]
                                      }
                                      onSelect={(account) => {
                                        if (account) {
                                          field.onChange(account.address);
                                          setValue(
                                            `receivers.${index}.discoveredAccounts`,
                                            [account],
                                          );
                                          setValue(
                                            `receivers.${index}.discoveryStatus`,
                                            'done',
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
                                            discoveredAccounts: [],
                                            discoveryStatus: 'not-started',
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
                              render={({ field }) => (
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
                                        rec.chain &&
                                        redistribution.find(
                                          (r) => r.target === rec.chain,
                                        )
                                          ? `This will trigger balance redistribution`
                                          : ''
                                      }
                                      size="sm"
                                      selectedKey={field.value}
                                      onSelectionChange={withEvaluate(
                                        field.onChange,
                                      )}
                                    >
                                      {(rec.amount ? availableChains : []).map(
                                        (chain) => (
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
                                        ),
                                      )}
                                    </Select>
                                  )}
                                />
                              </Stack>
                            </AdvancedMode>
                          </Stack>
                          {!availableChains.length && (
                            <Notification role="alert" intent="negative">
                              the receiver is the same as sender, therefor you
                              can not use automatic chain selection, please set
                              the both chains manually
                            </Notification>
                          )}
                          {rec.discoveredAccounts.length > 1 && (
                            <Notification role="alert" intent="warning">
                              <Stack gap="sm">
                                <span>
                                  more than one account found with this address,
                                  please resolve the ambiguity{' '}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setAccountToResolve({
                                        account: rec,
                                        index: index,
                                      });
                                    }}
                                  >
                                    Select correct
                                  </button>
                                </span>
                              </Stack>
                            </Notification>
                          )}
                          {rec.discoveryStatus === 'done' &&
                            rec.discoveredAccounts.length === 0 && (
                              <Notification role="alert" intent="warning">
                                <Stack gap="sm">
                                  <span>
                                    This account is not found on the blockchain
                                    or address book. Please check the address
                                    and try again. or add missing guard by
                                    clicking on{' '}
                                    <button
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        const guard = (await prompt(
                                          (resolve, reject) => (
                                            <KeySetDialog
                                              close={reject}
                                              onDone={resolve}
                                              isOpen
                                            />
                                          ),
                                        )) as IKeysetGuard;
                                        if (guard) {
                                          setValue(
                                            `receivers.${index}.discoveredAccounts`,
                                            [
                                              {
                                                address: getValues(
                                                  `receivers.${index}.address`,
                                                ),
                                                guard,
                                                chains: [],
                                                overallBalance: '0.0',
                                              },
                                            ],
                                          );
                                          forceRender((prev) => prev + 1);
                                        }
                                      }}
                                    >
                                      Add account guard
                                    </button>
                                  </span>
                                </Stack>
                              </Notification>
                            )}
                        </Stack>

                        {error && (
                          <Notification role="alert" intent="negative">
                            Total amount ({totalAmount}) is more than the
                            available balance, please check your input, also you
                            should consider the gas fee
                          </Notification>
                        )}
                      </Stack>
                      {index === watchReceivers.length - 1 && (
                        <Stack>
                          <button
                            className={linkClass}
                            onClick={() => {
                              const receivers = getValues('receivers');
                              setValue('receivers', [
                                ...receivers,
                                {
                                  amount: '',
                                  address: '',
                                  chain: '',
                                  chunks: [],
                                  discoveredAccounts: [],
                                  discoveryStatus: 'not-started',
                                },
                              ]);
                            }}
                          >
                            + Add Receiver
                          </button>
                        </Stack>
                      )}
                    </Fragment>
                  );
                })}
              </>
            );
          }}
        />

        <Stack
          gap="sm"
          flexDirection={'column'}
          className={panelClass}
          paddingBlockEnd={'xxl'}
        >
          <AdvancedMode>
            <Stack marginBlockStart={'md'}>
              <Heading variant="h5">Gas Information</Heading>
            </Stack>
            <Stack flexDirection="column" gap="sm">
              <Controller
                name="gasPayer"
                control={control}
                render={({ field }) => (
                  <Select
                    aria-label="Gas Payer"
                    startVisual={<Label>Gas Payer:</Label>}
                    placeholder="Select the gas payer"
                    size="sm"
                    selectedKey={field.value}
                    onSelectionChange={withEvaluate(field.onChange)}
                  >
                    {[
                      ...(senderAccount
                        ? [
                            <SelectItem key={''}>
                              <Stack flexDirection="row" gap="sm">
                                <AutoBadge />
                                {shorten(senderAccount?.address, 10)}{' '}
                              </Stack>
                            </SelectItem>,
                          ]
                        : []),
                      ...filteredAccounts.map((account) => (
                        <SelectItem key={account.address}>
                          {shorten(account.address, 10)}
                        </SelectItem>
                      )),
                    ]}
                  </Select>
                )}
              />
              <Controller
                name="gasPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    aria-label="Gas Price"
                    startVisual={<Label>Gas Price:</Label>}
                    placeholder="Enter gas price"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // evaluateTransactions();
                    }}
                    onBlur={evaluateTransactions}
                    size="sm"
                    defaultValue="0.00000001"
                    type="number"
                    step="0.00000001"
                  />
                )}
              />
              <Controller
                name="gasLimit"
                control={control}
                render={({ field }) => (
                  <TextField
                    aria-label="Enter gas limit"
                    placeholder="Enter gas limit"
                    startVisual={<Label>Gas Limit:</Label>}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={evaluateTransactions}
                    size="sm"
                    defaultValue="2500"
                    type="number"
                  />
                )}
              />
            </Stack>
            <Stack marginBlockStart={'lg'}>
              <Heading variant="h5">Meta Data</Heading>
            </Stack>
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
          </AdvancedMode>
        </Stack>
        <Stack
          gap="sm"
          flexDirection={'column'}
          className={panelClass}
          paddingBlockEnd={'xxl'}
          width="100%"
        >
          <AdvancedMode>
            <Stack marginBlockStart={'md'} marginBlockEnd={'sm'}>
              <Heading variant="h5">Sign options</Heading>
            </Stack>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-label="Sign Options"
                  direction={'column'}
                  defaultValue={'normalTransfer'}
                  value={field.value}
                  onChange={(value) => {
                    console.log('value', value);
                    field.onChange(value);
                  }}
                >
                  <Radio value="normalTransfer">
                    {
                      (
                        <Stack alignItems={'center'} gap={'sm'}>
                          Normal transfer
                          <Text size="small">Sign by sender</Text>
                        </Stack>
                      ) as any
                    }
                  </Radio>

                  <Radio value="safeTransfer">
                    {
                      (
                        <Stack alignItems={'center'} gap={'sm'}>
                          Safe transfer
                          <Text size="small">
                            Sign by both sender and receiver
                          </Text>
                        </Stack>
                      ) as any
                    }
                  </Radio>
                </RadioGroup>
              )}
            />
          </AdvancedMode>
        </Stack>
        <Stack justifyContent={'flex-start'} gap="sm" marginBlockStart={'lg'}>
          <Button type="submit">Create Transactions</Button>
        </Stack>
      </Stack>
    </form>
  );
}
