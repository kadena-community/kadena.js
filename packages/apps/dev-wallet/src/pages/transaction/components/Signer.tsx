import {
  addSignatures,
  IPactCommand,
  IUnsignedCommand,
  parseAsPactValue,
} from '@kadena/client';
import {
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import { FC, PropsWithChildren, useState } from 'react';
import {
  breakAllClass,
  codeClass,
  readyToSignClass,
  signedClass,
  tagClass,
} from './style.css.ts';

import { ITransaction } from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { normalizeSigs } from '@/utils/normalizeSigs.ts';
import { MonoContentCopy, MonoDelete } from '@kadena/kode-icons/system';
import classNames from 'classnames';

import { getErrorMessage } from '@/utils/getErrorMessage.ts';
import yaml from 'js-yaml';
import { statusPassed } from './TxPipeLine.tsx';

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
  const { getPublicKeyData, sign } = useWallet();
  const signature = transaction.sigs.find(
    (sig) => sig?.pubKey === signer.pubKey && sig.sig,
  )?.sig;
  const info = getPublicKeyData(signer.pubKey);
  const [error, setError] = useState<string>();
  return (
    <>
      <Stack gap={'sm'}>
        <Heading variant="h5">Public Key</Heading>
        {signature && <Text className={signedClass}>Signed</Text>}
        {!signature && info && <Text className={readyToSignClass}>Owned</Text>}
        {<Text className={tagClass}>{info?.source ?? 'External'}</Text>}
      </Stack>
      <Value className={breakAllClass}>{signer.pubKey}</Value>
      <Stack gap={'sm'} justifyContent={'space-between'}></Stack>
      <Stack gap={'sm'} flexDirection={'column'}>
        <Heading variant="h5">Sign for</Heading>
        {signer.clist &&
          signer.clist.map((cap) => (
            <Stack
              key={cap.name}
              gap={'sm'}
              justifyContent={'space-between'}
              className={codeClass}
            >
              <Value>
                (
                {[
                  cap.name,
                  ...cap.args.map((data) =>
                    typeof data === 'number' ? data : parseAsPactValue(data),
                  ),
                ].join(' ')}
                )
              </Value>
            </Stack>
          ))}
      </Stack>
      {signature && (
        <>
          <Stack
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            gap={'sm'}
          >
            <Heading variant="h5">Signature</Heading>
            <Stack gap={'sm'}>
              <Button
                variant="transparent"
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
                <MonoDelete />
              </Button>
              <Button
                isCompact
                variant="transparent"
                startVisual={<MonoContentCopy />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify({
                      sig: signature,
                      pubKey: signer.pubKey,
                    }),
                  );
                }}
              />
            </Stack>
          </Stack>
          <Value className={classNames(breakAllClass, codeClass)}>
            {signature}
          </Value>
        </>
      )}
      {!signature && info && (
        <Stack>
          {error && (
            <Notification intent="negative" role="alert">
              {error}
            </Notification>
          )}
          <Button
            isCompact
            variant="primary"
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
        </Stack>
      )}
      {!signature && !info && (
        <form
          onSubmit={(event) => {
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

              const extSignature = sigs.find(
                (item) => item.pubKey === signer.pubKey,
              );

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
          }}
        >
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
            <Button variant="info" isCompact type="submit">
              Add External Signature
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};
