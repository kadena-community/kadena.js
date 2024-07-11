import { accountRepository } from '@/modules/account/account.repository';
import { useNetwork } from '@/modules/network/network.hook';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { ChainId, ISigner, createTransaction } from '@kadena/client';
import {
  discoverAccount,
  safeTransferCreateCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { composePactCommand } from '@kadena/client/fp';
import {
  Button,
  Checkbox,
  Combobox,
  ComboboxItem,
  Heading,
  Notification,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DiscoverdAccounts } from './components/DiscoverdAccounts';
import { card, disabledItemClass, linkClass } from './style.css';
import {
  IOptimalTransfer,
  IReceiverAccount,
  getAccount,
  simpleOptimalTransfer,
} from './utils';

interface SendForm {
  contract: string;
  sender: string;
  receiver: string;
  amount: string;
  isSafeTransfer: boolean;
}

export function Transfer() {
  const { accounts, fungibles, getPublicKeyData, profile } = useWallet();
  const { activeNetwork } = useNetwork();
  const [receiverAccount, setReceiverAccount] =
    useState<IReceiverAccount | null>(null);
  const [discoveredReceivers, setDiscoverReceivers] = useState<
    IReceiverAccount[]
  >([]);
  const [optimalTransfers, setOptimalTransfers] = useState<
    Array<IOptimalTransfer>
  >([]);
  const navigate = useNavigate();

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

  const {
    watch,
    control,
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<SendForm>({
    defaultValues: {
      contract: 'coin',
      sender: '',
      receiver: '',
      amount: '0',
      isSafeTransfer: true,
    },
  });

  const contracts = accounts
    .map((account) => account.contract)
    .filter((ct, idx, list) => list.indexOf(ct) === idx);

  const getSymbol = (contract: string) => {
    const fungible = fungibles.find((f) => f.contract === contract);
    if (!fungible) {
      throw new Error(`Fungible not found for contract ${contract}`);
    }
    return fungible.symbol;
  };

  const account = accounts.find((acc) => acc.uuid === watch('sender'));
  async function submit({
    contract,
    sender,
    receiver,
    amount,
    isSafeTransfer,
  }: SendForm) {
    if (!account || +account.overallBalance < 0 || !activeNetwork || !profile) {
      console.log({ contract, sender, receiver, amount });
      throw new Error('INVALID_INPUTs');
    }
    if (!receiverAccount || receiverAccount.address !== receiver) {
      throw new Error('Receiver not found');
    }

    const transferFn = isSafeTransfer
      ? safeTransferCreateCommand
      : transferCreateCommand;

    const commands = optimalTransfers.map((optimal) => {
      const command = composePactCommand(
        transferFn({
          amount: optimal.amount,
          contract: contract,
          chainId: optimal.chainId,
          sender: {
            account: account.address,
            publicKeys: account.keyset!.guard.keys.map(mapKeys),
          },
          receiver: {
            account: receiverAccount.address,
            keyset: receiverAccount.keyset.guard,
          },
        }),
        {
          networkId: activeNetwork.networkId,
          meta: {
            chainId: optimal.chainId,
            gasLimit: optimal.gasLimit,
            gasPrice: optimal.gasPrice,
          },
        },
      )();
      return createTransaction(command);
    });

    // const partiallySignedCommands = await sign(commands);

    const groupId = crypto.randomUUID();

    await Promise.all(
      commands.map((tx) =>
        transactionService.addTransaction(
          tx,
          profile.uuid,
          activeNetwork.networkId,
          groupId,
        ),
      ),
    );

    navigate(`/transaction/${groupId}`);
  }

  const discoverReceiver = async (receiver: string) => {
    if (!activeNetwork) {
      throw new Error('Network not found');
    }

    const result = await discoverAccount(
      receiver,
      activeNetwork.networkId,
      undefined,
      getValues('contract'),
    ).execute();

    const rec = getAccount(
      receiver,
      result as Array<{
        chainId: ChainId;
        result: { balance: string; guard: any };
      }>,
    );

    if (rec.length === 0) {
      console.log('Receiver not found!');
      const fromDb = await accountRepository.getAccountByAddress(receiver);
      if (fromDb) {
        console.log('Receiver found in DB');
        rec.push(fromDb);
      } else if (receiver.startsWith('k:')) {
        console.log("Add K account to receiver's list");
        rec.push({
          address: receiver,
          overallBalance: '0',
          chains: [],
          keyset: {
            guard: {
              pred: 'keys-all' as const,
              keys: [receiver.split('k:')[1]],
            },
          },
        });
      }
    }

    rec.forEach((r) => {
      r.keyset.guard.keys = r.keyset.guard.keys.map(mapKeys);
    });

    setDiscoverReceivers(rec);
    if (rec.length === 1) {
      setReceiverAccount(rec[0]);
    }
    console.log({ setDiscoverReceivers: rec });
    return rec;
  };

  const amount = watch('amount');
  const isSafeTransfer = watch('isSafeTransfer');

  useEffect(() => {
    const check = async () => {
      if (!amount || !account || !receiverAccount || !activeNetwork?.networkId)
        return;
      console.log('Checking optimal transfer');
      const optimals = simpleOptimalTransfer(account, amount);
      console.log({ optimals });
      setOptimalTransfers(optimals ?? []);
      if (!optimals) {
        throw new Error('No optimal transfer found');
      }
    };
    check();
  }, [
    account,
    receiverAccount,
    amount,
    activeNetwork,
    mapKeys,
    isSafeTransfer,
  ]);

  console.log({
    receiverAccount,
    discoveredReceivers,
    isValid,
    optimalTransfers,
  });

  return (
    <>
      {!receiverAccount && discoveredReceivers.length > 1 && (
        <DiscoverdAccounts
          accounts={discoveredReceivers}
          onSelect={(account: IReceiverAccount) => setReceiverAccount(account)}
        />
      )}
      <Stack flexDirection={'column'}>
        <Heading variant="h1">Transfer</Heading>
        <form onSubmit={handleSubmit(submit)}>
          <Stack
            className={card}
            gap={'sm'}
            flexDirection={'column'}
            padding={'lg'}
            marginBlockStart={'lg'}
          >
            <Stack flexDirection={'column'} gap={'lg'} paddingBlockEnd={'lg'}>
              <Controller
                name="contract"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    size="sm"
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {contracts.map((contract) => (
                      <SelectItem key={contract}>
                        {getSymbol(contract)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <TextField
                type="number"
                label="Amount"
                placeholder="Enter amount"
                {...register('amount')}
              />
            </Stack>
            <Controller
              name="sender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="From"
                  size="sm"
                  selectedKey={field.value}
                  onSelectionChange={(accountId) => {
                    const account = accounts.find(
                      (acc) => acc.uuid === accountId,
                    );
                    if (
                      !account ||
                      +account.overallBalance < +getValues('amount')
                    )
                      return;
                    field.onChange(accountId);
                  }}
                >
                  {accounts
                    .filter(
                      (account) =>
                        account.contract === 'coin' &&
                        +account.overallBalance > 0,
                    )
                    .map((account) => (
                      <SelectItem key={account.uuid}>
                        <span
                          className={classNames(
                            +account.overallBalance < +getValues('amount') &&
                              disabledItemClass,
                          )}
                        >
                          {account.address}
                        </span>
                      </SelectItem>
                    ))}
                </Select>
              )}
            />
            <Stack justifyContent={'space-between'}>
              <Text size="small">
                {account?.overallBalance
                  ? `Balance ${account?.overallBalance}`
                  : ''}
              </Text>
              <Stack gap={'sm'}>
                <Text size="small">
                  {optimalTransfers.length
                    ? `Source chains: (${optimalTransfers.map(({ chainId }) => chainId).join(', ')})`
                    : ''}
                </Text>
              </Stack>
            </Stack>
            <Controller
              control={control}
              name="receiver"
              render={({ field }) => (
                <Combobox
                  size="sm"
                  label="To"
                  allowsCustomValue
                  inputValue={field.value ?? ''}
                  onSelectionChange={field.onChange}
                  onInputChange={(value) => {
                    console.log('set value', value);
                    field.onChange(value ?? '');
                  }}
                  onBlur={(event) => {
                    const value = event.target.value;
                    discoverReceiver(value);
                  }}
                >
                  {accounts
                    .filter((acc) => acc.uuid !== account?.uuid)
                    .map((account) => (
                      <ComboboxItem key={account.address}>
                        {account.address}
                      </ComboboxItem>
                    ))}
                </Combobox>
              )}
            />

            <Stack justifyContent={'space-between'}>
              <Text size="small">
                {receiverAccount?.overallBalance
                  ? `Balance ${receiverAccount?.overallBalance}`
                  : ' '}
              </Text>
              <Stack gap="sm">
                <Text size="small">
                  {optimalTransfers.length
                    ? `Target chains: (${optimalTransfers.map(({ chainId }) => chainId).join(', ')})`
                    : ' '}
                </Text>
              </Stack>
            </Stack>

            <Stack gap={'lg'} flexDirection={'column'}>
              <Controller
                control={control}
                name="isSafeTransfer"
                render={({ field }) => (
                  <Checkbox isSelected={field.value} onChange={field.onChange}>
                    Safe Transfer
                  </Checkbox>
                )}
              />
              <button className={linkClass}>Show Advanced Options</button>
            </Stack>
            {optimalTransfers.length > 1 && (
              <Notification role="alert">
                <Text size="small">
                  This form will initiate {optimalTransfers.length} transactions
                  to transfer the amount from the following chains:{' '}
                  {optimalTransfers.map(({ chainId }) => chainId).join(', ')}
                </Text>
                <Text size="small">
                  If you need only one transaction select another account or
                  redistribute your KDA first.
                </Text>
              </Notification>
            )}
          </Stack>
          <Stack
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            paddingBlockStart={'lg'}
            gap={'sm'}
          >
            <Button
              type="submit"
              isDisabled={
                !isValid || !receiverAccount || optimalTransfers.length === 0
              }
            >
              Confirm
            </Button>
            <Button
              variant="transparent"
              isDisabled={
                !isValid || !receiverAccount || optimalTransfers.length === 0
              }
            >
              Advance Options
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
