import { createCommand } from '../../../utils/createCommand.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { networkIsAlive } from '../utils/network.js';
import { simulateCoin } from '../utils/simulation/coin/simulate.js';
import { simulationOptions } from '../utils/simulation/simulationOptions.js';

export const simulateCommand = createCommand(
  'simulate',
  'Simulate traffic on a devnet',
  [
    globalOptions.network(),
    simulationOptions.simulationNumberOfAccounts({ isOptional: true }),
    simulationOptions.simulationTransferInterval({ isOptional: true }),
    globalOptions.logFolder({ isOptional: true }),
    simulationOptions.simulationTokenPool({ isOptional: true }),
    simulationOptions.simulationMaxTransferAmount({ isOptional: true }),
    simulationOptions.simulationDefaultChainId({ isOptional: true }),
    simulationOptions.simulationSeed({ isOptional: true }),
    simulationOptions.simulationMaxTime({ isOptional: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('devnet-simulate:action', config);

    if (!(await networkIsAlive(config.networkConfig.networkHost))) {
      log.info(
        'Network is not reachable. Please check if the provided host is exposed.',
      );
      return;
    }

    await simulateCoin({
      network: {
        id: 'development',
        host: config.networkConfig.networkHost,
      },
      maxAmount: config.simulationMaxTransferAmount,
      numberOfAccounts: config.simulationNumberOfAccounts,
      transferInterval: config.simulationTransferInterval,
      tokenPool: config.simulationTokenPool,
      logFolder: config.logFolder,
      defaultChain: config.simulationDefaultChainId,
      seed: config.simulationSeed,
      maxTime: config.simulationMaxTime,
    });
  },
);
