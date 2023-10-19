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
import { useCrypto } from "@/hooks/crypto.context";

const { Body, Td, Tr } = Table;

export default function Home() {
  const wallet = useCrypto();
  const { publicKeys } = wallet;
  const [, copy] = useCopyToClipboard();

  const onGenerateKey = () => {
    wallet.generatePublicKey();
  };

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Keys</Heading>
        <Stack direction="row" margin="$md" justifyContent="space-between">
          <Box margin="$md">
            <ContentHeader
              heading="Keys"
              icon="KeyIconFilled"
              description="Generate and view the generated keys."
            />
          </Box>
          <Box margin="$md">
            <Button onClick={onGenerateKey} icon="Plus">
              generate
            </Button>
          </Box>
        </Stack>
        <Table.Root striped={true}>
          <Body>
            {publicKeys.map((key) => (
              <Tr key={key}>
                <Td>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap="$xs">
                      <SystemIcon.KeyIconFilled />
                      <Text variant="code">{key}</Text>
                    </Stack>
                    <Stack>
                      <IconButton
                        icon="ContentCopy"
                        title="Copy key"
                        onClick={() => copy(key)}
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
