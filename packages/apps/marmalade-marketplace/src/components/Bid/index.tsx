import { Heading, Stack } from '@kadena/kode-ui';
import * as styles from "@/styles/sale.css"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TokenMetadata } from '@/components/Token';
import { env } from '@/utils/env';
import { getQuoteInfo, getTokenInfo } from '@kadena/client-utils/marmalade';
import { ChainId } from '@kadena/client';
import { toTitleCase } from '@/utils/string';
import { ConventionalAuction } from '@/components/Sale/ConventionalAuction';
import { DutchAuction } from '@/components/Sale/DutchAuction';
import { RegularSale } from '@/components/Sale/RegularSale';
import { getSale } from '@/hooks/getSale';
import { QuoteInfo } from '@/pages/api/cron';
import LabeledText from "@/components/LabeledText";

interface TokenInfo {
  uri: string;
  supply: string;
  id: string;
}

export default function Bid({ saleId, chainId }: { saleId: string, chainId: string }) {
  const params = useParams();
 
  const { data } = getSale(saleId as string);

  
   getQuoteInfo({
    saleId: saleId as string,
    chainId: chainId as ChainId,
    networkId: env.NETWORKID,
    host: env.CHAINWEB_API_HOST
  }).then(console.log)

  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo>();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>();
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");

  useEffect(() => {
    async function fetch() {
      if ( saleId || chainId || !data) return;

      let quoteInfo;
      try {
        quoteInfo = await getQuoteInfo({
          saleId: saleId as string,
          chainId: chainId as ChainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        }) as QuoteInfo;

        console.log(quoteInfo)

        setQuoteInfo(quoteInfo);
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
          chainId: chainId as ChainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST
        }) as TokenInfo;

        setTokenInfo(tokenInfo);
        console.log("tokenInfo", tokenInfo);
      } catch { }

      if(!tokenInfo) throw new Error("Token Info not found");
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
      <Stack flex={1} flexDirection="column">
        <br />

          <div className={styles.tokenDetailsInnerContainer}>
            <LabeledText label="Sale Id" value={saleId}/>  
            <LabeledText label="Seller" value={data?.seller.account}/>
            <LabeledText label="Sale Type" value="Regular Sale"/>  
            <LabeledText label="Amount" value={data?.amount}/>
            <LabeledText label="Price" value={data?.startPrice}/>
          </div>

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
      </Stack>
    </>
  );
}