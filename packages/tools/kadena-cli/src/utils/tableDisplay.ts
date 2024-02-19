export type TableRow = string[];
export type TableHeader = string[];

export function displayTable(
  header: TableHeader,
  rows: TableRow[],
): { header: string; seperator: string; body: string } {
  const columnWidths = header.map((_, index) =>
    Math.max(
      ...[header[index], ...rows.map((row) => row[index])].map(
        (item) => item.length,
      ),
    ),
  );

  const formatRow = (row: TableRow): string =>
    row.map((item, index) => item.padEnd(columnWidths[index], ' ')).join(' | ');

  const headerString = formatRow(header);

  const seperator = columnWidths.map((width) => '-'.repeat(width)).join('-+-');

  const body = rows.map(formatRow).join('\n');

  return {
    header: headerString,
    seperator,
    body: body,
  };
}
