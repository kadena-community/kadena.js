import { Stack } from '@kadena/kode-ui';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export const MainLoading = () => {
  return (
    <Stack
      width="100%"
      alignItems="center"
      justifyContent="center"
      height="100%"
      style={{ height: '100vh' }}
    >
      <TransactionPendingIcon />
    </Stack>
  );
};
