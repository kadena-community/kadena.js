import { useEffect, useState } from "react";
import { ChainId } from '@kadena/client';
import { getTokens, NonFungibleTokenBalance } from '@/graphql/queries/client';
import { useAccount } from '@/hooks/account';
import { Token } from "@/components/Token";
import { ListingHeader } from "@/components/ListingHeader";
import { Grid, GridItem, Stack, Heading, ProgressCircle } from "@kadena/kode-ui";

export default function MyTokens() {
  const [tokens, setTokens] = useState<Array<NonFungibleTokenBalance>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useAccount();

  const fetchTokens = async (accountName?:string) => {
    if (accountName) {
      const tokens = await getTokens(accountName);
      setTokens(tokens.filter(token => token.balance > 0));
    }
    setIsLoading(false);
  };

  useEffect(() => {    
    setIsLoading(true);
    fetchTokens(account?.accountName);    
  }, [account?.accountName]);

  return (
    <Stack flex={1} flexDirection="column">
      <ListingHeader />
      <div style={{marginTop: '40px'}}>
        <Heading as="h3">My Tokens</Heading>
      </div>
      <Grid
        style={{ marginTop: "25px" }}
        columns={{
          lg: 4,
          md: 3,
          sm: 2,
          xs: 1,
        }}
        gap="xl">
        {isLoading ? 
        <ProgressCircle size="lg" isIndeterminate /> :
        tokens.map((token) => (
          <GridItem key={token.tokenId}>
            <a href={`/tokens/${token.tokenId}?chainId=${token.chainId}`}>
              <Token tokenId={token.tokenId} chainId={token.chainId as ChainId} balance={token.balance}/>
            </a>
          </GridItem>
        ))}
        {tokens.length === 0 && !isLoading && <Heading as="h5">No tokens found</Heading>}
      </Grid>
    </Stack>
  );
}
