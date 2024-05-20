import { Heading, Stack } from '@kadena/react-ui';
import { Providers } from '@/providers/Providers';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Providers>
      <Layout>
        <Stack justifyContent={"center"} alignItems={"center"}>
          <Heading>Marmalade Example Application</Heading>
        </Stack>
      </Layout>
    </Providers>
  );
}
