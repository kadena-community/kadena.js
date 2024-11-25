import { MonoCommit } from '@kadena/kode-icons/system';
import {
  Button,
  ContentHeader,
  Dialog,
  Divider,
  Stack,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import React from 'react';

interface TransactionModalProps {
  estimatedGas: number | null;
  transactionJSON: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  estimatedGas,
  transactionJSON,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      isOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      size="sm"
    >
      <ContentHeader
        heading="Confirm Transaction"
        description="Review and confirm your transaction details."
        icon={<MonoCommit />}
      />

      <Divider />
      <Stack flexDirection="column" gap="md" alignItems="center">
        <Text variant="body">
          Estimated Gas Cost:{' '}
          <strong>{estimatedGas ?? 'Calculating...'}</strong>
        </Text>

        <TextareaField
          label="Transaction Details"
          value={transactionJSON}
          isReadOnly
          size="lg"
          variant="default"
          fontType="ui"
          description="Details of the transaction."
          placeholder="Transaction details will appear here."
          rows={6}
          autoResize={false}
        />

        <Stack
          flexDirection="row"
          gap="md"
          justifyContent="center"
          marginBlockStart="lg"
        >
          <Button onPress={onConfirm} variant="positive">
            Confirm
          </Button>
          <Button onPress={onClose} variant="negative">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
