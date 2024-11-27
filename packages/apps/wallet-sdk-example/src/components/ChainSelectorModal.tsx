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
import React, { useEffect, useState } from 'react';
import { useChains } from '../hooks/chains';
import { useWalletState } from '../state/wallet';
import SdkFunctionDisplay from './SdkFunctionDisplayer'; // Demo

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

  /* -- Start demo ---------------*/
  const [functionCall, setFunctionCall] = useState<{
    functionName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionArgs: any;
  }>({
    functionName: 'walletSdk.getChains',
    functionArgs: { networkId: wallet.selectedNetwork },
  });

  useEffect(() => {
    setFunctionCall({
      functionName: 'walletSdk.getChains',
      functionArgs: { networkId: wallet.selectedNetwork },
    });
  }, [wallet.selectedNetwork]);

  /* -- End demo ---------------*/

  const handleChainChange = (chainId: ChainId) => {
    onSelect(chainId);
  };

  return (
    <>
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
            onSelectionChange={(key) => handleChainChange(key as ChainId)}
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
        {/*
          This is for Demo purposes, displaying what SDK function is execution for this action
        */}
        <SdkFunctionDisplay
          functionName={functionCall.functionName}
          functionArgs={functionCall.functionArgs}
        />
      </Dialog>
    </>
  );
};
