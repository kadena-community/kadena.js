"use client";

import {
  Box,
  Button,
  Card,
  Heading,
  Stack,
  SystemIcon,
  Table,
  Text,
} from "@kadena/react-ui";
import { Link, useParams } from "react-router-dom";
import { FeatureFlag, hasFlag } from "@/components/FeatureFlag";
import { AccountItem } from "./components/AccountItem";
import { getAccountBalance } from "@/utils/transfer";
import { useEffect, useState } from "react";
import { PactNumber } from "@kadena/pactjs";
import { useAccounts } from "@/hooks/accounts.hook";

// const predDescription = {
//   "keys-one": "only one of the keys needs to sign the transitions",
//   "keys-two": "at least two of the keys must sign the transitions",
//   "keys-all": "all of the keys need to sign the transitions",
// };

interface Transaction {
  fromAccount: string;
  height: number;
  amount: string;
  crossChainId: null | number;
  toAccount: string;
  blockTime: string;
  requestKey: string;
  token: string;
  blockHash: string;
  idx: number;
  chain: number;
  crossChainAccount: null;
  gas?: string;
}

export default function Account() {
  const { accountsList } = useAccounts();
  const { account: accountKey } = useParams();
  const account = accountsList.find((ac) => ac.account === accountKey);
  const [balance, setBalance] = useState("0");
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    const url = `http://localhost:8080/txs/account/${accountKey}?limit=5000`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(setTxs);
  }, [accountKey]);

  useEffect(() => {
    if (account)
      getAccountBalance(account.account).then((item) => {
        const overallBalance = item.reduce(
          (acc, item) => acc.plus(item.balance),
          new PactNumber(0)
        );
        setBalance(overallBalance.toString());
      });
  }, [account]);

  if (!account) {
    return (
      <main>
        <Stack direction="column" gap="$md" margin="$md">
          <Heading as="h3">Account</Heading>
          <Stack direction="row" margin="$md" justifyContent="space-between">
            <Box margin="$md">
              <Text>
                Invalid account name! Go to the{" "}
                <Link to="/accounts">accounts</Link> page
              </Text>
            </Box>
          </Stack>
        </Stack>
      </main>
    );
  }

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Account</Heading>
        <Stack
          direction="row"
          margin="$md"
          marginBottom="$0"
          justifyContent="space-between"
        >
          <Box>
            <Heading as="h6">
              <FeatureFlag name="registry">
                {account.name && (
                  <Box marginTop="$sm">
                    <Stack gap="$1">
                      Name: <SystemIcon.Earth /> {account.name}
                    </Stack>
                  </Box>
                )}
              </FeatureFlag>
            </Heading>
            {hasFlag("registry") && account.name ? (
              <Text>
                <AccountItem account={account} />
              </Text>
            ) : (
              <Heading as="h6">
                <AccountItem account={account} />
              </Heading>
            )}
            <FeatureFlag name="registry">
              {!account.name && (
                <Box marginTop="$sm">
                  <Text color="emphasized">
                    Too long! no worries,{" "}
                    <Link
                      to={`/register-name/${encodeURIComponent(
                        account.account
                      )}`}
                    >
                      register a name
                    </Link>
                  </Text>
                </Box>
              )}
            </FeatureFlag>
          </Box>
        </Stack>
        <Stack marginLeft="$md" direction="column">
          <Box>
            <Text>
              Balance{" "}
              <Text variant="code" bold color="emphasize">
                {balance}
              </Text>{" "}
              KDA
            </Text>
          </Box>
          <Stack
            marginTop="$lg"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Heading as="h6">Transactions History</Heading>
            <Link to={`/accounts/${account.account}/transfer`}>
              <Button>Transfer</Button>
            </Link>
          </Stack>

          {!txs.length && (
            <Card fullWidth>
              <Stack direction={"row"}>
                <Text>No transaction</Text>
              </Stack>
            </Card>
          )}
          {txs.length > 0 && (
            <Box marginTop="$md">
              <Table.Root striped={true}>
                <Table.Head>
                  <Table.Tr>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Chain</Table.Th>
                  </Table.Tr>
                </Table.Head>
                <Table.Body>
                  {txs
                    .filter(({ token, idx }) => token === "coin" && idx !== 0)
                    .map((tx) => {
                      const isDebit = tx.fromAccount === account.account;
                      const targetAccount = isDebit
                        ? tx.toAccount
                        : tx.fromAccount;

                      const name =
                        accountsList.find((ac) => ac.account === targetAccount)
                          ?.name || "";
                      return (
                        <Table.Tr key={tx.requestKey}>
                          <Table.Td>
                            {name
                              ? `${name} (${targetAccount})`
                              : targetAccount}
                          </Table.Td>
                          <Table.Td>
                            <div
                              style={{
                                padding: "0 5px",
                                background: isDebit ? "gray" : "green",
                                color: "white",
                                display: "inline-block",
                                borderRadius: "5px",
                              }}
                            >
                              {new PactNumber(tx.amount).toString()}
                            </div>
                          </Table.Td>
                          <Table.Td>{tx.blockTime}</Table.Td>
                          <Table.Td>{tx.chain}</Table.Td>
                        </Table.Tr>
                      );
                    })}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Stack>
      </Stack>
    </main>
  );
}
