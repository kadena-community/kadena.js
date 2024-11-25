import { ChainId } from '@kadena/client';
import { MonoOutgoingMultichainFunds } from '@kadena/kode-icons/system';
import {
  Button,
  ContentHeader,
  Dialog,
  Divider,
  Select,
  SelectItem,
  Stack,
} from '@kadena/kode-ui';
import React from 'react';
import { useChains } from '../hooks/chains';
import { useWalletState } from '../state/wallet';

interface ChainSelectionModalProps {
  onSelect: (chainId: ChainId) => void;
  onClose: () => void;
  submit: () => void;
}

export const ChainSelectionModal: React.FC<ChainSelectionModalProps> = ({
  onSelect,
  onClose,
  submit,
}) => {
  const wallet = useWalletState();
  const { chains } = useChains(wallet.selectedNetwork);

  return (
    <Dialog
      isOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      size="sm"
    >
      <ContentHeader
        heading="Select Chain"
        description="Choose a chain for your transactions."
        icon={<MonoOutgoingMultichainFunds />}
      />

      <Divider />

      <Stack flexDirection="column" gap="md" alignItems="stretch">
        <Select
          label="Chain Selector"
          selectedKey={wallet.selectedChain}
          onSelectionChange={(key) => onSelect(key as ChainId)}
          placeholder="Choose a chain"
          size="md"
        >
          {chains.map((chain) => (
            <SelectItem key={chain}>{`Chain ${chain}`}</SelectItem>
          ))}
        </Select>

        <Stack flexDirection="row" gap="md" justifyContent="center">
          <Button onPress={submit} variant="positive">
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
