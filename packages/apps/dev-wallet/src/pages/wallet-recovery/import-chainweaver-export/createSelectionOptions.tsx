import { ExportFromChainweaver } from '@/utils/chainweaver/chainweaver';
import { convertFromChainweaver } from '@/utils/chainweaver/convertFromChainweaver';
import { forEachKey } from './forEachKey';
import {
  ImportAccount,
  ImportKeypair,
  ImportNetwork,
  ImportRootKey,
  ImportToken,
  OptionType,
} from './import-chainweaver-export';

export function createSelectionOptions(
  chainweaverExport: ExportFromChainweaver,
) {
  let selectionOptions: {
    accounts: OptionType<ImportAccount>[];
    keyPairs: OptionType<ImportKeypair>[];
    tokens: OptionType<ImportToken>[];
    networks: OptionType<ImportNetwork>[];
    rootKey: OptionType<ImportRootKey>[];
  } = {
    accounts: [],
    keyPairs: [],
    tokens: [],
    networks: [],
    rootKey: [],
  };

  const setSelectionOptions = (
    fn: (prev: typeof selectionOptions) => typeof selectionOptions,
  ) => {
    selectionOptions = fn(selectionOptions);
  };

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

  return selectionOptions;
}
