"use client";

import {
  Box,
  Button,
  Heading,
  Input,
  Label,
  Select,
  Stack,
  SystemIcon,
  Text,
} from "@kadena/react-ui";

import { Link, useParams } from "react-router-dom";
import { useCrypto } from "@/hooks/crypto.context";
import { FormEvent, useState } from "react";
import { nameToChianId } from "@/utils/name-helpers";
import { createRegisterNameTx } from "./utils";
import { getClient } from "@/utils/helpers";
import { isSignedTransaction } from "@kadena/client";
import { useAccounts } from "@/hooks/accounts.hook";

export default function RegisterName() {
  const { account: accountKey } = useParams();
  const { accountsList, addAccount } = useAccounts();
  const wallet = useCrypto();
  const account = accountsList.find((ac) => ac.account === accountKey);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState<undefined | number>();
  const [isSuccessful, setIsSuccessful] = useState<any>(false);
  const [registering, setRegistering] = useState<any>(false);
  const [sender, setSender] = useState<string>(accountKey || "");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!error && chainId !== undefined && name && account) {
      setRegistering(true);
      const senderAccount = accountsList.find((ac) => ac.account === sender);
      if (!senderAccount) {
        throw new Error("sender account not found");
      }
      const tx = createRegisterNameTx(name, account, senderAccount);
      const signedTx = wallet.signTransaction(tx);
      console.log(signedTx);
      const { submit, preflight, listen } = getClient("l1");
      try {
        const res = await preflight(signedTx);
        if (!isSignedTransaction(signedTx)) {
          throw new Error("not signed transaction");
        }
        if (res.result.status === "failure") {
          throw new Error((res.result.error as any).message);
        }
        const request = await submit(signedTx);
        const response = await listen(request);
        console.log(response);
        if (response.result.status === "failure") {
          throw new Error((response.result.error as any).message);
        }
        addAccount({
          ...account,
          name,
        });
        setIsSuccessful(true);
      } catch (e: any) {
        setError(e.message);
      }
      setRegistering(false);
    }
  };

  if (!account) {
    return (
      <main>
        <Stack direction="column" gap="$md" margin="$md">
          <Heading as="h3">Register name</Heading>
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

  if (isSuccessful) {
    return (
      <main>
        <Stack direction="column" gap="$md" margin="$md">
          <Heading as="h3">Register name</Heading>
          <Stack direction="row" margin="$md" justifyContent="space-between">
            <Box margin="$md">
              <Text>
                Successfully registered name! Go to the{" "}
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
        <Heading as="h3">Register Name</Heading>
        <Heading as="h6">
          <Stack direction="row" gap="$xs" alignItems="center">
            <SystemIcon.BadgeAccount />
            {account.account}
          </Stack>
        </Heading>
        <Text>
          You can register a name for your account, this name will be unique
          across the entire network and no one else can register it even after
          kadena has 1000 chains
        </Text>
        <form onSubmit={onSubmit} autoComplete="off">
          <Stack direction="column" gap="$sm">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              outlined
              onChange={(e) => {
                try {
                  const id = nameToChianId(e.target.value);
                  setChainId(id);
                  setError("");
                } catch (e: any) {
                  setChainId(undefined);
                  setError(e.message);
                  console.log(e);
                }
                setName(e.target.value);
              }}
            />
            {chainId !== undefined && <Text>related chian: {chainId}</Text>}
            {error && <Text>error: {error}</Text>}
            <Box marginTop="$sm" />
            <Label htmlFor="select-sender">Select sender</Label>
            <Select
              id="select-sender"
              ariaLabel="Select sender"
              onChange={(event) => {
                setSender(event.target.value);
              }}
              value={sender}
            >
              {accountsList.map((account) => (
                <option key={account.account} value={account.account}>
                  {account.name
                    ? `${account.name} (${account.account})`
                    : account.account}
                </option>
              ))}
            </Select>
          </Stack>
          <Stack direction="row" margin="$md" justifyContent="flex-start">
            <Button
              type="submit"
              disabled={Boolean(
                error ||
                  chainId === undefined ||
                  !name ||
                  !account ||
                  registering
              )}
            >
              Register
            </Button>

            {registering && <SystemIcon.Loading />}
          </Stack>
        </form>
      </Stack>
    </main>
  );
}
