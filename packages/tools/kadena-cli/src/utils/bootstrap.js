// Bootstrapper for CLI
// Path: src/utils/bootstrap.ts
// write default networks to file
import { networkDefaults } from '../constants/networks.js';
import { writeNetworks } from '../networks/networksHelpers.js';
// create default mainnet
writeNetworks(networkDefaults.mainnet);
// create default testnet
writeNetworks(networkDefaults.testnet);
