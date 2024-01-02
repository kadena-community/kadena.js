export interface IMarmaladeNamespaceConfig {
  file: string;
  namespaces: string[];
}

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
