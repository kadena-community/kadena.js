export const createLinkFromMD = (file: string): string => {
  let complete = false;

  return `/${file
    .split('/')
    .reverse()
    .reduce((acc: string[], val: string) => {
      const fileName = val.split('.')[0] as string;
      if (fileName.includes('index') || complete) return acc;
      if (fileName === 'docs') {
        complete = true;
      }
      acc.push(fileName);
      return acc;
    }, [])
    .reverse()
    .join('/')}`;
};
