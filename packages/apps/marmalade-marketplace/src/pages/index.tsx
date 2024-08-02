import { getSales } from "@/hooks/getSales";
import { Button, Grid, GridItem, Heading } from "@kadena/kode-ui";
import { Token } from "@/components/Token";
import { useEffect, useState } from "react";
import { actionBarClass, actionBarSaleActiveClass, actionBarSaleClass } from "@/styles/home.css";

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

  console.log("data", data)

  return (
    <div>
      <div style={{ marginTop: '-60px', marginLeft: '-6%', marginRight: '-6%'}}>
        <img
          src={`/listingHeader.png`}
          alt="Header Image"
          style={{ position: 'relative', width: '100%', maxHeight: '600px', left: '0px', right: '0px'}} 
        />
      </div>
      {error && <div>Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
      {loading && <h2>Loading..</h2>}

      <div style={{ padding: '20px'}}>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Heading >Active Sales</Heading>
        </div>
        {!loading && !error && data.length === 0 && <Heading as="h2">No sales found</Heading>}
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
