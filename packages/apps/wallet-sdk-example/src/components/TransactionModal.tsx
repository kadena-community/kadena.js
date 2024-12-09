import { MonoCommit } from '@kadena/kode-icons/system';
import {
  Button,
  ContentHeader,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import React from 'react';
import { TrackedFunction } from '../hooks/functionTracker';
import SdkFunctionDisplay from './SdkFunctionDisplayer';

interface TransactionModalProps {
  estimatedGas: number | null;
  transactionJSON: string;
  onClose: () => void;
  onConfirm: () => void;
  // demo
  gasFunctionCall?: TrackedFunction;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  estimatedGas,
  transactionJSON,
  onClose,
  onConfirm,
  gasFunctionCall,
}) => {
  return (
    <Dialog
      isOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      size="sm"
      className="max-h-[90vh]"
    >
      <ContentHeader
        heading="Confirm Transaction"
        description="Review and confirm your transaction details."
        icon={<MonoCommit />}
      />
      <DialogContent>
        <Divider />
        <Stack flexDirection="column" gap="md" alignItems="center">
          <Text variant="body">
            Estimated Gas Cost:{' '}
            <strong>{estimatedGas ?? 'Calculating...'}</strong>
          </Text>
          {/*
          This is for Demo purposes, displaying the SDK function used to estimate gas
        */}
          {gasFunctionCall && (
            <>
              <SdkFunctionDisplay data={gasFunctionCall} />
              <Divider />
            </>
          )}

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

          <Divider />

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
      </DialogContent>
    </Dialog>
  );
};
