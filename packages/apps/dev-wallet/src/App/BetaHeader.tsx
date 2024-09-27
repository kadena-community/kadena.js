import { MonoRemoveCircleOutline as DeleteIcon } from '@kadena/kode-icons';
import { Button, Stack, Text } from '@kadena/kode-ui';

export const BetaHeader = () => {
  const cleanLocalDb = () => {
    const confirmDelete = confirm(
      [
        'This will DELETE your profiles! ' +
          'Make sure you have a backup of your seed phrase before proceeding.',
        '',
        'Do you want to delete the local database?',
      ].join('\n'),
    );
    if (!confirmDelete) return;
    indexedDB.deleteDatabase('dev-wallet');
    location.reload();
  };

  return (
    <>
      <Stack
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
          with caution!
        </Text>
        <Button
          isCompact
          endVisual={DeleteIcon({})}
          variant="negative"
          onPress={cleanLocalDb}
        >
          Delete Local Database
        </Button>
      </Stack>
    </>
  );
};
