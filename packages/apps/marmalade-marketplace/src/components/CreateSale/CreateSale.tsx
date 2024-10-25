import { useGetSale } from '@/hooks/getSale';
import { useTransaction } from '@/hooks/transaction';
import { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { getTimestampFromDays } from '@/utils/date';
import { env } from '@/utils/env';
import { generateSpireKeyGasCapability, isPrecise } from '@/utils/helper';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import type { Guard } from '@kadena/client-utils/marmalade';
import {
  ISaleTokenPolicyConfig,
  offerToken,
} from '@kadena/client-utils/marmalade';
import {
  Button,
  NumberField,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';
import { atoms } from '@kadena/kode-ui/styles';
import { PactNumber } from '@kadena/pactjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ConnectButton } from '../ConnectWallet/ConnectButton';

export interface CreateSaleInput {
  saleType?: string;
  price: number;
  timeout: number;
  account?: IAccountContext;
  amount?: number;
}

export interface saleValid {
  [key: string]: boolean;
  price: boolean;
  saleType: boolean;
  amount: boolean;
  timeout: boolean;
}

interface IProps {
  balance: number;
  tokenPrecision: number;
  account: IAccountContext;
  policyConfig: ISaleTokenPolicyConfig;
  saleId?: string;
}

export const CreateSale: FC<IProps> = ({
  balance,
  tokenPrecision,
  account,
  policyConfig,
  saleId,
}) => {
  const { setTransaction } = useTransaction();
  const params = useParams();
  const router = useRouter();
  const { data } = useGetSale(saleId as string);
  const searchParams = useSearchParams();
  const [tokenId, setTokenId] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [saleData, setSaleData] = useState<CreateSaleInput>({
    saleType: 'none',
    price: 0.1,
    amount: 1,
    timeout: 7,
  });

  const [saleInputValid, setSaleInputValid] = useState<saleValid>({
    timeout: true,
    saleType: true,
    price: true,
    amount: true,
  });

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}?chainId=${'8'}`);
  };

  const isSaleValid = (): boolean => {
    for (const key in saleInputValid) {
      if (saleInputValid[key]) continue;
      else return false;
    }
    return true;
  };

  const onSaleDataValidChange = (key: string, value: string | number) => {
    // saletype
    if (key === 'saleType') {
      if (value === 'none') {
        setSaleInputValid({ ...saleInputValid, [key]: true });
      } else setSaleInputValid({ ...saleInputValid, [key]: false });
    } else if (key === 'price') {
      // validate precision of the fungible
      if (Number(value) <= 0)
        setSaleInputValid({ ...saleInputValid, price: false });
      else setSaleInputValid({ ...saleInputValid, price: true });
    } else if (key === 'timeout') {
      // allow 0 for no timeout
      if (Number(value) <= 0 || !isPrecise(Number(value), 0))
        setSaleInputValid({ ...saleInputValid, timeout: false });
      else setSaleInputValid({ ...saleInputValid, timeout: true });
    } else if (key === 'amount') {
      if (
        Number(value) > balance ||
        Number(value) <= 0 ||
        !isPrecise(Number(value), tokenPrecision)
      )
        setSaleInputValid({ ...saleInputValid, amount: false });
      else setSaleInputValid({ ...saleInputValid, amount: true });
    }
    return true;
  };

  const onSaleDataChange = (key: string, value: string | number) => {
    onSaleDataValidChange(key, value);
    setSaleData((v) => ({ ...v, [key]: value }));
  };

  const onSaleTypeChange = (key: string | number) => {
    onSaleDataChange('saleType', key);
  };

  const onCreateSalePress = async () => {
    if (!account.account || !saleData.timeout || !saleData.amount)
      throw new Error('Not all required fields are provided');

    const saleConfig = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: chainId as ChainId,
      sign: createSignWithSpireKeySDK([account.account], onTransactionSigned),
    };

    await offerToken(
      {
        ...saleData,
        auction: {
          fungible: {
            refName: {
              name: 'coin',
              namespace: null,
            },
            refSpec: [
              {
                name: 'fungible-v2',
                namespace: null,
              },
            ],
          },
          price: new PactNumber(saleData.price).toPactDecimal(),
          sellerFungibleAccount: {
            account: account.account.accountName,
            guard: account.account.guard as Guard,
          },
        },
        policyConfig: { ...policyConfig, auction: true },
        tokenId: tokenId,
        chainId: chainId as ChainId,
        timeout: getTimestampFromDays(saleData.timeout),
        amount: new PactNumber(Number(saleData.amount)).toPactDecimal(),
        signerPublicKey: account.account?.devices[0].guard.keys[0],
        seller: {
          account: account.account.accountName,
          guard: account.account.guard as Guard,
        },
        capabilities: generateSpireKeyGasCapability(
          account.account.accountName,
        ),
        meta: { senderAccount: account.account.accountName },
      },
      {
        ...saleConfig,
        defaults: {
          networkId: saleConfig.networkId,
          meta: { chainId: saleConfig.chainId },
        },
      },
    ).execute();
  };

  useEffect(() => {
    const tokenIdParam = params?.tokenId;
    const chainIdParam = searchParams.get('chainId');

    if (typeof tokenIdParam === 'string') {
      setTokenId(tokenIdParam);
    }

    if (typeof chainIdParam === 'string') {
      setChainId(chainIdParam);
    }
  }, [searchParams]);

  if (saleId && data?.seller.account === account.account?.accountName) {
    return (
      <Stack width="100%">
        <CardContentBlock
          className={atoms({ width: '100%' })}
          title="Create a Sale"
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>This token is already on sale</Text>
            </Stack>
          }
        >
          {!account.account && <ConnectButton />}
        </CardContentBlock>
      </Stack>
    );
  }

  if (balance === 0) {
    return (
      <Stack width="100%">
        <CardContentBlock
          className={atoms({ width: '100%' })}
          title="Create a Sale"
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>This token is not yours to sell.</Text>
              {!account && <Text>You are not connected</Text>}
            </Stack>
          }
        >
          {!account.account && <ConnectButton />}
        </CardContentBlock>
      </Stack>
    );
  }

  return (
    <CardContentBlock
      title="Create a Sale"
      supportingContent={
        <Stack flexDirection="column" width="100%" gap="md">
          <Text>
            You can select the amount of tokens you want to sell and set the
            price for each token.
          </Text>
          <Text>
            You must also set the timeout of the sale, which refers to the time
            the sale will be active and will not be withdrawn.
          </Text>
          <Text>
            Marmalade supports two types of auctions: Conventional and Dutch.
          </Text>
          <Text>
            However, the app supports only regular sales without auction for
            now.
          </Text>
        </Stack>
      }
    >
      <Stack flex={1} flexDirection="column" gap="md">
        <RadioGroup
          label="Auction Type"
          direction="row"
          onChange={onSaleTypeChange}
          isInvalid={!saleInputValid.saleType}
          errorMessage={'Auction not supported'}
        >
          <Radio value="conventional">Conventional</Radio>
          <Radio value="dutch">Dutch</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>

        <NumberField
          label="Amount"
          value={saleData.amount}
          onValueChange={(value: number) => {
            onSaleDataChange('amount', value);
          }}
          minValue={1}
          placeholder="Set the amount to sell"
          variant={saleInputValid.amount ? 'default' : 'negative'}
          errorMessage={'Check Amount'}
        />
        <NumberField
          label="Price"
          value={saleData.price}
          onValueChange={(value: number) => {
            onSaleDataChange('price', value);
          }}
          minValue={0.1}
          placeholder="Set the token price in KDA"
          variant={saleInputValid.price ? 'default' : 'negative'}
        />

        <NumberField
          label="Timeout"
          value={saleData.timeout}
          onValueChange={(value: number) => {
            onSaleDataChange('timeout', value);
          }}
          minValue={1}
          info="Set valid sale days"
          variant={saleInputValid.timeout ? 'default' : 'negative'}
        />
      </Stack>
      <CardFooterGroup>
        <Button onPress={onCreateSalePress} isDisabled={!isSaleValid()}>
          Create Sale
        </Button>
      </CardFooterGroup>
    </CardContentBlock>
  );
};
