import { IAccount } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  createRedistributionTxs,
  processRedistribute,
} from '@/pages/transfer-v2/utils';
import { ChainId, ISigner } from '@kadena/client';
import { Button, Notification, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ChainList } from './components/ChainList';
import { divideChains, processChainAccounts } from './processChainAccounts';

interface IProps extends PropsWithChildren {
  chains: {
    chainId: ChainId;
    balance: number;
  }[];
  overallBalance: string;
  fundAccount: (chainId: ChainId) => Promise<void>;
  account: IAccount;
  onRedistribution: (groupId: string) => void;
}
export const AccountBalanceDistribution: FC<IProps> = ({
  chains,
  overallBalance,
  fundAccount,
  account,
  onRedistribution,
}) => {
  const { activeNetwork, getPublicKeyData } = useWallet();
  const [availableBalance, setAvailableBalance] = useState(overallBalance);
  const chainLists = useMemo(() => {
    const enrichedChains = processChainAccounts(
      chains,
      20,
      new PactNumber(overallBalance).toNumber(),
    );
    return divideChains(enrichedChains, 2);
  }, [chains]);

  const flatChains = useMemo(
    () =>
      chainLists
        .flat()
        .sort((a, b) => +a.chainId - +b.chainId)
        .map(({ chainId, balance }) => ({
          chainId,
          balance: balance ? balance.toString() : '',
        })),
    [chainLists],
  );

  const [editable, setEditable] = useState(false);

  const methods = useForm<{ chains: typeof flatChains }>({
    defaultValues: { chains: flatChains },
  });
  const { handleSubmit, watch, reset, setValue } = methods;
  const editedData = watch('chains');

  const sum = editedData.reduce(
    (sum, { balance }) => sum.plus(balance || 0),
    new PactNumber(0),
  );

  console.log({
    sum: sum.toDecimal(),
    overallBalance,
    editedData,
  });

  const gasPrice = 1.0e-8;
  const gasLimit = 2500;
  const reservedGas = new PactNumber(gasPrice)
    .times(gasLimit)
    .dp(8)
    .toDecimal();

  function getRequiredTsxCount(chainList: typeof flatChains) {
    const chainBalance = chainList.map((chain) => ({
      chainId: chain.chainId as ChainId,
      demand: chain.balance,
      balance: new PactNumber(
        chains.find((c) => c.chainId === chain.chainId)?.balance ?? 0,
      ).toDecimal(),
    }));
    const [, redistribution] = processRedistribute(chainBalance, '0', '0');
    return redistribution.length;
  }

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

  async function onSubmit(data: { chains: typeof flatChains }) {
    const chainBalance = data.chains.map((chain) => ({
      chainId: chain.chainId as ChainId,
      demand: chain.balance,
      balance: new PactNumber(
        chains.find((c) => c.chainId === chain.chainId)?.balance ?? 0,
      ).toDecimal(),
    }));
    const [, redistribution] = processRedistribute(
      chainBalance,
      reservedGas,
      '0',
    );
    const [groupId] = await createRedistributionTxs({
      account,
      gasLimit,
      gasPrice,
      networkId: activeNetwork!.networkId,
      redistribution,
      mapKeys,
    });

    onRedistribution(groupId);
  }

  const getDistribution = (availableBalance: string) => {
    const amount = new PactNumber(availableBalance)
      .div(flatChains.length)
      // Pact only supports 8 decimal places
      .dp(8, PactNumber.ROUND_FLOOR)
      .toDecimal();
    const newChains = flatChains.map((chain) => ({
      ...chain,
      balance: amount,
    }));
    const lastOne = newChains[newChains.length - 1];
    lastOne.balance = new PactNumber(availableBalance)
      .minus(new PactNumber(amount).multipliedBy(newChains.length - 1))
      .toDecimal();
    return newChains;
  };

  function distributeEqually() {
    const newChains = getDistribution(overallBalance.toString());
    const requiredTsxCount = getRequiredTsxCount(newChains);
    const available = new PactNumber(overallBalance).minus(
      new PactNumber(reservedGas).times(requiredTsxCount),
    );
    const chainsWithTxFees = getDistribution(available.toDecimal());
    setAvailableBalance(available.toDecimal());
    setValue('chains', chainsWithTxFees);
  }

  return (
    <Stack flexDirection={'column'} flex={1} gap={'sm'}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Stack
              gap={'sm'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Text>
                See your balance distribution across the chains, you can edit
                the distribution
              </Text>
              <Stack gap={'sm'}>
                {editable && (
                  <>
                    {sum.eq(availableBalance) && (
                      <Button isCompact type="submit">
                        Submit Changes
                      </Button>
                    )}
                    <Button
                      isCompact
                      variant="info"
                      onClick={distributeEqually}
                    >
                      Distribute Equally
                    </Button>
                    <Button
                      isCompact
                      type="reset"
                      onClick={() => {
                        setEditable((val) => !val);
                        reset();
                      }}
                      variant={'outlined'}
                    >
                      Reset
                    </Button>
                  </>
                )}
                {!editable && (
                  <Button
                    isCompact
                    onClick={() => {
                      setEditable((val) => !val);
                    }}
                    variant={'outlined'}
                  >
                    Edit Distribution
                  </Button>
                )}
              </Stack>
            </Stack>
            {!sum.eq(availableBalance) && (
              <Notification role="alert" intent="warning">
                <Text>
                  {sum.gt(availableBalance) &&
                    `${sum.toDecimal()} is bigger than available balance(${availableBalance})`}
                </Text>

                <Text>
                  {sum.lt(availableBalance) &&
                    `${sum.toDecimal()} is less than available balance(${availableBalance})`}
                </Text>
              </Notification>
            )}
            <Stack
              flex={1}
              gap="sm"
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              {chainLists.map((chainList, idx) => (
                <ChainList
                  key={idx}
                  chains={chainList}
                  fundAccount={fundAccount}
                  editable={editable}
                />
              ))}
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  );
};
