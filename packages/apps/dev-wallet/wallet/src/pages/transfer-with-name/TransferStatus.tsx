import { Stack, Heading, Text, Table } from "@kadena/react-ui";
import { ITransferStatus } from "./TransferWithName";
import { ChainId } from "@kadena/client";
import { Status } from "./Status";

interface Props {
  chainId: ChainId;
  transferState: ITransferStatus;
}

export const TransferStatus = ({ chainId, transferState }: Props) => (
  <Stack direction={"column"} gap={"$md"}>
    <Stack direction="column">
      <Heading as="h6">Account discovery</Heading>
      <Text>
        Chain:{" "}
        <Text bold color="emphasize">
          {chainId}
        </Text>
      </Text>
      <Text>
        Account:{" "}
        <Text bold color="emphasize">
          {transferState.account}
        </Text>
      </Text>
      <Text>
        Pred:{" "}
        <Text bold color="emphasize">
          {transferState.guard?.pred}
        </Text>
      </Text>
      <Text>
        keys:{" "}
        <Text bold color="emphasize">
          [{transferState.guard?.keys.join(", ")}]
        </Text>
      </Text>
    </Stack>
    <Stack direction="column">
      <Heading as="h6">Gas estimation</Heading>
      {transferState.gasEstimation
        .filter(
          ({ balance, gas }) => balance && balance !== "0" && gas !== Infinity
        )
        .map((item) => (
          <Stack direction="row" gap="$md">
            <Text>
              Chain:{" "}
              <Text bold color="emphasize">
                {item.chainId}
              </Text>
            </Text>
            <Text>
              Balance:{" "}
              <Text bold color="emphasize">
                {item.balance}
              </Text>
            </Text>
            <Text>
              Gas:{" "}
              <Text bold color="emphasize">
                {item.gas}
              </Text>
            </Text>
          </Stack>
        ))}
    </Stack>
    <Stack direction="column" gap={"$md"}>
      <Heading as="h6">Optimal Transfers</Heading>
      <Table.Root striped={true}>
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Preflight</Table.Th>
            <Table.Th>RequestKey</Table.Th>
            <Table.Th>result</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {transferState.transactionsStatus.map((item) => (
            <Table.Tr key={item.chainId}>
              <Table.Td>{item.chainId}</Table.Td>
              <Table.Td>{item.amount}</Table.Td>
              <Table.Td>
                <Status>{item.preflight}</Status>
              </Table.Td>
              <Table.Td>{item.request?.requestKey}</Table.Td>
              <Table.Td>
                <Status>{item.finalResult}</Status>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  </Stack>
);
