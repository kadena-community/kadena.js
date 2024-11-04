import { ExportFromChainweaver } from './chainweaver';

export const validateStructure = (
  exportData: Partial<ExportFromChainweaver>,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = exportData.StoreFrontend_Data as any;
    const checks = [
      [() => data[0][0][0], 'StoreFrontend_Wallet_Keys'] as const,
      [() => data[1][0][0], 'StoreFrontend_Wallet_Tokens'] as const,
      [() => data[2][0][0], 'StoreFrontend_Wallet_Accounts'] as const,
      [() => data[3][0][0], 'StoreFrontend_Network_PublicMeta'] as const,
      [() => data[4][0][0], 'StoreFrontend_Network_Networks'] as const,
      [() => data[5][0][0], 'StoreFrontend_Network_SelectedNetwork'] as const,
      [
        () => data[6][0][0],
        'StoreFrontend_ModuleExplorer_SessionFile',
      ] as const,
      [
        () => exportData.BIPStorage_Data![0][0][0],
        'BIPStorage_RootKey',
      ] as const,
    ];
    checks.forEach(([accessor, expected]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let actual: any;
      try {
        actual = accessor();
      } catch (e) {
        throw new Error(`Error getting ${expected}\n${e}`);
      }

      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    });
  } catch (e) {
    console.error(e);
    throw new Error(`Invalid export data\n${e}`);
  }
};
