import { BlockInfoProvider } from '@/components/BlockTable/BlockInfoContext/BlockInfoContext';
import { BlockTable } from '@/components/BlockTable/BlockTable';
import { fullWidthClass } from '@/components/globalstyles.css';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { Layout } from '@/components/Layout/Layout';
import { StatisticsGrid } from '@/components/StatisticsComponent/StatisticsGrid/StatisticsGrid';
import { Media, Stack } from '@kadena/kode-ui';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Home: React.FC = () => {
  const { inView, ref: inViewRef } = useInView();

  const init = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch('https://api.mainnet.kadindexer.io/v0/', {
      headers: {
        accept: 'application/json',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-api-key': 'DKdA23Pky4K7men6DNSp8UvCoJI8eDh2uxoVQcH7',
      },
      body: '{"query":"query lastBlockHeight {\\n  lastBlockHeight\\n}","variables":{},"operationName":"lastBlockHeight","extensions":{}}',
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((x) => x.json())
      .then((x) => console.log(x));
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <Layout layout="full">
      <BlockInfoProvider>
        <LayoutBody>
          <Stack ref={inViewRef}></Stack>
          <Media lessThan="md" className={fullWidthClass}>
            <Stack width="100%" marginBlockEnd="xxxl" paddingInline="xs">
              <StatisticsGrid inView={inView} />
            </Stack>
          </Media>

          <Stack marginBlock="xxxl" />
          <BlockTable />
        </LayoutBody>
      </BlockInfoProvider>
    </Layout>
  );
};

export default Home;
