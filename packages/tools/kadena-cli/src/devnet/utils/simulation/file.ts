import fs from 'fs';
import path from 'path';
import { simulationDefaults } from '../../../constants/devnets.js';

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

export function createDir(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

export function createFile(folder: string, filename: string): string {
  const exampleData: IFileData = {
    timestamp: 0,
    from: '',
    to: '',
    amount: 0,
    requestKey: '',
    action: undefined,
  };
  const directory = path.join(`${folder}/`);
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
