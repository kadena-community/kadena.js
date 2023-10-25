/**
 * @const configDefaults
 * Provides the default configurations for current project.
 */
export const configDefaults = {
    projectName: 'a-kadena-project',
    network: 'mainnet',
    chainId: 1,
};
export const workPath = `${process.cwd()}/.kadena`;
export const projectRootPath = `${process.cwd()}`;
export const projectPrefix = 'project-';
// key paths
export const KEY_DIR = `${process.cwd()}/.kadena/keys`;
// key extensions
export const HDKEY_EXT = '.hd.phrase';
export const HDKEY_ENC_EXT = '.enc.hd.phrase';
export const PLAINKEY_EXT = '.plain.key';
