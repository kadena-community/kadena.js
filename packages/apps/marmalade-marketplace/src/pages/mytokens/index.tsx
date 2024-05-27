import * as styles from "@/styles/global.css"
import Layout from '@/components/Layout';
import { Button, Grid, GridItem, Link, Heading, Stack } from "@kadena/react-ui";
import { Token } from "@/components/Token";
import { useEffect, useState } from "react";
import { getTokens } from '@/graphql/queries/client';
import { actionBarClass, actionBarSaleActiveClass, actionBarSaleClass } from "@/styles/home.css";

export default function MyTokens() {

  const [tokens, setTokens] = useState<Array<any>>([]);

  const fetchTokens = async () => {
    const tokens = await getTokens('');
    // setTokens(tokens);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <Layout>
      <Heading>
        <title>My Tokens</title>
      </Heading>
      <Stack flex={1} flexDirection="column">
        {/* <div style={{ marginTop: "100px" }}>
          {error && <div>Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
          {loading && <h2>Loading..</h2>}
        </div> */}
      </Stack>


      <div>
        <Grid
          columns={{
            lg: 4,
            md: 3,
            sm: 2,
            xs: 1,
          }}
          gap="xl">
          {/* {data.map((sale, index) => (
            <GridItem key={index}>
              <a href={`/tokens/${sale.tokenId}`}>
                <Token tokenId={sale.tokenId} chainId={sale.chainId} sale={sale} />
              </a>
            </GridItem>
          ))} */}
        </Grid>
      </div>

      </Layout>
  );
}
