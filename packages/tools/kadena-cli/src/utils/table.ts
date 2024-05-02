import type { TableConstructorOptions, Table as TableType } from 'cli-table3';
import Table from 'cli-table3';
import { log } from './logger.js';

export const TABLE_DEFAULT: TableConstructorOptions = {
  chars: {
    top: '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    bottom: '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    left: '',
    'left-mid': '',
    mid: '',
    'mid-mid': '',
    right: '',
    'right-mid': '',
    middle: ' ',
  },
  style: {
    'padding-left': 0,
    'padding-right': 0,
    head: [],
    border: [],
  },
};

export const createTable = (options: TableConstructorOptions): TableType => {
  return new Table({
    ...TABLE_DEFAULT,
    // Prefer using our own log colors to maintain full control over enable/disable colors
    head: options.head?.map((value) => log.color.green(value)),
  });
};
