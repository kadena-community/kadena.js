export const getNextAvailableIndex = (indexes: number[]) => {
  const sorted = indexes.sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i) {
      return i;
    }
  }
  return sorted.length;
};
