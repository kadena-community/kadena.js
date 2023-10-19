"use client";

import {
  Box,
  Button,
  Heading,
  Input,
  Label,
  Stack,
  SystemIcon,
  Text,
} from "@kadena/react-ui";

import { Link, useParams } from "react-router-dom";
import { useCrypto } from "@/hooks/crypto.context";
import { FormEvent, useEffect, useState } from "react";
import { nameToChianId } from "@/utils/name-helpers";
import { getClient } from "@/utils/helpers";
import {
  ChainId,
  ICommand,
  ITransactionDescriptor,
  IUnsignedCommand,
} from "@kadena/client";
import {
  createTransferTransactions,
  estimateTransferGas,
  getAccountBalance,
  getOptimalTransfers,
} from "../../utils/transfer";
import { getAccountTx, getNameGuardTx } from "./getName";
import { PactNumber } from "@kadena/pactjs";
import { TransferStatus } from "./TransferStatus";
import { FeatureFlag, hasFlag } from "@/components/FeatureFlag";
import { AccountItem } from "../account/components/AccountItem";
import { Account, useAccounts } from "@/hooks/accounts.hook";

export interface ITransferStatus {
  account?: string;
  guard?: { pred: "keys-all" | "keys-one" | "keys-two"; keys: string[] };
  gasEstimation: Array<{
    gas: number;
    balance: string;
    chainId: ChainId;
  }>;
  signedTxs?: ICommand[];
  transactionsStatus: Array<{
    amount: string;
    chainId: ChainId;
    gasLimit: number;
    preflight?: "success" | "failure";
    request?: ITransactionDescriptor;
    finalResult?: "success" | "failure";
  }>;
}

const client = getClient("l1");

