import { MonoFormatListBulleted } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Cell,
  Column,
  ContentHeader,
  Divider,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
  Text,
  TextField,
} from '@kadena/kode-ui';

import { useState } from 'react';
import SdkFunctionDisplay from '../components/SdkFunctionDisplayer'; // Demo
import { TextEllipsis } from '../components/Text';
import { useAccountsByPublicKey } from '../hooks/accountsByPublickey';

export const AccountsByPublicKey = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [fungibleName, setFungibleName] = useState<string>('');

  const { accounts, functionCalls, error, isLoading, refetch } =
    useAccountsByPublicKey(publicKey, fungibleName);

  const handleFetchAccounts = () => {
    refetch();
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <Card fullWidth>
        <ContentHeader
          heading="Accounts"
          description="View accounts associated with your public key."
          icon={<MonoFormatListBulleted />}
        />

        <Divider />

        <Stack flexDirection="column" gap="md" className="mb-6">
          <Text variant="ui" bold>
            Fetch Accounts
          </Text>
          <Stack flexDirection="row" gap="md">
            <TextField
              label="Public Key"
              placeholder="Enter public key"
              value={publicKey}
              onValueChange={setPublicKey}
              size="md"
            />
            <TextField
              label="Fungible Name"
              placeholder="Enter fungible name"
              value={fungibleName}
              onValueChange={setFungibleName}
              size="md"
            />
            <Button
              variant="primary"
              onPress={handleFetchAccounts}
              isDisabled={!publicKey || !fungibleName}
            >
              Fetch
            </Button>
          </Stack>
        </Stack>

        <Divider />

        {error && (
          <Text variant="ui" className="mb-4">
            Error fetching accounts: {error.message}
          </Text>
        )}

        {isLoading && (
          <Stack alignItems="center" justifyContent="center" className="py-10">
            <Text variant="ui" className="mt-4">
              Loading accounts...
            </Text>
          </Stack>
        )}

        {!isLoading && !error && (
          <Stack flexDirection="column" gap="md">
            <Text variant="ui" bold>
              Associated accounts
            </Text>

            {accounts?.length ? (
              <Table aria-label="Associated Accounts">
                <TableHeader>
                  <Column>Account Name</Column>
                  <Column>Chain</Column>
                </TableHeader>
                <TableBody>
                  {accounts.map((accountItem, index) => (
                    <Row key={`associated-account-${index}`}>
                      <Cell>
                        <TextEllipsis maxLength={15} withCopyButton>
                          {accountItem.accountName}
                        </TextEllipsis>
                      </Cell>
                      <Cell>
                        {accountItem.chainAccounts.map((chain, chainIndex) => (
                          <div key={`chain-${chainIndex}`}>
                            {chain.chainId} ({chain.accountName})
                          </div>
                        ))}
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Text variant="ui">No associated accounts</Text>
            )}
          </Stack>
        )}
      </Card>

      {/*
        This is for Demo purposes, displaying what SDK function is executed for this action
      */}
      {functionCalls.map((data, index) => (
        <SdkFunctionDisplay key={`display-${index}`} data={data} />
      ))}
    </div>
  );
};

export default AccountsByPublicKey;
