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

export const tableFormatPrompt = (
  choices: { name: string[]; value: string }[],
): { name: string; value: string }[] => {
  const columnLengths = choices.reduce((acc, row) => {
    row.name.forEach((column, i) => {
      if (acc[i] === undefined) acc[i] = 0;
      if (column.length > acc[i]) acc[i] = column.length;
    });
    return acc;
  }, [] as number[]);
  return choices.map((x) => {
    return {
      name: x.name.map((name, i) => name.padEnd(columnLengths[i])).join('  '),
      value: x.value,
    };
  });
};
