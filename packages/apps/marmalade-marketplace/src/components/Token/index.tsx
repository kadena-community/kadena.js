import { Sale } from '@/hooks/getSales';
import { useEffect, useState } from 'react';
import { getTokenInfo } from '@kadena/client-utils/marmalade'
import { ChainId, } from '@kadena/client';
import { getTokenImageUrl, getTokenMetadata } from '@/utils/token';
import { tokenImageClass, mainWrapperClass, tokenDescriptionClass } from '@/styles/token.css';
import { Badge } from '../Badge';
import { getTokenSaleBadgeLabel } from '@/utils/sale';
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
  sale?: Sale;
}

export const Token: React.FC<TokenProps> = ({
  tokenId,
  chainId,
  sale,
}) => {
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
    <div className={mainWrapperClass}>
      {sale?.saleId && (
        <Badge label={getTokenSaleBadgeLabel(sale.saleType)} />
      )}
      <img
        src={tokenImageUrl}
        alt="Token Image"
        className={tokenImageClass}
      />
      <div className={tokenDescriptionClass}>{tokenId}</div>
    </div>
  );
};
