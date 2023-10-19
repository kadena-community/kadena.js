import { decode } from "@/utils/encode";
import { Suspense } from "react";
import { LocalResult } from "@/components/LocalResult";
import { Heading, Button, Box, Text } from "@kadena/react-ui";
import { ICommand, IUnsignedCommand } from "@kadena/client";
import { getClient } from "@/utils/helpers";
import { useCrypto } from "@/hooks/crypto.context";

interface IParams {
  params: {
    transaction: string;
  };
}

export default function Sign({ params }: IParams) {
  const wallet = useCrypto();

  const { transaction } = params;

  const decoded = decode(transaction);

  const parsed: IUnsignedCommand = JSON.parse(decoded);

  const signAndSend = async () => {
    const signedTx = wallet.signTransaction(parsed) as ICommand;
    console.log("signedTx", signedTx);

    const { submit, listen } = getClient("l1");

    const req = await submit(signedTx);
    const res = await listen(req);
    console.log("result", res);
  };

  return (
    <main>
      <Box margin="$md">
        <Heading variant="h1">Sign Transaction</Heading>

        <Heading variant="h3">Transaction</Heading>
        <Text font="mono">
          <pre>{JSON.stringify(JSON.parse(parsed.cmd), null, 2)}</pre>
        </Text>

        <Heading variant="h3">Local result</Heading>
        <Suspense fallback={<div>Loading...</div>}>
          <LocalResult transaction={parsed} />
        </Suspense>

        <Heading variant="h3">Sign</Heading>

        <Button
          onClick={() => {
            // console.log("Signed sealed delivered");
            signAndSend();
          }}
        >
          Sign and send
        </Button>
      </Box>
    </main>
  );
}
