import { getSales } from "@/hooks/getSales";
import { Button, Grid, GridItem, Link } from "@kadena/kode-ui";
import { Token } from "@/components/Token";
import { useEffect, useState } from "react";
import { actionBarClass, actionBarSaleActiveClass, actionBarSaleClass } from "@/styles/home.css";

export default function Home() {

  const [saleStatus, setSaleStatus] = useState<'CREATED' | 'SOLD'>("CREATED");

  const { data, loading, error, refetch } = getSales({
    limit: 8,
    status: saleStatus,
    sort: [
      {
        field: "block",
        direction: "desc"
      }
    ]
  });

  useEffect(() => {
    refetch();
  }, [saleStatus]);

  return (
    <div>
      <div className={actionBarClass}>
        <div className={actionBarSaleClass}>
          <Button
            className={saleStatus === "CREATED" ? actionBarSaleActiveClass : ""}
            onClick={() => setSaleStatus("CREATED")}>Active sales</Button>
          <Button
            className={saleStatus === "SOLD" ? actionBarSaleActiveClass : ""}
            onClick={() => setSaleStatus("SOLD")}>Past sales</Button>
        </div>
        <Link variant="primary">
          Sell Token
        </Link>
      </div>

      {error && <div>Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
      {loading && <h2>Loading..</h2>}

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
              <a href={`/tokens/${sale.tokenId}`}>
                <Token tokenId={sale.tokenId} chainId={sale.chainId} sale={sale} />
              </a>
            </GridItem>
          ))}
        </Grid>
      </div>
    </div>
  );
}
