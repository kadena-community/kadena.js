import { dotenv } from '@utils/dotenv';
import fs from 'fs';
import path from 'path';

export interface IFileData {
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  requestKey: string;
  type: TransferType;
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

export function createDir(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

export function createFile(filename: string): string {
  const exampleData: IFileData = {
    timestamp: 0,
    from: '',
    to: '',
    amount: 0,
    requestKey: '',
    type: undefined,
  };
  const directory = path.join(__dirname, `${dotenv.SIMULATE_LOG_FOLDER_NAME}/`);
  createDir(directory);
  const filepath = path.join(directory, filename);
  const headers = `${Object.keys(exampleData).join(',')}\n`;
  fs.writeFileSync(filepath, headers);
  return filepath;
}

export function appendToFile(
  filepath: string,
  data: IFileData | IFileError,
): void {
  const dataString = Object.values(data).join(',');
  fs.appendFileSync(filepath, `${dataString}\n`);
}
