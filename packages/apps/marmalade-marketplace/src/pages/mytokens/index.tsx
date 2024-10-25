import { ListingHeader } from '@/components/ListingHeader';
import { Token } from '@/components/Token';
import { getTokens, NonFungibleTokenBalance } from '@/graphql/queries/client';
import { useAccount } from '@/hooks/account';
import { database } from '@/utils/firebase';
import { ChainId } from '@kadena/client';
import {
  Badge,
  Grid,
  GridItem,
  Heading,
  ProgressCircle,
  Stack,
} from '@kadena/kode-ui';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const MyTokens = () => {
  const [tokens, setTokens] = useState<Array<NonFungibleTokenBalance>>([]);
  const [onSaleTokens, setOnSaleTokens] = useState<
    Array<NonFungibleTokenBalance>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useAccount();

  const fetchOnSaleTokens = async (accountName?: string) => {
    if (accountName) {
      //const querySnapshot = await getDocs(query(collection(database, 'sales')));
      const salesRef = collection(database, 'sales');
      const q = await query(
        salesRef,
        where('seller.account', '==', account?.accountName),
      );
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot);
      const docs: NonFungibleTokenBalance[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as NonFungibleTokenBalance);
      });
      setOnSaleTokens(docs);
    }
  };

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
    fetchOnSaleTokens(account?.accountName);
  }, [account?.accountName]);

  console.log({ tokens });
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
          <Heading as="h3">Active Listings</Heading>
          <Badge style="highContrast">{tokens.length}</Badge>
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
