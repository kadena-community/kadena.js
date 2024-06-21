import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';
import { Stack } from "@kadena/react-ui";

export default function Transaction() {
  const {transaction, send, preview} = useTransaction();

  return (
    <Stack flex={1} flexDirection="column">
      <h1>Transaction Details</h1>
      <div style={{ marginTop: "25px" }} >
        <SendTransaction send={send} preview={preview} transaction={transaction}/>
      </div>
    </Stack>
  );
}