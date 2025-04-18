import { ErrorBoundary } from '@/Components/ErrorBoundary/ErrorBoundary';
import { parseArg } from '@/utils/parsedCodeToPact';
import { IPactCommand } from '@kadena/client';
import { Card, Heading, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { IParsedCode } from '@kadena/pactjs-generator';
import { breakAllClass } from '../style.css';
import { CodeViewPart } from './CodeViewPart';

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
                  <CodeViewPart
                    label="Transfer"
                    senderAddress={senderAddress}
                    receiverAddress={receiverAddress}
                    contract={contract}
                    amount={parseArg(amount, decoration)}
                  />
                </Stack>
              );
            }
            if (code.function.name === 'transfer-create') {
              const [sender, receiver, , amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <CodeViewPart
                    label="Transfer"
                    senderAddress={senderAddress}
                    receiverAddress={receiverAddress}
                    contract={contract}
                    amount={parseArg(amount, decoration)}
                  />
                </Stack>
              );
            }

            if (code.function.name === 'transfer-crosschain') {
              const [sender, receiver, , targetChain, amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <CodeViewPart
                    label="Cross-chain Transfer"
                    senderAddress={senderAddress}
                    receiverAddress={receiverAddress}
                    contract={contract}
                    amount={parseArg(amount, decoration)}
                  />

                  <Stack gap={'sm'} flexWrap="wrap">
                    <Text>target chain</Text>
                    <Text bold color="emphasize" className={breakAllClass}>
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
    <Card fullWidth>
      <CardContentBlock title="Transaction">
        <ErrorBoundary>
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
                      {(command.meta.gasLimit ?? 0) *
                        (command.meta.gasPrice ?? 0)}{' '}
                      KDA
                    </Text>
                  </Stack>
                </Card>
              )}
            </>
          </Stack>
        </ErrorBoundary>
      </CardContentBlock>
    </Card>
  ) : null;
}
