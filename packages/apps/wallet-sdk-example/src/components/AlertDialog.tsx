import { MonoCrisisAlert } from '@kadena/kode-icons/system';
import {
  Button,
  ContentHeader,
  Dialog,
  Divider,
  Stack,
  Text,
} from '@kadena/kode-ui';
import React, { useEffect } from 'react';

interface AlertDialogProps {
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  return (
    <Dialog
      isOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      size="sm"
    >
      <ContentHeader
        heading={title}
        description="Alert notification"
        icon={<MonoCrisisAlert />}
      />

      <Divider />
      <Stack flexDirection="column" gap="md" alignItems="center">
        <Text variant="body">{message}</Text>

        <Button onPress={onClose} variant="negative">
          Close
        </Button>
      </Stack>
    </Dialog>
  );
};
