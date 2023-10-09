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

export type TransferType = 'fund' | 'transfer' | 'xchaintransfer' | undefined;

export function createFile(filename: string): string {
  const exampleData: IFileData = {
    timestamp: 0,
    from: '',
    to: '',
    amount: 0,
    requestKey: '',
    type: undefined,
  };
  const filepath = path.join(__dirname, 'logs/', filename);
  const headers = `${Object.keys(exampleData).join(',')}\n`;
  fs.writeFileSync(filepath, headers);
  return filepath;
}

export function appendToFile(filepath: string, data: IFileData): void {
  const dataString = Object.values(data).join(',');
  fs.appendFileSync(filepath, `${dataString}\n`);
}
