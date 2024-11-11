import { Heading, Stack, Text } from '@kadena/kode-ui';

export const BetaHeader = () => {
  return (
    <>
      <Stack
        width="100%"
        as="header"
        flexDirection="column"
        gap="xs"
        justifyContent="center"
        padding="sm"
        backgroundColor="semantic.warning.default"
        marginBlockEnd={'md'}
      >
        <Heading as="h5">Caution</Heading>
        <Text>
          This is an unreleased development version of the Kadena Wallet. Use
          with caution and at your own risk.
        </Text>
      </Stack>
    </>
  );
};
