import { Card, Heading, Stack } from '@kadena/kode-ui';

export function Ready() {
  return (
    <Card fullWidth>
      <Stack justifyContent="center" width="100%">
        <Heading>Dev Wallet is ready for connection</Heading>
      </Stack>
    </Card>
  );
}
