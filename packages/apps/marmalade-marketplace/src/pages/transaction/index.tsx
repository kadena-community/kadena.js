import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';
import { Stack, Heading } from "@kadena/kode-ui";

export default function Transaction() {
  const {transaction, send, preview, poll} = useTransaction();

  return (
    <Stack flex={1} flexDirection="column">
      <Heading>Transaction Details</Heading>
      <div style={{ marginTop: "25px" }} >
        <SendTransaction send={send} preview={preview} poll={poll} transaction={transaction}/>
      </div>
    </Stack>
  );
}
