import { ChainId } from '@kadena/types';

export const SIMULATION_CONFIG = {
  LOG_FOLDERNAME: `${process.cwd()}/simulation-logs}`,
  DEFAULT_CHAIN_ID: '0' as ChainId,
  NETWORK_HOST: 'http://localhost:8080',
  NETWORK_ID: 'fast-development',
  CHAIN_COUNT: 20,
};
