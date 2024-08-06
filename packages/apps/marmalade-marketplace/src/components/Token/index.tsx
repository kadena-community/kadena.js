import { Sale } from '@/hooks/getSales';
import { useEffect, useState } from 'react';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { ChainId, } from '@kadena/client';
import { Text, Heading } from "@kadena/kode-ui";
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import * as styles from './style.css';
import { env } from '@/utils/env';

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  authors: {
    name: string;
  }[];
  properties: Record<string, any>;
  collection: {
    name: string;
    family: string;
  };
}

interface TokenProps {
  tokenId: string;
  chainId: ChainId;
  balance?: number;
  sale?: Sale;
}

export const Token: React.FC<TokenProps> = ({
  tokenId,
  sale,
  chainId,
  balance,
}) => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>();
  const [tokenImageUrl, setTokenImageUrl] = useState<string>("/no-image.webp");

  useEffect(() => {
    async function fetch() {
      const tokenInfo = await getTokenInfo({
        tokenId,
        chainId,
        networkId: env.NETWORKID,
        host: env.CHAINWEB_API_HOST
      }) as { uri: string };

      const tokenMetadata = await getTokenMetadata(tokenInfo.uri);
      if (tokenMetadata) {
        setTokenMetadata(tokenMetadata);
      }

      if (!!tokenMetadata?.image?.length) {
        const tokenImageUrl = getTokenImageUrl(tokenMetadata.image);

        if (tokenImageUrl) {
          setTokenImageUrl(tokenImageUrl);
        } else console.log('Invalid Image URL', tokenMetadata.image)
      }
    }

    fetch();
  }, [tokenId])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.tokenImageContainer}>
        <img
          src={tokenImageUrl}
          alt="Token Image"
          className={styles.tokenImageClass}
        />
      </div>
      <div className={styles.titleContainer}>
        <Text>{tokenId?.slice(0,5) + "..." + tokenId?.slice(-5)}</Text>
        <Heading as="h6">{tokenMetadata?.name || "Marmalade Token"}</Heading>
      </div>
      <div className={styles.metaContainer}>
        <div>
          <Text as="p">{balance ? 'Balance' : 'Price'}</Text>
          <Text as="p" color="emphasize">{balance ? balance : sale?.startPrice}</Text>
        </div>
        <div>
          <Text as="p">Chain</Text>
          <Text as="p" color="emphasize">{chainId}</Text>
        </div>
      </div>
    </div>
  );
};
