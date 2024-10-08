import { useWallet } from '@/modules/wallet/wallet.hook';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSelectionOptions } from './createSelectionOptions';
import { createProfileFromChainweaverData } from './createProfileFromChainweaverData';

type Inputs = {
  password?: string;
  profileName?: string;
  exportContents: FileList;
};

export type OptionType<
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

export type ImportRootKey = { rootkey: string };

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
  const { unlockProfile } = useWallet();

  const parseAndCreateSelectionOptions = async (data: Inputs) => {
    const cwExport = await readFile(data.exportContents[0] as File);
    setSelectionOptions(createSelectionOptions(cwExport));
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
      if (!data.profileName) {
        throw new Error('No profile name provided');
      }
      const profileId = await createProfileFromChainweaverData(
        selectedOptions,
        data.password,
        data.profileName,
      );
      if (!profileId) throw new Error('Failed to create profile');

      unlockProfile(profileId, data.password);
    } catch (e) {
      console.error(e);
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
            <label htmlFor="profileName">Enter your Profile Name</label>
            <input type="profileName" {...register('profileName')} />
            <label htmlFor="password">Enter your password</label>
            <input type="password" {...register('password')} />
            <Button type="submit">Import</Button>
          </Stack>
          <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
        </form>
      )}
    </>
  );
};
