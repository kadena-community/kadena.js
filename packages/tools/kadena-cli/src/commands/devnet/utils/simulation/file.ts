import path from 'path';
import { services } from '../../../../services/index.js';

export interface IFileData {
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  requestKey: string;
  action: TransferType | TokenActionType;
}

export interface IFileError {
  error: string;
}

export type TransferType =
  | 'fund'
  | 'transfer'
  | 'cross-chain-transfer'
  | 'safe-transfer'
  | undefined;

export type TokenActionType = 'create' | 'mint' | 'transfer' | undefined;

export async function createDir(directory: string): Promise<void> {
  await services.filesystem.ensureDirectoryExists(directory);
}

export async function createLogFile(
  folder: string,
  filename: string,
): Promise<string> {
  const exampleData: IFileData = {
    timestamp: 0,
    from: '',
    to: '',
    amount: 0,
    requestKey: '',
    action: undefined,
  };
  const directory = path.join(`${folder}/`);
  await createDir(directory);
  const filepath = path.join(directory, filename);
  const headers = `${Object.keys(exampleData).join(',')}\n`;
  await services.filesystem.writeFile(filepath, headers);
  return filepath;
}

export async function appendToLogFile(
  filepath: string,
  data: IFileData | IFileError,
): Promise<void> {
  const dataString = Object.values(data).join(',');
  await services.filesystem.appendFile(filepath, `${dataString}\n`);
}
