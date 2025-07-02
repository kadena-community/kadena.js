import { addSignatures, IPactCommand, IUnsignedCommand } from '@kadena/client';
import {
  Badge,
  Button,
  Card,
  Divider,
  Heading,
  Notification,
  Stack,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import {
  FC,
  FormEventHandler,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';
import { breakAllClass, breakNoneClass, codeClass } from './style.css';

import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { normalizeSigs } from '@/utils/normalizeSigs';
import classNames from 'classnames';

import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { getCopyTxString } from '@/utils/getCopyTxString';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  MonoFactCheck,
  MonoShare,
  MonoSignature,
} from '@kadena/kode-icons/system';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import yaml from 'js-yaml';
import { Capability } from './Capability';
import { iconSuccessClass } from './TxPipeLine/style.css';
import { statusPassed } from './TxPipeLine/utils';

const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text bold variant="code" className={className}>
    {children}
  </Text>
);

export const RenderSigner = ({
  transaction,
  signer,
  transactionStatus,
  onSign,
}: {
  transaction: IUnsignedCommand;
  signer: IPactCommand['signers'][number];
  transactionStatus: ITransaction['status'];
  onSign: (sig: ITransaction['sigs']) => void;
}) => {
  const { getPublicKeyData, sign, getKeyAlias } = useWallet();
  const signature = transaction.sigs.find(
    (sig) => sig?.pubKey === signer.pubKey && sig.sig,
  )?.sig;
  const info = getPublicKeyData(signer.pubKey);
  const [error, setError] = useState<string>();
  const [showCapabilities, setShowCapabilities] = useState(false);
  const keyAlias = useMemo(
    () => getKeyAlias(signer.pubKey),
    [signer.pubKey, getKeyAlias],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const signature = formData.get('signature') as string;
    let sigObject;
    if (!signature) return;
    try {
      const json:
        | IUnsignedCommand
        | {
            pubKey: string;
            sig?: string;
          } = yaml.load(signature) as
        | IUnsignedCommand
        | {
            pubKey: string;
            sig?: string;
          };

      let sigs: Array<{
        sig?: string;
        pubKey: string;
      }> = [];
      if ('sig' in json) {
        if (!json.pubKey) {
          json.pubKey = signer.pubKey;
        }
        sigs = [json];
      } else {
        sigs = normalizeSigs(json as IUnsignedCommand);
      }

      const extSignature = sigs.find((item) => item.pubKey === signer.pubKey);

      if (!extSignature || !extSignature.sig) {
        return;
      }
      sigObject = extSignature as {
        sig: string;
        pubKey: string;
      };
    } catch (e) {
      sigObject = {
        sig: signature,
        pubKey: signer.pubKey,
      };
    }
    // TODO: verify signature before adding it
    const sigs = addSignatures(transaction, sigObject);
    onSign(sigs.sigs);
  };

  return (
    <>
      <Card fullWidth>
        <CardContentBlock
          level={2}
          title="Signer"
          visual={
            signature ? (
              <MonoFactCheck
                width={24}
                height={24}
                className={iconSuccessClass()}
              />
            ) : (
              <MonoSignature width={24} height={24} />
            )
          }
          supportingContent={
            <Stack gap="xs">
              <Button
                isCompact
                variant="outlined"
                endVisual={
                  signer.clist && (
                    <Badge size="sm" style="default">
                      {signer.clist.length + Number(!!signature)}
                    </Badge>
                  )
                }
                onPress={() => setShowCapabilities((v) => !v)}
              >
                {showCapabilities ? 'Hide details' : 'Show details'}
              </Button>
              {signature ? (
                <Button
                  variant="negative"
                  isDisabled={statusPassed(transactionStatus, 'submitted')}
                  isCompact
                  onClick={() => {
                    const updatedSigs = transaction.sigs.map((sig) =>
                      sig?.pubKey === signer.pubKey && sig.sig
                        ? { pubKey: sig.pubKey }
                        : sig,
                    );
                    onSign(updatedSigs);
                  }}
                >
                  Unsign
                </Button>
              ) : info ? (
                <Button
                  isCompact
                  variant="info"
                  onClick={async () => {
                    try {
                      error && setError(undefined);
                      const signed = (await sign(transaction, [
                        signer.pubKey,
                      ])) as IUnsignedCommand;
                      onSign(signed.sigs ?? []);
                    } catch (e) {
                      setError(getErrorMessage(e, "Couldn't sign transaction"));
                    }
                  }}
                >
                  Sign
                </Button>
              ) : (
                <CopyButton
                  data={getCopyTxString(transaction)}
                  label="Share"
                  variant="info"
                  icon={<MonoShare />}
                />
              )}
            </Stack>
          }
        >
          <Stack
            gap="md"
            flexDirection="column"
            style={{ marginBlockStart: '-80px' }}
          >
            <Stack gap={'sm'} alignItems="center">
              <Heading variant="h6">Public Key</Heading>
              <Stack flex={1}>{info && <Badge size="sm">Owned</Badge>}</Stack>
              {<Badge size="sm">{info?.source ?? 'External'}</Badge>}
            </Stack>

            <Stack gap={'sm'} alignItems={'flex-start'}>
              {keyAlias && (
                <Stack style={{ width: '120px' }}>
                  <Badge size="sm" className={breakNoneClass}>
                    {keyAlias}
                  </Badge>
                </Stack>
              )}

              <Value className={breakAllClass}>{signer.pubKey}</Value>
            </Stack>
          </Stack>

          {showCapabilities && (
            <Stack gap={'sm'} flexDirection={'column'} marginBlockStart="md">
              {signature && (
                <>
                  <Divider label="Signature" align="end" />
                  <Stack flexDirection="column">
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                      gap={'sm'}
                    >
                      <CopyButton
                        data={{
                          sig: signature,
                          pubKey: signer.pubKey,
                        }}
                      />
                    </Stack>
                    <Value className={classNames(breakAllClass, codeClass)}>
                      {signature}
                    </Value>
                  </Stack>
                </>
              )}

              <Divider label="Capabilities" align="end" />
              {signer.clist &&
                signer.clist.map((cap, idx) => (
                  <Capability
                    key={`${cap.name}${cap.args.toString()}`}
                    capability={cap}
                    isSigned={!!signature}
                    idx={idx + 1}
                  />
                ))}
            </Stack>
          )}

          {!signature && info && (
            <Stack>
              {error && (
                <Notification intent="negative" role="alert">
                  {error}
                </Notification>
              )}
            </Stack>
          )}
          {!signature && !info && (
            <form onSubmit={handleSubmit}>
              <Stack
                gap={'sm'}
                flex={1}
                flexDirection={'column'}
                alignItems={'flex-start'}
              >
                <Stack width="100%">
                  <TextareaField
                    label="Signature or Signed Tx"
                    name="signature"
                    placeholder="Paste signature or signed transaction here. the other party should provide you with the signature"
                  />
                </Stack>
                <Stack justifyContent="flex-end" width="100%">
                  <Button variant="info" isCompact type="submit">
                    Add External Signature
                  </Button>
                </Stack>
              </Stack>
            </form>
          )}
        </CardContentBlock>
      </Card>
    </>
  );
};
