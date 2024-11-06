import { Stack, Text } from '@kadena/kode-ui';

export const BetaHeader = () => {
  return (
    <>
      <Stack
        width="100%"
        as="header"
        alignItems="center"
        flexDirection="row"
        gap="md"
        justifyContent="center"
        padding="sm"
        backgroundColor="semantic.warning.default"
      >
        <Text>
          This is an unreleased development version of the Kadena Wallet. Use
          with caution and at your own risk.
        </Text>
      </Stack>
    </>
  );
};
