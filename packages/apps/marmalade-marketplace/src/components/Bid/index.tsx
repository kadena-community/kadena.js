import LabeledText from '@/components/LabeledText';
import { useGetSale } from '@/hooks/getSale';
import { Radio, RadioGroup, Stack, Text } from '@kadena/kode-ui';

import { useAccount } from '@/hooks/account';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { atoms } from '@kadena/kode-ui/styles';
import { NormalBid } from './NormalBid';
import * as styles from './style.css';

const Bid = ({
  saleId,
  tokenImageUrl,
}: {
  saleId: string;
  tokenImageUrl: string;
}) => {
  const { data } = useGetSale(saleId as string);
  const { account } = useAccount();
  console.log({ data, account });

  if (!saleId) {
    return (
      <CardContentBlock
        className={atoms({ width: '100%' })}
        title="Buy token"
        supportingContent={
          <Stack flexDirection="column" width="100%" gap="md">
            <Text>This token is not for sale.</Text>
          </Stack>
        }
      ></CardContentBlock>
    );
  }

  if (data?.seller.account === account?.accountName) {
    return (
      <CardContentBlock
        className={atoms({ width: '100%' })}
        title="This token is yours"
        supportingContent={
          <Stack flexDirection="column" width="100%" gap="md">
            <Text>You are the seller of this token.</Text>
            <Text>You can ot sell to yourself</Text>
          </Stack>
        }
      ></CardContentBlock>
    );
  }

  if (data?.saleType === '') {
    return <NormalBid data={data} tokenImageUrl={tokenImageUrl} />;
  }

  return (
    <>
      <Stack flex={1} flexDirection="column">
        <br />
        <div className={styles.tokenDetailsInnerContainer}>
          <div style={{ marginBottom: '8px' }}>
            <div className={styles.labelTitle}>
              <Text as="span" size="small" variant="ui">
                {'Sale Type'}
              </Text>
            </div>
            <RadioGroup direction="row" value={data?.saleType}>
              <Radio
                isDisabled={data?.saleType !== 'conventional'}
                value="conventional"
              >
                Conventional
              </Radio>
              <Radio isDisabled={data?.saleType !== 'dutch'} value="dutch">
                Dutch
              </Radio>
              <Radio isDisabled={data?.saleType !== ''} value="">
                None
              </Radio>
            </RadioGroup>
          </div>
          <LabeledText label="Sale Id" value={saleId} />
          <LabeledText label="Seller" value={data?.seller.account!} />
          <LabeledText label="Amount" value={String(data?.amount)} />
          <LabeledText label="Price" value={String(data?.startPrice)} />
        </div>
      </Stack>
    </>
  );
};

export default Bid;
