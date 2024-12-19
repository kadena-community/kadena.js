import { ITransaction } from '@/modules/transaction/transaction.repository';

import { MonoCheck } from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';

import { IPactCommand } from '@kadena/client';

import { shortenPactCode } from '@/utils/parsedCodeToPact';
import { Value } from './helpers';
import {
  codeClass,
  successClass,
  txTileClass,
  txTileContentClass,
} from './style.css';
import { TxPipeLine } from './TxPipeLine';

export const TxTileGeneric = ({
  tx,
  contTx,
  buttons,
}: {
  tx: ITransaction;
  contTx?: ITransaction;
  buttons: {
    label: string;
    onClick: () => void;
    Icon?: React.FC<{ className?: string }>;
    position: 'flex-start' | 'flex-end';
  }[];
}) => {
  const command: IPactCommand = JSON.parse(tx.cmd);

  return (
    <Stack
      flexDirection={'column'}
      justifyContent={'space-between'}
      className={txTileClass}
      gap={'sm'}
    >
      <Stack flexDirection={'column'} gap={'sm'} flex={1}>
        <TxPipeLine tx={tx} variant="tile" contTx={contTx} />
        {
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
                  <Stack>
                    <Text size={'smallest'} className={successClass}>
                      <Stack alignItems={'center'} gap={'xs'}>
                        <MonoCheck />
                        Already present in wallet
                      </Stack>
                    </Text>
                  </Stack>

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
        }
      </Stack>

      <Stack justifyContent={'space-between'} flexDirection={'row'}>
        <Stack justifyContent={'space-between'} alignItems={'flex-start'}>
          {buttons
            .filter((b) => b.position === 'flex-start')
            .map(({ label, onClick, Icon }) => (
              <>
                <Button
                  key={label}
                  variant="outlined"
                  isCompact
                  onClick={onClick}
                >
                  <Stack gap={'sm'} alignItems={'center'}>
                    {Icon && <Icon />}
                    {label}
                  </Stack>
                </Button>{' '}
              </>
            ))}
        </Stack>

        <Stack justifyContent={'space-between'} alignItems={'flex-end'}>
          {buttons
            .filter((b) => b.position === 'flex-end')
            .map(({ label, onClick, Icon }) => (
              <>
                <Button
                  key={label}
                  variant="outlined"
                  isCompact
                  onClick={onClick}
                >
                  <Stack gap={'sm'} alignItems={'center'}>
                    {Icon && <Icon />}
                    {label}
                  </Stack>
                </Button>{' '}
              </>
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
