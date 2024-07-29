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
    <div style={{ marginTop: "100px" }}>
      <div className={actionBarClass}>
        <div className={actionBarSaleClass}>
          <Button
            className={saleState === "ACTIVE" ? actionBarSaleActiveClass : ""}
            onClick={() => setSaleState("ACTIVE")}>Active sales</Button>
          <Button
            className={saleState === "PAST" ? actionBarSaleActiveClass : ""}
            onClick={() => setSaleState("PAST")}>Past sales</Button>
        </div>
      </div>

      {error && <div>Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
      {loading && <h2>Loading..</h2>}

      {!loading && !error && data.length === 0 && <Heading as="h2">No sales found</Heading>}

      <div>
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
