import { AutoBadge, Chain } from '@/Components/Badge/Badge';
import { activityRepository } from '@/modules/activity/activity.repository';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { linkClass, panelClass } from '@/pages/home/style.css';
import { formatList } from '@/utils/helpers';
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
import {
  IReceiver,
  getAvailableChains,
  getTransfers,
  needToSelectKeys,
} from '../utils';

import { AccountSearchBox } from '../Components/AccountSearchBox';
import { CreationTime } from '../Components/CreationTime';
import { Label } from '../Components/Label';
import { TTLSelect } from '../Components/TTLSelect';

export interface ITransfer {
  fungible: string;
  accountId: string;
  senderAccount: IRetrievedAccount;
  chain: ChainId | '';
  receivers: Array<IReceiver | undefined>;
  gasPayer: IRetrievedAccount;
  gasPrice: string;
  gasLimit: string;
  type: 'safeTransfer' | 'normalTransfer';
  ttl: number;
  totalAmount: number;
  creationTime: number;
  xchainMode: 'x-chain' | 'redistribution';
}

export type Redistribution = {
  source: ChainId;
  target: ChainId;
  amount: string;
};

interface TransferFormProps {
  accountId?: string | null;
  activityId?: string | null;
  onSubmit: (formData: ITransfer, redistribution: Redistribution[]) => void;
}

export interface TrG {
  groupId: string;
  txs: ITransaction[];
}

