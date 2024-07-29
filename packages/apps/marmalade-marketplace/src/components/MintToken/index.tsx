import React, { FormEvent, useState, useEffect} from 'react';
import { env } from '@/utils/env';
import * as styles from './style.css';
import { useRouter } from 'next/navigation';
import { Stack,  Button, TextField, NumberField, Checkbox } from '@kadena/kode-ui';
import { ChainId, BuiltInPredicate } from '@kadena/client';
import { getTokenInfo, mintToken } from '@kadena/client-utils/marmalade';
import { useAccount } from '@/hooks/account';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import { useTransaction } from '@/hooks/transaction';
import { generateSpireKeyGasCapability, checkConcretePolicies, Policy } from '@/utils/helper';
import { PactNumber } from "@kadena/pactjs";
import { MonoAutoFixHigh, MonoAccountBalanceWallet, MonoAccessTime } from '@kadena/kode-icons';
import { TokenMetadata } from "@/components/Token";
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { useSearchParams } from 'next/navigation';

import CrudCard from '@/components/CrudCard';

function MintTokenComponent() {
  const router = useRouter();
  const { account, webauthnAccount } = useAccount();
  const searchParams = useSearchParams();

  const { setTransaction } = useTransaction();
  const [tokenId, setTokenId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{guarded?: boolean, collection?:boolean, hasRoyalty?: boolean, nonFungible?: boolean, nonUpdatableURI?: boolean} | undefined>(undefined);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [tokenInfo, setTokenInfo] = useState<{uri: string}>({uri: ''})
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");
  
  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}`);
  }

  useEffect(() => {
    if (searchParams.has('tokenId')) {
      const tokenId = searchParams.get('tokenId');
      if (tokenId) {
        setTokenId(tokenId);
        fetchTokenInfo(tokenId);
      }      
    }
  }, [searchParams]);

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: '8' as ChainId,
    sign: createSignWithSpireKeySDK([account], onTransactionSigned),
  };

  const fetchTokenInfo = async (id: string) => {
    const res = await getTokenInfo({
      tokenId: id,
      networkId: config.networkId,
      chainId: config.chainId,
      host: config.host,
    }) as { policies: Policy[], uri: string };
    setTokenInfo(res); 
    setResult(checkConcretePolicies(res.policies))    
    await fetch(res);
  }

  async function fetch(tokenInfo:any) {
    const metadata = await getTokenMetadata(tokenInfo.uri);
    setTokenMetadata(metadata);
    try {
      if (!!metadata?.image?.length) {
        const tokenImageUrl = getTokenImageUrl(metadata.image);
        if (tokenImageUrl) {
          setTokenImageUrl(tokenImageUrl);
        } else console.log('Invalid Image URL', metadata.image)
      }
    } catch (e) {
      console.log('Error fetching token info', e)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {

      const amountFormatted = (amount === 1) ? {"decimal": "1.0"} : new PactNumber(amount).toPactDecimal();

      if (!webauthnAccount) {
        throw new Error("Webauthn account not found");
      }

      const walletAccount = account?.accountName || '';

      await mintToken({
        policyConfig: result,
        tokenId: tokenId,
        accountName: webauthnAccount?.account || "",
        guard: {
          account: webauthnAccount.account,
          keyset: webauthnAccount.guard
        },
        amount: amountFormatted,
        chainId: config.chainId as ChainId,
        capabilities: generateSpireKeyGasCapability(walletAccount),
        meta: {senderAccount: walletAccount}
      },
      {
        ...config,
        defaults: { networkId: config.networkId, meta: { chainId: config.chainId } },
      }).execute();
    } catch (error) {
      console.log(error)
      setError(error?.message);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event as unknown as FormEvent);
  };

  const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  return (
    <div>
      <Stack flex={1} flexDirection="column"  className={styles.container}>
        <CrudCard
          headingSize="h3"
          titleIcon={<MonoAutoFixHigh />}
          title="Mint Token"
          description={[
            "After creating the tokens, they are ready to be minted.",
            "Minting refers to increasing a token's supply and assigning it to specific accounts.",
            "Each token adheres to the rules established during its creation process.",
            "Once you mint a token to your account, you can either sell it or use it for various purposes within the ecosystem.",
            "Try minting your own nft!"
          ]}
        >
          <div>
            <img
              src={tokenImageUrl}
              alt="Token Image"
              className={styles.tokenImageClass}
            />
          </div>
          <div className={styles.formContainer} >
            <TextField label="Token ID" name="tokenId" value={tokenId} onChange={handleTokenInputChange} onBlur={() => fetchTokenInfo(tokenId)} /> 
            <NumberField label="Amount" value={amount} onValueChange={handleAmountInputChange} />
          </div>
        </CrudCard>

        {result && (<CrudCard
          title="Token Policy Information"
          description={[
            "Displays the token policy information",
          ]}>
          <div className={styles.checkboxRow}>
            <Checkbox isReadOnly={true} id="nonUpdatableURI" isSelected={result.nonUpdatableURI}>Non-Updatable URI</Checkbox>
            <Checkbox isReadOnly={true} id="guarded"  isSelected={result?.guarded}>Guarded</Checkbox>
          </div>
          <div className={styles.checkboxRow}>
            <Checkbox isReadOnly={true} id="nonFungible" isSelected={result?.nonFungible}>Non Fungible</Checkbox>
            <Checkbox isReadOnly={true} id="hasRoyalty" isSelected={result?.hasRoyalty}>Has Royalty</Checkbox>
          </div>
          <div className={styles.checkboxRow}>
            <Checkbox isReadOnly={true} id="collection" isSelected={result?.collection}>Collection</Checkbox>
          </div> 
        </CrudCard>
        )}
        {error && (
          <div className={styles.errorBox}>
            <p>Error: {error}</p>
          </div>
        )}
      </Stack>
      <div className={styles.buttonRow}>
        <Button variant="outlined" onPress={onCancelPress}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleButtonClick}>
          Mint Token
        </Button>
      </div>
    </div>
  );
}

export default function MintToken() {
  return <MintTokenComponent />;
}
