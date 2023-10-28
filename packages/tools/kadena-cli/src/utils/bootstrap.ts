// Bootstrapper for CLI

// Path: src/utils/bootstrap.ts
// write default networks to file

import { devnetDefaults } from '../constants/devnets.js';
import { networkDefaults } from '../constants/networks.js';
import { writeDevnets } from '../devnet/devnetsHelpers.js';
import { writeNetworks } from '../networks/networksHelpers.js';

// create default mainnet
writeNetworks(networkDefaults.mainnet);

// create default testnet
writeNetworks(networkDefaults.testnet);

// create default devnet
writeDevnets(devnetDefaults.devnet);
