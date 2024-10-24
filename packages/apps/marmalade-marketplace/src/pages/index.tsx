import { ListingHeader } from '@/components/ListingHeader';
import { Token } from '@/components/Token';
import { useGetSales } from '@/hooks/getSales';
import {
  Badge,
  Grid,
  GridItem,
  Heading,
  ProgressCircle,
  Stack,
} from '@kadena/kode-ui';
import { useEffect, useState } from 'react';

const Home = () => {
  const [saleState, _] = useState<'ACTIVE' | 'PAST'>('ACTIVE');

  const { data, loading, error, refetch } = useGetSales({
    limit: 8,
    state: saleState,
    sort: [
      {
        field: 'block',
        direction: 'desc',
      },
    ],
  });

  useEffect(() => {
    refetch();
  }, [saleState]);

  return (
    <>
      <ListingHeader />

      <Stack
        marginBlockStart="lg"
        marginBlockEnd="lg"
        gap="sm"
        alignItems="center"
      >
        <Heading as="h3">Active Listings</Heading>
        <Badge style="highContrast">{data.length}</Badge>
      </Stack>

      {error && (
        <div>
          Error: <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {loading && <ProgressCircle size="lg" isIndeterminate />}
      {!loading && !error && data.length === 0 && (
        <Heading as="h5">No sales found</Heading>
      )}

      <Grid
        columns={{
          lg: 4,
          md: 3,
          sm: 2,
          xs: 1,
        }}
        gap="xl"
      >
        {data.map((sale) => (
          <GridItem key={sale.saleId}>
            <Token tokenId={sale.tokenId} chainId={sale.chainId} sale={sale} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default Home;
