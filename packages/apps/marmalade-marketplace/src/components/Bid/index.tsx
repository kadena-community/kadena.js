import { Stack, RadioGroup, Radio, Text } from '@kadena/kode-ui';
import * as styles from "./style.css";
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
  console.log(data?.saleType==="")
  return (
    <>
      <Stack flex={1} flexDirection="column">
        <br />
          <div className={styles.tokenDetailsInnerContainer}>
            <div style={{marginBottom: '8px'}}>
              <div className={styles.labelTitle}>
                <Text as="span" size='small' variant='ui'>{'Sale Type'}</Text>
              </div>
              <RadioGroup direction="row" value={data?.saleType}> 
                <Radio isDisabled={data?.saleType !== 'conventional'} value="conventional" >Conventional</Radio>
                <Radio isDisabled={data?.saleType !== 'dutch'} value="dutch">Dutch</Radio>
                <Radio isDisabled={data?.saleType !== ''}  value="" >None</Radio>
              </RadioGroup>
            </div>
            <LabeledText label="Sale Id" value={saleId}/>  
            <LabeledText label="Seller" value={"w:Q0qcTnspIqnaH5Q62Wln39NLf_ub9eoU3AA3khr_2zo:keys-any"}/>
            <LabeledText label="Amount" value={String(data?.amount)}/>
            <LabeledText label="Price" value={String(data?.startPrice)}/>
          </div>

      </Stack>
    </>
  );
}