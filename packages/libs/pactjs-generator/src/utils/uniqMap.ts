export const uniqMap = <TIn = unknown, TOut = unknown, TId = unknown>(
  array: TIn[],
  fn: (element: TIn, index: number, array: TIn[]) => TOut,
  identifierFn: (element: TIn, index: number, array: TIn[]) => TId = (el) =>
    el as unknown as TId,
): TOut[] => {
  const iteraterFn = (array: TIn[]): TOut[] => {
    const elements: TId[] = [];
    const mappedElements: TOut[] = [];
    const createIterator = (
      idFn: typeof identifierFn,
    ): ((element: TIn, index: number, array: TIn[]) => void) => {
      return (element: TIn, index: number, array) => {
        const id = idFn(element, index, array);
        if (!elements.includes(id)) {
          elements.push(id);
          mappedElements.push(fn(element, index, array));
        }
      };
    };
    const iterator = createIterator(identifierFn);
    array.map(iterator);
    return mappedElements;
  };
  return iteraterFn(array);
};
