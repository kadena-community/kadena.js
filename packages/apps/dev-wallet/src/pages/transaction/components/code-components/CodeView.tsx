import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { shorten } from '@/utils/helpers';
import { parseArg } from '@/utils/parsedCodeToPact';
import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { MonoCheck, MonoShare } from '@kadena/kode-icons/system';
import { Badge, Button, Card, Heading, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { IParsedCode } from '@kadena/pactjs-generator';
import { useMemo } from 'react';
import { successClass } from '../style.css';

const decoration = {
  shortening: Infinity,
  withIndent: 0,
  breakLines: false,
};

const Signers = ({ signers }: { signers: IPactCommand['signers'] }) => {
  const { getKeyAlias } = useWallet();
  return signers.length <= 0 ? null : (
    <Stack flexDirection={'column'} gap={'sm'} marginBlockStart={'md'}>
      <hr />
      <Heading variant="h6">Signers</Heading>
      {signers.map((signer) => {
        const alias = getKeyAlias(signer.pubKey);
        return (
          <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
            {alias && <Badge size="sm">{alias}</Badge>}
            <Text bold color="emphasize">
              {shorten(signer.pubKey, 10)}
            </Text>
          </Stack>
        );
      })}
    </Stack>
  );
};

const TransferSignerPart = ({
  signers,
  senderAddress,
  receiverAddress,
  amountValue,
}: {
  signers: IPactCommand['signers'];
  senderAddress: string;
  receiverAddress: string;
  amountValue: string;
}) => {
  const transferSigners = signers.filter((s) =>
    s.clist?.find(
      (c) =>
        c.name === 'coin.TRANSFER' &&
        c.args[0] === senderAddress.replace(/"/gi, '') &&
        c.args[1] === receiverAddress.replace(/"/gi, '') &&
        new PactNumber(c.args[2] as string).toString() ===
          new PactNumber(amountValue).toString(),
    ),
  );
  return <Signers signers={transferSigners} />;
};

const GasSignersPart = ({ signers }: { signers: IPactCommand['signers'] }) => {
  const gasSigners = signers.filter((s) =>
    s.clist?.find((c) => c.name === 'coin.GAS'),
  );
  return <Signers signers={gasSigners} />;
};

export function CodeView({
  codes,
  tx,
}: {
  codes?: IParsedCode[];
  tx: IUnsignedCommand;
}) {
  const { getAccountAlias, getKeyAlias, getPublicKeyData } = useWallet();
  const command: IPactCommand = useMemo(() => JSON.parse(tx.cmd), [tx.cmd]);
  const getAccount = (address: string) => {
    const value = address.replace(/"/gi, '');
    const alias = getAccountAlias(value);
    const shortAddress = shorten(value, 10);
    if (!alias) return shortAddress;
    console.log('alias', alias);
    return (
      <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
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
            if (code.function.name === 'transfer') {
              const [sender, receiver, amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              const amountValue = parseArg(amount, decoration);

              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Heading variant="h5">Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>amount</Text>
                    <Text bold color="emphasize">
                      {amountValue}
                    </Text>
                  </Stack>
                  <TransferSignerPart
                    {...{
                      senderAddress,
                      receiverAddress,
                      signers: command.signers,
                      amountValue,
                    }}
                  />
                </Stack>
              );
            }
            if (code.function.name === 'transfer-create') {
              const [sender, receiver, , amount] = code.args;
              const senderAddress = parseArg(sender, decoration);
              const receiverAddress = parseArg(receiver, decoration);
              const amountValue = parseArg(amount, decoration);
              return (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Heading variant="h5">Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>amount</Text>
                    <Text bold color="emphasize">
                      {parseArg(amount, decoration)}
                    </Text>
                  </Stack>
                  <TransferSignerPart
                    {...{
                      senderAddress,
                      receiverAddress,
                      signers: command.signers,
                      amountValue,
                    }}
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
                  <Heading variant="h5">Cross-chain Transfer</Heading>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>from</Text>
                    <Text bold color="emphasize">
                      {getAccount(senderAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>to</Text>
                    <Text bold color="emphasize">
                      {getAccount(receiverAddress)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
                    <Text>amount</Text>
                    <Text bold color="emphasize">
                      {parseArg(amount, decoration)}
                    </Text>
                  </Stack>
                  <Stack gap={'sm'} flexWrap="wrap" alignItems={'center'}>
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
    <Stack flexDirection={'column'} gap={'md'} className={panelClass}>
      <Heading as="h5">Transaction Summary</Heading>
      {describes.map((e) => (
        <Card fullWidth>{e}</Card>
      ))}
      {command && (
        <Card fullWidth>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h5">Max Gas Cost</Heading>
            <Text bold color="emphasize">
              {(command.meta.gasLimit ?? 0) * (command.meta.gasPrice ?? 0)} KDA
            </Text>
            <GasSignersPart signers={command.signers} />
          </Stack>
        </Card>
      )}

      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h5">Signatures</Heading>
        <Card fullWidth>
          <Stack
            flexWrap="wrap"
            gap={'sm'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            {command.signers.map((signer) => {
              const alias = getKeyAlias(signer.pubKey);
              const signature = tx.sigs.find(
                (sig) => sig?.pubKey === signer.pubKey && sig.sig,
              )?.sig;
              const info = getPublicKeyData(signer.pubKey);
              return (
                <Stack flexDirection={'column'} gap={'sm'} key={signer.pubKey}>
                  {alias && (
                    <Stack>
                      <Badge size="sm">{alias}</Badge>
                    </Stack>
                  )}
                  <Text variant="code">{shorten(signer.pubKey)}</Text>
                  {signature ? (
                    <Stack gap={'sm'} alignItems={'center'}>
                      <MonoCheck className={successClass} />
                      <Text className={successClass}>Signed</Text>
                    </Stack>
                  ) : info ? (
                    <Button isCompact variant="outlined">
                      Sign
                    </Button>
                  ) : (
                    <Button
                      isCompact
                      variant="outlined"
                      startVisual={<MonoShare />}
                    >
                      Share
                    </Button>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  ) : null;
}
