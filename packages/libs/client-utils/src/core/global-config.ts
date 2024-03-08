import type { IClientConfig } from './utils/helpers';

const createGlobalConfig = () => {
  let config: Partial<IClientConfig> = {};
  return {
    setGlobalConfig: (cfg: Partial<IClientConfig>) => {
      config = cfg ?? {};
    },
    getGlobalConfig: () => {
      return config;
    },
  };
};

export const { setGlobalConfig, getGlobalConfig } = createGlobalConfig();
