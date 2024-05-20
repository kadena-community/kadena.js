import {Heading} from '@kadena/react-ui';
import * as styles from "@/styles/global.css"
import { UploadImage } from '@/components/UploadImage';

export default function Marketplace() {
  return (
    <div className={styles.mainWrapperClass}>
      <Heading>
        <title>Conventional Auction</title>
      </Heading>

      <main className={styles.mainWrapperClass}>
        <h1>Conventional Auction</h1>
        <div className={styles.mainWrapperClass}>
        </div>
      </main>
    </div>
  );
}
