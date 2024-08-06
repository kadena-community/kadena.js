import { Stack } from '@kadena/kode-ui';
import * as styles from "@/styles/sale.css"
import { useParams } from 'next/navigation';
import { getSale } from '@/hooks/getSale';
import LabeledText from "@/components/LabeledText";

interface TokenInfo {
  uri: string;
  supply: string;
  id: string;
}

export default function Bid({ saleId, chainId }: { saleId: string, chainId: string }) {
  const params = useParams();
 
  const { data } = getSale(saleId as string);
  
  return (
    <>
      <Stack flex={1} flexDirection="column">
        <br />

          <div className={styles.tokenDetailsInnerContainer}>
            <LabeledText label="Sale Id" value={saleId}/>  
            <LabeledText label="Seller" value={data?.seller.account!}/>
            <LabeledText label="Sale Type" value="Regular Sale"/>  
            <LabeledText label="Amount" value={String(data?.amount)}/>
            <LabeledText label="Price" value={String(data?.startPrice)}/>
          </div>

      </Stack>
    </>
  );
}