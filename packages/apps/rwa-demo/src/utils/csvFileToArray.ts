export const csvFileToArray = <T>(string: string): T[] => {
  const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
  const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

  const array = csvRows.map((i) => {
    const values = i.split(',');
    const obj = csvHeader.reduce<T>((object, header, index) => {
      const tempObject: any = object;
      tempObject[header.trim()] = values[index];
      return tempObject as T;
    }, {} as T);
    return obj;
  });

  return array;
};
