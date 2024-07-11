import {
  addSignatures,
  IPactCommand,
  IUnsignedCommand,
  parseAsPactValue,
} from '@kadena/client';
import { Button, Heading, Stack, Text, TextareaField } from '@kadena/kode-ui';
import { FC, PropsWithChildren, useMemo } from 'react';
import {
  breakAllClass,
  cardClass,
  codeClass,
  readyToSignClass,
  signedClass,
  tagClass,
} from './style.css.ts';

import { ITransaction } from '@/modules/transaction/transaction.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { normalizeSigs } from '@/pages/signature-builder/utils/normalizeSigs.ts';
import classNames from 'classnames';

const Value: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Text bold variant="code" className={className}>
    {children}
  </Text>
);

export function Signers({
  transaction,
  onSign,
}: {
  transaction: IUnsignedCommand;
  onSign: (sig: ITransaction['sigs']) => void;
}) {
  const { sign } = useWallet();
  const { getPublicKeyData } = useWallet();
  const command: IPactCommand = useMemo(
    () => JSON.parse(transaction.cmd),
    [transaction.cmd],
  );
  return (
    <Stack flexDirection={'column'} gap={'sm'}>
      <Heading variant="h4">Signers</Heading>
      <Stack gap={'sm'} flexDirection={'column'}>
        {command.signers.map((signer) => {
          const signature = transaction.sigs.find(
            (sig) => sig?.pubKey === signer.pubKey && sig.sig,
          )?.sig;
          const info = getPublicKeyData(signer.pubKey);
          return (
            <Stack
              gap={'sm'}
              flexDirection={'column'}
              className={cardClass}
              key={signer.pubKey}
            >
              <Stack gap={'sm'}>
                <Heading variant="h5">Public Key</Heading>
                {signature && <Text className={signedClass}>Signed</Text>}
                {!signature && info && (
                  <Text className={readyToSignClass}>Owned</Text>
                )}
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
                            typeof data === 'number'
                              ? data
                              : parseAsPactValue(data),
                          ),
                        ].join(' ')}
                        )
                      </Value>
                    </Stack>
                  ))}
              </Stack>
              {!signature && info && (
                <Button
                  isCompact
                  onClick={async () => {
                    const signed = (await sign(transaction, [
                      signer.pubKey,
                    ])) as IUnsignedCommand;
                    onSign(signed.sigs ?? []);
                  }}
                >
                  Sign
                </Button>
              )}
              {!signature && !info && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(
                      event.target as HTMLFormElement,
                    );
                    const signature = formData.get('signature') as string;
                    let sigObject;
                    if (!signature) return;
                    try {
                      const json: IUnsignedCommand = JSON.parse(signature);
                      const sigs = normalizeSigs(json);
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
                      sigObject = { sig: signature, pubKey: signer.pubKey };
                    }
                    // TODO: verify signature before adding it
                    const sigs = addSignatures(transaction, sigObject);
                    onSign(sigs.sigs);
                  }}
                >
                  <Stack gap={'sm'} flex={1} flexDirection={'column'}>
                    <TextareaField
                      label="Signature or Signed Tx"
                      name="signature"
                    />
                    <Button isCompact type="submit">
                      Add Signature
                    </Button>
                  </Stack>
                </form>
              )}
              {signature && (
                <>
                  <Heading variant="h5">Signature</Heading>
                  <Value className={classNames(breakAllClass, codeClass)}>
                    {signature}
                  </Value>
                </>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
