import { BlockInfoProvider } from '@/components/BlockTable/BlockInfoContext/BlockInfoContext';
import { BlockTable } from '@/components/BlockTable/BlockTable';
import { fullWidthClass } from '@/components/globalstyles.css';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { Layout } from '@/components/Layout/Layout';
import { Media } from '@/components/Layout/media';
import { StatisticsGrid } from '@/components/StatisticsComponent/StatisticsGrid/StatisticsGrid';
import { Stack } from '@kadena/kode-ui';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const Home: React.FC = () => {
  const { inView, ref: inViewRef } = useInView();
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
