import Bid from '@/components/Bid';
import { CreateSale } from '@/components/CreateSale/CreateSale';
import LabeledText from '@/components/LabeledText';
import { TokenMetadata } from '@/components/Token';
import { useAccount } from '@/hooks/account';
import { env } from '@/utils/env';
import { Policy, checkConcretePolicies } from '@/utils/helper';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { ChainId } from '@kadena/client';
import {
  ISaleTokenPolicyConfig,
  getAccountDetails,
  getTokenInfo,
} from '@kadena/client-utils/marmalade';
import { MonoIosShare, MonoSelectAll, MonoViewInAr } from '@kadena/kode-icons';
import {
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Stack,
  TabItem,
  Tabs,
  Text,
} from '@kadena/kode-ui';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

//styles
import { Sale } from '@/hooks/getSales';
import { layoutClass } from '@/styles/layout.css';
import { database } from '@/utils/firebase';
import {
  CardContentBlock,
  CardFixedContainer,
  CardFooterGroup,
} from '@kadena/kode-ui/patterns';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as styles from '../../../styles/token.css';

interface ITokenInfo {
  id: string;
  policies: Policy[];
  precision: { int: string };
  supply: number;
  uri: string;
}

const TokenComponent = () => {
  const params = useParams();
  const account = useAccount();
  const [balance, setBalance] = useState<number>(0);
  const [tokenId, setTokenId] = useState<string>('');
  const [saleId, setSaleId] = useState<string | null>(null);
  const [saleData, setSaleData] = useState<Sale | null>(null);
  const [chainId, setChainId] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo | null>();
  const [tokenImageUrl, setTokenImageUrl] = useState<string>('/no-image.webp');
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [tokenPrecision, setTokenPrecision] = useState<number>(0);

  const [policyConfig, setPolicyConfig] = useState<ISaleTokenPolicyConfig>({});
  const searchParams = useSearchParams();

  const [selectedKey, setSelectedKey] = useState(saleId ? 'bid' : 'info');

  const fetchOnSaleTokens = async (tokenId?: string) => {
    if (tokenId) {
      //const querySnapshot = await getDocs(query(collection(database, 'sales')));
      const salesRef = collection(database, 'sales');
      const q = query(salesRef, where('tokenId', '==', tokenId));
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot);
      const docs: Sale[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as Sale);
      });

      console.log(docs[0]);
      if (docs.length) {
        setSaleData(docs[0]);
      }
    }
  };

  useEffect(() => {
    if (!tokenId) return;
    fetchOnSaleTokens(tokenId);
  }, [tokenId]);

  useEffect(() => {
    async function fetch() {
      if (tokenId === '' || !chainId) return;
      try {
        const tokenInfo: ITokenInfo = (await getTokenInfo({
          tokenId,
          chainId: chainId as ChainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST,
        })) as ITokenInfo;

        // if token info is not valid, redirect to the home
        setTokenInfo(tokenInfo);
        setTokenPrecision(Number(tokenInfo.precision.int));
        setPolicyConfig(checkConcretePolicies(tokenInfo.policies));
        const metadata = await getTokenMetadata(tokenInfo.uri);

        setTokenMetadata(metadata);

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
    fetch();
  }, [tokenId]);

  useEffect(() => {
    if (chainId === '') return;
    async function fetch() {
      if (!account.account?.accountName) return;
      try {
        const details: { balance?: number } = await getAccountDetails({
          chainId: chainId as ChainId,
          accountName: account.account?.accountName as string,
          tokenId: tokenId as string,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST,
        });

        if (details.balance) setBalance(details.balance);
      } catch (e) {
        console.log('error fetching account', e);
      }
    }
    fetch();
  }, [account, chainId]);

  const handleTabChange = (key: any) => {
    setSelectedKey(key);
  };

  useEffect(() => {
    const tokenIdParam = params?.tokenId;
    const chainIdParam = searchParams.get('chainId');
    const saleIdParam = searchParams.get('saleId');

    if (typeof tokenIdParam === 'string') {
      setTokenId(tokenIdParam);
    }

    if (typeof chainIdParam === 'string') {
      setChainId(chainIdParam);
    }

    if (typeof saleIdParam === 'string') {
      setSaleId(saleIdParam);
    }
  }, [searchParams]);

  return (
    <Stack width="100%" className={layoutClass}>
      <CardFixedContainer>
        <CardContentBlock
          visual={<MonoSelectAll width={36} height={36} />}
          title="Token Info"
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>Token Name: {tokenMetadata?.name}</Text>
              <Text>Token Description: {tokenMetadata?.description}</Text>
              <Text>Resides on Chain: {chainId}</Text>
            </Stack>
          }
          extendedContent={
            <img
              src={tokenImageUrl}
              alt="Token Image"
              className={styles.tokenImageClass}
            />
          }
        ></CardContentBlock>

        <CardFooterGroup>
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
            style={{ width: '40px' }}
            onClick={async () => {
              if (navigator?.share) {
                await navigator.share({ title: 'Token', url: '' });
              }
            }}
            startVisual={<MonoIosShare />}
            variant="outlined"
          />
        </CardFooterGroup>
      </CardFixedContainer>

      <Stack
        flex={1}
        flexDirection="column"
        className={styles.secondContainer}
        width="100%"
      >
        <Tabs
          isContained
          inverse={false}
          selectedKey={selectedKey}
          onSelectionChange={handleTabChange}
        >
          <TabItem title="General Info" key="info">
            <Stack className={styles.flexContainer}>
              <div className={styles.flexItem}>
                <LabeledText label={`ID`} value={tokenId!} />
                <LabeledText label={`Name`} value={tokenMetadata?.name!} />
              </div>
              <div className={styles.flexItem}>
                <LabeledText
                  label={`Precision`}
                  value={tokenInfo?.precision?.int!}
                />
                <LabeledText label={`Supply`} value={tokenInfo?.supply!} />
              </div>
            </Stack>
          </TabItem>
          <TabItem title="Sale" key="sale">
            <Stack className={styles.flexContainer}>
              <CreateSale
                balance={balance}
                tokenPrecision={tokenPrecision}
                account={account}
                policyConfig={policyConfig}
                saleId={saleData?.saleId!}
              />
            </Stack>
          </TabItem>
          {/* only show bid tab if saleId is present*/}

          <TabItem title="Buy" key="bid">
            <Stack className={styles.flexContainer}>
              <Bid saleId={saleData?.saleId!} tokenImageUrl={tokenImageUrl} />
            </Stack>
          </TabItem>

          <TabItem title="Configuration" key="policies">
            {tokenInfo?.policies ? (
              checkConcretePolicies(tokenInfo.policies) && (
                <Stack className={styles.flexContainer}>
                  <CardContentBlock
                    title="Token Policies"
                    supportingContent={
                      <Stack flexDirection="column" width="100%" gap="md">
                        <Text>
                          Token Policies define the behaviors of the token.
                        </Text>
                        <Text>
                          Policies are set by the token creator at creation
                          time, and cannot be altered after creation.
                        </Text>
                      </Stack>
                    }
                  >
                    <CheckboxGroup label="Policies" direction="column">
                      <Checkbox
                        isReadOnly={true}
                        id="nonUpdatableURI"
                        value="nonUpdatableURI"
                        isSelected={
                          checkConcretePolicies(tokenInfo.policies)
                            .nonUpdatableURI
                        }
                      >
                        Non-Updatable URI
                      </Checkbox>
                      <Checkbox
                        isReadOnly={true}
                        id="guarded"
                        value="guarded"
                        isSelected={
                          checkConcretePolicies(tokenInfo.policies)?.guarded
                        }
                      >
                        Guarded
                      </Checkbox>
                      <Checkbox
                        isReadOnly={true}
                        id="nonFungible"
                        value="nonFungible"
                        isSelected={
                          checkConcretePolicies(tokenInfo.policies)?.nonFungible
                        }
                      >
                        Non Fungible
                      </Checkbox>
                      <Checkbox
                        isReadOnly={true}
                        id="hasRoyalty"
                        value="hasRoyalty"
                        isSelected={
                          checkConcretePolicies(tokenInfo.policies)?.hasRoyalty
                        }
                      >
                        Has Royalty
                      </Checkbox>
                      <Checkbox
                        isReadOnly={true}
                        id="collection"
                        isSelected={
                          checkConcretePolicies(tokenInfo.policies)?.collection
                        }
                      >
                        Collection
                      </Checkbox>
                    </CheckboxGroup>
                  </CardContentBlock>
                </Stack>
              )
            ) : (
              <></>
            )}
          </TabItem>
        </Tabs>
        {/* {saleData.saleType === "conventional" && ( */}
        {false && (
          <Card>
            <CardContentBlock
              title="Conventional Auction"
              supportingContent={
                <Stack flexDirection="column" width="100%" gap="md">
                  <Text>
                    Allow bidding on the token up untill a certain time
                  </Text>
                  <Text>
                    The highest bidder at the end of the auction wins the token
                  </Text>
                  <Text>The seller can choose to set a reserve price</Text>
                </Stack>
              }
            >
              <Text>Form to setup conventional auction</Text>
            </CardContentBlock>
          </Card>
        )}
        {/* {saleData.saleType === "dutch" && ( */}
        {false && (
          <Card>
            <CardContentBlock
              title="Dutch Auction"
              supportingContent={
                <Stack flexDirection="column" width="100%" gap="md">
                  <Text>
                    The price of the token is set high and decreases over time
                  </Text>
                  <Text>
                    The first bidder to accept the price wins the token
                  </Text>
                  <Text>
                    The seller can choose to set a start and reserve price
                  </Text>
                </Stack>
              }
            >
              <Text>Form to setup dutch auction</Text>
            </CardContentBlock>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};

export default TokenComponent;
