import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { useNetwork } from '@/modules/network/network.hook';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { ChainId } from '@kadena/client';
import { discoverAccount, transferCreate } from '@kadena/client-utils/coin';
import {
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/react-ui';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DiscoverdAccounts } from './components/DiscoverdAccounts';
import { card, linkClass } from './style.css';
import {
  IOptimalTransfer,
  IReceiverAccount,
  findOptimalTransfer,
  getAccount,
} from './utils';

interface SendForm {
  contract: string;
  sender: string;
  receiver: string;
  amount: string;
}

export function Transfer() {
  const { accounts, fungibles, sign, getPublicKeyData, profile } = useWallet();
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

  const prompt = usePrompt();

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

  const account = accounts.find((acc) => acc.uuid === getValues('sender'));
  async function submit({ contract, sender, receiver, amount }: SendForm) {
    if (!account || +account.overallBalance < 0 || !activeNetwork || !profile) {
      console.log({ contract, sender, receiver, amount });
      throw new Error('INVALID_INPUTs');
    }
    if (!receiverAccount || receiverAccount.address !== receiver) {
      throw new Error('Receiver not found');
    }

    Promise.all(
      optimalTransfers.map(async (optimal) => {
        const task = transferCreate(
          {
            amount: optimal.amount,
            contract: contract,
            chainId: optimal.chainId,
            sender: {
              account: account.address,
              publicKeys: account.keyset!.guard.keys.map((key) => {
                const info = getPublicKeyData(key);
                if (info && info.scheme) {
                  return {
                    pubKey: key,
                    scheme: info.scheme,
                  };
                }
                return key;
              }),
            },
            receiver: {
              account: receiverAccount.address,
              keyset: receiverAccount.keyset.guard,
            },
          },
          {
            defaults: {
              networkId: activeNetwork.networkId,
              meta: {
                chainId: optimal.chainId,
                gasLimit: optimal.gasLimit,
                gasPrice: optimal.gasPrice,
              },
            },
            sign,
          },
        );
        const command = await task.executeTo('command');
        const tx = await transactionService.addTransaction(
          command,
          profile.uuid,
          activeNetwork.networkId,
        );
        navigate(`/transaction/${tx.uuid}`);
        // try {
        //   await prompt((resolve, reject) => (
        //     <ReviewTransaction
        //       transaction={command}
        //       resolve={resolve}
        //       reject={reject}
        //     />
        //   ));
        // } catch (e) {
        //   console.log('Transaction rejected deleting from db', e);
        //   await transactionRepository.deleteTransaction(tx.uuid);
        //   return;
        // }
        // const signed = await task.executeTo('sign');
        // await transactionRepository.updateTransaction({
        //   ...tx,
        //   ...signed,
        //   status: 'signed',
        // });
        // const request = await task.executeTo('submit');
        // await transactionRepository.updateTransaction({
        //   ...tx,
        //   ...signed,
        //   status: 'submitted',
        //   request,
        // });
        // const result = await task.executeTo('listen');
        // await transactionRepository.updateTransaction({
        //   ...tx,
        //   ...signed,
        //   status: result.result.status,
        //   result: result,
        //   request,
        // });
        // return task.execute();
      }),
    ).then((results) => {
      console.log('transfer results', results);
    });
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
      if (receiver.startsWith('k:')) {
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

    setDiscoverReceivers(rec);
    if (rec.length === 1) {
      setReceiverAccount(rec[0]);
    }
    console.log({ setDiscoverReceivers: rec });
    return rec;
  };

  const amount = watch('amount');

  useEffect(() => {
    const check = async () => {
      if (!amount || !account || !receiverAccount || !activeNetwork?.networkId)
        return;
      const optimals = await findOptimalTransfer(
        account,
        receiverAccount,
        amount,
        activeNetwork!.networkId,
        getPublicKeyData,
      );
      setOptimalTransfers(optimals ?? []);
      if (!optimals) {
        throw new Error('No optimal transfer found');
      }
    };
    check();
  }, [account, receiverAccount, amount, activeNetwork, getPublicKeyData]);

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
            <Controller
              name="sender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="From"
                  size="sm"
                  selectedKey={field.value}
                  onSelectionChange={field.onChange}
                >
                  {accounts
                    .filter(
                      (account) =>
                        account.contract === 'coin' &&
                        +account.overallBalance > 0,
                    )
                    .map((account) => (
                      <SelectItem key={account.uuid}>
                        {account.address}
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
                <button className={linkClass}>Change</button>
              </Stack>
            </Stack>
            <TextField
              label="To"
              placeholder="Enter address"
              {...register('receiver', {
                onBlur: (event) => {
                  const value = event.target.value;
                  discoverReceiver(value);
                },
              })}
            />
            <Stack justifyContent={'space-between'}>
              <Text size="small">
                {receiverAccount?.overallBalance
                  ? `Balance ${receiverAccount?.overallBalance}`
                  : ''}
              </Text>
              <Stack gap="sm">
                <Text size="small">
                  {optimalTransfers.length
                    ? `Target chains: (${optimalTransfers.map(({ chainId }) => chainId).join(', ')})`
                    : ''}
                </Text>
                <button className={linkClass}>Change</button>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            paddingBlockStart={'lg'}
          >
            <Button
              type="submit"
              isDisabled={!isValid || optimalTransfers.length === 0}
            >
              Transfer
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
