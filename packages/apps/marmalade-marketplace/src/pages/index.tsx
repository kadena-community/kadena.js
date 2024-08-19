import { useEffect, useState } from "react";
import { Token } from "@/components/Token";
import { ListingHeader } from "@/components/ListingHeader";
import { getSales } from "@/hooks/getSales";
import { Grid, GridItem, Heading, ProgressCircle } from "@kadena/kode-ui";


export default function Home() {

  const [saleState, setSaleState] = useState<'ACTIVE' | 'PAST'>("ACTIVE");

  const { data, loading, error, refetch } = getSales({
    limit: 8,
    state: saleState,
    sort: [
      {
        field: "block",
        direction: "desc"
      }
    ]
  });

  useEffect(() => {
    refetch();
  }, [saleState]);

  return (
    <div>
      <ListingHeader />
      <div>
        <div style={{marginTop: '40px', marginBottom: '20px'}}>
          <Heading as="h3">Active Sales</Heading>
        </div>   
        
        {error && <div>Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
        {loading && <ProgressCircle size="lg" isIndeterminate />}
        {!loading && !error && data.length === 0 && <Heading as="h5">No sales found</Heading>}   

        <Grid
          columns={{
            lg: 4,
            md: 3,
            sm: 2,
            xs: 1,
          }}
          gap="xl">
          {data.map((sale, index) => (
            <GridItem key={index}>
              <a href={`/tokens/${sale.tokenId}?saleId=${sale.saleId}&chainId=${sale.chainId}`}>
                <Token tokenId={sale.tokenId} chainId={sale.chainId} sale={sale} />
              </a>
            </GridItem>
          ))}
        </Grid>           
      </div>
    </div>
  );
}
