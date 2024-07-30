import { useEffect, useState } from "react";
import { ChainId } from '@kadena/client';
import { getTokens, NonFungibleTokenBalance } from '@/graphql/queries/client';
import { useAccount } from '@/hooks/account';
import { Token } from "@/components/Token";
import { Grid, GridItem, Stack, Heading } from "@kadena/kode-ui";

export default function MyTokens() {
  const [tokens, setTokens] = useState<Array<NonFungibleTokenBalance>>([]);
  const { account } = useAccount();

  const fetchTokens = async (accountName?:string) => {
    if (!accountName) return;

    const tokens = await getTokens(accountName);
    console.log(tokens)
    setTokens(tokens.filter(token => token.balance > 0));
  };

  useEffect(() => {
    fetchTokens(account?.accountName);    
  }, [account?.accountName]);

  return (
    <Stack flex={1} flexDirection="column">
      <Heading as="h1">My Tokens</Heading>
      <Grid
        style={{ marginTop: "25px" }}
        columns={{
          lg: 4,
          md: 3,
          sm: 2,
          xs: 1,
        }}
        gap="xl">
        {tokens.map((token) => (
          <GridItem key={token.tokenId}>
            <a href={`/tokens/${token.tokenId}?chainId=${token.chainId}`}>
              <Token tokenId={token.tokenId} chainId={token.chainId as ChainId} balance={token.balance}/>
            </a>
          </GridItem>
        ))}
        {tokens.length === 0 && <Heading as="h3">No tokens found</Heading>}
      </Grid>
    </Stack>
  );
}