export default function TransferWithName() {
  const { account: accountKey } = useParams();
  const { accountsList } = useAccounts();
  const [transferMode, setTransferMode] = useState<"name" | "account">("name");
  const [inputReceiverAccount, setReceiverAccount] = useState<string>("");
  const wallet = useCrypto();
  const account = accountsList.find((ac) => ac.account === accountKey);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState<undefined | ChainId>();
  const [isSuccessful, setIsSuccessful] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [balanceList, setBalanceList] = useState<
    Array<{ balance: string; chainId: ChainId }>
  >([]);
  const overallBalance = balanceList.reduce(
    (acc, item) => acc.plus(item.balance),
    new PactNumber(0)
  );

  const [transferState, setTransferState] = useState<ITransferStatus>({
    gasEstimation: [],
    transactionsStatus: [],
  });

  const submitDisabled: boolean =
    Boolean(error) ||
    ((!receiver || chainId === undefined) && transferMode === "name") ||
    (inputReceiverAccount.length !== 66 && transferMode === "account") ||
    !account ||
    !balanceList.length ||
    overallBalance.isLessThanOrEqualTo(amount);

  useEffect(() => {
    if (account) getAccountBalance(account.account).then(setBalanceList);
  }, [account]);

  async function getReceiverAccount(): Promise<Account> {
    if (transferMode === "account") {
      const guard = {
        keys: [inputReceiverAccount.split(":")[1]],
        pred: "keys-all" as const,
      };
      setTransferState((prevState) => ({
        ...prevState,
        guard,
        account: inputReceiverAccount,
      }));
      return {
        ...guard,
        name: "",
        account: inputReceiverAccount,
      };
    }
    const guardTx = getNameGuardTx(receiver);
    const accountTx = getAccountTx(receiver);

    const result: [
      string,
      {
        guard: {
          keys: string[];
          pred: "keys-all" | "keys-one" | "keys-two";
        };
      }
    ] = (await Promise.all([
      client
        .dirtyRead(accountTx)
        .then((res) =>
          res.result.status === "success" ? (res.result.data as string) : null
        )
        .then((res) => {
          console.log("account", res);
          setTransferState((prevState) => ({
            ...prevState,
            account: res ?? undefined,
          }));
          return res;
        }),
      client
        .dirtyRead(guardTx)
        .then((res) =>
          res.result.status === "success"
            ? (res.result.data as unknown as {
                guard: {
                  keys: string[];
                  pred: "keys-all" | "keys-one" | "keys-two";
                };
              })
            : null
        )
        .then((res) => {
          setTransferState((prevState) => ({
            ...prevState,
            guard: res?.guard,
          }));
          return res;
        }),
    ])) as any;

    if (!result[0]) {
      throw new Error("account not found");
    }

    const receiverAccount: Account = {
      name: receiver,
      account: result[0],
      keys: result[1].guard.keys,
      pred: result[1].guard.pred,
    };

    return receiverAccount;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitDisabled) return;

    setLoading(true);
    try {
      const receiverAccount: Account = await getReceiverAccount();

      const balancesWithGas = await Promise.all(
        balanceList.map(async (item) => ({
          ...item,
          gas: await estimateTransferGas(
            account!,
            receiverAccount,
            item.chainId,
            wallet.signTransaction
          ),
        }))
      );

      setTransferState((prevState) => ({
        ...prevState,
        gasEstimation: balancesWithGas,
      }));

      console.log("balancesWithGas", balancesWithGas);

      const optimalBalances = getOptimalTransfers(balancesWithGas, amount);

      setTransferState((prevState) => ({
        ...prevState,
        transactionsStatus: optimalBalances ?? [],
      }));

      const txs: IUnsignedCommand[] | null = createTransferTransactions(
        account!,
        receiverAccount,
        amount,
        balancesWithGas
      );

      if (!txs) {
        throw new Error("no txs");
      }

      const signedTxs = txs.map((tx) =>
        wallet.signTransaction(tx)
      ) as ICommand[];

      const preResult = await Promise.all(
        signedTxs.map((tx) =>
          client.preflight(tx).then((res) => res.result.status)
        )
      );

      const upd = preResult.map((res, idx) => ({
        ...optimalBalances![idx],
        preflight: res,
      }));

      setTransferState((prevState) => ({
        ...prevState,
        transactionsStatus: upd,
      }));

      console.log(preResult);

      const preflightSuccessful = preResult.every((res) => res === "success");

      if (!preflightSuccessful) {
        throw new Error("preflight failed");
      }

      setTransferState((prevState) => ({ ...prevState, signedTxs }));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  async function doTheTransfer() {
    const { signedTxs } = transferState;
    if (!signedTxs) throw new Error("no signed txs");
    setLoading(true);
    const submitResult = await Promise.all(
      signedTxs.map((tx, idx) =>
        client.submit(tx as ICommand).then((res) => {
          setTransferState((prevState) => {
            const upd = [...prevState.transactionsStatus];
            upd[idx].request = res;
            return {
              ...prevState,
              transactionsStatus: upd,
            };
          });
          return res;
        })
      )
    );

    const resultPromise = client.pollStatus(submitResult);
    Object.keys(resultPromise.requests).forEach((key) => {
      resultPromise.requests[key].then((res) => {
        setTransferState((prevState) => {
          const upd = [...prevState.transactionsStatus];
          const idx = upd.findIndex((item) => item.request!.requestKey === key);
          upd[idx].finalResult = res.result.status;
          return {
            ...prevState,
            transactionsStatus: upd,
          };
        });
      });
    });
    const finalResult = await resultPromise;

    console.log(finalResult);

    const submitSuccessful = Object.values(finalResult).every(
      (res) => res.result.status === "success"
    );

    if (!submitSuccessful) {
      throw new Error("submit failed");
    }

    setIsSuccessful(true);
    setLoading(false);
  }

  if (!account) {
    return (
      <main>
        <Stack direction="column" gap="$md" margin="$md">
          <Heading as="h3">Transfer</Heading>
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

  if (transferState.account) {
    return (
      <main>
        <Stack direction="column" gap="$md" margin="$md">
          <Heading as="h3">Transfer</Heading>
          <Stack
            direction="column"
            gap="$md"
            margin="$md"
            justifyContent="space-between"
          >
            {transferState.account && (
              <TransferStatus
                transferState={transferState}
                chainId={chainId!}
              />
            )}
            {Boolean(transferState.signedTxs?.length && !isSuccessful) && (
              <Stack gap="$md">
                <Button
                  disabled={loading}
                  onClick={doTheTransfer}
                  color="primary"
                >
                  Confirm
                </Button>
                <Button
                  disabled={loading}
                  onClick={() =>
                    setTransferState({
                      gasEstimation: [],
                      transactionsStatus: [],
                    })
                  }
                >
                  Cancel
                </Button>
              </Stack>
            )}
            {isSuccessful && (
              <Box marginTop="$md">
                <div
                  style={{
                    background: "green",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  The transfer was successful! Go to the{" "}
                  <Link to={`/accounts/${encodeURIComponent(account.account)}`}>
                    account
                  </Link>{" "}
                  page
                </div>
              </Box>
            )}
          </Stack>
        </Stack>
      </main>
    );
  }

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Transfer</Heading>
        <Stack margin={"$md"} direction="column" gap="$md">
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
          <Text>
            Balance{" "}
            <Text variant="code" bold color="emphasize">
              {overallBalance.toString()}
            </Text>{" "}
            KDA
          </Text>

          <Heading as="h6">Transfer by</Heading>
          <Stack direction="column">
            <label>
              <input
                type="radio"
                name="transferMode"
                value="name"
                checked={transferMode === "name"}
                onClick={() => {
                  console.log("change");
                  setTransferMode("name");
                }}
              />{" "}
              Name
            </label>
            <label>
              <input
                type="radio"
                name="transferMode"
                value="name"
                checked={transferMode === "account"}
                onClick={() => setTransferMode("account")}
              />{" "}
              Account
            </label>
          </Stack>

          <form onSubmit={onSubmit}>
            {transferMode === "name" && (
              <Box>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="receiver"
                  value={receiver}
                  outlined
                  onChange={(e) => {
                    try {
                      const id = nameToChianId(e.target.value);
                      setChainId(id.toString() as ChainId);
                      setError("");
                    } catch (e: any) {
                      setChainId(undefined);
                      setError(e.message);
                      console.log(e);
                    }
                    setReceiver(e.target.value);
                  }}
                />
                {chainId !== undefined && <Text>related chian: {chainId}</Text>}
                <Box marginTop="$sm">
                  {error && <Text>error: {error}</Text>}
                </Box>
              </Box>
            )}
            {transferMode === "account" && (
              <Box>
                <Label htmlFor="account">Account</Label>
                <Input
                  id="account"
                  value={inputReceiverAccount}
                  outlined
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 2 && !value.startsWith("k:")) {
                      setError("Account must start with k:");
                    }
                    setReceiverAccount(e.target.value);
                  }}
                />
                {chainId !== undefined && <Text>related chian: {chainId}</Text>}
                <Box marginTop="$sm">
                  {error && <Text>error: {error}</Text>}
                </Box>
              </Box>
            )}
            <Box>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                outlined
                onChange={(e) => {
                  if (!Number.isNaN(Number(e.target.value))) {
                    setAmount(e.target.value);
                  }
                }}
              />
            </Box>
            <Stack direction="row" margin="$md" justifyContent="flex-start">
              <Button type="submit" disabled={submitDisabled}>
                Transfer
              </Button>
              {loading && <SystemIcon.Loading />}
            </Stack>
          </form>
        </Stack>
      </Stack>
    </main>
  );
}
