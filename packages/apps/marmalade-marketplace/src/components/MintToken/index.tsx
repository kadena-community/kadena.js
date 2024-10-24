import { TokenMetadata } from '@/components/Token';
import { useAccount } from '@/hooks/account';
import { useTransaction } from '@/hooks/transaction';
import { env } from '@/utils/env';
import {
  checkConcretePolicies,
  generateSpireKeyGasCapability,
  Policy,
} from '@/utils/helper';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import type { Guard } from '@kadena/client-utils/marmalade';
import { getTokenInfo, mintToken } from '@kadena/client-utils/marmalade';
import { MonoAutoFixHigh } from '@kadena/kode-icons';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Notification,
  NumberField,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  CardContentBlock,
  CardFixedContainer,
  CardFooterGroup,
} from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import * as styles from './style.css';

const MintTokenComponent = () => {
  const router = useRouter();
  const { account } = useAccount();
  const searchParams = useSearchParams();

  const { setTransaction } = useTransaction();
  const [tokenId, setTokenId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<
    | {
        guarded?: boolean;
        collection?: boolean;
        hasRoyalty?: boolean;
        nonFungible?: boolean;
        nonUpdatableURI?: boolean;
      }
    | undefined
  >(undefined);
  const [_tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [_tokenInfo, setTokenInfo] = useState<{ uri: string }>({ uri: '' });
  const [tokenImageUrl, setTokenImageUrl] = useState<string>('/no-image.webp');

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}?chainId=${`8`}`);
  };

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: '8' as ChainId,
    sign: createSignWithSpireKeySDK([account], onTransactionSigned),
  };

  const fetchTokenInfo = async (id: string) => {
    const res = (await getTokenInfo({
      tokenId: id,
      networkId: config.networkId,
      chainId: config.chainId,
      host: config.host,
    })) as { policies: Policy[]; uri: string };
    setTokenInfo(res);
    setResult(checkConcretePolicies(res.policies));
    await fetch(res);
  };

  useEffect(() => {
    if (searchParams.has('tokenId')) {
      const tokenId = searchParams.get('tokenId');
      if (tokenId) {
        setTokenId(tokenId);
        fetchTokenInfo(tokenId);
      }
    }
  }, [searchParams]);

  async function fetch(tokenInfo: any) {
    const metadata = await getTokenMetadata(tokenInfo.uri);
    setTokenMetadata(metadata);
    try {
      if (metadata?.image?.length) {
        const tokenImageUrl = getTokenImageUrl(metadata.image);
        if (tokenImageUrl) {
          setTokenImageUrl(tokenImageUrl);
        } else console.log('Invalid Image URL', metadata.image);
      }
    } catch (e) {
      console.log('Error fetching token info', e);
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const amountFormatted =
        amount === 1
          ? { decimal: '1.0' }
          : new PactNumber(amount).toPactDecimal();

      if (!account) {
        throw new Error('Spirekey account not found');
      }

      const walletAccount = account?.accountName || '';

      await mintToken(
        {
          policyConfig: result,
          tokenId: tokenId,
          accountName: walletAccount,
          signerPublicKey: account && account.devices[0].guard.keys[0],
          guard: { account: walletAccount, guard: account.guard as Guard },
          amount: amountFormatted,
          chainId: config.chainId as ChainId,
          capabilities: generateSpireKeyGasCapability(walletAccount),
          meta: { senderAccount: walletAccount },
        },
        {
          ...config,
          defaults: {
            networkId: config.networkId,
            meta: { chainId: config.chainId },
          },
        },
      ).execute();
    } catch (error) {
      console.log(error);
      setError(error?.message);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event as unknown as FormEvent);
  };

  const handleTokenInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setTokenId(value);
  };

  const onCancelPress = () => {
    router.back();
  };

  const handleAmountInputChange = (value: number) => {
    if (value >= 0) {
      setAmount(value);
    }
  };

  console.log(result);

  return (
    <>
      <CardFixedContainer>
        <CardContentBlock
          visual={<MonoAutoFixHigh />}
          title="Mint Token"
          extendedContent={
            <img
              src={tokenImageUrl}
              alt="Token Image"
              className={styles.tokenImageClass}
            />
          }
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>
                After creating the tokens, they are ready to be minted.
              </Text>
              <Text>
                Minting refers to increasing a token&apos;s supply and assigning
                it to specific accounts.
              </Text>
              <Text>
                Each token adheres to the rules established during its creation
                process.
              </Text>
              <Text>
                Once you mint a token to your account, you can either sell it or
                use it for various purposes within the ecosystem.
              </Text>
              <Text>Try minting your own nft!</Text>
            </Stack>
          }
        >
          <TextField
            label="Token ID"
            name="tokenId"
            value={tokenId}
            onChange={handleTokenInputChange}
            onBlur={() => fetchTokenInfo(tokenId)}
          />
          <NumberField
            label="Amount"
            value={amount}
            onValueChange={handleAmountInputChange}
          />
        </CardContentBlock>
        {result && (
          <CardContentBlock
            title="Token Policy Information"
            supportingContent={
              <Stack flexDirection="column" width="100%" gap="md">
                <Text>Displays the token policy information</Text>
                <Text>Try minting your own nft!</Text>
              </Stack>
            }
          >
            <CheckboxGroup label="Concrete Policies" direction="column">
              <Checkbox
                isReadOnly={true}
                id="nonUpdatableURI"
                isSelected={result.nonUpdatableURI}
              >
                Non-Updatable URI
              </Checkbox>
              <Checkbox
                isReadOnly={true}
                id="guarded"
                isSelected={result?.guarded}
              >
                Guarded
              </Checkbox>
              <Checkbox
                isReadOnly={true}
                id="nonFungible"
                isSelected={result?.nonFungible}
              >
                Non Fungible
              </Checkbox>
              <Checkbox
                isReadOnly={true}
                id="hasRoyalty"
                isSelected={result?.hasRoyalty}
              >
                Has Royalty
              </Checkbox>
              <Checkbox
                isReadOnly={true}
                id="collection"
                isSelected={result?.collection}
              >
                Collection
              </Checkbox>
            </CheckboxGroup>
          </CardContentBlock>
        )}

        {error && (
          <Stack paddingBlockStart="lg">
            <Notification intent="negative" role="status">
              Error: {error}
            </Notification>
          </Stack>
        )}

        <CardFooterGroup>
          <Button variant="outlined" onPress={onCancelPress}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleButtonClick}>
            Mint Token
          </Button>
        </CardFooterGroup>
      </CardFixedContainer>
    </>
  );
};

export default MintTokenComponent;
