import { networkDefaults } from '../constants/networks.js';
import { writeNetworks } from '../networks/networksHelpers.js';

writeNetworks(networkDefaults.mainnet);
writeNetworks(networkDefaults.testnet);
writeNetworks(networkDefaults.devnet);
