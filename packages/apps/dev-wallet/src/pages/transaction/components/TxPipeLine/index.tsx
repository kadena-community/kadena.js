import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { syncTransactionStatus } from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getCopyTxString } from '@/utils/getCopyTxString';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { shorten } from '@/utils/helpers';
import { normalizeSigs } from '@/utils/normalizeSigs';
import {
  MonoCloudSync,
  MonoFactCheck,
  MonoInfo,
  MonoOpenInFull,
  MonoRefresh,
  MonoSignature,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  Tooltip,
} from '@kadena/kode-ui';
import { useMemo, useState } from 'react';
import { TxStatusItem } from './components/TxStatusItem';
import { iconSuccessClass, statusListWrapperClass } from './style.css';
import { statusPassed } from './utils';

export function TxPipeLine({
  tx,
  contTx,
  variant,
  signAll,
  onSubmit,
  sendDisabled,
  onPreflight,
  onView,
}: {
  tx: ITransaction;
  contTx?: ITransaction;
  variant: 'tile' | 'expanded' | 'minimized';
  signAll?: () => Promise<void>;
  onSubmit?: (skipPreflight?: boolean) => void;
  onPreflight?: () => void;
  sendDisabled?: boolean;
  onView?: () => void;
}) {
  const showAfterCont = !contTx || variant === 'expanded';
  return (
    <Stack width="100%" flexDirection={'column'} gap={'md'}>
      <TxStatusList
        {...{
          variant,
          showAfterCont,
          tx,
          signAll,
          onSubmit,
          onPreflight,
          sendDisabled,
          contTx,
          onView,
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
  onPreflight = () => {},
  onView,
}: {
  variant: 'tile' | 'expanded' | 'minimized';
  showAfterCont: boolean;
  tx: ITransaction;
  signAll?: () => Promise<void>;
  onSubmit?: (skipPreflight?: boolean) => void;
  onPreflight?: () => void;
  sendDisabled?: boolean;
  contTx?: ITransaction | null;
  onView?: () => void;
}) {
  const { getPublicKeyData, client } = useWallet();
  const signers = useMemo(() => normalizeSigs(tx), [tx]);
  const signedByYou = !signers.find(
    (sigData) => !sigData?.sig && getPublicKeyData(sigData?.pubKey),
  );

  const [showPreflightInfo, setShowPreflightInfo] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const copyTx = useMemo(() => getCopyTxString(tx), [tx.hash, tx.cmd, tx.sigs]);

  const statusList = [
    variant !== 'minimized' && (
      <Stack alignItems="center" gap="sm">
        <Stack flex={1}>
          <Text id="hash" variant="code">
            {shorten(tx.hash, 6)}
          </Text>
        </Stack>
        <CopyButton
          data={tx.hash}
          tooltip={{
            position: 'bottom',
            content: 'Copied transaction hash to your clipboard',
          }}
        />
      </Stack>
    ),
    showAfterCont &&
      variant !== 'tile' &&
      !statusPassed(tx.status, 'signed') && (
        <TxStatusItem
          variant={variant}
          status="paused"
          label={signedByYou ? 'add external signatures' : 'Waiting for sign'}
        >
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
                Sync with chain
              </Button>
              <CopyButton data={copyTx} />
            </Stack>
          )}
          {variant === 'expanded' && !signedByYou && (
            <Stack flexDirection={'column'} gap={'sm'}>
              {signError && (
                <Notification intent="negative" role="alert">
                  {signError}
                </Notification>
              )}
              <Stack gap={'sm'}>
                <Button
                  data-testid="signTx"
                  isCompact
                  onClick={() => {
                    if (signAll) {
                      signAll().catch((e) => {
                        const errorMessage = getErrorMessage(
                          e,
                          "Couldn't sign transaction",
                        );
                        setSignError(errorMessage);
                      });
                    }
                  }}
                  startVisual={<MonoSignature />}
                >
                  Sign Tx
                </Button>
                <CopyButton
                  data={copyTx}
                  tooltip={{
                    position: 'bottom',
                    content:
                      'The transaction url is copied to to the clipboard.',
                  }}
                />
              </Stack>
            </Stack>
          )}
        </TxStatusItem>
      ),
    showAfterCont && statusPassed(tx.status, 'signed') && (
      <TxStatusItem variant={variant} status="success" label="Signed" />
    ),
    showAfterCont &&
      variant !== 'tile' &&
      statusPassed(tx.status, 'signed') &&
      !statusPassed(tx.status, 'preflight') && (
        <TxStatusItem
          variant={variant}
          status="paused"
          label={sendDisabled ? 'Transaction is pending' : 'Ready to preflight'}
        >
          {variant === 'expanded' && (
            <>
              <Stack gap={'sm'}>
                <Button
                  isCompact
                  onClick={() => onPreflight()}
                  isDisabled={sendDisabled}
                  startVisual={<MonoViewInAr />}
                >
                  Preflight
                </Button>

                <Tooltip
                  position="bottom"
                  isCompact
                  isOpen={showPreflightInfo}
                  content={
                    <>
                      <div>Preflight will test your transaction first</div>
                      <div>to avoid paying gas for a failed submission.</div>
                    </>
                  }
                >
                  <Button
                    isCompact
                    variant="transparent"
                    startVisual={<MonoInfo />}
                    onPress={() => setShowPreflightInfo((v) => !v)}
                  />
                </Tooltip>
                <CopyButton data={copyTx} />
              </Stack>
            </>
          )}
        </TxStatusItem>
      ),
    showAfterCont && statusPassed(tx.status, 'preflight') && (
      <TxStatusItem
        variant={variant}
        status={
          tx.preflight?.result.status === 'success' ? 'success' : 'failure'
        }
        label="Preflight"
      >
        {variant === 'expanded' &&
          tx.status === 'preflight' &&
          tx.preflight?.result.status === 'failure' && (
            <>
              <Button isCompact onClick={() => onPreflight()}>
                <MonoRefresh />
              </Button>
              <Button
                isCompact
                variant="transparent"
                onClick={() => onSubmit(true)}
              >
                Skip
              </Button>
            </>
          )}
      </TxStatusItem>
    ),
    showAfterCont &&
      variant !== 'tile' &&
      tx.status === 'preflight' &&
      tx.preflight?.result.status === 'success' && (
        <TxStatusItem variant={variant} status="paused" label="Ready to send">
          {variant === 'expanded' && (
            <>
              <Button
                isCompact
                onClick={() => onSubmit()}
                isDisabled={sendDisabled}
                startVisual={<MonoViewInAr />}
              >
                Send tx
              </Button>
              <CopyButton data={copyTx} />
            </>
          )}
        </TxStatusItem>
      ),
    showAfterCont && statusPassed(tx.status, 'submitted') && (
      <TxStatusItem
        variant={variant}
        status={tx.request ? 'success' : 'failure'}
        label="Send"
      >
        {variant === 'expanded' && !tx.request && (
          <Button isCompact onClick={() => onSubmit(true)}>
            <MonoRefresh />
          </Button>
        )}
      </TxStatusItem>
    ),
    showAfterCont &&
      statusPassed(tx.status, 'submitted') &&
      (!('result' in tx) || !tx.result) && (
        <TxStatusItem variant={variant} status="active" label="Mining" />
      ),
    statusPassed(tx.status, 'success') && (
      <TxStatusItem
        variant={variant}
        status="success"
        label={`Mined 
      ${
        tx.continuation?.autoContinue && contTx
          ? `in chain ${tx.purpose!.data.source as string}`
          : ''
      }`}
      />
    ),
    tx.status === 'failure' && (
      <TxStatusItem variant={variant} status="failure" label="Failed" />
    ),
    statusPassed(tx.status, 'success') && [
      tx.continuation?.autoContinue && !tx.continuation.proof && (
        <TxStatusItem
          variant={variant}
          status="active"
          label="Fetching proof"
        />
      ),
      showAfterCont &&
        tx.continuation?.autoContinue &&
        tx.continuation.proof && (
          <TxStatusItem
            variant={variant}
            status="success"
            label=" proof fetched"
          />
        ),
      contTx && [
        variant !== 'minimized' && (
          <Stack
            gap="sm"
            alignItems="center"
            paddingInlineStart="md"
            paddingBlock="sm"
          >
            <Text>{`cont: ${shorten(contTx.hash, 6)}`}</Text>
          </Stack>
        ),
        statusPassed(contTx.status, 'preflight') && (
          <TxStatusItem
            variant={variant}
            status={
              contTx.preflight?.result.status === 'success'
                ? 'success'
                : 'failure'
            }
            label="Preflight"
          />
        ),
        statusPassed(contTx.status, 'submitted') && (
          <TxStatusItem variant={variant} status="success" label="Send" />
        ),
        statusPassed(contTx.status, 'submitted') &&
          (!('result' in contTx) || !contTx.result) && (
            <TxStatusItem variant={variant} status="active" label="Mining" />
          ),
        statusPassed(contTx.status, 'success') && (
          <TxStatusItem variant={variant} status="success" label="Mined" />
        ),
        contTx.status === 'failure' && (
          <TxStatusItem variant={variant} status="failure" label="Failed" />
        ),
      ],
    ],
  ]
    .flat(Infinity)
    .filter(Boolean);

  const txCompletedStatus = () => {
    if (
      statusPassed(tx.status, 'success') &&
      (!tx.continuation?.autoContinue ||
        (contTx && statusPassed(contTx.status, 'success')))
    )
      return 'success';

    if (
      tx.status === 'failure' &&
      (!tx.continuation?.autoContinue ||
        (contTx && contTx.status === 'failure'))
    )
      return 'failure';

    return;
  };

  if (variant === 'minimized') return statusList.pop() as JSX.Element;
  return (
    <>
      <Stack alignItems="center" justifyContent="space-between">
        <Heading variant="h6">Status</Heading>
        {onView && (
          <Button
            variant="outlined"
            isCompact
            startVisual={<MonoOpenInFull />}
            onPress={onView}
          >
            Expand
          </Button>
        )}
      </Stack>
      <Stack className={statusListWrapperClass} gap="sm" width="100%">
        {variant === 'expanded' && (
          <Stack
            gap="sm"
            className={iconSuccessClass({ variant: txCompletedStatus() })}
          >
            <MonoFactCheck width={16} height={16} />
            {txCompletedStatus() === 'success' && (
              <Text>Transaction is successful</Text>
            )}
            {txCompletedStatus() === 'failure' && (
              <Text>Transaction is failed</Text>
            )}
            {!txCompletedStatus() && <Text>Transaction is ready</Text>}
          </Stack>
        )}
        {statusList}
      </Stack>
    </>
  );
}
