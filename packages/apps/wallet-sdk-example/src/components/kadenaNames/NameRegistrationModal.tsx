import { MonoShortText } from '@kadena/kode-icons/system';
import { Button, ContentHeader, Dialog, Divider, Stack } from '@kadena/kode-ui';
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
    >
      {/* Modal Header */}
      <ContentHeader
        heading="Register Kadena Name"
        description="Use this form to register a new Kadena name."
        icon={<MonoShortText />}
      />

      <Divider />

      {/* Modal Content */}

      <NameRegistrationForm
        initialOwner={owner}
        initialAddress={address}
        onRegistered={() => {
          onRegistered?.();
          onClose();
        }}
        balance={balance}
      />

      {/* Buttons */}
      <Stack
        flexDirection="row"
        gap="md"
        justifyContent="center"
        marginBlockStart="lg"
      >
        <Button onPress={onRegistered} variant="positive">
          Register
        </Button>
        <Button onPress={onClose} variant="negative">
          Close
        </Button>
      </Stack>
    </Dialog>
  );
};
