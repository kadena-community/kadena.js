export const isMarkDownFile = (name: string): boolean => {
  const extension = name.split('.').at(-1);
  return (
    extension?.toLowerCase() === 'md' || extension?.toLowerCase() === 'mdx'
  );
};
