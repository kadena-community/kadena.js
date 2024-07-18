export interface IMarmaladeNamespaceConfig {
  file: string;
  namespaces: string[];
}

// Note: the order of these matters - the first file is the first to be processed and so on
export const marmaladeNamespaceConfig: IMarmaladeNamespaceConfig[] = [
  {
    file: 'ns-marmalade.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale', 'kip', 'util'],
  },
  {
    file: 'ns-contract-admin.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale'],
  },
  { file: 'guards1.pact', namespaces: ['util'] },
];
