import { Text, Heading } from '@kadena/react-ui';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import * as styles from "@/styles/global.css"

export default function Home() {
  return (
    <div className={styles.mainWrapperClass}>
      <MarketplaceHeader />
      <main>
        <h1 className={styles.mainWrapperClass}>
          Marmalade Example Application
        </h1>
      </main>
    </div>
  );
}
