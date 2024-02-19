import { log } from '../utils/logger.js';
import { ensureNetworksConfiguration } from './utils/networkHelpers.js';

async function initNetworks(): Promise<void> {
  try {
    await ensureNetworksConfiguration();
  } catch (error) {
    log.error(
      'An error occurred during network configuration initialization:',
      error,
    );
    process.exit(1);
  }
}

await initNetworks();
