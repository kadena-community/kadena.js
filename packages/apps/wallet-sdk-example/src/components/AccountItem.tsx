import { ChainId } from '@kadena/client';
import React, { useEffect, useState } from 'react';
import { createAndTransferFund } from '../domain/fund';
import { useChains } from '../hooks/chains';
import { useAddressToName } from '../hooks/kadenaNames/kadenaNamesResolver';
import type { Account } from '../state/wallet';
import { useWalletState } from '../state/wallet';
import { NameRegistrationModal } from './kadenaNames/NameRegistrationModal';
import { TextEllipsis } from './Text';

interface AccountItemProps {
  account: Account;
  accountsBalances: Record<string, string>;
  loadingBalance: boolean;
  onRegistered: () => void;
  refreshKey: number;
}

export const AccountItem: React.FC<AccountItemProps> = ({
  account,
  accountsBalances,
  loadingBalance,
  onRegistered,
  refreshKey,
}) => {
  const wallet = useWalletState();
  const [modalVisible, setModalVisible] = useState(false);
  const [chainModalVisible, setChainModalVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState(wallet.selectedChain);

  const {
    name: resolvedName,
    loading: nameLoading,
    setAddress,
  } = useAddressToName(refreshKey, wallet.selectedNetwork);

  useEffect(() => {
    setAddress(account.name);
  }, [account.name, setAddress, refreshKey]);

  const openRegisterModal = () => setModalVisible(true);
  const closeRegisterModal = () => setModalVisible(false);

  const openChainModal = () => setChainModalVisible(true);
  const closeChainModal = () => setChainModalVisible(false);

  const onFundAccount = async () => {
    const result = await createAndTransferFund({
      account: {
        name: account.name,
        publicKeys: [account.publicKey],
        predicate: 'keys-all',
      },
      config: {
        amount: '10',
        contract: 'coin',
        chainId: selectedChain,
        networkId: wallet.selectedNetwork,
      },
    });
    alert(`Fund transaction submitted: ${result.requestKey}`);
  };

  const submitModal = () => {
    closeChainModal();
    onFundAccount();
  };

  return (
    <>
      <div className="bg-medium-slate p-4 rounded-lg shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">Index:</span>
          <span className="text-white">{account.index}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">Account:</span>
          <span className="text-white">
            <TextEllipsis maxLength={15} withCopyButton>
              {account.name}
            </TextEllipsis>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">Balance:</span>
          <span className="text-white">
            {loadingBalance
              ? 'Loading...'
              : accountsBalances[account.name] ?? '0'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">
            Kadena Name:
          </span>
          {nameLoading ? (
            <p className="text-text-secondary">Loading...</p>
          ) : resolvedName ? (
            <p className="text-white">{resolvedName}</p>
          ) : (
            <button
              onClick={openRegisterModal}
              className="bg-primary-green text-white font-semibold py-1 px-3 rounded-md hover:bg-secondary-green transition"
            >
              Register Name
            </button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">Fund:</span>
          <button
            onClick={openChainModal}
            className="bg-primary-green text-white font-semibold py-1 px-3 rounded-md hover:bg-secondary-green transition"
          >
            Fund
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-secondary">Active:</span>
          {wallet.account?.index === account.index ? (
            <button
              disabled
              className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md cursor-not-allowed"
            >
              Selected
            </button>
          ) : (
            <button
              onClick={() => wallet.selectAccount(account.index)}
              className="bg-primary-green text-white font-semibold py-1 px-3 rounded-md hover:bg-secondary-green transition"
            >
              Select
            </button>
          )}
        </div>
      </div>
      {modalVisible && (
        <NameRegistrationModal
          owner={account.name}
          address={account.name}
          onClose={closeRegisterModal}
          onRegistered={() => {
            onRegistered();
            closeRegisterModal();
          }}
          balance={parseInt(accountsBalances[account.name], 10) ?? 0}
        />
      )}
      {chainModalVisible && (
        <ChainSelectionModal
          onSelect={setSelectedChain}
          onClose={closeChainModal}
          currentChain={selectedChain}
          submit={submitModal}
        />
      )}
    </>
  );
};

// Chain Selection Modal component
interface ChainSelectionModalProps {
  onSelect: (chainId: ChainId) => void;
  onClose: () => void;
  currentChain: ChainId;
  submit: () => void;
}

const ChainSelectionModal: React.FC<ChainSelectionModalProps> = ({
  onSelect,
  onClose,
  currentChain,
  submit,
}) => {
  const wallet = useWalletState();
  const { chains } = useChains(wallet.selectedNetwork);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        style={{
          backgroundColor: '#1B2330',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Select Chain
        </h2>
        <select
          value={currentChain}
          onChange={(e) => onSelect(e.target.value as ChainId)}
          className="w-full p-2 mb-4 text-white bg-dark-slate rounded-md"
        >
          {chains.map((chain) => (
            <option key={chain} value={chain}>
              Chain {chain}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          className="w-full bg-primary-green text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary-green transition mb-2"
        >
          Confirm
        </button>
        <button onClick={onClose} className="w-full text-white underline">
          Cancel
        </button>
      </div>
    </div>
  );
};
