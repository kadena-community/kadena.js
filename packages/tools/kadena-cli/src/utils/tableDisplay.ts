export type TableRow = string[];
export type TableHeader = string[];

// Aligns each cell in the row with equal padding
// Splits the cell data into multiple rows if it contains newlines
const createRowStrings = (row: TableRow, columnWidths: number[]): string[][] =>
  row.map((item, index) => {
    const cell = item.toString().split('\n');
    const columnWidth = columnWidths[index];
    return cell.map((data) => data.padEnd(columnWidth));
  });

// Merge the cell data from each row into a single row of strings
// Ensure that the next cell data is aligned properly with the header
// when the cell data is split into multiple rows
// Example: [[...firstRowData], [ '    ', '    ', '096255ee23....e8bc602be0', ' ','        ']]
const createContentRows = (
  rowStrings: string[][],
  maxRows: number,
  maxColumnsInRows: number,
  columnWidths: number[],
): string[][] => {
  const contentRows = [];
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const contentRow = [];
    for (let colIndex = 0; colIndex < maxColumnsInRows; colIndex++) {
      const cellData =
        rowStrings[colIndex]?.[rowIndex] || ' '.repeat(columnWidths[colIndex]);
      contentRow.push(cellData);
    }
    contentRows.push(contentRow);
  }
  return contentRows;
};

const getMaxRows = (rowStrings: string[][]): number =>
  Math.max(...rowStrings.map((cellData) => cellData.length));

const getMaxColumnsInRows = (rows: TableRow[]): number =>
  Math.max(...rows.map((row) => row.length));

// To support multi-line cells, we split the cells into multiple rows and
// merge them again
// Example: ['devnet.yaml', 'w:eWE6XbuT....4:keys-any', 'f303a2e0cd....c4b19a9abc\n2105f2f78c....3bf17f621c', 'keys-all', 'coin']
// Alias              Account Name             Public Key(s)                                     Predicate Fungible
// ------------------ ------------------------ ------------------------------------------------- --------- --------
// devnet.yaml        w:eWE6XbuT....4:keys-any f303a2e0cd....c4b19a9abc                          keys-all  coin
//                                             2105f2f78c....3bf17f621c
const formatRow = (
  row: TableRow,
  maxColumnsInRows: number,
  columnWidths: number[],
): string[][] => {
  const rowStrings = createRowStrings(row, columnWidths);
  const maxRows = getMaxRows(rowStrings);
  return createContentRows(rowStrings, maxRows, maxColumnsInRows, columnWidths);
};

const getColumnWidths = (header: TableHeader, rows: TableRow[]): number[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const columnWidths = header.map((_, index) =>
    Math.max(
      ...[header[index], ...rows.map((row) => row.at(index))].map((item) => {
        const splitItem = (item ?? '').split('\n');
        return Math.max(...splitItem.map((item) => item.length));
      }),
    ),
  );
  return columnWidths;
};

const formatHeaderRow = (
  row: TableRow,
  columnWidths: number[],
  includeVerticalSeparator: boolean,
): string =>
  row.length === 0
    ? ''
    : row
        .map((item, index) => String(item).padEnd(columnWidths[index], ' '))
        .join(includeVerticalSeparator ? ' | ' : ' ');

export function displayTable(
  header: TableHeader,
  rows: TableRow[],
  includeHorizontalSeparator: boolean,
  includeVerticalSeparator: boolean,
): { header: string; separator: string; body: string } {
  const columnWidths = getColumnWidths(header, rows);

  const headerString = formatHeaderRow(
    header,
    columnWidths,
    includeVerticalSeparator,
  );

  const separator = includeHorizontalSeparator
    ? columnWidths
        .map((width) => '-'.repeat(width))
        .join(includeVerticalSeparator ? '-+-' : ' ')
    : '';

  const maxColumnsInRows = getMaxColumnsInRows(rows);

  const body = rows
    .map((row) => formatRow(row, maxColumnsInRows, columnWidths))
    .reduce((acc, val) => acc.concat(val), []);

  const bodyString = body
    .map((row) => row.join(includeVerticalSeparator ? ' | ' : ' '))
    .join('\n');

  return {
    header: headerString,
    separator,
    body: bodyString,
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
      name: x.name.map((name, i) => name.padEnd(columnLengths[i])).join(' '),
      value: x.value,
    };
  });
};
