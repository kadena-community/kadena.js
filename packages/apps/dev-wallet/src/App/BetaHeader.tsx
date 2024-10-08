import { closeDatabaseConnections } from '@/modules/db/db.service';
import { deleteDatabase } from '@/modules/db/indexeddb';
import { MonoRemoveCircleOutline as DeleteIcon } from '@kadena/kode-icons';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { useState } from 'react';

export const BetaHeader = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const cleanLocalDb = async () => {
    const confirmDelete = confirm(
      [
        'This will DELETE your profiles! ' +
          'Make sure you have a backup of your seed phrase before proceeding.',
        '',
        'Do you want to delete the local database?',
      ].join('\n'),
    );
    if (!confirmDelete) return;
    setIsDeleting(true);
    closeDatabaseConnections();
    setTimeout(async () => {
      await deleteDatabase('dev-wallet');
      location.reload();
    }, 1000);
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
          isLoading={isDeleting}
          loadingLabel="Deleting..."
        >
          Delete Local Database
        </Button>
      </Stack>
    </>
  );
};
