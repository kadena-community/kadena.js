import { IAccount } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { KeySourceType } from '@/modules/wallet/wallet.repository';
import {
  ChainId,
  createTransaction,
  ICap,
  IPartialPactCommand,
  ISignFunction,
  SignerScheme,
} from '@kadena/client';
import { dirtyReadClient, submitClient } from '@kadena/client-utils/core';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { execCodeParser, IParsedCode } from '@kadena/pactjs-generator';
import { useMemo, useRef, useState } from 'react';
import Terminal from 'react-console-emulator';
import { TerminalContainerClass } from './style.css';

const createCapArgs = (arg: IParsedCode['args'][number]): any => {
  if ('string' in arg) return arg.string;
  if ('int' in arg) return arg;
  if ('decimal' in arg) return arg;
  if ('list' in arg) return arg.list.map(createCapArgs);
  if ('object' in arg)
    return arg.object.reduce(
      (acc, { property, value }) => {
        acc[property] = createCapArgs(value);
        return acc;
      },
      {} as Record<string, any>,
    );
  if ('code' in arg) throw new Error('Code is not valid in capability');
  return arg;
};

const getSection = (part?: string) => (part ? `${part}.` : '');

const readData =
  ({
    networkId,
    chainId,
    defaultGasPayer,
  }: {
    networkId: string;
    chainId: ChainId;
    defaultGasPayer?: IAccount;
  }) =>
  (command: string | IPartialPactCommand) => {
    const cmd = typeof command === 'string' ? execution(command) : command;
    return dirtyReadClient({
      defaults: {
        meta: {
          chainId,
        },
        networkId,
      },
      // replace this with other sign methods if needed
    })(defaultGasPayer ? addGasPayer(defaultGasPayer)(cmd) : cmd);
  };

const addGasPayer = (gasPayer?: IAccount) => (command: IPartialPactCommand) => {
  let updCommand = { ...command };
  if (!updCommand.meta?.sender) {
    if (!gasPayer) {
      throw new Error('No gas payer set for transaction');
    }
    if (
      updCommand.signers?.find(
        (signer) => signer?.pubKey === gasPayer.keyset?.guard.keys[0],
      )?.clist?.length === 0
    ) {
      updCommand = composePactCommand(
        updCommand,
        setMeta({ senderAccount: gasPayer.address }),
      )();
    } else {
      updCommand = composePactCommand(
        updCommand,
        setMeta({ senderAccount: gasPayer.address }),
        addSigner(gasPayer.keyset!.guard.keys, (signFor) => [
          signFor('coin.GAS'),
        ]),
      )();
    }
  }
  return updCommand;
};

const transaction =
  ({
    networkId,
    chainId,
    defaultGasPayer,
    sign,
  }: {
    networkId: string;
    chainId: ChainId;
    defaultGasPayer?: IAccount;
    sign: ISignFunction;
  }) =>
  (command: IPartialPactCommand) => {
    const updCommand = composePactCommand(command, {
      networkId,
      meta: {
        chainId,
      },
    })({});
    return submitClient({
      sign: sign,
    })(addGasPayer(defaultGasPayer)(updCommand));
  };

interface IDefaultValues {
  networkId: string;
  chainId: ChainId;
  gasPayer?: IAccount;
}

const getError = (e: any) => {
  return e.message ? e.message : e.errorMsg ? e.errorMsg : JSON.stringify(e);
};

interface ICommandParts {
  code: string;
  data: Record<string, string>;
  signer: Array<{ publicKey: string; clist: ICap[] }>;
}

const getCommand = (
  commandParts: ICommandParts,
  getPublicKeyData: (publicKey: string) => {
    source: KeySourceType;
    index?: number | string;
    publicKey: string;
    scheme?: SignerScheme;
  } | null,
): IPartialPactCommand => {
  return {
    payload: {
      exec: { code: commandParts.code, data: commandParts.data ?? {} },
    },
    signers: commandParts.signer.map(({ publicKey, clist }) => ({
      pubKey: publicKey,
      scheme: getPublicKeyData(publicKey)?.scheme ?? 'ED25519',
      clist,
    })),
  };
};

