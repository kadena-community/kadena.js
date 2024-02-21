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
      ...[header[index], ...rows.map((row) => row[index])].map((item) => {
        const splitItem = item.split('\n');
        return Math.max(...splitItem.map((item) => item.length));
      }),
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

  // To support multi-line cells, we need to split the cells into multiple rows
  // and then merge them back together after padding each cell to the correct width.
  // Rows have multiline in public keys
  // Example: ['devnet.yaml', 'w:eWE6XbuT....4:keys-any', 'f303a2e0cd....c4b19a9abc\n2105f2f78c....3bf17f621c', 'keys-all', 'coin']
  // Alias              Account Name             Public Key(s)                                     Predicate Fungible
  // ------------------ ------------------------ ------------------------------------------------- --------- --------
  // devnet.yaml        w:eWE6XbuT....4:keys-any f303a2e0cd....c4b19a9abc                          keys-all  coin
  //                                             2105f2f78c....3bf17f621c
  const maxColumns = Math.max(...rows.map((row) => row.length));

  const body = rows
    .map((row) => {
      const rowStrings = row.map((item, index) => {
        const cell = item.toString().split('\n');
        const columnWidth = columnWidths[index];
        return cell.map((data: string) => data.padEnd(columnWidth));
      });

      const maxRows = Math.max(
        ...rowStrings.map((cellData) => cellData.length),
      );

      //  We need to pad the rows with empty strings to make sure all rows have the same length
      // so that new line data from the same column aligned properly to the header
      const contentRows = [];
      for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const contentRow = [];
        for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
          // If the cell data is undefined, pad it with empty strings
          const cellData =
            rowStrings[colIndex][rowIndex] ??
            ' '.repeat(columnWidths[colIndex]);
          contentRow.push(cellData);
        }
        contentRows.push(contentRow);
      }

      return contentRows;
    })
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
