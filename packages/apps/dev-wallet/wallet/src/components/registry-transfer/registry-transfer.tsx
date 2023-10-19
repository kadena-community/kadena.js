import { FC, PropsWithChildren } from "react";
import { Button } from "@kadena/react-ui";
import { IUnsignedCommand } from "@kadena/client";
import { safeJsonParse } from "@/utils/helpers";

const Code: FC<PropsWithChildren> = ({ children }) => (
  <div
    style={{
      margin: "0.5rem 0",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "5px",
    }}
  >
    <code>{children}</code>
  </div>
);

export const SignModalContent: FC<{
  transaction: IUnsignedCommand;
  onSign: () => void;
}> = ({ transaction, onSign }) => {
  // const cmd = safeJsonParse<any>(transaction.cmd);

  return (
    <div>
      <p>Please sign the following transaction</p>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
      <Button onClick={onSign}>Sign</Button>
    </div>
  );
};

export const RegistrySignTransactionDetails: FC<{
  transaction: IUnsignedCommand;
}> = ({ transaction }) => {
  const cmd = safeJsonParse<any>(transaction.cmd);
  console.log("cmd", cmd);
  return (
    <div
      key={transaction.hash}
      style={{
        border: "1px solid #4d4d4d",
        margin: "1rem 0",
        padding: "0.5rem",
        borderRadius: "5px",
      }}
    >
      <p>Payload:</p>
      <Code>{cmd.payload.exec.code}</Code>
      <p>Chain: {cmd.meta.chainId}</p>
    </div>
  );
};

export const RegistrySignModalContent: FC<{
  fromAlias: string;
  toAlias: string;
  transactions: IUnsignedCommand[];
  onSign: () => void;
}> = ({ fromAlias, toAlias, transactions, onSign }) => {
  // TODO merge signers of all transactions and deduplicate (it should always be the same)
  const signers = safeJsonParse<any>(transactions[0].cmd).signers as {
    pubKey: string;
    clist: { name: string; args: string[] }[];
  }[];

  return (
    <div
      style={{
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <p>Please sign the following transaction(s):</p>
      <p>From: {fromAlias}</p>
      <p>To: {toAlias}</p>
      <p>Transaction{transactions.length > 1 ? "s" : ""}:</p>
      {transactions.map((transaction) => (
        <RegistrySignTransactionDetails transaction={transaction} />
      ))}
      <p>Signer:</p>
      <Code>{signers[0].pubKey}</Code>
      <p>Caps:</p>
      {signers[0].clist.map((cap, i) => (
        <Code key={i}>
          {cap.name} ({cap.args.map((x) => JSON.stringify(x)).join(", ")})
        </Code>
      ))}

      <Button onClick={onSign}>Sign</Button>
    </div>
  );
};
