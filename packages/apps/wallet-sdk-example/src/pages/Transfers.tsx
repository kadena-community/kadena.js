import { MonoFormatListBulleted } from '@kadena/kode-icons/system';
import {
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
} from '@kadena/kode-ui';

import SdkFunctionDisplay from '../components/SdkFunctionDisplayer'; // Demo
import { TextEllipsis } from '../components/Text';
import { useTransfers } from '../hooks/transfers';

export const Transfers = () => {
  const { transfers, pendingTransfers, account, functionCalls } =
    useTransfers();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAmountStyle = (transfer: any) => {
    if (!transfer.success) return 'text-default';
    return transfer.senderAccount === account
      ? 'text-negative'
      : 'text-positive';
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <Card fullWidth>
        <ContentHeader
          heading="Transfers"
          description="View and manage your pending and completed transfers."
          icon={<MonoFormatListBulleted />}
        />

        <Divider />
        {/* Pending Transfers */}
        <Stack flexDirection="column" gap="md" marginBlockEnd="md">
          <Text variant="ui" bold>
            Pending Transfers
          </Text>

          {pendingTransfers?.length ? (
            <Table aria-label="Pending Transfers">
              <TableHeader>
                <Column>Request Key</Column>
                <Column>Chain</Column>
                <Column>Sender</Column>
                <Column>Receiver</Column>
                <Column>Amount</Column>
                <Column>Status</Column>
              </TableHeader>
              <TableBody>
                {pendingTransfers.map((transfer, index) => (
                  <Row key={`pending-${index}`}>
                    <Cell>
                      <TextEllipsis maxLength={10} withCopyClick>
                        {transfer.requestKey}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      {transfer.toChain
                        ? `${transfer.chainId} → ${transfer.toChain}`
                        : transfer.chainId}
                    </Cell>
                    <Cell>
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.senderAccount}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.receiverAccount}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      <Text variant="ui" bold>
                        {transfer.amount}
                      </Text>
                    </Cell>
                    <Cell>
                      <Text variant="ui" bold>
                        Pending
                      </Text>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Text variant="ui">No pending transfers</Text>
          )}
        </Stack>

        <Divider />
        {/* Completed Transfers */}
        <Stack flexDirection="column" gap="md">
          <Text variant="ui" bold>
            Completed Transfers
          </Text>

          {transfers?.length ? (
            <Table aria-label="Completed Transfers">
              <TableHeader>
                <Column>Request Key</Column>
                <Column>Chain</Column>
                <Column>Sender</Column>
                <Column>Receiver</Column>
                <Column>Amount</Column>
                <Column>Status</Column>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer, index) => (
                  <Row key={`completed-transfer-${index}`}>
                    <Cell>
                      <TextEllipsis maxLength={10} withCopyClick>
                        {transfer.requestKey}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      {transfer.isCrossChainTransfer
                        ? `${transfer.chainId} → ${transfer.targetChainId}`
                        : transfer.chainId}
                    </Cell>
                    <Cell>
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.senderAccount}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.receiverAccount}
                      </TextEllipsis>
                    </Cell>
                    <Cell>
                      <Stack flexDirection="column">
                        <Text className={getAmountStyle(transfer)}>
                          {transfer.senderAccount === account
                            ? `-${transfer.amount}`
                            : `+${transfer.amount}`}
                        </Text>
                        {transfer.transactionFeeTransfer && (
                          <Text className="text-negative">
                            {`-${transfer.transactionFeeTransfer.amount}`}
                          </Text>
                        )}
                      </Stack>
                    </Cell>
                    <Cell>
                      <Text variant="ui" bold>
                        {transfer.success
                          ? transfer.isCrossChainTransfer
                            ? transfer.continuation
                              ? transfer.continuation.success
                                ? 'Finished'
                                : 'Finish failed'
                              : 'Awaiting completion'
                            : 'Success'
                          : 'Failed'}
                      </Text>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Text variant="ui">No completed transfers</Text>
          )}
        </Stack>
      </Card>

      {/*
        This is for Demo purposes, displaying what SDK function is execution for this action
      */}
      {functionCalls.map((data, index) => (
        <SdkFunctionDisplay key={`display-${index}`} data={data} />
      ))}
    </div>
  );
};
