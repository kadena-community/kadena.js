import { Heading, Stack } from '@kadena/kode-ui';
import * as styles from "@/styles/sale.css"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TokenMetadata } from '@/components/Token';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { env } from '@/utils/env';
import { getQuoteInfo, getTokenInfo } from '@kadena/client-utils/marmalade';
import { ChainId } from '@kadena/client';
import { toTitleCase } from '@/utils/string';
import { ConventionalAuction } from '@/components/Sale/ConventionalAuction';
import { DutchAuction } from '@/components/Sale/DutchAuction';
import { RegularSale } from '@/components/Sale/RegularSale';
import { getSale } from '@/hooks/getSale';
import { QuoteInfo } from '@/pages/api/cron';

interface TokenInfo {
  uri: string;
  supply: string;
  id: string;
}

export default function Sale() {
  const params = useParams();

  const { data } = getSale(params?.["saleId"] as string);

  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo>();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>();
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");

  useEffect(() => {
    async function fetch() {
      if (!params?.saleId || !params?.chainId || !data) return;

      let quoteInfo;
      try {
        quoteInfo = await getQuoteInfo({
          saleId: params["saleId"] as string,
          chainId: params["chainId"] as ChainId,
          networkId: env.NETWORK_NAME,
          host: env.CHAINWEB_API_HOST
        }) as QuoteInfo;

        setQuoteInfo(quoteInfo);
        console.log("quoteInfo", quoteInfo);
      } catch { }

      let tokenInfo;
      try {
        let tokenId = quoteInfo?.["token-id"];

        if (!tokenId) {
          tokenId = data?.tokenId;
        }

        if (!tokenId) return;

        tokenInfo = await getTokenInfo({
          tokenId,
          chainId: params["chainId"] as ChainId,
          networkId: env.NETWORK_NAME,
          host: env.CHAINWEB_API_HOST
        }) as TokenInfo;

        setTokenInfo(tokenInfo);
        console.log("tokenInfo", tokenInfo);
      } catch { }

      if(!tokenInfo) throw new Error("Token Info not found");

      try {
        const tokenMetadata = await getTokenMetadata(tokenInfo.uri);

        console.log("tokenMetadata", tokenMetadata);

        if (tokenMetadata) {
          setTokenMetadata(tokenMetadata);
        }

        if (!!tokenMetadata?.image?.length) {
          const tokenImageUrl = getTokenImageUrl(tokenMetadata.image);

          if (tokenImageUrl) {
            setTokenImageUrl(tokenImageUrl);
          } else console.log('Invalid Image URL', tokenMetadata.image)
        }
      } catch { }
    }

    fetch();
  }, [params, data])

  const getSaleType = () => {
    if (!quoteInfo?.["sale-type"]) return "Sale";

    return toTitleCase((quoteInfo["sale-type"] as string).split(".")[1].replaceAll("-", " "))
  }

  const isRegularSale = !!params && !quoteInfo?.["sale-type"]
  const isConventionalAuction = !!params && quoteInfo?.["sale-type"] === "marmalade-sale.conventional-auction"
  const isDutchAuction = !!params && quoteInfo?.["sale-type"] === "marmalade-sale.dutch-auction"

  return (
    <>
      <Heading>
        <title>SaleId</title>
      </Heading>
      <Stack flex={1} flexDirection="column">
        <h3>{getSaleType()} - {params?.["saleId"]}</h3>
        <br />

        {isRegularSale && data && (
          <RegularSale
            tokenImageUrl={tokenImageUrl}
            sale={data!}
          />
        )}

        {isConventionalAuction && data && (
          <ConventionalAuction
            tokenImageUrl={tokenImageUrl}
            sale={data!}
          />
        )}

        {isDutchAuction && data && (
          <DutchAuction
            tokenImageUrl={tokenImageUrl}
            sale={data!}
          />
        )}

        <div className={styles.tokenDetailsWrapper}>
          <span>Token Details</span>
          <div className={styles.tokenDetailsInnerContainer}>
            <span>Supply: {tokenInfo?.["supply"]}</span>
            <span>Amount: {data?.amount}</span>
            <span>ChainId: {params?.["chainId"]}</span>
            <span>TokenId: {tokenInfo?.["id"]}</span>
            <span>SaleId: {params?.["saleId"]}</span>
            <span>Seller: {data?.seller.account}</span>
          </div>
        </div>
      </Stack>
    </>
  );
}