import path from 'node:path';
import { DEFAULT_SETTINGS_PATH, NETWORKS_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { isNotEmptyString } from '../../utils/globalHelpers.js';

export const getDefaultSettingsDirectory = (): string | null => {
  const kadenaDir = services.config.getDirectory();
  return isNotEmptyString(kadenaDir)
    ? path.join(kadenaDir, DEFAULT_SETTINGS_PATH)
    : null;
};

export const getNetworkDirectory = (): string | null => {
  const kadenaDir = services.config.getDirectory();
  return isNotEmptyString(kadenaDir)
    ? path.join(kadenaDir, NETWORKS_DIR)
    : null;
};

export const getNetworksDefaultSettingsDirectory = (): string | null => {
  const defaultDir = getDefaultSettingsDirectory();
  return isNotEmptyString(defaultDir)
    ? path.join(defaultDir, NETWORKS_DIR)
    : null;
};

export const getNetworksSettingsFilePath = (): string | null => {
  const defaultNetworksDir = getNetworksDefaultSettingsDirectory();
  return isNotEmptyString(defaultNetworksDir)
    ? path.join(defaultNetworksDir, '__default__.yaml')
    : null;
};
