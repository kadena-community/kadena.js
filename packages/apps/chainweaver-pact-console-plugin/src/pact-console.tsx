import { ChainId } from '@kadena/client';
import { dirtyReadClient, setGlobalConfig } from '@kadena/client-utils/core';
import {
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { Stack, Text } from '@kadena/kode-ui';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import classNames from 'classnames';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { communicate } from './communicate';
import { hostUrlGenerator, INetwork } from './network';
import { badgeClass, inputClass } from './style.css';

document.documentElement.classList.add(darkThemeClass);

export const chainIds = [...Array(20).keys()].map((key) => `${key}` as ChainId);

export function PactConsole({
  sessionId,
  target,
}: {
  sessionId: string;
  target: Window;
}) {
  const message = useMemo(
    () => communicate(window, target, '@kadena/chainweaver-pact-console-plugin', sessionId),
    [sessionId, target],
  );
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [command, setCommand] = useState<string>('');
  const [chainId, setChainId] = useState<ChainId>('0');
  const [networkId, setNetwork] = useState<string>(
    networks.length ? networks[0].networkId : 'testnet04',
  );
  const [commandHistory, setCommandHistory] = useState<{
    list: string[];
    pointer: number;
  }>({ list: [], pointer: 0 });
  const [logs, setLogs] = useState<
    Array<{
      number: number;
      command: string;
      chainId: ChainId;
      networkId: string;
      result: string;
    }>
  >([]);

  useEffect(() => {
    const networkList = async () => {
      const response = await message('GET_NETWORK_LIST');
      setNetworks(response.payload);
    };
    networkList();
  }, [message, sessionId]);

  useEffect(() => {
    // configure client-utils to use the networks provided
    setGlobalConfig({ host: hostUrlGenerator(networks) });
  }, [networks]);

  useLayoutEffect(() => {
    const listener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': {
          const pointer = Math.max(0, commandHistory.pointer - 1);
          const lastCommand = commandHistory.list[pointer];
          setCommand(lastCommand);
          setCommandHistory((history) => ({
            ...history,
            pointer,
          }));
          break;
        }
        case 'ArrowDown': {
          const pointer = Math.min(
            commandHistory.list.length - 1,
            commandHistory.pointer + 1,
          );
          const nextCommand = commandHistory.list[pointer];
          setCommand(nextCommand);
          setCommandHistory((history) => ({
            ...history,
            pointer,
          }));

          // Add your logic for the down key here
          break;
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [commandHistory]);

  useLayoutEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  return (
    <Stack gap="md" flexDirection={'column'}>
      {logs.length > 0 && (
        <Stack flexDirection={'column'} gap={'md'}>
          {logs.map((log, index) => (
            <Stack gap={'sm'} flexDirection={'column'}>
              <Stack gap={'sm'} flexDirection={'row'} alignItems={'center'}>
                <Text variant="code" size="small">
                  {log.number}:
                </Text>
                <Text
                  size="small"
                  className={classNames(badgeClass, 'network', 'disabled')}
                >
                  <Stack paddingInlineStart={'xs'} paddingInlineEnd={'lg'}>
                    {log.networkId}
                  </Stack>
                </Text>
                <Text
                  size="small"
                  className={classNames(badgeClass, 'chain', 'disabled')}
                >
                  <Stack paddingInlineStart={'xs'} paddingInlineEnd={'lg'}>
                    {log.chainId}
                  </Stack>
                </Text>
                <Text>{'>'}</Text>
                <Text variant="code" size="small">
                  {log.command}
                </Text>
              </Stack>
              <Text variant="code" size="small">
                <pre key={index}>{log.result}</pre>
              </Text>
            </Stack>
          ))}
        </Stack>
      )}
      <Stack
        gap={'sm'}
        flexDirection={'row'}
        alignItems={'center'}
        marginBlockEnd={'sm'}
      >
        <form
          style={{ display: 'contents' }}
          onSubmit={async (e) => {
            e.preventDefault();
            const pactCommand = composePactCommand(
              execution(command),
              setMeta({ chainId }),
              setNetworkId(networkId),
            );
            const result = await dirtyReadClient({})(pactCommand)
              .execute()
              .catch((e) => e);
            setCounter((counter) => counter + 1);
            setCommandHistory((history) => ({
              list: [...history.list, command],
              pointer: history.list.length + 1,
            }));
            setCommand('');
            setLogs((logs) => [
              ...logs,
              {
                number: counter + 1,
                command,
                chainId,
                networkId: networkId,
                result: JSON.stringify(result, null, 2),
              },
            ]);
          }}
        >
          <Stack gap={'sm'} alignItems={'center'}>
            <Text variant="code" size="small">
              {counter + 1}:
            </Text>
            <select
              className={classNames(badgeClass, 'network')}
              onChange={(e) => {
                setNetwork(e.target.value as string);
              }}
              value={networkId}
            >
              {networks.map((network) => (
                <option key={network.uuid} value={network.networkId}>
                  {network.networkId}
                </option>
              ))}
            </select>
            <select
              className={classNames(badgeClass, 'chain')}
              onChange={(e) => {
                setChainId(e.target.value as ChainId);
              }}
              value={chainId}
            >
              {chainIds.map((chainId) => (
                <option key={chainId} value={chainId}>
                  {chainId}
                </option>
              ))}
            </select>
            <Text>{'>'}</Text>
          </Stack>
          <Stack flex={1}>
            <input
              autoFocus
              className={inputClass}
              style={{ width: '100%', border: 'none', outline: 'none' }}
              onChange={(e) => {
                setCommand(e.target.value);
              }}
              value={command}
            />
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
