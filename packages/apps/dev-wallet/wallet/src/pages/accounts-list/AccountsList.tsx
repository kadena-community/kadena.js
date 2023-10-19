"use client";

import {
  Box,
  Button,
  ContentHeader,
  Heading,
  IconButton,
  Stack,
  SystemIcon,
  Table,
  Text,
} from "@kadena/react-ui";
import { useCopyToClipboard } from "usehooks-ts";
import { Link } from "react-router-dom";
import { FeatureFlag } from "@/components/FeatureFlag";
import { useAccounts } from "@/hooks/accounts.hook";

const { Body, Td, Tr } = Table;

export default function AccountsList() {
  const { accountsList } = useAccounts();
  const [, copy] = useCopyToClipboard();

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Accounts</Heading>
        <Stack direction="row" margin="$md" justifyContent="space-between">
          <Box margin="$md">
            <ContentHeader
              heading="Accounts List"
              icon="BadgeAccount"
              description="See the accounts you have created."
            />
          </Box>
          <Box margin="$md">
            <Link to="/create-account">
              <Button icon="Plus">Create Account</Button>
            </Link>
          </Box>
        </Stack>
        <Table.Root striped={true}>
          <Body>
            {accountsList.map((account) => (
              <Tr key={account.account}>
                <Td>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap="$xs">
                      <SystemIcon.BadgeAccount />
                      <FeatureFlag name="registry">
                        {account.name && <Text bold>{account.name} </Text>}
                      </FeatureFlag>
                      <Text variant="code">{account.account}</Text>
                    </Stack>
                    <Stack>
                      <Link
                        to={`/accounts/${encodeURIComponent(account.account)}`}
                      >
                        <Box padding="$sm">
                          <Text color="emphasize" bold>
                            Open
                          </Text>
                        </Box>
                      </Link>
                      <IconButton
                        icon="ContentCopy"
                        title="Copy key"
                        onClick={() => copy(account.account)}
                      />
                    </Stack>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Body>
        </Table.Root>
      </Stack>
    </main>
  );
}
