import { readFileSync, readdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, relative } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadGitFiles } from '../../services/download-git-files';
import { flattenFolder } from '../../services/path';
import {
  getCodeFiles,
  getMarmaladeTemplates,
  getNsCodeFiles,
  updateTemplateFilesWithCodeFile,
} from '../utils/file';

// Mock the fs and path modules
vi.mock('fs', () => ({
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));
vi.mock('../../services/path', () => ({
  flattenFolder: vi.fn(),
}));

vi.mock('../../services/download-git-files', () => ({
  downloadGitFiles: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const repositoryConfig = {
  owner: 'owner',
  name: 'name',
  branch: 'branch',
};

const remoteConfig = {
  templatePath: 'templatePath',
  templateExtension: 'yaml',
  namespacePaths: ['ns'],
  codefileExtension: 'pact',
};

const localConfig = {
  templatePath: 'templatePath',
  codeFilesPath: 'codeFilePath',
  namespacePath: 'namespacePath',
};

describe('getMarmaladeTemplates', () => {
  it('should download git files and flatten folder if flatFolder is true', async () => {
    //@ts-ignore
    readdirSync.mockReturnValue(['file1', 'file2']);
    //@ts-ignore
    downloadGitFiles.mockResolvedValue(undefined);
    //@ts-ignore
    flattenFolder.mockResolvedValue(undefined);

    await getMarmaladeTemplates({
      repositoryConfig,
      remoteConfig,
      localConfig,
      flatFolder: true,
    });

    expect(downloadGitFiles).toHaveBeenCalled();
    expect(readdirSync).toHaveBeenCalledWith('templatePath');
    expect(flattenFolder).toHaveBeenCalledWith('templatePath', ['yaml']);
  });

  it('should throw an error if no template files are found', async () => {
    //@ts-ignore
    readdirSync.mockReturnValue([]);

    await expect(
      getMarmaladeTemplates({
        repositoryConfig,
        remoteConfig,
        localConfig,
        flatFolder: true,
      }),
    ).rejects.toThrow(
      'No template files found. Please double-check the provided credentials.',
    );

    expect(downloadGitFiles).toHaveBeenCalled();
    expect(readdirSync).toHaveBeenCalledWith('templatePath');
  });

  it('should not flatten folder if flatFolder is false', async () => {
    //@ts-ignore
    readdirSync.mockReturnValue(['file1', 'file2']);
    //@ts-ignore
    downloadGitFiles.mockResolvedValue(undefined);

    await getMarmaladeTemplates({
      repositoryConfig,
      remoteConfig,
      localConfig,
      flatFolder: false,
    });

    expect(downloadGitFiles).toHaveBeenCalled();
    expect(readdirSync).toHaveBeenCalledWith('templatePath');
    expect(flattenFolder).not.toHaveBeenCalled();
  });
});

describe('getNsCodeFiles', () => {
  it('should download the all namespace git files', async () => {
    await getNsCodeFiles({
      repositoryConfig,
      remoteConfig: { ...remoteConfig, namespacePaths: ['ns', 'ns1'] },
      localConfig,
    });

    expect(downloadGitFiles).toHaveBeenCalledTimes(2);
    expect(downloadGitFiles).toHaveBeenNthCalledWith(1, {
      path: 'ns',
      localPath: 'namespacePath',
      fileExtension: 'pact',
      name: 'name',
      branch: 'branch',
      owner: 'owner',
    });
    expect(downloadGitFiles).toHaveBeenNthCalledWith(2, {
      path: 'ns1',
      localPath: 'namespacePath',
      fileExtension: 'pact',
      name: 'name',
      branch: 'branch',
      owner: 'owner',
    });
  });
});
describe('getCodeFiles', () => {
  it('should throw an error if no template files are found', async () => {
    //@ts-ignore
    readdirSync.mockReturnValue([]);

    await expect(
      getCodeFiles({
        repositoryConfig,
        remoteConfig,
        localConfig,
      }),
    ).rejects.toThrow('No template files found');
  });

  it('should call downloadGitFiles with the correct arguments', async () => {
    //@ts-ignore
    readdirSync.mockReturnValue(['file1', 'file2']);
    //@ts-ignore
    readFileSync.mockReturnValue('codeFile: file');

    const loadSpy = vi
      .spyOn(yaml, 'load')
      .mockReturnValue({ codeFile: 'file' });

    //@ts-ignore
    await getCodeFiles({
      repositoryConfig,
      remoteConfig,
      localConfig,
    });

    expect(downloadGitFiles).toHaveBeenCalledTimes(2);
    expect(downloadGitFiles).toHaveBeenCalledWith({
      ...repositoryConfig,
      path: 'pact/file',
      localPath: localConfig.codeFilesPath,
      fileExtension: remoteConfig.codefileExtension,
    });
    expect(loadSpy).toHaveBeenCalledTimes(2);
  });
});
describe('getNsCodeFiles', () => {
  it('should call downloadGitFiles with the correct arguments', async () => {
    const multipleNsRemoteConfig = {
      ...remoteConfig,
      namespacePaths: ['path1', 'path2'],
    };

    await getNsCodeFiles({
      repositoryConfig,
      remoteConfig: multipleNsRemoteConfig,
      localConfig,
    });

    expect(downloadGitFiles).toHaveBeenCalledTimes(2);
    expect(downloadGitFiles).toHaveBeenCalledWith({
      ...repositoryConfig,
      path: 'path1',
      localPath: localConfig.namespacePath,
      fileExtension: remoteConfig.codefileExtension,
    });
    expect(downloadGitFiles).toHaveBeenCalledWith({
      ...repositoryConfig,
      path: 'path2',
      localPath: localConfig.namespacePath,
      fileExtension: remoteConfig.codefileExtension,
    });
  });
});

describe('updateTemplateFilesWithCodeFile', () => {
  it('should throw an error if code file is not found', async () => {
    //@ts-ignore
    readFileSync.mockReturnValue('codeFile: file');
    //@ts-ignore
    yaml.load.mockReturnValue({ codeFile: 'file' });

    await expect(
      updateTemplateFilesWithCodeFile(
        ['templateFile'],
        'templateDirectory',
        ['codeFile'],
        'codeFileDirectory',
      ),
    ).rejects.toThrow('Code file file not found');
  });

  it('should call writeFileSync with the correct arguments', async () => {
    //@ts-ignore
    readFileSync.mockReturnValue('codeFile: file');
    //@ts-ignore
    yaml.load.mockReturnValue({ codeFile: 'file' });

    await updateTemplateFilesWithCodeFile(
      ['templateFile'],
      'templateDirectory',
      ['file'],
      'codeFileDirectory',
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      join('templateDirectory', 'templateFile'),
      `codeFile: ${relative(
        'templateDirectory',
        join('codeFileDirectory', 'file'),
      )}`,
    );
  });
});
