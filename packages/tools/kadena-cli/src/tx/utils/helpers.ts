import { TRANSACTION_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';

export async function getAllTransactions(): Promise<string[]> {
  return services.filesystem.readDir(TRANSACTION_DIR);
}
