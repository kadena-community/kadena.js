import path from 'node:path';
import {
  DEFAULT_SETTINGS_PATH,
  NETWORKS_DIR,
} from '../../../constants/config.js';
import { services } from '../../../services/index.js';

export const getDefaultSettingsDirectory = (): string => {
  const kadenaDir = services.config.getDirectory();
  return path.join(kadenaDir, DEFAULT_SETTINGS_PATH);
};

export const getNetworkDirectory = (): string => {
  const kadenaDir = services.config.getDirectory();
  return path.join(kadenaDir, NETWORKS_DIR);
};

export const getNetworksDefaultSettingsDirectory = (): string => {
  const defaultDir = getDefaultSettingsDirectory();
  return path.join(defaultDir, NETWORKS_DIR);
};

export const getNetworksSettingsFilePath = (): string => {
  const defaultNetworksDir = getNetworksDefaultSettingsDirectory();
  return path.join(defaultNetworksDir, '__default__.yaml');
};
