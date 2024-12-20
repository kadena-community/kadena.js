import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import { Box, Button, Heading, Notification, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';

import { ExistingTransactionList } from './ExistingTransactionList';
import { TransactionFileUpload } from './TransactionFileUpload';
import { TransactionInputArea } from './TransactionInputArea';
import { TransactionList } from './TransactionList';
import { useSignatureBuilder } from './useSignatureBuilder';

export function SignatureBuilder() {
  const {
    input,
    schema,
    error,
    transactions,
    existingTransactions,
    canReviewTransactions,
    processSigData,
    setInput,
    removeTransaction,
    reviewTransaction,
  } = useSignatureBuilder();

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboardCustomize />} isGlobal>
        <SideBarBreadcrumbsItem href="/sig-builder">
          Sig Builder
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" gap="md" width="100%">
        <Heading as="h4">
          Paste or Upload SigData, CommandSigData, or Payload
        </Heading>

        <TransactionInputArea
          input={input}
          error={error}
          onChange={(val) => {
            setInput(val);
            processSigData(val);
          }}
        />

        <TransactionFileUpload
          onError={(message) => {
            console.error(message);
          }}
          onProcess={(data) => {
            // Directly process the file content as input
            processSigData(data);
            setInput(data);
          }}
        />

        {schema === 'signingRequest' && (
          <Notification intent="info" role="status">
            SigningRequest is not supported yet. We are working on it.
          </Notification>
        )}

        <TransactionList
          transactions={transactions}
          onRemove={removeTransaction}
        />

        {canReviewTransactions && (
          <Box>
            <Button onPress={reviewTransaction}>Review Transaction(s)</Button>
          </Box>
        )}

        <ExistingTransactionList
          transactions={existingTransactions}
          onRemove={removeTransaction}
        />
      </Stack>
    </>
  );
}
