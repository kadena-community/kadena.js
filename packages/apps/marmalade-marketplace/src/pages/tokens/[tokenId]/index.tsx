import { Pact } from '@kadena/client';

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { ChainId, parseAsPactValue } from '@kadena/client';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import type { Guard } from '@kadena/client-utils/marmalade';
import { offerToken , ISaleTokenPolicyConfig, getAccountDetails } from '@kadena/client-utils/marmalade';
import { PactNumber } from '@kadena/pactjs';
import { Stack, Button, NumberField, Tabs, TabItem, Checkbox, RadioGroup, Radio, Text } from "@kadena/kode-ui";
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
import * as styles from './style.css';

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

    setSaleData({ ...saleData});

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
    if (chainId === '') return;
    async function fetch() {
      if (!account.account?.accountName) return;
      try {
        const details: {balance?: number} = await getAccountDetails({
          chainId: chainId as ChainId,
          accountName: account.account?.accountName as string, 
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
    }, [account, chainId])

  const onCancelPress = () => {
    router.back();
  }

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens/${tokenId}?chainId=${'8'}`);
  }

  const onCreateSalePress = async () => {
    console.log(      
      account.account,
      saleData.timeout,
      saleData.amount)
    if (
      !account.account ||
      !saleData.timeout ||
      !saleData.amount
    ) throw new Error("Not all required fields are provided");
    
    const saleConfig = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: chainId as ChainId,
      sign: createSignWithSpireKeySDK([account.account], onTransactionSigned),
    };

    await offerToken(
      { ...saleData, 
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
            guard:  account.account.guard as Guard
          }
      }, 
        policyConfig: {...policyConfig, auction: true},
        tokenId: tokenId,
        chainId: chainId as ChainId,
        timeout: getTimestampFromDays(saleData.timeout),
        amount:  new PactNumber(Number(saleData.amount)).toPactDecimal(),
        signerPublicKey: account.account?.devices[0].guard.keys[0],
        seller: {
          account: account.account.accountName,
          guard: account.account.guard as Guard
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
    if (!saleId && key === "bid") return;
    if (balance === 0 && key === "sale") return;
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
            >
              Explore NFT Details
            </Button>
            <Button
              style={{width: '40px'}} 
              onClick={async () => {
                if (navigator?.share) {
                  await navigator.share(({ title: "Token", url: "" }));
                } 
              }}
              startVisual={<MonoIosShare />}
              variant="outlined"
            />
          </div>
          </CrudCard>
        </Stack>
        <Stack flex={1} flexDirection="column" className={styles.secondContainer}>
          <Tabs className={styles.tabsContainer} tabPanelClassName={styles.tabContainer} isContained={true} inverse={false} selectedKey={selectedKey} onSelectionChange={handleTabChange} >
            <TabItem title="General Info" key="info"> 
              <div className={styles.flexContainer}>
                <div className={styles.flexItem}>
                  <LabeledText label={`ID`} value={tokenId!}/>
                  <LabeledText label={`Name`} value={tokenMetadata?.name!}/>
                </div>
                <div className={styles.flexItem}>
                  <LabeledText label={`Precision`} value={tokenInfo?.precision?.int!}/>
                  <LabeledText label={`Supply`} value={tokenInfo?.supply!}/>
                </div>
              </div>
            </TabItem>
            <TabItem title="Sale" key="sale">
              {/* Disable sale when user doesn't own token*/}
              <CrudCard title="Create a Sale" description={[
                  `You can select the amount of tokens you want to sell and set the price for each token.`,
                  `You must also set the timeout of the sale, which refers to the time the sale will be active and will not be withdrawn.`,
                  `Marmalade supports two types of auctions: Conventional and Dutch.`, 
                  `However, the app supports only regular sales without auction for now.`
                ]} >
                <Stack flex={1} flexDirection="column">
                  <div style={{ marginBottom: '8px'}}>
                    <br />
                    <div className={styles.labelTitle}>
                      <Text as="span" size='small' variant='ui'>{'Auction Type'}</Text>
                    </div>
                    <RadioGroup direction="row" onChange={onSaleTypeChange} isInvalid={!saleInputValid.saleType} errorMessage={"Auction not supported"} > 
                      <Radio value="conventional" >Conventional</Radio>
                      <Radio value="dutch">Dutch</Radio>
                      <Radio value="none" >None</Radio>
                    </RadioGroup>
                  </div>
                  <div className={styles.labelTitle}>
                    <Text as="span" size='small' variant='ui'>{'Amount'}</Text>
                  </div>                  
                  <NumberField value={saleData.amount} onValueChange={(value:number) => {onSaleDataChange('amount', value)}} minValue={1} placeholder="Set the amount to sell" variant={saleInputValid.amount ? "default" : "negative"} errorMessage={"Check Amount"}/>
                  <div className={styles.labelTitle}>
                    <Text as="span" size='small' variant='ui'>{'Price'}</Text>
                  </div>
                  <NumberField value={saleData.price} onValueChange={(value:number) => {onSaleDataChange('price', value)}} minValue={0.1} placeholder="Set the token price in KDA"  variant={saleInputValid.price ? "default" : "negative"}/>
                  <div className={styles.labelTitle}>
                    <Text as="span" size='small' variant='ui'>{'Timeout'}</Text>
                  </div>
                  <NumberField value={saleData.timeout} onValueChange={(value:number) => {onSaleDataChange('timeout', value)}} minValue={1} info="Set valid sale days" variant={saleInputValid.timeout ? "default" : "negative"} />
                </Stack>
              </CrudCard>
            </TabItem>
            {/* only show bid tab if saleId is present*/}
            <TabItem title="Buy" key="bid">
              <CrudCard title="Buy token" description={[
                `You can view and bid on the available offers here.`,
                `Clicking 'Buy Now' will transfer the fungible payment to the sale's escrow account and transfer the token to your account.`
              ]} >
                <Bid saleId={saleId!} chainId={chainId}/>
              </CrudCard>
            </TabItem>
            <TabItem title="Configuration" key="policies">
              {tokenInfo?.policies ? checkConcretePolicies(tokenInfo.policies) && (
              <CrudCard
                title="Token Policies"
                description={[
                  "Token Policies define the behaviors of the token.", 
                  "Policies are set by the token creator at creation time, and cannot be altered after creation.",
                ]}>
                  <Text as="span" size='small' variant='ui'>{'Policies'}</Text>
                <div className={styles.configContainer}>
                  <div className={styles.checkboxColumn}>
                    <Checkbox isReadOnly={true} id="nonUpdatableURI" isSelected={checkConcretePolicies(tokenInfo.policies).nonUpdatableURI}>Non-Updatable URI</Checkbox>
                    <Checkbox isReadOnly={true} id="guarded"  isSelected={checkConcretePolicies(tokenInfo.policies)?.guarded}>Guarded</Checkbox>
                    <Checkbox isReadOnly={true} id="nonFungible" isSelected={checkConcretePolicies(tokenInfo.policies)?.nonFungible}>Non Fungible</Checkbox>
                  </div>
                  <div className={styles.checkboxColumn}>
                    <Checkbox isReadOnly={true} id="hasRoyalty" isSelected={checkConcretePolicies(tokenInfo.policies)?.hasRoyalty}>Has Royalty</Checkbox>
                    <Checkbox isReadOnly={true} id="collection" isSelected={checkConcretePolicies(tokenInfo.policies)?.collection}>Collection</Checkbox>
                  </div> 
                </div>
              </CrudCard>
              ) : <></>}
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
