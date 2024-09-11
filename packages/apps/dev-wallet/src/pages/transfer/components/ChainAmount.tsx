import { ChainId } from '@kadena/client';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import { IOptimalTransfer } from '../utils';

export function ChainAmount({
  amount,
  chainsAmount,
  onChange,
}: {
  amount: string;
  chainsAmount: Array<IOptimalTransfer>;
  onChange: (amount: string) => void;
}) {
  return (
    <Stack flexDirection={'column'}>
      {chainsAmount.map(({ chainId, balance, amount }) => (
        <TextField
          name="amount"
          label={`Chain ${chainId} Balance: ${balance}`}
          value={amount}
          // onChange={(e) => onChange(e.target.value)}
        />
      ))}
      <Button variant="outlined" isCompact>
        update
      </Button>
    </Stack>
  );
}
