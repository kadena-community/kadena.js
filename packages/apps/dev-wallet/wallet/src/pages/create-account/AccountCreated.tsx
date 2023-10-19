"use client";

import { FeatureFlag } from "@/components/FeatureFlag";
import {
  Box,
  Card,
  Heading,
  IconButton,
  Stack,
  SystemIcon,
  Text,
} from "@kadena/react-ui";

import { Link } from "react-router-dom";

import { useCopyToClipboard } from "usehooks-ts";

export default function AccountCreated({ account }: { account: string }) {
  const [, copy] = useCopyToClipboard();

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Create Account</Heading>
        <Stack direction="column" margin="$md" justifyContent="space-between">
          <Heading as="h6">Account created</Heading>
          <Card>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" gap="$xs">
                <SystemIcon.BadgeAccount />
                <Text bold size="lg" variant="code">
                  {account}
                </Text>
              </Stack>
              <Stack>
                <IconButton
                  icon="ContentCopy"
                  title="Copy key"
                  onClick={() => copy(account)}
                />
              </Stack>
            </Stack>
          </Card>
          <FeatureFlag name="registry">
            <Box>
              <Text color="emphasize" bold>
                Too long! no worries, you can register a name for your account.
                We will guide you through the account page.
              </Text>
            </Box>
          </FeatureFlag>
          <Box marginTop="$md">
            <Text>
              You can use your account now through{" "}
              <Link to={`/accounts/${encodeURIComponent(account)}`}>
                Your Account
              </Link>{" "}
              page.
            </Text>
          </Box>
        </Stack>
      </Stack>
    </main>
  );
}
