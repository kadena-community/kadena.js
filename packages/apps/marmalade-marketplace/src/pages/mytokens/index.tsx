import { ListingHeader } from '@/components/ListingHeader';
import { Token } from '@/components/Token';
import { getTokens, NonFungibleTokenBalance } from '@/graphql/queries/client';
import { useAccount } from '@/hooks/account';
import { fetchOnSaleTokens } from '@/utils/fetchOnSaleTokens';

import { ChainId } from '@kadena/client';
import {
  Badge,
  Grid,
  GridItem,
  Heading,
  ProgressCircle,
  Stack,
} from '@kadena/kode-ui';

import { useEffect, useState } from 'react';

const MyTokens = () => {
  const [tokens, setTokens] = useState<Array<NonFungibleTokenBalance>>([]);
  const [onSaleTokens, setOnSaleTokens] = useState<
    Array<NonFungibleTokenBalance>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useAccount();

  const fetchTokens = async (accountName?: string) => {
    if (accountName) {
      const tokens = await getTokens(accountName);
      setTokens(tokens.filter((token) => token.balance > 0));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTokens(account?.accountName);
    fetchOnSaleTokens(account?.accountName!, setOnSaleTokens);
  }, [account?.accountName]);

  return (
    <>
      <Stack flex={1} flexDirection="column">
        <ListingHeader />

        <Stack
          marginBlockStart="lg"
          marginBlockEnd="lg"
          gap="sm"
          alignItems="center"
        >
          <Heading as="h3">My Tokens</Heading>
          <Badge style="highContrast">
            {[...tokens, ...onSaleTokens].length}
          </Badge>
        </Stack>

        <Grid
          style={{ marginTop: '25px' }}
          columns={{
            lg: 4,
            md: 3,
            sm: 2,
            xs: 1,
          }}
          gap="xl"
        >
          {isLoading ? (
            <ProgressCircle size="lg" isIndeterminate />
          ) : (
            [...tokens, ...onSaleTokens].map((token) => (
              <GridItem key={token.tokenId}>
                <Token
                  tokenId={token.tokenId}
                  chainId={token.chainId as ChainId}
                  balance={token.balance}
                />
              </GridItem>
            ))
          )}
          {tokens.length === 0 && !isLoading && (
            <Heading as="h5">No tokens found</Heading>
          )}
        </Grid>
      </Stack>
    </>
  );
};

export default MyTokens;
