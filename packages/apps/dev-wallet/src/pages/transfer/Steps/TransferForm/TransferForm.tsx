import { IOwnedAccount } from '@/modules/account/account.repository';
import { activityRepository } from '@/modules/activity/activity.repository';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { ChainId } from '@kadena/client';
import { Button, Divider, Notification, Stack } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
import { PactNumber } from '@kadena/pactjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IRetrievedAccount } from '../../../../modules/account/IRetrievedAccount';
import {
  IReceiver,
  getAvailableChains,
  getTransfers,
  needToSelectKeys,
} from '../../utils';
import { MetaCard } from './components/MetaCard';
import { ReceiverCard } from './components/ReceiverCard';
import { SenderCard } from './components/SenderCard';
import { SignOptionsCard } from './components/SignOptionsCard';
import { TransferCard } from './components/TransferCard';

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
  const navigate = usePatchedNavigate();

  const {
    accounts: allAccounts,
    fungibles,
    activeNetwork,
    profile,
    watchAccounts,
    contacts,
  } = useWallet();
  const urlAccount = [...allAccounts, ...watchAccounts].find(
    (account) => account.uuid === accountId,
  ) as IOwnedAccount | undefined;

  const defaultValues = {
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
  } as const;

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
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: defaultValues as any,
  });

  const crossChainMode = watch('xchainMode');
  const [hasXChain, setHasXChain] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

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

  const totalAmount = watch('totalAmount');

  const evaluateTransactions = useCallback(() => {
    if (!senderAccount) return;

    const receivers = getValues('receivers')?.filter((r) => r) as IReceiver[];
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
      ?.filter((rec) => rec?.address === senderAccount.address && rec.chain)
      .flatMap(({ chain }) => chain);
    const availableChains = senderAccount.chains?.filter(
      (chain) => !usedChains.includes(chain.chainId),
    );

    const allChainsSet = receivers.every((receiver, index) => {
      if (receiver?.address === senderAccount.address && !receiver.chain) {
        setError({
          target: `receivers.${index}`,
          message:
            'Please select the target chain. Auto mode is not available when the receiver is the sender',
        });
        return false;
      }
      return true;
    });

    console.log({ allChainsSet });

    if (!allChainsSet) return;

    const receiversWithIndex = receivers.map((receiver, index) => ({
      receiver,
      index,
    }));

    const otherReceiversWithIndex = receiversWithIndex?.filter(
      ({ receiver: rec }) => rec?.address !== senderAccount.address,
    );

    try {
      const sameAddressReceivers = receiversWithIndex
        ?.filter(({ receiver: rec }) => rec?.address === senderAccount.address)
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
        availableChains?.filter(
          (chain) => !selectedChain || chain.chainId === selectedChain,
        ),
        !gasPayer || gasPayer?.address === senderAccount.address
          ? new PactNumber(gasPrice).times(gasLimit).toDecimal()
          : '0',
        otherReceivers,
        sameAddressReceivers,
      );

      let hasXchain = redistributionRequest.length > 0;

      const updatedReceivers = receiversWithIndex.map(({ receiver, index }) => {
        if (receiver?.address === senderAccount.address) {
          hasXchain = true;
          return {
            ...receiver,
            xchain: true,
            address:
              receiver?.address || receiver.discoveredAccount?.address || '',
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
            receiver?.address || receiver?.discoveredAccount?.address || '',
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
        receivers: [
          ...data.receivers,
          ...xchainSameAccount.map((x) => ({
            amount: x.amount,
            address: senderAccount.address,
            chain: x.target,
            xchain: true,
            chunks: [
              {
                amount: x.amount,
                chainId: x.source,
              },
            ],
            discoveredAccount: senderAccount,
          })),
        ],
        gasPayer: data.gasPayer || data.senderAccount,
        creationTime: data.creationTime ?? Math.floor(Date.now() / 1000),
      },
      [...redistribution],
    );
  }

  const senderChain = watch('chain');

  const isSafeTransfer = watch('type') === 'safeTransfer';

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack flexDirection="column" width="100%" gap="lg">
        <TransferCard
          defaultValues={defaultValues}
          fungibles={fungibles}
          selectedContract={getValues('fungible')}
          reset={reset}
        />
        <SenderCard
          withEvaluate={withEvaluate}
          control={control}
          validateAccount={validateAccount}
          filteredAccounts={filteredAccounts}
          filteredWatchedAccounts={filteredWatchedAccounts}
          contacts={contacts}
          activeNetwork={activeNetwork}
          watchFungibleType={watchFungibleType}
          overallBalance={overallBalance}
          senderAccount={senderAccount}
          forceRender={forceRender}
          chains={chains}
        />

        <ReceiverCard
          control={control}
          chains={chains}
          withEvaluate={withEvaluate}
          forceRender={forceRender}
          getValues={getValues}
          getAvailableChains={getAvailableChains}
          senderAccount={senderAccount}
          senderChain={senderChain}
          validateAccount={validateAccount}
          resetField={resetField}
          reset={reset}
          setValue={setValue}
          evaluateTransactions={evaluateTransactions}
          filteredAccounts={filteredAccounts}
          isSafeTransfer={isSafeTransfer}
          filteredWatchedAccounts={filteredWatchedAccounts}
          contacts={contacts}
          activeNetwork={activeNetwork}
          watchFungibleType={watchFungibleType}
          redistribution={redistribution}
          crossChainText={crossChainText}
          error={error}
        />

        <SignOptionsCard
          control={control}
          hasXChain={hasXChain}
          crossChainMode={crossChainMode}
          setValue={setValue}
          selectedType={getValues('type')}
          selectedTxType={getValues('xchainMode')}
        />

        {showAdvancedOptions ? (
          <>
            <Divider
              label="Advance options"
              bgColor={token('color.neutral.n1')}
            />
            <MetaCard
              control={control}
              chains={chains}
              withEvaluate={withEvaluate}
              forceRender={forceRender}
              hasXChain={hasXChain}
              evaluateTransactions={evaluateTransactions}
              filteredAccounts={filteredAccounts}
              validateAccount={validateAccount}
              getValues={getValues}
              filteredWatchedAccounts={filteredWatchedAccounts}
              contacts={contacts}
              activeNetwork={activeNetwork}
              watchFungibleType={watchFungibleType}
            />
          </>
        ) : null}

        <Stack width="100%" flexDirection="column">
          {(error || !formState.isValid) && formState.isSubmitted && (
            <Stack
              alignItems={'flex-start'}
              gap="lg"
              marginBlockStart={'lg'}
              marginBlockEnd={'xxxl'}
              flexDirection={'column'}
            >
              <Notification type="inline" role="alert" intent="negative">
                Invalid Data, Please check the input(s) (
                {[...Object.keys(formState.errors), error?.target.split('.')[0]]
                  .filter(Boolean)
                  .join(', ')}
                )
              </Notification>
            </Stack>
          )}
          <Stack
            alignItems={'flex-start'}
            gap="lg"
            marginBlockStart={'lg'}
            marginBlockEnd={'xxxl'}
            flexDirection={'column'}
          >
            {!!error && error.target === 'general' && (
              <Notification type="inline" role="alert" intent="negative">
                {error.message}
              </Notification>
            )}
          </Stack>

          <Stack marginBlockEnd={'xxxl'}>
            <Button
              variant="outlined"
              onPress={() => {
                navigate('/activities');
              }}
            >
              Abort
            </Button>
            <Stack justifyContent="flex-end" flex={1} gap="sm">
              <Button
                variant="outlined"
                onPress={() => setShowAdvancedOptions((v) => !v)}
              >
                {showAdvancedOptions
                  ? 'Hide Advanced options'
                  : 'Show Advanced options'}
              </Button>
              <Button isDisabled={!formState.isValid} type="submit">
                Create Transactions
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
