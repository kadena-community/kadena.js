import { log } from './logger.js';

export type TableRow = string[];
export type TableHeader = string[];

export function displayTable(header: TableHeader, rows: TableRow[]): void {
  // Determine the maximum width of each column
  const columnWidths = header.map((_, index) =>
    Math.max(
      ...[header[index], ...rows.map((row) => row[index])].map(
        (item) => item.length,
      ),
    ),
  );

  const formatRow = (row: TableRow): string =>
    row.map((item, index) => item.padEnd(columnWidths[index], ' ')).join(' | ');

  log.info(log.color.green(formatRow(header)));

  log.info(
    log.color.green(columnWidths.map((width) => '-'.repeat(width)).join('-+-')),
  );

  rows.forEach((row) => {
    log.info(formatRow(row));
  });
}
