import { ExportFromChainweaver } from './chainweaver';

export const validateStructure = (
  exportData: Partial<ExportFromChainweaver>,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = exportData.StoreFrontend_Data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keys = data.map((d: any) => d[0][0]);
    const expectedKeys = [
      'StoreFrontend_Wallet_Keys', // confirmed
      'StoreFrontend_Wallet_Accounts', // confirmed
      // 'StoreFrontend_Network_PublicMeta', // optional
      // 'StoreFrontend_Network_Networks', // optional but should be filled with default values
      // 'StoreFrontend_Network_SelectedNetwork', // optional
      // 'StoreFrontend_ModuleExplorer_SessionFile', // optional
    ];

    expectedKeys.forEach((key) => {
      if (!keys.includes(key)) {
        throw new Error(`Missing key: ${key}`);
      }
    });

    const checks = [
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (!checks.some(([__accessor, expected]) => actual === expected)) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      }
    });
  } catch (e) {
    console.error(e);
    throw new Error(`Invalid export data\n${e}`);
  }
};
