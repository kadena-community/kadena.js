import fs from 'fs';
import type { ParseResult } from 'papaparse';
import { parse } from 'papaparse';
import path from 'path';
import { devnetConfig } from '../config';

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
  | 'xchaintransfer'
  | 'safe-transfer'
  | undefined;

export function createDir(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

export function cleanDir(directory: string): void {
  const file = path.join(directory, 'testdata.csv');
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
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
  const directory = path.join(__dirname, `${devnetConfig.LOG_FOLDERNAME}/`);
  createDir(directory);
  cleanDir(directory);
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

export interface ITestData {
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  requestKey: string;
  type: string;
}

export function parseLogs() {
  const pathToFile = path.join(
    __dirname,
    `${devnetConfig.LOG_FOLDERNAME}/testdata.csv`,
  );
  const file = fs.readFileSync(pathToFile, 'utf8');
  const parsedResult = parse(file, {
    header: true,
    complete: function (results: ParseResult<ITestData>) {
      return results;
    },
  });
  return parsedResult.data;
}
