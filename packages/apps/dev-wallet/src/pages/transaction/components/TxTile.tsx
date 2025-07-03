import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import {
  MonoCheck,
  MonoDelete,
  MonoPending,
  MonoShare,
  MonoSignature,
  MonoViewInAr,
} from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';

import { IPactCommand } from '@kadena/client';

import { Confirmation } from '@/Components/Confirmation/Confirmation';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { normalizeSigs } from '@/utils/normalizeSigs';
import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';
import { useMemo, useState } from 'react';
import { Value } from './helpers';
import {
  codeClass,
  pendingClass,
  successClass,
  txTileClass,
  txTileContentClass,
} from './style.css';
import { TxPipeLine } from './TxPipeLine';
import { statusPassed } from './TxPipeLine/utils';

export const TxTile = ({
  tx,
  contTx,
  onSign,
  onSubmit,
  onPreflight,
  onView,
  sendDisabled,
}: {
  tx: ITransaction;
  contTx?: ITransaction;
  onSign: () => void;
  onSubmit: () => Promise<ITransaction>;
  onPreflight: () => Promise<ITransaction>;
  onView: () => void;
  sendDisabled?: boolean;
}) => {
  const command: IPactCommand = JSON.parse(tx.cmd);
  const { getPublicKeyData } = useWallet();
  const signers = useMemo(() => normalizeSigs(tx), [tx]);
  const isUserSigner = Boolean(
    signers.find((sigData) => getPublicKeyData(sigData?.pubKey)),
  );

  const nothingLeftToSignByUser = !signers.find(
    (sigData) => !sigData?.sig && getPublicKeyData(sigData?.pubKey),
  );
  const [shareClicked, setCopyClick] = useState(false);

  function shareTx() {
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
    navigator.clipboard.writeText(`${baseUrl}/sig-builder#${encodedTx}`);
    setCopyClick(true);
    setTimeout(() => setCopyClick(false), 5000);
  }

  return (
    <Stack
      flexDirection={'column'}
      justifyContent={'space-between'}
      className={txTileClass}
      gap={'sm'}
    >
      <Stack flexDirection={'column'} gap={'sm'} flex={1}>
        <TxPipeLine tx={tx} variant="tile" contTx={contTx} onView={onView} />
        {tx.status === 'initiated' && !nothingLeftToSignByUser && (
          <>
            {'exec' in command.payload && (
              <>
                <Stack
                  gap={'sm'}
                  flexDirection={'column'}
                  overflow="auto"
                  flex={1}
                  className={txTileContentClass}
                >
                  <Value className={codeClass}>
                    <span title={command.payload.exec.code}>
                      {shortenPactCode(command.payload.exec.code)}
                    </span>
                  </Value>
                </Stack>
              </>
            )}
            {'cont' in command.payload && (
              <>
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Text>Continuation</Text>
                  <Value>
                    {command.payload.cont.pactId}- step(
                    {command.payload.cont.step})
                  </Value>
                </Stack>
              </>
            )}
          </>
        )}
        {tx.status === 'initiated' &&
          nothingLeftToSignByUser &&
          isUserSigner && (
            <Stack
              gap={'sm'}
              flexDirection={'column'}
              overflow="auto"
              flex={1}
              className={txTileContentClass}
            >
              <Stack>
                <Text size={'smallest'} className={successClass}>
                  <Stack alignItems={'center'} gap={'xs'}>
                    <MonoCheck />
                    Signed by you
                  </Stack>
                </Text>
              </Stack>
              <Value className={codeClass}>
                You have signed this transaction, share the tx with others to
                sign;
              </Value>
            </Stack>
          )}
        {tx.status === 'initiated' &&
          nothingLeftToSignByUser &&
          !isUserSigner && (
            <Stack
              gap={'sm'}
              flexDirection={'column'}
              overflow="auto"
              flex={1}
              className={txTileContentClass}
            >
              <Stack>
                <Text size={'smallest'} className={pendingClass}>
                  <Stack alignItems={'center'} gap={'xs'}>
                    <MonoPending />
                    Add external signers
                  </Stack>
                </Text>
              </Stack>
              <Value className={codeClass}>
                share the tx with others to sign;
              </Value>
            </Stack>
          )}
        {tx.status === 'signed' && (
          <>
            <Stack
              gap={'sm'}
              flexDirection={'column'}
              overflow="auto"
              flex={1}
              justifyContent={'flex-end'}
              paddingBlockEnd={'sm'}
            >
              <Text size="small">
                {sendDisabled
                  ? 'Waiting for redistribution to complete.'
                  : 'Preflight will test your transaction first to avoid paying gas for a failed submission.'}
              </Text>
            </Stack>
          </>
        )}
      </Stack>
      <Stack justifyContent={'space-between'} alignItems={'center'}>
        <Confirmation
          label="Yes, cancel"
          dismissLabel="No"
          onPress={() => {
            if (tx.uuid) {
              transactionRepository.deleteTransaction(tx?.uuid);
            }
          }}
          trigger={
            <Button
              isDisabled={!tx || statusPassed(tx.status, 'submitted')}
              variant="outlined"
              isCompact
              startVisual={<MonoDelete />}
            >
              Cancel
            </Button>
          }
        >
          Are you sure you want to cancel this transaction?
        </Confirmation>

        {tx.status === 'initiated' && !nothingLeftToSignByUser && (
          <Button
            isCompact
            onClick={onSign}
            variant="positive"
            startVisual={<MonoSignature />}
          >
            Sign
          </Button>
        )}
        {tx.status === 'initiated' && nothingLeftToSignByUser && (
          <Button
            isCompact
            variant="positive"
            onClick={shareTx}
            startVisual={<MonoShare />}
          >
            {shareClicked ? 'Copied!' : 'Share'}
          </Button>
        )}
        {tx.status === 'signed' && !sendDisabled && (
          <Button
            isCompact
            variant="positive"
            onClick={onPreflight}
            startVisual={<MonoViewInAr />}
          >
            Preflight
          </Button>
        )}
        {tx.status === 'preflight' &&
          tx.preflight.result.status === 'success' &&
          !sendDisabled && (
            <Button
              variant="positive"
              isCompact
              onClick={onSubmit}
              startVisual={<MonoViewInAr />}
            >
              Send
            </Button>
          )}
      </Stack>
    </Stack>
  );
};
