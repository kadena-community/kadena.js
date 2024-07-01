import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';
import { Stack } from "@kadena/react-ui";

export default function Transaction() {
  const {transaction, send, preview, poll} = useTransaction();

  return (
    <Stack flex={1} flexDirection="column">
      <h1>Transaction Details</h1>
      <div style={{ marginTop: "25px" }} >
        <SendTransaction send={send} preview={preview} poll={poll} transaction={transaction}/>
      </div>
    </Stack>
  );
}