import {
  ITransaction,
  TransactionStatus,
} from '@/modules/transaction/transaction.repository';
import { syncTransactionStatus } from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { normalizeSigs } from '@/utils/normalizeSigs';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';
import {
  MonoCheck,
  MonoClose,
  MonoCloudSync,
  MonoLoading,
  MonoPauseCircle,
  MonoRefresh,
  MonoShare,
  MonoSignature,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { useMemo, useState } from 'react';
import { failureClass, pendingClass, successClass } from './style.css';

export const steps: TransactionStatus[] = [
  'initiated',
  'signed',
  'preflight',
  'submitted',
  'failure',
  'success',
  'persisted',
];

export const statusPassed = (
  txStatus: ITransaction['status'],
  status: ITransaction['status'],
) => steps.indexOf(txStatus) >= steps.indexOf(status);

export const getStatusClass = (status: ITransaction['status']) => {
  if (statusPassed(status, 'success')) return successClass;
  if (status === 'failure') return failureClass;
  if (status === 'initiated') return '';
  return pendingClass;
};

export function TxPipeLine({
  tx,
  contTx,
  variant,
  signAll,
  onSubmit,
  sendDisabled,
}: {
  tx: ITransaction;
  contTx?: ITransaction;
  variant: 'tile' | 'expanded' | 'minimized';
  signAll?: () => void;
  onSubmit?: (skipPreflight?: boolean) => void;
  sendDisabled?: boolean;
}) {
  const showAfterCont = !contTx || variant === 'expanded';
  return (
    <Stack flexDirection={'column'} gap={'md'}>
      <TxStatusList
        {...{
          variant,
          showAfterCont,
          tx,
          signAll,
          onSubmit,
          sendDisabled,
          contTx,
        }}
      />
    </Stack>
  );
}

function TxStatusList({
  variant,
  showAfterCont,
  tx,
  signAll,
  onSubmit = () => {},
  sendDisabled,
  contTx,
}: {
  variant: 'tile' | 'expanded' | 'minimized';
  showAfterCont: boolean;
  tx: ITransaction;
  signAll?: () => void;
  onSubmit?: (skipPreflight?: boolean) => void;
  sendDisabled?: boolean;
  contTx?: ITransaction | null;
}) {
  const { getPublicKeyData, client } = useWallet();
  const signers = useMemo(() => normalizeSigs(tx), [tx]);
  const textSize = variant === 'tile' ? 'smallest' : 'base';
  const signedByYou = !signers.find(
    (sigData) => !sigData?.sig && getPublicKeyData(sigData?.pubKey),
  );
  const [copied, setCopied] = useState(false);
  const statusList = [
    variant !== 'minimized' && (
      <Stack justifyContent={'space-between'}>
        <Text>
          {tx.continuation?.autoContinue ? 'exec' : 'hash'}:{' '}
          {shorten(tx.hash, 6)}
        </Text>
      </Stack>
    ),
    showAfterCont &&
      variant !== 'tile' &&
      !statusPassed(tx.status, 'signed') && (
        <Stack flexDirection={'column'} gap={'md'}>
          <Text size={textSize} className={pendingClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoPauseCircle />
              {signedByYou ? 'add external signatures' : 'Waiting for sign'}
            </Stack>
          </Text>

          {variant === 'expanded' && signedByYou && (
            <Stack gap={'sm'}>
              <Button
                startVisual={<MonoCloudSync />}
                isCompact
                variant="outlined"
                onClick={() => {
                  syncTransactionStatus(tx, client);
                }}
              >
                query chain
              </Button>
              <Button
                startVisual={<MonoShare />}
                isCompact
                onClick={() => {
                  const encodedTx = base64UrlEncodeArr(
                    new TextEncoder().encode(
                      JSON.stringify({
                        hash: tx.hash,
                        cmd: tx.cmd,
                        sigs: tx.sigs,
                      }),
                    ),
                  );
                  const baseUrl = `${window.location.protocol}//${window.location.host}`;
                  navigator.clipboard.writeText(
                    `${baseUrl}/sig-builder#${encodedTx}`,
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? 'copied' : 'Share'}
              </Button>
            </Stack>
          )}
          {variant === 'expanded' && !signedByYou && (
            <Stack>
              <Button
                isCompact
                onClick={() => signAll!()}
                startVisual={<MonoSignature />}
              >
                Sign all possible signers
              </Button>
            </Stack>
          )}
        </Stack>
      ),
    showAfterCont && statusPassed(tx.status, 'signed') && (
      <Stack>
        <Text size={textSize} className={successClass}>
          <Stack alignItems={'center'} gap={'xs'}>
            <MonoCheck />
            Signed
          </Stack>
        </Text>
      </Stack>
    ),
    showAfterCont &&
      variant !== 'tile' &&
      statusPassed(tx.status, 'signed') &&
      !statusPassed(tx.status, 'preflight') && (
        <Stack flexDirection={'column'} gap={'md'}>
          <Text size={textSize} className={pendingClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoPauseCircle />
              {sendDisabled ? 'Send is pending' : 'Ready to send'}
            </Stack>
          </Text>
          {variant === 'expanded' && (
            <Button
              isCompact
              onClick={() => onSubmit()}
              isDisabled={sendDisabled}
              startVisual={<MonoViewInAr />}
            >
              Send transaction
            </Button>
          )}
        </Stack>
      ),
    showAfterCont && statusPassed(tx.status, 'preflight') && (
      <Stack gap={'sm'} alignItems={'center'}>
        <Text
          size={textSize}
          className={
            tx.preflight?.result.status === 'success'
              ? successClass
              : failureClass
          }
        >
          <Stack alignItems={'center'} gap={'xs'}>
            {tx.preflight?.result.status === 'success' ? (
              <MonoCheck />
            ) : (
              <MonoClose />
            )}
            preflight
          </Stack>
        </Text>
        {variant === 'expanded' &&
          tx.status === 'preflight' &&
          tx.preflight?.result.status === 'failure' && (
            <Stack>
              <Button isCompact onClick={() => onSubmit()}>
                <MonoRefresh />
              </Button>
              <Button
                isCompact
                variant="transparent"
                onClick={() => onSubmit(true)}
              >
                Skip
              </Button>
            </Stack>
          )}
      </Stack>
    ),
    showAfterCont && statusPassed(tx.status, 'submitted') && (
      <Stack gap={'sm'} alignItems={'center'}>
        <Text
          size={textSize}
          className={tx.request ? successClass : failureClass}
        >
          <Stack alignItems={'center'} gap={'xs'}>
            {tx.request ? <MonoCheck /> : <MonoClose />}
            Send
          </Stack>
        </Text>
        {variant === 'expanded' && !tx.request && (
          <Stack>
            <Button isCompact onClick={() => onSubmit(true)}>
              <MonoRefresh />
            </Button>
          </Stack>
        )}
      </Stack>
    ),
    showAfterCont &&
      statusPassed(tx.status, 'submitted') &&
      (!('result' in tx) || !tx.result) && (
        <Stack>
          <Text size={textSize} className={pendingClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoLoading />
              Mining...
            </Stack>
          </Text>
        </Stack>
      ),
    statusPassed(tx.status, 'success') && (
      <Stack>
        <Text size={textSize} className={successClass}>
          <Stack alignItems={'center'} gap={'xs'}>
            <MonoCheck />
            Mined{' '}
            {tx.continuation?.autoContinue && contTx
              ? `in chain ${tx.purpose!.data.source as string}`
              : ''}
          </Stack>
        </Text>
      </Stack>
    ),
    tx.status === 'failure' && (
      <Stack>
        <Text size={textSize} className={failureClass}>
          <Stack alignItems={'center'} gap={'xs'}>
            <MonoClose />
            Failed
          </Stack>
        </Text>
      </Stack>
    ),
    statusPassed(tx.status, 'success') && [
      tx.continuation?.autoContinue && !tx.continuation.proof && (
        <Stack>
          <Text size={textSize} className={pendingClass}>
            <Stack alignItems={'center'} gap={'xs'}>
              <MonoLoading />
              Fetching proof
            </Stack>
          </Text>
        </Stack>
      ),
      showAfterCont &&
        tx.continuation?.autoContinue &&
        tx.continuation.proof && (
          <Stack>
            <Text size={textSize} className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                proof fetched
              </Stack>
            </Text>
          </Stack>
        ),
      contTx && [
        variant !== 'minimized' && (
          <Stack justifyContent={'space-between'}>
            <Text>cont: {shorten(contTx.hash, 6)}</Text>
          </Stack>
        ),
        statusPassed(contTx.status, 'preflight') && (
          <Stack>
            <Text
              size={textSize}
              className={
                contTx.preflight?.result.status === 'success'
                  ? successClass
                  : failureClass
              }
            >
              <Stack alignItems={'center'} gap={'xs'}>
                {contTx.preflight?.result.status === 'success' ? (
                  <MonoCheck />
                ) : (
                  <MonoClose />
                )}
                preflight
              </Stack>
            </Text>
          </Stack>
        ),
        statusPassed(contTx.status, 'submitted') && (
          <Stack>
            <Text size={textSize} className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Send
              </Stack>
            </Text>
          </Stack>
        ),
        statusPassed(contTx.status, 'submitted') &&
          (!('result' in contTx) || !contTx.result) && (
            <Stack>
              <Text size={textSize} className={pendingClass}>
                <Stack alignItems={'center'} gap={'xs'}>
                  <MonoLoading />
                  Mining...
                </Stack>
              </Text>
            </Stack>
          ),
        statusPassed(contTx.status, 'success') && (
          <Stack>
            <Text size={textSize} className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Mined
              </Stack>
            </Text>
          </Stack>
        ),
        contTx.status === 'failure' && (
          <Stack>
            <Text size={textSize} className={successClass}>
              <Stack alignItems={'center'} gap={'xs'}>
                <MonoCheck />
                Failed
              </Stack>
            </Text>
          </Stack>
        ),
      ],
    ],
  ]
    .flat(Infinity)
    .filter(Boolean);

  if (variant === 'minimized') return statusList.pop() as JSX.Element;
  return <>{statusList}</>;
}
