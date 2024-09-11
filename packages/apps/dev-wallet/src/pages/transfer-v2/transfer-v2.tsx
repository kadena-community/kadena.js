import { AutoBadge, Chain } from '@/Components/Badge/Badge';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { ChainId } from '@kadena/client';
import { MonoDelete } from '@kadena/kode-icons/system';
import {
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
  TextField,
  TextareaField,
} from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { linkClass } from '../transfer/style.css';
import { CHAINS, getTransfers } from './utils';

export function TransferV2() {
  const { accounts: allAccounts, fungibles } = useWallet();
  const { control, register, watch, setValue, getValues } = useForm({
    defaultValues: {
      fungibleType: fungibles[0].contract,
      account: '',
      chain: '',
      receivers: [
        {
          amount: '',
          receiver: '',
          chain: '' as ChainId | '',
          chunks: [] as {
            chainId: ChainId;
            amount: string;
          }[],
        },
      ],
      gasPayer: '',
      gasPrice: '1e-8',
      gasLimit: '2500',
      description: '',
    },
  });
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
  const senderAccount = filteredAccounts.find(
    (account) => account.uuid === senderAddress,
  );

  const chains = senderAccount?.chains ?? [];

  const watchReceivers = watch('receivers');

  console.log(watchReceivers);

  const totalAmount = watchReceivers.reduce((acc, receiver) => {
    return acc + +receiver.amount;
  }, 0);

  const evaluateTransactions = () => {
    console.log('evaluateTransactions');
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
  };

  return (
    <Stack flexDirection="column" gap="md">
      <Stack justifyContent={'space-between'} gap="sm">
        <Heading variant="h2">Transfer</Heading>
      </Stack>
      <Divider />
      <Heading variant="h5">From</Heading>
      <Stack justifyContent={'flex-start'} gap={'sm'} alignItems={'center'}>
        <Controller
          name="fungibleType"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              placeholder="Fungible Type"
              size="sm"
              selectedKey={field.value}
              onSelectionChange={field.onChange}
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
            <Select
              placeholder="From Account"
              size="sm"
              selectedKey={field.value}
              onSelectionChange={field.onChange}
            >
              {filteredAccounts.map((account) => (
                <SelectItem key={account.uuid}>
                  {shorten(account.address, 10)}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="chain"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              placeholder="Chain"
              size="sm"
              selectedKey={field.value}
              onSelectionChange={field.onChange}
            >
              {senderAccount
                ? [
                    <SelectItem key={''}>
                      <Stack flexDirection="row" alignItems="center" gap="sm">
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
                        <Stack flexDirection="row" alignItems="center" gap="sm">
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

        {/* <Stack flex={1}>
          {senderAccount && (
            <Text>Available Balance: {senderAccount?.overallBalance}</Text>
          )}
        </Stack> */}
      </Stack>
      <Divider />
      <Heading variant="h5">To</Heading>
      {watchReceivers.map((rec, index) => (
        <Stack key={index} flexDirection="row" gap="sm" alignItems="center">
          <Controller
            name={`receivers.${index}.receiver`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Combobox
                inputValue={field.value}
                onInputChange={(value) => field.onChange(value || '')}
                placeholder={`Receiver ${index + 1}`}
                size="sm"
                onSelectionChange={field.onChange}
                allowsCustomValue
              >
                {filteredAccounts
                  .filter(
                    (account) =>
                      !watchReceivers.some(
                        (receiver, i) =>
                          i !== index && receiver.receiver === account.address,
                      ),
                  )
                  .map((account) => (
                    <ComboboxItem
                      key={account.address}
                      textValue={account.address}
                    >
                      {shorten(account.address, 10)}
                    </ComboboxItem>
                  ))}
              </Combobox>
            )}
          />

          <TextField
            {...register(`receivers.${index}.amount`, { required: true })}
            placeholder="Amount"
            size="sm"
            type="number"
            step="1"
          />
          <Stack flex={1} gap="sm">
            <Controller
              name={`receivers.${index}.chain`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  size="sm"
                  placeholder="Chains"
                  selectedKey={field.value}
                  onSelectionChange={field.onChange}
                >
                  {['', ...CHAINS].map((chain) => (
                    <SelectItem key={chain}>
                      {chain ? (
                        <Chain chainId={chain} />
                      ) : (
                        <Stack
                          gap="sm"
                          title={rec.chunks
                            .map((c) => `chain ${c.chainId}: ${c.amount}`)
                            .join('\n')}
                        >
                          <AutoBadge />
                          <Chain
                            chainId={rec.chunks
                              .map((c) => c.chainId)
                              .join(' , ')}
                          />
                        </Stack>
                      )}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            {watchReceivers.length > 1 && (
              <Button
                isCompact
                variant="outlined"
                onClick={() => {
                  console.log('deleting', index);
                  const receivers = getValues('receivers');
                  receivers.splice(index, 1);
                  setValue('receivers', [...receivers]);
                }}
              >
                <MonoDelete />
              </Button>
            )}
          </Stack>
        </Stack>
      ))}
      <Stack justifyContent={'flex-end'}>
        <button
          className={linkClass}
          onClick={() => {
            const receivers = getValues('receivers');
            setValue('receivers', [
              ...receivers,
              {
                amount: '',
                receiver: '',
                chain: '',
                chunks: [],
              },
            ]);
          }}
        >
          + More Receiver
        </button>
      </Stack>

      <Divider />
      <Heading variant="h5">Gas Information</Heading>
      <Stack flexDirection="row" gap="sm">
        <Controller
          name="gasPayer"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              size="sm"
              placeholder="Gas Payer"
              selectedKey={field.value}
              onSelectionChange={field.onChange}
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
          {...register('gasPrice')}
          placeholder="Gas Price"
          size="sm"
          defaultValue="0.00000001"
          type="number"
          step="0.00000001"
        />
        <TextField
          {...register('gasLimit')}
          placeholder="Gas Limit"
          size="sm"
          defaultValue="2500"
          type="number"
        />
      </Stack>
      <Divider />
      <Heading variant="h5">Sign options</Heading>
      <RadioGroup direction={'column'} defaultValue={'safeTransfer'}>
        <Radio value="normalTransfer">Sign by sender</Radio>
        <Radio value="safeTransfer">
          Sign by both sender and receiver (safe transfer)
        </Radio>
      </RadioGroup>
      <Divider />
      <Heading variant="h5">Description</Heading>
      <TextareaField {...register('description')} placeholder="Description" />
      {error && (
        <Notification role="alert" intent="warning">
          total amount ({totalAmount}) is more than the available balance,
          please check your input, also you should consider the gas fee
        </Notification>
      )}
      {redistribution.length > 0 && (
        <Notification role="alert" intent="info" type="inline">
          <Stack flexDirection={'column'} gap={'sm'}>
            before proceeding with the transfer, the following redistribution
            will happen:
            <Stack flexDirection={'column'} gap={'sm'}>
              {redistribution.map((r) => (
                <Stack
                  key={r.source + r.target}
                  gap={'sm'}
                  alignItems={'center'}
                >
                  <Chain chainId={r.source} />
                  {'->'}
                  <Chain chainId={r.target} />
                  {r.amount}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Notification>
      )}
      <Stack justifyContent={'flex-start'} gap="sm">
        <Button onClick={() => evaluateTransactions()} variant="info">
          Evaluate Requests
        </Button>
        <Button>Create Transactions</Button>
      </Stack>
    </Stack>
  );
}