const validateAccount =
  (isSender = true, selectKeys = true) =>
  (account?: IRetrievedAccount) => {
    if (!account) return 'Please select an account';
    if (selectKeys && needToSelectKeys(account.guard)) {
      if (!account.keysToSignWith || !account.keysToSignWith.length) {
        return 'Please select the keys to sign with';
      }
      if (
        account.guard.pred === 'keys-2' &&
        account.keysToSignWith.length < 2
      ) {
        return 'Please select 2 keys to sign with';
      }
    }
    if (isSender && new PactNumber(account.overallBalance).lte(0)) {
      return 'The account has no balance';
    }
    return true;
  };

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
  const [, , AdvancedMode] = useShow(true);
  const urlAccount = allAccounts.find((account) => account.uuid === accountId);
  const {
    control,
    watch,
    setValue,
    reset,
    getValues,
    handleSubmit,
    formState,
    resetField,
  } = useForm<ITransfer>({
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
          discoveredAccount: undefined,
        },
      ],
      gasPayer: undefined,
      gasPrice: '0.00000001',
      gasLimit: '2500',
      type: 'normalTransfer',
      ttl: 2 * 60 * 60,
      totalAmount: 0,
      xchainMode: 'x-chain',
    },
  });

  const crossChainMode = watch('xchainMode');
  const [hasXChain, setHasXChain] = useState(false);

  const crossChainText =
    crossChainMode === 'x-chain'
      ? 'This will trigger cross-chain transfer'
      : 'This will trigger redistribution first';

  console.log('formState', formState);
  const [redistribution, setRedistribution] = useState(
    [] as {
      source: ChainId;
      target: ChainId;
      amount: string;
    }[],
  );
  const [xchainSameAccount, setXChainSameAccount] = useState(
    [] as {
      source: ChainId;
      target: ChainId;
      amount: string;
    }[],
  );
  const [error, setError] = useState<{
    target: 'from' | `receivers.${number}` | 'gas' | 'meta' | 'general';
    message: string;
  }>();
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
          const dataToReset: ITransfer = {
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
            xchainMode: 'x-chain',
          };
          reset(dataToReset);
          evaluateTransactions();
        }
      }
    };
    run();
  }, [activityId, reset, allAccounts, accountId]);

  const senderAccount = watch('senderAccount');
  const receivers = watch('receivers');

  const chains = useMemo(() => {
    if (!senderAccount) return [];
    const usedChains = receivers
      .filter(
        (rec) => rec && rec.address === senderAccount.address && rec.chain,
      )
      .flatMap((r) => r?.chain);
    return senderAccount.chains.filter(
      (chain) => !usedChains.includes(chain.chainId),
    );
  }, [senderAccount?.chains, receivers]);

  const overallBalance = chains
    .reduce((acc, { balance }) => acc.plus(balance), new PactNumber(0))
    .toDecimal();

  // console.log(watchReceivers);
  // const watchReceivers = watch('receivers');

  // const totalAmount = watchReceivers.reduce((acc, receiver) => {
  //   return acc + +receiver.amount;
  // }, 0);

  const totalAmount = watch('totalAmount');

  const evaluateTransactions = useCallback(() => {
    const receivers = getValues('receivers').filter((r) => r) as IReceiver[];
    const gasPrice = getValues('gasPrice');
    const gasLimit = getValues('gasLimit');
    const gasPayer = getValues('gasPayer') || getValues('senderAccount');
    const selectedChain = getValues('chain');
    const crossChainMode = getValues('xchainMode');
    const totalAmount = receivers.reduce(
      (acc, receiver) => acc + +receiver.amount,
      0,
    );
    setValue('totalAmount', totalAmount);
    setRedistribution([]);
    setError(undefined);
    const usedChains = receivers
      .filter((rec) => rec.address === senderAccount.address && rec.chain)
      .flatMap(({ chain }) => chain);
    const availableChains = senderAccount.chains.filter(
      (chain) => !usedChains.includes(chain.chainId),
    );

    const allChainsSet = receivers.every((receiver, index) => {
      if (receiver.address === senderAccount.address && !receiver.chain) {
        setError({
          target: `receivers.${index}`,
          message:
            'Please select the target chain. Auto mode is not available when the receiver is the sender',
        });
        return false;
      }
      return true;
    });

    if (!allChainsSet) return;

    const receiversWithIndex = receivers.map((receiver, index) => ({
      receiver,
      index,
    }));

    const otherReceiversWithIndex = receiversWithIndex.filter(
      ({ receiver: rec }) => rec.address !== senderAccount.address,
    );

    try {
      const sameAddressReceivers = receiversWithIndex
        .filter(({ receiver: rec }) => rec.address === senderAccount.address)
        .map(({ receiver, index }) => ({
          index,
          amount: receiver.amount,
          chainId: receiver.chain as ChainId,
        }));
      const otherReceivers = otherReceiversWithIndex.map(
        ({ receiver, index }) => ({
          index,
          amount: receiver.amount,
          chainId: crossChainMode === 'x-chain' ? '' : receiver.chain,
          availableChains: getAvailableChains(receiver.discoveredAccount),
        }),
      );
      const [transfers, redistributionRequest, xchain] = getTransfers(
        availableChains.filter(
          (chain) => !selectedChain || chain.chainId === selectedChain,
        ),
        !gasPayer || gasPayer.address === senderAccount?.address
          ? new PactNumber(gasPrice).times(gasLimit).toDecimal()
          : '0',
        otherReceivers,
        sameAddressReceivers,
      );

      let hasXchain = redistributionRequest.length > 0;

      const updatedReceivers = receiversWithIndex.map(({ receiver, index }) => {
        if (receiver.address === senderAccount.address) {
          hasXchain = true;
          return {
            ...receiver,
            xchain: true,
            address:
              receiver.address || receiver.discoveredAccount?.address || '',
          };
        }
        const idx = otherReceivers.findIndex((r) => r.index === index);
        const xchain =
          crossChainMode === 'x-chain' &&
          Boolean(receiver.chain) &&
          (transfers[idx].chunks.length > 1 ||
            (transfers[idx].chunks.length === 1 &&
              transfers[idx].chunks[0].chainId !== receiver.chain));

        if (xchain) {
          hasXchain = true;
        }
        return {
          ...receiver,
          address:
            receiver.address || receiver.discoveredAccount?.address || '',
          xchain,
          chunks: transfers[idx].chunks,
        };
      });

      setValue('receivers', updatedReceivers);
      setRedistribution(redistributionRequest);
      setXChainSameAccount(xchain);
      setHasXChain(hasXchain);
      setError(undefined);
    } catch (e) {
      setError({
        target: 'general',
        message:
          'message' in (e as Error) ? (e as Error).message : JSON.stringify(e),
      });
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

  async function onSubmitForm(data: ITransfer) {
    console.log('data', data);
    if (
      !profile ||
      !formState.isValid ||
      !!error ||
      !senderAccount ||
      new PactNumber(totalAmount).gte(overallBalance) ||
      new PactNumber(totalAmount).lte(0)
    ) {
      return;
    }

    onSubmit(
      {
        ...data,
        gasPayer: data.gasPayer || data.senderAccount,
        creationTime: data.creationTime ?? Math.floor(Date.now() / 1000),
      },
      [...xchainSameAccount, ...redistribution],
    );
  }

  const senderChain = watch('chain');

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
              render={({ field, fieldState: { error } }) => (
                <Select
                  // label="Token"
                  aria-label="Asset"
                  placeholder="Asset"
                  startVisual={<Label>Asset:</Label>}
                  size="sm"
                  selectedKey={field.value}
                  onSelectionChange={withEvaluate(field.onChange)}
                  errorMessage={'Please select an asset'}
                  isInvalid={!!error}
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
              rules={{
                validate: validateAccount(),
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <Stack flexDirection={'column'}>
                    <AccountSearchBox
                      isSenderAccount
                      accounts={filteredAccounts}
                      watchedAccounts={filteredWatchedAccounts}
                      contacts={contacts}
                      network={activeNetwork!}
                      contract={watchFungibleType}
                      selectedAccount={field.value}
                      onSelect={withEvaluate((account) => {
                        console.log('senderAccount', account);
                        field.onChange(account);
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
        </Stack>

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
                    const chainList = getAvailableChains(rec.discoveredAccount);
                    const availableChains = ['', ...chainList].filter((ch) => {
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
                    });
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
                          className={panelClass}
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
                                      resetField(`receivers.${index}`);
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
                                      discoveredAccount: rec.discoveredAccount,
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
                                render={({ field, fieldState: { error } }) => {
                                  return (
                                    <Stack flexDirection={'column'}>
                                      <AccountSearchBox
                                        accounts={filteredAccounts}
                                        hideKeySelector={
                                          getValues('type') !== 'safeTransfer'
                                        }
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
                                render={({ field, fieldState: { error } }) => (
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
                                    errorMessage={'Please enter a valid amount'}
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
                                          error.target === `receivers.${index}`
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
                                    discoveredAccount: undefined,
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
                name={`gasPayer`}
                control={control}
                rules={{
                  validate: (value) =>
                    validateAccount()(
                      value === undefined ? getValues('senderAccount') : value,
                    ),
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Stack flexDirection={'column'}>
                      <AccountSearchBox
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
                        onSelect={withEvaluate((account) => {
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
          style={{ display: hasXChain ? 'flex' : 'none' }}
        >
          <AdvancedMode>
            <Stack marginBlockStart={'md'} marginBlockEnd={'sm'}>
              <Heading variant="h5">Transfer options</Heading>
            </Stack>

            <Controller
              control={control}
              name="xchainMode"
              render={({ field }) => (
                <RadioGroup
                  aria-label="Sign Options"
                  direction={'column'}
                  defaultValue={'x-chain'}
                  value={field.value}
                  onChange={withEvaluate((value) => {
                    console.log('value', value);
                    field.onChange(value);
                    forceRender((prev) => prev + 1);
                  })}
                >
                  <Radio value="x-chain">
                    {
                      (
                        <Stack alignItems={'center'} gap={'sm'}>
                          Cross chain transfer
                          <Text size="small">
                            Safe transfer doesn't support cross-chain transfer
                          </Text>
                        </Stack>
                      ) as any
                    }
                  </Radio>

                  <Radio value="redistribution">
                    {
                      (
                        <Stack alignItems={'center'} gap={'sm'}>
                          Redistribution
                          <Text size="small">
                            Redistribute balance first then do final transfer
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
                    forceRender((prev) => prev + 1);
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

        {(error || !formState.isValid) && formState.isSubmitted && (
          <Notification role="alert" intent="negative">
            Invalid Data, Please check the input(s) (
            {[...Object.keys(formState.errors), error?.target.split('.')[0]]
              .filter(Boolean)
              .join(', ')}
            )
          </Notification>
        )}
        <Stack
          alignItems={'flex-start'}
          gap="lg"
          marginBlockStart={'lg'}
          flexDirection={'column'}
        >
          {!!error && error.target === 'general' && (
            <Notification role="alert" intent="negative">
              {error.message}
            </Notification>
          )}
          <Button type="submit">Create Transactions</Button>
        </Stack>
      </Stack>
    </form>
  );
}
