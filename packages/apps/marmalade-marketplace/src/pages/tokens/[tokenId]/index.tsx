import { Pact } from '@kadena/client';

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { ChainId, parseAsPactValue } from '@kadena/client';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { offerToken , ISaleTokenPolicyConfig, getAccountDetails } from '@kadena/client-utils/marmalade';
import { PactNumber } from '@kadena/pactjs';
import { Stack, Button, NumberField, Tabs, TabItem, Checkbox, RadioGroup, Radio } from "@kadena/kode-ui";
import { MonoSelectAll, MonoViewInAr, MonoIosShare} from '@kadena/kode-icons';
import CrudCard from '@/components/CrudCard';
import LabeledText from "@/components/LabeledText";
import { getSale } from '@/hooks/getSale';
import { TokenMetadata } from "@/components/Token";
import { RegularSale } from "@/components/Sale/RegularSale";
import Bid from "@/components/Bid"
import { useAccount } from '@/hooks/account';
import { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { useTransaction } from '@/hooks/transaction';
import { env } from '@/utils/env';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { generateSpireKeyGasCapability, checkConcretePolicies, Policy, isPrecise } from '@/utils/helper';
import { getTimestampFromDays } from '@/utils/date';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';

//styles 
import * as styles from '../../../styles/token-details.css';

export default function CreateSale() {
  const params = useParams();
  const { setTransaction } = useTransaction();
  const router = useRouter();
  const account = useAccount();
  const [balance, setBalance] = useState<number>(0);  
  const [tokenId, setTokenId] = useState<string>("");
  const [saleId, setSaleId] = useState<string| null>(null);
  const [chainId, setChainId] = useState<string>("");
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo | null>();
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [tokenPrecision, setTokenPrecision] = useState<number>(0);
  const [saleData, setSaleData] = useState<CreateSaleInput>({ saleType: "none", price: 0.1, amount: 1, timeout: 7 });
  const [policyConfig, setPolicyConfig] = useState<ISaleTokenPolicyConfig>({});
  const searchParams = useSearchParams();
  const [saleInputValid, setSaleInputValid] = useState<saleValid>({timeout:true, saleType: true, price: true, amount: true})
  const [selectedKey, setSelectedKey] = useState(saleId ? "bid" : "info");

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
  
  const { data } = getSale(saleId as string);
  
  useEffect(() => {
    const tokenIdParam = params?.["tokenId"];
    const chainIdParam = searchParams.get("chainId");
    const saleIdParam = searchParams.get("saleId");

    if (typeof tokenIdParam === "string") {
      setTokenId(tokenIdParam);
    }

    if (typeof chainIdParam === "string") {
      setChainId(chainIdParam);
    }

    if (typeof saleIdParam === "string") {
      setSaleId(saleIdParam);
    }    

    setSaleData({ ...saleData, tokenId, chainId: chainId as ChainId});
    
  }, [searchParams]);

  useEffect(() => {
    async function fetch() {
      if (tokenId === "" || !chainId) return;
      try {
        const tokenInfo:ITokenInfo = await getTokenInfo({
          tokenId,
          chainId: chainId as ChainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        }) as ITokenInfo;

        // if token info is not valid, redirect to the home 
        console.log(tokenInfo)

        setTokenInfo(tokenInfo);
        setTokenPrecision(Number(tokenInfo.precision.int))
        setPolicyConfig(checkConcretePolicies(tokenInfo.policies));
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


  useEffect(() => {
    async function fetch() {
      if (!account?.webauthnAccount?.account) return;
      try {
        const details: {balance?: number} = await getAccountDetails({
          chainId: chainId as ChainId,
          accountName: account.webauthnAccount?.account as string, 
          tokenId: tokenId as string,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        });
        if (details.balance) setBalance(details.balance)
      } catch(e){
        console.log("error fetching account", e)
      }
    } 
    fetch();
    }, [account])

  const onCancelPress = () => {
    router.back();
  }

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}`);
  }

  const onCreateSalePress = async () => {
    if (
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
            keyset:  account.account.guard as object
          }
      }, 
        policyConfig: {...policyConfig, auction: true},
        tokenId: tokenId,
        chainId: chainId as ChainId,
        timeout: getTimestampFromDays(saleData.timeout),
        amount:  new PactNumber(Number(saleData.amount)).toPactDecimal(),
        seller: {
          account: account.account.accountName,
          keyset: account.account.guard as object
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
      if (Number(value) > balance || Number(value) <= 0 || !isPrecise(Number(value), tokenPrecision)) setSaleInputValid({...saleInputValid, amount: false});
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
  }

  const handleTabChange = (key:any) => {
    setSelectedKey(key);
  };

  return (
    <div>
      <Stack flex={1} flexDirection="column" className={styles.container}>
        <CrudCard
          headingSize="h3"
          titleIcon={<MonoSelectAll />}
          title="Token Info"
          description={[
            "Token Name: " + tokenMetadata?.name,
            "Token Description: " + tokenMetadata?.description,
            "Resides on Chain " + chainId,            
          ]}
        >
          <div>
            <img
              src={tokenImageUrl}
              alt="Token Image"
              className={styles.tokenImageClass}
            />
          </div>
          <div className={styles.shareContainer}>
            <Button
              onClick={() => {
                const url = tokenInfo?.uri ? getTokenImageUrl(tokenInfo.uri) : '';
                if (url) window.open(url, '_blank');
              }}
              startVisual={<MonoViewInAr />}
              variant="outlined"
              style={{ marginBottom: '50px' }}
            >
              Explore NFT Details
            </Button>
            <Button
              onClick={async () => {
                if (navigator?.share) {
                  await navigator.share(({ title: "Token", url: "" }));
                } 
              }}
              startVisual={<MonoIosShare />}
              variant="outlined"
              style={{ marginBottom: '50px' }}
            />
          </div>
          </CrudCard>
        </Stack>
        <Stack flex={1} flexDirection="column" className={styles.secondContainer}>
          <Tabs className={styles.tabContainer} inverse={true} selectedKey={selectedKey} onSelectionChange={handleTabChange} 
           >
            <TabItem title="General Info" key="info">
              <div className={styles.flexContainer}>
                <div className={styles.flexItem}>
                  <LabeledText label={`Name`} value={tokenMetadata?.name!}/>
                  <LabeledText label={`ID`} value={tokenId}/>
                </div>
                <div className={styles.flexItem}>
                  <LabeledText label={`Precision`} value={tokenInfo?.precision?.int!}/>
                  <LabeledText label={`Supply`} value={tokenInfo?.supply!}/>
                </div>
              </div>
            </TabItem>
            <TabItem title="Policies" key="policies">
              {tokenInfo?.policies ? checkConcretePolicies(tokenInfo.policies) && (
              <CrudCard
                title="Token Policy Information"
                description={[
                  "Displays the token policy information",
                ]}>
                <div className={styles.checkboxRow}>
                  <Checkbox isReadOnly={true} id="nonUpdatableURI" isSelected={checkConcretePolicies(tokenInfo.policies).nonUpdatableURI}>Non-Updatable URI</Checkbox>
                  <Checkbox isReadOnly={true} id="guarded"  isSelected={checkConcretePolicies(tokenInfo.policies)?.guarded}>Guarded</Checkbox>
                </div>
                <div className={styles.checkboxRow}>
                  <Checkbox isReadOnly={true} id="nonFungible" isSelected={checkConcretePolicies(tokenInfo.policies)?.nonFungible}>Non Fungible</Checkbox>
                  <Checkbox isReadOnly={true} id="hasRoyalty" isSelected={checkConcretePolicies(tokenInfo.policies)?.hasRoyalty}>Has Royalty</Checkbox>
                </div>
                <div className={styles.checkboxRow}>
                  <Checkbox isReadOnly={true} id="collection" isSelected={checkConcretePolicies(tokenInfo.policies)?.collection}>Collection</Checkbox>
                </div> 
              </CrudCard>
              ) : <></>}
            </TabItem>
            <TabItem title="Sale" key="sale">
              {/* Disable sale when user doesn't own token*/}
              <CrudCard title="Make a Sale" description={[]}>
                <div className={styles.formContainer}>
                  <RadioGroup label='Auction Type' direction="row" onChange={onSaleTypeChange} isInvalid={!saleInputValid.saleType} errorMessage={"Auction not supported"} > 
                    <Radio value="none" >None</Radio>
                    <Radio value="conventional">Conventional</Radio>
                    <Radio value="dutch">Dutch</Radio>
                  </RadioGroup>
                  <NumberField value={saleData.amount} onValueChange={(value:number) => {onSaleDataChange('amount', value)}} label="Amount" minValue={1} placeholder="Set the amount to sell" variant={saleInputValid.amount ? "default" : "negative"} errorMessage={"Check Precision"}/>
                  <NumberField value={saleData.price} onValueChange={(value:number) => {onSaleDataChange('price', value)}}label="Price" minValue={0.1} placeholder="Set the token price in KDA"  variant={saleInputValid.price ? "default" : "negative"}/>
                  <NumberField value={saleData.timeout} onValueChange={(value:number) => {onSaleDataChange('timeout', value)}} label="Timeout" minValue={1} info="Set valid sale days" variant={saleInputValid.timeout ? "default" : "negative"} />
                </div>
              </CrudCard>
            </TabItem>
            {/* only show bid tab if saleId is present*/}
            <TabItem title="Buy" key="bid">
              <CrudCard title="Buy token" description={[
                `There are 3 sale types: regular, conventional, dutch auction`,
                `You can view and bid on the offers here`
              ]}>
                <Bid saleId={saleId!} chainId={chainId}/>
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
        {selectedKey === "sale" ? (
        <Button onPress={onCreateSalePress} isDisabled={!isSaleValid()}>
          Create Sale
        </Button>
      ) : selectedKey === "bid" ? (
        <RegularSale
          tokenImageUrl={tokenImageUrl}
          sale={data!}
        />
      ) : null}
      </Stack>
    </div>
  );
}
