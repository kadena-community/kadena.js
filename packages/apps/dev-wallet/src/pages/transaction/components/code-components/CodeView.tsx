import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { parseArg } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { Badge, Card, Heading, Stack, Text } from '@kadena/kode-ui';
import { IParsedCode } from '@kadena/pactjs-generator';
import { breakAllClass } from '../style.css';

const decoration = {
  shortening: Infinity,
  withIndent: 0,
  breakLines: false,
};

export function CodeView({
  codes,
  command,
}: {
  codes?: IParsedCode[];
  command: IPactCommand;
}) {
  console.log({ codes, command });

  const { getAccountAlias } = useWallet();
  const getAccount = (address: string, contract: string) => {
    const value = address.replace(/"/gi, '');
    const alias = getAccountAlias(value, contract);
    const shortAddress = shorten(value, 20);
    if (!alias) return shortAddress;
    return (
      <Stack gap={'sm'} flexWrap="wrap">
        <Badge size="sm">{alias}</Badge>
        <Text bold color="emphasize">
          {shortAddress}
        </Text>
      </Stack>
    );
  };

  const describes = !codes
    ? []
    : codes
        .map((code) => {
          if (code.function.module === 'coin' && !code.function.namespace) {
            const contract = 'coin';
            if (code.function.name === 'transfer') {
              const [sender, receiver, amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              return (
                <Stack
                  key={`${code.function.module}${code.function.namespace}`}
                  gap={'sm'}
                  flexDirection={'column'}
                >
                  <Heading variant="h5">Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>amount</Text>
                    <Text bold color="emphasize">
                      {parseArg(amount, decoration)}
                    </Text>
                  </Stack>
                </Stack>
              );
            }
            if (code.function.name === 'transfer-create') {
              const [sender, receiver, , amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Heading variant="h5">Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>amount</Text>
                    <Text bold color="emphasize" className={breakAllClass}>
                      {parseArg(amount, decoration)}
                    </Text>
                  </Stack>
                </Stack>
              );
            }

            if (code.function.name === 'transfer-crosschain') {
              const [sender, receiver, , targetChain, amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Heading variant="h5">Cross-chain Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress, contract)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>amount</Text>
                    <Text bold color="emphasize">
                      {parseArg(amount, decoration)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>target chain</Text>
                    <Text bold color="emphasize">
                      {parseArg(targetChain, decoration)}
                    </Text>
                  </Stack>
                </Stack>
              );
            }
          }
          return null;
        })
        .filter(Boolean);

  return describes.length > 0 ? (
    <Stack flexDirection={'column'} gap={'md'}>
      <>
        {describes.map((e) => (
          <Card key={e?.key} fullWidth>
            {e}
          </Card>
        ))}
        {command && (
          <Card fullWidth>
            <Stack gap={'sm'} flexDirection={'column'}>
              <Heading variant="h5">Max Gas Cost</Heading>
              <Text bold color="emphasize">
                {(command.meta.gasLimit ?? 0) * (command.meta.gasPrice ?? 0)}{' '}
                KDA
              </Text>
            </Stack>
          </Card>
        )}
      </>
    </Stack>
  ) : null;
}
