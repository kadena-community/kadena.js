import { Heading, Stack, Text } from '@kadena/kode-ui';

export const BetaHeader = () => {
  return (
    <>
      <Stack
        width="100%"
        as="header"
        flexDirection="column"
        gap="sm"
        backgroundColor="semantic.warning.default"
        padding="md"
        marginBlockEnd={'md'}
        flex={1}
      >
        <Heading variant="h5">Caution</Heading>
        <Text>
          This is an unreleased development version of the Kadena Wallet. Use
          with caution and at your own risk!
        </Text>
      </Stack>
    </>
  );
};
