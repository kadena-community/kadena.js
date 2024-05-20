import { Heading, Stack } from '@kadena/react-ui';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import Layout from '@/components/Layout';
import * as styles from "@/styles/global.css"

export default function Home() {
  return (
    <Layout>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Heading>Marmalade Example Application</Heading>
      </Stack>
    </Layout>
  );
}
