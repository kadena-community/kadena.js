import { useEffect, useState } from "react";
import { ChainId } from '@kadena/client';
import { getTokens, NonFungibleTokenBalance } from '@/graphql/queries/client';
import { useAccount } from '@/hooks/account';
import { Token } from "@/components/Token";
import { Grid, GridItem, Stack } from "@kadena/react-ui";

export default function MyTokens() {
  const [tokens, setTokens] = useState<Array<NonFungibleTokenBalance>>([]);
  const { account } = useAccount();

  const fetchTokens = async (accountName?:string) => {
    if (!accountName) return;
    const tokens = await getTokens(accountName);
    setTokens(tokens);
  };

  useEffect(() => {
    fetchTokens(account?.accountName);
  }, [account?.accountName]);

  return (
    <Stack flex={1} flexDirection="column">
      <h1>My Tokens</h1>
      <Grid
        columns={{
          lg: 4,
          md: 3,
          sm: 2,
          xs: 1,
        }}
        gap="xl">
        {tokens.map((token) => (
          <GridItem key={token.tokenId}>
            <a href={`/tokens/${token.tokenId}`}>
              <Token tokenId={token.tokenId} chainId={token.chainId as ChainId} />
            </a>
          </GridItem>
        ))}
        {tokens.length === 0 && <h3>No tokens found</h3>}
      </Grid>
    </Stack>
  );
}