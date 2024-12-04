import { Badge, Button, Card, Divider, Stack, Text } from '@kadena/kode-ui';
import React, { useEffect, useState } from 'react';
import { createAndTransferFund } from '../domain/fund';
import { useFunctionTracker } from '../hooks/functionTracker';
import { useFund } from '../hooks/fund';
import { useAddressToName } from '../hooks/kadenaNames/kadenaNamesResolver';
import { chainwebHostMap } from '../host';
import type { Account } from '../state/wallet';
import { useWalletState } from '../state/wallet';
import { AlertDialog } from './AlertDialog';
import { ChainSelectionModal } from './ChainSelectorModal';
import { NameRegistrationModal } from './kadenaNames/NameRegistrationModal';
import SdkFunctionDisplay from './SdkFunctionDisplayer'; // Import SdkFunctionDisplay
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
  // const [selectedChain, setSelectedChain] = useState(wallet.selectedChain);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const { onFundOtherFungible } = useFund();

  const trackGetAccountDetails = useFunctionTracker(
    'walletSdk.getAccountDetails',
  );

  const {
    name: resolvedName,
    loading: nameLoading,
    setAddress,
    trackAddressToName,
  } = useAddressToName(refreshKey, wallet.selectedNetwork);

  useEffect(() => {
    setAddress(account.name);
  }, [account.name, setAddress, refreshKey]);

  /* -- Start demo ---------------*/
  useEffect(() => {
    trackGetAccountDetails.setArgs({
      accountName: account.name,
      networkId: wallet.selectedNetwork,
      fungible: wallet.selectedFungible,
      chainIds: [wallet.selectedChain],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account.name,
    wallet.selectedNetwork,
    wallet.selectedFungible,
    wallet.selectedChain,
  ]);
  /* -- End demo ---------------*/

  const openRegisterModal = () => setModalVisible(true);
  const closeRegisterModal = () => setModalVisible(false);

  const openChainModal = () => setChainModalVisible(true);
  const closeChainModal = () => setChainModalVisible(false);

  const onFundAccount = async () => {
    try {
      const result = await createAndTransferFund({
        account: {
          name: account.name,
          publicKeys: [account.publicKey],
          predicate: 'keys-all',
        },
        config: {
          amount: '20',
          contract: 'coin',
          chainId: wallet.selectedChain,
          networkId: wallet.selectedNetwork,
        },
      });
      setAlertMessage(`Fund transaction submitted: ${result.requestKey}`);
    } catch (error) {
      setAlertMessage(
        error instanceof Error ? error.message : 'Failed to fund the account.',
      );
    }
  };

  const submitModal = () => {
    closeChainModal();
    onFundAccount();
  };

  const accountBalanceRaw = accountsBalances[account.name];
  const accountBalance =
    accountBalanceRaw !== undefined && accountBalanceRaw !== null
      ? Number(accountBalanceRaw)
      : 0;

  const badgeVariant = accountBalance > 0 ? 'positive' : 'negative';

  return (
    <>
      <Divider />
      <Card fullWidth>
        <Stack flexDirection="column" gap="xs">
          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Index:
            </Text>
            <Badge size="sm" style="info">
              {account.index}
            </Badge>
          </Stack>

          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Account:
            </Text>
            <TextEllipsis maxLength={15} withCopyButton>
              {account.name}
            </TextEllipsis>
          </Stack>

          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Balance:
            </Text>
            <Badge size="sm" style={badgeVariant}>
              {loadingBalance ? 'Loading...' : accountBalance.toLocaleString()}
            </Badge>
          </Stack>

          {/* Kadena Name */}
          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Kadena Name:
            </Text>
            {nameLoading ? (
              <Text>Loading...</Text>
            ) : resolvedName ? (
              <Text>{resolvedName}</Text>
            ) : (
              <Button variant="primary" onPress={openRegisterModal} isCompact>
                Register Name
              </Button>
            )}
          </Stack>

          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Fund:
            </Text>
            <Stack flexDirection="row" gap="xs">
              <Button
                variant="primary"
                onPress={() => {
                  const allowedNetworks = Object.keys(chainwebHostMap).filter(
                    (network) => network !== 'mainnet01',
                  );

                  if (!allowedNetworks.includes(wallet.selectedNetwork)) {
                    return setAlertMessage(
                      `Funding can only be done on Testnet(s)`,
                    );
                  }

                  openChainModal();
                }}
                isCompact
              >
                Fund
              </Button>
              <Button variant="info" onPress={onFundOtherFungible} isCompact>
                Fund Other
              </Button>
            </Stack>
          </Stack>

          <Stack justifyContent="space-between" alignItems="center">
            <Text variant="ui" bold>
              Active:
            </Text>
            {wallet.account?.index === account.index ? (
              <Badge size="sm" style="default">
                Selected
              </Badge>
            ) : (
              <Button
                variant="primary"
                onPress={() => wallet.selectAccount(account.index)}
                isCompact
              >
                Select
              </Button>
            )}
          </Stack>

          {/* -- Start demo ---------------*/}
          {/* Display the SDK function call for getAccountDetails */}
          {trackGetAccountDetails && (
            <SdkFunctionDisplay data={trackGetAccountDetails.data} />
          )}

          {/* Display the SDK function call for addressToName */}
          {trackAddressToName && (
            <SdkFunctionDisplay data={trackAddressToName} />
          )}
          {/* -- End demo ---------------*/}
        </Stack>
      </Card>

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
          onSelect={wallet.selectChain}
          onClose={closeChainModal}
          submit={submitModal}
        />
      )}

      {alertMessage && (
        <AlertDialog
          title="Message"
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
          autoClose={true}
        />
      )}
    </>
  );
};
