import { MonoShortText } from '@kadena/kode-icons/system';
import {
  Button,
  ContentHeader,
  Dialog,
  DialogContent,
  Divider,
  Stack,
} from '@kadena/kode-ui';
import React from 'react';
import { NameRegistrationForm } from './NameRegistrationForm';

interface NameRegistrationModalProps {
  owner: string;
  address: string;
  onClose: () => void;
  onRegistered?: () => void;
  balance: number;
}

export const NameRegistrationModal: React.FC<NameRegistrationModalProps> = ({
  owner,
  address,
  onClose,
  onRegistered,
  balance,
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
        heading="Register Kadena Name"
        description="Use this form to register a new Kadena name."
        icon={<MonoShortText />}
      />
      <DialogContent>
        <Divider />

        <NameRegistrationForm
          initialOwner={owner}
          initialAddress={address}
          onRegistered={() => {
            onRegistered?.();
            onClose();
          }}
          balance={balance}
        />

        <Stack
          flexDirection="row"
          gap="md"
          justifyContent="center"
          marginBlockStart="lg"
        >
          <Button onPress={onClose} variant="negative">
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
