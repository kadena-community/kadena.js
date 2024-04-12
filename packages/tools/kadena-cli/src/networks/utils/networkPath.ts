import path from 'node:path';
import { DEFAULT_SETTINGS_PATH, NETWORKS_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { notEmpty } from '../../utils/globalHelpers.js';

export const getDefaultSettingsDirectory = (): string | null => {
  const kadenaDir = services.config.getDirectory();
  return notEmpty(kadenaDir)
    ? path.join(kadenaDir, DEFAULT_SETTINGS_PATH)
    : null;
};

export const getNetworkDirectory = (): string | null => {
  const kadenaDir = services.config.getDirectory();
  return notEmpty(kadenaDir) ? path.join(kadenaDir, NETWORKS_DIR) : null;
};

export const getNetworksDefaultSettingsDirectory = (): string | null => {
  const defaultDir = getDefaultSettingsDirectory();
  return notEmpty(defaultDir) ? path.join(defaultDir, NETWORKS_DIR) : null;
};

export const getNetworksSettingsFilePath = (): string | null => {
  const defaultNetworksDir = getNetworksDefaultSettingsDirectory();
  return notEmpty(defaultNetworksDir)
    ? path.join(defaultNetworksDir, '__default__.yaml')
    : null;
};
