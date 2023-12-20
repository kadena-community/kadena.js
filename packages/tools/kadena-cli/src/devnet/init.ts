import { devnetDefaults } from '../constants/devnets.js';
import { writeDevnet } from './utils/devnetHelpers.js';

await writeDevnet(devnetDefaults.devnet);
