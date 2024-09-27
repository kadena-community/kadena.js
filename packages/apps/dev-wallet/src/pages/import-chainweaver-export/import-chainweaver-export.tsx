import { convertFromChainweaver } from '@/utils/chainweaver/convertFromChainweaver';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createProfileFromChainweaverData } from './createProfileFromChainweaverData';

type Inputs = {
  password?: string;
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
export type ImportAccount = {
  network: string;
  account: string;
  notes?: string;
};
export type ImportKeypair = { private: string; public: string; index: number };
export type ImportToken = {
  network: string;
  namespace: string | null;
  name: string;
};
export type ImportNetwork = { network: string; hosts: string[] };
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

export const ImportChainweaverExport: React.FC<{
  setOrigin: (pathname: string) => void;
}> = ({ setOrigin }) => {
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
              selected: true,
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
            selected: true,
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
              selected: true,
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
            selected: true,
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
            selected: true,
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

  const importSelection = async (data: Inputs) => {
    const isSelected = (n: { selected: boolean }) => n.selected;
    const selectedKeyPairs = selectionOptions.keyPairs.filter(isSelected);
    const selectedRootKey = selectionOptions.rootKey.filter(isSelected);

    if (selectedRootKey.length > 0 || selectedKeyPairs.length > 0) {
      // if we want to import keypairs
      if (!(data.password && data.password.length > 0)) {
        // and there's no password yet
        // request a password
        setStep('password');
        return;
      }
    }

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

    setSelectedOptions(selectedOptions);
    try {
      if (!data.password) {
        throw new Error('No password provided');
      }
      await createProfileFromChainweaverData(
        selectedOptions,
        data.password,
        'Chainweaver-import', // TODO: use profile from user input
      );
      setOrigin('/');
    } catch (e) {
      console.error(e);
      // throw new Error('Failed to create profile');
    }
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
        <form onSubmit={handleSubmit(importSelection)}>
          <Button type="submit">Import</Button>
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
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handleSubmit(importSelection)}>
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
