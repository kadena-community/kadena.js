import { convertFromChainweaver } from '@/utils/chainweaver/convertFromChainweaver';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Inputs = {
  password: string;
  exportContents: FileList;
};

function forEachKey<T extends object>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T]) => void,
) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      callback(key as keyof T, obj[key]);
    }
  }
}

type OptionType<
  T extends
    | ImportAccount
    | ImportKeypair
    | ImportToken
    | ImportNetwork
    | ImportRootKey,
> = {
  description: string;
  selected: boolean;
  value: T;
  id: string;
};
type ImportAccount = { network: string; account: string; notes?: string };
type ImportKeypair = { private: string; public: string; index: number };
type ImportToken = { network: string; namespace: string | null; name: string };
type ImportNetwork = { network: string; hosts: string[] };
type ImportRootKey = { rootkey: string };

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.readAsText(file);
  });
};

export const ImportChainweaverExport: React.FC = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [step, setStep] = useState<'upload' | 'select' | 'password'>('upload');
  const [selectionOptions, setSelectionOptions] = useState<{
    accounts: OptionType<ImportAccount>[];
    keyPairs: OptionType<ImportKeypair>[];
    tokens: OptionType<ImportToken>[];
    networks: OptionType<ImportNetwork>[];
    rootKey: OptionType<ImportRootKey>[];
  }>({ accounts: [], keyPairs: [], tokens: [], networks: [], rootKey: [] });
  const [selectedOptions, setSelectedOptions] = useState<{
    accounts: ImportAccount[];
    keyPairs: ImportKeypair[];
    tokens: ImportToken[];
    networks: ImportNetwork[];
    rootKey: string;
  }>();

  const parseAndCreateSelectionOptions = async (data: Inputs) => {
    const cwExport = await readFile(data.exportContents[0] as File);
    const chainweaverExport = JSON.parse(cwExport);
    const cwData = convertFromChainweaver(chainweaverExport);

    forEachKey(cwData.accounts, (network, value) => {
      forEachKey(value, (account, { notes }) => {
        setSelectionOptions((prev) => ({
          ...prev,
          accounts: [
            ...prev.accounts,
            {
              description: `${network} - ${account}`,
              selected: false,
              value: { network, account, notes },
              id: `${network}-${account}`,
            },
          ],
        }));
      });
    });

    cwData.encryptedKeyPairs.forEach((keyPair) => {
      setSelectionOptions((prev) => ({
        ...prev,
        ...prev,
        keyPairs: [
          ...prev.keyPairs,
          {
            description: keyPair.public,
            selected: false,
            value: keyPair,
            id: keyPair.public,
          },
        ],
      }));
    });

    forEachKey(cwData.tokens, (network, tokens) => {
      tokens.forEach((token) => {
        setSelectionOptions((prev) => ({
          ...prev,
          tokens: [
            ...prev.tokens,
            {
              description: `${network} - ${token.namespace === null ? '' : `${token.namespace}.`}${token.name}`,
              selected: false,
              value: { network, ...token },
              id: `${network}-${token.namespace}-${token.name}`,
            },
          ],
        }));
      });
    });

    forEachKey(cwData.networks, (network, hosts) => {
      setSelectionOptions((prev) => ({
        ...prev,
        networks: [
          ...prev.networks,
          {
            description: `${network} - ${hosts.join(', ')}`,
            selected: false,
            value: { network, hosts },
            id: network,
          },
        ],
      }));
    });

    if (cwData.rootKey) {
      setSelectionOptions((prev) => ({
        ...prev,
        rootKey: [
          {
            description: 'Root key',
            selected: false,
            value: { rootkey: cwData.rootKey },
            id: 'rootkey',
          },
        ],
      }));
    }

    setStep('select');
  };

  const toggleSelectSection = (section: keyof typeof selectionOptions) => {
    setSelectionOptions((prev) => {
      const isFirstSelected = prev[section][0].selected;
      const updatedSection = prev[section as keyof typeof selectionOptions].map(
        (option) => {
          return { ...option, selected: !isFirstSelected };
        },
      );

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  const storeSelection = async () => {
    const selectedAccounts = selectionOptions.accounts.filter(
      (account) => account.selected,
    );
    const selectedKeyPairs = selectionOptions.keyPairs.filter(
      (keyPair) => keyPair.selected,
    );
    const selectedTokens = selectionOptions.tokens.filter(
      (token) => token.selected,
    );
    const selectedNetworks = selectionOptions.networks.filter(
      (network) => network.selected,
    );
    const selectedRootKey = selectionOptions.rootKey.filter(
      (rootKey) => rootKey.selected,
    );

    console.log('selectedAccounts', selectedAccounts);
    console.log('selectedKeyPairs', selectedKeyPairs);
    console.log('selectedTokens', selectedTokens);
    console.log('selectedNetworks', selectedNetworks);
    console.log('selectedRootKey', selectedRootKey);

    // if we want to import keypairs
    if (selectedRootKey.length > 0 || selectedKeyPairs.length > 0) {
      setStep('password');
    }
  };

  const importSelectionWithPassword = async (data: Inputs) => {
    const selectedOptions = {
      accounts: selectionOptions.accounts
        .filter((account) => account.selected)
        .map((account) => account.value),
      keyPairs: selectionOptions.keyPairs
        .filter((keyPair) => keyPair.selected)
        .map((keyPair) => keyPair.value),
      tokens: selectionOptions.tokens
        .filter((token) => token.selected)
        .map((token) => token.value),
      networks: selectionOptions.networks
        .filter((network) => network.selected)
        .map((network) => network.value),
      rootKey: selectionOptions.rootKey
        .filter((rootKey) => rootKey.selected)
        .reduce((_, rootKey) => rootKey.value.rootkey, ''),
    };

    console.log('password', data.password);
    console.log('importing', selectedOptions);

    setSelectedOptions(selectedOptions);
  };

  return (
    <>
      {step === 'upload' && (
        <form onSubmit={handleSubmit(parseAndCreateSelectionOptions)}>
          <Stack flexDirection="column">
            <label htmlFor="chainweaverFile">
              Upload the exported file from Chainweaver
            </label>
            <input
              id="chainweaverFile"
              type="file"
              {...register('exportContents')}
            />
            <Button type="submit">Import</Button>
          </Stack>
        </form>
      )}

      {step === 'select' && (
        <form onSubmit={handleSubmit(storeSelection)}>
          <Stack flexDirection="column">
            {Object.keys(selectionOptions).map((key) => {
              const value =
                selectionOptions[key as keyof typeof selectionOptions];
              return (
                <Stack key={key} flexDirection="column">
                  <Heading variant="h5">{key}</Heading>
                  <Button
                    variant="outlined"
                    onPress={() =>
                      toggleSelectSection(key as keyof typeof selectionOptions)
                    }
                  >
                    All
                  </Button>
                  <ul>
                    {value.map((option) => {
                      return (
                        <li>
                          <Stack key={option.id} flexDirection="row">
                            <input
                              type="checkbox"
                              checked={option.selected}
                              id={option.id}
                              onChange={() => {
                                setSelectionOptions((prev) => {
                                  const updatedSection = prev[
                                    key as keyof typeof selectionOptions
                                  ].map((o) => {
                                    if (o.id === option.id) {
                                      return { ...o, selected: !o.selected };
                                    }
                                    return o;
                                  });

                                  return {
                                    ...prev,
                                    [key]: updatedSection,
                                  };
                                });
                              }}
                            />
                            <label htmlFor={option.id}>
                              {option.description}
                            </label>
                          </Stack>
                        </li>
                      );
                    })}
                  </ul>
                </Stack>
              );
            })}
          </Stack>
          <Button type="submit">Import</Button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handleSubmit(importSelectionWithPassword)}>
          <Stack flexDirection="column">
            <label htmlFor="password">Enter your password</label>
            <input type="password" {...register('password')} />
          </Stack>
          <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
        </form>
      )}
    </>
  );
};
