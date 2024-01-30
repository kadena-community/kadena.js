// export interface IMarmaladeRepository {
//   owner: string;
//   name: string;
//   branch: string;
// }

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

// // Templates should be .yaml files and namespaces files should be .pact files
// export interface IMarmaladeRemoteConfig {
//   templatePath: string;
//   namespacePaths: string[];
//   exclude?: string[];
//   templateExtension: string;
//   codefileExtension: string;
// }

// export interface IMarmaladeLocalConfig {
//   templatePath: string;
//   codeFilesPath: string;
//   namespacePath: string;
// }

// export const marmaladeRepository: IMarmaladeRepository = {
//   owner: dotenv.MARMALADE_REPOSITORY_OWNER,
//   name: dotenv.MARMALADE_REPOSITORY_NAME,
//   branch: dotenv.MARMALADE_REPOSITORY_BRANCH,
// };

// export const marmaladeRemoteConfig: IMarmaladeRemoteConfig = {
//   templatePath: dotenv.MARMALADE_REMOTE_TEMPLATE_PATH,
//   namespacePaths: dotenv.MARMALADE_REMOTE_NAMESPACE_PATH,
//   exclude: dotenv.MARMALADE_REMOTE_EXCLUDE,
//   templateExtension: 'yaml',
//   codefileExtension: 'pact',
// };

// export const marmaladeLocalConfig: IMarmaladeLocalConfig = {
//   templatePath: dotenv.MARMALADE_LOCAL_TEMPLATE_PATH,
//   codeFilesPath: dotenv.MARMALADE_LOCAL_TEMPLATE_PATH,
//   namespacePath: dotenv.MARMALADE_LOCAL_NAMESPACE_PATH,
// };
