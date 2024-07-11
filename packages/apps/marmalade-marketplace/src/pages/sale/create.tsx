import { useEffect, useState } from "react";
import { ChainId } from '@kadena/client';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { Stack, Select, SelectItem, Button, NumberField } from "@kadena/kode-ui";
import { MonoAutoFixHigh, MonoAccountBalanceWallet, MonoAccessTime } from '@kadena/kode-icons';
import CrudCard from '@/components/CrudCard';
import { TokenMetadata } from "@/components/Token";
import { useAccount } from '@/hooks/account';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { CreateSaleInput, createSale } from "@/utils/createSale";
import { env } from '@/utils/env';
import { useSearchParams, useRouter } from 'next/navigation';
import * as styles from '@/styles/create-sale.css';

export default function CreateSale() {
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [chainId, setChainId] = useState<ChainId | null>(null);
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>();
  const [saleData, setSaleData] = useState<CreateSaleInput>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    const tokenIdParam = searchParams.get('tokenid');
    const chainIdParam = searchParams.get('chainid');
    if (tokenIdParam && chainIdParam) {
      setTokenId(tokenIdParam);
      setChainId(chainIdParam as ChainId);
      setSaleData({ tokenId: tokenIdParam, chainId: chainIdParam as ChainId });
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetch() {
      if (!tokenId || !chainId) return;
      try {
        const tokenInfo = await getTokenInfo({
          tokenId,
          chainId,
          networkId: env.NETWORK_NAME,
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

  const onCreateSalePress = async () => {
    // Create the sale
    console.log(saleData)
    saleData.account = account?.account?.accountName;
    saleData.key = account?.account?.credentials[0].publicKey
    const saleId = await createSale(saleData);
  }

  const isSaleValid = () => {
    if (!saleData.saleType) return false;

    if (saleData.saleType === "none") {
      if (!saleData.price) return false;
      if (!saleData.timeout) return false;
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
        titleIcon={<MonoAutoFixHigh />}
        title="Create Sale"
        description={[
          "Create a new sale for your token",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"
        ]}
      >
        <div>
          <img
            src={tokenImageUrl}
            alt="Token Image"
            className={styles.tokenImageClass}
          />
          <div className={styles.propertyContainer}>
            <div className={styles.propertyLabel}>Token ID:</div>
            <div className={styles.propertyValue}>{tokenId}</div>
          </div>
          <div className={styles.propertyContainer}>
            <div className={styles.propertyLabel}>Name:</div>
            <div className={styles.propertyValue}>{tokenMetadata?.name}</div>
          </div>
          <div className={styles.propertyContainer}>
            <div className={styles.propertyLabel}>Description:</div>
            <div className={styles.propertyValue}>{tokenMetadata?.description}</div>
          </div>
          <div className={styles.propertyContainer}>
            <div className={styles.propertyLabel}>Resides on Chain:</div>
            <div className={styles.propertyValue}>{chainId}</div>
          </div>
        </div>
      </CrudCard>
      <CrudCard
        title="Sale Contract"
        description={["Select the contract to use for the sale or select none and offer the token up for sale for a fixed price"]}
      >
        <div>
          <Select onSelectionChange={onSaleTypeChange} label="Select a sale contract">
            <SelectItem key="none">None</SelectItem>
            <SelectItem key="conventional">Conventional Auction</SelectItem>
            <SelectItem key="dutch">Dutch Auction</SelectItem>
          </Select>
        </div>
      </CrudCard>
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
      {saleData.saleType === "none" && (
        <CrudCard
          title="Offer token"
          description={[
            "Offer the token up for sale for a fixed price",
            "The first buyer to accept the price wins the token",
            ""
          ]}
        >
          <div className={styles.offerContainer}>
            <NumberField value={saleData.price} onChange={(e) => onSaleDataChange('price', parseInt(e.target.value))} label="Price" minValue={0.1} placeholder="Set the token price in KDA" startVisual={<MonoAccountBalanceWallet />} />
            <NumberField value={saleData.timeout} onChange={(e) => onSaleDataChange('timeout', parseInt(e.target.value))} label="Timeout" minValue={1} startVisual={<MonoAccessTime />} description="Set the minumum amount of days that the sale will be valid" />
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
