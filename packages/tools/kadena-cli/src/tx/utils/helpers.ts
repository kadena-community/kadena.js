import { TRANSACTION_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';

export async function getAllTransactions(): Promise<string[]> {
  return services.filesystem.readDir(TRANSACTION_DIR);
}

/**
 * Formats the current date and time as 'yyyy-MM-dd-HH:mm'.
 * @returns {string} Formatted date and time.
 */
export function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}-${hours}:${minutes}`;
}
