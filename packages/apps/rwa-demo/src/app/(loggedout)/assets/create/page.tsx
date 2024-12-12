'use client';
import { AssetStepperForm } from '@/components/AssetForm/AssetStepperForm';
import { Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';

const Home = () => {
  return (
    <>
      <CardContentBlock title="Add an asset">
        <Stack
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <AssetStepperForm />
        </Stack>
      </CardContentBlock>
    </>
  );
};

export default Home;
