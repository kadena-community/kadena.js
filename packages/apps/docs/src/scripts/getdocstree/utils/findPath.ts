export const findPath = (dir: string): string | undefined => {
  const [, ...dirArray] = dir.split('/');
  const file = dirArray.pop();
  const path = dirArray.splice(2, dir.length - 1).join('/');

  const fileName = file?.split('.').at(0);
  if (fileName === 'index') return;
  if (!path) return `/${fileName}`;
  return `/${path}/${fileName}`;
};
