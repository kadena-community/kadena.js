"use client";

import {
  Box,
  Button,
  Heading,
  Label,
  Stack,
  SystemIcon,
  Table,
  Text,
} from "@kadena/react-ui";
import { useCrypto } from "@/hooks/crypto.context";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createPrincipal } from "./api";
import AccountCreated from "./AccountCreated";
import { useAccounts } from "@/hooks/accounts.hook";

const { Body, Td, Tr } = Table;

export default function CreateAccount() {
  const wallet = useCrypto();
  const { addAccount } = useAccounts();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<
    "keys-all" | "keys-one" | "keys-two"
  >("keys-all");

  const [account, setAccount] = useState<string | undefined | null>(undefined);

  const onGenerateAccount = async () => {
    try {
      setAccount(null);
      const res = await createPrincipal(selectedKeys, constraints);
      setAccount(res);
      addAccount({
        account: res,
        pred: constraints,
        keys: selectedKeys,
      });
    } catch (e) {
      console.error(e);
      setAccount(undefined);
    }
  };

  if (account) {
    return <AccountCreated account={account} />;
  }

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Create Account</Heading>
        <Stack direction="column" margin="$md" justifyContent="space-between">
          <Box>
            <Heading as="h6">Select keys</Heading>
            <Text>
              Your account will be guarded by the selected keys. Need more keys?
              go to <Link to="/keys">Key management</Link>
            </Text>
          </Box>

          <Box marginTop="$md">
            <Table.Root striped={true}>
              <Body>
                {wallet.publicKeys.map((key) => (
                  <Tr key={key}>
                    <Td>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" gap="$xs">
                          <input
                            type="checkbox"
                            checked={selectedKeys.includes(key)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedKeys([...selectedKeys, key]);
                              } else {
                                setSelectedKeys(
                                  selectedKeys.filter((k) => k !== key)
                                );
                              }
                            }}
                          />
                          <SystemIcon.KeyIconFilled />
                          <Text variant="code">{key}</Text>
                        </Stack>
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Body>
            </Table.Root>
          </Box>
          {selectedKeys.length > 0 && (
            <Stack direction="column" gap="$xs" marginTop="$md">
              <Box>
                <Heading as="h6">Constraints</Heading>
                <Text>
                  How many keys of {selectedKeys.length} selected keys are
                  required to sign transactions?
                </Text>
              </Box>
              <div
                onChange={(event) => {
                  setConstraints((event.target as any).value);
                }}
              >
                <Stack gap="$1">
                  <input
                    id="keys-one"
                    checked={constraints === "keys-one"}
                    type="radio"
                    value="keys-one"
                  />
                  <Label htmlFor="keys-one">One</Label>
                </Stack>
                <Stack gap="$1">
                  <input
                    id="keys-two"
                    checked={constraints === "keys-two"}
                    type="radio"
                    value="keys-two"
                  />
                  <Label htmlFor="keys-two">Two</Label>
                </Stack>
                <Stack gap="$1">
                  <input
                    id="keys-all"
                    checked={constraints === "keys-all"}
                    type="radio"
                    value="keys-all"
                  />
                  <Label htmlFor="keys-all">All</Label>
                </Stack>
                <Box marginTop="$md">
                  <Button
                    onClick={onGenerateAccount}
                    icon="Plus"
                    disabled={account === null}
                  >
                    generate
                  </Button>
                </Box>
              </div>
            </Stack>
          )}
        </Stack>
      </Stack>
    </main>
  );
}