export function TerminalPage() {
  const { initPage } = useLayout();
  const [txStep, setTxStep] = useState<
    null | 'start' | 'code' | 'data' | 'signer' | 'capability'
  >(null);
  const terminalRef = useRef<any>(null);
  const {
    accounts,
    fungibles,
    activeNetwork,
    setActiveNetwork,
    networks,
    sign,
    syncAllAccounts,
    keySources,
    keysets,
    getPublicKeyData,
  } = useWallet();
  const [commandParts, setCommandParts] = useState<ICommandParts>();
  const [command, setCommand] = useState<IPartialPactCommand>();
  const [{ networkId, chainId, gasPayer }, setDefaultValues] =
    useState<IDefaultValues>({
      networkId: activeNetwork?.networkId ?? 'testnet04',
      chainId: '0' as ChainId,
    });

  useMemo(() => {
    initPage({
      appContext: undefined,
      breadCrumbs: [
        {
          label: 'Dev Console',
          visual: <MonoDashboardCustomize />,
          url: '/terminal',
        },
      ],
    });
  }, []);

  const setDefaults = (patch: Partial<IDefaultValues>) => {
    setDefaultValues((prev) => ({ ...prev, ...patch }));
  };
  const read = useMemo(
    () => readData({ networkId, chainId }),
    [networkId, chainId],
  );

  const tx = useMemo(
    () =>
      transaction({
        networkId,
        chainId,
        defaultGasPayer: gasPayer,
        sign: sign as ISignFunction,
      }),
    [networkId, chainId, gasPayer, sign],
  );
  const commands = {
    chain: {
      description: 'switch to chain',
      usage: 'chain <chainId>',
      fn: (chainId: ChainId) => {
        if (![...Array(20).keys()].map(String).includes(chainId)) {
          return `Chain ${chainId} not found`;
        }
        setDefaults({ chainId });
        return `Switched to chain ${chainId}`;
      },
    },
    network: {
      description: 'switch to network',
      usage: 'network <networkId>',
      fn: (networkId: string) => {
        const network = networks.find((n) => n.networkId === networkId);
        if (!network) {
          return `Network ${networkId} not found`;
        }
        setActiveNetwork(network);
        setDefaults({ networkId });
        return `Switched to network ${networkId}`;
      },
    },
    command: {
      description: 'create a command object',
      usage: 'command',
      fn: async () => {
        setTxStep('start');
      },
    },
    send: {
      description: 'send transaction to blockchain',
      usage: 'send <command>',
      fn: async (...args: any[]) => {
        const input = args.join(' ');
        let pactCommand: IPartialPactCommand;
        if (!input || input === 'command') {
          if (!command) {
            return 'No command found';
          }
          pactCommand = command;
        } else {
          const commandJson = args.join(' ');
          try {
            pactCommand = JSON.parse(commandJson);
          } catch (e) {
            return 'Invalid command';
          }
        }
        try {
          tx(pactCommand)
            .on('command', (cmd) =>
              terminalRef.current?.pushToStdout(
                `command\n${JSON.stringify(cmd, null, 2)}`,
              ),
            )
            .on('sign', () => terminalRef.current?.pushToStdout('Signed'))
            .on('preflight', (result) =>
              terminalRef.current?.pushToStdout(
                `Preflight:${JSON.stringify(result)}`,
              ),
            )
            .on('submit', (result) =>
              terminalRef.current?.pushToStdout(
                `send:${JSON.stringify(result)}`,
              ),
            )
            .on('poll' as any, () =>
              terminalRef.current?.pushToStdout('polling result'),
            )
            .execute()
            .then((result) => {
              terminalRef.current?.pushToStdout(
                JSON.stringify(result, null, 2),
              );
              syncAllAccounts();
            })
            .catch((e) => {
              terminalRef.current?.pushToStdout(getError(e));
            });
          return 'sending...';
        } catch (e) {
          terminalRef.current?.pushToStdout(getError(e));
        }
      },
    },
    pact: {
      description: 'pact data from blockchain',
      usage: 'pact <string>',
      fn: async (...args: any[]) => {
        const input = args.join(' ');
        let exec;
        if (input === 'command' || !input) {
          if (!command) {
            return 'No command found';
          }
          exec = command;
        } else {
          exec = input;
        }
        read(exec)
          .execute()
          .then((result) => {
            terminalRef.current?.pushToStdout(JSON.stringify(result, null, 2));
          })
          .catch((e) => {
            terminalRef.current?.pushToStdout(getError(e));
          });
      },
    },
    sign: {
      description: 'sign a command',
      usage: 'sign <string [default=command]>',
      fn: async (...args: any[]) => {
        const input = args.join(' ');
        let cmd;
        try {
          if (input === 'command' || !input) {
            if (!command) {
              return 'No command found';
            }
            cmd = createTransaction(
              composePactCommand(
                command,
                gasPayer ? addGasPayer(gasPayer) : {},
              )({}),
            );
          } else {
            cmd = JSON.parse(input);
          }
          const signed = await sign(cmd);
          terminalRef.current?.pushToStdout(JSON.stringify(signed, null, 2));
        } catch (e) {
          terminalRef.current?.pushToStdout(getError(e));
        }
      },
    },

    accounts: {
      description: 'list accounts',
      usage: 'accounts <contract [default=coin]>',
      fn: (input = '') => {
        const contract = input.trim() ? input.trim() : 'coin';
        const fungible = fungibles.find((f) => f.contract === contract);
        if (!fungible) return `No fungible found for contract ${contract}`;
        const result = accounts
          .filter(
            (account) =>
              account.contract === contract &&
              account.networkUUID === networkId,
          )
          .map(
            (account) =>
              `${account.address} (${account.chains.find((ch) => ch.chainId === chainId)?.balance ?? 0} ${fungible.symbol})`,
          )
          .join('\n');

        if (!result)
          return `No accounts found for contract "${contract}" on chain #${chainId} network "${networkId}"`;
        return [
          `Accounts for "${contract}" on chain #${chainId} network "${networkId}" `,
          result,
        ].join('\n');
      },
    },
    'gas-payer': {
      description: 'set gas payer',
      usage: 'gas-payer <account address>',
      fn: (gasPayer: string) => {
        const account = accounts.find(
          (a) =>
            a.address === gasPayer &&
            a.networkUUID === networkId &&
            a.chains.find((ch) => ch.chainId === chainId)?.chainId,
        );
        if (!account)
          return `Account ${gasPayer} not found on chain ${chainId} network ${networkId}`;
        setDefaults({ gasPayer: account });
        return `Default Gas Payer" ${gasPayer}"`;
      },
    },
    keys: {
      description: 'list keys',
      usage: 'keys',
      fn: () => {
        const lines = keySources.map((source) => {
          const keys = source.keys.map((key) => {
            const info = getPublicKeyData(key.publicKey);
            return info
              ? `${key.index}: ${key.publicKey} ${info.scheme ? `(${info.scheme})` : ''}`
              : `${key.index}: ${key.publicKey} ${key.scheme ? `(${key.scheme})` : ''}`;
          });
          return [
            `Source: ${source.source}`,
            ...keys,
            '-----------------',
          ].join('\n');
        });
        return lines.join('\n');
      },
    },

    keysets: {
      description: 'list keysets',
      usage: 'keysets',
      fn: () => {
        const lines = keysets.map((keyset) => {
          const keys = keyset.guard.keys.map((key) => {
            const info = getPublicKeyData(key);
            return info
              ? `${info.publicKey} ${info.scheme ? `(${info.scheme})` : ''}`
              : key;
          });
          return [
            `principal: ${keyset.principal}`,
            `Keys:`,
            ...keys,
            `pred: ${keyset.guard.pred}`,
            '-----------------',
          ].join('\n');
        });
        return lines.join('\n');
      },
    },
  };

  const getStepLabel = (step: typeof txStep) => {
    switch (step) {
      case 'code':
        return 'Enter pact code:';
      case 'data':
        return 'Enter data (eg. key=value):';
      case 'signer':
        return 'Enter signer public key:';
      case 'capability':
        return 'Sign for capability:';
      default:
        return '';
    }
  };

  return (
    <Stack
      flex={1}
      overflow="auto"
      height="100%"
      flexDirection={'column'}
      position="relative"
    >
      <div className={TerminalContainerClass}>
        <Terminal
          noNewlineParsing
          commands={commands}
          ref={terminalRef}
          style={{
            flexBasis: 'auto',
            flexGrow: 0,
            maxHeight: '100%',
            minHeight: '100%',
            overflow: 'auto',
          }}
          inputAreaStyle={{
            display: 'block',
            wordBreak: 'break-word',
          }}
          promptLabelStyle={{
            overflowWrap: 'none',
            // background: 'red',
            minWidth: '100px',
            display: 'block',
          }}
          inputStyle={{
            padding: '0',
          }}
          messageStyle={{
            whiteSpace: 'pre',
          }}
          errorText={txStep ? ' ' : undefined}
          promptLabel={
            txStep ? getStepLabel(txStep) : `chain${chainId}@${networkId}:`
          }
          commandCallback={(args: { rawInput: string }) => {
            if (!txStep) return;
            if (args.rawInput === 'exit') {
              terminalRef.current?.pushToStdout('Command cancelled');
              setTxStep(null);
              return;
            }
            if (txStep === 'start') {
              terminalRef.current?.pushToStdout(
                'Complete all the following steps to create a command',
              );
            }
            if (txStep === 'start') {
              setTxStep('code');
              return;
            }
            if (txStep === 'code') {
              setCommandParts({ code: args.rawInput, data: {}, signer: [] });
              setTxStep('data');
              return;
            }
            if (txStep === 'data') {
              if (!args.rawInput) {
                setTxStep('signer');
                return;
              }
              const [key, value] = args.rawInput.split('=');
              if (!key || !value) {
                terminalRef.current?.pushToStdout(
                  'type data in key=value format',
                );
              }
              let val;
              try {
                val = JSON.parse(value);
              } catch (e) {
                val = value;
              }
              setCommandParts(
                (prev) =>
                  prev && {
                    ...prev,
                    data: { ...prev.data, [key]: val },
                  },
              );
            }
            if (txStep === 'signer' && args.rawInput) {
              setCommandParts(
                (prev) =>
                  prev && {
                    ...prev,
                    signer: [
                      ...prev.signer,
                      { publicKey: args.rawInput, clist: [] },
                    ],
                  },
              );
              setTxStep('capability');
              return;
            }
            if (txStep === 'capability') {
              if (!args.rawInput) {
                setTxStep('signer');
                return;
              }
              const sections = execCodeParser(args.rawInput);
              const clist = sections?.map(
                (section) =>
                  ({
                    name: `${getSection(section.function.namespace)}${getSection(section.function.module)}${section.function.name}`,
                    args: section.args.map(createCapArgs),
                  }) as ICap,
              );
              if (clist) {
                const lastSigner = commandParts?.signer.at(-1);
                lastSigner?.clist.push(...clist);
                setCommandParts((prev) => ({ ...prev }) as ICommandParts);
              }
            }
            if (txStep === 'signer' && !args.rawInput) {
              const cmd = getCommand(
                commandParts!,
                getPublicKeyData,
              ) as IPartialPactCommand;
              setCommand(cmd);
              terminalRef.current?.pushToStdout(JSON.stringify(cmd, null, 2));
              setTxStep(null);
              return;
            }
            // if (args.result || args.command === 'clear') return;
            // // return args.join(' ');
          }}
        />
      </div>
    </Stack>
  );
}
