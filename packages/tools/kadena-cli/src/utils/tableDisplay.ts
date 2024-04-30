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
