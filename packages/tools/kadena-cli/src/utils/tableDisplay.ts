export type TableRow = string[];
export type TableHeader = string[];

export function displayTable(
  header: TableHeader,
  rows: TableRow[],
  includeHorizontalSeparator: boolean,
  includeVerticalSeparator: boolean,
): { header: string; separator: string; body: string } {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const columnWidths = header.map((_, index) =>
    Math.max(
      ...[header[index], ...rows.map((row) => row[index])].map(
        (item) => item.length,
      ),
    ),
  );

  const formatRow = (row: TableRow): string =>
    row.length === 0
      ? ''
      : row
          .map((item, index) => String(item).padEnd(columnWidths[index], ' '))
          .join(includeVerticalSeparator ? ' | ' : ' ');

  const headerString = formatRow(header);

  const separator = includeHorizontalSeparator
    ? columnWidths
        .map((width) => '-'.repeat(width))
        .join(includeVerticalSeparator ? '-+-' : ' ')
    : '';

  const body = rows.map(formatRow).join('\n');

  return {
    header: headerString,
    separator,
    body,
  };
}
