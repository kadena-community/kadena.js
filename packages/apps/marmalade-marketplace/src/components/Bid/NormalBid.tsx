import { Sale } from '@/hooks/getSales';
import { Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import LabeledText from '../LabeledText';
import { RegularSale } from '../Sale/RegularSale';

interface IProps {
  data: Sale;
  tokenImageUrl: string;
}

export const NormalBid: FC<IProps> = ({ data, tokenImageUrl }) => {
  return (
    <CardContentBlock
      title="Buy token"
      supportingContent={
        <Stack flexDirection="column" width="100%" gap="md">
          <Text>You can view and bid on the available offers here.</Text>
          <Text>
            Clicking `Buy Now` will transfer the fungible payment to the sale`s
            escrow account and transfer the token to your account.
          </Text>
        </Stack>
      }
    >
      <LabeledText label="Sale Id" value={data.saleId} />
      <LabeledText label="Seller" value={data?.seller.account!} />
      <LabeledText label="Amount" value={String(data?.amount)} />
      <LabeledText label="Price" value={String(data?.startPrice)} />

      <CardFooterGroup>
        <RegularSale tokenImageUrl={tokenImageUrl} sale={data!} />
      </CardFooterGroup>
    </CardContentBlock>
  );
};
