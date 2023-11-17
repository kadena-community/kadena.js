import { networkDefaults } from '../constants/networks.js';
import { writeNetworks } from './utils/networkHelpers.js';

writeNetworks(networkDefaults.mainnet);
writeNetworks(networkDefaults.testnet);
writeNetworks(networkDefaults.devnet);
