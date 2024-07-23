import { useEffect, useState } from "react";
import { ChainId } from '@kadena/client';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { Stack, Select, SelectItem, Button, NumberField, Tabs, TabItem  } from "@kadena/kode-ui";
import { MonoAccessTime, MonoSelectAll, MonoViewInAr} from '@kadena/kode-icons';
import { KRoundedFilledKdacolorBlack  } from '@kadena/kode-icons/brand';
import CrudCard from '@/components/CrudCard';
import { TokenMetadata } from "@/components/Token";
import { useAccount } from '@/hooks/account';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { env } from '@/utils/env';
import { useTransaction } from '@/hooks/transaction';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { generateSpireKeyGasCapability } from '@/utils/helper';
import { offerToken } from '@kadena/client-utils/marmalade';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import * as styles from '@/styles/create-sale.css';

export default function CreateSale() {
  const [tokenId, setTokenId] = useState<string>("");
  const [chainId, setChainId] = useState<ChainId | null>(null);
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [saleData, setSaleData] = useState<CreateSaleInput>({ timeout: 0, saleType: "none", price: 0, amount: 0 });
  const searchParams = useSearchParams();
  const params = useParams();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const account = useAccount();

  interface CreateSaleInput {
  tokenId?: string;
  chainId?: ChainId;
  saleType?: string;
  price: number;
  timeout: number;
  account?: IAccountContext;
  amount?: number;
}

useEffect(() => {
    const tokenIdParam = params?.["tokenId"] as string;
    const chainIdParam = "8"
    if (tokenIdParam && chainIdParam) {
      setTokenId(tokenIdParam as string);
      setChainId(chainIdParam as ChainId);
      setSaleData({ ...saleData, tokenId: tokenIdParam, chainId: chainIdParam as ChainId });
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetch() {
      if (tokenId === "" || !chainId) return;
      try {
        const tokenInfo = await getTokenInfo({
          tokenId,
          chainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        }) as { uri: string };

        const metadata = await getTokenMetadata(tokenInfo.uri);
        setTokenMetadata(metadata);

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

    fetch();
  }, [tokenId])

  const onCancelPress = () => {
    router.back();
  }

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}`);
  }

  const onCreateSalePress = async () => {
    if (
      !account.webauthnAccount ||
      !account.account ||
      !saleData.tokenId ||
      !saleData.chainId ||
      !saleData.timeout ||
      !saleData.amount
    ) throw new Error("Not all required fields are provided");
    
    const saleConfig = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: saleData.chainId,
      sign: createSignWithSpireKeySDK([account.account.accountName], onTransactionSigned),
    };

    const saleId = await offerToken(
      {...saleData, 
        tokenId: tokenId,
        chainId: chainId as ChainId,
        timeout: new PactNumber(Math.floor(new Date().getTime()/1000) + (saleData.timeout ?? 0) * 24 * 60 * 60).toPactInteger(),
        amount:  new PactNumber(Number(saleData.amount)).toPactDecimal(),
        seller: {
          account: account.webauthnAccount.account,
          keyset: account.webauthnAccount.guard
        },
        capabilities: generateSpireKeyGasCapability(account.account.accountName),
        meta: {senderAccount: account.account.accountName}
      },
      {
        ...saleConfig,
        defaults: { networkId: saleConfig.networkId, meta: { chainId: saleConfig.chainId } },
      }
    ).execute();
  }

  const isSaleValid = () => {
    if (!saleData.saleType) return false;
    if (saleData.saleType === "none") {
      if (saleData.price <= 0) return false;
      if (saleData.timeout <= 0) return false;
    } else {
      return false
    }
    return true;
  }

  const onSaleDataChange = (key: string, value: string | number) => {
    setSaleData({ ...saleData, [key]: value })
  }

  const onSaleTypeChange = (key: string | number) => {
    const saleType = key.toString();
    const timeout = saleType === "none" ? 7 : 0;
    setSaleData({ ...saleData, saleType, timeout })
  }
  
  return (
    <div>
      <Stack flex={1} flexDirection="column" className={styles.container}>
        <CrudCard
          headingSize="h3"
          titleIcon={<MonoSelectAll />}
          title="Create Sale"
          description={[
            "Token ID: " + tokenId,
            "Token Name: " + tokenMetadata?.name,
            "Token Description: " + tokenMetadata?.description,
            "Resides on Chain: " + chainId,
          ]}
        >
          <div>
            <img
              src={tokenImageUrl}
              alt="Token Image"
              className={styles.tokenImageClass}
            />
          </div>
          <Button
            startVisual={<MonoViewInAr />}
            variant="outlined"
            style={{ marginBottom: '50px' }}
          >
            Explore NFT Details
          </Button>
          </CrudCard>
        </Stack>
        <Stack flex={1} flexDirection="column" className={styles.secondContainer}>
          <Tabs>
            <TabItem title="General Info">
              <CrudCard title="Token Information" description={[]}>
                <></>
              </CrudCard>
            </TabItem>
            <TabItem title="Sale">
              <CrudCard title="Make a Sale" description={[]}>
                <div className={styles.formContainer}>
                  <Select onSelectionChange={onSaleTypeChange} label="Select a sale contract">
                    <SelectItem key="none">None</SelectItem>
                    <SelectItem key="conventional">Conventional Auction</SelectItem>
                    <SelectItem key="dutch">Dutch Auction</SelectItem>
                  </Select>
                    <NumberField value={saleData.amount} onValueChange={(value:number) => {onSaleDataChange('amount', value)}} label="Amount" minValue={0.1} placeholder="Set the amount to sell" startVisual={<KRoundedFilledKdacolorBlack />} />
                  <NumberField value={saleData.price} onValueChange={(value:number) => {onSaleDataChange('price', value)}}label="Price" minValue={0.1} placeholder="Set the token price in KDA" />
                  <NumberField value={saleData.timeout} onValueChange={(value:number) => {onSaleDataChange('timeout', value)}} label="Timeout" minValue={1} startVisual={<MonoAccessTime />} description="Set the minumum amount of days that the sale will be valid" />
                </div>
              </CrudCard>
              </TabItem>
          </Tabs>
          {saleData.saleType === "conventional" && (
          <CrudCard
            title="Conventional Auction"
            description={[
              "Allow bidding on the token up untill a certain time",
              "The highest bidder at the end of the auction wins the token",
              "The seller can choose to set a reserve price",
            ]}
          >
            <div>
              <p>Form to setup conventional auction</p>
            </div>
          </CrudCard>)}
        {saleData.saleType === "dutch" && (
          <CrudCard
            title="Dutch Auction"
            description={[
              "The price of the token is set high and decreases over time",
              "The first bidder to accept the price wins the token",
              "The seller can choose to set a start and reserve price"
            ]}
          >
            <div>
              <p>Form to setup dutch auction</p>
            </div>
          </CrudCard>)}
        
      </Stack>
      <Stack className={styles.buttonRowContainer}>
        <Button variant="outlined" onPress={onCancelPress}>
          Cancel
        </Button>
        <Button onPress={onCreateSalePress} isDisabled={!isSaleValid()}>
          Create Sale
        </Button>
      </Stack>
    </div>
  );
}
