import { useEffect, useState } from "react";
import { ChainId, parseAsPactValue } from '@kadena/client';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { Stack, Select, SelectItem, Button, NumberField, Tabs, TabItem, Text } from "@kadena/kode-ui";
import { MonoAccessTime, MonoSelectAll, MonoViewInAr} from '@kadena/kode-icons';
import { KRoundedFilledKdacolorBlack  } from '@kadena/kode-icons/brand';
import CrudCard from '@/components/CrudCard';
import LabeledText from "@/components/LabeledText";
import { TokenMetadata } from "@/components/Token";
import Bid from "@/components/Bid"
import { useAccount } from '@/hooks/account';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { env } from '@/utils/env';
import { useTransaction } from '@/hooks/transaction';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { generateSpireKeyGasCapability, checkConcretePolicies, Policy, isPrecise } from '@/utils/helper';
import { getTimestampFromDays } from '@/utils/date';
import { offerToken , ISaleTokenPolicyConfig} from '@kadena/client-utils/marmalade';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import * as styles from '@/styles/create-sale.css';

export default function CreateSale() {
  const [tokenId, setTokenId] = useState<string>("");
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo | null>();
  const [chainId, setChainId] = useState<ChainId | null>(null);
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [tokenPrecision, setTokenPrecision] = useState<number>(0);
  const [saleData, setSaleData] = useState<CreateSaleInput>({ saleType: "none", price: 0.1, amount: 1, timeout: 7 });
  const [policyConfig, setPolicyConfig] = useState<ISaleTokenPolicyConfig>({});
  const searchParams = useSearchParams();
  const params = useParams();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const account = useAccount();
  const [saleInputValid, setSaleInputValid] = useState<saleValid>({timeout:true, saleType: true, price: true, amount: true})

  interface CreateSaleInput {
  tokenId?: string;
  chainId?: ChainId;
  saleType?: string;
  price: number;
  timeout: number;
  account?: IAccountContext;
  amount?: number;
}

interface saleValid {
  [key: string]: boolean;  
  price: boolean;
  saleType: boolean;
  amount: boolean;
  timeout: boolean;
}


interface ITokenInfo {
  id: string 
  policies: Policy[];
  precision : {int: string}
  supply: number 
  uri: string
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
        const tokenInfo:ITokenInfo = await getTokenInfo({
          tokenId,
          chainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        }) as ITokenInfo
        setTokenInfo(tokenInfo);
        setTokenPrecision(Number(tokenInfo.precision.int))
        setPolicyConfig(checkConcretePolicies(tokenInfo.policies));
        const metadata = await getTokenMetadata(tokenInfo.uri);
        console.log(tokenInfo)
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
      sign: createSignWithSpireKeySDK([account.account], onTransactionSigned),
    };

    await offerToken(
      {...saleData, 
        auction:  {
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
          } ,
          price: new PactNumber(saleData.price).toPactDecimal(),
          sellerFungibleAccount: {
            account: account.account.accountName, 
            keyset:  account.accountGuard as object
          }
      }, 
        policyConfig: {...policyConfig, auction: true},
        tokenId: tokenId,
        chainId: chainId as ChainId,
        timeout: getTimestampFromDays(saleData.timeout),
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

  const onSaleDataValidChange = (key: string, value: string | number) => {
    // saletype 
    if (key === 'saleType') {
      if (value === "none") {
        setSaleInputValid({...saleInputValid, [key]: true});
      } else setSaleInputValid({...saleInputValid, [key]: false});
    }
    else if (key === 'price') {
    // validate precision of the fungible 
      if (Number(value) <= 0) setSaleInputValid({...saleInputValid, price: false});
      else setSaleInputValid({...saleInputValid, price: true});
    }
    else if (key === 'timeout') {
      // allow 0 for no timeout 
      if (Number(value) <= 0 || !isPrecise(Number(value), 0)) setSaleInputValid({...saleInputValid, timeout: false});
      else setSaleInputValid({...saleInputValid, timeout: true});
    }

    else if (key === 'amount') {
      //does token owner own enough ? 
      if (Number(value) <= 0 || !isPrecise(Number(value), tokenPrecision)) setSaleInputValid({...saleInputValid, amount: false});
      else setSaleInputValid({...saleInputValid, amount: true});
    }
    return true;
  }
  
  const isSaleValid = (): boolean => {
    for (const key in saleInputValid) {
      if (saleInputValid[key]) continue;
      else return false;
    }
    return true;
  };

  const onSaleDataChange = (key: string, value: string | number) => {
    onSaleDataValidChange(key, value)
    setSaleData({ ...saleData, [key]: value })
  }

  const onSaleTypeChange = (key: string | number) => {
    onSaleDataChange("saleType", key)
    // const saleType = key.toString();
    // const timeout = saleType === "none" ? 7 : 0;
    // setSaleData({ ...saleData, saleType, timeout })
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
            "Token Supply: " + tokenInfo?.supply,
            "Token Precision: " + tokenInfo?.precision,
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
              <div className={styles.flexContainer}>
                <div>
                  <LabeledText label={`Token ID`} value={tokenId}/>
                  <LabeledText label={`Precision`} value={tokenInfo?.precision?.int}/>
                </div>
                <div>
                  <LabeledText label={`Token Name`} value={tokenMetadata?.name}/>
                  <LabeledText label={`supply`} value={tokenInfo?.supply}/>
                </div>
              </div>
            </TabItem>
            <TabItem title="Sale">
              <CrudCard title="Make a Sale" description={[]}>
                <div className={styles.formContainer}>
                  <Select onSelectionChange={onSaleTypeChange} isInvalid={!saleInputValid.saleType} errorMessage={"Auction not supported"} label="Select a sale contract">
                    <SelectItem key="none">None</SelectItem>
                    <SelectItem key="conventional">Conventional Auction</SelectItem>
                    <SelectItem key="dutch">Dutch Auction</SelectItem>
                  </Select>
                  <NumberField value={saleData.amount} onValueChange={(value:number) => {onSaleDataChange('amount', value)}} label="Amount" minValue={1} placeholder="Set the amount to sell" variant={saleInputValid.amount ? "default" : "negative"} errorMessage={"Check Precision"}/>
                  <NumberField value={saleData.price} onValueChange={(value:number) => {onSaleDataChange('price', value)}}label="Price" minValue={0.1} placeholder="Set the token price in KDA"  variant={saleInputValid.price ? "default" : "negative"}/>
                  <NumberField value={saleData.timeout} onValueChange={(value:number) => {onSaleDataChange('timeout', value)}} label="Timeout" minValue={1} info="Set valid sale days" variant={saleInputValid.timeout ? "default" : "negative"} />
                </div>
              </CrudCard>
              </TabItem>
              <TabItem title="Bid">
              <CrudCard title="Make a Bid" description={[
                `There are 3 sale types: regular, conventional, dutch auction`,
                `You can view and bid on the offers here`
              ]}>
              <Bid saleId={"IFcWHmDyWQ85UqMHWaNuBxZJlPXx1R2Sx-XSHFmS-L0"} chainId={'8'}/>
              </CrudCard>
              </TabItem>
          </Tabs>
          {/* {saleData.saleType === "conventional" && ( */}
        {false && (
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
        {/* {saleData.saleType === "dutch" && ( */}
        {false && (
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
