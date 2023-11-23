import { ensureNetworksConfiguration } from './utils/networkHelpers.js';

async function initNetworks(): Promise<void> {
  try {
    await ensureNetworksConfiguration();
  } catch (error) {
    console.error(
      'An error occurred during network configuration initialization:',
      error,
    );
    process.exit(1);
  }
}

await initNetworks();
