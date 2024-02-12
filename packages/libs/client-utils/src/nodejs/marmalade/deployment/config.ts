export interface IRepositoryConfig {
  owner: string;
  name: string;
  branch: string;
  githubToken?: string;
}

export interface IRemoteConfig {
  templatePath: string;
  namespacePaths: string[];
  exclude?: string[];
  templateExtension: string;
  codefileExtension: string;
}

export interface ILocalConfig {
  templatePath: string;
  codeFilesPath: string;
  namespacePath: string;
}

// This configuration must reflect what are the namespace files to be deployed and
// what namespaces should be used to deploy each file
export interface INamespaceConfig {
  file: string;
  namespaces: string[];
}
