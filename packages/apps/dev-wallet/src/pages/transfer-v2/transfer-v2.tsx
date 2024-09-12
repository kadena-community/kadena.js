import { AutoBadge, Chain } from '@/Components/Badge/Badge';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { useShow } from '@/utils/useShow';
import { ChainId, ISigner } from '@kadena/client';
import { MonoDelete } from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Combobox,
  ComboboxItem,
  Divider,
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
import { useCallback, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DiscoverdAccounts } from '../transfer/components/DiscoverdAccounts';
import { linkClass } from '../transfer/style.css';
import { IReceiverAccount } from '../transfer/utils';
import { AccountItem } from './Components/AccountItem';
import { Keyset } from './Components/keyset';
import {
  CHAINS,
  IReceiver,
  createTransactions,
  discoverReceiver,
  getTransfers,
} from './utils';

interface Transfer {
  fungibleType: string;
  account: string;
  chain: ChainId | '';
  receivers: IReceiver[];

  gasPayer: string;
  gasPrice: string;
  gasLimit: string;
  type: 'safeTransfer' | 'normalTransfer';
}

export function TransferV2() {
  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timeout>();
  const {
    accounts: allAccounts,
    fungibles,
    getPublicKeyData,
    activeNetwork,
    profile,
  } = useWallet();
  const [isAdvanced, setIsAdvanced, AdvancedMode] = useShow(true);
  const [accountToResolve, setAccountToResolve] = useState<{
    account: Transfer['receivers'][number];
    index: number;
  }>();
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState,
  } = useForm<Transfer>({
    defaultValues: {
      fungibleType: fungibles[0].contract,
      account: '',
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
      type: 'safeTransfer',
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
  const watchFungibleType = watch('fungibleType');

  const filteredAccounts = useMemo(
    () =>
      allAccounts.filter((account) => account.contract === watchFungibleType),
    [allAccounts, watchFungibleType],
  );

  const senderAddress = watch('account');
  const senderAccount = useMemo(
    () => filteredAccounts.find((account) => account.uuid === senderAddress),
    [filteredAccounts, senderAddress],
  );

  const chains = useMemo(
    () => senderAccount?.chains ?? [],
    [senderAccount?.chains],
  );

  const watchReceivers = watch('receivers');

  console.log(watchReceivers);

  const totalAmount = watchReceivers.reduce((acc, receiver) => {
    return acc + +receiver.amount;
  }, 0);

  const evaluateTransactions = useCallback(() => {
    const receivers = getValues('receivers');
    const gasPrice = getValues('gasPrice');
    const gasLimit = getValues('gasLimit');
    const gasPayer = getValues('gasPayer');
    const selectedChain = getValues('chain');
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

  const withEvaluate = <T, R>(cb: (...args: T[]) => R) => {
    return (...args: T[]) => {
      const result = cb(...args);
      clearTimeout(timer.current);
      timer.current = setTimeout(evaluateTransactions, 100);
      return result;
    };
  };

  async function createTransaction(data: Transfer) {
    console.log('data', data);
    if (!senderAccount || !profile) return;
    const [groupId, txs] = await createTransactions({
      account: senderAccount,
      contract: data.fungibleType,
      gasLimit: +data.gasLimit,
      gasPrice: +data.gasPrice,
      receivers: data.receivers,
      isSafeTransfer: data.type === 'safeTransfer',
      networkId: activeNetwork?.networkId ?? 'mainnet01',
      profileId: profile.uuid,
      mapKeys,
    });
    navigate(`/transaction/${groupId}`);
    console.log('txs', txs);
    console.log('groupId', groupId);
  }

  const senderChain = watch('chain');

  const mapKeys = useCallback(
    (key: ISigner) => {
      if (typeof key === 'object') return key;
      const info = getPublicKeyData(key);
      if (info && info.scheme) {
        return {
          pubKey: key,
          scheme: info.scheme,
        };
      }
      if (key.startsWith('WEBAUTHN')) {
        return {
          pubKey: key,
          scheme: 'WebAuthn' as const,
        };
      }
      return key;
    },
    [getPublicKeyData],
  );

  return (
    <form onSubmit={handleSubmit(createTransaction)}>
      {accountToResolve && (
        <DiscoverdAccounts
          accounts={accountToResolve.account.discoveredAccounts}
          onSelect={(account: IReceiverAccount) => {
            setValue(`receivers.${accountToResolve.index}.discoveredAccounts`, [
              account,
            ]);
            setAccountToResolve(undefined);
          }}
        />
      )}
      <Stack flexDirection="column" gap="md">
        <Stack justifyContent={'space-between'} gap="sm">
          <Heading variant="h2">Transfer</Heading>
          <button
            className={linkClass}
            onClick={() => setIsAdvanced((val) => !val)}
          >
            {isAdvanced ? 'hide advance options' : 'show advance options'}
          </button>
        </Stack>
        <Divider />
        <Heading variant="h5">From</Heading>
        <Stack
          justifyContent={'flex-start'}
          gap={'sm'}
          alignItems={'flex-start'}
        >
          <Controller
            name="fungibleType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                placeholder="Fungible Type"
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
            name="account"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Stack flex={1} flexDirection={'column'}>
                <Select
                  placeholder="From Account"
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
                {senderAccount?.keyset && (
                  <Keyset guard={senderAccount.keyset.guard} />
                )}
              </Stack>
            )}
          />
          <Stack flex={1}>
            <Controller
              name="chain"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Chain"
                  size="sm"
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
                                chainId={chains
                                  .map((chain) => chain.chainId)
                                  .join(' , ')}
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

          {/* <Stack flex={1}>
          {senderAccount && (
            <Text>Available Balance: {senderAccount?.overallBalance}</Text>
          )}
        </Stack> */}
        </Stack>
        <Divider />
        <Heading variant="h5">To</Heading>
        {watchReceivers.map((rec, index) => {
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
            <Stack flexDirection={'column'} gap={'sm'}>
              <Stack
                key={index}
                flexDirection="row"
                gap="sm"
                alignItems="flex-start"
                justifyContent={'flex-start'}
              >
                <Controller
                  name={`receivers.${index}.address`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Stack flex={1} flexDirection={'column'}>
                      <Combobox
                        inputValue={field.value ?? ''}
                        onInputChange={withEvaluate((value) => {
                          console.log('value', value);
                          field.onChange(value || '');
                          setValue(`receivers.${index}.discoveredAccounts`, []);
                          setValue(
                            `receivers.${index}.discoveryStatus`,
                            'not-started',
                          );
                        })}
                        onBlur={async () => {
                          if (!field.value) return;
                          if (
                            getValues(`receivers.${index}.discoveryStatus`) ===
                            'done'
                          ) {
                            return;
                          }
                          setValue(
                            `receivers.${index}.discoveryStatus`,
                            'in-progress',
                          );
                          const discoveredAccounts = await discoverReceiver(
                            rec.address,
                            activeNetwork?.networkId ?? 'mainnet01',
                            getValues('fungibleType'),
                            mapKeys,
                          );

                          setValue(
                            `receivers.${index}.discoveredAccounts`,
                            discoveredAccounts,
                          );
                          setValue(
                            `receivers.${index}.discoveryStatus`,
                            'done',
                          );
                        }}
                        placeholder={`Receiver ${index + 1}`}
                        size="sm"
                        onSelectionChange={(key) => {
                          field.onChange(key);
                          if (key) {
                            const account = filteredAccounts.find(
                              (account) => account.address === key,
                            );
                            if (account?.keyset) {
                              setValue(
                                `receivers.${index}.discoveredAccounts`,
                                [
                                  {
                                    ...account,
                                    keyset: account.keyset,
                                  },
                                ],
                              );
                            } else {
                              setValue(
                                `receivers.${index}.discoveredAccounts`,
                                [],
                              );
                              setValue(
                                `receivers.${index}.discoveryStatus`,
                                'not-started',
                              );
                            }
                          }
                        }}
                        allowsCustomValue
                      >
                        {filteredAccounts
                          .filter(
                            (account) =>
                              account.address !== senderAccount?.address &&
                              !watchReceivers.some(
                                (receiver, i) =>
                                  i !== index &&
                                  receiver.address === account.address,
                              ),
                          )
                          .map((account) => (
                            <ComboboxItem
                              key={account.address}
                              textValue={account.address}
                            >
                              <AccountItem account={account} />
                            </ComboboxItem>
                          ))}
                      </Combobox>

                      {rec.discoveryStatus === 'in-progress' && (
                        <Stack paddingInline={'md'} marginBlock={'xs'}>
                          <Text variant="code" size="smallest">
                            Discovering...
                          </Text>
                        </Stack>
                      )}
                      {rec.discoveryStatus === 'done' &&
                        rec.discoveredAccounts.length === 1 && (
                          <Keyset
                            guard={rec.discoveredAccounts[0].keyset.guard}
                          />
                        )}
                    </Stack>
                  )}
                />

                <TextField
                  {...register(`receivers.${index}.amount`, {
                    required: true,
                    onChange: evaluateTransactions,
                  })}
                  placeholder="Amount"
                  size="sm"
                  type="number"
                  step="1"
                />
                <Stack flex={1} gap="sm">
                  <AdvancedMode>
                    <Controller
                      name={`receivers.${index}.chain`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          size="sm"
                          placeholder="Chains"
                          selectedKey={field.value}
                          onSelectionChange={withEvaluate(field.onChange)}
                        >
                          {(rec.amount ? availableChains : []).map((chain) => (
                            <SelectItem key={chain}>
                              {chain ? (
                                <Chain chainId={chain} />
                              ) : (
                                <Stack
                                  gap="sm"
                                  title={rec.chunks
                                    .map(
                                      (c) => `chain ${c.chainId}: ${c.amount}`,
                                    )
                                    .join('\n')}
                                >
                                  <AutoBadge />
                                  {rec.chunks.length > 0 && (
                                    <Chain
                                      chainId={rec.chunks
                                        .map((c) => c.chainId)
                                        .join(' , ')}
                                    />
                                  )}
                                </Stack>
                              )}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </AdvancedMode>
                  {watchReceivers.length > 1 && (
                    <Button
                      isCompact
                      variant="outlined"
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
                </Stack>
              </Stack>
              {!availableChains.length && (
                <Notification role="alert" intent="negative">
                  the receiver is the same as sender, therefor you can not use
                  automatic chian selection, please set the both chains manually
                </Notification>
              )}
              {rec.discoveredAccounts.length > 1 && (
                <Notification role="alert" intent="warning">
                  <Stack gap="sm">
                    <span>
                      more than one account found with this address, please
                      resolve the ambiguity{' '}
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
                        This account is not found on the blockchain or address
                        book. Please check the address and try again. or add
                        missing guard by clicking on{' '}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          Add account guard
                        </button>
                      </span>
                    </Stack>
                  </Notification>
                )}
            </Stack>
          );
        })}
        {error && (
          <Notification role="alert" intent="negative">
            Total amount ({totalAmount}) is more than the available balance,
            please check your input, also you should consider the gas fee
          </Notification>
        )}
        {redistribution.length > 0 && (
          <Notification role="alert" intent="info">
            <Stack flexDirection={'column'} gap={'sm'}>
              Before proceeding with the transfer, the following redistribution
              will happen:
              <Box>{senderAccount?.address}</Box>
              <Stack flexDirection={'column'} gap={'sm'}>
                {redistribution.map((r) => (
                  <Stack
                    key={r.source + r.target}
                    gap={'sm'}
                    alignItems={'center'}
                  >
                    {'From '}
                    <Chain chainId={r.source} />
                    {'to '}
                    <Chain chainId={r.target} />
                    {r.amount}{' '}
                    {fungibles.find((ct) => ct.contract === watchFungibleType)
                      ?.symbol ?? watchFungibleType}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Notification>
        )}
        <Stack justifyContent={'flex-end'}>
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
            + More Receiver
          </button>
        </Stack>
        <AdvancedMode>
          <Divider />
          <Heading variant="h5">Gas Information</Heading>
          <Stack flexDirection="row" gap="sm">
            <Controller
              name="gasPayer"
              control={control}
              render={({ field }) => (
                <Select
                  size="sm"
                  placeholder="Gas Payer"
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
            <TextField
              {...register('gasPrice', { onChange: evaluateTransactions })}
              placeholder="Gas Price"
              size="sm"
              defaultValue="0.00000001"
              type="number"
              step="0.00000001"
            />
            <TextField
              {...register('gasLimit', { onChange: evaluateTransactions })}
              placeholder="Gas Limit"
              size="sm"
              defaultValue="2500"
              type="number"
            />
          </Stack>
        </AdvancedMode>
        <Divider />
        <Heading variant="h5">Sign options</Heading>
        <RadioGroup direction={'column'} defaultValue={'safeTransfer'}>
          <Radio {...register('type')} value="normalTransfer">
            Sign by sender
          </Radio>
          <Radio {...register('type')} value="safeTransfer">
            Sign by both sender and receiver (safe transfer)
          </Radio>
        </RadioGroup>
        <Stack justifyContent={'flex-start'} gap="sm">
          <Button type="submit">Create Transactions</Button>
        </Stack>
      </Stack>
    </form>
  );
}
